# Asynchronism

## Callbacks

Callback are the lowest-level way of managing asynchronicity.

```javascript
it("The callback should be called when timer has elapsed", function(done) {
  let n = 0;
  const callback = function() {
    n = 1;
    expect(n).toEqual(1);
    done();
  };
  setTimeout(callback, 50);
  expect(n).toEqual(0);
});
```

But chaining callbacks leads very soon to the well known "callback hell":

```javascript
it("Should chain callbacks", function(done) {
  function increment(n, next) {
    setTimeout(() => next(n + 1), 50);
  }

  function multiplyBy3(n, next) {
    setTimeout(() => next(n * 3), 50);
  }

  function raiseToPower2(n, next) {
    setTimeout(() => next(n ** 2), 50);
  }

  increment(0, function(n) {
    multiplyBy3(n, function(n) {
      raiseToPower2(n, function(n) {
        expect(n).toEqual(9);
        done();
      });
    });
  });
});
```

We must seek for better syntax!

## Promises

Here Promises come to the rescue: an asynchronous function can be transformed to return a Promise and not require a callback function anymore. A Promise is an object to whom the client code will pass the callback function.

A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) has in particular a `then` method and a `catch` method that allow the client code to register callbacks that will be called respectively in case of fulfillment (the asynchronous code has ended successfully) or rejection.

```javascript
it("Should return a Promise and not directly require a callback anymore", function(done) {
  function increment(n, next) {
    setTimeout(() => next(n + 1), 50);
  }

  function promiseBasedIncrement(n) {
    return new Promise(function(resolve, reject) {
      try {
        increment(n, resolve);
      } catch (error) {
        reject(error);
      }
    });
  }

  promiseBasedIncrement(0).then(function(n) {
    expect(n).toEqual(1);
    done();
  });
});
```

`then` and `catch`, used to register fulfillment and rejection callbacks, return themselves Promises. This allows to chain promises. So now let's try to express the chained arithmetics seen above with Promises.

First, wrap `setTimeout` in order to return a Promise:

```javascript
function promiseBasedSetTimeout(callback, timeout) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      try {
        const result = callback();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, timeout);
  });
}
```

...and refactor the arithmetical functions to use `promiseBasedSetTimeout`:

```javascript
function increment(n) {
  return promiseBasedSetTimeout(() => n + 1, 50);
}

function multiplyBy3(n) {
  return promiseBasedSetTimeout(() => n * 3, 50);
}

function raiseToPower2(n) {
  return promiseBasedSetTimeout(() => n ** 2, 50);
}
```

For convinience, let's define a higher-order assertion function that returns an assertion function of arity 1 (this will ease chaining):

```javascript
function assertResultEquals(n) {
  return function(result) {
    expect(result).toEqual(n);
  };
}
```

Now we're ready to chain Promises (`Promise.resolve(0).then(increment)` could also be written `increment(0)`):

```javascript
it("should allow to chain promises", function(done) {
  Promise.resolve(0)
    .then(increment)
    .then(multiplyBy3)
    .then(raiseToPower2)
    .then(assertResultEquals(9))
    .then(done);
});
```

and even resume after an error occured:

```javascript
it("should allow error management within chain of promises", function(done) {
  (Math.random() < 0.5 ? Promise.resolve(0) : Promise.reject())
    .then(increment)
    .then(multiplyBy3)
    .then(raiseToPower2)
    .catch(() => 9)
    .then(assertResultEquals(9))
    .then(done);
});
```

Better, isn't it? But we could go further.

## async | await

