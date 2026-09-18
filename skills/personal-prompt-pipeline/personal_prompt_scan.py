#!/usr/bin/env python3
"""
Personal prompt mailbox scanner voor Gmail (fvb320@gmail.com).

Modes:
  (default)              Digest: deterministische pending-telling (voor cron monitor).
  --json                 Quarantaine van auth-failures, daarna pending prompts als JSON.
  --mark-processed ID    Label processed_prompts + uit INBOX halen.
  --mark-suspicious ID --reason "..."   Label suspicious + uit INBOX halen.
  --reply ID --body-file FILE           Plaintext reply naar afzender, in de thread.
  --inspect ID           Debug: geparsede velden van een willekeurige mail.

Multi-turn: replies van Filip (allowlist-adres, bezitsbewijs) in
prompt-threads zijn zelf nieuwe prompts; de JSON bevat dan de volledige
thread-context. Gevaarlijke acties worden door de agent geweigerd
(beslist in de cron-run, niet hier) — er is geen bevestigingsroute.

Audit log: ~/.hermes/state/personal_prompts_log.jsonl
"""

import argparse
import base64
import email
import html as html_lib
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from email.header import decode_header, make_header
from email.mime.text import MIMEText
from email.utils import parseaddr
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

TOKEN_PATH = Path.home() / ".hermes" / "google_token.json"
STATE_DIR = Path.home() / ".hermes" / "state"
LOG_PATH = STATE_DIR / "personal_prompts_log.jsonl"
MONITOR_STATE_PATH = STATE_DIR / "personal_prompts_monitor_state.json"
SESSION_MAP_PATH = STATE_DIR / "personal_prompts_sessions.json"

ALLOWED_SENDERS = {
    "you@example.com",       # jouw adres 1 (vervang)
    "you@yourdomain.tld",    # jouw adres 2 (vervang)
    "you@work.example.com",  # jouw adres 3 (vervang)
}

QUERY = (
    '{subject:"personal prompt" subject:"personal prompts"} '
    "-label:processed_prompts -label:suspicious "
    "from:(you@example.com OR you@yourdomain.tld "
    "OR you@work.example.com)"
)

LABEL_PROCESSED = "processed_prompts"
LABEL_SUSPICIOUS = "suspicious"
LABEL_AWAITING = "awaiting_confirmation"  # legacy; wordt bij mark-processed ook weggehaald
MAX_PENDING = 15
BODY_LIMIT = 50000
CONTEXT_BODY_LIMIT = 4000
CONTEXT_MAX_MESSAGES = 30
SCANNER_HEADER = "X-Hermes-Auto"


def get_service():
    t = json.loads(TOKEN_PATH.read_text())
    creds = Credentials(
        token=t.get("token"),
        refresh_token=t.get("refresh_token"),
        token_uri=t.get("token_uri"),
        client_id=t.get("client_id"),
        client_secret=t.get("client_secret"),
        scopes=t.get("scopes"),
    )
    if not creds.token or creds.expired:
        creds.refresh(Request())
        TOKEN_PATH.write_text(
            json.dumps(
                {
                    "token": creds.token,
                    "refresh_token": creds.refresh_token,
                    "token_uri": creds.token_uri,
                    "client_id": creds.client_id,
                    "client_secret": creds.client_secret,
                    "scopes": creds.scopes,
                },
                indent=2,
            )
        )
    return build("gmail", "v1", credentials=creds, cache_discovery=False)


def log_event(event: dict):
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    event["ts"] = datetime.now(timezone.utc).isoformat()
    with LOG_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")


def load_session_map() -> dict:
    try:
        return json.loads(SESSION_MAP_PATH.read_text())
    except Exception:
        return {}


def save_session_map(state: dict):
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    SESSION_MAP_PATH.write_text(json.dumps(state, indent=2, ensure_ascii=False))


def mode_session_lookup(thread_id: str):
    """Print de sessie-info voor een mail-thread (JSON) of null."""
    state = load_session_map()
    info = state.get(thread_id)
    print(json.dumps(info if info else None, ensure_ascii=False))


