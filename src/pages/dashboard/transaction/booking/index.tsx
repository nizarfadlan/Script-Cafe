import LayoutDashboard from "@/components/dashboard/Layout";
import { type NextPage } from "next";

const Booking: NextPage = () => {
  return (
    <LayoutDashboard title="Booking">
      <div className="grid grid-cols-12 mb-8">
        <div className="col-span-6">
          <h1 className="text-2xl font-bold">Booking</h1>
        </div>
        <div className="flex justify-end col-span-6">

        </div>
      </div>
    </LayoutDashboard>
  );
}

export default Booking;
