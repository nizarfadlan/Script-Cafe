import type { IItemsOnOrder } from "@/types/order.type";
import { getTypeItem } from "./helpers/getTypeItem";
import type { MenuItem, Package } from "@prisma/client";
import { Button, Card, CardBody, CardFooter, CardHeader, Chip } from "@nextui-org/react";
import { Fragment } from "react";
import { formatRupiah } from "@/libs/formatRupiah";
import { MinusIcon, PlusIcon } from "@/components/libs/Icons";

interface DataItem {
  quantity?: number;
}

interface Props {
  data: MenuItem[] | Package[] | null;
  items: IItemsOnOrder[];
  addItem?: (item: IItemsOnOrder) => Promise<void>;
  reduceItem?: (item: IItemsOnOrder) => Promise<void>;
  type?: "action" | "view";
}

export type Items = (MenuItem | Package) & DataItem;

const CardItemOrder: React.FC<Props> = ({
  data,
  items,
  addItem,
  reduceItem,
  type = "action",
}) => {
  if (!data) {
    return (
      <CardItem>
        <CardBody className="flex items-center justify-center">
          <h4 className="text-lg font-bold">Error</h4>
        </CardBody>
      </CardItem>
    )
  }

  const showData: Items[] = data.map((data) => {
    if (items.some((item) => item.id === data.id)) {
      return {
        ...data,
        quantity: items.find((item) => item.id === data.id)?.quantity,
      }
    } else {
      return {
        ...data,
        quantity: 0,
      }
    }
  });

  const calculateDiscount = (originalPrice: number, discountPrice: number): number => {
    return originalPrice - ((discountPrice/100) * originalPrice);
  };

  const handleReduceItem = async(id: string) => {
    await reduceItem?.({ id, quantity: 1 });
  };

  const handleAddItem = async(id: string) => {
    await addItem?.({ id, quantity: 1 });
  };

  return (
    <Fragment>
      {showData.map((item, index) => (
        <CardItem key={item.id}>
          <CardHeader className="absolute z-10 flex justify-between top-1">
            <div className="flex flex-col">
              <p className="text-xs font-bold uppercase text-white/60">Item {index + 1}</p>
              <h4 className="text-2xl font-medium text-foreground">{item?.name}</h4>
            </div>
          </CardHeader>
          <img
            alt={`Card item order ${item.name}`}
            className="object-cover w-full h-full scale-125 -translate-y-10"
            src={getTypeItem(item.id) == "MI" ? "/item.jpeg" : "/packageItem.jpeg"}
          />
          <CardFooter className="z-10 bg-background/40 w-[calc(100%_-_16px)] shadow-lg ml-2 rounded-xl bottom-2 absolute before:rounded-xl overflow-hidden justify-between py-4">
            <div className="flex items-center justify-between w-full text-xs">
              <div className="flex flex-col my-auto text-foreground gap-x-2">
                {item.discountPercent && item.discountPercent > 0 ? (
                  <>
                    <span className="text-sm line-through">Rp {formatRupiah(item.price)}</span>
                    <span className="text-sm text-danger dark:text-danger-400">
                      Rp
                      <span className="ml-1 text-base font-semibold">
                        {formatRupiah(
                          calculateDiscount(
                            item.price,
                            item.discountPercent ?? 0
                          )
                        )}
                      </span>
                    </span>
                  </>
                ): (
                  <span className="text-sm">
                    Rp
                    <span className="ml-1 text-base font-semibold">{formatRupiah(item.price)}</span>
                  </span>
                )}
              </div>
              {type === "action" ? (
                <>
                  {item.quantity && item.quantity > 0 ? (
                    <div className="flex items-center gap-x-2">
                      <Button
                        color="danger"
                        radius="full"
                        variant="flat"
                        size="sm"
                        onPress={() => handleReduceItem(item.id)}
                        isIconOnly
                        startIcon={<MinusIcon fill="currentColor" size={14} />}
                      />
                      <span className="mx-1 text-base font-bold">{item.quantity}</span>
                      <Button
                        color="success"
                        radius="full"
                        variant="flat"
                        size="sm"
                        onPress={() => handleAddItem(item.id)}
                        isIconOnly
                        startIcon={<PlusIcon fill="currentColor" size={14} />}
                      />
                    </div>
                  ): (
                    <Button
                      radius="full"
                      variant="flat"
                      onPress={() => handleAddItem(item.id)}
                    >
                      Add Item
                    </Button>
                  )}
                </>
              ): (
                <Chip
                  size="sm"
                  color="secondary"
                  variant="flat"
                >
                  {item.quantity} item
                </Chip>
              )}
            </div>
          </CardFooter>
        </CardItem>
      ))}
    </Fragment>
  );
}

export default CardItemOrder;

const CardItem = ({ children }: { children: React.ReactNode }) => (
  <div className="col-span-1">
    <Card
      isFooterBlurred
      className="w-full h-[320px]"
    >
      {children}
    </Card>
  </div>
)
