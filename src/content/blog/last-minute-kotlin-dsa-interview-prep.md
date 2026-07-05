---
title: "Last-minute Kotlin prep for DSA interviews"
description: "A practical Kotlin cheat sheet for coding rounds: strings, collections, loops, functions, sorting, queues, edge cases, and the APIs worth having at your fingertips."
date: 2026-07-05
author: "AndroidDevKit"
tags: ["kotlin", "dsa", "interviews", "cheat-sheet"]
highlighted: true
codeOutputs:
  - "Hello, Ada"
  - "n = 5, target = 9, nums = [2, 7, 9, 3, 1]"
  - "Case 1\nCase 2\nCase 3"
  - "limit = 10, answer = 0, big = 3000000000, ok = true, letter = k, text = kotlin"
  - "count = 42, safeCount = null, total = 3000000042, digit = 7, digitChar = 7"
  - "wrong = -727379968\nright = 1000000000000"
  - "With score = 72 and command = L:\nlabel = pass, direction = left"
  - "With age = 16:\ngroup = teen"
  - "1"
  - "until: [0, 1, 2, 3]\nrange: [0, 1, 2, 3, 4]\ndownTo: [4, 3, 2, 1, 0]\nstep: [0, 2]\nindices: [0, 1, 2, 3]\nnums[0] = 10\nnums[1] = 20\nnums[2] = 30\nnums[3] = 40\nrepeat: 0\nrepeat: 1\nrepeat: 2\nrepeat: 3"
  - "found at row 1, column 1"
  - "maxOfThree(3, 9, 4) = 9"
  - "isEven(8) = true\nisEven(7) = false"
  - "index = 2"
  - "sum = 12"
  - "For a three-node tree: countNodes(root) = 3"
  - "length = 6\nfirst = K\nlast = n\nsubstring = otl\nlowercase = kotlin\nstartsWith = true\ncontains t = true"
  - "k\no\nt\nl\ni\nn"
  - "changed = kotlin\nreversed = niltoK"
  - "isPalindrome(\"racecar\") = true\nisPalindrome(\"kotlin\") = false"
  - "With word = aba: a = 2, b = 1, every other count = 0"
  - "zeros = [0, 0, 0, 0, 0]\nsquares = [0, 1, 4, 9, 16]\ngiven = [4, 1, 9]"
  - "names = [Ada, Lin], grid[1][2] = 7"
  - "size = 3\nlastIndex = 2\ngetOrNull(10) = null\nrange = [1, 9]\ngiven = [-1, -1, -1]\nsum = -3, min = -1, max = -1"
  - "nums = [9, 4, 5]"
  - "[2147483647, 0, 2147483647, 2147483647]"
  - "duplicate: 2\nduplicate: 1"
  - "a -> 2\nb -> 1"
  - "groups = {3=[cat]}"
  - "doubled = [2, 4, 6]\nevens = [2]\nfirstLarge = null\nhasZero = false, allPositive = true\ngrouped = {1=[a, a], 2=[bb]}\ncounts = {a=2, bb=1}\ntotal = 6"
  - "a = [1, 2, 3]\ndescending = [3, 2, 1]\ncopy = [1, 2, 3]\nwords = [fig, pear, apple]"
  - "index = 2"
  - "top = 20\nfirst = 10"
  - "smallest = 2\nmaxHeap is created empty and orders larger values first"
  - "With row = 2 and col = 3: r = 2, c = 3"
  - "State(row=1, col=2, distance=4)"
  - "The classes define node shapes. Example: Node(7).value = 7"
  - "5"
  - "found = [3, 8]\nmissing = null"
  - "distance = 5, middle = 4"
  - "groups = 4"
  - "bit = 4, isSet = false, added = 14, toggled = 14\nshifted = 5, unsignedShift = 5, ones = 2"
  - "counts([2, 1, 2]) = {2=2, 1=1}"
  - "hasPair([1, 3, 4, 8], 7) = true"
  - "maxWindowSum([2, 1, 5, 1, 3], 3) = 9"
  - "[0, 1, 1, 2]"
  - "[[-1, 0], [1, 0], [0, -1], [0, 1]]"
---