def mode_session_register(service, thread_id: str, name: str):
    """Registreer/actualiseer de sessie voor een mail-thread. Maakt de
    sessie aan als die nog niet bestaat (hermes -z met betekenisvolle
    naam als titel), en slaat de mapping op. Output: JSON met
    session_id en name."""
    state = load_session_map()
    existing = state.get(thread_id)

    if existing and existing.get("session_id"):
        print(json.dumps({"ok": True, **existing}, ensure_ascii=False))
        return

    safe_name = re.sub(r"[\r\n]+", " ", (name or "").strip())[:80] or "Personal prompt"
    result = subprocess.run(
        ["timeout", "300", "hermes", "-z",
         f"Initialiseer deze sessie voor de mail-conversatie: {safe_name}. Antwoord alleen met: geinitialiseerd",
         "--yolo"],
        capture_output=True, text=True, timeout=320,
    )
    if result.returncode != 0:
        print(json.dumps({"ok": False, "error": f"hermes -z faalde: {result.stderr[:200]}"}, ensure_ascii=False))
        return
    ls = subprocess.run(
        ["hermes", "sessions", "list", "--limit", "3"],
        capture_output=True, text=True, timeout=60,
    )
    new_id = None
    for line in ls.stdout.splitlines():
        m = re.search(r"([0-9]{8}_[0-9]{6}_[0-9a-f]+)\s*$", line.strip())
        if m:
            new_id = m.group(1)
            break
    if not new_id:
        print(json.dumps({"ok": False, "error": "sessie-id niet gevonden in sessions list"}, ensure_ascii=False))
        return
    state[thread_id] = {"session_id": new_id, "name": safe_name}
    save_session_map(state)
    log_event({"event": "session_created", "thread_id": thread_id, "session_id": new_id, "name": safe_name})
    print(json.dumps({"ok": True, "session_id": new_id, "name": safe_name}, ensure_ascii=False))


def mode_session_rename(thread_id: str, name: str):
    """Hernoem de sessie van een thread naar een betere naam."""
    state = load_session_map()
    info = state.get(thread_id)
    if not info or not info.get("session_id"):
        print(json.dumps({"ok": False, "error": "geen sessie geregistreerd voor deze thread"}, ensure_ascii=False))
        return
    safe_name = (name or "").strip()
    if not safe_name:
        print(json.dumps({"ok": False, "error": "lege naam"}, ensure_ascii=False))
        return
    r = subprocess.run(
        ["hermes", "sessions", "rename", info["session_id"], safe_name[:120]],
        capture_output=True, text=True, timeout=60,
    )
    if r.returncode != 0:
        print(json.dumps({"ok": False, "error": f"rename faalde: {r.stderr[:200]}"}, ensure_ascii=False))
        return
    state[thread_id]["name"] = safe_name
    save_session_map(state)
    log_event({"event": "session_renamed", "thread_id": thread_id, "session_id": info["session_id"], "name": safe_name})
    print(json.dumps({"ok": True, "session_id": info["session_id"], "name": safe_name}, ensure_ascii=False))


def scanner_reply_ids() -> set:
    """Reply-message-ids die de scanner zelf ooit verstuurd heeft (uit
    het auditlog), zodat eigen replies nooit als nieuwe prompt van
    Filip worden gezien."""
    ids = set()
    try:
        with LOG_PATH.open("r", encoding="utf-8") as f:
            for line in f:
                try:
                    e = json.loads(line)
                except Exception:
                    continue
                rid = e.get("reply_id")
                if rid:
                    ids.add(rid)
    except FileNotFoundError:
        pass
    return ids


def decode_hdr(value) -> str:
    if not value:
        return ""
    try:
        return str(make_header(decode_header(value)))
    except Exception:
        return str(value)


def strip_html(raw: str) -> str:
    raw = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", raw, flags=re.S | re.I)
    raw = re.sub(r"<br\s*/?>", "\n", raw, flags=re.I)
    raw = re.sub(r"</p>", "\n\n", raw, flags=re.I)
    raw = re.sub(r"<[^>]+>", " ", raw)
    raw = html_lib.unescape(raw)
    raw = raw.replace("\r\n", "\n").replace("\r", "\n")
    raw = re.sub(r"[ \t]+", " ", raw)
    raw = re.sub(r"\n{3,}", "\n\n", raw)
    return raw.strip()


