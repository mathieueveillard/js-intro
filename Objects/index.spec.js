"use strict";

describe("Object literals", function() {
  it("Should allow defining and accessing object properties", function() {
    const name = {
      firstName: "Karl",
      lastName: "Lagerfeld"
    };
    expect(name.firstName).toEqual("Karl");
    expect(name["firstName"]).toEqual("Karl");
    name.nickname = "Der Kaiser";
    expect(name.nickname).toEqual("Der Kaiser");
  });

  it("Should support computed keys", function() {
    const object = {
      ["whatever" + " " + "index"]: "Content"
    };
    expect(object["whatever index"]).toEqual("Content");
  });

  it("Should support computed keys, e.g. symbols", function() {
    const dateOfBirth = Symbol();
    const object = {
      [dateOfBirth]: new Date("September 10, 1933")
    };
    expect(object[dateOfBirth].getTime()).toEqual(new Date("September 10, 1933").getTime());
  });

  it("Should allow nesting objects", function() {
    const name = {
      firstName: "Karl",
      lastName: "Lagerfeld"
    };
    const karl = {
      name,
      dateOfBirth: new Date("September 10, 1933")
    };
    expect(karl.name.firstName).toEqual("Karl");
  });

  it("Should allow spreading (shallow cloning)", function() {
    const name = {
      firstName: "Karl",
      lastName: "Lagerfeld"
    };
    const karlLagerfeld = {
      name,
      occupation: "Dressmaker",
      location: "Paris"
    };
    const derKeiser = {
      ...karlLagerfeld,
      location: "Heaven"
    };
    expect(derKeiser.name).toEqual(karlLagerfeld.name);
    expect(derKeiser.occupation).toEqual("Dressmaker");
    expect(derKeiser.location).toEqual("Heaven");
  });
});

describe("Prototype", function() {
  it("Should allow constructing an object based on another one", function() {
    const sheep = {
      gender: "female",
      name: "Sheep"
    };
    const dolly = Object.create(sheep);
    dolly.name = "Dolly";
    expect(dolly.gender).toEqual("female");
    expect(dolly.name).toEqual("Dolly");
  });

  it("An object should benefit the modifications of its prototype", function() {
    const sheep = {
      gender: "female",
      name: "Sheep"
    };
    const dolly = Object.create(sheep);
    sheep.numberOfLegs = 4;
    expect(dolly.numberOfLegs).toEqual(4);
  });

  it("Mutations of an object should not affect its prototype", function() {
    const sheep = {
      gender: "female",
      name: "Sheep"
    };
    const dolly = Object.create(sheep);
    dolly.name = "Dolly";
    expect(sheep.name).toEqual("Sheep");
  });
});

describe("Behaviour", function() {
  it("Should allow adding behaviour to object literals", function() {
    const square = {
      size: 6,
      computeSurface: function() {
        return this.size ** 2;
      }
    };
    expect(square.size).toEqual(6);
    expect(square.computeSurface()).toEqual(36);
  });

  it("Should allow creating objects with constructor functions", function() {
    function Square(size) {
      this.size = size;
      this.computeSurface = function() {
        return this.size ** 2;
      };
    }
    const square = new Square(6);
    expect(square.size).toEqual(6);
    expect(square.computeSurface()).toEqual(36);
  });

  it("Should allow creating classes", function() {
    class Square {
      constructor(size) {
        this.size = size;
      }
      computeSurface() {
        return this.size ** 2;
      }
    }
    const square = new Square(6);
    expect(square.size).toEqual(6);
    expect(square.computeSurface()).toEqual(36);
  });

  it("Should allow using getters", function() {
    class Square {
      constructor(size) {
        this.size = size;
      }
      get surface() {
        return this.size ** 2;
      }
    }
    const square = new Square(6);
    expect(square.size).toEqual(6);
    expect(square.surface).toEqual(36);
  });
});
