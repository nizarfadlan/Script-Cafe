import LayoutDashboard from "@/components/dashboard/Layout";
import ModalAddTable from "@/components/dashboard/table/ModalAddTable";
import ModalDetailTable from "@/components/dashboard/table/ModalDetailTable";
import ModalEditTable from "@/components/dashboard/table/ModalEditTable";
import { ChevronDownIcon, FilterIcon, PlusIcon, SearchIcon } from "@/components/libs/Icons";
import TableDynamic, { type TableActions, type TableColumn, type TableData } from "@/components/libs/Table";
import { toastCustom, toastCustomLoading } from "@/components/libs/Toast";
import { api } from "@/utils/api";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Popover, PopoverContent, PopoverTrigger, Spinner, useDisclosure } from "@nextui-org/react";
import { type NextPage } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";

const columns: TableColumn[] = [
  {name: "NUMBER TABLE", uid: "title"},
  {name: "ACTIONS", uid: "actions"},
];

const Table: NextPage = () => {
  const { isOpen: isOpenModalAdd, onOpen: onOpenModalAdd, onOpenChange: onOpenChangeModalAdd } = useDisclosure();

  const { isOpen: isOpenModalEdit, onOpen: onOpenModalEdit, onOpenChange: onOpenChangeModalEdit } = useDisclosure();

  const { isOpen: openModalDetail, onOpen: onOpenModalDetail, onOpenChange: onOpenChangeModalDetail } = useDisclosure();

  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [table, setTable] = useState<string>("");
  const [limit, setLimit] = useState<string | Set<React.Key>>(new Set(["10"]));

  const limitValue = useMemo(
    () =>
    Array.from(limit as Set<React.Key>)
      .map((item) => item)
      .join(", "),
    [limit],
  );

  const { data, fetchNextPage, isLoading, isError, refetch } = api.table.getAll.useInfiniteQuery(
    {
      limit: parseInt(limitValue),
      search,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const handleChangeViewNumber = useCallback((limit: string | Set<React.Key>) => {
    setLimit(limit);
    setPage(0);
  }, []);

  const { mutate, status: statusDelete } = api.table.deleteTable.useMutation({
    onSuccess: async() => {
      await handleAddOrEditUserSuccess();
      toastCustom({
        type: "success",
        description: "Table has been deleted",
      });
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        description: err.message || "Something went wrong",
      });
    }
  });

  const handleAddOrEditUserSuccess = async () => {
    await refetch();
  };

  const handleFetchNextPage = async () => {
    await fetchNextPage();
    setPage((prev) => prev + 1);
  };

  const handleDetail = (id: string) => {
    setTable(id);
    onOpenModalDetail();
  };

  const handleEdit = (id: string) => {
    setTable(id);
    onOpenModalEdit();
  };

  const handleDelete = (id: string) => {
    mutate({ id });

    if (statusDelete === "loading") {
      toastCustomLoading({
        description: "Deleting table...",
      });
    }
  };

  const { pages: pageData = [] } = data || {};

  const tables: TableData[] = [];
  pageData.map((page) => {
    tables.push(
      ...page.tables.map((table) => {
        return {
          id: table.id,
          title: table.numberTable || undefined,
        }
      }),
    );
  })

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
    <LayoutDashboard title="Table">
      <div className="grid grid-cols-12 mb-8">
        <div className="col-span-6">
          <h1 className="text-2xl font-bold">Table</h1>
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
          <Button
            startIcon={<PlusIcon fill="currentColor" size={20} />}
            variant="shadow"
            color="secondary"
            aria-label="modal-add-table"
            onPress={onOpenModalAdd}
            className="min-w-max"
          >
            <p className="sr-only sm:not-sr-only">Add Table</p>
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
            data={tables}
            actions={actions}
            isLoading={isLoading}
            loadMore={handleFetchNextPage}
            cursor={cursor}
          />
        </>
      }
      <ModalAddTable
        isOpen={isOpenModalAdd}
        onOpenChange={onOpenChangeModalAdd}
        onSuccess={handleAddOrEditUserSuccess}
      />
      <ModalEditTable
        isOpen={isOpenModalEdit}
        onOpenChange={onOpenChangeModalEdit}
        onSuccess={handleAddOrEditUserSuccess}
        table={table}
      />
      <ModalDetailTable
        isOpen={openModalDetail}
        onOpenChange={onOpenChangeModalDetail}
        table={table}
      />
    </LayoutDashboard>
  );
}

export default Table;
