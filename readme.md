# @jasonpollman/dynamic-interval
**For the rare cases when you might need an interval where the delay between calls is dynamic.**    
This small utility library exports two functions `setDynamicInterval` and `clearDynamicInterval`.

## Install

Via NPM:    
```bash
npm install @jasonpollman/dynamic-interval --save
```

For the browser:    
**`dist/dynamicInterval.min.js` is UMD**    

```html
<script src="dist/dynamicInterval.min.js"></script>
<script>
  var setDynamicInterval = dynamicInterval.setDynamicInterval;
  var clearDynamicInterval = dynamicInterval.clearDynamicInterval;
</script>
```

### Usage

```js
import { setDynamicInterval } from '@jasonpollman/dynamic-interval';

const baseTimes = [1000, 2000, 3000];

function invervalScheduler(baseTimes) {
  return baseTimes.shift() || 1000;
}

const timerReference = setDynamicInterval(() => console.log('Hello World!'), intervalScheduler));
// Logs "Hello World!" after 1 second, then 2, then 3, then every 1 second.
```

## API

### setDynamicInterval({function} callback, {function|Array|number} intervalScheduler, {...any} params) => {object}
Calls `callback` every `intervalScheduler()` milliseconds and returns a reference for clearing.

`setDynamicInterval` takes in two functions: `callback` and `intervalScheduler`. All remaining
arguments are passed to `callback` at every invocation.

- `callback` is called for each tick of the interval.
- `intervalScheduler` is a method that *should* return a numeric value (the next delay of the interval).

**Note, if `intervalScheduler` returns a non-numeric or negative value the interval will terminate.**     
While debatable, this is by design and differs from the behavior of `setInterval` (which in most cases will use `0` or some other "immediate" value for `NaN`).

`intervalScheduler` also supports `Array` types, which will iterate over each value in the array
and terminate when either a non-numeric value is found or all values have been exhausted.

### clearDynamicInterval({object} dynamicIntervalReference) => {undefined}**
Clears a dynamic interval reference. Softly fails for all other misuse.

## Examples

### Double Time
Sets an interval that's twice as long as the previous, starting with *one second*.
```js
let multiplier = 500;

function callback() {
  // Do something...
}

function intervalScheduler() {
  multiplier *= 2;
  return multiplier;
}

setDynamicInterval(callback, intervalScheduler);
```

### Array Based
**You can use an array—it will clear the interval once all values have been used once.**    
Note, the input array is left unmutated.

The following will run 3 times, first after 100ms, then 200ms, then 300ms.    
The interval will then be cleared since no items remain in the array.

```js
setDynamicInterval(() => { /* Do something... */ }, [100, 200, 300]);
```

