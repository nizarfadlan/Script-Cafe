import { toastCustom } from "@/components/libs/Toast";
import Toggle from "@/components/libs/inputs/Toggle";
import { type UpdatePaymentInput, updatePaymentSchema } from "@/server/transaction/payment/payment.schema";
import type { DefaultPropsModal } from "@/types/modal.type";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
import { useEffect } from "react";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";

interface Props extends DefaultPropsModal {
  onSuccess: () => Promise<void>;
  payment: string;
}

const ModalEditPayment = ({
  isOpen,
  onOpenChange,
  onSuccess,
  payment,
}: Props) => {
  const { data, isLoading: loadingData, refetch, isSuccess } = api.payment.getOne.useQuery({ id: payment });

  const { mutate, isLoading } = api.payment.updatePayment.useMutation({
    onSuccess: async() => {
      await onSuccess();
      onOpenChange!();
      toastCustom({
        type: "success",
        description: "Payment has been updated",
      });
      await refetch();
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        description: `Payment failed updated. ${err.message ?? ""}`,
      });
    },
  });

  const { control, register, reset, setValue, handleSubmit, formState: { errors } } = useForm<UpdatePaymentInput>({
    mode: "onChange",
    defaultValues: {
      params: {
        id: payment ?? data?.id,
      },
    },
    resolver: zodResolver(updatePaymentSchema),
  });

  useEffect(() => {
    reset();
    setValue("params.id", payment);
  }, [payment, reset, setValue]);

  const onSubmit: SubmitHandler<UpdatePaymentInput> = (dataInput): void => {
    mutate(dataInput);
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      aria-labelledby="modal-edit-payment"
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              Add Payment
            </ModalHeader>
            <ModalBody>
              {data && !loadingData && isSuccess ? (
                <>
                  <input
                    hidden
                    {...register("params.id")}
                  />
                  <Input
                    {...register("body.name")}
                    defaultValue={data.name}
                    label="Name"
                    placeholder="Enter name payment"
                    variant="bordered"
                    validationState={errors.body?.name ? "invalid" : "valid"}
                    isRequired
                    errorMessage={errors.body?.name && errors.body?.name?.message}
                  />
                  <Input
                    {...register("body.accountNumber", {
                      valueAsNumber: true,
                    })}
                    defaultValue={data.accountNumber.toString()}
                    label="Account Number"
                    placeholder="Enter account number"
                    variant="bordered"
                    validationState={errors.body?.accountNumber ? "invalid" : "valid"}
                    isRequired
                    errorMessage={errors.body?.accountNumber && errors.body?.accountNumber?.message}
                  />
                  <Controller
                    {...register("body.active")}
                    control={control}
                    render={({ field: { ...field } }) => (
                      <Toggle
                        value={
                          data.active ??
                          field.value ??
                          false
                        }
                        title={`Payment ${field.value ? "Active" : "Inactive"} `}
                        onChange={field.onChange}
                        description="Make the payment active or inactive"
                      />
                    )}
                  />
                  {errors.body?.active && (
                    <div className="text-xs text-danger">{errors.body.active?.message}</div>
                  )}
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
  );
};

export default ModalEditPayment;
