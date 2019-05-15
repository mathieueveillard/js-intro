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

{
  const book: Product = {
    id: "257ead56-3532-4b91-b663-a846546ee335",
    priceInEur: 19
  };
  addProduct(book);
}

{
  const book = {
    id: "257ead56-3532-4b91-b663-a846546ee335",
    priceInEur: 19
  };
  addProduct(book);
}

{
  interface PurchaseOrder {
    id: string;
    priceInEur: number;
  }
  const purchaseOrder: PurchaseOrder = {
    id: "38dbd674-b02e-45dd-9163-d560270c7da3",
    priceInEur: 178.99
  };
  addProduct(purchaseOrder);
}

{
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
}

{
  // Error TS2322: Object literal may only specify known properties, and 'title' does not exist in type 'Product'.
  const game: Product = {
    id: "ea6bd5e5-dea8-4534-8aa2-ff1a274bdeae",
    priceInEur: 54.99,
    title: "The Legend of Zelda: Breath of the Wild"
  };
}

{
  // Error TS2345: Object literal may only specify known properties, and 'title' does not exist in type 'Product'.
  addProduct({
    id: "ea6bd5e5-dea8-4534-8aa2-ff1a274bdeae",
    priceInEur: 54.99,
    title: "The Legend of Zelda: Breath of the Wild"
  });
}

{
  const game = {
    id: "ea6bd5e5-dea8-4534-8aa2-ff1a274bdeae",
    priceInEur: 54.99,
    title: "The Legend of Zelda: Breath of the Wild"
  };
  addProduct(game);
}