Your interview starts soon. This is not the moment to learn a new graph
algorithm. It is the moment to make sure Kotlin syntax does not get between you
and a solution you already understand.

Use this as a quick scan before a data structures and algorithms round. The
examples are deliberately small. Type a few of them yourself, especially the
ones you tend to forget.

<nav class="article-toc" aria-labelledby="on-this-page">
  <div class="toc-head">
    <span class="eyebrow">Quick jump</span>
    <h2 id="on-this-page">What do you need right now?</h2>
  </div>
  <div class="toc-groups">
    <div>
      <strong>Kotlin essentials</strong>
      <a href="#the-basic-program-shape">Program shape</a>
      <a href="#variables-types-and-conversions">Variables and types</a>
      <a href="#if-when-and-comparisons">Conditions</a>
      <a href="#ranges-and-loops">Loops</a>
      <a href="#functions-you-can-write-quickly">Functions</a>
    </div>
    <div>
      <strong>Working with data</strong>
      <a href="#strings-and-characters">Strings</a>
      <a href="#arrays">Arrays</a>
      <a href="#lists-sets-and-maps">Lists, sets, and maps</a>
      <a href="#transforming-collections">Collection operations</a>
      <a href="#sorting-and-binary-search">Sorting and search</a>
    </div>
    <div>
      <strong>Interview tools</strong>
      <a href="#stack-queue-deque-and-heap">Stacks, queues, and heaps</a>
      <a href="#pairs-data-classes-and-nodes">Nodes and data classes</a>
      <a href="#null-safety-without-noise">Null safety</a>
      <a href="#math-and-bit-operations">Math and bits</a>
    </div>
    <div>
      <strong>Put it together</strong>
      <a href="#four-patterns-worth-being-able-to-type">Four DSA patterns</a>
      <a href="#complexity-traps-in-friendly-looking-code">Complexity traps</a>
      <a href="#the-final-five-minute-checklist">Final checklist</a>
    </div>
  </div>
</nav>

<a class="practice-callout" href="/practice/?preset=kotlin-dsa">
  <span class="practice-callout-icon" aria-hidden="true">⌁</span>
  <span>
    <small>10-minute Kotlin sprint</small>
    <strong>Can you read the output and write the missing code?</strong>
    <span>Take the focused test, then come back to the sections you missed.</span>
  </span>
  <b aria-hidden="true">→</b>
</a>

## The basic program shape

Most coding platforms call a top-level `main` function:

```kotlin
// Input: Ada
fun main() {
    val name = readln()
    println("Hello, $name")
}
```

On sites such as LeetCode, the platform may call your method for you. For
example, it may provide `class Solution` with a method such as
`fun twoSum(nums: IntArray, target: Int): IntArray`. Add your logic inside that
method. Do not rename the class, change the parameter types, or add `main` unless
the platform asks for it, because its test runner calls that exact signature.

For space-separated input, `split` is fine for modest test cases:

```kotlin
// Input:
// 5 9
// 2 7 9 3 1
fun main() {
    val (n, target) = readln().trim().split(" ").map(String::toInt)
    val nums = readln().trim().split(" ").map(String::toInt)

    println("n = $n, target = $target, nums = $nums")
}
```

`readln()` assumes another line exists. `readLine()` returns `null` at the end of
input, which can be useful when the number of lines is unknown. Large competitive
programming inputs may need buffered input, but do not build a fast scanner in an
interview unless input size makes it necessary.

Build output with `StringBuilder` when printing inside a large loop:

```kotlin
val output = StringBuilder()
repeat(3) { i -> output.appendLine("Case ${i + 1}") }
print(output)
```

## Variables, types, and conversions

Prefer `val`. Use `var` only when the reference itself must change.

```kotlin
val limit: Int = 10
var answer = 0
val big: Long = 3_000_000_000L
val ok: Boolean = true
val letter: Char = 'k'
val text: String = "kotlin"

println("limit = $limit, answer = $answer, big = $big, ok = $ok, letter = $letter, text = $text")
```

Kotlin does not perform implicit numeric widening. Convert explicitly:

