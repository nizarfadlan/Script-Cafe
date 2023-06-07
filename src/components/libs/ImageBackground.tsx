import { Image } from "@nextui-org/react";

export default function ImageBackground() {
  return (
    <>
      <Image
        src="/gradient-left-dark.svg"
        alt="gradient-bg-left"
        className="fixed -bottom-[10%] -left-[10%] -right-[50%] md:-left-[20%] md:-bottom-[20%] lg:-bottom-[35%] -z-10"
      />
      <Image
        src="/gradient-right-dark.svg"
        alt="gradient-bg-right"
        className="fixed -top-[10%] -right-[10%] md:-right-[45%] lg:-top-[35%] -z-10"
      />
    </>
  );
}
