import { Modal, Button, Input, ModalHeader, ModalContent, ModalBody, ModalFooter } from "@nextui-org/react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import Toggle from "@/components/libs/inputs/Toggle";
import { api } from "@/utils/api";
import { toastCustom } from "@/components/libs/Toast";
import { zodResolver } from '@hookform/resolvers/zod';
import { type CreateItemInput, createItemSchema } from "@/server/menu/item/item.schema";
import type { DefaultPropsModal } from "@/types/modal.type";

interface Props extends DefaultPropsModal {
  onSuccess: () => Promise<void>;
}

export default function ModalAddItem({ isOpen, onOpenChange, onSuccess }: Props) {
  const { mutate } = api.item.createItem.useMutation({
    onSuccess: async() => {
      await onSuccess();
      onOpenChange();
      toastCustom({
        type: "success",
        description: "Item has been added",
      });
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        description: `Item failed to add. ${err.message ?? ""}`,
      });
    }
  });

  const { control, register, handleSubmit, formState: { errors, isSubmitting, defaultValues } } = useForm<CreateItemInput>({
    mode: "onChange",
    defaultValues: {
      available: true,
    },
    resolver: zodResolver(createItemSchema)
  });

  const onSubmit: SubmitHandler<CreateItemInput> = (dataInput): void => {
    mutate(dataInput);
  }

  return (
    <Modal
      aria-labelledby="modal-title"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                Add item
              </ModalHeader>
              <ModalBody>
                <Input
                  {...register("name", {
                    required: true,
                  })}
                  label="Name"
                  placeholder="Enter name item"
                  variant="bordered"
                  status={errors.name ? "error" : "default"}
                  id="name"
                  isRequired
                  errorMessage={errors.name && errors.name?.message}
                />
                <Input
                  type="number"
                  {...register("price", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  label="Price"
                  placeholder="Enter price item"
                  variant="bordered"
                  status={errors.price ? "error" : "default"}
                  id="price"
                  isRequired
                  errorMessage={errors.price && errors.price?.message}
                />
                <Input
                  type="number"
                  {...register("discountPercent", {
                    setValueAs: (v: string) => v === "" ? undefined : parseInt(v, 10),
                  })}
                  label="Discount Percent"
                  placeholder="Enter discount item"
                  variant="bordered"
                  status={errors.discountPercent ? "error" : "default"}
                  id="discount"
                  errorMessage={errors.discountPercent && errors.discountPercent?.message}
                />
                <Controller
                  name="available"
                  control={control}
                  render={({ field: { ...field } }) => (
                    <Toggle
                      value={
                        field.value ??
                        defaultValues?.available ??
                        false
                      }
                      onChange={field.onChange}
                      title={`Menu ${field.value ? "Available" : "Not Available"} `}
                      description="Make items available to customers"
                    />
                  )}
                />
                {errors.available && (
                  <div className="text-xs text-danger">{errors.available?.message}</div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button type="button" variant="flat" color="danger" onPress={onClose} disabled={isSubmitting}>
                  Close
                </Button>
                <Button color="secondary" type="submit" isDisabled={isSubmitting} isLoading={isSubmitting}>
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