```kotlin
val count = "42".toInt()
val safeCount = "42x".toIntOrNull()       // null
val total = count.toLong() + 3_000_000_000L
val digit = '7'.digitToInt()
val digitChar = 7.digitToChar()

println("count = $count, safeCount = $safeCount, total = $total, digit = $digit, digitChar = $digitChar")
```

Use `Long` when a sum, product, distance, or count can exceed about 2.1 billion.
Converting after the arithmetic is too late:

```kotlin
val wrong = (1_000_000 * 1_000_000).toLong() // Int overflows first
val right = 1_000_000L * 1_000_000L
println("wrong = $wrong")
println("right = $right")
```

## If, when, and comparisons

Both `if` and `when` are expressions, so they can produce a value.

```kotlin
val score = 72
val command = 'L'
val label = if (score >= 60) "pass" else "retry"

val direction = when (command) {
    'L' -> "left"
    'R' -> "right"
    'U', 'D' -> "vertical"
    else -> "unknown"
}
println("With score = $score and command = $command:")
println("label = $label, direction = $direction")
```

`when` can also express ranges and conditions:

```kotlin
val age = 16
val group = when {
    age < 0 -> "invalid"
    age in 0..12 -> "child"
    age in 13 until 18 -> "teen"
    else -> "adult"
}
println("With age = $age:")
println("group = $group")
```

Use `==` and `!=` for structural equality. `===` and `!==` compare object
identity, which is almost never what a DSA solution needs.

Boolean operators are `&&`, `||`, and `!`. They short-circuit, so this is safe:

```kotlin
val nums = intArrayOf(4, 8, 12)
val index = 1
val target = 8
if (index < nums.size && nums[index] == target) {
    println(index)
}
```

## Ranges and loops

These are the loop forms worth memorising:

```kotlin
val n = 4
val nums = intArrayOf(10, 20, 30, 40)
val exclusive = (0 until n).toList()
val inclusive = (0..n).toList()
val descending = (n downTo 0).toList()
val everyOther = (0 until n step 2).toList()

println("until: $exclusive")
println("range: $inclusive")
println("downTo: $descending")
println("step: $everyOther")
println("indices: ${nums.indices.toList()}")

for ((index, value) in nums.withIndex()) {
    println("nums[$index] = $value")
}

repeat(n) { index ->
    println("repeat: $index")
}
```

`until` excludes `n`; `..` includes it. `0..<n` is another spelling of
`0 until n` on newer Kotlin versions. Use `downTo` for descending ranges,
`step` to skip values, `indices` for valid indexes, and `withIndex()` when you
need both the index and value.

In a nested loop, labels let you continue or break the outer loop:

```kotlin
val grid = arrayOf(intArrayOf(1, 2), intArrayOf(3, 9))
val target = 9

outer@ for (row in grid.indices) {
    for (col in grid[row].indices) {
        if (grid[row][col] == target) {
            println("found at row $row, column $col")
            break@outer
        }
    }
}
```

## Functions you can write quickly

A normal function declares parameter types and a return type:

```kotlin
fun maxOfThree(a: Int, b: Int, c: Int): Int {
    return maxOf(a, maxOf(b, c))
}

println("maxOfThree(3, 9, 4) = ${maxOfThree(3, 9, 4)}")
```

Use an expression body for a short function:

```kotlin
fun isEven(n: Int): Boolean = n % 2 == 0
println("isEven(8) = ${isEven(8)}")
println("isEven(7) = ${isEven(7)}")
```

Default and named arguments can keep helper calls readable:

```kotlin
fun search(nums: IntArray, target: Int, start: Int = 0): Int {
    for (i in start until nums.size) {
        if (nums[i] == target) return i
    }
    return -1
}

val values = intArrayOf(4, 8, 12)
val index = search(nums = values, target = 12)
println("index = $index")
```

Use `vararg` when a function accepts any number of values. The spread operator
passes an existing array:

```kotlin
fun total(vararg values: Int) = values.sum()

val nums = intArrayOf(2, 4, 6)
val sum = total(*nums)
println("sum = $sum")
```

Local functions are handy for DFS because they can capture nearby state:

