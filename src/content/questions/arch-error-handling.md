---
question: "How should errors move through an app's layers?"
topic: architecture
difficulty: mid
tags: ["error-handling", "result", "sealed-class"]
---

Rather than letting exceptions leak everywhere, model expected failures as **values** that flow through the layers and end as **UI state**.

**A domain `Result` wrapper** (your own sealed type or Kotlin's `Result`):
```kotlin
sealed interface DataResult<out T> {
    data class Success<T>(val data: T) : DataResult<T>
    data class Failure(val error: AppError) : DataResult<Nothing>
}

sealed interface AppError {
    data object Network : AppError
    data object Unauthorized : AppError
    data class Unknown(val cause: Throwable) : AppError
}
```

**Repository converts exceptions → typed results** at the boundary:
```kotlin
suspend fun getUser(id: String): DataResult<User> = try {
    DataResult.Success(api.getUser(id).toDomain())
} catch (e: IOException) { DataResult.Failure(AppError.Network) }
  catch (e: HttpException) {
      DataResult.Failure(if (e.code() == 401) AppError.Unauthorized else AppError.Unknown(e))
  }
```

**ViewModel maps the result into UI state:**
```kotlin
when (val r = getUser(id)) {
    is DataResult.Success -> _state.update { it.copy(user = r.data) }
    is DataResult.Failure -> _state.update { it.copy(error = r.error.toMessage()) }
}
```

**Principles:**
- **Distinguish expected vs unexpected failures.** Expected (network down, validation, 404) → modeled as `Result`/sealed errors and shown to the user. Unexpected (programming bugs) → let them crash/report; don't swallow.
- **Translate at the boundary** - convert framework exceptions (`IOException`, `HttpException`, `SQLException`) into **domain errors** in the data layer so upper layers don't depend on Retrofit/Room types.
- **Exhaustive handling** - a sealed `AppError` forces the UI to handle each case (retry, re-login, generic message).
- For **Flow**, surface errors via a result-emitting flow or the `catch` operator mapping to an error state - never an unhandled throw in `collect`.
- **Never catch `CancellationException`** in a blanket catch - rethrow it.
