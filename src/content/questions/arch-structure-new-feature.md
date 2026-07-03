---
question: "Walk me through how you'd structure a new feature end to end."
topic: architecture
difficulty: mid
order: 20
starred: true
section: "Architecture foundations"
tags: ["architecture", "practical", "design"]
---

A common open-ended interview question. Structure the answer by **layers + data flow**, and mention testing and trade-offs. Example: a "Saved articles" feature.

**1. Data layer**
- **Models:** `ArticleDto` (network), `ArticleEntity` (Room), `Article` (domain) with mappers.
- **Data sources:** `ArticleApi` (Retrofit), `ArticleDao` (Room).
- **Repository:** `ArticleRepository` interface (domain) + impl (data). Exposes `observeSaved(): Flow<List<Article>>` from Room (single source of truth), with network refresh writing into Room (offline-first).

**2. Domain layer (if warranted)**
- `ToggleSaveArticleUseCase`, `GetSavedArticlesUseCase` - only if logic is reused/complex; otherwise the ViewModel calls the repository directly.

**3. UI layer**
- `SavedViewModel` exposes immutable `StateFlow<SavedUiState>`, handles user
  actions such as `onToggleSave`, and represents user-visible outcomes in state.
  The UI can acknowledge a handled message or navigation result.
- `SavedScreen` (Compose) collects state with `collectAsStateWithLifecycle()`, renders, sends events up (UDF).

**4. Wiring**
- **Hilt** provides the API, DAO, repository (`@Binds` interface→impl), scoped appropriately (`@Singleton` for DB/network, `@HiltViewModel` for the VM).
- **Navigation** destination/route; nav args via `SavedStateHandle`.

**5. Cross-cutting**
- **Error handling** → typed results mapped to UI state.
- **Testing** → unit-test the ViewModel (fake repo + test dispatcher), DAO (in-memory Room), mappers; a Compose UI test for the critical flow.
- **Paging** if the list is large (Paging 3 + RemoteMediator).

**Then state the trade-offs:** "I'd skip the domain layer and separate models if it's simple, and add them if logic is shared or the API is messy - matching the architecture to the feature's complexity."

![End-to-end Android feature data flow from UI events to repository and back through observable state](/diagrams/feature-data-flow.svg)

This answer demonstrates layers, UDF, a single source of truth, DI, testing, and
judgment about how much architecture the feature actually needs.
