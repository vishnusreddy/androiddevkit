---
question: "Design an e-commerce checkout / payment flow."
topic: system-design
difficulty: senior
order: 110
starred: false
section: "Product design exercises"
tags: ["system-design", "payments", "reliability", "security"]
---

Checkout is about **correctness, reliability, and security** - you must never double-charge or lose an order.

**Requirements:** cart → address → payment → confirmation; handle network failures without double-charging; secure payment data; show accurate state.

**The cardinal rule - idempotency:**
- Generate an **idempotency key** per checkout attempt (client UUID). Send it with the "place order" request.
- If the response is lost (network drop after the server charged), the client **retries with the same key**; the server recognizes it and returns the **existing** order instead of charging again. This single mechanism prevents the classic double-charge.

**State machine for the order:**
![Checkout state machine from cart through payment to confirmed or failed](/diagrams/checkout-state-machine.svg)
- Persist the in-progress order **locally** so a crash/kill mid-checkout can resume or reconcile.
- On uncertain outcome (timeout), **poll order status** rather than re-submitting blindly.

**Payment security:**
- Avoid handling raw card data. Use a payment-provider SDK or Google Pay so
  sensitive details are tokenized by the provider. This can reduce PCI scope,
  but the exact compliance obligation depends on the integration and business.
- **Google Pay / payment sheets** for a native, secure UX.
- Use TLS, keep payment data out of logs and local storage, and add certificate
  pinning only when the threat model and operational plan justify it.

**Reliability & UX:**
- **Disable the pay button** after tap and show progress to prevent duplicate taps (belt-and-suspenders with idempotency).
- **Optimistic but careful** - don't show "confirmed" until the server confirms; show "processing" for pending.
- Validate inventory/price **server-side** at order time (client prices can be stale/tampered).
- Handle **3-D Secure / OTP** redirects and async payment methods (UPI, wallets) via status polling/webhook-driven push.

**Other concerns:** cart persistence across devices (synced), address validation, retry on transient failures (idempotent), clear error messaging (declined vs network), analytics on funnel drop-off.

**Trade-offs to name:** optimistic confirmation vs waiting for server (UX vs correctness - here correctness wins), polling vs push for async payment status, how long to retain in-progress order state.
