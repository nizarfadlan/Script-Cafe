import LayoutDashboard from "@/components/dashboard/Layout";
import { ChevronDownIcon, FilterIcon, PlusIcon, SearchIcon } from "@/components/libs/Icons";
import TableDynamic, { type TableData, type TableColumn, type TableActions } from "@/components/libs/Table";
import { toastCustom, toastCustomLoading } from "@/components/libs/Toast";
import { formatRupiah } from "@/libs/formatRupiah";
import type { StatusData } from "@/server/pagination/pagination.schema";
import { api } from "@/utils/api";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Popover, PopoverContent, PopoverTrigger, Radio, RadioGroup, Spinner } from "@nextui-org/react";
import { Role } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

const columns: TableColumn[] = [
  {name: "NAME", uid: "title"},
  {name: "PRICE", uid: "category"},
  {name: "STATUS", uid: "status"},
  {name: "ACTIONS", uid: "actions"},
];

const PackageItem: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string | undefined>("all" as StatusData);
  const [limit, setLimit] = useState<string | Set<React.Key>>(new Set(["10"]));

  const limitValue = useMemo(
    () =>
    Array.from(limit as Set<React.Key>)
      .map((packageItem) => packageItem)
      .join(", "),
    [limit],
  );

  const handleChangeStatusView = useCallback((status: string) => {
    setStatus(status);
    setPage(0);
  }, []);

  const handleChangeViewNumber = useCallback((limit: string | Set<React.Key>) => {
    setLimit(limit);
    setPage(0);
  }, []);

  const { data, fetchNextPage, isLoading, isError, refetch } = api.packageItem.getAll.useInfiniteQuery(
    {
      limit: parseInt(limitValue),
      search,
      status: status as StatusData,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { mutate, status: statusDelete } = api.packageItem.deletePackage.useMutation({
    onSuccess: async() => {
      await handleAddOrEditItemSuccess();
      toastCustom({
        type: "success",
        description: "Package item has been deleted"
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

  const handleDetail = async (id: string): Promise<void> => {
    await router.replace(`/dashboard/menu/package/${id}`);
  };

  const handleEdit = async (id: string): Promise<void> => {
    await router.replace(`/dashboard/menu/package/${id}/edit`);
  };

  const handleDelete = (id: string): void => {
    if (session?.user.role === Role.Manajer || session?.user.role === Role.Owner) {
      mutate({ id });

      if (statusDelete === "loading") {
        toastCustomLoading({
          description: "Deleting package item...",
        });
      }
    } else {
      toastCustom({
        type: "error",
        description: "You don't have permission to delete package item",
      });
    }
  };

  const calculateDiscount = (originalPrice: number, discountPrice: number): number => {
    return originalPrice - ((discountPrice/100) * originalPrice);
  }

  const { pages: pageData = [] } = data || {};
  const packageItems: TableData[] = [];
  pageData.map((page) => {
    packageItems.push(
      ...page.packageItems.map((packageItem) => {
        let diskon = 0;
        if (packageItem.discountPercent && packageItem.discountPercent > 0) {
          diskon = calculateDiscount(packageItem.price, packageItem.discountPercent);
        }

        let status = "available";
        if (packageItem.deletedAt) {
          status = "delete";
        } else {
          const allAvailable = packageItem.items.every((item) => item.item.available);
          status = allAvailable ? "available" : "unavailable";
        }

        return {
          id: packageItem.id,
          title: packageItem.name || undefined,
          category: (diskon > 0 ?
              <div className="flex gap-x-2">
                <span className="line-through">Rp {formatRupiah(packageItem.price)}</span>
                <span className="text-danger">Rp {formatRupiah(diskon)}</span>
              </div>
            :
              <span>Rp {formatRupiah(packageItem.price)}</span>
          ),
          descriptionCategory: (packageItem.discountPercent?.toString() || "0") + " %",
          status,
        }
      }),
    );
  });
  const cursor = pageData[page]?.nextCursor;

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
    <LayoutDashboard title="Package Menu">
      <div className="grid grid-cols-12 mb-8">
        <div className="col-span-6">
          <h1 className="text-2xl font-bold">Package</h1>
        </div>
        <div className="flex justify-end col-span-6 gap-x-3">
          <Popover
            showArrow
            offset={10}
            placement="bottom-end"
            className="w-[280px] bg-white dark:bg-content1 py-2"
          >
            <PopoverTrigger>
              <Button
                variant="bordered"
                color="secondary"
                startIcon={<FilterIcon size={18} />}
                className="min-w-max sm:w-[120px] hover:bg-secondary hover:text-secondary-foreground hover:shadow-lg hover:shadow-secondary/40"
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
                        onClear={() => setSearch("")}
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-sm text-foreground">Status</p>
                      <RadioGroup
                        value={status}
                        onValueChange={handleChangeStatusView}
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
          <Button
            startIcon={<PlusIcon fill="currentColor" size={18} />}
            variant="shadow"
            color="secondary"
            onPress={() => router.replace("package/add")}
            className="min-w-max"
          >
            <p className="sr-only sm:not-sr-only">Add Package</p>
          </Button>
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
            data={packageItems}
            actions={actions}
            isLoading={isLoading}
            loadMore={handleFetchNextPage}
            cursor={cursor}
          />
        </>
      }
    </LayoutDashboard>
  );
}

export default PackageItem;
