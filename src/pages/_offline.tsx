import Layout from "@/components/Layout";
import type { NextPage } from "next";

const Offline: NextPage = () => {
  return (
    <Layout title="Offline">
      <div
        className="flex items-center justify-center my-auto text-center"
      >
        <div className="flex-none">
          <h1 className="text-2xl font-black tracking-wide text-transparent sm:text-5xl bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text">
            Connect to the internet
          </h1>
          <p className="font-bold text-gray-500 sm:text-lg">
            You&apos;re offline. Check your connection.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Offline;
