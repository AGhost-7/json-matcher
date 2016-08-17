## Pattern Matcher
Comparison of structural pattern matchers in JS. Interest is primarily JSON
pattern matches.

### `lib.eager`
Eager, non-"compiled", with recusion optimization.

~280k ops/sec

### `lib.decisionTree`
Leverages decision trees to speed up getting to the anwser.

WIP...

### `patrun`
Seems to be implemented using a decision tree.

~500k ops/sec

### `bloomrun`
Leverages BloomfilterJs.

~270k ops/sec

### `pat-mat`
Not optimized. Focuses on flexiblity.

~70k ops/sec
