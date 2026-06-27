---
question: "Design a location-tracking / ride-sharing client (like Uber). What are the client concerns?"
topic: system-design
difficulty: senior
tags: ["system-design", "location", "realtime", "battery"]
---

**Requirements:** track the user's location, show nearby drivers/the trip in real time, update the server with location, work with the screen off, all while **not draining the battery**.

**Location acquisition:**
- **FusedLocationProviderClient** (Play Services) - fuses GPS/Wi-Fi/cell for accurate, **battery-efficient** location. Choose the **priority** by need: `HIGH_ACCURACY` during an active trip, `BALANCED_POWER` while browsing.
- Tune **update interval** and **smallest displacement** - request the *least* frequency/accuracy that satisfies the use case. This is the central **battery vs accuracy** trade-off.
- **Geofencing** / activity recognition to trigger updates only when relevant (cheaper than constant polling).

**Background & foreground:**
- An active trip needs a **foreground service** with `foregroundServiceType="location"` and a persistent notification - required for background location and prevents the OS killing it.
- **Background location permission** (`ACCESS_BACKGROUND_LOCATION`) requested separately and justified.

**Real-time updates:**
- **Driver locations** stream to the client via **WebSocket** while foregrounded; **FCM** for trip status when backgrounded.
- The client **uploads** its location on an interval - **batch** points and send periodically (not one request per fix) to save radio/battery; queue when offline and flush on reconnect.

**Map & rendering:**
- **Maps SDK** with marker clustering for many drivers; **interpolate/animate** marker movement between updates for smoothness (don't snap); draw the route polyline.
- Throttle UI updates to avoid jank.

**Offline & resilience:**
- Cache the last known location and trip state in Room; degrade gracefully when GPS is weak (show "searching…").
- Handle permission revocation, location-off, and mock-location detection.

**Trade-offs to name:** **accuracy/frequency vs battery** (the big one - `HIGH_ACCURACY` + 1s updates kills the battery), batching uploads (efficiency vs freshness), foreground service (survivability + permission cost vs a persistent notification), marker interpolation (smoothness vs CPU).
