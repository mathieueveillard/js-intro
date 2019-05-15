"use strict";

describe("Scopes", function() {
  it("Blocks create new scopes (simple braces, for and while loops, try/catch statements", function() {
    {
      const a = 0;
    }
    expect(() => a).toThrow();
  });

  it("Functions create new scopes", function() {
    function doSomething() {
      const a = 0;
      return;
    }
    doSomething();
    expect(() => a).toThrow();
  });

  it("A child scope has access to its parents scope", function() {
    const a = 0;
    function doSomething() {
      expect(a).toEqual(0);
      return;
    }
    doSomething();
  });

  it("Shadowing is possible", function() {
    const a = 0;
    function doSomething() {
      const a = 1;
      return;
    }
    doSomething();
    expect(a).toEqual(0);
  });

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
});

describe("This", function() {
  class Square {
    constructor(size) {
      this.size = size;
    }
    computePerimeter() {
      return this.size * 4;
    }
  }

  it("this should be undefined", function() {
    const square = new Square(6);
    const computePerimeter = square.computePerimeter;
    expect(computePerimeter).toThrowError("Cannot read property 'size' of undefined");
  });

  it("this should be defined again!", function() {
    const square = new Square(6);
    const boundComputePerimeter = square.computePerimeter.bind(square);
    expect(boundComputePerimeter()).toEqual(24);
  });

  it("this should be defined", function() {
    const square = new Square(6);
    const computePerimeter = square.computePerimeter;
    const diamond = {
      size: 10
    };
    expect(computePerimeter.call(diamond)).toEqual(40);
  });

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
});