```kotlin
class Node(
    val value: Int,
    val left: Node? = null,
    val right: Node? = null,
)

fun countNodes(root: Node?): Int {
    fun dfs(node: Node?): Int {
        if (node == null) return 0
        return 1 + dfs(node.left) + dfs(node.right)
    }
    return dfs(root)
}

val root = Node(1, left = Node(2), right = Node(3))
println("For a three-node tree: countNodes(root) = ${countNodes(root)}")
```

Remember the base case before writing a recursive call. For deep inputs, prefer
an iterative stack because recursion can exhaust the call stack.

## Strings and characters

Strings are immutable. Operations such as `reversed`, `replace`, and `substring`
return a new value.

```kotlin
val s = "Kotlin"
println("length = ${s.length}")
println("first = ${s.first()}")
println("last = ${s.last()}")
println("substring = ${s.substring(1, 4)}")
println("lowercase = ${s.lowercase()}")
println("startsWith = ${s.startsWith("Kot")}")
println("contains t = ${'t' in s}")
```

Common character checks:

```kotlin
val s = "Kotlin"
for (ch in s) {
    when {
        ch.isDigit() -> println(ch.digitToInt())
        ch.isLetter() -> println(ch.lowercaseChar())
        ch.isWhitespace() -> continue
    }
}
```

Use a `CharArray` or `StringBuilder` when modifying characters:

```kotlin
val s = "Kotlin"
val chars = s.toCharArray()
chars[0] = chars[0].lowercaseChar()
val changed = chars.concatToString()

val reversed = StringBuilder(s).reverse().toString()
println("changed = $changed")
println("reversed = $reversed")
```

Two-pointer palindrome check:

```kotlin
fun isPalindrome(s: String): Boolean {
    var left = 0
    var right = s.lastIndex

    while (left < right) {
        if (s[left] != s[right]) return false
        left++
        right--
    }
    return true
}
println("isPalindrome(\"racecar\") = ${isPalindrome("racecar")}")
println("isPalindrome(\"kotlin\") = ${isPalindrome("kotlin")}")
```

For lowercase English letters, an `IntArray(26)` is a compact frequency table:

```kotlin
val word = "aba"
val frequency = IntArray(26)
for (ch in word) frequency[ch - 'a']++
println("With word = $word: a = ${frequency[0]}, b = ${frequency[1]}, every other count = 0")
```

Use a map instead when the character set is not limited to those 26 letters.
Also remember that a Kotlin `Char` is one UTF-16 code unit, not necessarily one
complete user-perceived character. Interview problems usually state a restricted
alphabet when that distinction does not matter.

## Arrays

Primitive arrays avoid boxed values:

```kotlin
val zeros = IntArray(5)                 // [0, 0, 0, 0, 0]
val squares = IntArray(5) { i -> i * i }
val given = intArrayOf(4, 1, 9)
println("zeros = ${zeros.contentToString()}")
println("squares = ${squares.contentToString()}")
println("given = ${given.contentToString()}")
```

General arrays can hold objects or nested arrays:

```kotlin
val names = arrayOf("Ada", "Lin")
val rows = 3
val cols = 4
val grid = Array(rows) { IntArray(cols) }
grid[1][2] = 7
println("names = ${names.contentToString()}, grid[1][2] = ${grid[1][2]}")
```

Useful array operations:

```kotlin
val given = intArrayOf(4, 1, 9)
println("size = ${given.size}")
println("lastIndex = ${given.lastIndex}")
println("getOrNull(10) = ${given.getOrNull(10)}")
println("range = ${given.copyOfRange(1, 3).contentToString()}")
given.fill(-1)
println("given = ${given.contentToString()}")
println("sum = ${given.sum()}, min = ${given.minOrNull()}, max = ${given.maxOrNull()}")
```

`IntArray` and `Array<Int>` are different types. Coding platforms commonly use
`IntArray` in Kotlin method signatures.

## Lists, sets, and maps

`List` exposes read-only operations. It is not a guarantee that the backing
collection can never change. Use `MutableList` when your code must add, remove,
or replace values.

```kotlin
val fixed: List<Int> = listOf(1, 2, 3)
val nums = mutableListOf(1, 2, 3)

nums.add(4)
nums += 5
nums[0] = 9
nums.removeAt(1)                 // removes by index
nums.remove(3)                   // removes the value 3
println("nums = $nums")
```

