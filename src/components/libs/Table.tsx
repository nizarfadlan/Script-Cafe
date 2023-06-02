import { Chip, type ChipProps, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User, Button, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";
import {EditIcon, DeleteIcon, EyeIcon} from "@nextui-org/shared-icons";
import { DeletePopUp } from "./DeletePopup";

export interface TableActions {
  edit: (id: string) => Promise<void> | void;
  delete: (id: string) => void;
  detail: (id: string) => Promise<void> | void;
}

export interface TableData {
  id: string;
  title?: string | React.ReactNode;
  titleWithAvatar?: string;
  description?: string | React.ReactNode;
  category: string | React.ReactNode;
  descriptionCategory?: string | React.ReactNode;
  status: string;
}

export interface TableColumn {
  name: string;
  uid: string;
}

interface TableDataProps {
  columns: TableColumn[],
  data: TableData[];
  actions: TableActions;
  isLoading?: boolean;
  loadMore?: () => void;
  cursor?: string;
}

export default function TableDynamic({
  columns,
  data,
  actions,
  isLoading,
  loadMore,
  cursor,
}: TableDataProps) {
  const { isOpen: openModalDelete, onOpenChange: onOpenChangeModalDelete } = useDisclosure();
  const [id, setId] = useState("");
  type Data = typeof data[0];

  const statusColorMap: Record<string, ChipProps["color"]> = React.useMemo(() => {
    return {
      active: "success",
      inactive: "danger",
      available: "success",
      unavailable: "danger",
      delete: "danger",
      block: "warning",
    }
  }, []);

  const renderCell = React.useCallback((row: Data, columnKey: React.Key) => {
    const modalDelete = (id: string) => {
      onOpenChangeModalDelete();
      setId(id);
    }

    const cellValue = row[columnKey as keyof Data];

    switch (columnKey) {
      case "title":
        return row.title;
      case "titleWithAvatar":
        return (
          <User
            avatarProps={{ radius: "xl", src: "/avatar.png" }}
            description={row.description}
            name={row.titleWithAvatar}
            classNames={{
              description: [
                'text-neutral-400',
                'dark:text-neutral-600'
              ],
            }}
          >
            {row.titleWithAvatar}
          </User>
        );
      case "category":
        return (
          <div className="flex flex-col">
            <div className="text-sm capitalize text-bold">{row.category}</div>
            <div className="text-sm capitalize text-bold text-neutral-400">{row.descriptionCategory}</div>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[row.status]} size="sm" variant="flat">
            {row.status}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Detail data" className="text-sm">
              <Button onPress={() => actions?.detail(row.id)} isIconOnly variant="light">
                <span className="text-lg cursor-pointer text-neutral-400 active:opacity-50">
                  <EyeIcon />
                </span>
              </Button>
            </Tooltip>
            <Tooltip color="warning" className="text-sm" content="Edit data">
              <Button onPress={() => actions?.edit(row.id)} isIconOnly variant="light">
                <span className="text-lg cursor-pointer text-warning-400 active:opacity-50">
                  <EditIcon />
                </span>
              </Button>
            </Tooltip>
            <Tooltip color="danger" className="text-sm" content="Delete data">
              <Button onPress={() => modalDelete(row.id)} isIconOnly variant="light">
                <span className="text-lg cursor-pointer text-danger active:opacity-50">
                  <DeleteIcon />
                </span>
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, [statusColorMap, actions, onOpenChangeModalDelete]);

  return (
    <>
      <Table
        classNames={{
          base: [
            'bg-background',
            'shadow-xl',
            'shadow-secondary-200/20',
            'dark:shadow-background/20',
            'border-none',
            'backdrop-filter',
            'backdrop-blur-lg',
            'bg-opacity-50',
          ],
          td: [
            'py-4',
            'border-b',
            'border-white/10',
            'group-data-[last=true]:border-b-0'
          ],
        }}
        color="default"
        isHeaderSticky
        bottomContent={
          cursor ? (
            <div className="flex justify-center w-full">
              <Button
                isDisabled={isLoading}
                variant="flat"
                onPress={loadMore}
                isLoading={isLoading}
              >
                Load More
              </Button>
            </div>
          ) : null
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No data to display."}
          items={data}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DeletePopUp
        isOpen={openModalDelete}
        onOpenChange={onOpenChangeModalDelete}
        handler={() => actions?.delete(id)}
      />
    </>
  );
}
