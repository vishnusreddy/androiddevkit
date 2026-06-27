---
question: "How do you choose between polling, long-polling, SSE, WebSocket, and FCM for real-time updates?"
topic: system-design
difficulty: senior
tags: ["system-design", "realtime", "websocket", "fcm"]
---

Each mechanism trades latency, battery, and complexity differently.

**Short polling** - client requests every N seconds.
- ✅ Simple, stateless, works everywhere.
- ❌ Wasteful (most polls return nothing), latency = poll interval, battery/data cost.
- *Use:* low-frequency, non-urgent updates (refresh a dashboard every 30s).

**Long polling** - request stays open until the server has data, then the client immediately re-requests.
- ✅ Near-real-time without persistent connections; firewall-friendly.
- ❌ Connection churn, server holds many open requests.
- *Use:* a fallback when WebSockets aren't available.

**SSE (Server-Sent Events)** - a one-way server→client stream over HTTP.
- ✅ Simple, auto-reconnect, good for **server-push-only** feeds (live scores, notifications).
- ❌ One-directional; client→server still needs separate requests.

**WebSocket** - full-duplex persistent connection.
- ✅ **Lowest latency**, bidirectional - ideal for **chat, live collaboration, multiplayer**.
- ❌ Battery drain (keeps a socket alive), reconnection/backoff logic, **can't run in the background** on Android - the OS kills it.
- *Use:* foreground real-time interactivity.

**FCM (push)** - server sends a push via Google's infrastructure.
- ✅ Works when the app is **backgrounded/killed**; battery-efficient (one OS-level channel); the *only* way to wake a sleeping app.
- ❌ Not guaranteed instant or ordered; payload-size limited; best as a **signal** ("new data, come fetch"), not the data transport.
- *Use:* notifications, waking the app to sync.

**A practical mobile approach:** **combine them by app state.** Use a **WebSocket while foregrounded** for instant bidirectional updates, and **FCM when backgrounded** to wake/notify (since you can't keep a socket open in the background). Plus reconnect-with-backoff and a sync-on-reconnect to fill gaps.

**Decision factors:** update frequency, latency requirement, direction (one-way vs two-way), foreground vs background, battery/data budget, and server complexity.
