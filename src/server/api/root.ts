import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { itemRouter } from "./routers/menu/item";
import { packageRouter } from "./routers/menu/packageItem";
import { tableRouter } from "./routers/table";
import { paymentRouter } from "./routers/transaction/payment";
import { orderRouter } from "./routers/transaction/order";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  item: itemRouter,
  packageItem: packageRouter,
  table: tableRouter,
  payment: paymentRouter,
  order: orderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
