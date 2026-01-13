# Flux Integration (Decentralized Compute Layer)

This document outlines how **Flux** fits into the OpenEscrow architecture as a decentralized compute and hosting layer.

Flux is **not required** for the core escrow logic to function, but it provides a natural extension point for running off-chain services in a decentralized manner.

---

## Why Flux?

OpenEscrow is designed around a clear separation of concerns:

- **Shardeum** → On-chain escrow settlement and fund control
- **Inco** → Confidential computation for sensitive milestone and dispute data
- **Flux** → Decentralized hosting and compute for off-chain services

Flux enables OpenEscrow to avoid reliance on centralized cloud providers for backend or coordination services.


---

## Future Integration Plan

In a production-ready version of OpenEscrow, Flux can be used to:

- Host the frontend dApp
- Run Inco interaction services in a decentralized environment
- Deploy monitoring or dispute coordination services
- Eliminate centralized backend infrastructure entirely

This would make OpenEscrow a fully decentralized application across:
- Settlement
- Privacy
- Compute
- Hosting

---

## Reference

Flux implementation can be found here:

👉 https://8001-9b217ed1-af99-44d8-b6a7-1df14a5bbaa8-xjjj1kw32nysg7_9.thinkroot.app/dashboard

---

## Summary

Flux complements OpenEscrow by providing decentralized compute and hosting, while Shardeum and Inco handle settlement and privacy respectively.

Each layer remains independent, ensuring that the system is modular, auditable, and extensible.
