---
question: "How do you choose between polling, long-polling, SSE, WebSocket, and FCM for real-time updates?"
topic: system-design
difficulty: senior
order: 30
starred: false
section: "Sync and real-time"
tags: ["system-design", "realtime", "websocket", "fcm"]
---

Each mechanism trades latency, battery, and complexity differently.

**Short polling** - client requests every N seconds.
- **Strengths:** simple, stateless, and widely supported.
- **Costs:** empty responses waste battery and data, and latency is bounded by
  the polling interval.
- *Use:* low-frequency, non-urgent updates (refresh a dashboard every 30s).

**Long polling** - request stays open until the server has data, then the client immediately re-requests.
- **Strengths:** near-real-time behavior without a permanently open client socket.
- **Costs:** connection churn and many server-held requests.
- *Use:* a fallback when WebSockets aren't available.

**SSE (Server-Sent Events)** - a one-way server→client stream over HTTP.
- **Strengths:** simple server-to-client stream with built-in reconnection,
  suitable for live scores or notifications while the app is active.
- **Costs:** one-directional; client-to-server work still needs requests.

**WebSocket** - full-duplex persistent connection.
- **Strengths:** low-latency bidirectional communication for chat, live
  collaboration, or multiplayer.
- **Costs:** connection lifecycle, heartbeats, reconnection, and battery use. Do
  not rely on a socket remaining alive after the app enters the background.
- *Use:* foreground real-time interactivity.

**FCM (push)** - server sends a push via Google's infrastructure.
- **Strengths:** the OS-managed channel can notify an app that is not currently
  running and is battery-efficient compared with an app-owned connection.
- **Costs:** delivery can be delayed, collapsed, or absent; ordering and timing
  are not guaranteed. Treat it as a signal to reconcile with the source of
  truth, not as the source of truth itself.
- *Use:* notifications, waking the app to sync.

**A practical mobile approach:** **combine them by app state.** Use a **WebSocket while foregrounded** for instant bidirectional updates, and **FCM when backgrounded** to wake/notify (since you can't keep a socket open in the background). Plus reconnect-with-backoff and a sync-on-reconnect to fill gaps.

**Decision factors:** update frequency, latency requirement, direction (one-way vs two-way), foreground vs background, battery/data budget, and server complexity.