Create a sized mutable list when you need indexed assignment:

```kotlin
val n = 4
val start = 1
val distance = MutableList(n) { Int.MAX_VALUE }
distance[start] = 0
println(distance)
```

Sets answer membership and uniqueness questions:

```kotlin
val nums = listOf(2, 1, 2, 3, 1)
val seen = mutableSetOf<Int>()
for (value in nums) {
    if (!seen.add(value)) println("duplicate: $value")
}
```

Maps store key-value relationships:

```kotlin
val word = "aba"
val frequency = mutableMapOf<Char, Int>()
for (ch in word) {
    frequency[ch] = frequency.getOrDefault(ch, 0) + 1
}

for ((key, value) in frequency) {
    println("$key -> $value")
}
```

`getOrPut` is convenient when each key owns a mutable collection:

```kotlin
val word = "cat"
val groups = mutableMapOf<Int, MutableList<String>>()
groups.getOrPut(word.length) { mutableListOf() }.add(word)
println("groups = $groups")
```

A map lookup returns a nullable value because the key may be absent. Avoid `!!`
when `getOrDefault`, `getOrPut`, or an explicit null check expresses the case.

## Transforming collections

These standard operations are useful when they make the solution clearer:

```kotlin
val nums = listOf(1, 2, 3)
val words = listOf("a", "bb", "a")
val doubled = nums.map { it * 2 }
val evens = nums.filter { it % 2 == 0 }
val firstLarge = nums.firstOrNull { it > 100 }
val hasZero = nums.any { it == 0 }
val allPositive = nums.all { it > 0 }
val grouped = words.groupBy { it.length }
val counts = words.groupingBy { it }.eachCount()
val total = nums.fold(0L) { acc, value -> acc + value }
println("doubled = $doubled")
println("evens = $evens")
println("firstLarge = $firstLarge")
println("hasZero = $hasZero, allPositive = $allPositive")
println("grouped = $grouped")
println("counts = $counts")
println("total = $total")
```

Most of these create new collections. In a hot loop or memory-constrained
problem, a direct loop is often easier to reason about and cheaper to run. Do not
hide the important state of a sliding window or traversal inside a clever chain.

## Sorting and binary search

<a class="practice-callout practice-callout-compact" href="/practice/?preset=kotlin-dsa">
  <span class="practice-callout-icon" aria-hidden="true">⌁</span>
  <span>
    <small>Midpoint check</small>
    <strong>Put the collection APIs into practice</strong>
    <span>Output questions and short Kotlin prompts, with answers revealed only after you commit.</span>
  </span>
  <b aria-hidden="true">→</b>
</a>

Know whether an operation mutates or returns a copy:

```kotlin
val a = intArrayOf(3, 1, 2)
a.sort()                         // mutates a
val descending = a.sortedDescending() // returns List<Int>
val copy = a.sortedArray()       // returns IntArray

val words = mutableListOf("pear", "fig", "apple")
words.sortBy { it.length }
words.sortWith(compareBy<String> { it.length }.thenBy { it })
println("a = ${a.contentToString()}")
println("descending = $descending")
println("copy = ${copy.contentToString()}")
println("words = $words")
```

Avoid comparators such as `{ a, b -> a - b }`, which can overflow. Use
`compareBy`, `compareValues`, or `a.compareTo(b)`.

Binary search requires sorted input:

```kotlin
val values = intArrayOf(2, 5, 8, 12)
val index = values.binarySearch(8) // 2
println("index = $index")
```

If the value is absent, `binarySearch` returns a negative value that encodes the
insertion point. Do not treat every negative result as a usable index.

## Stack, queue, deque, and heap

`ArrayDeque` covers both stack and queue behavior:

```kotlin
val stack = ArrayDeque<Int>()
stack.addLast(10)
stack.addLast(20)
val top = stack.removeLast()

val queue = ArrayDeque<Int>()
queue.addLast(10)
queue.addLast(20)
val first = queue.removeFirst()
println("top = $top")
println("first = $first")
```

