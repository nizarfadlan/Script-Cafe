import type { IItemsOnOrder } from "@/types/order.type";
import { api } from "@/utils/api";
import { Button, Spinner } from "@nextui-org/react";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import CardItemOrder from "../CardItemOrder";
import type { Package } from "@prisma/client";
import { useRouter } from "next/router";

const PackageItemComponent = ({
  items,
  search,
  limit,
  addItem,
  reduceItem,
}: {
  items: IItemsOnOrder[],
  search: string,
  limit: number,
  addItem: (item: IItemsOnOrder) => Promise<void>,
  reduceItem: (item: IItemsOnOrder) => Promise<void>,
}) => {
  const router = useRouter();
  const { query } = router;
  const [pagePackage, setPagePackage] = useState<number>(query.pagePackage ? parseInt(query.pagePackage as string) : 0);

  const { data, fetchNextPage, isLoading, isFetchingNextPage, isError } = api.packageItem.getAll.useInfiniteQuery(
    {
      limit,
      search,
      status: "available",
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const handleFetchNextPage = useCallback(async() => {
    await fetchNextPage();
    setPagePackage((prev) => prev + 1);
    router.query.pagePackage = `${pagePackage + 1}`;
    await router.push(router, undefined, { scroll: false });
  }, [fetchNextPage, router, pagePackage]);

  const { pages: pageData = [] } = data || {};
  const showData: Package[] = [];
  if (pagePackage > 0 && pageData.length > 0) {
    pageData.map((page) => {
      showData.push(...page.packageItems);
    });
  } else {
    showData.push(...pageData[0]?.packageItems ?? []);
  }

  const nextCursor = pageData[pagePackage]?.nextCursor;

  useEffect(() => {
    const fetchPage = async() => {
      if (query.pagePackage) {
        setPagePackage(parseInt(query.pagePackage as string));
        await fetchNextPage();
      }
    }

    fetchPage().catch(console.error);

    return () => {
      setPagePackage(0);
    }
  }, [query.pagePackage, fetchNextPage]);

  return (
    <Fragment>
      <h1 className="mb-3 text-lg font-semibol">Packages Menu</h1>
      <div className="grid items-center grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isError && (
          <div className="flex justify-center col-span-12">
            <p className="text-lg font-semibold text-red-500">Error while fetching data</p>
          </div>
        )}
        {isLoading || (isFetchingNextPage && !showData) && (
          <div className="flex justify-center col-span-12">
            <Spinner color="secondary" />
          </div>
        )}
        {!isLoading && showData.length > 0 ? (
          <CardItemOrder
            data={showData}
            items={items}
            addItem={addItem}
            reduceItem={reduceItem}
          />
        ): (
          <p className="h-40 my-8 text-center align-middle text-default-400 col-span-full">No data to available.</p>
        )}
      </div>
      {nextCursor && (
        <div className="flex justify-center w-full mt-6">
          <Button
            isDisabled={isLoading}
            variant="bordered"
            onPress={handleFetchNextPage}
            isLoading={isLoading}
          >
            Load More
          </Button>
        </div>
      )}
    </Fragment>
  )
}

export default PackageItemComponent;
