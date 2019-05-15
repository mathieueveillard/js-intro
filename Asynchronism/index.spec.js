"use strict";
import { Observable, Subject } from "rxjs";
import { take, filter, map, scan } from "rxjs/operators";
import regeneratorRuntime from "regenerator-runtime";

describe("A simple asynchronous function", function() {
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
});

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

function increment(n) {
  return promiseBasedSetTimeout(() => n + 1, 50);
}

function multiplyBy3(n) {
  return promiseBasedSetTimeout(() => n * 3, 50);
}

function raiseToPower2(n) {
  return promiseBasedSetTimeout(() => n ** 2, 50);
}

function assertResultEquals(n) {
  return function(result) {
    expect(result).toEqual(n);
  };
}

describe("Promises", function() {
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

  it("should allow to chain promises", function(done) {
    Promise.resolve(0)
      .then(increment)
      .then(multiplyBy3)
      .then(raiseToPower2)
      .then(assertResultEquals(9))
      .then(done);
  });

  it("should allow error management within chain of promises", function(done) {
    (Math.random() < 0.5 ? Promise.resolve(0) : Promise.reject())
      .then(increment)
      .then(multiplyBy3)
      .then(raiseToPower2)
      .catch(() => 9)
      .then(assertResultEquals(9))
      .then(done);
  });
});

describe("async | await", function() {
  it("async | await should allow to write asynchronous code as if it was synchronous", async function(done) {
    let n = 0;
    n = await increment(n);
    n = await multiplyBy3(n);
    n = await raiseToPower2(n);
    expect(n).toEqual(9);
    done();
  });

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
});

describe.only("Observables", function() {
  const interval = 20;

  function Producer(next) {
    let i = 0;
    setInterval(() => next(i++), interval);
  }

  function isEven(n) {
    return n % 2 === 0;
  }

  function raiseToPower2(n) {
    return n ** 2;
  }

  function accumulate(accumulation, current) {
    return accumulation + current;
  }

  function expectSpyToHaveBeenCalledWithValues(spy, values) {
    values.map((value, index) => expect(spy).toHaveBeenNthCalledWith(index + 1, value));
  }

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
});
