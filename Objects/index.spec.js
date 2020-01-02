"use strict";

describe("Object literals", function() {
  it("Should allow defining and accessing object properties", function() {
    const name = {
      firstName: "Firstname",
      lastName: "Lastname"
    };
    expect(name.firstName).toEqual("Firstname");
    expect(name["firstName"]).toEqual("Firstname");
    name.nickName = "Nickname";
    expect(name.nickName).toEqual("Nickname");
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
      [dateOfBirth]: new Date("September 10, 2019")
    };
    expect(object[dateOfBirth].getTime()).toEqual(new Date("September 10, 2019").getTime());
  });

  it("Should allow nesting objects", function() {
    const name = {
      firstName: "Firstname",
      lastName: "Lastname"
    };
    const person = {
      name,
      dateOfBirth: new Date("September 10, 2019")
    };
    expect(person.name.firstName).toEqual("Firstname");
  });
});

describe("Spreading objects", function() {
  it("Should allow spreading an object into another", function() {
    const person = {
      gender: "Female",
      hairColor: "Dark blond",
      bornFrom: "Humans",
      dateOfBirth: new Date("September 10, 2019")
    };
    const clone = {
      ...person
    };
    expect(clone.gender).toEqual("Female");
    expect(clone.hairColor).toEqual("Dark blond");
    expect(clone.bornFrom).toEqual("Humans");
    expect(clone.dateOfBirth.getTime()).toEqual(new Date("September 10, 2019").getTime());
  });

  it("Spreading: order matters!", function() {
    const person = {
      gender: "Female",
      hairColor: "Dark blond",
      bornFrom: "Humans",
      dateOfBirth: new Date("September 10, 2019")
    };
    const clone = {
      bornFrom: "Test tube",
      ...person,
      dateOfBirth: new Date("February 4, 2020")
    };
    expect(clone.bornFrom).toEqual("Humans");
    expect(clone.dateOfBirth.getTime()).toEqual(new Date("February 4, 2020").getTime());
  });

  it("Spreading: it creates NO dependency", function() {
    const person = {
      hairColor: "Dark blond"
    };
    const clone = {
      ...person
    };
    expect(clone.hairColor).toEqual("Dark blond");
    person.hairColor = "Brown";
    expect(clone.hairColor).toEqual("Dark blond");
  });

  it("Spreading: it's shallow cloning", function() {
    const name = {
      firstName: "Firstname",
      lastName: "Lastname"
    };
    const person = {
      name
    };
    const clone = {
      ...person
    };
    expect(clone.name.firstName).toEqual("Firstname");
    person.name.firstName = "Anothername";
    expect(clone.name.firstName).toEqual("Anothername");
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
