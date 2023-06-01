import type { IItemsOnPackage } from "@/types/packateItem.type";
import { api } from "@/utils/api";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import type { MenuItem } from "@prisma/client";
import type { editItemsOnPackageTable, itemsOnPackageTable } from "database.config";
import { Fragment, useCallback } from "react";

export const CardItem: React.FC<{
  index: number,
  item: IItemsOnPackage,
  db?: typeof editItemsOnPackageTable | typeof itemsOnPackageTable,
  type?: "action" | "view"
}> = ({
  index,
  item,
  db,
  type = "action"
}) => {
  const { data } = api.item.getOne.useQuery({ id: item.id });

  if (!data) {
    <div className="col-span-1">
      <Card
        isFooterBlurred
        className="w-full h-[320px]"
      >
        <CardBody className="flex items-center justify-center">
          <h4 className="text-lg font-bold">Error</h4>
        </CardBody>
      </Card>
    </div>
  }

  const dataItem: MenuItem = data!;

  const deleteItem = useCallback(async(id: string) => {
    await db?.delete(id);
  }, [db]);

  return (
    <Fragment>
      <div className="col-span-1">
        <Card
          isFooterBlurred
          className="w-full h-[320px]"
        >
          <CardHeader className="absolute z-10 flex-col items-start top-1">
            <p className="text-xs font-bold uppercase text-white/60">Item {index + 1}</p>
            <h4 className="text-2xl font-medium text-black">{dataItem?.name}</h4>
          </CardHeader>
          <img
            alt="Card item"
            className="object-cover w-full h-full scale-125 -translate-y-10"
            src="/item.jpeg"
          />
          <CardFooter className="absolute bottom-0 z-10 justify-between border-t bg-white/30 border-slate-300">
            <div>
              <p className="text-xs text-black">{dataItem?.available ? "Available" : "Unavailable"}.</p>
              <p className="text-xs text-black">Total number of items {item.quantity}.</p>
            </div>
            {type === "action" && (
              <Button
                color="danger"
                radius="full"
                size="sm"
                variant="flat"
                onPress={() => deleteItem(item.id)}
              >
                Remove item
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Fragment>
  );
}
