import LayoutDashboard from "@/components/dashboard/Layout";
import ModalAddUser from "@/components/dashboard/users/ModalAddUser";
import ModalDetailUser from "@/components/dashboard/users/ModalDetailUser";
import { ChevronDownIcon, FilterIcon, SearchIcon } from "@/components/libs/Icons";
import TableDynamic, { type TableData, type TableColumn, type TableActions } from "@/components/libs/Table";
import { toastCustom, toastCustomLoading } from "@/components/libs/Toast";
import type { StatusData } from "@/server/pagination/pagination.schema";
import { api } from "@/utils/api";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Popover, PopoverContent, PopoverTrigger, Radio, RadioGroup, Spinner, useDisclosure } from "@nextui-org/react";
import { Role } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

const columns: TableColumn[] = [
  {name: "NAME", uid: "titleWithAvatar"},
  {name: "ROLE", uid: "category"},
  {name: "STATUS", uid: "status"},
  {name: "ACTIONS", uid: "actions"},
];

const Users: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const { isOpen: openModalDetail, onOpen: onOpenModalDetail, onOpenChange: onOpenChangeModalDetail } = useDisclosure();

  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [status, setStatus] = useState<string | undefined>("all" as StatusData);
  const [limit, setLimit] = useState<string | Set<React.Key>>(new Set(["10"]));

  const limitValue = useMemo(
    () =>
    Array.from(limit as Set<React.Key>)
      .map((item) => item)
      .join(", "),
    [limit],
  );

  const handleChangeViewNumber = useCallback((limit: string | Set<React.Key>) => {
    setLimit(limit);
    setPage(0);
  }, []);

  const handleChangeStatusView = useCallback((status: string) => {
    setStatus(status);
    setPage(0);
  }, []);

  const { data, fetchNextPage, isLoading, isError, refetch } = api.user.getAll.useInfiniteQuery(
    {
      limit: parseInt(limitValue),
      search,
      status: status as StatusData,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { mutate, status: statusDelete } = api.user.deleteOne.useMutation({
    onSuccess: async() => {
      await handleAddOrEditUserSuccess();
      toastCustom({
        type: "success",
        description: "User has been deleted",
      });
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        description: err.message || "Something went wrong",
      });
    }
  });

  const handleFetchNextPage = async () => {
    await fetchNextPage();
    setPage((prev) => prev + 1);
  };

  const handleAddOrEditUserSuccess = async () => {
    await refetch();
  }

  const handleDetail = (id: string) => {
    setUser(id);
    onOpenModalDetail();
  };

  const handleEdit = async (id: string) => {
    await router.replace(`/dashboard/users/${id}`);
  };

  const handleDelete = (id: string) => {
    if (session?.user.id !== id) {
      mutate({ id });

      if (statusDelete === "loading") {
        toastCustomLoading({
          description: "Deleting user...",
        });
      }
    } else {
      toastCustom({
        type: "error",
        description: "You can't delete your own account",
      });
    }
  };

  const { pages: pageData = [] } = data || {};

  const users: TableData[] = [];
  pageData.map((page => {
    users.push(
      ...page.users.filter((user) => {
          if (session?.user.role === Role.Owner) {
            return user;
          } else {
            return user.role !== Role.Owner;
          }
        }).map((user) => {
          return {
            id: user.id,
            titleWithAvatar: user.name || undefined,
            description: user.email || undefined,
            category: user.role.toString(),
            status: user.deletedAt ? "delete" : (user.blockExpires ? "block" : (user.isActive ? "active" : "inactive")),
          }
      }),
    );
  }))
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
    <LayoutDashboard title="Users">
      <div className="grid grid-cols-12 mb-8">
        <div className="col-span-6">
          <h1 className="text-2xl font-bold">Users</h1>
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
                        placeholder="Search user..."
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
                        <Radio value="active">Active</Radio>
                        <Radio value="inactive">Inactive</Radio>
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
          <ModalAddUser
            onSuccess={handleAddOrEditUserSuccess}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner color="secondary" />
        </div>
      ) : (
        <TableDynamic
          columns={columns}
          data={users}
          actions={actions}
          isLoading={isLoading}
          loadMore={handleFetchNextPage}
          cursor={cursor}
        />
      )}
      <ModalDetailUser
        isOpen={openModalDetail}
        onOpenChange={onOpenChangeModalDetail}
        user={user}
      />
    </LayoutDashboard>
  );
}

export default Users;
