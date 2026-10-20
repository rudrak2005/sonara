# SONORA Threat Model

## Assets

- user account
- passwords/session credentials
- listening history
- personal memories
- AI conversations
- recommendation profile
- private rooms
- private messages
- provider credentials
- generated assets

## Threats

### T1 — Account Takeover
Risk:
Credential theft / session abuse

Mitigation:
Secure authentication
Session protection
Rate limiting

### T2 — Unauthorized Object Access
Risk:
User A accessing User B's memories

Mitigation:
Object ownership checks

### T3 — API Abuse
Risk:
Search/AI endpoints abused

Mitigation:
Rate limits
Validation
Usage controls

### T4 — AI Prompt Injection
Risk:
External/user content influences privileged AI actions

Mitigation:
Tool authorization
Structured outputs
Server-side permission checks

### T5 — Privacy Leakage
Risk:
Private listening history appears in public artifacts

Mitigation:
Explicit privacy filtering

### T6 — Provider Credential Exposure
Risk:
API credentials leaked

Mitigation:
Environment secrets
Never expose server credentials to browser

### T7 — Realtime Room Abuse
Risk:
Unauthorized room actions

Mitigation:
Room membership + permissions
Server-side authorization

### T8 — Messaging Privacy
Risk:
Private message content exposed

Mitigation:
Established secure protocol/library
No custom cryptography