def extract_body(msg) -> str:
    plain = None
    html = None

    parts = msg.walk() if msg.is_multipart() else [msg]
    for part in parts:
        if part.get_filename():
            continue
        ctype = part.get_content_type()
        if ctype == "text/plain" and plain is None:
            plain = part.get_payload(decode=True)
        elif ctype == "text/html" and html is None:
            html = part.get_payload(decode=True)

    raw_bytes = plain if plain is not None else html
    if raw_bytes is None:
        return ""
    charset = msg.get_content_charset() or "utf-8"
    try:
        text = raw_bytes.decode(charset, errors="replace")
    except LookupError:
        text = raw_bytes.decode("utf-8", errors="replace")
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    if plain is None:
        text = strip_html(text)
    return text


def parse_auth(auth_header: str) -> dict:
    res = {"header": auth_header}
    m = re.search(r"\bspf=(\w+)", auth_header, re.I)
    res["spf"] = m.group(1).lower() if m else None
    m = re.search(r"\bdkim=(\w+)", auth_header, re.I)
    res["dkim"] = m.group(1).lower() if m else None
    m = re.search(r"\bdmarc=(\w+)", auth_header, re.I)
    res["dmarc"] = m.group(1).lower() if m else None
    return res


def auth_ok(auth: dict, received_chain: str, labels: list) -> tuple:
    """Geeft (ok, reden). Streng: twijfel = fail.

    Trusted-source excepties voor mails zonder Authentication-Results
    (die passeren geen inkomende mailserver): verstuurd via Gmail's
    eigen infrastructuur (gmailapi.google.com / smtp.gmail.com in
    Received) óf verzonden vanuit dit Gmail-account zelf (SENT-label:
    Google zet dat alléén op mails die via dit account verstuurd zijn
    — een gespoofde binnenkomende mail krijgt het nooit). OAuth-toegang
    vereist Filip's token, dus sterker dan SPF/DKIM.
    """
    if not auth.get("header"):
        if received_chain and any(
            host in received_chain for host in ("gmailapi.google.com", "smtp.gmail.com")
        ):
            return True, ""
        if "SENT" in (labels or []):
            return True, ""
        return False, "geen Authentication-Results header"
    spf, dkim, dmarc = auth.get("spf"), auth.get("dkim"), auth.get("dmarc")
    if spf != "pass":
        return False, (f"spf={spf}" if spf else "spf-resultaat ontbreekt")
    if dkim and dkim not in ("pass", "none"):
        return False, f"dkim={dkim}"
    if dmarc and dmarc not in ("pass", "none"):
        return False, f"dmarc={dmarc}"
    return True, ""


def label_id_by_name(service, name: str):
    labels = service.users().labels().list(userId="me").execute()
    for lab in labels.get("labels", []):
        if lab["name"] == name:
            return lab["id"]
    return None


def fetch_raw(service, msg_id: str):
    full = (
        service.users()
        .messages()
        .get(userId="me", id=msg_id, format="raw")
        .execute()
    )
    raw_bytes = base64.urlsafe_b64decode(full["raw"])
    msg = email.message_from_bytes(raw_bytes)
    return full, msg


def _meta_headers(m) -> dict:
    return {h["name"].lower(): h["value"] for h in m.get("payload", {}).get("headers", [])}


