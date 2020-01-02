# Objects and Prototypes

## Object literals

In contrast with class-based object programming, one can create objects without creating a class by writing an object literal.

```javascript
const theSimplestObject = {};
```

Every property of an object is public, but we'll see that there are ways to implement private properties.

```javascript
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
```

Property names can be computed:

```javascript
it("Should support computed keys", function() {
  const object = {
    ["whatever" + " " + "index"]: "Content"
  };
  expect(object["whatever index"]).toEqual("Content");
});
```

This is especially usefull with Symbols (a way to implement privacy):

```javascript
it("Should support computed keys, e.g. symbols", function() {
  const dateOfBirth = Symbol();
  const object = {
    [dateOfBirth]: new Date("September 10, 2019")
  };
  expect(object[dateOfBirth].getTime()).toEqual(new Date("September 10, 2019").getTime());
});
```

Objects can be nested:

```javascript
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
```

## Spreading

A simple way to shallow clone an object is using the spread operator `...`. Spreading an object simply copies all of its properties, which is very convenient in case of heavy POJOs (Plain Old JavaScript Object):

```javascript
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
```

When spreading an object into another, it is possible to override properties. However, be careful because order matters:

```javascript
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
```

There is NO binding between the original object and its clone (`object -/-> clone`). The former would change without the later to be updated:

```javascript
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
```

However, spreading is **shallow cloning**, as opposed to deep cloning. In case of a nested object, only a reference is copied:

```javascript
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
```

## Prototype

`Object.create(object)` is the simplest way to create an object based on another object. In the following, `sheep` serves as a prototype for `dolly`:

```javascript
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
```

When accessing a property of `dolly`, two cases might appear:

1. The property has not been overriden (ex: `gender`): when accessing it, the engine refers to the prototype of `dolly`, which is the `sheep` object;
2. The property has been overriden (ex: `name`): the corresponding value is stored in the memory allocated for `dolly`.

This creates a unidirectional binding between objects: `prototype ---> object`

```javascript
it("An object should benefit the modifications of its prototype", function() {
  const sheep = {
    gender: "female",
    name: "Sheep"
  };
  const dolly = Object.create(sheep);
  sheep.numberOfLegs = 4;
  expect(dolly.numberOfLegs).toEqual(4);
});
```

...but `prototype <-/- object`

```javascript
it("Mutations of an object should not affect its prototype", function() {
  const sheep = {
    gender: "female",
    name: "Sheep"
  };
  const dolly = Object.create(sheep);
  dolly.name = "Dolly";
  expect(sheep.name).toEqual("Sheep");
});
```

Objects might refer one to each other up to the root object `{}`, hence the expression **"chain of prototypes"**.

You should pay attention to the differencies between spreading and prototyping:

- Spreading is kind of a snapshot, thus it creates no dependency. Its action is shallow.
- Prototyping creates a one-way dependency and works as a chain of prototypes.

## Adding behaviour

Behaviour can be added to object literals. Note the use of `this`, which holds a reference to the current object:

```javascript
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
```

However, if many similar objects have to be created, a **constructor function** might be more suited:

```javascript
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
```

...which can be writen as a **class**. A class is syntactical sugar for a constructor function, meaning [it _is_ a constructor function](https://babeljs.io/repl/#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=AQ4YwGwQwZx4DKBHArlATgU2AbwFCihgD2AdjAC7opgXHoAUMAlgF6YCUuBhoFAFsxgA6Fu2ABeYGMwBuHoQC-CosQC2ABxQVMCFOgBmUMJgZd8vUFgr7SwAUNFtsAKhfAATPMvKlKkuQU0qgY2FKkmADuiCFYDABsHLJAA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=true&timeTravel=false&sourceType=module&lineWrap=false&presets=es2015%2Cstage-2%2Cenv&prettier=true&targets=&version=7.3.4):

```javascript
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
```

or, using a **getter**:

```javascript
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
```
