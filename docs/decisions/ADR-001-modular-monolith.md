# ADR-001 — Modular Monolith

## Status

Accepted

## Decision

SONORA will initially use a modular monolith architecture.

## Why

- Smaller operational burden
- Easier local development
- Easier debugging
- Clear module boundaries
- Lower deployment complexity

## Consequence

Modules must maintain clear boundaries so that future extraction remains possible.