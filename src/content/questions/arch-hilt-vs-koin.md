---
question: "Hilt/Dagger vs Koin - what's the trade-off?"
topic: architecture
difficulty: mid
order: 150
starred: false
section: "Dependency injection"
tags: ["hilt", "dagger", "koin", "dependency-injection"]
---

The core distinction: **Dagger/Hilt resolve the graph at compile time; Koin resolves it at runtime.**

**Dagger / Hilt** - **compile-time**, code-generated DI.
- **Strengths:** type-safe graph validation at build time, generated code with
  low runtime overhead, and standard Android lifecycle components and scopes.
- **Costs:** a steeper learning curve, more annotations, code-generation build
  cost, and sometimes difficult compiler diagnostics.

**Koin** - **runtime** service locator (a DSL that registers and resolves dependencies).
- **Strengths:** readable Kotlin DSL, little setup, no generated graph, and a
  lower initial learning cost. It can also fit shared KMP code.
- **Costs:** graph errors generally surface at runtime, and dependency resolution
  has runtime work with less compile-time safety.

**How to choose (the balanced interview answer):**
- **Large, multi-module, performance-sensitive apps / teams that value compile-time safety** → **Hilt** (Google's recommended default on Android).
- **Smaller apps, rapid prototyping, KMP, or teams prioritizing simplicity and build speed** → **Koin**.

**Note:** Koin is technically closer to a **service locator** than "true" DI, and that distinction (compile-time safety vs runtime flexibility) is the real heart of the question - not which is "better."
