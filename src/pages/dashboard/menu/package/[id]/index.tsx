import LayoutDashboard from "@/components/dashboard/Layout";
import { ArrowLeftIcon } from "@/components/libs/Icons";
import { appRouter } from "@/server/api/root";
import { Button, Card, CardBody, CardHeader, Chip, Spinner } from "@nextui-org/react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import superjson from "superjson";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";
import moment from "moment";
import { CardItem } from "@/components/dashboard/packagesItem/CardPackageItem";
import type { IItemsOnPackage } from "@/types/packateItem.type";
import { formatRupiah } from "@/libs/formatRupiah";

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

const DetailPackageItem = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  const { id } = props;
  const { data } = api.packageItem.getOne.useQuery({ id });

  if (!data) {
    <LayoutDashboard title="Detail item">
      <div className="flex justify-center">
        <Spinner color="secondary" />
      </div>
    </LayoutDashboard>
  }

  const calculateDiscount = (originalPrice: number, discountPrice: number): number => {
    return originalPrice - ((discountPrice/100) * originalPrice);
  }

  const statusData = (): string => {
    let status = "available";
    if (data?.deletedAt) {
      status = "delete";
    } else {
      const allAvailable = data?.items.every((item) => item.item.available);
      status = allAvailable ? "available" : "unavailable";
    }

    return status;
  }

  const items: IItemsOnPackage[] = data?.items.map((item) => {
    return {
      id: item.item.id,
      quantity: item.quantity,
    }
  }) ?? [];

  return (
    <LayoutDashboard title="Detail Package Item">
      <div className="flex flex-col gap-4">
        <Button
          variant="bordered"
          color="danger"
          className="w-max hover:bg-danger hover:text-danger-foreground hover:shadow-lg hover:shadow-danger/40"
          startIcon={<ArrowLeftIcon size={18} />}
          onPress={() => router.push("/dashboard/menu/package")}
        >
          Back
        </Button>
        <h1 className="text-2xl font-semibold">Detail package item</h1>
        <div className="relative flex flex-col w-full gap-4 lg:flex-row">
          <Card className="w-full lg:max-w-[370px] p-3 h-max relative top-0 lg:sticky lg:top-20">
            <CardHeader>
              Informasi package item
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">Name package item</p>
                  <p className="text-sm">{data?.name ?? ""}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">Price package item</p>
                  <p className="text-sm">
                    <div className="flex gap-x-2">
                      <p
                        className={`
                        ${
                          data?.discountPercent &&
                          data.discountPercent > 0
                            ? "line-through"
                            : ""
                        }
                      `}
                      >
                        Rp {formatRupiah(data?.price ?? 0)}
                      </p>
                      {
                        data?.discountPercent &&
                        data.discountPercent > 0
                        ? <span className="font-bold">{data.discountPercent}%</span>
                        : null
                      }
                    </div>
                    {data?.discountPercent ? (
                      <p className="text-danger">
                        Rp {formatRupiah(calculateDiscount(data.price, data.discountPercent))}
                      </p>
                    ): null}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">Description package item</p>
                  <p className="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">Status package item</p>
                  <div>
                    <Chip
                      size="sm"
                      className="ml-2 text-xs"
                      color={statusData() == "available" ? "success" : "danger"}
                      variant="dot"
                    >
                      {statusData()}
                    </Chip>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">Created package item</p>
                  <p className="text-sm">{moment(data?.createdAt).format("dddd, DD MMMM YYYY")}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">Last update package item</p>
                  <p className="text-sm">{moment(data?.updatedAt).fromNow()}</p>
                </div>
                {data?.deletedAt ? (
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">Deleted package item</p>
                    <p className="text-sm">{moment(data?.deletedAt).format("dddd, DD MMMM YYYY")}</p>
                  </div>
                ): null}
              </div>
            </CardBody>
          </Card>
          <Card className="w-full p-3">
            <CardHeader>
              Content inside the package item
            </CardHeader>
            <CardBody>
              <div className="grid items-center grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item, index) => (
                  <CardItem key={item.id} index={index} item={item} type="view" />
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </LayoutDashboard>
  );
}

export default DetailPackageItem;
