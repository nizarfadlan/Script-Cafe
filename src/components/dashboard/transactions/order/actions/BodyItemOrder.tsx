import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";
import type { IItemsOnOrder } from "@/types/order.type";
import { ChevronDownIcon, FilterIcon, SearchIcon } from "@/components/libs/Icons";
import MenuItemComponent from "./MenuItem";
import PackageItemComponent from "./PackageItem";
import { useRouter } from "next/router";

interface IBodyItemOrder {
  items: IItemsOnOrder[];
  addItem: (item: IItemsOnOrder) => Promise<void>;
  reduceItem: (item: IItemsOnOrder) => Promise<void>;
}

const BodyItemOrder: React.FC<IBodyItemOrder> = ({
  items,
  addItem,
  reduceItem,
}) => {
  const router = useRouter();
  const { query } = router;

  const [search, setSearch] = useState<string>("");
  const [limit, setLimit] = useState<string | Set<React.Key>>(new Set(["6"]));

  const limitValue = useMemo(
    () =>
    Array.from(limit as Set<React.Key>)
      .map((packageItem) => packageItem)
      .join(", "),
    [limit],
  );

  const handleChangeViewNumber = useCallback(async(limit: string | Set<React.Key>) => {
    setLimit(limit);
    if (query.pageItem) {
      query.pageItem = "0";
    }

    if (query.pagePackage) {
      query.pagePackage = "0";
    }

    await router.push(router);
  }, [query, router]);

  const handleSearch = useCallback(async(value: string) => {
    setSearch(value);
    if (query.pageItem) {
      query.pageItem = "0";
    }

    if (query.pagePackage) {
      query.pagePackage = "0";
    }

    await router.push(router);
  }, [query, router]);

  return (
    <>
      <div className="flex items-center justify-between w-full mb-5">
        <h2>Items Order</h2>
        <Popover
          showArrow
          offset={10}
          placement="bottom-end"
          className="w-[280px] bg-white dark:bg-content1 py-2"
        >
          <PopoverTrigger>
            <Button
              variant="bordered"
              startIcon={<FilterIcon size={18} />}
              className="min-w-max sm:w-[120px] hover:bg-default hover:text-default-foreground hover:shadow-lg hover:shadow-default/40"
            >
              <p className="sr-only sm:not-sr-only">Filter</p>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            {(titleProps) => (
              <div className="w-full px-1 py-2">
                <h4 className="text-lg font-bold text-foreground" {...titleProps}>
                  Filter
                </h4>
                <div className="flex flex-col w-full mt-3 gap-y-5">
                  <div>
                    <p className="mb-2 text-sm text-foreground">Search by name</p>
                    <Input
                      classNames={{
                        innerWrapper: "gap-3",
                      }}
                      placeholder="Search item..."
                      value={search}
                      onValueChange={handleSearch}
                      startContent={<SearchIcon size={18} />}
                      isClearable
                      onClear={() => setSearch("")}
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-sm text-foreground">View</p>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="light"
                          endIcon={<ChevronDownIcon fill="currentColor" size={18} />}
                        >
                          {limitValue}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        disallowEmptySelection
                        aria-label="Actions"
                        color="secondary"
                        selectedKeys={limit}
                        selectionMode="single"
                        onSelectionChange={handleChangeViewNumber}
                      >
                        <DropdownItem key="10">10</DropdownItem>
                        <DropdownItem key="25">25</DropdownItem>
                        <DropdownItem key="50">50</DropdownItem>
                        <DropdownItem key="75">75</DropdownItem>
                        <DropdownItem key="100">100</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
      <section>
        <MenuItemComponent
          items={items}
          search={search}
          limit={parseInt(limitValue)}
          addItem={addItem}
          reduceItem={reduceItem}
        />
      </section>
      <Divider className="my-7" />
      <section>
        <PackageItemComponent
          items={items}
          search={search}
          limit={parseInt(limitValue)}
          addItem={addItem}
          reduceItem={reduceItem}
        />
      </section>
    </>
  );
}

export default BodyItemOrder;