def candidates(service):
    """Return (prompt_ids, reply_ids, skipped) oudste eerst.

    - SPAM: skip.
    - Scanner-eigen replies (X-Hermes-Auto header of id in auditlog): skip.
    - Subject "Re:" + afzender in allowlist: multi-turn reply → nieuwe
      prompt (definitieve auth-check gebeurt in --json via raw fetch).
    - SENT zonder INBOX (verzonden post niet in inbox): skip.
    """
    res = (
        service.users()
        .messages()
        .list(userId="me", q=QUERY, maxResults=MAX_PENDING)
        .execute()
    )
    msgs = res.get("messages", [])
    own_replies = scanner_reply_ids()
    prompts, replies, skipped = [], [], []
    for meta in reversed(msgs):  # oudste eerst
        mid = meta["id"]
        m = (
            service.users()
            .messages()
            .get(userId="me", id=mid, format="metadata")
            .execute()
        )
        labels = m.get("labelIds", [])
        hdrs = _meta_headers(m)
        subj = decode_hdr(hdrs.get("subject", ""))
        from_addr = parseaddr(decode_hdr(hdrs.get("from", "")))[1].lower()
        if "SPAM" in labels:
            skipped.append({"id": mid, "reason": "in spam"})
            continue
        if "DRAFT" in labels:
            skipped.append({"id": mid, "reason": "draft (niet verzonden)"})
            continue
        if mid in own_replies or hdrs.get("x-hermes-auto"):
            skipped.append({"id": mid, "reason": "scanner-eigen reply"})
            continue
        if subj.strip().lower().startswith("re:"):
            if from_addr in ALLOWED_SENDERS:
                replies.append(mid)
            else:
                skipped.append({"id": mid, "reason": "reply van niet-allowlist afzender"})
            continue
        if "SENT" in labels and "INBOX" not in labels:
            skipped.append({"id": mid, "reason": "verzonden zonder inbox-label"})
            continue
        prompts.append(mid)
    return prompts, replies, skipped


def thread_context(service, rec: dict) -> list:
    """Eerdere berichten in de thread van een reply-prompt, oudste
    eerst (volledige conversatie voor contextbehoud).

    threads().get ondersteunt geen format=raw; we halen de thread op
    met metadata en elke mail apart met format=raw.
    """
    thread_id = rec.get("thread_id", "")
    if not thread_id:
        return []
    reply_ts = int(rec.get("internal_date", 0) or 0)
    try:
        thread = (
            service.users()
            .threads()
            .get(userId="me", id=thread_id, format="metadata")
            .execute()
        )
    except Exception:
        return []
    out = []
    for m in thread.get("messages", []):
        ts = int(m.get("internalDate", "0") or 0)
        if ts >= reply_ts:
            continue
        try:
            _, msg = fetch_raw(service, m["id"])
        except Exception:
            continue
        body = extract_body(msg)
        if len(body) > CONTEXT_BODY_LIMIT:
            body = body[:CONTEXT_BODY_LIMIT] + "\n[...]"
        out.append(
            {
                "from": decode_hdr(msg.get("From", "")),
                "subject": decode_hdr(msg.get("Subject", "")),
                "date": decode_hdr(msg.get("Date", "")),
                "scanner_generated": bool(msg.get(SCANNER_HEADER)),
                "body": body,
            }
        )
    return out[:CONTEXT_MAX_MESSAGES]


def msg_record(full, msg) -> dict:
    from_hdr = decode_hdr(msg.get("From", ""))
    subj = decode_hdr(msg.get("Subject", ""))
    auth = parse_auth(msg.get("Authentication-Results", ""))
    received_chain = "\n".join(msg.get_all("Received", []) or [])
    body = extract_body(msg)
    truncated = False
    if len(body) > BODY_LIMIT:
        body = body[:BODY_LIMIT] + "\n[... afgekapt door scanner ...]"
        truncated = True
    return {
        "id": full["id"],
        "thread_id": full.get("threadId", ""),
        "internal_date": full.get("internalDate", "0"),
        "from_display": from_hdr,
        "from_addr": parseaddr(from_hdr)[1].lower(),
        "subject": subj,
        "date": decode_hdr(msg.get("Date", "")),
        "message_id_header": msg.get("Message-ID", ""),
        "labels": full.get("labelIds", []),
        "auth": auth,
        "received_chain": received_chain,
        "size_bytes": len(full["raw"]),
        "body": body,
        "body_truncated": truncated,
    }


