import { Modal, Button, Input, ModalHeader, ModalContent, ModalBody, ModalFooter } from "@nextui-org/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from "@/utils/api";
import type { DefaultPropsModal } from "@/types/modal.type";
import type { IItemsOnPackage } from "@/types/packateItem.type";

interface Props extends DefaultPropsModal {
  onSave: ({ id, quantity }: IItemsOnPackage) => Promise<void>;
}

export default function ModalAddItemOnPackage({ isOpen, onOpenChange, onSave }: Props) {
  const { data } = api.item.getAllIdName.useQuery();

  const items = data ?? [];

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<IItemsOnPackage>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IItemsOnPackage> = async (dataInput): Promise<void> => {
    await onSave(dataInput);
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      aria-labelledby="modal-add-item-on-package"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                Add item
              </ModalHeader>
              <ModalBody>
                <div
                  className="group flex flex-col data-[has-elements=true]:gap-2 w-full"
                  data-has-elements="true"
                >
                  <div className="relative w-full inline-flex shadow-sm px-3 border-2 border-neutral-200 data-[hover=true]:border-neutral-400 focus-within:!border-foreground rounded-lg flex-col items-start justify-center gap-0 transition-background !duration-150 transition-colors motion-reduce:transition-none h-16 py-2">
                    <label className="block font-medium text-neutral-600 text-xs after:content-['*'] after:text-danger after:ml-0.5 will-change-auto origin-top-left transition-all !duration-200 !ease-[cubic-bezier(0,0,0.2,1)] motion-reduce:transition-none">Item</label>
                    <select
                      {...register("id")}
                      className="mt-2 w-full h-full !bg-transparent outline-none placeholder:text-neutral-500 text-sm"
                      id="role"
                    >
                      <option value="" className="dark:text-background">Choose Item</option>
                      {items.map((item) => (
                        <option key={item.id} value={item.id} className="dark:text-background">{item.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {errors.id && (
                  <div className="text-xs text-danger">{errors.id?.message}</div>
                )}
                <Input
                  type="number"
                  {...register("quantity", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  label="Quantity"
                  placeholder="Enter quantity item"
                  variant="bordered"
                  validationState={errors.quantity ? "invalid" : "valid"}
                  id="quantity"
                  isRequired
                  errorMessage={errors.quantity && errors.quantity?.message}
                />
              </ModalBody>
              <ModalFooter>
                <Button type="button" variant="flat" color="danger" onPress={onClose} disabled={isSubmitting}>
                  Close
                </Button>
                <Button color="secondary" type="submit" isDisabled={isSubmitting} isLoading={isSubmitting}>
                  Add
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
