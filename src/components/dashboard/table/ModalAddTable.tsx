import { toastCustom } from "@/components/libs/Toast";
import { type CreateTableInput, createTableSchema } from "@/server/table/table.schema";
import type { DefaultPropsModal } from "@/types/modal.type";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { type SubmitHandler, useForm } from "react-hook-form";

interface Props extends DefaultPropsModal {
  onSuccess: () => Promise<void>;
}

export default function ModalAddTable({ isOpen, onOpenChange, onSuccess }: Props) {
  const { mutate, isLoading } = api.table.createTable.useMutation({
    onSuccess: async() => {
      await onSuccess();
      onOpenChange!();
      toastCustom({
        type: "success",
        description: "Table has been added",
      });
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        description: `Table has been added. ${err.message ?? ""}`,
      });
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<CreateTableInput>({
    mode: "onChange",
    resolver: zodResolver(createTableSchema),
  });

  const onSubmit: SubmitHandler<CreateTableInput> = (dataInput): void => {
    mutate(dataInput);
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      aria-labelledby="modal-add-table"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                Add Table
              </ModalHeader>
              <ModalBody>
                <Input
                  {...register("numberTable", {
                    required: true,
                  })}
                  label="Number Table"
                  placeholder="Enter number table"
                  variant="bordered"
                  validationState={errors.numberTable ? "invalid" : "valid"}
                  isRequired
                  errorMessage={errors.numberTable && errors.numberTable?.message}
                />
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
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
