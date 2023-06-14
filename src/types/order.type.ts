import type { addOrderTable, editOrderTable } from "database.config";
import type { IItemsOnPackage } from "./packateItem.type";

export type IItemsOnOrder = IItemsOnPackage;

export type DBOrder = typeof addOrderTable | typeof editOrderTable;

export type PropsManageOrder = {
  data: IItemsOnOrder;
  db: DBOrder;
};
