import * as z from "zod"
import { Role } from "@prisma/client"

export const userModel = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  role: z.nativeEnum(Role),
  isActive: z.boolean(),
  password: z.string(),
  loginAttempts: z.number().int(),
  blockExpires: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
})
