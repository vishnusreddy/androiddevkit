---
title: Dependency injection, Gradle, and release variants
description: Build replaceable object graphs, control scope, understand Android build variants, and explain what changes between source code and a shipped app bundle.
level: mid
order: 8
duration: 75 min
quizHref: /practice/?test=architecture-test
quizLabel: Take the architecture quiz
---

Mid-level Android engineers should be able to trace two graphs: the runtime object graph and the Gradle dependency graph. Dependency injection controls how objects are created and shared. Gradle controls how source, resources, manifests, generated code, and dependencies become an APK or app bundle.

## Learning goals

- Apply constructor injection and scope only when shared lifetime is required.
- Explain Hilt component lifetimes and common scope mistakes.
- Distinguish Gradle projects, modules, plugins, configurations, and variants.
- Predict build type and product flavor source-set merging.
- Explain D8, R8, resources shrinking, signing, APKs, and app bundles.

## Dependency injection is explicit construction

Without a DI framework, good dependency injection is ordinary Kotlin:

```kotlin
class CheckoutRepository(
    private val api: CheckoutApi,
    private val dao: CheckoutDao,
    private val clock: Clock,
)
```

The constructor declares what the class needs. A composition root creates the concrete graph:

```kotlin
val httpClient = OkHttpClient.Builder().build()
val api = retrofit(httpClient).create(CheckoutApi::class.java)
val database = buildDatabase(appContext)
val repository = CheckoutRepository(api, database.checkoutDao(), Clock.systemUTC())
```

Benefits come from explicit dependencies, not from annotations alone:

- Dependencies are visible and hard to forget.
- Tests can supply fakes.
- Construction is centralized.
- Lifetime policy is reviewable.

Service locators hide dependencies behind global lookup and often fail later at runtime.

## Prefer constructor injection

Constructor injection is the default because it makes invalid partially initialized objects difficult to create.

Use provider methods when:

- You do not own the class constructor.
- Construction needs a builder or factory.
- An interface needs a concrete binding.
- Configuration differs by qualifier.

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides
    @Singleton
    fun provideOkHttp(auth: AuthInterceptor): OkHttpClient =
        OkHttpClient.Builder()
            .addInterceptor(auth)
            .build()
}
```

Use `@Binds` for a simple interface-to-implementation mapping when the implementation has an injectable constructor.

## Scope means one instance per component instance

`@Singleton` does not mean immortal or universally global. In Hilt it means one instance per `SingletonComponent`, whose practical lifetime is the app process.

Common Hilt component lifetimes include:

| Component | Practical owner | Example dependency |
|---|---|---|
| `SingletonComponent` | App process | Database, shared HTTP client |
| `ActivityRetainedComponent` | Logical Activity across configuration | Some Activity-retained coordinators |
| `ViewModelComponent` | ViewModel | Screen use case with `SavedStateHandle` |
| `ActivityComponent` | Activity instance | Activity-specific navigator |
| `FragmentComponent` | Fragment instance | Fragment-specific adapter factory |

Scope only when identity or shared state is required. An unscoped cheap stateless mapper can be created whenever injected.

The dangerous mismatch is a longer-lived dependency retaining a shorter-lived object. A singleton must not store an Activity, View, or Fragment callback.

## Qualifiers disambiguate the same type

```kotlin
@Qualifier
annotation class AuthenticatedClient

@Qualifier
annotation class PublicClient

@Provides
@AuthenticatedClient
fun authenticatedClient(auth: AuthInterceptor): OkHttpClient = ...
```

Avoid vague qualifiers such as `@Named("one")`. Domain-specific names survive refactoring and code review better.

## Runtime values need assisted construction

DI graphs know build-time bindings, not every runtime value such as a download ID. Use a factory or assisted injection boundary:

```kotlin
class DownloadSession(
    private val repository: DownloadRepository,
    val downloadId: String,
)

