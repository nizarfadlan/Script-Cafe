import { Chip, type ChipProps, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User, Button, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";
import {EditIcon, DeleteIcon, EyeIcon} from "@nextui-org/shared-icons";
import { DeletePopUp } from "./DeletePopup";
import moment from "moment";
import { CheckIcon, RestaurantIcon, UtensilsIcon } from "./Icons";
import type { StatusData } from "@/server/pagination/pagination.schema";

export interface TableActions {
  edit: (id: string) => Promise<void> | void;
  delete?: (id: string) => void;
  detail?: (id: string) => Promise<void> | void;
  accept?: (id: string, status: StatusData) => Promise<void> | void;
}

export interface TableData {
  id: string;
  title?: string | React.ReactNode;
  titleWithAvatar?: string;
  description?: string | React.ReactNode;
  category?: string | React.ReactNode;
  descriptionCategory?: string | React.ReactNode;
  createdAt?: string;
  status?: string;
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

      // Only order
      unpaid: "danger",
      paid: "success",
      pending: "warning",
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
        return (
          <div className="flex flex-col">
            <div className="text-sm capitalize text-bold">{row.title}</div>
            {row.description &&
              <div className="text-xs text-neutral-400 dark:text-neutral-600">{row.description}</div>
            }
          </div>
        );
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
          <>
            {row.status === "pending" ? (
              <Chip className="capitalize" color={statusColorMap[row.status || ""]} size="sm" variant="flat">
                Paid And Processing
              </Chip>
            ) : row.status === "paid" ? (
              <Chip className="capitalize" color={statusColorMap[row.status || ""]} size="sm" variant="flat">
                Paid And Finished
              </Chip>
            ): (
              <Chip className="capitalize" color={statusColorMap[row.status || ""]} size="sm" variant="flat">
                {row.status}
              </Chip>
            )}
          </>
        );
      case "createdAt":
        return (
          <div className="text-sm capitalize text-bold">{moment(row.createdAt).format("dddd, DD MMMM YYYY | h:mm:ss A")}</div>
        )
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            {row.status !== "paid" && actions && actions.accept && (
              <Tooltip
                content={
                  row.status === "pending"
                  ? "Finished order"
                  : (
                      row.status === "paid"
                      ? "Unfinished order"
                      : "Accepted payment order"
                    )
                }
                className="text-sm">
                <Button
                  onPress={() =>
                    actions?.accept?.(
                      row.id,
                      row.status === "pending"
                        ? "paid"
                        : (
                          row.status === "paid"
                          ? "finish"
                          : row.status as StatusData
                        )
                    )
                  }
                  isIconOnly
                  variant="light"
                >
                  <span
                    className={`
                    text-lg cursor-pointer
                    ${row.status === "paid" ? "text-danger-400" : "text-success-400"}
                    active:opacity-50
                    `}
                  >
                    {row.status === "pending" ? (
                      <RestaurantIcon />
                    ): row.status === "paid" ? (
                      <UtensilsIcon />
                    ): (
                      <CheckIcon />
                    )}
                  </span>
                </Button>
              </Tooltip>
            )}
            {actions && actions.detail && (
              <Tooltip content="Detail data" className="text-sm">
                <Button onPress={() => actions?.detail?.(row.id)} isIconOnly variant="light">
                  <span className="text-lg cursor-pointer text-neutral-400 active:opacity-50">
                    <EyeIcon />
                  </span>
                </Button>
              </Tooltip>
            )}
            {row.status !== "paid" && actions && actions.edit && (
              <Tooltip color="warning" className="text-sm" content="Edit data">
                <Button onPress={() => actions?.edit(row.id)} isIconOnly variant="light">
                  <span className="text-lg cursor-pointer text-warning-400 active:opacity-50">
                    <EditIcon />
                  </span>
                </Button>
              </Tooltip>
            )}
            {actions && actions.delete && (
              <Tooltip color="danger" className="text-sm" content="Delete data">
                <Button onPress={() => modalDelete(row.id)} isIconOnly variant="light">
                  <span className="text-lg cursor-pointer text-danger active:opacity-50">
                    <DeleteIcon />
                  </span>
                </Button>
              </Tooltip>
            )}
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
        handler={actions?.delete ? () => actions.delete?.(id) : undefined}
      />
    </>
  );
}
