import { useGetServicesQuery } from "../../features/api/apiSlice";
import Image from "next/image";

type ServiceSelectionProps = {
  selectedServices: number[];
  onServiceSelect: (serviceId: number) => void;
};

function ServiceSelection({ selectedServices, onServiceSelect }: ServiceSelectionProps) {
  const { data, isLoading, isError } = useGetServicesQuery();
  const services = data?.services || [];

  if (isLoading) return <p>Loading services...</p>;
  if (isError || !services.length) return <p>Failed to load services</p>;

  return (
    <div>
      <p className="text-xl font-bold text-customBlue mb-4">Select Services</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.service_id}
            className={`bg-white px-8 pt-8 pb-6 border-b-4 ${
              selectedServices.includes(service.service_id) ? "border-customRed" : "border-gray-200"
            } mb-5 shadow-md hover:shadow-lg hover:shadow-gray-500 hover:-translate-y-2 transform transition duration-300 cursor-pointer`}
            onClick={() => onServiceSelect(service.service_id)}
          >
            <p className="text-xs text-customBlue">SERVICE AND REPAIRS</p>
            <p className="text-2xl font-bold text-customBlue">{service.service_name}</p>
            <div className="flex justify-between mt-12 items-center">
              <p className="text-customRed text-sm font-medium">
                {selectedServices.includes(service.service_id) ? "SELECTED" : "SELECT"}
              </p>
              <Image src="/images/image.png" width={64} height={58} alt="service icon" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceSelection;
