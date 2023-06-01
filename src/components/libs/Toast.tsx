import { toast } from "react-hot-toast";
import { SuccessIcon, CloseIcon, FailedIcon } from "./Icons";
import { Spinner } from "@nextui-org/react";

interface ToastProps {
  type?: "success" | "error";
  title?: string;
  description?: string;
}

export const toastCustom = ({
  type,
  title,
  description,
}: ToastProps) => toast.custom(
  (t) => (
    <div
      className={`flex flex-row items-center w-96 px-4 py-6 text-foreground shadow-xl hover:shadow-none transform-gpu translate-y-0 hover:translate-y-1 rounded-xl before:content-[''] before:block before:z-[-1] before:absolute before:inset-0 before:backdrop-blur before:backdrop-saturate-150 before:bg-background/50 before:rounded-xl relative transition-all duration-500 ease-in-out ${t.visible ? "top-0" : "-top-96"}`}
    >
      <div className={type === "success" ? "text-success" : "text-danger"}>
        {type === "success" ? (
          <SuccessIcon size={30} />
        )
        : (
          <FailedIcon size={30} />
        )}
      </div>
      <div className="flex flex-col items-start justify-center ml-4 cursor-default">
        <h1 className="text-base font-semibold leading-none tracking-wider">{title ? title : (type === "success" ? "Success" : "Error")}</h1>
        {description && (
          <p className="mt-2 text-sm leading-relaxed tracking-wider text-gray-400">
            {description}
          </p>
        )}
      </div>
      <div className="absolute text-lg cursor-pointer top-2 right-2" onClick={() => toast.dismiss(t.id)}>
        <CloseIcon />
      </div>
    </div>
  ),
  { id: "unique-notification", position: "top-center" }
);

export const toastCustomLoading = ({
  title,
  description,
}: ToastProps) => toast.custom(
  (t) => (
    <div
      className={`flex flex-row items-center w-96 px-4 py-6 text-foreground shadow-xl hover:shadow-none transform-gpu translate-y-0 hover:translate-y-1 rounded-xl before:content-[''] before:block before:z-[-1] before:absolute before:inset-0 before:backdrop-blur before:backdrop-saturate-150 before:bg-background/50 before:rounded-xl relative transition-all duration-500 ease-in-out ${t.visible ? "top-0" : "-top-96"}`}
    >
      <div>
        <Spinner />
      </div>
      <div className="flex flex-col items-start justify-center ml-4 cursor-default">
        <h1 className="text-base font-semibold leading-none tracking-wider">{title ? title : "Loading"}</h1>
        {description && (
          <p className="mt-2 text-sm leading-relaxed tracking-wider text-gray-400">
            {description}
          </p>
        )}
      </div>
      <div className="absolute text-lg cursor-pointer top-2 right-2" onClick={() => toast.dismiss(t.id)}>
        <CloseIcon />
      </div>
    </div>
  ),
  { id: "loading-toast", position: "top-center" }
);
