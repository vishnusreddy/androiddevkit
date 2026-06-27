---
question: "Explain the SOLID principles with Android examples."
topic: architecture
difficulty: mid
tags: ["solid", "design-principles", "clean-code"]
---

Five object-oriented design principles for maintainable code:

**S - Single Responsibility.** A class should have one reason to change.
> *Android:* a ViewModel manages UI state; it shouldn't also parse JSON or do networking. A God-Activity doing UI + networking + persistence violates this.

**O - Open/Closed.** Open for extension, closed for modification.
> *Android:* add a new `RecyclerView` view type or a new `PaymentMethod` by adding a class, not editing a giant `when` everywhere. A sealed hierarchy + polymorphism extends behavior without rewriting existing code.

**L - Liskov Substitution.** Subtypes must be usable wherever the base type is, without breaking expectations.
> *Android:* a `FakeRepository` must honor the `Repository` contract so it can replace the real one in tests. A subclass that throws on a method the base supports breaks LSP.

**I - Interface Segregation.** Prefer small, focused interfaces over fat ones.
> *Android:* don't force a class to implement a 10-method `Callback`; split into `OnClick`, `OnLongClick`. Clients depend only on what they use.

**D - Dependency Inversion.** Depend on abstractions, not concretions; high-level modules shouldn't depend on low-level details.
> *Android:* the ViewModel depends on a `UserRepository` **interface**, not `RetrofitUserRepository`. This is exactly what DI (Hilt) and Clean Architecture's "domain defines interfaces, data implements them" enforce.

**Why this matters:** SOLID underpins *why* we use repositories, interfaces, DI, and layered architecture. The strongest answers tie each principle to a concrete Android decision (the examples above), not just recite definitions.
