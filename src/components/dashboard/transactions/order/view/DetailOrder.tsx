import { Divider } from "@nextui-org/react";
import type { TransactionOnItem, TransactionOnPackage } from "@prisma/client";
import MenuItemComponent from "./MenuItem";
import type { IItemsOnOrder } from "@/types/order.type";
import PackageItemComponent from "./PackageItem";

const BodyDetailOrderItem: React.FC<{
  items: TransactionOnItem[] | undefined;
  packages: TransactionOnPackage[] | undefined;
}> = ({
  items,
  packages,
}) => {
  const showItems = items?.map((item) => {
    return {
      id: item.itemId,
      quantity: item.quantity,
    }
  }) as IItemsOnOrder[] ?? [];

  const showPackages = packages?.map((item) => {
    return {
      id: item.packageId,
      quantity: item.quantity,
    }
  }) as IItemsOnOrder[] ?? [];

  return (
    <>
      <h2>Items Order</h2>
      <section>
        <MenuItemComponent items={showItems} />
      </section>
      <Divider className="my-7" />
      <section>
        <PackageItemComponent items={showPackages} />
      </section>
    </>
  )
}

export default BodyDetailOrderItem;
