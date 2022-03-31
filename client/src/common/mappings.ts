/// @dev DB Mappings

const inventoryMapping = (invetories: any) => {
  return invetories.map((inventory: any) => {
    return {
      id: inventory.id,
      name: inventory.name,
      description: inventory.description,
      price: inventory.price,
      quantity: inventory.quantity,
      image: inventory.image,
    };
  });
};
