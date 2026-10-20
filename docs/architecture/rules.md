# Architecture Rules

1. Frontend does not own business-critical recommendation logic.

2. Backend is responsible for authorization.

3. Provider-specific logic must stay behind adapters.

4. AI output is never trusted directly.

5. Structured AI outputs must be validated.

6. PostgreSQL is the durable source of truth.

7. Redis is not the primary permanent data store.

8. User-owned data must enforce object-level authorization.

9. External service failure must not crash the whole application.

10. New infrastructure must have a measurable reason.

11. Do not introduce microservices without proven need.

12. Do not create custom cryptography.

13. Secrets never enter frontend bundles.

14. Every major module must have tests.

15. Every architecture-changing decision must have an ADR.