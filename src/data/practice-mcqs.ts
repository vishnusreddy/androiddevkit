export type PracticeDifficulty = 'junior' | 'mid' | 'senior';

export interface PracticeMcq {
  id: string;
  topic: string;
  difficulty: PracticeDifficulty;
  prompt: string;
  options: [string, string, string, string];
  correct: number;
  explanation: string;
  test?: string;
  code?: string;
}

export interface PracticeCodeQuestion {
  id: string;
  topic: string;
  difficulty: PracticeDifficulty;
  prompt: string;
  code?: string;
  reference: string;
  explanation: string;
  test: string;
}

const mcq = (
  id: string,
  topic: string,
  difficulty: PracticeDifficulty,
  prompt: string,
  options: [string, string, string, string],
  correct: number,
  explanation: string,
  extra: Pick<PracticeMcq, 'test' | 'code'> = {},
): PracticeMcq => ({ id, topic, difficulty, prompt, options, correct, explanation, ...extra });

export const KOTLIN_DSA_CODE_QUESTIONS: PracticeCodeQuestion[] = [
  {
    id: 'kd-code-01', topic: 'kotlin', difficulty: 'junior', test: 'kotlin-dsa',
    prompt: 'Write the expression that returns the last valid index of `nums`.',
    code: 'val nums = intArrayOf(4, 8, 12)\nval last = ___',
    reference: 'val last = nums.lastIndex',
    explanation: '`lastIndex` is defined as `size - 1`, so here it is `2`. Careful with the empty array: `lastIndex` returns `-1`, so guard before indexing.',
  },
  {
    id: 'kd-code-02', topic: 'kotlin', difficulty: 'junior', test: 'kotlin-dsa',
    prompt: 'Write a one-line function that returns whether `n` is even.',
    code: 'fun isEven(n: Int): Boolean = ___',
    reference: 'fun isEven(n: Int): Boolean = n % 2 == 0',
    explanation: 'Even means division by two leaves no remainder, and the comparison already yields the Boolean. Prefer `n % 2 == 0` over `n % 2 != 1`, which mishandles negative numbers because `-3 % 2` is `-1` on the JVM.',
  },
  {
    id: 'kd-code-03', topic: 'kotlin', difficulty: 'mid', test: 'kotlin-dsa',
    prompt: 'Complete the frequency count without a not-null assertion.',
    code: 'val counts = mutableMapOf<Char, Int>()\nfor (ch in word) {\n    counts[ch] = ___\n}',
    reference: 'counts[ch] = counts.getOrDefault(ch, 0) + 1',
    explanation: '`getOrDefault` hands back zero the first time a character shows up, so the same line handles both new and existing keys. This counting map is the setup for anagram checks and first-unique-character questions.',
  },
  {
    id: 'kd-code-04', topic: 'kotlin', difficulty: 'mid', test: 'kotlin-dsa',
    prompt: 'Fill in the loop range so every valid array index is visited safely.',
    code: 'for (i in ___) {\n    println(nums[i])\n}',
    reference: `for (i in nums.indices) {
    println(nums[i])
}`,
    explanation: '`indices` is exactly the valid index range of the array, so there is no off-by-one to get wrong. For an empty array the range is empty and the body never runs, which avoids ArrayIndexOutOfBoundsException.',
  },
  {
    id: 'kd-code-05', topic: 'kotlin', difficulty: 'mid', test: 'kotlin-dsa',
    prompt: 'Complete the queue operations so nodes are processed in first-in, first-out order.',
    code: 'val queue = ArrayDeque<Int>()\nqueue.___(start)\nval node = queue.___()',
    reference: `queue.addLast(start)
val node = queue.removeFirst()`,
    explanation: 'Add at the back, remove from the front: that is FIFO, which is what BFS needs. `removeFirst` throws NoSuchElementException on an empty deque, so loop on `queue.isNotEmpty()` or use `removeFirstOrNull()`.',
  },
];

// Timed DSA rounds: two real coding questions per round, ten minutes each.
// These are the problems that keep showing up in Android screening rounds
// (pair with target sum, frequency counting, in-place array work, Kadane,
// bracket matching, sliding window).
export const DSA_ROUND_QUESTIONS: PracticeCodeQuestion[] = [
  {
    id: 'dsa-code-01', topic: 'dsa', difficulty: 'junior', test: 'dsa-round-1',
    prompt: 'Implement `twoSum` so it returns the indices of the two entries in `nums` that add up to `target`. Exactly one valid pair exists and you may not use the same element twice.',
    code: `// Example 1
// Input:  nums = [2, 7, 11, 15], target = 9
// Output: [0, 1]        (nums[0] + nums[1] == 9)
//
// Example 2
// Input:  nums = [3, 2, 4], target = 6
// Output: [1, 2]        (nums[1] + nums[2] == 6)
//
// Constraints: 2 <= nums.size <= 10^4, exactly one valid pair, an element cannot be reused.

fun twoSum(nums: IntArray, target: Int): IntArray {
    // write your solution
}`,
    reference: `fun twoSum(nums: IntArray, target: Int): IntArray {
    val seen = HashMap<Int, Int>()
    for (i in nums.indices) {
        val complement = target - nums[i]
        seen[complement]?.let { return intArrayOf(it, i) }
        seen[nums[i]] = i
    }
    return intArrayOf()
}`,
    explanation: 'A single-pass hash map stores each value against its index, and for every element you check whether its complement target - nums[i] was already seen. That turns the brute-force O(n^2) double loop into O(n) time and O(n) space. The follow-up interviewers press on is duplicate values, which is why you look up the complement before inserting the current index.',
  },
  {
    id: 'dsa-code-02', topic: 'dsa', difficulty: 'junior', test: 'dsa-round-1',
    prompt: 'Implement `firstUniqChar` so it returns the index of the first non-repeating character in `s`, or -1 when every character repeats.',
    code: `// Example 1
// Input:  s = "leetcode"
// Output: 0             ('l' occurs once and appears first)
//
// Example 2
// Input:  s = "loveleetcode"
// Output: 2             ('v' is the earliest character that never repeats)
//
// Example 3
// Input:  s = "aabb"
// Output: -1            (every character repeats)
//
// Constraints: 1 <= s.length <= 10^5, s contains only lowercase English letters.

fun firstUniqChar(s: String): Int {
    // write your solution
}`,
    reference: `fun firstUniqChar(s: String): Int {
    val counts = IntArray(26)
    for (c in s) counts[c - 'a']++
    for (i in s.indices) {
        if (counts[s[i] - 'a'] == 1) return i
    }
    return -1
}`,
    explanation: 'Two passes over the string: the first tallies each letter into a fixed 26-slot frequency array, and the second returns the index of the earliest letter whose count is one. It runs in O(n) time and O(1) space because the alphabet size is constant. The edge case interviewers check is a string with no unique letter, which must return -1 rather than 0 or the length.',
  },
  {
    id: 'dsa-code-03', topic: 'dsa', difficulty: 'mid', test: 'dsa-round-2',
    prompt: 'Implement `moveZeroes` so it shifts every 0 in `nums` to the end while preserving the relative order of the non-zero elements, modifying the array in place.',
    code: `// Example 1
// Input:  nums = [0, 1, 0, 3, 12]
// Output: [1, 3, 12, 0, 0]
//
// Example 2
// Input:  nums = [0, 0]
// Output: [0, 0]        (no non-zero values to move)
//
// Constraints: 1 <= nums.size <= 10^4, mutate in place with O(1) extra space.

fun moveZeroes(nums: IntArray): Unit {
    // write your solution
}`,
    reference: `fun moveZeroes(nums: IntArray) {
    var write = 0
    for (read in nums.indices) {
        if (nums[read] != 0) {
            val temp = nums[write]
            nums[write] = nums[read]
            nums[read] = temp
            write++
        }
    }
}`,
    explanation: 'A write pointer marks where the next non-zero value belongs, and a read pointer scans the array swapping each non-zero element into the write slot before advancing. That packs the non-zeros forward and lets the zeros fall to the tail in O(n) time and O(1) space. Interviewers probe the all-non-zero input, where an element swapped with itself must not disturb the existing order.',
  },
  {
    id: 'dsa-code-04', topic: 'dsa', difficulty: 'mid', test: 'dsa-round-2',
    prompt: 'Implement `maxSubArray` so it returns the largest sum obtainable from any contiguous, non-empty subarray of `nums`.',
    code: `// Example 1
// Input:  nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
// Output: 6             (the subarray [4, -1, 2, 1] sums to 6)
//
// Example 2
// Input:  nums = [-3, -1, -2]
// Output: -1            (all negative, so the best is the single largest element)
//
// Constraints: 1 <= nums.size <= 10^5, the chosen subarray must hold at least one element.

fun maxSubArray(nums: IntArray): Int {
    // write your solution
}`,
    reference: `fun maxSubArray(nums: IntArray): Int {
    var best = nums[0]
    var current = nums[0]
    for (i in 1 until nums.size) {
        current = maxOf(nums[i], current + nums[i])
        best = maxOf(best, current)
    }
    return best
}`,
    explanation: 'Kadane\'s algorithm keeps a running best-ending-here sum and restarts it whenever starting fresh at the current element beats extending the previous subarray, while a second variable tracks the global maximum. It is O(n) time and O(1) space. The all-negative case is the classic trap: seeding both trackers with nums[0] rather than 0 makes the answer the largest single element instead of an empty-subarray sum.',
  },
  {
    id: 'dsa-code-05', topic: 'dsa', difficulty: 'mid', test: 'dsa-round-3',
    prompt: 'Implement `isValid` so it returns true only when every bracket in `s` (which contains only the characters (){}[]) is closed by the correct type in the correct order.',
    code: `// Example 1
// Input:  s = "()[]{}"
// Output: true
//
// Example 2
// Input:  s = "(]"
// Output: false         (the closer does not match the last opener)
//
// Example 3
// Input:  s = "([)]"
// Output: false         (brackets close in the wrong order)
//
// Constraints: 1 <= s.length <= 10^4, s contains only the characters ( ) { } [ ].

fun isValid(s: String): Boolean {
    // write your solution
}`,
    reference: `fun isValid(s: String): Boolean {
    val stack = ArrayDeque<Char>()
    val closerToOpener = mapOf(')' to '(', ']' to '[', '}' to '{')
    for (c in s) {
        val opener = closerToOpener[c]
        if (opener == null) {
            stack.addLast(c)
        } else if (stack.removeLastOrNull() != opener) {
            return false
        }
    }
    return stack.isEmpty()
}`,
    explanation: 'A stack holds each unmatched opener, and when a closer arrives you pop the top and confirm it is the matching opener, treating any mismatch or empty pop as invalid. Both time and space are O(n). The follow-up interviewers focus on is leftover openers such as ((( , which is why the final check requires the stack to be empty rather than merely never mismatching.',
  },
  {
    id: 'dsa-code-06', topic: 'dsa', difficulty: 'mid', test: 'dsa-round-3',
    prompt: 'Implement `lengthOfLongestSubstring` so it returns the length of the longest substring of `s` that contains no repeated character.',
    code: `// Example 1
// Input:  s = "abcabcbb"
// Output: 3             (the answer is abc)
//
// Example 2
// Input:  s = "bbbbb"
// Output: 1             (the answer is a single b)
//
// Example 3
// Input:  s = "pwwkew"
// Output: 3             (wke is a substring; pwke is only a subsequence)
//
// Constraints: 0 <= s.length <= 5 * 10^4, the answer must be a contiguous substring.

fun lengthOfLongestSubstring(s: String): Int {
    // write your solution
}`,
    reference: `fun lengthOfLongestSubstring(s: String): Int {
    val lastSeen = HashMap<Char, Int>()
    var start = 0
    var best = 0
    for (end in s.indices) {
        val c = s[end]
        lastSeen[c]?.let { if (it >= start) start = it + 1 }
        lastSeen[c] = end
        best = maxOf(best, end - start + 1)
    }
    return best
}`,
    explanation: 'A sliding window bounded by start and end grows rightward, and when the current character was last seen at or after start, the left edge jumps just past that previous index so the window never holds a duplicate. Tracking the widest window gives O(n) time and O(min(n, alphabet)) space. The empty string must return 0, and the bug interviewers watch for is failing to ignore a previous index that lies before the current window start.',
  },
];

