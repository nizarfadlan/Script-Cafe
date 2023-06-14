import { Switch } from "@nextui-org/react";

export default function Toggle({
  title,
  description,
  value,
  onChange,
}: {
  title: string,
  description?: string,
  value: boolean,
  onChange: () => void
}) {
  return (
    <>
      <Switch
        className="inline-flex flex-row-reverse w-full max-w-md items-center justify-between cursor-pointer rounded-lg gap-0 p-4 border-2 border-default-200 data-[hover=true]:border-default-400 focus-within:!border-foreground"
        size="sm"
        color="secondary"
        onValueChange={onChange}
        defaultSelected={value}
      >
        <div className="flex flex-col gap">
          <p className="text-base">{title}</p>
          {description &&
            <p className="text-xs text-foreground">
              {description}
            </p>
          }
        </div>
      </Switch>
    </>
  );
}
