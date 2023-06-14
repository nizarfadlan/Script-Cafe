import type { IItemsOnOrder } from "@/types/order.type";
import React from "react";
import { api } from "@/utils/api";
import { getTypeItem } from "./helpers/getTypeItem";
import type { MenuItem, Package } from "@prisma/client";
import { Button, Skeleton } from "@nextui-org/react";
import { MinusIcon, PlusIcon } from "@/components/libs/Icons";
import { formatRupiah } from "@/libs/formatRupiah";

interface Props {
  item: IItemsOnOrder;
  addItem: (item: IItemsOnOrder) => Promise<void>;
  reduceItem: (item: IItemsOnOrder) => Promise<void>;
}

export const SideOrderItem: React.FC<Props> = ({
  item,
  addItem,
  reduceItem,
}) => {
  const typeItem = getTypeItem(item.id);

  let showData: MenuItem | Package | null = null;
  if (typeItem == "MI") {
    const { data, isLoading } = api.item.getOne.useQuery({ id: item.id });

    if (isLoading && !data) {
      return <LoadingData />
    }

    showData = data as MenuItem;
  } else if (typeItem == "PM") {
    const { data, isLoading } = api.packageItem.getOne.useQuery({ id: item.id });

    if (isLoading && !data) {
      return <LoadingData />
    }

    showData = data as Package;
  }

  if (!showData) {
    return <LoadingData />
  }

  const handleReduceItem = async(id: string) => {
    await reduceItem({ id, quantity: 1 });
  };

  const handleAddItem = async(id: string) => {
    await addItem({ id, quantity: 1 });
  };

  const calculateDiscount = (originalPrice: number, discountPrice: number): number => {
    return originalPrice - ((discountPrice/100) * originalPrice);
  };

  return (
    <div className="flex items-center justify-between p-4 border-2 rounded-lg border-default">
      <div className="flex items-center">
        <img
          alt={`Card order item ${item.id}`}
          className="w-12 h-12 rounded-full"
          src={typeItem == "MI" ? "/item.jpeg" : "/packageItem.jpeg"}
        />
        <div className="flex flex-col ml-3">
          <span className="font-semibold">{showData?.name}</span>
          <div className="flex flex-col my-auto text-sm text-foreground gap-x-2">
            {showData.discountPercent && showData.discountPercent > 0 ? (
              <span className="text-danger dark:text-danger-400">
                <span className="text-xs">Rp </span>
                {formatRupiah(
                  calculateDiscount(
                    showData?.price,
                    showData?.discountPercent ?? 0
                  )
                )}
              </span>
            ): (
              <span>
                <span className="text-xs">Rp </span>
                {formatRupiah(showData.price)}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        <Button
          color="danger"
          radius="full"
          variant="flat"
          size="sm"
          onPress={() => handleReduceItem(item.id)}
          isIconOnly
          startIcon={<MinusIcon fill="currentColor" size={12} />}
        />
        <span className="mx-1 text-sm font-bold">{item.quantity}</span>
        <Button
          color="success"
          radius="full"
          variant="flat"
          size="sm"
          onPress={() => handleAddItem(item.id)}
          isIconOnly
          startIcon={<PlusIcon fill="currentColor" size={12} />}
        />
      </div>
    </div>
  )
};

const LoadingData = () => {
  return (
    <div className="flex items-center justify-between p-4 border-2 rounded-lg border-default">
      <div className="flex items-center w-full">
        <div>
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
        <div className="flex flex-col w-full ml-3 space-y-3">
          <Skeleton className="w-3/5 h-3 rounded-lg" />
          <Skeleton className="w-2/5 h-3 rounded-lg" />
        </div>
      </div>
      <Skeleton className="flex justify-end h-10 rounded-full w-28" />
    </div>
  )
}
