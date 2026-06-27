---
question: "Explain the Factory pattern and where you use it on Android."
topic: architecture
difficulty: mid
tags: ["design-patterns", "factory"]
---

A **Factory** centralizes object **creation**, hiding the construction logic and the concrete type behind a method. Callers ask the factory for an object instead of calling a constructor directly.

```kotlin
// Factory method: decide the concrete type from input
object PaymentProcessorFactory {
    fun create(type: PaymentType): PaymentProcessor = when (type) {
        PaymentType.CARD   -> CardProcessor()
        PaymentType.UPI    -> UpiProcessor()
        PaymentType.WALLET -> WalletProcessor()
    }
}
```

**Why use it:**
- **Encapsulates creation** — complex/conditional construction lives in one place, not scattered across call sites.
- **Decouples** callers from concrete classes (they depend on the `PaymentProcessor` interface).
- **Open/Closed** — add a new type by extending the factory, not editing every caller.

**Where it appears in Android:**
- **`ViewModelProvider.Factory`** — the canonical example. ViewModels need constructor args (a repository), but the framework creates them, so you provide a factory that knows how to build it:
```kotlin
class FeedVMFactory(private val repo: FeedRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(c: Class<T>): T = FeedViewModel(repo) as T
}
```
(Hilt's `@HiltViewModel` generates this for you.)
- **`Fragment.instantiate` / newInstance pattern**, `RecyclerView.ViewHolder` creation in `onCreateViewHolder`, `LayoutInflater.Factory`, Retrofit/OkHttp builders internally, and DI `@Provides` methods are factories.

**Variants:** **Factory Method** (a method returns a type), **Abstract Factory** (a family of related objects), and DI frameworks are essentially **generalized factories**.

**Soundbite:** "A Factory centralizes and hides object construction behind a method, decoupling callers from concrete types — `ViewModelProvider.Factory` is the classic Android example, and DI is factories at scale."
