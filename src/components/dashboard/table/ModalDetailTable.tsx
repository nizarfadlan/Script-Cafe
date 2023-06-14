import type { ResponseData } from "@/pages/api/qrcode";
import type { DefaultPropsModal } from "@/types/modal.type";
import { api } from "@/utils/api";
import { Modal, ModalHeader, ModalContent, ModalBody, Image, Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props extends DefaultPropsModal {
  table: string;
}

export default function ModalDetailTable({ isOpen, onOpenChange, table }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Detail Table
            </ModalHeader>
            <ModalBody className="mb-7">
              <DetailTable id={table} />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

const DetailTable = ({
  id
}: {
  id: string
}) => {
  const router = useRouter();
  const [qr, setQr] = useState<string | null>(null);
  const { data, status, error } = api.table.getOne.useQuery({ id });

  useEffect(() => {
    fetch(
      "/api/qrcode",
      {
        method: "POST",
        body: JSON.stringify({
          data: `${process.env.VERCEL_URL || process.env.NEXTAUTH_URL || "https://localhost:3000"}/order/${id}`
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((res: ResponseData) => {
        if (res && res.data) {
          setQr(res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  }, [id]);

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
            <div className="flex flex-col items-center justify-center">
              {qr && (
                <Image
                  src={qr}
                  alt={`QR Table ${id}`}
                  className="rounded-xl"
                  disableSkeleton={false}
                />
              )}
              <Button
                className="w-1/2 mt-5 font-semibold"
                color="secondary"
                onPress={() => router.push(`/order/${id}`)}
              >
                Order
              </Button>
            </div>
          </>
        )
      : (
        <p>Something went wrong</p>
        )
      }
    </>
  )
}