Check `isNotEmpty()` before removal unless the algorithm guarantees an element.
Calling `removeFirst()` or `removeLast()` on an empty deque throws
`NoSuchElementException`.

On the JVM, use `PriorityQueue` for a heap:

```kotlin
import java.util.PriorityQueue

val minHeap = PriorityQueue<Int>()
minHeap.add(7)
minHeap.add(2)
minHeap.add(5)
val smallest = minHeap.poll()    // 2

val maxHeap = PriorityQueue<Int>(compareByDescending { it })
println("smallest = $smallest")
println("maxHeap is created empty and orders larger values first")
```

`peek()` and `poll()` return `null` when the queue is empty. The default is a
min-heap.

## Pairs, data classes, and nodes

Use `Pair` for a tiny local relationship:

```kotlin
val row = 2
val col = 3
val cell = row to col
val (r, c) = cell
println("With row = $row and col = $col: r = $r, c = $c")
```

For three or more fields, or when names improve the algorithm, use a data class:

```kotlin
data class State(val row: Int, val col: Int, val distance: Int)
println(State(1, 2, 4))
```

Typical interview node definitions look like this:

```kotlin
class ListNode(var value: Int, var next: ListNode? = null)

class Node(
    val value: Int,
    var left: Node? = null,
    var right: Node? = null,
)

println("The classes define node shapes. Example: Node(7).value = ${Node(7).value}")
```

Follow the platform's supplied definition when it provides one.

## Null safety without noise

Nullable values use `?`:

```kotlin
class Node(val value: Int, val left: Node? = null)

val root = Node(1, left = Node(5))
val text: String? = null
val node: Node? = root.left
val value = node?.value              // null if node is null
val size = text?.length ?: 0         // Elvis operator

if (node != null) {
    println(node.value)              // smart cast inside this branch
}
```

Use `?.let` only when it genuinely reads better than an `if`:

```kotlin
fun pairWithTarget(map: Map<Int, Int>, target: Int, i: Int): IntArray? {
    return map[target]?.let { index -> intArrayOf(index, i) }
}

val found = pairWithTarget(mapOf(9 to 3), target = 9, i = 8)
val missing = pairWithTarget(emptyMap(), target = 9, i = 8)
println("found = ${found?.contentToString()}")
println("missing = $missing")
```

The not-null assertion `!!` throws `NullPointerException` when its value is
`null`. In interview code, it is usually clearer to prove the value exists with
a guard or handle the absent case explicitly.

## Math and bit operations

Common math helpers:

```kotlin
import kotlin.math.abs
import kotlin.math.ceil
import kotlin.math.floor
import kotlin.math.max
import kotlin.math.min
import kotlin.math.sqrt

val a = 9
val b = 4
val left = 0
val right = 8
val distance = abs(a - b)
val middle = left + (right - left) / 2
println("distance = $distance, middle = $middle")
```

Integer division truncates toward zero. `7 / 2` is `3`, while `7.0 / 2` is
`3.5`. A common positive-integer ceiling division is:

```kotlin
val items = 10
val size = 3
val groups = (items + size - 1) / size
println("groups = $groups")
```

That expression can overflow for very large values, so use `Long` or an
overflow-safe rearrangement when constraints require it.

Kotlin uses named functions for bit operations on integers:

```kotlin
val position = 2
val mask = 10
val bit = 1 shl position
val isSet = (mask and bit) != 0
val added = mask or bit
val toggled = mask xor bit
val shifted = mask shr 1          // keeps sign
val unsignedShift = mask ushr 1
val ones = mask.countOneBits()
println("bit = $bit, isSet = $isSet, added = $added, toggled = $toggled")
println("shifted = $shifted, unsignedShift = $unsignedShift, ones = $ones")
```

## Four patterns worth being able to type

### Frequency map

```kotlin
fun counts(nums: IntArray): Map<Int, Int> {
    val result = mutableMapOf<Int, Int>()
    for (n in nums) result[n] = result.getOrDefault(n, 0) + 1
    return result
}
println("counts([2, 1, 2]) = ${counts(intArrayOf(2, 1, 2))}")
```

### Two pointers on a sorted array

