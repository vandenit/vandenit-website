#!/bin/bash
# Monitor-wrapper voor de personal prompt scanner: garandeert dat de
# cron-monitor dezelfde python-interpreter gebruikt als getest.
# PP_MONITOR_DIGEST=1 zorgt dat de digest alléén via de monitor de
# state-file mutteert (stuck-teller); handmatige debug-runs zijn
# pure reads en vervuilen de teller niet.
export PP_MONITOR_DIGEST=1
exec /usr/bin/python3 /home/filip/.hermes/scripts/personal_prompt_scan.py