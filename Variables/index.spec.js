"use strict";

describe("const", function() {
  it("one should NOT be able to assign a new value to a variable declared with const", function() {
    const a = 0;
    expect(() => {
      a = 1;
    }).toThrowError(`"a" is read-only`);
  });

  it("one should still be able to modify an object that is assigned to a variable declared with const", function() {
    const a = { id: "3342bf9d-e191-4a46-8f99-aa9250260e3b" };
    expect(() => {
      a.message = "a is not mutable, but I am!";
    }).not.toThrow();
  });
});

describe("let", function() {
  it("one should be able to assign a new value to a variable declared with let", function() {
    let a = 0;
    expect(() => {
      a = 1;
    }).not.toThrow();
  });

  it("a non assignated variable declared with let should be undefined", function() {
    let a;
    expect(a).toEqual(undefined);
  });
});
