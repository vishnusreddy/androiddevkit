---
question: "Design a chat / messaging app (like WhatsApp) - the client side."
topic: system-design
difficulty: mid
tags: ["system-design", "chat", "realtime", "offline"]
---

Start with the user experience: messages should appear immediately, work through
brief network loss, stay in the right order, and show whether they were sent or
read. Then design the client one concern at a time.

**Requirements:** 1:1 (and group) messaging, real-time delivery, sent/delivered/read receipts, offline send & receive, message history, media.

**Real-time transport:** use a **WebSocket**, a connection that lets the client
and server send messages at any time, while the app is in the foreground. Use
**FCM push notifications** when it is backgrounded. If the connection drops,
reconnect gradually instead of retrying in a tight loop.

**Local data:** let the UI observe messages from Room. Network responses update
Room, and the UI updates from the database. This keeps one place responsible for
the visible message history and makes offline reading straightforward.
```
messages(id, chatId, senderId, body, status, createdAt, serverSeq)
status: SENDING | SENT | DELIVERED | READ | FAILED
```

**Sending a message (optimistic):**
1. Insert into Room with a **client-generated UUID** and `status = SENDING` → UI shows it instantly.
2. Send over the socket (or queue if offline).
3. When the server acknowledges the message, change it to `SENT` and store the
   server ID. An acknowledgement simply means the server confirmed receipt.
- A **WorkManager** job (or outbox) drains queued messages when connectivity returns.

**Receiving & ordering:**
- The server assigns a **monotonic sequence per chat** (`serverSeq`); the client orders by it, not by device time (clocks drift).
- Reusing the client UUID makes a retry safe: the server can recognize the same
  message instead of creating a duplicate. This is called **idempotency**.
- **Gap detection** - if you receive seq 5 then 8, fetch the missing 6–7 (sync by "last seen seq").

**Receipts:** delivered = stored on device; read = user opened the chat. Send these back over the socket; update local status.

**Media:** upload to blob storage, send a **reference/URL** in the message (not the bytes); thumbnails first, lazy full download; resumable chunked upload for large files.

**Other concerns:** **pagination** of history (cursor by `serverSeq`, load older on scroll up), **E2E encryption** (keys in Keystore) if required, **typing/presence** via lightweight socket events, **notification** dedup between FCM and socket.

**Trade-offs to name:** WebSocket battery cost vs real-timeness (drop socket in background, use FCM), optimistic UI vs consistency, ordering by server sequence vs device time.