export const PRACTICE_MCQS: PracticeMcq[] = [
  // Android fundamentals
  mcq('af-01', 'android-fundamentals', 'junior', 'Which lifecycle callback tells you the Activity is in the foreground and receiving user input?', ['onCreate', 'onStart', 'onResume', 'onRestart'], 2, '`onStart()` only makes the Activity visible; it can still sit behind a dialog or another translucent window. `onResume()` is where it owns the foreground and gets touch input, and `onPause()` is the exact moment it loses that.'),
  mcq('af-02', 'android-fundamentals', 'junior', 'A list loaded from the network must survive rotation without a second network call. Where should it live?', ['In an Activity property', 'In a ViewModel', 'In the onSaveInstanceState Bundle', 'In a companion object'], 1, 'A ViewModel is retained across configuration changes, so the recreated Activity reconnects to the same instance and data. The saved-state Bundle crosses a binder transaction with a size budget of roughly 1 MB, so a large list there risks TransactionTooLargeException. Statics survive too, but they leak and never get cleaned up.'),
  mcq('af-03', 'android-fundamentals', 'junior', 'You want to open a PDF with whatever app can handle it, without naming a specific app. What do you use?', ['An explicit Intent that names the target component', 'An implicit Intent with ACTION_VIEW and the MIME type', 'A PendingIntent obtained from the target application', 'A ContentProvider query against the media store'], 1, 'An implicit Intent declares what you want done (action plus data type) and the system resolves it against installed apps’ intent filters. Since Android 11, package visibility rules apply: to query handlers you may need a `<queries>` declaration in the manifest.'),
  mcq('af-04', 'android-fundamentals', 'mid', 'Which API should run work that must eventually complete even if the app is killed and the device reboots?', ['A started Service', 'Handler.postDelayed', 'WorkManager', 'lifecycleScope.launch'], 2, 'WorkManager persists each request in its own database and reschedules it after process death and reboot, honoring constraints like network or charging. A Service dies with the process, and Handler or lifecycleScope work simply disappears. For exact-time delivery you would reach for AlarmManager instead.'),
  mcq('af-05', 'android-fundamentals', 'mid', 'Why must BroadcastReceiver.onReceive() return quickly?', ['The receiver holds a partial wake lock that keeps draining the battery until onReceive returns', 'It runs on the main thread, and once it returns the process may be killed; blocking it risks an ANR', 'It runs in a separate broadcast process that the system tears down on a fixed schedule', 'The Context it receives is only valid until the next broadcast arrives in the queue'], 1, '`onReceive()` runs on the main thread, and once it returns the system considers the receiver done and may kill the process. Blocking it long enough triggers an ANR. Use `goAsync()` only for a few extra seconds of cleanup, and hand anything real to WorkManager.'),
  mcq('af-06', 'android-fundamentals', 'mid', 'A notification action needs to fire an operation as your app, even while your app is not running. What object carries that capability?', ['An explicit Intent', 'A PendingIntent', 'A Binder token', 'A Messenger'], 1, 'A PendingIntent wraps an Intent together with your app identity, so the system or another app can trigger that one operation later with your permissions. Since Android 12 you must pass FLAG_IMMUTABLE or FLAG_MUTABLE when creating one, or the call throws IllegalArgumentException.'),
  mcq('af-07', 'android-fundamentals', 'mid', 'Which of these needs an Activity context and breaks with the Application context?', ['Building a Room database', 'Enqueuing WorkManager work', 'Showing an AlertDialog', 'Creating an OkHttp client'], 2, 'A dialog attaches to the Activity window and inherits its theme, and the Application context has no window token, so WindowManager throws BadTokenException. The rule cuts both ways: long-lived singletons should take the Application context so they never pin a destroyed Activity in memory.'),
  mcq('af-08', 'android-fundamentals', 'mid', 'By default, what does the system do to a visible Activity when the device rotates?', ['Calls onPause and onResume only', 'Destroys and recreates it', 'Moves it to the back stack', 'Kills the whole app process'], 1, 'Rotation is a configuration change, so the Activity is torn down and rebuilt to load resources for the new configuration. ViewModels and saved instance state carry data across. Opting out with android:configChanges means you handle every resource difference yourself, which is rarely worth it.'),
  mcq('af-09', 'android-fundamentals', 'senior', 'Play Console shows an ANR spike after your latest release. What do you look at first?', ['Raise the ANR timeout in developer options', 'The ANR trace, starting with the main thread stack', 'StrictMode output from a debug build on your own device', 'Move every repository call to Dispatchers.IO'], 1, 'The trace shows exactly what the main thread was doing when the system gave up: a lock it was waiting on, a synchronous binder call, or disk I/O. Fixing threading before reading the evidence often hides the real cause. The timeout itself is fixed by the platform, about five seconds for input dispatch.'),
  mcq('af-10', 'android-fundamentals', 'senior', 'The system kills your backgrounded app to reclaim memory. Which value can be restored when the user comes back?', ['A property on the ViewModel', 'A value stored in SavedStateHandle', 'A field on the Application class', 'An in-flight coroutine in viewModelScope'], 1, 'SavedStateHandle plugs into the saved instance state mechanism, which the system persists across process death. A plain ViewModel property only survives configuration changes, because the ViewModel itself dies with the process. Application fields and running coroutines are gone the moment the process is.'),

  // Architecture and patterns
  mcq('ar-01', 'architecture', 'junior', 'What problem does the repository pattern actually solve?', ['It caches every network response automatically so no caller ever fetches the same data from the network twice', 'Callers get one stable API and never know whether data came from the network, a database, or a cache', 'It maps network DTOs into Kotlin data classes so upper layers never touch raw JSON', 'It keeps a single Activity alive so screens never have to reload their data from scratch'], 1, 'A repository is a boundary: ViewModels ask for domain data and the repository decides where it comes from. Note that caching is a policy you write inside it, not something the pattern gives you for free.'),
  mcq('ar-02', 'architecture', 'junior', 'In MVVM on Android, what should the ViewModel expose to the screen?', ['Direct references to the Views it updates on each change', 'Observable UI state plus functions that handle UI events', 'Room entities straight from the DAO for the layout to render', 'The NavController so the screen can trigger its own navigation'], 1, 'State flows down, events flow up: the screen renders whatever state the ViewModel publishes and calls back with user actions. The ViewModel must never hold a View or Activity reference, because it outlives them across rotation and would leak the destroyed screen.'),
  mcq('ar-03', 'architecture', 'junior', 'Why pass dependencies through the constructor instead of creating them inside the class?', ['Construction gets cheaper because the runtime can pool and reuse the injected instances', 'Tests can hand in fakes without touching global state, and the class declares exactly what it needs', 'It removes the need for interfaces because concrete types are wired in at the call site', 'It makes the class thread-safe because its dependencies can no longer change after construction'], 1, 'A hidden `Repository()` call inside a class welds it to the real implementation. Constructor injection makes requirements visible at the creation site and lets a test pass a deterministic fake. This works with or without a DI framework; Hilt just automates the wiring.'),
  mcq('ar-04', 'architecture', 'mid', 'In unidirectional data flow, what is the only path by which the UI changes?', ['Any layer may mutate shared state as long as it posts the change back to the main thread', 'The UI sends an event up, the state holder produces new state, and the UI re-renders from it', 'The repository observes the UI and pushes fresh view updates whenever its data changes', 'Each screen keeps its own private copy of app state and syncs it with the others on every navigation'], 1, 'Every state change funnels through one owner, so you can always answer "who changed this and why" by looking at the event that came in. The moment two places can write the same state, you are back to debugging race conditions between them.'),
  mcq('ar-05', 'architecture', 'mid', 'Your domain layer imports android.content.Context. What is the accepted fix?', ['Annotate the use case with @JvmStatic so it never holds an instance reference to the Context', 'Define an interface in the domain layer and implement it with the Context in an outer layer', 'Make the use case a suspend function so the Context is only touched off the main thread', 'Move the use case into the ViewModel, which is allowed to hold framework references'], 1, 'The domain layer stays pure Kotlin so it runs in plain JVM unit tests and never breaks when the framework changes. Anything that genuinely needs Android, like reading a resource or a system service, sits behind a domain-owned interface that the data or app layer implements.'),
  mcq('ar-06', 'architecture', 'mid', 'You choose between three retry policies at runtime, all behind one interface. Which pattern is that?', ['Observer', 'Strategy', 'Builder', 'Decorator'], 1, 'Strategy means interchangeable algorithms behind a single contract, selected at runtime. Decorator is the near-miss distractor: it wraps an existing implementation to add behavior around it, rather than swapping the algorithm itself.'),
  mcq('ar-07', 'architecture', 'mid', 'Why model screen state as a sealed interface with Loading, Content, and Error instead of three Boolean flags?', ['Sealed types serialize faster than Booleans when state is written into the saved instance Bundle', 'Only one state can exist at a time, and the compiler checks when expressions for exhaustiveness', 'Boolean flags cannot back Compose state, so changing them never triggers recomposition on its own', 'Sealed hierarchies share one instance per state, so state changes allocate no new objects'], 1, 'Three Booleans allow eight combinations, and most of them are nonsense, like loading and error at once. A sealed hierarchy makes those states unrepresentable, and adding a new state turns every non-exhaustive `when` into a compile error instead of a silent bug.'),
  mcq('ar-08', 'architecture', 'mid', 'Which of these belongs in SavedStateHandle?', ['The id of the currently selected item', 'A decoded full-resolution Bitmap', 'An open Room database transaction', 'The full contents of the repository cache'], 0, 'SavedStateHandle is for the small keys you need to rebuild a screen after process death: ids, query text, scroll anchors. It rides the saved instance state Bundle through a binder transaction, so large objects risk TransactionTooLargeException. Reload heavy data from storage using the saved id.'),
  mcq('ar-09', 'architecture', 'senior', 'When does a separate use-case class between ViewModel and repository actually pay for itself?', ['Whenever a ViewModel calls any repository method, so every data access goes through one', 'When real business policy coordinates several repositories or is reused by more than one screen', 'When you need somewhere to inject a coroutine dispatcher without touching the repository', 'When the repository returns a Flow that must be converted to LiveData before the UI sees it'], 1, 'A use case earns its file when it owns logic: validation, orchestration across sources, or a rule several screens share. A one-line pass-through like `operator fun invoke() = repo.getUser()` adds a layer of indirection with nothing inside it.'),
  mcq('ar-10', 'architecture', 'senior', 'What is the realistic cost of splitting an app into too many small Gradle modules?', ['Modules stop being able to share code, so common utilities end up duplicated into every feature module', 'Wiring, api/implementation boundaries, and build configuration overhead outweigh the isolation gained', 'R8 loses the ability to inline or strip code across module boundaries in the release build', 'Each module needs its own Application class and manifest merge rules to stay installable'], 1, 'Modules pay off when they enforce ownership or let Gradle skip rebuilding unchanged code. Split past that and every feature touches five build files, navigation crosses artificial seams, and configuration time grows, while the boundaries no longer map to anything a team actually owns.'),

  // Code output
  mcq('co-01', 'code-snippet-output', 'junior', 'What does `listOf(1, 2, 3).map { it * 2 }` return?', ['[1, 2, 3]', '[2, 4, 6]', '[2, 3, 4]', 'It does not compile because the list is read-only'], 1, '`map` calls the transform once per element and collects the results into a new list; the original is untouched. Read-only limits mutation through `add` or `remove`, not building transformed copies.'),
  mcq('co-02', 'code-snippet-output', 'junior', 'Given `val name: String? = null`, what does `name ?: "fallback"` evaluate to?', ['null', 'fallback', 'It throws NullPointerException', 'It does not compile'], 1, 'The Elvis operator returns the left side when it is non-null and only then evaluates the right side. The right side can also be `return` or `throw`, which is a tidy way to bail out of a function on missing data.'),
  mcq('co-03', 'code-snippet-output', 'junior', 'What does `runCatching { error("boom") }.isFailure` evaluate to?', ['true', 'false', 'It never evaluates; the IllegalStateException propagates to the caller', 'null'], 0, '`error()` throws IllegalStateException, and `runCatching` catches it into a failed Result, so `isFailure` is true. Worth knowing before you sprinkle it everywhere: it also catches CancellationException, which can quietly break coroutine cancellation if you never rethrow it.'),
  mcq('co-04', 'code-snippet-output', 'mid', 'After `val x = mutableListOf(1); val y = x; y += 2`, what is `x`?', ['[1]', '[2]', '[1, 2]', 'It does not compile because y is a val'], 2, '`x` and `y` point at the same MutableList instance. On a MutableList, `+=` compiles to `plusAssign`, which mutates the shared list in place, so the change shows through both names. `val` freezes the reference, never the object behind it.'),
  mcq('co-05', 'code-snippet-output', 'mid', 'What does `listOf("a", "bb").associateBy { it.length }` return?', ['{a=1, bb=2}', '{1=a, 2=bb}', '{1=[a], 2=[bb]}', 'It does not compile because map keys must be strings'], 1, '`associateBy` uses the selector result as the key and the original element as the value. If two elements produce the same key, the later one silently replaces the earlier one; when you need to keep all of them, that is `groupBy`.'),
  mcq('co-06', 'code-snippet-output', 'mid', 'Given `val s: String? = null`, what happens when `println(s!!.length)` runs?', ['It prints 0', 'It prints null', 'It throws NullPointerException before println executes', 'It does not compile because .length needs a safe call on a nullable String'], 2, '`!!` tells the compiler to trust you, so it compiles fine. At runtime the null check happens when `s!!` is evaluated, throwing NullPointerException before `.length` or `println` ever run. Every `!!` in a codebase is a bet that someone eventually loses.'),
  mcq('co-07', 'code-snippet-output', 'mid', 'What does `sequenceOf(1, 2, 3).filter { it > 1 }.first()` return?', ['1', '2', '3', 'The list [2, 3]'], 1, 'Sequences are lazy: `first()` pulls elements one at a time until the predicate passes. It rejects 1, accepts 2, and stops; 3 is never even examined. The list version would filter everything first and then take the head.'),
  mcq('co-08', 'code-snippet-output', 'mid', 'Given `data class User(val id: Int)`, what does `User(1) == User(1)` return?', ['true', 'false', 'It depends on whether hashCode was called first', 'It does not compile without overriding equals'], 0, 'For a data class, `==` calls the generated `equals`, which compares primary-constructor properties, so equal ids mean equal objects. `===` on the same two instances returns false, because they are distinct objects on the heap.'),
  mcq('co-09', 'code-snippet-output', 'senior', 'Inside a lambda passed to an inline function, what does a bare `return` do?', ['Returns from the lambda only, exactly like a labeled return@ would', 'Returns from the function that called the inline function', 'It compiles, but throws IllegalStateException when the lambda runs', 'It never compiles, because bare return is forbidden in every lambda'], 1, 'Because the lambda body is inlined into the caller, a bare `return` is a non-local return from the enclosing function, exactly like `return` inside a `forEach`. Mark the parameter `crossinline` to forbid it. In a non-inline lambda, only labeled returns like `return@map` compile.'),
  mcq('co-10', 'code-snippet-output', 'senior', 'A Flow producer emits faster than the collector can process. What does adding `conflate()` guarantee?', ['Every emitted value is still delivered to the collector, just later than it was produced', 'The collector always gets the most recent value, and intermediate values may be dropped', 'The producer suspends at each emission until the collector finishes the previous value', 'All pending values are buffered without limit until the collector drains the backlog'], 1, '`conflate()` lets the producer run ahead and keeps only the latest pending value, dropping the ones in between. That is the right trade for UI state, where only the newest value matters. The default with no operator is the opposite: the producer suspends until the collector is ready.'),

  // Last-minute Kotlin DSA sprint
  mcq('kd-01', 'kotlin', 'junior', 'After mutating the list, what does this code print?', ['[1, 2]', '[1, 2, 3]', '[3]', 'It does not compile because values is a val'], 1, '`values` is a read-only reference to a mutable list, so `add` works fine and the print shows `[1, 2, 3]`. `val` stops you reassigning `values`, not mutating the object it points to.', { test: 'kotlin-dsa', code: 'val values = mutableListOf(1, 2)\nvalues.add(3)\nprintln(values)' }),
  mcq('kd-02', 'kotlin', 'junior', 'Which indices does this exclusive range print?', ['0 1 2 3', '0 1 2', '1 2 3', '1 2'], 1, '`until` excludes the upper bound, so the loop visits 0, 1, and 2 and never touches 3. That is exactly why `0 until size` is the safe idiom for array indices.', { test: 'kotlin-dsa', code: 'for (i in 0 until 3) print("$i ")' }),
  mcq('kd-03', 'kotlin', 'junior', 'Which substring does this half-open range print?', ['otl', 'otli', 'Kot', 'tli'], 0, '`substring(1, 4)` includes index 1 and excludes index 4, so it takes the characters at indices 1, 2, and 3: `otl`. Passing an end index past the length throws StringIndexOutOfBoundsException.', { test: 'kotlin-dsa', code: 'val word = "Kotlin"\nprintln(word.substring(1, 4))' }),
  mcq('kd-04', 'kotlin', 'mid', 'What count does this map lookup print?', ['1', '2', 'null', 'It throws NullPointerException'], 1, 'The key exists, so `getOrDefault` returns the stored 1 and the expression prints 2. The default only kicks in for missing keys, which is what makes this the standard frequency-count idiom.', { test: 'kotlin-dsa', code: 'val counts = mutableMapOf(\'a\' to 1)\nprintln(counts.getOrDefault(\'a\', 0) + 1)' }),
  mcq('kd-05', 'kotlin', 'mid', 'What remains at the top of this stack?', ['10', '20', 'null', 'The deque is empty'], 0, 'Using `addLast` and `removeLast` makes the deque behave as a stack. 20 went on last, so it comes off first, leaving 10 on top. `last()` on an empty deque would throw NoSuchElementException.', { test: 'kotlin-dsa', code: 'val stack = ArrayDeque<Int>()\nstack.addLast(10)\nstack.addLast(20)\nstack.removeLast()\nprintln(stack.last())' }),
  mcq('kd-06', 'kotlin', 'mid', 'In what order are the original and sorted arrays printed?', ['[1, 2, 3] then [1, 2, 3]', '[3, 2, 1] then [3, 2, 1]', '[1, 2, 3] then [3, 1, 2]', '[3, 1, 2] then [1, 2, 3]'], 3, '`sortedArray` returns a sorted copy and leaves the receiver untouched, so `values` still prints `[3, 1, 2]`. The in-place counterpart is `sort()`. Mixing up which functions copy and which mutate is a classic source of interview slips.', { test: 'kotlin-dsa', code: 'val values = intArrayOf(3, 1, 2)\nval sorted = values.sortedArray()\nprintln(values.contentToString())\nprintln(sorted.contentToString())' }),
  mcq('kd-07', 'kotlin', 'mid', 'What does this safe-call and Elvis expression print?', ['fallback', 'null', '0', 'It throws NullPointerException'], 0, 'The safe call `name?.length` short-circuits to null because `name` is null, and the Elvis operator then supplies `fallback`. No NullPointerException is possible on this line; that would need `!!`.', { test: 'kotlin-dsa', code: 'val name: String? = null\nprintln(name?.length ?: "fallback")' }),
  mcq('kd-08', 'kotlin', 'mid', 'What sum is produced by visiting the even indices?', ['4', '5', '6', 'The loop reads past the array'], 1, '`indices` yields 0, 1, 2. The filter keeps indices 0 and 2, whose values are 1 and 4, so the sum is 5. Note the question is about even indices, not even values; misreading that is the trap.', { test: 'kotlin-dsa', code: 'val nums = intArrayOf(1, 2, 4)\nvar sum = 0\nfor (i in nums.indices) {\n    if (i % 2 == 0) sum += nums[i]\n}\nprintln(sum)' }),

  // Coroutines and Flow
  mcq('cf-01', 'coroutines', 'junior', 'What does marking a function `suspend` actually guarantee?', ['The runtime moves it to a background thread automatically so it can never block the UI', 'It can pause and resume without blocking its thread; the dispatcher decides which thread runs it', 'Each call launches a new coroutine, so the caller continues without waiting for the result', 'Any exception it throws is wrapped into a Result value instead of crashing the caller'], 1, 'The compiler turns a suspend function into a state machine that can park and resume around suspension points. It says nothing about threads: a suspend function called on Dispatchers.Main runs on the main thread until something like `withContext` or `delay` suspends it.'),
  mcq('cf-02', 'coroutines', 'junior', 'What is the difference between `launch` and `async`?', ['Both return a Job and behave identically; async is an older name kept for compatibility', 'launch is fire-and-forget and returns a Job; async returns a Deferred you await() for the result', 'async blocks the calling thread until the value is ready; launch returns immediately with a Job', 'launch cannot be cancelled once started, while async can be cancelled through its Deferred'], 1, 'Use `launch` when you need the side effect and `async` when you need the value back. The classic trap: an `async` failure is deferred until `await()`, so a Deferred nobody awaits can hide its exception until the parent scope fails.'),
  mcq('cf-03', 'coroutines', 'junior', 'Why is GlobalScope discouraged for normal app work?', ['It forces every coroutine onto the main thread unless each launch overrides the dispatcher', 'Its coroutines live as long as the process, so nothing cancels them when the screen that started them dies', 'It cannot call suspend functions directly, so everything needs an extra withContext wrapper', 'All of its coroutines share one worker thread, so a single blocking call stalls every other coroutine in it'], 1, 'Work launched in GlobalScope keeps running, and keeps referencing whatever it captured, long after the screen that wanted it is gone. viewModelScope and lifecycleScope exist precisely so cancellation follows ownership. GlobalScope is for process-lifetime work, which is rare.'),
  mcq('cf-04', 'coroutines', 'mid', 'One child coroutine inside `coroutineScope { }` throws IOException. What happens to its siblings?', ['They keep running to completion because each child owns an independent Job', 'They are cancelled, and the scope rethrows the IOException to its caller', 'They are allowed to finish first, and the scope throws the IOException afterwards', 'The exception is dropped silently unless a CoroutineExceptionHandler is installed'], 1, 'That is structured concurrency: a failing child cancels the parent, which cancels every sibling, and the exception propagates out of the scope. When siblings must survive each other, use `supervisorScope`, and give each child its own error handling.'),
  mcq('cf-05', 'coroutines', 'mid', 'A search field emits a new query on every keystroke, and each query starts a network Flow. Which operator cancels the stale request when a new query arrives?', ['flatMapConcat', 'flatMapLatest', 'flatMapMerge', 'debounce'], 1, '`flatMapLatest` cancels the previous inner Flow the moment upstream emits again, so a slow response for "andr" can never overwrite results for "android". `flatMapConcat` queues the stale request and `flatMapMerge` runs both to completion; `debounce` only delays keystrokes and cancels nothing.'),
  mcq('cf-06', 'coroutines', 'mid', 'Which type always holds a current value and hands it to every new collector immediately?', ['SharedFlow', 'StateFlow', 'Channel', 'A cold Flow built with flow { }'], 1, 'StateFlow always has `.value`, replays it to new collectors, and skips emissions equal to the current value. SharedFlow can be configured with replay but has no required current value, which is why one-off events fit SharedFlow and screen state fits StateFlow.'),
  mcq('cf-07', 'coroutines', 'mid', 'What does `flowOn(Dispatchers.IO)` actually move?', ['The collector and every operator downstream of the call', 'The operators and producer upstream of the flowOn call', 'The whole chain, from the producer down to the collector', 'Only the terminal operator that starts the collection'], 1, '`flowOn` changes the context for the segment above it and leaves the collector in its own context. That boundary is the whole point: the flow can read disk on IO while the collector safely touches UI state on Main without any explicit thread hop.'),
  mcq('cf-08', 'coroutines', 'mid', 'Inside a coroutine on Dispatchers.Main, what is the difference between `delay(1000)` and `Thread.sleep(1000)`?', ['There is no observable difference; both pause this coroutine for one second either way', 'delay suspends the coroutine and frees the main thread; sleep blocks the thread and freezes the UI', 'sleep suspends the coroutine and frees the thread; delay blocks the main thread instead', 'delay throws IllegalStateException when called on Dispatchers.Main; it needs a background dispatcher'], 1, '`delay` schedules a resumption and releases the thread, so the UI keeps drawing. `Thread.sleep` holds the main thread hostage for the full second: frames drop, input queues up, and past a few seconds the system raises an ANR.'),
  mcq('cf-09', 'coroutines', 'senior', 'You are wrapping a callback-based API that returns one result and supports cancellation. What is the right bridge to coroutines?', ['runBlocking around the registration call so the callback result becomes the return value', 'suspendCancellableCoroutine, resuming exactly once and unregistering in invokeOnCancellation', 'GlobalScope.async writing into a CompletableDeferred that the caller awaits for the result', 'A busy-wait loop polling a volatile field that the callback sets when the result arrives'], 1, 'For a single-shot callback, `suspendCancellableCoroutine` turns registration into a suspension point; the contract is resume exactly once and clean up the callback in `invokeOnCancellation`. When the API delivers a stream of callbacks instead, the equivalent tool is `callbackFlow`.'),
  mcq('cf-10', 'coroutines', 'senior', 'What does building a scope with SupervisorJob change about failures?', ['Children can no longer be cancelled by the parent', 'A failed child no longer cancels its sibling coroutines', 'Unhandled exceptions are retried automatically', 'All children are moved onto Dispatchers.IO unless told otherwise'], 1, 'SupervisorJob cuts the child-to-parent failure propagation while keeping parent-to-child cancellation, which is why viewModelScope uses one: a crashed refresh must not kill an unrelated collector. Each child still needs its own handling, or the exception hits the CoroutineExceptionHandler.'),

  // Jetpack Compose
  mcq('jc-01', 'jetpack-compose', 'junior', 'How long does a value stored with `remember { }` survive?', ['Until the process is killed, including across every configuration change in between', 'As long as its call site stays in the composition; it is lost when the Activity is recreated', 'For the lifetime of the ViewModel that owns the screen the composable is part of', 'Until the user leaves the app, at which point the composition is discarded along with the task'], 1, '`remember` caches a value in the composition, keyed by call position, so it survives recomposition. Leave the composition or rotate the device and it is gone. When the value should survive recreation, that is `rememberSaveable`; when it should survive navigation, it belongs in a ViewModel.'),
  mcq('jc-02', 'jetpack-compose', 'junior', 'What causes a composable scope to be scheduled for recomposition?', ['Any function call inside it that returns a different value than last time', 'A change to a snapshot State value that the scope read during composition', 'Every new display frame, so recomposition runs at the screen refresh rate', 'Only a configuration change or an explicit invalidation of the hierarchy'], 1, 'Compose records which State objects each scope reads while composing. When one of those values changes, only the scopes that read it are invalidated. State nobody reads can change all day without a single recomposition, which is the key to writing cheap UI.'),
  mcq('jc-03', 'jetpack-compose', 'junior', 'What does `rememberSaveable` add over plain `remember`?', ['Nothing today; rememberSaveable is a deprecated alias kept for source compatibility', 'The value also survives Activity recreation and process death via saved instance state', 'The value is persisted to DataStore on every change and reloaded when the app restarts', 'The value becomes observable, so writing to it schedules recomposition of its readers'], 1, '`rememberSaveable` routes the value through the saved instance state Bundle, so rotation and process death restore it. Anything that is not Bundle-friendly needs a custom Saver. Keep it small: this path has the same binder size limits as onSaveInstanceState.'),
  mcq('jc-04', 'jetpack-compose', 'mid', 'Why should items in a LazyColumn whose data reorders have stable keys?', ['Keys tell the paging library which network page each row belongs to during reloads', 'Keys let remembered state and animations move with the item instead of staying at the old position', 'Keys keep every item composed permanently so scrolling back never recomposes a row', 'The Compose compiler needs stable keys to generate skippable code for every item lambda in the list'], 1, 'Without keys, item state is positional: delete row 3 and row 4 inherits its state, like a stale swipe or checkbox. With stable ids, identity follows the data. Duplicate keys crash with IllegalArgumentException, so derive them from something genuinely unique.'),
  mcq('jc-05', 'jetpack-compose', 'mid', 'When is the coroutine inside `LaunchedEffect(userId)` cancelled and relaunched?', ['On every recomposition of the composable that contains the effect', 'When userId changes, or when the effect leaves the composition entirely', 'Only when the composition is destroyed, such as a process restart', 'Whenever any snapshot state read in the same composable changes'], 1, 'The effect keeps running across recompositions while the key stays equal. A new `userId` cancels the running coroutine and starts a fresh one, and leaving composition cancels it for good. Passing `Unit` as the key means "run once per composition lifetime".'),
  mcq('jc-06', 'jetpack-compose', 'mid', 'A "scroll to top" button should appear once the first visible index of a LazyColumn passes 10. Which API avoids recomposing on every scrolled pixel?', ['rememberUpdatedState(listState.firstVisibleItemIndex > 10)', 'derivedStateOf { listState.firstVisibleItemIndex > 10 }', 'rememberSaveable { listState.firstVisibleItemIndex > 10 }', 'LaunchedEffect(listState.firstVisibleItemIndex > 10) { }'], 1, 'Reading `firstVisibleItemIndex` directly in composition recomposes on every scroll frame. Wrapping the comparison in `derivedStateOf` means readers are only invalidated when the Boolean actually flips from false to true or back, which is a handful of times instead of hundreds.'),
  mcq('jc-07', 'jetpack-compose', 'mid', 'What does "state hoisting" mean in Compose?', ['Persisting state to disk before each recomposition so a crash cannot lose user input', 'Moving state up to the caller, which passes the value down and receives changes through a callback', 'Moving state into a shared singleton so that any composable in the tree can read and update it directly', 'Upgrading remember to rememberSaveable so the state also survives Activity recreation'], 1, 'The hoisted composable takes `value` and `onValueChange` and owns nothing, exactly like TextField. That keeps a single source of truth in the caller and makes the composable reusable, previewable, and trivial to test, because its entire behavior is inputs in, events out.'),
  mcq('jc-08', 'jetpack-compose', 'mid', 'Where should expensive work like sorting a large list not happen?', ['In the ViewModel while it produces the UI state', 'Directly in a composable body that recomposes often', 'In the repository layer where the data is first loaded', 'Behind remember with the list as its key'], 1, 'A composable body can rerun at high frequency, and re-sorting on each pass burns frame budget. Produce derived data in the ViewModel, or at minimum cache it with `remember(list)` so it recomputes only when the input actually changes.'),
  mcq('jc-09', 'jetpack-compose', 'senior', 'A value animates every frame. Where should you read it so the smallest part of the pipeline reruns?', ['In composition, at the top of the composable function', 'In the draw phase, inside a drawBehind or graphicsLayer lambda', 'In the ViewModel, so the animation runs off the UI thread', 'In a LaunchedEffect that copies each frame into a state variable'], 1, 'Compose invalidates the phase where a state read happens. Read the animated value only inside a draw lambda and each frame redraws pixels without recomposing or re-measuring anything. Reading it in composition instead drags the whole scope through every frame of the animation.'),
  mcq('jc-10', 'jetpack-compose', 'senior', 'A long-running LaunchedEffect must call the latest `onTimeout` lambda without being restarted when that lambda changes. What do you use?', ['Add onTimeout to the LaunchedEffect keys so the coroutine always sees it', 'val current by rememberUpdatedState(onTimeout) inside the effect', 'Switch to DisposableEffect and re-register onTimeout inside onDispose', 'Capture onTimeout in a remember { } block with no key inside the effect'], 1, '`rememberUpdatedState` gives the running effect a stable holder whose value recomposition keeps fresh, so the timer survives and still calls the newest callback when it fires. Putting the lambda in the keys would restart the countdown every time the caller recomposes.'),

  // Kotlin
  mcq('kt-01', 'kotlin', 'junior', 'What does the type `String?` mean in Kotlin?', ['A mutable String whose contents can be edited in place after construction', 'A String that may be null, which the compiler forces you to handle before member access', 'A platform type imported from Java whose nullability the compiler cannot verify', 'A String whose initialization is deferred until the first time it is read'], 1, 'Nullability is part of the type system: you cannot call `.length` on a `String?` until you have dealt with the null case via `?.`, `?:`, a check, or `!!`. Platform types are the separate case: values from Java arrive with unknown nullability written as `String!`.'),
  mcq('kt-02', 'kotlin', 'junior', 'What is the difference between `==` and `===` in Kotlin?', ['They are interchangeable; the compiler rewrites both to the same equals() call', '== calls equals() for structural equality; === checks both references point at one instance', '== compares references for identity; === calls equals() for structural equality', '=== compares values, but it only compiles for primitive types and their boxed wrapper classes'], 1, '`==` is null-safe structural equality that compiles to `equals()`, so two data class instances with equal properties are `==`. `===` is identity. Fun edge: small boxed Ints are cached by the JVM, so `===` on boxed 100 can be true while boxed 1000 is false.'),
  mcq('kt-03', 'kotlin', 'junior', 'Which members does a data class generate from its primary constructor properties?', ['Only the constructor, with everything else inherited from Any', 'equals, hashCode, toString, copy, and componentN functions', 'equals, hashCode, toString, and a Parcelable implementation', 'copy, componentN functions, a builder, and a JSON serializer'], 1, 'The generated members come from primary-constructor properties only. A property declared in the class body is excluded from equality, hashing, copy, and destructuring, which surprises people when two "equal" objects differ in a body property.'),
  mcq('kt-04', 'kotlin', 'mid', 'When is `lateinit` the right choice for a property?', ['For a nullable Int that should fall back to a default value before first use', 'For a non-null var initialized after construction, like a field a framework injects later', 'For an expensive val whose value should only be computed on its first access', 'For constants that have to be resolved at compile time rather than when the class is loaded'], 1, 'lateinit defers initialization of a non-null `var` reference type; reading it early throws UninitializedPropertyAccessException, and `::field.isInitialized` lets you check. It does not work on primitives or `val`. The lazy-computed `val` case is `by lazy { }` instead.'),
  mcq('kt-05', 'kotlin', 'mid', 'What does declaring a generic type as `out T` mean?', ['T only appears in input positions, making the type contravariant: a Consumer<Animal> works as a Consumer<Dog>', 'T only appears in output positions, making the type covariant: a Producer<Dog> works as a Producer<Animal>', 'T gets a nullable upper bound, so every use of T inside the class must be null-checked', 'T is reified for this type, so it stays available at runtime despite erasure'], 1, '`out` declares the type is a producer of T, never a consumer, and the compiler enforces it. That is what lets `List<Dog>` be passed where `List<Animal>` is expected, while `MutableList` cannot, because adding an Animal to a list of Dogs must stay illegal.'),
  mcq('kt-06', 'kotlin', 'mid', 'What does `sealed` give you that an ordinary open class does not?', ['Subclasses may be declared in any module, so feature modules can add their own subtypes', 'The compiler knows every direct subtype, so a when over it is exhaustive without an else', 'Each subtype is instantiated once and shared, exactly like an object declaration', 'Subtypes automatically implement Parcelable so they can cross process boundaries'], 1, 'Direct subtypes of a sealed type must live in the same package and module, so the compiler has the full list. Add a new subtype and every non-exhaustive `when` breaks the build, which is exactly what you want for UI state and navigation results. Unlike enums, each subtype carries its own data.'),
  mcq('kt-07', 'kotlin', 'mid', 'When does converting a long collection chain to `asSequence()` actually help?', ['Always; sequences skip intermediate lists, so every chain gets strictly faster', 'On large inputs with chained operations, especially when a terminal like first() stops early', 'Only on small lists, where the sequence machinery is cheap enough to pay for itself', 'Whenever the chain needs indexed random access into the intermediate results'], 1, 'Each list operator materializes a full intermediate list, while a sequence pulls one element through the whole chain at a time and can short-circuit. On a five-element list the sequence machinery costs more than it saves, so this is a "measure on real data" answer, not a reflex.'),
  mcq('kt-08', 'kotlin', 'mid', 'How are extension functions dispatched?', ['Dynamically, based on the runtime type of the receiver object', 'Statically, based on the compile-time type of the receiver', 'Through reflection the first time each call site executes', 'Via a generated subclass that overrides the receiver type'], 1, 'An extension compiles to a static function with the receiver as its first parameter, so the declared type decides which extension runs, not the runtime type. And when a member and an extension share a signature, the member always wins, silently.'),
  mcq('kt-09', 'kotlin', 'senior', 'What does a `reified` type parameter on an inline function enable?', ['Instantiating T directly with its no-argument constructor, as in T()', 'Using T at runtime, like `value is T` checks and `T::class`, without a Class parameter', 'Making T covariant, so subtypes of T are accepted wherever T is produced', 'Turning off type erasure for T across the whole program, not just this function'], 1, 'Because the function is inlined, the compiler substitutes the concrete type at each call site, so the type survives where erasure would normally destroy it. This is how `Gson.fromJson<User>(json)` style APIs work. It applies only inside that inline function, not to generics globally.'),
  mcq('kt-10', 'kotlin', 'senior', 'What is the `Nothing` type for?', ['A lighter-weight alias of Unit for functions that have nothing useful to return to their callers', 'The type of expressions that never return normally, such as a throw; a subtype of every type', 'A marker interface collections implement to advertise that they are always empty', 'The default upper bound of type parameters when no constraint is declared'], 1, '`Nothing` has zero values, and being a subtype of everything lets a `throw` or `TODO()` sit anywhere an expression is expected: `val name = user.name ?: error("missing")` types as String. The default upper bound of type parameters is `Any?`, a different thing entirely.'),

  // Mobile system design
  mcq('sd-01', 'system-design', 'junior', 'In an offline-first app, what does the UI observe as its single source of truth?', ['The most recent network response, cached until the next request', 'The local database, which background sync keeps updated', 'Push notification payloads that carry the data each screen needs', 'An in-memory cache owned by the Activity, refilled on every launch'], 1, 'The UI renders from local storage, so the app works identically with or without a connection. Sync writes remote changes into that store rather than racing the UI with a second source of truth. Room plus a Flow-emitting DAO is the standard shape of this on Android.'),
  mcq('sd-02', 'system-design', 'junior', 'A feed gets new posts constantly. Why does cursor pagination hold up where offset pagination breaks?', ['Cursors compress each response, so pages stay small even as the feed keeps growing', 'Inserts shift offset boundaries, duplicating or skipping items; a cursor resumes from a stable key', 'Cursors make every page immutable, so the client can cache each one of them forever', 'Offset pagination cannot apply a custom sort order, so new posts surface at the wrong end'], 1, 'Page 2 with offset 20 means "rows 20 to 39 right now", and ten new posts shift everything, so users see repeats or holes. A cursor like "items after id 1041" pins the position to data, not to a count, so it survives concurrent writes.'),
  mcq('sd-03', 'system-design', 'junior', 'A payment request times out and the client retries. What stops the card being charged twice?', ['TLS on the retry, so the gateway can detect the request was already delivered once', 'An idempotency key: the server stores the first outcome and returns it for any duplicate', 'A shorter connect timeout, so the retry fires before the first charge can settle', 'Retrying only on unmetered networks, where duplicate submissions get filtered upstream'], 1, 'A timeout tells you nothing: the first request may have succeeded just before the response was lost. The client sends the same generated key on the retry, and the server recognizes it and replays the original result instead of executing the charge again.'),
  mcq('sd-04', 'system-design', 'mid', 'Which caching policy shows cached data instantly and refreshes it in the background?', ['Write-through', 'Stale-while-revalidate', 'No-store', 'Cache-only with manual invalidation'], 1, 'Serve what you have, fetch in the background, update when it lands: users see content in one frame instead of a spinner. The design question it forces is how stale is acceptable, and whether the product needs a visible "updated just now" signal for trust.'),
  mcq('sd-05', 'system-design', 'mid', 'Why should exponential backoff include random jitter?', ['It shortens the average wait, because most clients draw a delay below the base backoff', 'Without it, clients that failed together retry together, hitting the recovering server in waves', 'It removes the need for a retry cap, since randomized retries can never pile up', 'It hides the retry pattern from server-side rate limiters, so retried requests avoid being throttled'], 1, 'After a shared outage, thousands of devices hit the same backoff schedule and retry in the same second, which can knock the service back over. Randomizing each delay spreads the load. Retries should also be capped and reserved for transient, safe-to-repeat failures.'),
  mcq('sd-06', 'system-design', 'mid', 'Five in-flight requests all fail with 401 because the access token just expired. What should the client do?', ['Let each request run its own refresh so that none of them waits on another', 'Run one refresh; the other requests wait for it and then retry with the new token', 'Sign the user out immediately, since five failures means the session is compromised', 'Retry all five with the expired token, because servers allow a short grace window'], 1, 'Parallel refreshes race: with rotating refresh tokens, the second refresh can invalidate the first and log the user out. A single-flight refresh behind a mutex, with waiters retrying once on the new token, is the standard fix, and OkHttp Authenticator is where it usually lives.'),
  mcq('sd-07', 'system-design', 'mid', 'What is the first durability step in a mobile analytics pipeline?', ['Send each event synchronously the moment it happens, before the user can navigate away', 'Persist events to disk first, upload in batches, and delete only after the server acknowledges', 'Keep the queue in process memory and flush it in onStop before the app is backgrounded', 'Drop events recorded while offline, since analytics only needs a representative sample'], 1, 'Write the event to disk before anything else, and it survives process death, crashes, and airplane mode. The uploader batches to save radio and battery, retries with backoff, and deletes only on acknowledgement, which is what makes delivery at-least-once instead of best-effort.'),
  mcq('sd-08', 'system-design', 'mid', 'The server responds 429 Too Many Requests with Retry-After: 30. What should the client do?', ['Retry immediately in a tight loop until one request gets through', 'Wait at least the Retry-After value, then retry with bounded backoff', 'Clear the auth session and cached data, then sign the user back in', 'Switch to a backup API host and replay the same request there at once'], 1, 'A 429 is the server telling you exactly how to behave, and honoring Retry-After is the difference between recovering and amplifying the overload. Only idempotent or idempotency-protected requests should be retried automatically at all.'),
  mcq('sd-09', 'system-design', 'senior', 'What is the core trade-off you accept when adding prefetching?', ['Slower cold starts now in exchange for faster warm navigation between screens later', 'Spending battery, data, and memory now on predictions to cut perceived latency later', 'Weaker cache consistency, since prefetched data can no longer be invalidated once stored', 'A larger local database schema in exchange for simpler pagination logic in the UI'], 1, 'Prefetching bets device resources on a guess about the next action. A disciplined design predicts only high-probability actions, respects metered connections and battery saver, caps the budget, and cancels prefetches the moment the prediction is invalidated.'),
  mcq('sd-10', 'system-design', 'senior', 'The OS kills your app halfway through a large sync. What makes the next run safe?', ['Scheduling the sync through a foreground service the system restarts automatically', 'Persisted progress markers plus idempotent operations, so replayed steps cannot double-apply', 'A Boolean flag in process memory recording that a sync was already in progress', 'Posting the remaining work to a Handler whose message queue survives until the next app launch'], 1, 'Recovery needs two properties: knowing what was done (durable progress, like a per-page watermark) and being safe to redo the uncertain step (idempotent writes). WorkManager gets the job restarted, but resumability is a property of your sync protocol, not the scheduler.'),

  // Testing and quality
  mcq('tq-01', 'testing-quality', 'junior', 'What should a single unit test verify?', ['As many code paths as fit in one method', 'One observable behavior through the public API', 'The exact sequence of private helper calls', 'That the Android framework itself behaves correctly'], 1, 'One behavior per test keeps failures diagnostic: the name tells you what broke. Testing through the public API means refactoring internals does not break the suite, and testing the framework itself is wasted effort you cannot fix anyway.'),
  mcq('tq-02', 'testing-quality', 'junior', 'Why prefer an in-memory fake over a mock for a stateful repository?', ['Fakes cannot produce error states, which keeps every test focused on the happy path', 'A fake models real state and behavior, so tests assert outcomes instead of call sequences', 'Mocks only run on an emulator, while fakes also work in local JVM unit tests', 'Fakes are generated by the compiler, so they always stay in sync with the interface'], 1, 'A twenty-line fake with a backing map behaves like the real thing: writes then reads work, and error states are a flag away. Mock-heavy tests tend to assert how the result was produced, which welds them to the current implementation.'),
  mcq('tq-03', 'testing-quality', 'junior', 'Which kind of test gives the fastest, most deterministic feedback?', ['An end-to-end test on a physical device', 'A local JVM unit test', 'A manual pass over the release build', 'A full screenshot suite'], 1, 'JVM tests skip the emulator, the framework, and the flake that comes with both, so they run in milliseconds and fail for exactly one reason. They cannot prove integration, which is why the pyramid keeps a thinner layer of instrumented and end-to-end tests above them.'),
  mcq('tq-04', 'testing-quality', 'mid', 'A test fails in roughly one of every twenty CI runs. What is the correct long-term fix?', ['Configure CI to retry failed tests three times before marking the build red', 'Find and control the source of nondeterminism: time, dispatchers, shared state, or ordering', 'Insert a generous sleep before the flaky assertion so slow runs have time to settle', 'Quarantine the test in a separate suite and delete the assertion that fails most'], 1, 'Flakiness is a real bug in the test or the code under test, usually uncontrolled time, threading, or leftover state. Retries just teach the team to ignore red builds. Injecting clocks and dispatchers turns the nondeterminism into something the test controls.'),
  mcq('tq-05', 'testing-quality', 'mid', 'A coroutine under test delays for 30 seconds. How do you test it without waiting 30 seconds?', ['Thread.sleep(31_000) in the test, so the real delay finishes before the assertion runs', 'runTest with injected test dispatchers, so virtual time skips the delay instantly', 'Launch it in GlobalScope and poll a flag until the coroutine flips it or a timeout hits', 'Read the delay from BuildConfig and shorten it to zero in test builds'], 1, '`runTest` runs on virtual time and auto-advances past delays. The catch is that the code must use injected dispatchers: a hardcoded Dispatchers.IO escapes the TestCoroutineScheduler and the test really does wait, or worse, asserts before the work happened.'),
  mcq('tq-06', 'testing-quality', 'mid', 'What does a consumer-driven contract test catch that unit tests on both sides miss?', ['Performance regressions in the provider when it runs under production traffic volumes', 'The provider changing behavior a consumer depends on, before the change reaches production', 'Private refactors inside the provider that keep its API responses exactly unchanged', 'Version drift between the Gradle dependency declarations of the two codebases'], 1, 'Both sides can be green against their own assumptions while the assumptions disagree: a field renamed, a null appearing where one never had. The contract pins the interaction itself, so the provider build fails the moment it breaks a consumer expectation.'),
  mcq('tq-07', 'testing-quality', 'mid', 'Why is asserting every collaborator call and its order usually a design smell in tests?', ['Recording and verifying every call makes the whole suite measurably slower to run on each CI build', 'It couples tests to the implementation, so refactors break them while behavior is unchanged', 'Interaction verification disables coverage collection for the classes involved', 'Mocking frameworks hold references that leak memory across test classes'], 1, 'A test that pins the choreography fails when you inline a helper, even though users see identical behavior, and that noise erodes trust in the suite. Save interaction assertions for when the call itself is the contract, like "the charge endpoint is hit exactly once".'),
  mcq('tq-08', 'testing-quality', 'mid', 'What must a Room migration test actually prove?', ['That the migration SQL parses and is formatted consistently with the schema file', 'That a database at the old version upgrades to the new schema with its data intact', 'That a fresh install at the new version creates every table the entities declare', 'That migrations execute off the main thread so they can never block the UI'], 1, 'The real risk is user data: MigrationTestHelper opens the database at the old version, you insert representative rows, run the real migration, and assert both schema and surviving values. fallbackToDestructiveMigration makes this "pass" by silently wiping the user, which is the failure.'),
  mcq('tq-09', 'testing-quality', 'senior', 'Your module reports 95 percent line coverage. What does that number not tell you?', ['Which lines were actually executed while the test suite was running', 'Whether the assertions would actually catch a regression on those lines', 'Whether the test process ran all the way to completion', 'Whether the remaining five percent contains any reachable code at all'], 1, 'Coverage measures execution, not verification: a test that calls everything and asserts nothing scores the same as a rigorous one. Use coverage to find untested areas, and mutation testing if you want evidence the assertions bite.'),
  mcq('tq-10', 'testing-quality', 'senior', 'An intentional redesign turns 40 screenshot tests red. What is the correct workflow?', ['Configure CI to auto-accept new screenshots whenever a release is tagged as a redesign', 'Review each visual diff like a code review, then deliberately record the new baseline', 'Disable screenshot tests for the affected screens until the redesign has fully shipped', 'Raise the pixel-difference tolerance until the existing baselines pass again'], 1, 'The diffs are the review: an unintended padding shift hides easily among 40 expected changes, and blessing it makes the regression the new truth. Auto-accepting or loosening tolerance quietly deletes the protection the suite exists to provide.'),

  // Platform internals
  mcq('pi-01', 'platform-internals', 'mid', 'What actually enforces the boundary that stops one app from reading another app private files?', ['The ART runtime validates a permission before every single file read on disk', 'The Linux kernel, giving each app a unique UID and applying SELinux policy', 'The Play Store statically scans uploaded apps for cross-app file access', 'A Java SecurityManager instance that wraps and checks each file operation'], 1, 'At install each app gets a unique Linux UID, and the kernel enforces file permissions plus SELinux on top, so the sandbox holds even for native code and JNI that bypass the runtime.'),
  mcq('pi-02', 'platform-internals', 'mid', 'Returning a very large list from a bound service crashes with TransactionTooLargeException. What is the underlying limit?', ['The Parcel class refuses to marshal any single object larger than one megabyte', 'Each process has roughly a 1 MB Binder buffer shared across all live transactions', 'The manifest caps Intent extras at one megabyte for every component you declare', 'The main thread rejects any Binder reply whose payload is larger than a megabyte'], 1, 'A process has about a 1 MB Binder transaction buffer shared by every in-flight transaction, so one oversized reply cannot fit and the framework raises TransactionTooLargeException far from the code that caused it.'),
  mcq('pi-03', 'platform-internals', 'senior', 'Since Android 8.0 (API 26), where does a Bitmap pixel data live?', ['On the Java heap, counted directly against the small per-app heap limit', 'On the native heap, while the lightweight Bitmap object stays on the Java heap', 'Inside a dedicated Binder buffer that is shared with the system_server process', 'In the graphics driver memory, released only when the next full GC happens'], 1, 'Android 8 moved pixel data to the native heap while the small Bitmap object remains on the Java heap, which eased OutOfMemoryError crashes but did not reduce the real memory the image consumes.'),
  mcq('pi-04', 'platform-internals', 'senior', 'An OutOfMemoryError specifically means which region could not satisfy an allocation?', ['The native heap that malloc and JNI allocate from', 'The capped, garbage-collected Java heap', 'The Binder transaction buffer for the process', 'The total physical RAM installed on the device'], 1, 'OutOfMemoryError is a Java-heap failure, since that managed heap is capped per app; a failed native allocation instead surfaces as a native abort or crash rather than an OutOfMemoryError.'),
  mcq('pi-05', 'platform-internals', 'senior', 'Which best describes the garbage collector that modern ART uses?', ['A reference-counting collector that frees each object the instant its count hits zero', 'A mostly concurrent, generational copying collector with brief stop-the-world pauses', 'A fully stop-the-world mark-and-sweep collector that pauses the app on every cycle', 'A manual collector that only reclaims memory when you call System.gc() yourself'], 1, 'ART uses a concurrent copying collector, generational since Android 10, doing most work off the UI thread with only short stop-the-world pauses, which is far less disruptive than Dalvik mark-and-sweep.'),
  mcq('pi-06', 'platform-internals', 'mid', 'Your app drops frames from frequent garbage collection while scrolling. What is the most effective fix?', ['Call System.gc() at the start of every frame to force collection timing', 'Cut per-frame allocations such as autoboxing so the collector runs less often', 'Request a much larger heap for the app with the android:largeHeap flag', 'Move the rendering work onto a background dispatcher off the main thread'], 1, 'GC frequency tracks allocation rate, so removing per-frame allocations like boxed primitives and short-lived objects is what reduces collections; forcing System.gc() or enlarging the heap does not address the churn.'),
  mcq('pi-07', 'platform-internals', 'mid', 'Which memory metric attributes each shared page fairly by dividing it among the processes sharing it?', ['RSS, the resident set size', 'PSS, the proportional set size', 'USS, the unique set size', 'VSS, the virtual set size'], 1, 'PSS counts private pages plus each shared page divided by its number of sharers, so it is the fairest single figure for one process; RSS counts shared pages in full and USS counts only private pages.'),
  mcq('pi-08', 'platform-internals', 'senior', 'In the Android build pipeline, what is the specific job of D8?', ['Compiling DEX bytecode into native .oat files during install on the device', 'Converting .class bytecode into DEX and desugaring newer language features', 'Renaming classes and stripping unused code for a smaller release build', 'Recording which methods run hot into a profile for later compilation'], 1, 'D8 turns JVM .class bytecode into DEX and desugars newer features for older devices; dex2oat compiles DEX to native on device, R8 shrinks and obfuscates, and the JIT records hot methods.'),
  mcq('pi-09', 'platform-internals', 'mid', 'What do Baseline Profiles improve, and when do they take effect?', ['They shrink the shipped APK by removing classes that are never referenced', 'They pre-compile hot startup paths at install so the first launches are faster', 'They encrypt the startup code path so a decompiler cannot read it back', 'They postpone all compilation until the device is idle and on a charger'], 1, 'A Baseline Profile ships a list of hot methods so dex2oat AOT-compiles the startup and scrolling paths at install time, skipping the JIT warmup that would otherwise make the first few launches slow.'),
  mcq('pi-10', 'platform-internals', 'senior', 'A JNI method creates thousands of local references in a tight loop and then crashes. Why?', ['Local references have to be released with DeleteGlobalRef on each iteration', 'The bounded local reference table overflows when you never call DeleteLocalRef', 'Local references are only reclaimed by ART after the whole app process exits', 'A JNIEnv is not permitted to create any references from inside a loop body'], 1, 'Local references sit in a bounded per-frame table that is freed only when the native method returns, so creating many inside a loop without DeleteLocalRef overflows that table and aborts.'),
  mcq('pi-11', 'platform-internals', 'senior', 'Native code spawns its own thread that needs to call back into the runtime. What must it do first?', ['Reuse the JNIEnv pointer that was captured on the original calling thread', 'Call AttachCurrentThread to obtain a JNIEnv that is valid for this thread', 'Acquire a single global JNI lock before making any call into the runtime', 'Promote every local reference it holds into a global reference beforehand'], 1, 'A JNIEnv is per-thread and cannot be shared, so a native-created thread must call AttachCurrentThread to get a valid JNIEnv and DetachCurrentThread before it exits, or the calls are undefined.'),
  mcq('pi-12', 'platform-internals', 'senior', 'What does a hardware-backed Android Keystore key actually protect against?', ['An attacker invoking the key while your app runs on a rooted device', 'Extraction of the raw key bytes out of the device', 'Decompilation of the obfuscated code inside the APK', 'A secret string that you hardcoded in the APK resources'], 1, 'The Keystore keeps raw key material non-exportable inside a TEE or secure element, so it prevents key extraction, but it cannot stop a rooted device from using the key exactly as your app would.'),
];
