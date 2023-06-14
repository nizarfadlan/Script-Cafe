import LayoutDashboard from "@/components/dashboard/Layout";
import { ChevronDownIcon, FilterIcon, PlusIcon, SearchIcon } from "@/components/libs/Icons";
import TableDynamic, { type TableActions, type TableColumn, type TableData } from "@/components/libs/Table";
import { toastCustom, toastCustomLoading } from "@/components/libs/Toast";
import { formatRupiah } from "@/libs/formatRupiah";
import type { StatusData } from "@/server/pagination/pagination.schema";
import { api } from "@/utils/api";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Popover, PopoverContent, PopoverTrigger, Radio, RadioGroup, Spinner } from "@nextui-org/react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

const columns: TableColumn[] = [
  {name: "NUMBER TABLE", uid: "title"},
  {name: "PAYMENT", uid: "category"},
  {name: "STATUS", uid: "status"},
  {name: "DATE TIME ORDER", uid: "createdAt"},
  {name: "ACTIONS", uid: "actions"},
];

const Order: NextPage = () => {
  const router = useRouter();
  const { query } = router;

  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string | undefined>("all" as StatusData);
  const [limit, setLimit] = useState<string | Set<React.Key>>(new Set(["10"]));

  const limitValue = useMemo(
    () =>
    Array.from(limit as Set<React.Key>)
      .map((item) => item)
      .join(", "),
    [limit],
  );

  const handleChangeViewNumber = useCallback(async(limit: string | Set<React.Key>) => {
    setLimit(limit);
    if (query.page) {
      query.page = "0";
    }
    setPage(0);
    await router.push(router);
  }, [query, router]);

  const handleChangeStatusView = useCallback(async(status: string) => {
    setStatus(status);
    if (query.page) {
      query.page = "0";
    }
    setPage(0);
    await router.push(router);
  }, [query, router]);

  const handleSearch = useCallback(async(value: string) => {
    setSearch(value);
    if (query.page) {
      query.page = "0";
    }
    setPage(0);
    await router.push(router);
  }, [query, router]);

  const { data, fetchNextPage, isLoading, isError, refetch } = api.order.getAll.useInfiniteQuery(
    {
      limit: parseInt(limitValue),
      search,
      status: status as StatusData,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { mutate, status: statusUpdate } = api.order.updateStatus.useMutation({
    onSuccess: async() => {
      await handleUpdateStatusUserSuccess();
      toastCustom({
        type: "success",
        description: "Order has been updated",
      });
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        description: err.message ?? "Failed to update order",
      });
    }
  });

  const handleUpdateStatusUserSuccess = async () => {
    await refetch();
  }

  const handleFetchNextPage = async () => {
    await fetchNextPage();
    setPage((prev) => prev + 1);
    query.page = page.toString();
    await router.push(router);
  };

  const handleDetail = async (id: string) => {
    await router.replace(`/dashboard/transaction/order/${id}`);
  };

  const handleEdit = async (id: string) => {
    await router.replace(`/dashboard/transaction/order/${id}/edit`);
  };

  const handleAccept = (id: string, status: StatusData) => {
    mutate({
      params: { id },
      body: status,
    });

    if (statusUpdate === "loading") {
      toastCustomLoading({
        description: "Updating order...",
      });
    }
  };

  const { pages: pageData = [] } = data || {};
  const items: TableData[] = [];
  pageData.map((page => {
    items.push(
      ...page.order.map((order) => ({
        id: order.id,
        title: order.table?.numberTable || undefined,
        description: `Rp ${formatRupiah(order.total)}`,
        category: order.paymentType.name || undefined,
        descriptionCategory: (
          order.paymentType.accountNumber.toString() == "0"
          ? "Payment via cashier"
          : order.paymentType.accountNumber.toString()
        ),
        createdAt: order.createdAt.toString(),
        status: !order.paid ? "unpaid" : (!order.finished ? "pending" : "paid"),
      })),
    );
  }))
  const cursor = pageData[page]?.nextCursor;

  const actions: TableActions = {
    accept: handleAccept,
    detail: handleDetail,
    edit: handleEdit,
  }

  useEffect(() => {
    if (isError) {
      toastCustom({
        type: "error",
        description: "Failed to fetch data"
      });
    }

    const fetchPage = async() => {
      if (query.page) {
        setPage(parseInt(query.page as string));
        await fetchNextPage();
      }
    }

    fetchPage().catch(console.error);

    return () => {
      setPage(0);
    }
  }, [query, fetchNextPage, isError]);

  return (
    <LayoutDashboard title="Order">
      <div className="grid grid-cols-12 mb-8">
        <div className="col-span-6">
          <h1 className="text-2xl font-bold">Order</h1>
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
                      <p className="mb-2 text-sm text-foreground">Search by table and payment</p>
                      <Input
                        classNames={{
                          innerWrapper: "gap-3",
                        }}
                        placeholder="Search order..."
                        value={search}
                        onValueChange={handleSearch}
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
                        <Radio value="paid">Paid</Radio>
                        <Radio value="unpaid">Unpaid</Radio>
                        <Radio value="processing">Processing</Radio>
                        <Radio value="finish">Finish</Radio>
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
            startIcon={<PlusIcon fill="currentColor" size={20} />}
            variant="shadow"
            color="secondary"
            aria-label="modal-add-payment"
            onPress={() => router.push("order/add")}
            className="min-w-max"
          >
            <p className="sr-only sm:not-sr-only">Add Order</p>
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner color="secondary" />
        </div>
      ) : (
        <TableDynamic
          columns={columns}
          data={items}
          actions={actions}
          isLoading={isLoading}
          loadMore={handleFetchNextPage}
          cursor={cursor}
        />
      )}
    </LayoutDashboard>
  );
}

export default Order;
