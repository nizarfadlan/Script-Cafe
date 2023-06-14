import { toastCustom } from "@/components/libs/Toast";
import type { IItemsOnOrder, PropsManageOrder } from "@/types/order.type";
import type { IndexableType } from "dexie";

export const actionReduceItem = async({
  data,
  db,
}: PropsManageOrder): Promise<void> => {
  const { id, quantity } = data;
  const resultData: IItemsOnOrder[] = await db.where("id").equals(id).limit(1).toArray() as IItemsOnOrder[];

  let reduce: number | string | IndexableType;
  const itemDataOld: IItemsOnOrder = resultData[0] as IItemsOnOrder;
  if (resultData.length > 0 && itemDataOld.quantity > 1) {
    reduce = await db.update(id, { quantity: itemDataOld.quantity - (quantity || 1) });
  } else {
    await db.delete(id);
    reduce = 1;
  }

  if (reduce) {
    toastCustom({
      type: "success",
      description: "Successfully reduce the item"
    });
  } else {
    toastCustom({
      type: "error",
      description: "Failed to reduce item"
    })
  }
};

export const actionAddItem = async({
  data,
  db,
}: PropsManageOrder): Promise<void> => {
  const { id, quantity } = data;
  const resultData = await db.where("id").equals(id).limit(1).toArray();

  let add: number | string | IndexableType;
  if (resultData.length > 0) {
    const itemDataOld: IItemsOnOrder = resultData[0] as IItemsOnOrder;
    add = await db.update(id, { quantity: itemDataOld.quantity + Number(quantity) });
  } else {
    add = await db.add({
      id,
      quantity: Number(quantity),
    });
  }

  if (add) {
    toastCustom({
      type: "success",
      description: "Successfully add the item"
    });
  } else {
    toastCustom({
      type: "error",
      description: "Failed to add item"
    })
  }
};
