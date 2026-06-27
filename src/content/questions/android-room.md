---
question: "What is Room, and what are its main components and benefits?"
topic: android-fundamentals
difficulty: mid
tags: ["room", "persistence", "database"]
---

**Room** is Jetpack's persistence library - an abstraction over **SQLite** that adds compile-time safety and coroutine/Flow support. Three core pieces:

- **`@Entity`** - a table; each instance is a row.
- **`@Dao`** - Data Access Object; methods annotated `@Query`/`@Insert`/`@Update`/`@Delete` define database operations.
- **`@Database`** - ties entities + DAOs together and exposes the DB instance.

```kotlin
@Entity data class User(@PrimaryKey val id: Int, val name: String)

@Dao interface UserDao {
    @Query("SELECT * FROM User WHERE id = :id")
    suspend fun getUser(id: Int): User?

    @Query("SELECT * FROM User")
    fun observeAll(): Flow<List<User>>     // emits on every change

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(user: User)
}

@Database(entities = [User::class], version = 1)
abstract class AppDb : RoomDatabase() { abstract fun userDao(): UserDao }
```

**Why Room over raw SQLite:**
- **Compile-time SQL verification** - your `@Query` strings are checked against the schema at build time (typos/bad columns fail the build).
- **No boilerplate** - no `Cursor` parsing or `ContentValues`; rows map straight to objects.
- **Coroutines & Flow** - `suspend` DAO methods run off the main thread; **`Flow` return types make the DB observable**, emitting whenever the data changes - the basis of "DB as single source of truth."
- **Migrations** - explicit `Migration` objects (or `autoMigrations`) version your schema safely.
- Relations (`@Relation`), type converters (`@TypeConverter`), full-text search, and testability.

**What to remember:**
- A `Flow`-returning query is the idiomatic **single source of truth** - write to Room, observe Room, UI updates automatically (pairs with Paging's `RemoteMediator` for offline-first).
- Room **enforces no main-thread queries** by default (would block/ANR).
- Provide **migrations**; `fallbackToDestructiveMigration` wipes data and is for dev only.
