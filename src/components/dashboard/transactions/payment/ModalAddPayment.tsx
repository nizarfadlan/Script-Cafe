import { toastCustom } from "@/components/libs/Toast";
import Toggle from "@/components/libs/inputs/Toggle";
import { type CreatePaymentInput, createPaymentSchema } from "@/server/transaction/payment/payment.schema";
import type { DefaultPropsModal } from "@/types/modal.type";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";

interface Props extends DefaultPropsModal {
  onSuccess: () => Promise<void>;
}

const ModalAddPayment = ({
  isOpen,
  onOpenChange,
  onSuccess,
}: Props) => {
  const { mutate, isLoading } = api.payment.createPayment.useMutation({
    onSuccess: async() => {
      await onSuccess();
      onOpenChange!();
      toastCustom({
        type: "success",
        description: "Payment has been added",
      });
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        description: `Payment has been added. ${err.message ?? ""}`,
      });
    },
  });

  const { control, register, handleSubmit, formState: { errors, defaultValues } } = useForm<CreatePaymentInput>({
    mode: "onChange",
    defaultValues: {
      active: true,
    },
    resolver: zodResolver(createPaymentSchema),
  });

  const onSubmit: SubmitHandler<CreatePaymentInput> = (dataInput): void => {
    mutate(dataInput);
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      aria-labelledby="modal-add-payment"
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              Add Payment
            </ModalHeader>
            <ModalBody>
              <Input
                {...register("name")}
                label="Name"
                placeholder="Enter name payment"
                variant="bordered"
                validationState={errors.name ? "invalid" : "valid"}
                isRequired
                errorMessage={errors.name && errors.name?.message}
              />
              <Input
                {...register("accountNumber", {
                  valueAsNumber: true,
                })}
                label="Account Number"
                placeholder="Enter account number"
                variant="bordered"
                validationState={errors.accountNumber ? "invalid" : "valid"}
                isRequired
                errorMessage={errors.accountNumber && errors.accountNumber?.message}
              />
              <Controller
                {...register("active")}
                control={control}
                render={({ field: { ...field } }) => (
                  <Toggle
                    value={
                      field.value ??
                      defaultValues?.active ??
                      false
                    }
                    title={`Payment ${field.value ? "Active" : "Inactive"} `}
                    onChange={field.onChange}
                    description="Make the payment active or inactive"
                  />
                )}
              />
              {errors.active && (
                <div className="text-xs text-danger">{errors.active?.message}</div>
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
  );
};

export default ModalAddPayment;
