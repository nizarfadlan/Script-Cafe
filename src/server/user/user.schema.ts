import * as z from "zod"
import { Role } from "@prisma/client"

const createUser = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  email: z.string({
    required_error: "Email is required",
  }).email("Invalid email"),
  password: z.string({
    required_error: "Password is required",
  }).min(8, "Password must be more than 8 characters").max(32, "Password must be less than 32 characters"),
  passwordConfirm: z.string({
    required_error: "Password Confirm is required",
  }),
  role: z.nativeEnum(Role, {
    required_error: "Role is required",
  }).optional(),
  isActive: z.boolean().optional(),
});

export const createUserSchema = createUser.refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Passwords do not match',
});

export const paramsId = z.object({
  id: z.string().nonempty(),
});

export const updateUserSchema = z.object({
  params: paramsId,
  body: createUser.pick({ name: true, email: true, role: true }),
});

const recoverySchema = z.object({
  deletedAt: z.boolean().optional(),
});

export const updateActiveSchema = z.object({
  params: paramsId,
  body: recoverySchema.merge(createUser.pick({ isActive: true })),
});

export const updatePasswordSchema = z.object({
  params: paramsId,
  body: z.object({
      oldPassword: z.string({
        required_error: "Password is required",
      }),
      newPassword: z.string({
        required_error: "New password is required",
      }).min(8, "New Password must be more than 8 characters").max(32, "New Password must be less than 32 characters"),
      newPasswordConfirm: z.string({
        required_error: "Password Confirm is required",
      }),
    }).refine((data) => data.newPassword === data.newPasswordConfirm, {
      path: ['newPasswordConfirm'],
      message: 'Passwords do not match',
    })
});

export type ParamsInput = z.TypeOf<typeof paramsId>;
export type CreateUserInput = z.TypeOf<typeof createUserSchema>;
export type UpdateUserInput = z.TypeOf<typeof updateUserSchema>;
export type UpdateActiveInput = z.TypeOf<typeof updateActiveSchema>;
export type UpdatePasswordInput = z.TypeOf<typeof updatePasswordSchema>;
