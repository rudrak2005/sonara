# SONORA Playback + Session State

## Purpose

Define the durable and temporary state boundaries
for playback/session behavior before database implementation.

## Playback Session

Fields:

- id
- user_id
- current_music_item_id
- status
- position_ms
- duration_ms
- started_at
- paused_at
- ended_at
- updated_at

## Session Item

Fields:

- id
- session_id
- music_item_id
- position
- source
- added_at
- started_at
- completed_at
- skipped_at

## State Boundary

### Browser / Zustand

- isPlaying
- currentTime
- currentTrack
- queue UI
- mini/full player state
- shuffle/repeat UI state

### Server

- authoritative session state
- ownership
- playback events
- durable session metadata

### PostgreSQL

- playback/session records
- listening history
- durable session metadata

### Redis

- temporary playback coordination
- future realtime synchronization
- short-lived session cache

## Day 6 Rule

Do not depend on database persistence for the interactive
player shell. Persistence is introduced through later
platform/database implementation.