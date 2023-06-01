import { Modal, Button, Input, ModalHeader, ModalContent, ModalBody, ModalFooter } from "@nextui-org/react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { Role } from "@prisma/client";
import Toggle from "@/components/libs/inputs/Toggle";
import { useState } from "react";
import { EyeSlashFilledIcon, EyeFilledIcon } from "@nextui-org/shared-icons";
import { api } from "@/utils/api";
import { toastCustom } from "@/components/libs/Toast";
import { zodResolver } from '@hookform/resolvers/zod';
import { type CreateUserInput, createUserSchema } from "@/server/user/user.schema";
import type { DefaultPropsModal } from "@/types/modal.type";

interface Props extends DefaultPropsModal {
  onSuccess: () => Promise<void>;
}

export default function ModalAddUser({ isOpen, onOpenChange, onSuccess }: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const { mutate } = api.user.createUser.useMutation({
    onSuccess: async() => {
      await onSuccess();
      onOpenChange();
      toastCustom({
        type: "success",
        description: "User has been added",
      });
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        description: `User has been added. ${err.message ?? ""}`,
      });
    }
  });

  const { control, register, handleSubmit, formState: { errors, isSubmitting, defaultValues } } = useForm<CreateUserInput>({
    mode: "onChange",
    defaultValues: {
      isActive: true,
      role: Role.Kasir,
    },
    resolver: zodResolver(createUserSchema)
  });

  const onSubmit: SubmitHandler<CreateUserInput> = (dataInput): void => {
    mutate(dataInput);
  }

  return (
    <Modal
      aria-labelledby="modal-title"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                Add user
              </ModalHeader>
              <ModalBody>
                <Input
                  {...register("name", {
                    required: true,
                  })}
                  label="Name"
                  placeholder="Enter your name"
                  variant="bordered"
                  type="text"
                  status={errors.name ? "error" : "default"}
                  id="name"
                  isRequired
                  errorMessage={errors.name && errors.name?.message}
                />
                <Input
                  {...register("email", {
                    required: true,
                  })}
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                  type="email"
                  status={errors.email ? "error" : "default"}
                  id="email"
                  isRequired
                  errorMessage={errors.email && errors.email?.message}
                />
                <div
                  className="group flex flex-col data-[has-elements=true]:gap-2 w-full"
                  data-has-elements="true"
                >
                  <div className="relative w-full inline-flex shadow-sm px-3 border-2 border-neutral-200 data-[hover=true]:border-neutral-400 focus-within:!border-foreground rounded-lg flex-col items-start justify-center gap-0 transition-background !duration-150 transition-colors motion-reduce:transition-none h-16 py-2">
                    <label className="block font-medium text-neutral-600 text-xs after:content-['*'] after:text-danger after:ml-0.5 will-change-auto origin-top-left transition-all !duration-200 !ease-[cubic-bezier(0,0,0.2,1)] motion-reduce:transition-none">Role</label>
                    <select
                      {...register("role")}
                      defaultValue={defaultValues?.role}
                      className="mt-2 w-full h-full !bg-transparent outline-none placeholder:text-neutral-500 text-sm"
                      id="role"
                    >
                      <option value="" className="dark:text-background">Choose Your Role</option>
                      {Object.keys(Role).map((role) => (
                        <option key={role} value={role} className="dark:text-background">{role}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {errors.role && (
                  <div className="text-xs text-danger">{errors.role?.message}</div>
                )}
                <Input
                  {...register("password", {
                    required: true,
                  })}
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={togglePasswordVisibility}>
                      {isPasswordVisible ? (
                        <EyeSlashFilledIcon className="text-2xl pointer-events-none text-neutral-400" />
                      ) : (
                        <EyeFilledIcon className="text-2xl pointer-events-none text-neutral-400" />
                      )}
                    </button>
                  }
                  label="Password"
                  placeholder="Enter your password"
                  type={isPasswordVisible ? "text" : "password"}
                  variant="bordered"
                  status={errors.password ? "error" : "default"}
                  css={{ mb: "$12" }}
                  id="password"
                  isRequired
                  errorMessage={errors.password && errors.password?.message}
                />
                <Input
                  {...register("passwordConfirm", {
                    required: true,
                  })}
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={togglePasswordVisibility}>
                      {isPasswordVisible ? (
                        <EyeSlashFilledIcon className="text-2xl pointer-events-none text-neutral-400" />
                      ) : (
                        <EyeFilledIcon className="text-2xl pointer-events-none text-neutral-400" />
                      )}
                    </button>
                  }
                  label="Password Confirmation"
                  placeholder="Enter your password again"
                  type={isPasswordVisible ? "text" : "password"}
                  variant="bordered"
                  status={errors.password ? "error" : "default"}
                  css={{ mb: "$12" }}
                  id="Enter your password again"
                  isRequired
                  errorMessage={errors.passwordConfirm && errors.passwordConfirm?.message}
                />
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field: { ...field } }) => (
                    <Toggle
                      value={field.value ?? defaultValues?.isActive ?? false}
                      onChange={field.onChange}
                      title={`Account ${field.value ? "Active" : "Inactive"} `}
                      description="Make the account active or inactive"
                    />
                  )}
                />
                {errors.isActive && (
                  <div className="text-xs text-danger">{errors.isActive?.message}</div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button type="button" variant="flat" color="danger" onPress={onClose} disabled={isSubmitting}>
                  Close
                </Button>
                <Button color="secondary" type="submit" isDisabled={isSubmitting} isLoading={isSubmitting}>
                  Submit
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
