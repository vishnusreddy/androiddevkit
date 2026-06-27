---
question: "Hilt/Dagger vs Koin - what's the trade-off?"
topic: architecture
difficulty: mid
tags: ["hilt", "dagger", "koin", "dependency-injection"]
---

The core distinction: **Dagger/Hilt resolve the graph at compile time; Koin resolves it at runtime.**

**Dagger / Hilt** - **compile-time**, code-generated DI.
- ✅ **Type-safe** - missing/duplicate bindings fail the **build**, not in production.
- ✅ **No reflection** → fast at runtime, good for large graphs.
- ✅ Hilt adds Android lifecycle components/scopes out of the box.
- ❌ **Steeper learning curve**, more annotations, and **build-time cost** (annotation processing / KSP).
- ❌ Cryptic Dagger error messages.

**Koin** - **runtime** service locator (a DSL that registers and resolves dependencies).
- ✅ **Simple and Kotlin-idiomatic** - a readable DSL, minimal boilerplate, no codegen, fast builds.
- ✅ Easy to learn; great for small/medium apps and KMP.
- ❌ **Errors surface at runtime** - a missing dependency crashes when first requested, not at compile time.
- ❌ Resolution has some **runtime overhead** (historically reflection-ish; improved over versions), and less compile-time safety.

**How to choose (the balanced interview answer):**
- **Large, multi-module, performance-sensitive apps / teams that value compile-time safety** → **Hilt** (Google's recommended default on Android).
- **Smaller apps, rapid prototyping, KMP, or teams prioritizing simplicity and build speed** → **Koin**.

**Note:** Koin is technically closer to a **service locator** than "true" DI, and that distinction (compile-time safety vs runtime flexibility) is the real heart of the question - not which is "better."