class DownloadSessionFactory @Inject constructor(
    private val repository: DownloadRepository,
) {
    fun create(id: String) = DownloadSession(repository, id)
}
```

For ViewModels and WorkManager workers, use the integration supported by the project's Hilt and AndroidX versions. The key explanation is which values come from the graph and which arrive at runtime.

## Keep the graph acyclic

If `AuthRepository` needs `ApiClient` and `ApiClient` needs `AuthRepository`, the responsibilities are tangled. Break the cycle with a narrower boundary such as `TokenProvider`, an authenticator callback, or an event stream.

`Provider<T>` or `Lazy<T>` can delay construction, but using them only to hide a conceptual cycle leaves the design fragile.

## Gradle's mental model

- A **project** is the overall Gradle build.
- A **module** is typically a Gradle subproject such as `:app` or `:feature:checkout`.
- A **plugin** adds model and tasks, such as the Android application plugin or Kotlin plugin.
- A **configuration** is a dependency bucket such as `implementation` or `testImplementation`.
- A **task** performs work and declares inputs and outputs.
- A **variant** is a buildable combination of build type, product flavors, and other dimensions.

Gradle's configuration phase builds the task graph. The execution phase runs the requested tasks and dependencies. Excessive configuration work slows every invocation even when few tasks execute.

## `implementation` vs `api`

In a library module:

- `implementation` keeps a dependency internal to that module's compile API when possible.
- `api` exposes it to consumers because the dependency's types are part of the library's public API.

Overusing `api` increases coupling and can widen recompilation. If a public function returns an OkHttp type, OkHttp is part of that module's API whether the team intended it or not.

## Variants and source sets

Build types commonly express debug vs release behavior. Product flavors express product dimensions such as demo/full or environment, though environment-only flavors can create maintenance cost.

```kotlin
android {
    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
        }
    }
}
```

Source sets merge with precedence based on variant specificity. A release source file can override a main implementation, while manifests and resources merge according to Android Gradle Plugin rules.

Use variant-specific dependencies for debug tools:

```kotlin
dependencies {
    debugImplementation(libs.leakcanary)
    releaseImplementation(libs.noopInspector)
}
```

Do not ship logging menus, mock endpoints, or debug certificates accidentally.

## Build pipeline from source to package

At a high level:

1. Kotlin and Java compile to JVM bytecode.
2. Resources are processed and IDs generated.
3. D8 desugars supported language features and converts bytecode to DEX.
4. R8 can shrink, optimize, and obfuscate code for release.
5. Resource shrinking removes resources unreachable from the optimized code graph.
6. Manifest, DEX, resources, and native libraries are packaged.
7. The artifact is signed.

Generated code from KSP or annotation processing participates before later packaging stages. Know whether a library uses KSP, KAPT, or a compiler plugin because it affects build behavior and diagnostics.

## R8 keep rules are contracts

R8 removes or renames code that appears unreachable. Reflection, JNI, serialization, and dynamically referenced classes may need metadata or keep rules.

Do not react to every release crash with `-keep class ** { *; }`. That disables much of shrinking and hides the missing contract.

Prefer:

- Library-provided consumer rules.
- Annotation or generated-adapter based serialization.
- Narrow rules for reflectively accessed members.
- Release tests that exercise startup and critical flows.
- Mapping files retained for deobfuscating stack traces.

## APK vs Android App Bundle

An APK is an installable package for a device. An Android App Bundle is a publishing format that lets Google Play generate optimized APK sets for device configuration.

An app bundle is not directly installed like a normal universal APK. Local tools can generate device-specific APKs from it for testing.

Signing proves update continuity. Losing control of signing credentials can block trusted updates, although Play App Signing separates the app-signing key from an upload key and supports defined recovery workflows.

## Configuration cache and build performance

Build performance work should use evidence:

- Build scans or profile reports.
- Task execution time and cacheability.
- Annotation processor and KSP cost.
- Avoided recompilation through module boundaries and `implementation`.
- Configuration cache compatibility.
- Remote or local build cache hit rate.

More modules can improve parallelism and isolation, but too many tiny modules add configuration and coordination overhead.

## Common pitfalls

1. Calling a service locator dependency injection.
2. Scoping every object as singleton.
3. Retaining an Activity in a singleton-scoped object.
4. Hiding dependency cycles with `Lazy` without fixing ownership.
5. Exposing dependency types through a module while declaring them internal by habit.
6. Testing only debug when release enables R8 and resource shrinking.
7. Solving one missing R8 rule with a global keep rule.
8. Adding product-flavor dimensions without a product need.

## How interviewers probe this

- "Constructor injection vs service locator?"
- "What does a Hilt scope guarantee?"
- "Can a singleton depend on an Activity-scoped object?"
- "How do you inject a runtime ID?"
- "`implementation` vs `api`?"
- "What is a build variant?"
- "What do D8 and R8 do?"
- "APK vs app bundle?"
- "Why does a release build fail when debug works?"

## Practice checklist

1. Draw the object graph for one feature and label component lifetime.
2. Replace a service locator lookup with constructor injection.
3. Build and smoke-test a minified release variant.
4. Inspect an R8 mapping file and retrace an obfuscated stack trace.
5. Use a build profile to find the slowest configuration or task cost.

## What you should be able to explain

- Explicit object construction, scope, and runtime values.
- Hilt lifetime boundaries and graph cycles.
- Gradle variants, configurations, and source-set merging.
- The release pipeline from bytecode through signed artifact.

Mid-level path complete. The senior path starts with **modularization**, where these object and build graphs become organizational boundaries.
