import { Role, type User } from "@prisma/client";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession, useSession } from "next-auth/react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import superjson from "superjson";
import LayoutDashboard from "@/components/dashboard/Layout";
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Spinner, Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";
import { api } from "@/utils/api";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type UpdateUserInput, updateUserSchema, type UpdatePasswordInput, updatePasswordSchema } from "@/server/user/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon, FailedIcon, SuccessIcon } from "@/components/libs/Icons";
import { toastCustom } from "@/components/libs/Toast";
import { useRouter } from "next/router";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
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
    await helpers.user.getOne.fetch({ id });
  } catch (e) {
    return {
      notFound: true,
    };
  }

  await helpers.user.getOne.prefetch({ id });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (session.user.role !== Role.Owner && session.user.role !== Role.Manajer) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
}

const UserEdit = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = props;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const { data, refetch, isLoading: loadingGetData } = api.user.getOne.useQuery({ id });
  const { mutate: mutateActiveUser } = api.user.updateActiveUser.useMutation({
    onSuccess: async() => {
      toastCustom({
        type: "success",
        title: "Success update user",
        description: "Change account status."
      });
      await refetch();
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        title: "Failed update user",
        description: `Change account status. ${err.message ?? ""}`
      });
    },
  });

  const { mutate: mutatePassword, isLoading: loadingPassword } = api.user.updatePassword.useMutation({
    onSuccess: async() => {
      toastCustom({
        type: "success",
        title: "Success update user",
        description: "Change password account."
      });
      await refetch();
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        title: "Failed update user",
        description: `Change password account. ${err.message ?? ""}`
      });
    }
  });

  const { mutate: mutateUser, isLoading: loadingUser } = api.user.updateUser.useMutation({
    onSuccess: async() => {
      toastCustom({
        type: "success",
        title: "Success update user",
        description: "Change info user."
      });
      await refetch();
    },
    onError: (err) => {
      toastCustom({
        type: "error",
        title: "Failed update user",
        description: `Change info user. ${err.message ?? ""}`
      });
    }
  });

  if (!data || loadingGetData) {
    <LayoutDashboard title="Edit user">
      <div className="flex justify-center">
        <Spinner color="secondary" />
      </div>
    </LayoutDashboard>
  }

  const user: User = data!;

  const isBlocked = user?.blockExpires && new Date(user?.blockExpires) > new Date();

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateUserInput>({
    mode: "onChange",
    resolver: zodResolver(updateUserSchema)
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: errorsPassword } } = useForm<UpdatePasswordInput>({
    mode: "onChange",
    resolver: zodResolver(updatePasswordSchema)
  });

  const onSubmit: SubmitHandler<UpdateUserInput> = (dataInput): void => {
    mutateUser(dataInput);
  }

  const onSubmitPassword: SubmitHandler<UpdatePasswordInput> = (dataInput): void => {
    mutatePassword(dataInput);
  }

  const onStatusAccount = (): void => {
    if (id !== session?.user.id) {
      mutateActiveUser({
        params: {
          id: user.id
        },
        body: {
          isActive: user.deletedAt ? user.isActive : !user.isActive,
          deletedAt: !!user.deletedAt
        }
      });
    } else {
      toastCustom({
        type: "error",
        title: "Failed update user",
        description: "Can't update the status of your own account"
      })
    }
  }

  const [selected, setSelected] = useState<React.Key>("editInfo");

  return (
    <LayoutDashboard title="Edit user">
      <div className="flex flex-col gap-4">
        <Button
          variant="bordered"
          color="danger"
          className="mb-2 w-max hover:bg-danger hover:text-danger-foreground hover:shadow-lg hover:shadow-danger/40"
          startIcon={<ArrowLeftIcon size={18} />}
          onPress={() => router.replace("/dashboard/users")}
        >
          Back
        </Button>
        <h1 className="text-2xl font-semibold">Edit user</h1>
        <div className="flex flex-col w-full gap-4 md:flex-row">
          {!user.deletedAt ?
            (
              <section className="w-full">
                <Tabs
                  aria-label="Tabs Edit User"
                  selectedKey={selected}
                  onSelectionChange={setSelected}
                  className="w-full"
                >
                  <Tab key="editInfo" title="Edit Profile">
                    <Card className="w-full p-3">
                      <CardHeader className="text-lg">
                        <h1>Informasi User</h1>
                      </CardHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <input hidden value={id} {...register("params.id")} />
                          <CardBody className="flex flex-col w-full gap-4">
                            <Input
                              {...register("body.name", {
                                required: true,
                              })}
                              defaultValue={user.name?.toString()}
                              
                              label="Name"
                              placeholder="Enter your name"
                              variant="bordered"
                              type="text"
                              validationState={errors.body?.name ? "invalid" : "valid"}
                              id="name"
                              isRequired
                              errorMessage={errors.body?.name && errors.body?.name?.message}
                            />
                            <Input
                              {...register("body.email", {
                                required: true,
                              })}
                              defaultValue={user.email?.toString()}
                              label="Email"
                              placeholder="Enter your email"
                              variant="bordered"
                              type="email"
                              validationState={errors.body?.email ? "invalid" : "valid"}
                              id="email"
                              isRequired
                              errorMessage={errors.body?.email && errors.body?.email?.message}
                            />
                            <div
                              className="group flex flex-col data-[has-elements=true]:gap-2 w-full"
                              data-has-elements="true"
                            >
                              <div className="relative w-full inline-flex shadow-sm px-3 border-2 border-neutral-200 data-[hover=true]:border-neutral-400 focus-within:!border-foreground rounded-lg flex-col items-start justify-center gap-0 transition-background !duration-150 transition-colors motion-reduce:transition-none h-16 py-2">
                                <label className="block font-medium text-neutral-600 text-xs after:content-['*'] after:text-danger after:ml-0.5 will-change-auto origin-top-left transition-all !duration-200 !ease-[cubic-bezier(0,0,0.2,1)] motion-reduce:transition-none">Role</label>
                                <select
                                  {...register("body.role")}
                                  defaultValue={user.role}
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
                            {errors.body?.role && (
                              <div className="text-xs text-danger">{errors.body?.role?.message}</div>
                            )}
                        </CardBody>
                        <CardFooter className="flex justify-end">
                          <Button
                            color="secondary"
                            type="submit"
                            isDisabled={loadingUser}
                            isLoading={loadingUser}
                          >
                            Submit
                          </Button>
                        </CardFooter>
                      </form>
                    </Card>
                  </Tab>
                  <Tab key="changePassword" title="Change Password">
                    <Card className="w-full p-3">
                      <CardHeader  className="text-lg">
                        <h1>Change Password</h1>
                      </CardHeader>
                      <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                        <input hidden value={id} {...registerPassword("params.id")} />
                        <CardBody className="flex flex-col w-full gap-4">
                          <Input
                            {...registerPassword("body.oldPassword", {
                              required: true,
                            })}
                            endContent={
                              <button className="focus:outline-none" type="button" onClick={togglePasswordVisibility}>
                                {isPasswordVisible ? (
                                  <EyeSlashIcon className="text-2xl pointer-events-none text-neutral-400" />
                                ) : (
                                  <EyeIcon className="text-2xl pointer-events-none text-neutral-400" />
                                )}
                              </button>
                            }
                            label="Old Password"
                            placeholder="Enter your old password"
                            type={isPasswordVisible ? "text" : "password"}
                            variant="bordered"
                            validationState={errorsPassword.body?.oldPassword ? "invalid" : "valid"}
                            id="oldPassword"
                            isRequired
                            errorMessage={errorsPassword.body?.oldPassword && errorsPassword.body?.oldPassword?.message}
                          />
                          <Input
                            {...registerPassword("body.newPassword", {
                              required: true,
                            })}
                            endContent={
                              <button className="focus:outline-none" type="button" onClick={togglePasswordVisibility}>
                                {isPasswordVisible ? (
                                  <EyeSlashIcon className="text-2xl pointer-events-none text-neutral-400" />
                                ) : (
                                  <EyeIcon className="text-2xl pointer-events-none text-neutral-400" />
                                )}
                              </button>
                            }
                            label="New Password"
                            placeholder="Enter your new password"
                            type={isPasswordVisible ? "text" : "password"}
                            variant="bordered"
                            validationState={errorsPassword.body?.newPassword ? "invalid" : "valid"}
                            id="newPassword"
                            isRequired
                            errorMessage={errorsPassword.body?.newPassword && errorsPassword.body?.newPassword?.message}
                          />
                          <Input
                            {...registerPassword("body.newPasswordConfirm", {
                              required: true,
                            })}
                            endContent={
                              <button className="focus:outline-none" type="button" onClick={togglePasswordVisibility}>
                                {isPasswordVisible ? (
                                  <EyeSlashIcon className="text-2xl pointer-events-none text-neutral-400" />
                                ) : (
                                  <EyeIcon className="text-2xl pointer-events-none text-neutral-400" />
                                )}
                              </button>
                            }
                            label="New Password Confirm"
                            placeholder="Enter your new password again"
                            type={isPasswordVisible ? "text" : "password"}
                            variant="bordered"
                            validationState={errorsPassword.body?.newPasswordConfirm ? "invalid" : "valid"}
                            id="newPasswordConfirm"
                            isRequired
                            errorMessage={errorsPassword.body?.newPasswordConfirm && errorsPassword.body?.newPasswordConfirm?.message}
                          />
                        </CardBody>
                        <CardFooter className="flex justify-end">
                          <Button
                            color="secondary"
                            type="submit"
                            isDisabled={loadingPassword}
                            isLoading={loadingPassword}
                          >
                            Submit
                          </Button>
                        </CardFooter>
                      </form>
                    </Card>
                  </Tab>
                </Tabs>
              </section>
            )
            : null
          }
          <section className={user.deletedAt ? "w-full" : "w-full lg:max-w-[280px]"}>
            <Card
              className="p-3 border-none h-max"
            >
              <CardHeader className="text-lg">
                <h1>Status</h1>
              </CardHeader>
              <CardBody className={`flex flex-col items-center justify-center ${user.isActive && !user.deletedAt ? "text-green-400 fill-green-400" : "text-rose-400 fill-rose-400"}`}>
                {user.isActive && !user.deletedAt ? (
                  <SuccessIcon fill="inherit" size={80} />
                  )
                : (
                  <FailedIcon fill="inherit" size={80} />
                )}
                <h1 className="mt-1 font-medium text-md">
                  Account {user.deletedAt ? "Deleted" : (isBlocked ? "Blocked" : (user.isActive ? "Active" : "Inactive"))}
                </h1>
              </CardBody>
              <CardFooter>
                <Button
                  color={user.isActive && !user.deletedAt ? "danger" : "success"} isDisabled={isBlocked || false}
                  fullWidth
                  onPress={onStatusAccount}
                >
                  {user.deletedAt ? "Recovery" : (isBlocked ? "Blocked" : (user.isActive ? "Inactive" : "Active"))}
                </Button>
              </CardFooter>
            </Card>
          </section>
        </div>
      </div>
    </LayoutDashboard>
  );
}

export default UserEdit;
