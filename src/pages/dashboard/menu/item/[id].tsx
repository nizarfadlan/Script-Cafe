import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "@/server/api/root";
import { getSession, useSession } from "next-auth/react";
import superjson from "superjson";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";
import LayoutDashboard from "@/components/dashboard/Layout";
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Spinner } from "@nextui-org/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type UpdateItemInput, updateItemSchema } from "@/server/menu/item/item.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toastCustom } from "@/components/libs/Toast";
import { ArrowLeftIcon, FailedIcon, SuccessIcon } from "@/components/libs/Icons";
import { Role, type MenuItem } from "@prisma/client";
import { useRouter } from "next/router";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
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
    await helpers.item.getOne.fetch({ id });
  } catch (e) {
    return {
      notFound: true,
    };
  }

  await helpers.item.getOne.prefetch({ id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
      session,
    },
  };
}

const ItemEdit = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  const { id } = props;
  const { data: session } = useSession();

  const { data, refetch, isLoading: loadingGetData } = api.item.getOne.useQuery({ id });
  const { mutate } = api.item.updateItem.useMutation({
    onSuccess: async () => {
      toastCustom({
        type: "success",
        description: "Item has been updated"
      });
      await refetch();
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        description: `Item failed to update. ${err.message}`
      });
    }
  });

  const { mutate: mutateStatus, isLoading } = api.item.updateAvailableItem.useMutation({
    onSuccess: async () => {
      toastCustom({
        type: "success",
        description: "Item has been updated status"
      });
      await refetch();
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        description: `Item failed to update status. ${err.message}`
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

  const item: MenuItem = data!;

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateItemInput>({
    mode: "onChange",
    resolver: zodResolver(updateItemSchema),
  });

  const onSubmit: SubmitHandler<UpdateItemInput> = (dataInput): void => {
    if (session?.user.role === Role.Manajer || session?.user.role === Role.Owner) {
      mutate(dataInput);
    } else {
      toastCustom({
        type: "error",
        description: "You don't have permission to update item"
      });
    }
  }

  const onStatusItem = (): void => {
    mutateStatus({
      params: {
        id: item.id
      },
      body: {
        available: item.deletedAt ? item.available : !item.available,
        deletedAt: !!item.deletedAt
      },
    });
  }

  return (
    <>
      <LayoutDashboard title="Edit item">
        <div className="flex flex-col gap-4">
          <Button
            variant="bordered"
            color="danger"
            className="mb-2 w-max hover:bg-danger hover:text-danger-foreground hover:shadow-lg hover:shadow-danger/40"
            startIcon={<ArrowLeftIcon size={18} />}
            onPress={() => router.push("/dashboard/menu/item")}
          >
            Back
          </Button>
          <h1 className="text-2xl font-semibold">Edit item</h1>
          <div className="flex flex-col w-full gap-4 md:flex-row">
            {!item?.deletedAt ?
              (
                <>
                  <section className="w-full">
                    <Card className="w-full p-3">
                      <CardHeader className="text-lg">
                        Informasi item
                      </CardHeader>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <input hidden value={id} {...register("params.id")} />
                        <CardBody className="flex flex-col w-full gap-4">
                          <Input
                            {...register("body.name", {
                              required: true,
                            })}
                            defaultValue={item.name}
                            label="Name"
                            placeholder="Enter name of item"
                            variant="bordered"
                            validationState={errors.body?.name ? "invalid" : "valid"}
                            id="name"
                            isRequired
                            errorMessage={errors.body?.name && errors.body?.name?.message}
                          />
                          <Input
                            {...register("body.price", {
                              required: true,
                              valueAsNumber: true,
                            })}
                            defaultValue={item.price.toString()}
                            label="Price"
                            placeholder="Enter price of item"
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
                            defaultValue={item?.discountPercent?.toString() ?? ""}
                            label="Discount"
                            placeholder="Enter discount of item"
                            variant="bordered"
                            validationState={errors.body?.discountPercent ? "invalid" : "valid"}
                            id="price"
                            isRequired
                            errorMessage={errors.body?.discountPercent && errors.body?.discountPercent?.message}
                          />
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
              ) : null
            }
            <section className={item?.deletedAt ? "w-full" : "w-full lg:max-w-[280px]"}>
              <Card
                className="p-3 border-none h-max"
              >
                <CardHeader className="text-lg">
                  <h1>Status</h1>
                </CardHeader>
                <CardBody className={`flex flex-col items-center justify-center ${item.available && !item?.deletedAt ? "text-green-400 fill-green-400" : "text-rose-400 fill-rose-400"}`}>
                  {item.available && !item?.deletedAt ? (
                    <SuccessIcon fill="inherit" size={80} />
                    )
                  : (
                    <FailedIcon fill="inherit" size={80} />
                  )}
                  <h1 className="mt-1 font-medium text-md">
                    Item {item?.deletedAt ? "Deleted" : (item.available ? "Available" : "Unavailable")}
                  </h1>
                </CardBody>
                <CardFooter>
                  <Button
                    color={item.available && !item?.deletedAt ? "danger" : "success"}
                    fullWidth
                    onPress={onStatusItem}
                  >
                    {item?.deletedAt ? "Recovery" : (item.available ? "Unavailable" : "Available")}
                  </Button>
                </CardFooter>
              </Card>
            </section>
          </div>
        </div>
      </LayoutDashboard>
    </>
  )
}

export default ItemEdit;