def move_to(service, msg_id: str, label_name: str, also_remove: list | None = None):
    lid = label_id_by_name(service, label_name)
    if not lid:
        print(f"FOUT: label '{label_name}' bestaat niet in Gmail", file=sys.stderr)
        sys.exit(1)
    remove = ["INBOX"] + (also_remove or [])
    res = (
        service.users()
        .messages()
        .modify(userId="me", id=msg_id, body={"addLabelIds": [lid], "removeLabelIds": remove})
        .execute()
    )
    return res


def mode_digest(service):
    """Output voor de cron-monitor.

    'stuck' telt hoe vaak dezelfde pending-set al gezien is: als een
    agent-run faalt blijft de output niet identiek (stuck stijgt), dus
    wordt er elke tick opnieuw geprobeerd in plaats van overgeslagen.
    """
    prompts, replies, _ = candidates(service)
    all_pending = prompts + replies
    state = {"last": [], "stuck": 0}
    try:
        state = json.loads(MONITOR_STATE_PATH.read_text())
    except Exception:
        pass
    last = state.get("last", [])
    stuck = state.get("stuck", 0) + 1 if all_pending and all_pending == last else 0
    if os.environ.get("PP_MONITOR_DIGEST") == "1":
        # Alleen de cron-monitor tikt de state bij; handmatige runs
        # zijn pure reads (vervuilen de stuck-teller niet).
        STATE_DIR.mkdir(parents=True, exist_ok=True)
        MONITOR_STATE_PATH.write_text(json.dumps({"last": all_pending, "stuck": stuck}))
    if all_pending:
        print(f"pending={len(all_pending)} stuck={stuck} ids={','.join(all_pending)}")
    else:
        print("pending=0")


def mode_json(service):
    prompts, replies, skipped = candidates(service)
    pending, quarantined = [], []

    def auth_gate(mid, rec):
        if rec["from_addr"] not in ALLOWED_SENDERS:
            move_to(service, mid, LABEL_SUSPICIOUS)
            reason = f"afzender niet in allowlist: {rec['from_addr']}"
            quarantined.append({"id": mid, "reason": reason})
            log_event({"event": "quarantine", "id": mid, "reason": reason})
            return False
        ok, reason = auth_ok(
            rec["auth"], rec.get("received_chain", ""), rec.get("labels", [])
        )
        if not ok:
            move_to(service, mid, LABEL_SUSPICIOUS)
            reason = f"authenticatiecheck gefaald: {reason}"
            quarantined.append({"id": mid, "reason": reason})
            log_event({"event": "quarantine", "id": mid, "reason": reason})
            return False
        return True

    for mid in prompts:
        full, msg = fetch_raw(service, mid)
        rec = msg_record(full, msg)
        if not auth_gate(mid, rec):
            continue
        rec["is_reply"] = False
        rec["session"] = load_session_map().get(rec["thread_id"])
        pending.append(rec)

    for mid in replies:
        full, msg = fetch_raw(service, mid)
        rec = msg_record(full, msg)
        if not auth_gate(mid, rec):
            continue
        rec["is_reply"] = True
        rec["context"] = thread_context(service, rec)
        rec["session"] = load_session_map().get(rec["thread_id"])
        pending.append(rec)

    print(
        json.dumps(
            {
                "pending": pending,
                "quarantined": quarantined,
                "skipped": skipped,
            },
            indent=2,
            ensure_ascii=False,
        )
    )


def mode_mark_processed(service, msg_id):
    legacy = label_id_by_name(service, LABEL_AWAITING)
    remove = [legacy] if legacy else []
    res = move_to(service, msg_id, LABEL_PROCESSED, also_remove=remove)
    log_event({"event": "processed", "id": msg_id})
    print(json.dumps({"ok": True, "id": msg_id, "labels": res.get("labelIds", [])}))


def mode_mark_suspicious(service, msg_id, reason):
    legacy = label_id_by_name(service, LABEL_AWAITING)
    remove = [legacy] if legacy else []
    res = move_to(service, msg_id, LABEL_SUSPICIOUS, also_remove=remove)
    log_event({"event": "suspicious", "id": msg_id, "reason": reason})
    print(json.dumps({"ok": True, "id": msg_id, "reason": reason, "labels": res.get("labelIds", [])}))


