import LayoutDashboard from "@/components/dashboard/Layout";
import BodyItemOrder from "@/components/dashboard/transactions/order/actions/BodyItemOrder";
import { SideOrderItem } from "@/components/dashboard/transactions/order/SideOrderItem";
import { actionAddItem, actionReduceItem } from "@/components/dashboard/transactions/order/helpers/manageItem";
import { ArrowLeftIcon } from "@/components/libs/Icons";
import { toastCustom } from "@/components/libs/Toast";
import { CustomRadio } from "@/components/libs/inputs/CustomRadio";
import { formatRupiah } from "@/libs/formatRupiah";
import { type CreateOrderInput, type ItemsOrPackage, createOrderSchema } from "@/server/transaction/order/order.schema";
import type { IItemsOnOrder } from "@/types/order.type";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardFooter, Divider, RadioGroup, Spinner } from "@nextui-org/react";
import { addOrderTable } from "database.config";
import { useLiveQuery } from "dexie-react-hooks";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";

const AddOrder: NextPage = () => {
  const router = useRouter();

  const { control, register, setValue, handleSubmit, formState: { errors } } = useForm<CreateOrderInput>({
    mode: "onChange",
    resolver: zodResolver(createOrderSchema),
  });

  const items: IItemsOnOrder[] = useLiveQuery(
    async() => {
      const getData: IItemsOnOrder[] = await addOrderTable.toArray() as IItemsOnOrder[];

      setValue("items", getData);

      return getData;
    }, []
  ) as IItemsOnOrder[] ?? [];


  const { data: dataTable, isLoading: isLoadingDataTable } = api.table.getAllIdName.useQuery();

  const { data: orderSummary } = api.order.getSummary.useQuery(items as ItemsOrPackage);

  const { data: dataPayment } = api.payment.getAllIdName.useQuery();

  const { mutate, isLoading } = api.order.createOrder.useMutation({
    onSuccess: async() => {
      toastCustom({
        type: "success",
        description: "Order has been added",
      });
      await addOrderTable.clear();
      await router.push("/dashboard/transaction/order");
    },
    onError: (error) => {
      toastCustom({
        type: "error",
        description: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<CreateOrderInput> = (data) => {
    mutate(data);
  }

  const handleAddItem = useCallback(async(data: IItemsOnOrder) => await actionAddItem({ data, db: addOrderTable }), []);

  const handleReduceItem = useCallback(async(data: IItemsOnOrder) => await actionReduceItem({ data, db: addOrderTable }), []);

  if (isLoadingDataTable && !dataTable) {
    return (
      <LayoutDashboard title="Add Order">
        <div className="flex justify-center">
          <Spinner color="secondary" />
        </div>
      </LayoutDashboard>
    );
  }

  const total = orderSummary?.total ?? 0;
  const discount = orderSummary?.discount ?? 0;

  return (
    <LayoutDashboard title="Add Order">
      <div className="flex flex-col gap-4">
        <Button
          variant="bordered"
          color="danger"
          className="w-max hover:bg-danger hover:text-danger-foreground hover:shadow-lg hover:shadow-danger/40"
          startIcon={<ArrowLeftIcon size={18} />}
          onPress={() => router.push("/dashboard/transaction/order")}
        >
          Back
        </Button>
        <h1 className="text-2xl font-semibold">Add order</h1>
        <div className="relative flex flex-col w-full gap-4 lg:flex-row">
          <Card className="w-full lg:max-w-[370px] p-3 h-max relative top-0 lg:sticky lg:top-20">
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardBody className="flex flex-col w-full gap-y-4">
                <div>
                  <h1 className="mb-3 font-semibold">Customer Information</h1>
                  <div
                    className="group flex flex-col data-[has-elements=true]:gap-2 w-full"
                    data-has-elements="true"
                  >
                    <div className="relative w-full inline-flex shadow-sm px-3 border-2 border-neutral-200 data-[hover=true]:border-neutral-400 focus-within:!border-foreground rounded-lg flex-col items-start justify-center gap-0 transition-background !duration-150 transition-colors motion-reduce:transition-none h-16 py-2">
                      <label className="block font-medium text-neutral-600 text-xs after:content-['*'] after:text-danger after:ml-0.5 will-change-auto origin-top-left transition-all !duration-200 !ease-[cubic-bezier(0,0,0.2,1)] motion-reduce:transition-none">Table</label>
                      <select
                        {...register("tableId", {
                          required: true,
                        })}
                        className="mt-2 w-full h-full !bg-transparent outline-none placeholder:text-neutral-500 text-sm"
                        id="table"
                        required
                      >
                        <option value="" className="dark:text-background">Choose Table</option>
                        {dataTable?.map((table) => (
                          <option key={table.id} value={table.id} className="dark:text-background">{table.numberTable}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {errors.tableId && (
                    <div className="text-xs text-danger">{errors.tableId?.message}</div>
                  )}
                </div>
                <Divider className="my-5" />
                <div>
                  <h1 className="mb-3 font-semibold">Order Details</h1>
                  <div className="flex flex-col gap-y-2">
                    {items && items.length > 0 ? (
                      <>
                        {items.map((item) => (
                          <SideOrderItem
                            key={item.id}
                            item={item}
                            addItem={handleAddItem}
                            reduceItem={handleReduceItem}
                          />
                        ))}
                      </>
                    ): (
                      <p className="text-sm text-center text-neutral-400">No data order</p>
                    )}
                  </div>
                </div>
                <Divider className="my-5" />
                <div>
                  <h1 className="mb-3 font-semibold">Payment Methods</h1>
                  <Controller
                    {...register("paymentTypeId", {
                      required: true,
                    })}
                    control={control}
                    render={({ field: { onChange, ...props } }) => (
                      <RadioGroup
                        description="Selected payment method can be changed at any time."
                        {...register("paymentTypeId", {
                          required: true,
                        })}
                        onChange={
                          (e) =>
                            onChange((e.target as HTMLInputElement).value)
                        }
                        errorMessage={errors.paymentTypeId && errors.paymentTypeId?.message}
                        validationState={errors.paymentTypeId ? "invalid" : "valid"}
                        {...props}
                      >
                        {/* <CustomRadio description="Payment via cashier" value="cash">
                          Cash
                        </CustomRadio> */}
                        {dataPayment?.map((payment) => (
                          <CustomRadio
                            key={payment.id}
                            description={
                              payment.accountNumber.toString() == "0"
                              ? "Payment via cashier"
                              : payment.accountNumber.toString()
                            }
                            value={payment.id}
                          >
                            {payment.name}
                          </CustomRadio>
                        ))}
                      </RadioGroup>
                    )}
                  />
                </div>
                <Divider className="my-5" />
                <div>
                  <h1 className="mb-3 font-semibold">Order Summary</h1>
                  <div className="flex flex-col p-4 rounded-lg bg-default-100 dark:bg-default-200 gap-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">Total</span>
                      <span className="text-sm">Rp {formatRupiah(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">Discount</span>
                      <span className="text-sm">Rp {formatRupiah(discount)}</span>
                    </div>
                    <div className="pt-5 mb-3 border-b-2 border-dashed">
                      <div className="absolute w-5 h-5 -mt-2 rounded-full bg-background dark:bg-content1 left-3"></div>
                      <div className="absolute w-5 h-5 -mt-2 rounded-full bg-background dark:bg-content1 right-3"></div>
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <Button color="secondary" type="submit" fullWidth className="flex justify-between h-12 px-4 py-3" isLoading={isLoading} isDisabled={isLoading}>
                  <span className="font-bold">Pay</span>
                  <span className="text-xs">
                    Rp
                    <span className="ml-1 text-sm font-semibold">{formatRupiah(total-discount)}</span>
                  </span>
                </Button>
              </CardFooter>
            </form>
          </Card>
          <Card className="w-full p-3">
            <CardBody>
              <BodyItemOrder
                items={items}
                addItem={handleAddItem}
                reduceItem={handleReduceItem}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </LayoutDashboard>
  );
}

export default AddOrder;
