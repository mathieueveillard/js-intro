# Functions

## Function declaration

A simple function declaration:

```javascript
it("Should allow using functions", function() {
  function increment(n) {
    return n + 1;
  }
  expect(increment(0)).toEqual(1);
});
```

Function declarations are [hoisted](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting), meaning that one can invoke a function before its declaration, because JavaScript is an interpreted ([and also JIT-compiled language](https://blog.octo.com/dans-les-entrailles-de-javascript-partie-1/)):

```javascript
it("Function declarations are hoisted", function() {
  expect(increment(0)).toEqual(1);
  function increment(n) {
    return n + 1;
  }
});
```

## Functions are first class citizens

...meaning that functions are objects. Hence one can do everything with functions that they do with objects:

Assign a function to a variable (here the right-hand side of the assignment is an anonymous function):

```javascript
it("Should allow to assign a function to a variable", function() {
  const increment = function(n) {
    return n + 1;
  };
  expect(increment(0)).toEqual(1);
});
```

Pass a function as a callback to another function:

```javascript
it("Should allow to pass a function as a callback", function() {
  function increment(n, callback) {
    const result = n + 1;
    callback(result);
    return result;
  }
  const callback = jest.fn();
  increment(0, callback);
  expect(callback).toHaveBeenCalledWith(1);
});
```

Return another function:

```javascript
it("Should allow to return a function", function() {
  function toPower(exponent) {
    return function(n) {
      return n ** exponent;
    };
  }
  const toPower2 = toPower(2);
  expect(toPower2(3)).toEqual(9);
});
```

And so on... This, of course, opens the doors of functional programming!

## Arrow functions

Functions can also be declared using an arrow `=>`:

```javascript
it("Should allow using arrow functions", function() {
  const result = [0, 1, 2, 3].map(n => n + 1);
  expect(result).toEqual([1, 2, 3, 4]);
});
```

More on that later!
