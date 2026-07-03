---
question: "How do you test Room DAOs and database migrations?"
topic: testing-quality
difficulty: mid
order: 60
starred: true
section: "Data and network boundaries"
tags: ["testing", "room", "sqlite", "migration"]
---

DAO tests verify your real SQL, entities, converters, transactions, and conflict
rules. Use an **in-memory Room database on an Android device or emulator**, give
each test a fresh database, and close it afterward.

```kotlin
@RunWith(AndroidJUnit4::class)
class UserDaoTest {
    private lateinit var db: AppDatabase

    @Before fun createDb() {
        db = Room.inMemoryDatabaseBuilder(
            ApplicationProvider.getApplicationContext(),
            AppDatabase::class.java,
        ).build()
    }

    @After fun closeDb() = db.close()

    @Test fun activeUsers_areOrderedByName() = runTest {
        db.userDao().insertAll(zara, inactiveBen, ada)
        assertEquals(listOf(ada, zara), db.userDao().activeUsers().first())
    }
}
```

Test query behavior that can actually break: empty results, ordering, joins,
nulls, uniqueness, replacement rules, transactions, and Flow invalidation. Do
not mock a DAO when the purpose is to verify SQL.

Migration tests protect user data across app updates:

1. Enable Room schema export and commit the schema JSON files.
2. Use `MigrationTestHelper` to create a database at an old version.
3. Insert representative old data, including nulls and boundary values.
4. Run every migration to the latest version.
5. Validate the final schema and assert that the data was preserved or
   transformed correctly.

Test each individual migration and the full path from every supported starting
version. Schema validation alone is not enough when data must be backfilled,
split, merged, or normalized. Never use destructive migration for user-owned
data unless losing it is an explicit product decision.
