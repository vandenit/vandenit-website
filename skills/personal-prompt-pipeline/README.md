# Personal Prompt Pipeline

Email-gestuurde prompt-verwerking: je stuurt jezelf mails met subject
"Personal prompt(s)" vanaf je eigen adressen, en een cron-job verwerkt die
elke 30 minuten als opdrachten aan je agent — met veiligheidscontroles,
multi-turn conversaties per mail-thread, en één agent-sessie met
betekenisvolle naam per conversatie.

Dit is een werkend, geautomatiseerd systeem (draait sinds sep 2026 op een
echte mailbox). Onderstaande bestanden zijn gesanitiseerd: vervang de
placeholder-adressen en paden door je eigen waarden vóór gebruik.

## Architectuur

```
Gmail (jouw account)
   │  subject:"Personal prompt(s)" + allowlist-afzender
   ▼
personal_prompt_monitor.sh          ← cron monitor (elke 30 min, goedkoop)
   │  pending=0 → geen agent-run (stil)
   │  pending≥1 → agent-run triggert
   ▼
Personal Prompt Processor (cron-job)
   │  --json: pending mails met auth-gate, thread-context, sessie-info
   ▼
┌─ per pending mail ────────────────────────────────────────────────┐
│ 1. sessie: register/lookup via sessie-map (JSON state)             │
│ 2. risicobeoordeling (LLM-gate in de cron-prompt)                 │
│    - verdacht        → label suspicious + reply met uitleg        │
│    - risicovol       → geweigerd, prompt terug in reply (copy-     │
│                        pasteerbaar voor directe uitvoering)         │
│    - normaal         → uitvoeren (reply-prompts via hermes          │
│                        --resume in dezelfde sessie)                │
│ 3. reply in de thread + mail naar label processed_prompts          │
└───────────────────────────────────────────────────────────────────┘
```

## Componenten

| Onderdeel | Locatie | Rol |
|---|---|---|
| Scanner | `personal_prompt_scan.py` (deze dir) | Gmail-query, auth-gate, labels, thread-context, sessie-mapping |
| Monitor | `personal_prompt_monitor.sh` (deze dir) | Cron-gate; tikt stuck-teller (alleen via de wrapper) |
| Cron-job | schedule `every 30m` | Agent-run per tick met pending mails |
| Labels | `processed_prompts`, `suspicious` | Gmail-zijde |
| State | `~/.hermes/state/personal_prompts_*.json(l)` | auditlog, monitor-state, sessie-map |
| Deliver | je eigen chat-kanaal (bv. Telegram) | korte statusmelding per run |

## Setup (met jouw waarden)

1. **Gmail API-toegang** via OAuth (scopes: `gmail.readonly`, `gmail.send`,
   `gmail.modify`); token-file op een vaste plek, pad invullen in
   `TOKEN_PATH`.
2. **Scanner configureren**: `ALLOWED_SENDERS` en de `QUERY` in
   `personal_prompt_scan.py` — je eigen email-adressen (placeholder:
   `you@example.com`).
3. **Gmail-labels aanmaken**: `processed_prompts`, `suspicious`.
4. **Scanner draaien**: `python3 personal_prompt_scan.py` (digest voor de
   monitor). Zet het script + een wrapper in `~/.hermes/scripts/`.
5. **Cron-job aanmaken** (Hermes): schedule `every 30m`, monitor-script =
   de wrapper, deliver naar je chat-kanaal. De volledige agent-instructies
   (risicogate, sessie-flow, footer) staan in de cron-job prompt; zie
   "Cron-prompt" hieronder voor de kern.
6. **Testen**: stuur jezelf een mail "Personal prompt: <kleine taak>" en
   verifieer reply + label + sessie-aanmaak; reply daarna in de thread en
   verifieer dat de vervolgopdracht in dezelfde sessie landt.

## Veiligheid (defense in depth)

1. **Afzender-allowlist** — alleen je eigen adressen komen in aanmerking.
2. **Authenticatie-gate** — SPF moet expliciet `pass` zijn; DKIM/DMARC
   mogen niet falen; twijfel = suspicious. Trusted-source exceptie voor
   zelf-verzonden Gmail (Received-chain via `gmailapi.google.com`/
   `smtp.gmail.com` of SENT-label = bewijs van account-bezit).
3. **Risico-categorieën in de agent-run** (LLM-gate, bewust onvolmaakt):
   verdacht → suspicious; risicovol (rm, sudo, git push, serverconfig,
   geld, mails aan anderen, automatisering) → geweigerd met prompt-
   teruggave. **Geen enkele mail-reply kan die weigering opheffen.**
   Dreigingsmodel: een gecompromitteerde mailbox mag geen remote-execution
   krijgen; de enige uitvoeringsroute voor risicovolle taken is de agent
   zelf (interactief, getoond op het scherm).
4. **Detectie** — elke actie produceert een chat-melding + regel in de
   auditlog.

## Multi-turn & sessies

- **Replies in een prompt-thread zijn zelf nieuwe prompts**: de scanner
  levert ze met `is_reply: true` en de volledige eerdere thread als
  `context` (elk bericht met `scanner_generated`-vlag).
- **Eén agent-sessie per mail-thread**: bij de eerste prompt maakt de
  agent een sessie met betekenisvolle naam (bv. "Reflectie over schuld als
  ouder") via `--session-register`. Vervolgopdrachten in die thread worden
  via `hermes --resume <session_id> -z "<opdracht>" --yolo` in diezelfde
  sessie uitgevoerd — met volle gesprekscontext.
- **Footer in elke reply**: sessienaam + -id, zodat de conversatie in de
  agent's web interface terug te vinden is (zoeken op naam of id).

## Scanner-modes

```
python3 personal_prompt_scan.py                          # digest (monitor)
python3 personal_prompt_scan.py --json                   # pending + auth + context + sessie
python3 personal_prompt_scan.py --mark-processed ID
python3 personal_prompt_scan.py --mark-suspicious ID --reason "..."
python3 personal_prompt_scan.py --reply ID --body-file FILE
python3 personal_prompt_scan.py --inspect ID
python3 personal_prompt_scan.py --session-lookup THREAD_ID
python3 personal_prompt_scan.py --session-register THREAD_ID "naam"
python3 personal_prompt_scan.py --session-rename THREAD_ID "nieuwe naam"
```

## Bekende valstrikken (uit de praktijk)

- Gmail's phrase-search matcht geen meervoud: de query gebruikt daarom
  `{subject:"personal prompt" subject:"personal prompts"}`.
- `gmail labels` heet zo (niet `labels list`); labelkleuren moeten uit het
  toegestane palette, weglaten is veiliger.
- `threads().get` ondersteunt geen `format=raw` — thread
  bericht-voor-bericht raw fetchen.
- Drafts, spam en scanner-eigen replies worden geskipt (scanner-replies
  herkenbaar aan header `X-Hermes-Auto`).
- De Google API FutureWarning gaat naar stderr: altijd `2>/dev/null` bij
  piping. Token-refresh schrijft de token-file bij — draai de scanner niet
  parallel met andere Google API-scripts.
- Handmatige digest-runs zijn pure reads; alleen de monitor-wrapper tikt
  de stuck-teller (anders onderdrukt de cron-monitor vals een agent-run).

## Status

**Working** — draait unattended op een echte mailbox sinds sep 2026;
failure modes gedocumenteerd (zie valstrikken). Gesanitiseerd voor
publicatie: placeholder-adressen, geen live paden of job-id's.