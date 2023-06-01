import { CalenderIcon, CheckIcon, CloseIcon, PackageIcon, PriceTagIcon } from "@/components/libs/Icons";
import { DefaultPropsModal } from "@/types/modal.type";
import { api } from "@/utils/api";
import { Avatar, Badge, Chip, Divider, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import moment from "moment";

interface Props extends DefaultPropsModal {
  packageItem: string;
}

export default function ModalDetailPackageItem({ isOpen, onOpenChange, packageItem }: Props) {
  return (
    <Modal
      aria-labelledby="modal-add-package-item"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Detail Package Item
            </ModalHeader>
            <ModalBody className="mb-7">
              <DetailPackage id={packageItem} />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

const DetailPackage = ({
  id
}: {
  id: string
}) => {
  const { data, status, error } = api.packageItem.getOne.useQuery({ id });

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

  return (
    <>
      {status === "loading" ?
        (
          <p>Loading...</p>
        )
      : status === "error" ?
        (
          <p>{error.message}</p>
        )
      : status === "success" && data ?
        (
          <>
            <section className="flex mx-2 mt-4 gap-x-2">
              <div className="flex-none">
                <Badge
                  classNames={{
                    badge: "p-0.5 right-[50%]"
                  }}
                  content={statusData() == "delete" ? <CloseIcon size={20} /> : <CheckIcon size={20} />}
                  color={statusData() == "available" ? "success" : "danger"}
                  placement="bottom-right"
                  radius="full"
                  shape="rectangle"
                  size="md"
                  variant="shadow"
                >
                  <Avatar
                    src="/item.jpeg"
                    size="lg"
                    classNames={{
                      base: "w-16 h-16 text-base"
                    }}
                    color="secondary"
                    name={data.name ?? ""}
                  />
                </Badge>
              </div>
              <div className="flex flex-col gap-2 ml-3">
                <div className="my-auto profile">
                  <h1 className="flex items-center text-2xl font-bold capitalize">
                    {data.name}
                    <Chip
                      size="sm"
                      className="ml-2 text-xs"
                      color={statusData() == "available" ? "success" : "danger"}
                      variant="dot"
                    >
                      {statusData()}
                    </Chip>
                  </h1>
                  <p className="-mt-1 text-sm font-medium text-neutral-500">Category</p>
                  <p className="text-sm text-neutral-400">Last update {moment(data.updatedAt).fromNow()}</p>
                </div>
                <div className="flex flex-col mt-2 gap-y-1">
                  <div className="flex gap-x-2">
                    <PriceTagIcon size={24} />
                    <div className="flex flex-col gap-x-2">
                      <div className="flex gap-x-2">
                        <p
                          className={`
                          ${
                            data.discountPercent &&
                            data.discountPercent > 0
                              ? "line-through"
                              : ""
                          }
                        `}
                        >
                          Rp.{data.price}
                        </p>
                        {
                          data.discountPercent &&
                          data.discountPercent > 0
                          ? <span className="font-bold">{data.discountPercent}%</span>
                          : null
                        }
                      </div>
                      {data.discountPercent ? (
                        <p className="text-danger">
                          Rp.{calculateDiscount(data.price, data.discountPercent)}
                        </p>
                      ): null}
                    </div>
                  </div>
                  <Divider className="my-2" />
                  <div className="text-sm">
                    <div className="flex items-center mb-2 gap-x-2">
                      <PackageIcon fill="currentColor" size={24} />
                      <h6 className="font-semibold">Content inside the package items</h6>
                    </div>
                    <div className="ml-3">
                      {/* Isi items */}
                    </div>
                  </div>
                  <Divider className="my-2" />
                  <div className="text-sm">
                    <div className="flex items-center mb-2 gap-x-2">
                      <CalenderIcon size={24} />
                      <h6 className="font-semibold">Info Package Item</h6>
                    </div>
                    <div className="ml-3">
                      <p>
                        Created {moment(data.createdAt).format("dddd, DD MMMM YYYY")}
                      </p>
                      {data.deletedAt && (
                        <p>
                          Deleted {moment(data.deletedAt).format("dddd, DD MMMM YYYY")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )
      : (
          <p>Something went wrong</p>
        )
      }
    </>
  )
}
