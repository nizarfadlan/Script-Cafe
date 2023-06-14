import Dexie from "dexie";

const database = new Dexie("cafe");
database.version(1).stores({
  itemsOnPackage: "id, quantity",
  editItemsOnPackage: "id, quantity",
  addOrder: "id, quantity",
  editOrder: "id, quantity",
});

export const itemsOnPackageTable = database.table("itemsOnPackage");
export const editItemsOnPackageTable = database.table("editItemsOnPackage");
export const addOrderTable = database.table("addOrder");
export const editOrderTable = database.table("editOrder");

export default database;