```kotlin
fun hasPair(nums: IntArray, target: Int): Boolean {
    var left = 0
    var right = nums.lastIndex

    while (left < right) {
        val sum = nums[left] + nums[right]
        when {
            sum == target -> return true
            sum < target -> left++
            else -> right--
        }
    }
    return false
}
println("hasPair([1, 3, 4, 8], 7) = ${hasPair(intArrayOf(1, 3, 4, 8), 7)}")
```

### Sliding window

```kotlin
fun maxWindowSum(nums: IntArray, k: Int): Int {
    require(k in 1..nums.size)
    var window = 0
    for (i in 0 until k) window += nums[i]

    var best = window
    for (right in k until nums.size) {
        window += nums[right] - nums[right - k]
        best = maxOf(best, window)
    }
    return best
}
println("maxWindowSum([2, 1, 5, 1, 3], 3) = ${maxWindowSum(intArrayOf(2, 1, 5, 1, 3), 3)}")
```

`require` throws `IllegalArgumentException` when its condition is false. In a
platform method, you may return a specified sentinel instead if invalid input is
part of the problem contract.

### Breadth-first search

```kotlin
fun shortestSteps(graph: List<List<Int>>, start: Int): IntArray {
    val distance = IntArray(graph.size) { -1 }
    val queue = ArrayDeque<Int>()

    distance[start] = 0
    queue.addLast(start)

    while (queue.isNotEmpty()) {
        val node = queue.removeFirst()
        for (next in graph[node]) {
            if (distance[next] != -1) continue
            distance[next] = distance[node] + 1
            queue.addLast(next)
        }
    }
    return distance
}
val graph = listOf(listOf(1, 2), listOf(3), listOf(3), emptyList())
println(shortestSteps(graph, 0).contentToString())
```

For a grid, store `(row, col)` pairs or a small `State`, and keep directions in
one place:

```kotlin
val directions = arrayOf(
    intArrayOf(-1, 0),
    intArrayOf(1, 0),
    intArrayOf(0, -1),
    intArrayOf(0, 1),
)
println(directions.joinToString(prefix = "[", postfix = "]") { it.contentToString() })
```

## Complexity traps in friendly-looking code

- `list.contains(value)` and `list.remove(value)` are linear searches. A hash set
  usually gives average constant-time membership.
- `substring`, `filter`, `map`, `reversed`, and `sorted` create results. Repeating
  them inside a loop can quietly increase time and memory use.
- Adding to the end of a mutable list is normally cheap. Removing index `0`
  shifts the remaining elements, so use `ArrayDeque` for a queue.
- Sorting is usually `O(n log n)`. Hash maps and sets have average `O(1)` lookup,
  but that is not a worst-case guarantee.
- String concatenation in a long loop can repeatedly copy text. Use
  `StringBuilder`.
- A recursive DFS uses call-stack space proportional to its depth.

## The final five-minute checklist

Before you submit, say these questions out loud:

1. What happens for empty input, one element, duplicates, and all-equal values?
2. Are my range endpoints inclusive or exclusive?
3. Can a sum, product, or midpoint overflow `Int`?
4. Does this lookup return `null`, and have I handled it?
5. Am I mutating the original collection or creating a copy?
6. Does my comparator handle equal values and extreme integers?
7. Have I tested the loop once by hand, including the condition that stops it?
8. Can I state the time and space complexity in one sentence?

The goal is not to show off every Kotlin feature. It is to make the algorithm
obvious. Use the smallest API that expresses your intent, name your state well,
and narrate the trade-off you are making. Clean, boring code is excellent
interview code.

<a class="practice-callout practice-callout-final" href="/practice/?preset=kotlin-dsa">
  <span class="practice-callout-icon" aria-hidden="true">✓</span>
  <span>
    <small>Ready to check it?</small>
    <strong>Take the last-minute Kotlin DSA test</strong>
    <span>Ten focused questions. Output tracing, tiny functions, no Android trivia.</span>
  </span>
  <b aria-hidden="true">Start →</b>
</a>

If you have more than a few minutes, pair this reference with the focused
[coding interview practice guide](/blog/top-leetcode-problems-for-android-jobs/)
and the broader [Android interview plan](/blog/how-to-prepare-for-android-interviews/).
