"use strict";

describe("Functions", function() {
  it("Should allow using functions", function() {
    function increment(n) {
      return n + 1;
    }
    expect(increment(0)).toEqual(1);
  });

  it("Function declarations are hoisted", function() {
    expect(increment(0)).toEqual(1);
    function increment(n) {
      return n + 1;
    }
  });
});

describe("Functions are first class citizens", function() {
  it("Should allow to assign a function to a variable", function() {
    const increment = function(n) {
      return n + 1;
    };
    expect(increment(0)).toEqual(1);
  });

  it("Should allow to pass a function as a callback", function() {
    function increment(n, callback) {
      const result = n + 1;
      callback(result);
      return result;
    }
    function callback(n) {
      // do something
    }
    increment(0, callback);
    expect(callback).toHaveBeenCalledWith(1);
  });

  it("Should allow to return a function", function() {
    function toPower(exponent) {
      return function(n) {
        return n ** exponent;
      };
    }
    const toPower2 = toPower(2);
    expect(toPower2(3)).toEqual(9);
  });
});

describe("Arrow functions", function() {
  it("Should allow using arrow functions", function() {
    const result = [0, 1, 2, 3].map(n => n + 1);
    expect(result).toEqual([1, 2, 3, 4]);
  });
});
