# Scope

## Block and function scopes

Scoping works the same way as in most programming languages as long as variables are declared with the `let` or `const` keywords (`let` vs. `const`: reassignment is possible for variables declared with `let`, not with `const`), meaning:

Blocks and functions create new scopes:

```javascript
it("Blocks create new scopes (simple braces, for and while loops, try/catch statements", function() {
  {
    const a = 0;
  }
  expect(() => a).toThrow();
});
```

```javascript
it("Functions create new scopes", function() {
  function doSomething() {
    const a = 0;
    return;
  }
  doSomething();
  expect(() => a).toThrow();
});
```

A child scope has access to its parents scope:

```javascript
it("A child scope has access to its parents scope", function() {
  const a = 0;
  function doSomething() {
    expect(a).toEqual(0);
    return;
  }
  doSomething();
});
```

Shadowing is possible:

```javascript
it("Shadowing is possible", function() {
  const a = 0;
  function doSomething() {
    const a = 1;
    return;
  }
  doSomething();
  expect(a).toEqual(0);
});
```

Since a scope has access to variables defined in its parent scope and functions car return functions, closures are very easy:

```javascript
it("A simple closure", function() {
  function makeCounter() {
    let count = 0;
    return function() {
      return ++count;
    };
  }
  const increment = makeCounter();
  expect(increment()).toEqual(1);
  expect(increment()).toEqual(2);
  expect(increment.count).toEqual(undefined);
});
```

NB: variables declared with the `var` keyword are not scoped to a block, while they are with a function. That's one of the main peculiarities of `var`, the other one being that variables declared with `var` are [hoisted](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting), as functions declarations.

As a rule of thumb, prefer `let` and `const` over `var`.

## The case of `this`

Let's assume a `Square` class declared as follow:

```javascript
class Square {
  constructor(size) {
    this.size = size;
  }
  computePerimeter() {
    return this.size * 4;
  }
}
```

The following shows that the value of `this` is determined by the call site. When extracting the `computePerimeter` and invoking the function on nothing, `this` is undefined:

```javascript
it("this should be undefined", function() {
  const square = new Square(6);
  const computePerimeter = square.computePerimeter;
  expect(computePerimeter).toThrowError("Cannot read property 'size' of undefined");
});
```

Fortunately, the `.bind()` method allows one to create a new function with a given value of `this` by closure:

```javascript
it("this should be defined again!", function() {
  const square = new Square(6);
  const boundComputePerimeter = square.computePerimeter.bind(square);
  expect(boundComputePerimeter()).toEqual(24);
});
```

Also, the `.call()` method allows one to specify at the time of the invokation the `this` value, i.e. the context on which to apply the function. This is very convenient when adding behavior temporarily on an object, without modifying it:

```javascript
it("this should be defined", function() {
  const square = new Square(6);
  const computePerimeter = square.computePerimeter;
  const diamond = {
    size: 10
  };
  expect(computePerimeter.call(diamond)).toEqual(40);
});
```

Finally, arrow functions are also uttermost helpful since they don't have their own `this` as regular functions. Hence, `this` inside an arrow function refers to the value of its enclosing scope, captured by closure :

```javascript
it("arrow functions should not have their own 'this'", function() {
  class Square {
    constructor(size) {
      this.size = size;
      this.computePerimeter = () => this.size * 4;
    }
  }

  const square = new Square(6);
  const computePerimeter = square.computePerimeter;
  expect(computePerimeter()).toEqual(24);
});
```
