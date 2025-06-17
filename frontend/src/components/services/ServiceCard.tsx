"use client";
import { useGetServicesQuery } from "@/features/api/apiSlice";
import Image from "next/image";

function ServiceCard() {
  const { data, isLoading, isError } = useGetServicesQuery();

  if (isLoading) return <p>Loading services...</p>;
  if (isError) return <p>Failed to load services.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
      {data?.services?.map((service) => (
        <div
          key={service.service_id}
          className="bg-white rounded-2xl p-6 h-[280px] flex flex-col justify-between border-b-4 border-customeRed shadow-md hover:shadow-lg hover:shadow-gray-500 hover:-translate-y-2 transform transition duration-300"
        >
          <div>
            <p className="text-xs text-customBlue mb-2">SERVICE AND REPAIRS</p>
            <p className="text-xl font-bold text-customBlue">
              {service.service_name}
            </p>
          </div>
          <div className="flex justify-between items-center mt-6">
            <p className="text-customeRed text-sm font-medium">READ MORE +</p>
            <Image
              src="/images/image.png"
              width={100}
              height={200}
              alt="service icon"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ServiceCard;
