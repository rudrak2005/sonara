                         ┌─────────────────┐
                         │      USER       │
                         └────────┬────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │      Next.js Web App     │
                    │ React + TS + Tailwind    │
                    └────────────┬─────────────┘
                                 │
                                 │ REST / WS
                                 ▼
                    ┌──────────────────────────┐
                    │       NestJS API         │
                    │      Modular Monolith     │
                    └────────────┬─────────────┘
                                 │
       ┌──────────────┬──────────┼──────────┬─────────────┐
       ▼              ▼          ▼          ▼             ▼
     Auth           Music      Pulse      AI          Together
       │              │          │          │             │
       └──────────────┴──────────┴──────────┴─────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
             ┌─────────────┐          ┌─────────────┐
             │ PostgreSQL  │          │    Redis    │
             └─────────────┘          └─────────────┘
                    │
                    ▼
             ┌──────────────┐
             │ Object Store │
             └──────────────┘

External:
  Music Provider
  AI Provider
  Embedding Provider
  Email Provider
  Analytics
  Error Tracking