import { env } from "@/env.mjs";
import type { CustomerDetailPayment, PaymentType } from "@/types/payment.type";
import { MidtransClient } from "midtrans-node-client";
import { type TransactionRequestType } from "midtrans-node-client/dist/types/snap";
import { v4 as uuidv4 } from "uuid";

const Core = () => {
  return new MidtransClient.CoreApi({
    isProduction: env.NODE_ENV === "production",
    serverKey: env.MIDTRANS_SERVER_KEY,
    clientKey: env.MIDTRANS_CLIENT_KEY
  });
}

export const Snap = () => {
  return new MidtransClient.Snap({
    isProduction: env.NODE_ENV === "production",
    serverKey: env.MIDTRANS_SERVER_KEY,
    clientKey: env.MIDTRANS_CLIENT_KEY
  });
}

export async function createTransaction<T extends keyof TransactionRequestType>({
  snapType,
  payload,
  total,
  paymentType,
  customer,
}: {
  snapType: T,
  payload: TransactionRequestType[T],
  total: number,
  paymentType: PaymentType,
  customer: CustomerDetailPayment,
}) {
  const snap = Snap();

  const transactionRequest: TransactionRequestType = {
    [snapType]: {
      payment_type: paymentType,
      currency: "IDR",
      transaction_details: {
        order_id: uuidv4(),
        gross_amount: total,
      },
      customer_details: customer,
      ...payload,
    },
  };

  const transaction = await snap.createTransactionToken(transactionRequest);

  return transaction;
}

export const checkTransaction = async (orderId: string): Promise<Record<string, any>> => {
  const snap = Snap();

  const transaction = await snap.transaction.status(orderId);
  return transaction;
};

export default Core;
