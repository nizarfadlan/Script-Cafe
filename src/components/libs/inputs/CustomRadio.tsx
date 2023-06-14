import { Radio, cn, type RadioProps } from "@nextui-org/react";

export const CustomRadio = (props: RadioProps) => {
  const {children, ...otherProps} = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "group inline-flex items-center justify-between hover:bg-content2 flex-row-reverse",
          "max-w-[300px] cursor-pointer border-2 border-default rounded-lg gap-4 p-4",
          "data-[selected=true]:border-primary"
        ),
      }}
    >
      {children}
    </Radio>
  );
};