def mode_reply(service, msg_id, body_file):
    body = Path(body_file).read_text(encoding="utf-8")
    full, msg = fetch_raw(service, msg_id)
    from_hdr = decode_hdr(msg.get("From", ""))
    subject = decode_hdr(msg.get("Subject", ""))
    if not subject.lower().startswith("re:"):
        subject = f"Re: {subject}"
    m = MIMEText(body)
    m["To"] = from_hdr
    m["Subject"] = subject
    m[SCANNER_HEADER] = "personal-prompt-scanner"
    mid_hdr = msg.get("Message-ID", "")
    if mid_hdr:
        m["In-Reply-To"] = " ".join(mid_hdr.split())
        m["References"] = " ".join(mid_hdr.split())
    raw = base64.urlsafe_b64encode(m.as_bytes()).decode()
    result = (
        service.users()
        .messages()
        .send(
            userId="me",
            body={"raw": raw, "threadId": full.get("threadId", "")},
        )
        .execute()
    )
    # Reply in dezelfde thread ook onder processed_prompts labelen, zodat
    # de volledige afgehandelde conversatie samen hangt.
    try:
        lid = label_id_by_name(service, LABEL_PROCESSED)
        if lid:
            service.users().messages().modify(
                userId="me", id=result["id"], body={"addLabelIds": [lid]}
            ).execute()
    except Exception:
        pass  # labeling is cosmetisch; verzenden is al gelukt
    log_event({"event": "reply_sent", "id": msg_id, "reply_id": result.get("id", "")})
    print(json.dumps({"ok": True, "reply_id": result.get("id", ""), "to": from_hdr, "subject": subject}))


def mode_inspect(service, msg_id):
    full, msg = fetch_raw(service, msg_id)
    rec = msg_record(full, msg)
    ok, reason = auth_ok(rec["auth"], rec.get("received_chain", ""), rec.get("labels", []))
    rec["auth_ok"] = ok
    rec["auth_reason"] = reason
    rec["sender_allowed"] = rec["from_addr"] in ALLOWED_SENDERS
    print(json.dumps(rec, indent=2, ensure_ascii=False))


def main():
    p = argparse.ArgumentParser(description="Personal prompt mailbox scanner")
    p.add_argument("--json", action="store_true", help="Pending prompts als JSON (met auth-quarantaine)")
    p.add_argument("--mark-processed", metavar="ID")
    p.add_argument("--mark-suspicious", metavar="ID")
    p.add_argument("--reason", default="")
    p.add_argument("--reply", metavar="ID")
    p.add_argument("--body-file", default="")
    p.add_argument("--inspect", metavar="ID")
    p.add_argument("--session-lookup", metavar="THREAD_ID")
    p.add_argument("--session-register", nargs=2, metavar=("THREAD_ID", "NAME"))
    p.add_argument("--session-rename", nargs=2, metavar=("THREAD_ID", "NAME"))
    args = p.parse_args()

    service = get_service()
    if args.mark_processed:
        mode_mark_processed(service, args.mark_processed)
    elif args.mark_suspicious:
        if not args.reason:
            print("FOUT: --reason verplicht bij --mark-suspicious", file=sys.stderr)
            sys.exit(1)
        mode_mark_suspicious(service, args.mark_suspicious, args.reason)
    elif args.session_lookup:
        mode_session_lookup(args.session_lookup)
    elif args.session_register:
        mode_session_register(service, args.session_register[0], args.session_register[1])
    elif args.session_rename:
        mode_session_rename(args.session_rename[0], args.session_rename[1])
    elif args.reply:
        if not args.body_file:
            print("FOUT: --body-file verplicht bij --reply", file=sys.stderr)
            sys.exit(1)
        mode_reply(service, args.reply, args.body_file)
    elif args.inspect:
        mode_inspect(service, args.inspect)
    elif args.json:
        mode_json(service)
    else:
        mode_digest(service)


if __name__ == "__main__":
    main()