The `async` | `await` syntax exists in other languages (e.g. C#) and is syntactic sugar for consuming Promises. It allows to write asynchronous code as if it was synchronous:

```javascript
it("async | await should allow to write asynchronous code as if it was synchronous", async function(done) {
  let n = 0;
  n = await increment(n);
  n = await multiplyBy3(n);
  n = await raiseToPower2(n);
  expect(n).toEqual(9);
  done();
});
```

```javascript
it("async | await should allow to handle errors as well", async function(done) {
  let n = Math.random();
  try {
    if (n < 0.5) {
      throw Error();
    }
    n = 0;
    n = await increment(n);
    n = await multiplyBy3(n);
    n = await raiseToPower2(n);
  } catch (error) {
    n = 9;
  }
  expect(n).toEqual(9);
  done();
});
```

Behind the hood, async | await fully resolves in Promises.

## Observables

Finally, [`Observables`](https://rxjs-dev.firebaseapp.com/guide/observable) offer a way to handle streams of events in the same way as arrays, with similar methods. Spacetime entanglement!

Let's first define a `Producer`, that is the source of events:

```javascript
const interval = 20;

function Producer(next) {
  let i = 0;
  setInterval(() => next(i++), interval);
}
```

Then, assuming the following arithmetical functions:

```javascript
function isEven(n) {
  return n % 2 === 0;
}

function raiseToPower2(n) {
  return n ** 2;
}

function accumulate(accumulation, current) {
  return accumulation + current;
}
```

...and the following helper assertion function:

```javascript
function expectSpyToHaveBeenCalledWithValues(spy, values) {
  values.map((value, index) => expect(spy).toHaveBeenNthCalledWith(index + 1, value));
}
```

Let's define an `Observable`, which basically is a structure that registers subscribtions to a `Producer`:

```javascript
it("Observables should allow to make operations on stream of events", function(done) {
  const observable = new Observable(function subscribe(observer) {
    new Producer(observer.next.bind(observer));
  });

  const sumOfSquaredEvenNumbersObservable = observable.pipe(
    take(10), // 0 1 2 3 4 5 6 7 8 9
    filter(isEven), // 0 2 4 6 8
    map(raiseToPower2), // 0 4 16 36 64
    scan(accumulate, 0) // 0 4 20 56 120
  );

  const spy = jest.fn();
  sumOfSquaredEvenNumbersObservable.subscribe({
    next(n) {
      spy(n);
    },
    complete() {
      expectSpyToHaveBeenCalledWithValues(spy, [0, 4, 20, 56, 120]);
      done();
    }
  });
});
```

One should distinguish hot and cold observables:

- an observable is cold when it creates its own producer (metaphor: a Blue-Ray)
- an observable is hot otherwise, i.e. when it is provided with a producer external to it (metaphor: a film show)

Cold observables:

```javascript
it("Cold observables should create their own Producer", function(done) {
  const observable = new Observable(function subscribe(observer) {
    new Producer(observer.next.bind(observer));
  });

  const digitsObservable = observable.pipe(take(10));

  const spyForFirstObserver = jest.fn();
  const spyForSecondObserver = jest.fn();

  digitsObservable.subscribe({
    next: spyForFirstObserver,
    complete() {
      expectSpyToHaveBeenCalledWithValues(spyForFirstObserver, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
  });

  setTimeout(function() {
    digitsObservable.subscribe({
      next: spyForSecondObserver,
      complete() {
        expectSpyToHaveBeenCalledWithValues(spyForSecondObserver, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        done();
      }
    });
  }, 5 * interval + interval / 2);
});
```

Hot observables:

```javascript
it("Hot observables should share a common Producer", function(done) {
  const subject = new Subject();
  new Producer(subject.next.bind(subject));

  const observable = new Observable(function subscribe(observer) {
    subject.subscribe({ next: value => observer.next(value) });
  });

  const digitsObservable = observable.pipe(take(10));

  const spyForFirstObserver = jest.fn();
  const spyForSecondObserver = jest.fn();

  digitsObservable.subscribe({
    next: spyForFirstObserver,
    complete() {
      expectSpyToHaveBeenCalledWithValues(spyForFirstObserver, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
  });

  setTimeout(function() {
    digitsObservable.subscribe({
      next: spyForSecondObserver,
      complete() {
        expectSpyToHaveBeenCalledWithValues(spyForSecondObserver, [5, 6, 7, 8, 9]);
        done();
      }
    });
  }, 5 * interval + interval / 2);
});
```
