import type { IItemsOnOrder } from "@/types/order.type";
import { api } from "@/utils/api";
import { Spinner } from "@nextui-org/react";
import React, { Fragment } from "react";
import CardItemOrder from "../CardItemOrder";

const PackageItemComponent = ({
  items,
}: {
  items: IItemsOnOrder[],
}) => {
  const { data, isLoading, isError } = api.packageItem.getAllWithId.useQuery(
    items.map((item) => {
      return {
        id: item.id,
      }
    })
  );


  return (
    <Fragment>
      <h1 className="mb-3 text-lg font-semibol">Packages Menu</h1>
      <div className="grid items-center grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isError && (
          <div className="flex justify-center col-span-12">
            <p className="text-lg font-semibold text-red-500">Error while fetching data</p>
          </div>
        )}
        {isLoading && (
          <div className="flex justify-center col-span-12">
            <Spinner color="secondary" />
          </div>
        )}
        {!isLoading && data && data.length > 0 ? (
          <CardItemOrder
            data={data}
            items={items}
            type="view"
          />
        ): (
          <p className="h-40 my-8 text-center align-middle text-default-400 col-span-full">On the package items menu no data is selected.</p>
        )}
      </div>
    </Fragment>
  )
}

export default PackageItemComponent;
