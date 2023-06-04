import { appRouter } from "@/server/api/root";
import { createServerSideHelpers } from "@trpc/react-query/server";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import superjson from "superjson";
import { prisma } from "@/server/db";
import { getSession } from "next-auth/react";
import LayoutDashboard from "@/components/dashboard/Layout";
import { api } from "@/utils/api";
import { toastCustom } from "@/components/libs/Toast";
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Spinner, useDisclosure } from "@nextui-org/react";
import type { Package } from "@prisma/client";
import { type UpdatePackageInput, updatePackageSchema } from "@/server/menu/packageItem/packageItem.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { ArrowLeftIcon, FailedIcon, PlusIcon } from "@/components/libs/Icons";
import { useRouter } from "next/router";
import ModalAddItemOnPackage from "@/components/dashboard/packagesItem/ModalAddItemOnPackage";
import { useCallback } from "react";
import type { IItemsOnPackage } from "@/types/packateItem.type";
import { editItemsOnPackageTable } from "database.config";
import { useLiveQuery } from "dexie-react-hooks";
import { CardItem } from "@/components/dashboard/packagesItem/CardPackageItem";
import type { IndexableType } from "dexie";

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getSession({ req: ctx.req });
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session,
      prisma,
    },
    transformer: superjson
  });

  const id = ctx.params?.id as string || "";

  try {
    await helpers.packageItem.getOne.fetch({ id });
  } catch (e) {
    return {
      notFound: true,
    };
  }

  await helpers.packageItem.getOne.prefetch({ id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
}

const PackageItemEdit = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  const { id } = props;
  const { data, refetch, isLoading: loadingGetData } = api.packageItem.getOne.useQuery({ id }, {
    async onSuccess(data) {
      await editItemsOnPackageTable.clear();

      if (data?.items && data.items.length > 0) {
        data.items.map(async(item) => {
          await editItemsOnPackageTable.add({
            id: item.itemId,
            quantity: item.quantity,
          });
        });
      }
    },
  });

  const items: IItemsOnPackage[] = useLiveQuery(
    () => editItemsOnPackageTable.toArray(),
    []
  ) as IItemsOnPackage[] ?? [];

  const { mutate, isLoading } = api.packageItem.updatePackage.useMutation({
    onSuccess: async () => {
      toastCustom({
        type: "success",
        description: "Package item has been updated"
      });
      await refetch();
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        description: `Package item failed to update. ${err.message}`
      });
    }
  });

  const { mutate: mutateRestore, isLoading: loadingRestore } = api.packageItem.restorePackage.useMutation({
    onSuccess: async () => {
      toastCustom({
        type: "success",
        description: "Package item has been recovered"
      });
      await refetch();
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        description: `Package item failed to be recovery. ${err.message}`
      });
    }
  });

  if (!data || loadingGetData) {
    <LayoutDashboard title="Edit item">
      <div className="flex justify-center">
        <Spinner color="secondary" />
      </div>
    </LayoutDashboard>
  }

  const packageItem: Package = data!;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<UpdatePackageInput>({
    mode: "onChange",
    resolver: zodResolver(updatePackageSchema),
  });

  const onSubmit: SubmitHandler<UpdatePackageInput> = (dataInput): void => {
    mutate(dataInput);
  }

  const onRestore = (): void => {
    mutateRestore({ id: packageItem.id });
  }

  const { isOpen: openModalAdd, onOpen: onOpenModalAdd, onOpenChange: onOpenChangeModalAdd } = useDisclosure();

  const handleSavePackageItem = useCallback(async({
    id,
    quantity
  }: IItemsOnPackage) => {
    const data = await editItemsOnPackageTable.where("id").equals(id).limit(1).toArray();

    let save: number | string | IndexableType;
    if (data.length > 0) {
      const itemDataOld: IItemsOnPackage = data[0] as IItemsOnPackage;
      save = await editItemsOnPackageTable.update(id, { quantity: itemDataOld.quantity + Number(quantity) });
    } else {
      save = await editItemsOnPackageTable.add({
        id,
        quantity: Number(quantity),
      });
    }

    if (save) {
      toastCustom({
        type: "success",
        description: "Successfully save the item"
      });
    } else {
      toastCustom({
        type: "error",
        description: "Failed to save item"
      })
    }
  }, []);

  if (items.length > 0) setValue("body.items", items);

  return (
    <>
      <LayoutDashboard title="Edit Package Item">
        <div className="flex flex-col gap-4">
          <Button
            variant="bordered"
            color="danger"
            className="mb-2 w-max hover:bg-danger hover:text-danger-foreground hover:shadow-lg hover:shadow-danger/40"
            startIcon={<ArrowLeftIcon size={18} />}
            onPress={() => router.replace("/dashboard/menu/package")}
          >
            Back
          </Button>
          <h1 className="text-2xl font-semibold">Edit Package Item</h1>
          <div className="flex flex-col w-full gap-4 md:flex-row">
            {!packageItem.deletedAt ?
              (
                <>
                  <section className="w-full">
                    <Card className="w-full p-3">
                      <CardHeader className="text-lg">
                        Informasi package item
                      </CardHeader>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <input hidden value={id} {...register("params.id")} />
                        <CardBody className="flex flex-col w-full gap-4">
                          <Input
                            {...register("body.name", {
                              required: true,
                            })}
                            defaultValue={packageItem.name}
                            label="Name"
                            placeholder="Enter name package item"
                            variant="bordered"
                            validationState={errors.body?.name ? "invalid" : "valid"}
                            id="name"
                            isRequired
                            errorMessage={errors.body?.name && errors.body?.name?.message}
                          />
                          <div className="flex flex-col gap-4 md:flex-row">
                            <Input
                              {...register("body.price", {
                                required: true,
                                valueAsNumber: true,
                              })}
                              defaultValue={packageItem.price.toString()}
                              label="Price"
                              placeholder="Enter price package item"
                              variant="bordered"
                              validationState={errors.body?.price ? "invalid" : "valid"}
                              id="price"
                              isRequired
                              errorMessage={errors.body?.price && errors.body?.price?.message}
                            />
                            <Input
                              {...register("body.discountPercent", {
                                setValueAs: (v: string) => v === "" ? undefined : parseInt(v, 10),
                              })}
                              defaultValue={packageItem?.discountPercent?.toString() ?? ""}
                              label="Discount Percent"
                              placeholder="Enter discount package item"
                              variant="bordered"
                              validationState={errors.body?.discountPercent ? "invalid" : "valid"}
                              id="discount"
                              errorMessage={errors.body?.discountPercent && errors.body?.discountPercent?.message}
                            />
                          </div>
                          <div className="grid items-center grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            <div className="col-span-1">
                              <div
                                aria-label="modal-add-item-on-package"
                                onClick={onOpenModalAdd}
                                className="w-full flex justify-center h-[320px] px-4 transition border-2 border-neutral-200 hover:border-neutral-400 focus-within:!border-foreground border-dashed rounded-md appearance-none cursor-pointer focus:outline-none">
                                <span className="flex items-center space-x-2">
                                  <PlusIcon fill="currentColor" size={18} className="w-6 h-6 text-gray-600" />
                                  <span className="text-sm font-medium text-gray-600">
                                    Click to add an item
                                  </span>
                                </span>
                              </div>
                            </div>
                            {items.map((item, index) => (
                              <CardItem key={item.id} index={index} item={item} db={editItemsOnPackageTable} />
                            ))}
                          </div>
                        </CardBody>
                        <CardFooter className="flex justify-end">
                          <Button
                            color="secondary"
                            type="submit"
                            isDisabled={isLoading}
                            isLoading={isLoading}
                          >
                            Submit
                          </Button>
                        </CardFooter>
                      </form>
                    </Card>
                  </section>
                </>
              ) : (
                <section className="w-full">
                  <Card
                    className="p-3 border-none h-max"
                  >
                    <CardHeader className="text-lg">
                      <h1>Status Package</h1>
                    </CardHeader>
                    <CardBody className="flex flex-col items-center justify-center text-rose-400 fill-rose-400">
                      <FailedIcon fill="inherit" size={80} />
                      <h1 className="mt-1 font-medium text-md">
                        Package Item Deleted
                      </h1>
                    </CardBody>
                    <CardFooter>
                      <Button
                        color="success"
                        fullWidth
                        onPress={onRestore}
                        isDisabled={loadingRestore}
                        isLoading={loadingRestore}
                      >
                        Recovery
                      </Button>
                    </CardFooter>
                  </Card>
                </section>
              )
            }
          </div>
        </div>
        <ModalAddItemOnPackage
          isOpen={openModalAdd}
          onOpenChange={onOpenChangeModalAdd}
          onSave={handleSavePackageItem}
        />
      </LayoutDashboard>
    </>
  )
}

export default PackageItemEdit;
