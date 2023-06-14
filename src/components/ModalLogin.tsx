import Config from "@/config/appConfig";
import { Modal, Button, Input, Checkbox, ModalHeader, ModalContent, ModalBody, ModalFooter } from "@nextui-org/react";
import { signIn, type SignInResponse } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { MailFilledIcon, LockFilledIcon } from "@nextui-org/shared-icons";
import { useCallback, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "./libs/Icons";
import type { InputsLogin } from "@/types/auth.type";
import type { DefaultPropsModal } from "@/types/modal.type";

export default function ModalLogin({ isOpen, onOpenChange, onClose }: DefaultPropsModal) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(!isPasswordVisible);
  }, [isPasswordVisible]);

  const router = useRouter();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<InputsLogin>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<InputsLogin> = async(data): Promise<void> => {
    const { email, password } = data;
    const result: SignInResponse | undefined = await signIn<"credentials">("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error || !result) {
      setError("root", {
        type: "manual",
        message: result?.error || "Something went wrong",
      })
    } else if (result.ok) {
      await router.replace("/dashboard");
    }
  }


  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      aria-labelledby="modal-login"
      isDismissable
    >
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="flex flex-col gap-1">
            Welcome to {Config.APP_NAME}
          </ModalHeader>
          <ModalBody>
            <Input
              {...register("email")}
              startContent={
                <MailFilledIcon className="flex-shrink-0 text-2xl pointer-events-none text-neutral-400" />
              }
              label="Email"
              placeholder="Enter your email"
              variant="bordered"
              type="email"
              validationState={errors.email ? "invalid" : "valid"}
              errorMessage={errors.email && errors.email.message}
              isRequired
            />
            <Input
              {...register("password")}
              startContent={
                <LockFilledIcon className="flex-shrink-0 text-2xl pointer-events-none text-neutral-400" />
              }
              endContent={
                <button className="focus:outline-none" type="button" onClick={togglePasswordVisibility}>
                  {isPasswordVisible ? (
                    <EyeSlashIcon className="text-2xl pointer-events-none text-neutral-400" />
                  ) : (
                    <EyeIcon className="text-2xl pointer-events-none text-neutral-400" />
                  )}
                </button>
              }
              label="Password"
              placeholder="Enter your password"
              type={isPasswordVisible ? "text" : "password"}
              variant="bordered"
              validationState={errors.password ? "invalid" : "valid"}
              errorMessage={errors.password && errors.password.message}
              isRequired
            />
            {errors.root && (
              <p className="my-2 text-xs text-red-500">{errors.root.message}</p>
            )}
            <div className="flex justify-between px-1 py-2">
              <Checkbox
                classNames={{
                  label: "text-sm",
                }}
              >
                Remember me
              </Checkbox>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="flat" color="danger" onPress={onClose} disabled={isSubmitting}>
              Close
            </Button>
            <Button color="secondary" type="submit" isDisabled={isSubmitting} isLoading={isSubmitting}>
              Sign In
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
