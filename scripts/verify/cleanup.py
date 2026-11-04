"""Process registry with guaranteed teardown — the verify 'trap'.

Every subprocess verify starts is registered here; normal exit, a failing step
or SIGINT/SIGTERM/SIGHUP all funnel into cleanup(), which terminates whole
process groups and SIGKILLs stragglers after a 3 s grace window. cleanup() is
idempotent and leaves no processes, ports or file handles behind.
"""
from __future__ import annotations

import os
import signal
import subprocess
import time


class ProcessRegistry:
    def __init__(self):
        self._procs: set = set()
        self._closed = False

    def register(self, proc) -> None:
        if not self._closed:
            self._procs.add(proc)

    def unregister(self, proc) -> None:
        self._procs.discard(proc)

    @property
    def active_count(self) -> int:
        return sum(1 for p in self._procs if p.poll() is None)

    def run(self, cmd, cwd=None, timeout=None, env_extra=None) -> subprocess.CompletedProcess:
        """subprocess.run wrapper that guarantees teardown of the child.

        The child gets its own process group (start_new_session) so cleanup()
        can kill a whole tree, not just the direct child. A directly-registered
        child never shares our process group, but the pgid guard stays: killpg
        on our own pgid would kill verify itself.
        """
        import sys
        env = os.environ.copy()
        if env_extra:
            env.update({k: str(v) for k, v in env_extra.items()})
        try:
            p = subprocess.Popen(
                cmd, cwd=str(cwd) if cwd else None, env=env,
                stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
                start_new_session=True,
            )
        except FileNotFoundError as e:
            return subprocess.CompletedProcess(cmd, 127, "", f"command not found: {e}")
        except PermissionError as e:
            return subprocess.CompletedProcess(cmd, 126, "", f"permission denied: {e}")
        self.register(p)
        try:
            out, err = p.communicate(timeout=timeout)
            return subprocess.CompletedProcess(cmd, p.returncode, out, err)
        except subprocess.TimeoutExpired:
            # Kill the whole process group (the child owns its session via
            # start_new_session), never our own group; then drain the pipes
            # with a bounded wait so no grandchild or handle survives.
            own_pgid = os.getpgid(0)
            try:
                pgid = os.getpgid(p.pid)
                if pgid != own_pgid:
                    os.killpg(pgid, signal.SIGKILL)
                else:
                    p.kill()
            except (ProcessLookupError, PermissionError):
                p.kill()
            try:
                out, err = p.communicate(timeout=10)
            except subprocess.TimeoutExpired:
                out, err = "", "[verify] pipes did not drain after group kill"
            return subprocess.CompletedProcess(
                cmd, p.returncode, out,
                (err or "") + f"\n[verify] step timed out after {timeout}s, process group killed")
        finally:
            self.unregister(p)

    def cleanup(self, signum=None, frame=None) -> None:
        if self._closed and not self._procs:
            return
        own_pgid = os.getpgid(0)
        for p in list(self._procs):
            if p.poll() is None:
                try:
                    pgid = os.getpgid(p.pid)
                    if pgid != own_pgid:
                        os.killpg(pgid, signal.SIGTERM)
                    else:
                        p.terminate()  # never kill our own process group
                except (ProcessLookupError, PermissionError):
                    try:
                        p.terminate()
                    except ProcessLookupError:
                        pass
        deadline = time.time() + 3
        for p in list(self._procs):
            if p.poll() is None:
                try:
                    p.wait(timeout=max(0.1, deadline - time.time()))
                except subprocess.TimeoutExpired:
                    pass
        for p in list(self._procs):
            if p.poll() is None:
                try:
                    pgid = os.getpgid(p.pid)
                    if pgid != own_pgid:
                        os.killpg(pgid, signal.SIGKILL)
                    else:
                        p.kill()
                except (ProcessLookupError, PermissionError):
                    pass
        self._procs.clear()
        self._closed = True