import Dexie from "dexie";

const database = new Dexie("cafe");
database.version(1).stores({
  itemsOnPackage: "id, quantity",
  editItemsOnPackage: "id, quantity",
});

export const itemsOnPackageTable = database.table("itemsOnPackage");
export const editItemsOnPackageTable = database.table("editItemsOnPackage");

export default database;
