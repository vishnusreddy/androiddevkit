---
question: "What is the Binder transaction limit, and when does TransactionTooLargeException actually fire?"
topic: platform-internals
difficulty: mid
order: 10
section: "Binder and IPC"
tags: ["binder", "transactiontoolarge", "savedinstancestate", "ipc"]
---

Every process has a **Binder transaction buffer of about 1 MB**, and that buffer
is **shared across all transactions in flight at once** for that process. So the
real budget for any single call is smaller than 1 MB, because the framework and
other concurrent calls are using part of it too. When a transaction does not fit,
Binder throws `TransactionTooLargeException`.

**The trap is that it is size-dependent, so it hides in testing.** A screen works
fine with a short list and then crashes in production when a user has a large one.
The exception often surfaces far from the code that caused it, because the failing
transaction is the framework serializing your state, not a line you wrote.

**The most common source is `onSaveInstanceState`.** That Bundle is sent to
`system_server` over Binder so it can be handed back after process death. People
put too much in it:

- A large list of parsed model objects instead of a handful of ids.
- A full-resolution `Bitmap`.
- An entire screen's worth of data "to avoid reloading."

The saved-state Bundle is for the small keys needed to rebuild a screen (a
selected id, a query string, a scroll position), not for caching data. Reload the
heavy data from a database or the network using the saved id.

**Other places it shows up:**

- Returning a big collection across a bound service or ContentProvider call.
- Putting large extras on an `Intent` (the Intent travels through Binder to start
  the target).
- Broadcasting a large payload.

**How to avoid it:**

- Pass **references, not payloads**. Send an id and let the receiver fetch.
- Keep `onSaveInstanceState` tiny; move real data to a `ViewModel` for rotation
  and to durable storage for process death.
- For genuinely large data that must cross a process boundary, stream it through a
  file, a `ContentProvider`, or shared memory (`ashmem` / `MemoryFile`) rather
  than a single Parcel.

The number to remember is roughly 1 MB per process, shared, so treat a few hundred
kilobytes as the practical ceiling for one transaction.
