# TypeScript

For a seasoned developer used to strongly typed languages such as Java or C#, TypeScript will be rather easy to learn because it follows the principle of least astonishment. There are differences, of course, one of them being that types can be infered. This allows a very smooth and progressive transition from JavaScript to TypeScript.

Simply read the docs and enjoy! https://www.typescriptlang.org/.

## Structural typing (a.k.a. duck typing)

Still, there is a point that requires attention: **TypeScript's is a structural type system, also known as [duck typing](https://en.wikipedia.org/wiki/Duck_typing)**, as opposed to nominal typing. Structural typing is a type system in which a type is defined by its shape, that is its attributes and methods. In the example bellow, the compiler won't be able to make any difference between types `Product` and `PurchaseOrder` (defined as interfaces) since they have the same shape:

```typescript
interface Product {
  id: string;
  priceInEur: number;
}
interface PurchaseOrder {
  id: string;
  priceInEur: number;
}
```

This opposes to nominal typing, in which two types will be considered as different because they have different names, even if they have the exact same definition.

Now let's see the implications in detail, trying to add different products to a basket, assuming the context of an e-commerce platform:

```typescript
interface Product {
  id: string;
  priceInEur: number;
}

interface Basket {
  products: Product[];
}

function addProductToBasket({ products }: Basket) {
  return function(product: Product): Basket {
    return {
      products: [...products, product]
    };
  };
}

const basket: Basket = {
  products: []
};

const addProduct = addProductToBasket(basket);
```

This is the regular way: declaring a `book` of type `Product` and invoking `addProduct` with this book.

```typescript
const book: Product = {
  id: "257ead56-3532-4b91-b663-a846546ee335",
  priceInEur: 19
};
addProduct(book);
```

Explicitely declaring the type of `book` is not required: its shape matches the `Product` shape required by `addProduct`, that's enough for the compiler:

```typescript
const book = {
  id: "257ead56-3532-4b91-b663-a846546ee335",
  priceInEur: 19
};
addProduct(book);
```

However, this would also compile, though it doesn't make any sence from a business point of view:

```typescript
interface PurchaseOrder {
  id: string;
  priceInEur: number;
}
const purchaseOrder: PurchaseOrder = {
  id: "38dbd674-b02e-45dd-9163-d560270c7da3",
  priceInEur: 178.99
};
addProduct(purchaseOrder);
```

A simple way of avoiding such ambiguity is to add an additional `type` property to each type definition (please refer to the _String Literal Types_ section in [Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)). Now the compiler will make the difference:

```typescript
interface Product {
  type: "PRODUCT";
  id: string;
  priceInEur: number;
}
interface PurchaseOrder {
  type: "PURCHASE_ORDER";
  id: string;
  priceInEur: number;
}
```

## Excess property check

Lastly, a few words on the exact way TypeScript handles type comparison.

Additional properties are not allowed.

```typescript
// Error TS2322: Object literal may only specify known properties, and 'title' does not exist in type 'Product'.
const game: Product = {
  id: "ea6bd5e5-dea8-4534-8aa2-ff1a274bdeae",
  priceInEur: 54.99,
  title: "The Legend of Zelda: Breath of the Wild"
};
```

In such a case, you may want to use instead Intersection Types (see the corresponding section in [Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)) or add an additional `[name: string]: any;` property to `Product`.

Same consideration applies on function invocation, though it leads to a different error number:

```typescript
// Error TS2345: Object literal may only specify known properties, and 'title' does not exist in type 'Product'.
addProduct({
  id: "ea6bd5e5-dea8-4534-8aa2-ff1a274bdeae",
  priceInEur: 54.99,
  title: "The Legend of Zelda: Breath of the Wild"
});
```

That, we have seen before, is ok, though I guess we could have expected a `TS2345` error as well:

```typescript
const game = {
  id: "ea6bd5e5-dea8-4534-8aa2-ff1a274bdeae",
  priceInEur: 54.99,
  title: "The Legend of Zelda: Breath of the Wild"
};
addProduct(game);
```
