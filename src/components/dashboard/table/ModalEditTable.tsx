import { toastCustom } from "@/components/libs/Toast";
import { type UpdateTableInput, updateTableSchema } from "@/server/table/table.schema";
import type { DefaultPropsModal } from "@/types/modal.type";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

interface Props extends DefaultPropsModal {
  onSuccess: () => Promise<void>;
  table: string;
}

export default function ModalEditTable({ isOpen, onOpenChange, onSuccess, table }: Props) {
  const { data, isLoading: loadingData, refetch } = api.table.getOne.useQuery({ id: table });

  const { mutate, isLoading } = api.table.updateTable.useMutation({
    onSuccess: async() => {
      await onSuccess();
      onOpenChange!();
      toastCustom({
        type: "success",
        description: "Table has been updated",
      });
      await refetch();
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        description: `Table failed updated. ${err.message ?? ""}`,
      });
    },
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<UpdateTableInput>({
    mode: "onChange",
    defaultValues: {
      params: {
        id: table ?? data?.id,
      },
      body: {
        numberTable: data?.numberTable,
      }
    },
    resolver: zodResolver(updateTableSchema),
  });

  useEffect(() => {
    reset();
    setValue("params.id", table);
  }, [table, reset, setValue]);

  const onSubmit: SubmitHandler<UpdateTableInput> = (dataInput): void => {
    mutate(dataInput);
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      aria-labelledby="modal-edit-table"
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              Edit Table
            </ModalHeader>
            <ModalBody>
              {data && !loadingData ? (
                <>
                  <input hidden {...register("params.id")} />
                  <Input
                    {...register("body.numberTable", {
                      required: true,
                    })}
                    defaultValue={data.numberTable}
                    label="Number Table"
                    placeholder="Enter number table"
                    variant="bordered"
                    validationState={errors.body?.numberTable ? "invalid" : "valid"}
                    isRequired
                    errorMessage={errors.body?.numberTable && errors.body.numberTable?.message}
                  />
                </>
              ) : (
                <div className="flex justify-center">
                  <Spinner color="secondary" />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button type="button" variant="flat" color="danger" onPress={onClose} disabled={isLoading}>
                Close
              </Button>
              <Button color="secondary" type="submit" isDisabled={isLoading} isLoading={isLoading}>
                Submit
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}
