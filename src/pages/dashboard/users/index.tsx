import LayoutDashboard from "@/components/dashboard/Layout";
import ModalAddUser from "@/components/dashboard/users/ModalAddUser";
import ModalDetailUser from "@/components/dashboard/users/ModalDetailUser";
import TableDynamic, { type TableData, type TableColumn, type TableActions } from "@/components/libs/Table";
import { toastCustom, toastCustomLoading } from "@/components/libs/Toast";
import { api } from "@/utils/api";
import { Spinner, useDisclosure } from "@nextui-org/react";
import { Role } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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

  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [user, setUser] = useState<string>("");

  const { data, fetchNextPage, isLoading, isError, refetch } = api.user.getAll.useInfiniteQuery(
    {
      limit: 10,
      skip: (page - 1) * 10,
      search,
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

  const users: TableData[] = pageData[page-1]?.users.filter((user) => {
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
    <LayoutDashboard title="Users">
      <div className="grid grid-cols-12 mb-8">
        <div className="col-span-6">
          <h1 className="text-2xl font-bold">Users</h1>
        </div>
        <div className="flex justify-end col-span-6">
          <ModalAddUser
            onSuccess={handleAddOrEditUserSuccess}
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
            data={users}
            actions={actions}
            isLoading={isLoading}
            loadMore={handleFetchNextPage}
            cursor={cursor}
          />
        </>
      }
      <ModalDetailUser
        isOpen={openModalDetail}
        onOpenChange={onOpenChangeModalDetail}
        user={user}
      />
    </LayoutDashboard>
  );
}

export default Users;
