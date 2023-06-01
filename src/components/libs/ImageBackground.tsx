import { Image } from "@nextui-org/react";

export default function ImageBackground() {
  return (
    <>
      <Image
        src="/gradient-left-dark.svg"
        alt="gradient-bg-left"
        className="fixed -bottom-[50%] -left-[10%] -right-[50%] -z-10"
      />
      <Image
        src="/gradient-right-dark.svg"
        alt="gradient-bg-right"
        className="fixed -top-[35%] -right-[45%] -z-10"
      />
    </>
  );
}
