import LayoutDashboard from "@/components/dashboard/Layout";
import ModalAddItem from "@/components/dashboard/items/ModalAddItem";
import ModalDetailItem from "@/components/dashboard/items/ModalDetailItem";
import { ChevronDownIcon, FilterIcon, SearchIcon } from "@/components/libs/Icons";
import TableDynamic, { type TableData, type TableColumn, type TableActions } from "@/components/libs/Table";
import { toastCustom, toastCustomLoading } from "@/components/libs/Toast";
import type { StatusData } from "@/server/pagination/pagination.schema";
import { api } from "@/utils/api";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Popover, PopoverContent, PopoverTrigger, Radio, RadioGroup, Spinner, useDisclosure } from "@nextui-org/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

const columns: TableColumn[] = [
  {name: "NAME", uid: "title"},
  {name: "PRICE", uid: "category"},
  {name: "STATUS", uid: "status"},
  {name: "ACTIONS", uid: "actions"},
];

const Item: NextPage = () => {
  const router = useRouter();
  const { isOpen: openModalDetail, onOpen: onOpenModalDetail, onOpenChange: onOpenChangeModalDetail } = useDisclosure();

  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [item, setItem] = useState<string>("");
  const [status, setStatus] = useState<string | undefined>("all" as StatusData);
  const [limit, setLimit] = useState<string | Set<React.Key>>(new Set(["10"]));

  const limitValue = useMemo(
    () =>
    Array.from(limit as Set<React.Key>)
      .map((item) => item)
      .join(", "),
    [limit],
  );

  const { data, fetchNextPage, isLoading, isError, refetch } = api.item.getAll.useInfiniteQuery(
    {
      limit: parseInt(limitValue),
      skip: (page - 1) * parseInt(limitValue),
      search,
      status: status as StatusData,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { mutate, status: statusDelete } = api.item.deleteItem.useMutation({
    onSuccess: async() => {
      await handleAddOrEditItemSuccess();
      toastCustom({
        type: "success",
        description: "Item has been deleted"
      });
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        description: err.message || "Something went wrong"
      });
    }
  });

  const handleFetchNextPage = useCallback(async() => {
    await fetchNextPage();
    setPage((prev) => prev + 1);
  }, [fetchNextPage]);

  const handleAddOrEditItemSuccess = async (): Promise<void> => {
    await refetch();
  }

  const handleDetail = (id: string): void => {
    setItem(id);
    onOpenModalDetail();
  };

  const handleEdit = async (id: string): Promise<void> => {
    await router.replace(`/dashboard/menu/item/${id}`);
  };

  const handleDelete = (id: string): void => {
    mutate({ id });

    if (statusDelete === "loading") {
      toastCustomLoading({
        description: "Deleting item...",
      });
    }
  };

  const calculateDiscount = (originalPrice: number, discountPrice: number): number => {
    return originalPrice - ((discountPrice/100) * originalPrice);
  }

  const { pages: pageData = [] } = data || {};

  const items: TableData[] = pageData[page-1]?.items.map((item) => {
    let diskon = 0;
    if (item.discountPercent && item.discountPercent > 0) {
      diskon = calculateDiscount(item.price, item.discountPercent);
    }
    return {
      id: item.id,
      title: item.name || undefined,
      category: (diskon > 0 ?
          <div className="flex gap-x-2">
            <span className="line-through">Rp.{item.price.toString()}</span>
            <span className="text-danger">Rp.{diskon}</span>
          </div>
        :
          "Rp." + item.price.toString()
      ),
      descriptionCategory: (item.discountPercent?.toString() || "0") + " %",
      status: item.deletedAt ? "delete" : (item.available ? "available" : "unavailable"),
    }
  }) || [];
  const cursor = pageData[page-1]?.nextCursor;

  const actions: TableActions = {
    detail: handleDetail,
    edit: handleEdit,
    delete: handleDelete,
  }

  useEffect(() => {
    if (isError) {
      toastCustom({
        type: "error",
        description: "Failed to fetch data"
      });
    }
  }, [isError]);

  return (
    <LayoutDashboard title="Menu Item">
      <div className="grid grid-cols-12 mb-8">
        <div className="col-span-6">
          <h1 className="text-2xl font-bold">Item</h1>
        </div>
        <div className="flex justify-end col-span-6 gap-x-3">
          <Popover
            showArrow
            offset={10}
            placement="bottom-end"
            variant="shadow"
            className="w-[280px] bg-white dark:bg-content1 py-2"
          >
            <PopoverTrigger>
              <Button
                variant="bordered"
                color="secondary"
                startIcon={<FilterIcon size={18} />}
                className="min-w-max sm:w-[120px] hover:bg-secondary hover:text-secondary-foreground hove:shadow-lg hover:shadow-secondary/40"
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
                        onValueChange={setSearch}
                        startContent={<SearchIcon size={18} />}
                        isClearable
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-sm text-foreground">Status</p>
                      <RadioGroup
                        value={status}
                        onValueChange={setStatus}
                        color="secondary"
                      >
                        <Radio value="all">All</Radio>
                        <Radio value="available">Available</Radio>
                        <Radio value="unavailable">Unavailable</Radio>
                        <Radio value="deleted">Deleted</Radio>
                      </RadioGroup>
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
                          onSelectionChange={setLimit}
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
          <ModalAddItem
            onSuccess={handleAddOrEditItemSuccess}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner color="secondary" />
        </div>
      ) :
        <>
          <TableDynamic
            columns={columns}
            data={items}
            actions={actions}
            isLoading={isLoading}
            loadMore={handleFetchNextPage}
            cursor={cursor}
          />
        </>
      }
      <ModalDetailItem
        isOpen={openModalDetail}
        onOpenChange={onOpenChangeModalDetail}
        item={item}
      />
    </LayoutDashboard>
  );
}

export default Item;
