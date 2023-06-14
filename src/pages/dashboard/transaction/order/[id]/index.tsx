import { appRouter } from "@/server/api/root";
import { createServerSideHelpers } from "@trpc/react-query/server";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import superjson from "superjson";
import { prisma } from "@/server/db";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import LayoutDashboard from "@/components/dashboard/Layout";
import { Button, Card, CardBody, CardHeader, Chip, Spinner } from "@nextui-org/react";
import { ArrowLeftIcon } from "@/components/libs/Icons";
import { formatRupiah } from "@/libs/formatRupiah";
import moment from "moment";
import BodyDetailOrderItem from "@/components/dashboard/transactions/order/view/DetailOrder";

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
    await helpers.order.getOne.fetch({ id });
  } catch (e) {
    return {
      notFound: true,
    };
  }

  await helpers.order.getOne.prefetch({ id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
}

const DetailOrder = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  const { id } = props;
  const { data, isError, isLoading } = api.order.getOneAll.useQuery({ id });

  if (!data && isLoading) {
    <LayoutDashboard title="Detail order">
      <div className="flex justify-center">
        <Spinner color="secondary" />
      </div>
    </LayoutDashboard>
  }

  if (isError) {
    <LayoutDashboard title="Detail order">
      <div className="flex justify-center">
        <p>Failed to load data</p>
      </div>
    </LayoutDashboard>
  }

  return (
    <LayoutDashboard title="Detail order">
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
        <h1 className="text-2xl font-semibold">
          Detail order item
          <p className="text-sm text-neutral-400">
            Table {data?.table?.numberTable} #{id}
          </p>
        </h1>
        <div className="relative flex flex-col w-full gap-4 lg:flex-row">
          <Card className="w-full lg:max-w-[370px] p-3 h-max relative top-0 lg:sticky lg:top-20">
            <CardHeader>
              Order Information
            </CardHeader>
            <CardBody className="flex flex-col w-full gap-y-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">Number Table</p>
                <p className="text-sm">{data?.table?.numberTable ?? ""}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">Total Price Order</p>
                <p className="text-sm">Rp {formatRupiah(data?.total ?? 0)}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">Status package item</p>
                <Chip
                  size="sm"
                  className="ml-2 text-xs"
                  color={
                    data?.finished && data?.paid
                    ? "success"
                    : (
                      !data?.finished && data?.paid
                      ? "warning"
                      : "danger"
                      )
                  }
                  variant="dot"
                >
                  {
                    data?.finished && data?.paid
                    ? "Paid and finished"
                    : (
                      !data?.finished && data?.paid
                      ? "Paid and processing"
                      : "Unpaid"
                      )
                  }
                </Chip>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">Payment type</p>
                <div className="text-sm">
                  {data?.paymentType?.name ?? ""}
                  <p className="text-neutral-500">({data?.paymentType.accountNumber.toString()})</p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">Created package item</p>
                <p className="text-sm">{moment(data?.createdAt).format("dddd, DD MMMM YYYY | h:mm:ss A")}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">Last update package item</p>
                <p className="text-sm">{moment(data?.updatedAt).fromNow()}</p>
              </div>
            </CardBody>
          </Card>
          <Card className="w-full p-3">
            <CardBody>
              <BodyDetailOrderItem
                items={data?.items}
                packages={data?.packages}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </LayoutDashboard>
  )
}

export default DetailOrder;
