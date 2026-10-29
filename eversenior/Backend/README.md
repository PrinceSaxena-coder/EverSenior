# EverSenior Backend

NestJS + TypeScript + MongoDB backend foundation for EverSenior.

## Current scope

Phase 1 only:
- NestJS API foundation
- MongoDB connection
- environment validation
- request IDs
- Helmet/CORS/body validation defaults
- health/readiness endpoints
- migration/version tracking collection
- append-only audit log collection
- safe audit metadata redaction

No authentication, matching, bookings, payments, messaging, or SOS API has been implemented yet.

## Run locally

1. Install Node.js 20+.
2. Copy `.env.example` to `.env`.
3. Start MongoDB with `docker compose up -d` or use your own MongoDB instance.
4. Run `npm install`.
5. Run `npm run start:dev`.
6. Check `GET http://localhost:3000/v1/health`.
7. Check `GET http://localhost:3000/v1/health/ready`.

The frontend remains in `../Frontend` and is not modified by the backend foundation.
