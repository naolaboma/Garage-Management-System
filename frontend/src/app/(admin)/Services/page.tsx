"use client";

import React, { useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { PulseLoader } from "react-spinners";
import {
  useGetServicesQuery,
  useCreateServiceMutation,
  useDeleteServiceMutation,
} from "@/features/api/apiSlice";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useRouter } from "next/navigation";

function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const { data: services } = useGetServicesQuery();
  const [createService, { isLoading }] = useCreateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  // Handle creating new service
  const handleSubmit = async () => {
    if (!serviceName || !serviceDescription) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    try {
      setErrorMessage("");
      await createService({
        service_name: serviceName,
        service_description: serviceDescription,
      }).unwrap();
      alert("Service created successfully");
      setServiceName("");
      setServiceDescription("");
    } catch (error) {
      console.log(error);
      setErrorMessage("Sorry, something went wrong. Please try again.");
    }
  };

  // Handle delete confirmation
  const onConfirm = async () => {
    if (serviceId !== null) {
      try {
        await deleteService({ service_id: serviceId }).unwrap();
        setIsModalOpen(false);
        setServiceId(null);
        alert("Service deleted successfully");
      } catch (error) {
        console.log(error);
        alert("Sorry, something went wrong. Please try again.");
      }
    }
  };

  const handleDeleteClick = (id: number) => {
    setServiceId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="md:mx-20">
      <p className="text-4xl font-bold text-customBlue mb-10">
        Services we provide
        <span className="inline-block ml-3 w-8 h-[2px] bg-customeRed"></span>
      </p>

      {services?.services?.length > 0 &&
        services.services.map((service, index) => (
          <div
            key={index}
            className="my-5 flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="w-4/5">
              <h3 className="text-lg text-customBlue font-bold">
                {service.service_name}
              </h3>
              <p className="text-base text-gray-800">
                {service.service_description}
              </p>
            </div>
            <div className="flex gap-10 items-center">
              <FaUserEdit
                size={30}
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/Services/edit/${service.service_id}`)
                }
              />
              <MdDelete
                size={30}
                className="text-customeRed cursor-pointer"
                onClick={() => handleDeleteClick(service.service_id)}
              />
            </div>
          </div>
        ))}

      {/* New Service Form */}
      <div className="shadow-md rounded-sm border border-gray-200 my-5 px-4 py-5">
        <p className="text-4xl font-bold text-customBlue my-10">
          Add a new service
          <span className="inline-block ml-3 w-10 h-[2px] bg-customeRed"></span>
        </p>

        <input
          type="text"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder="Service name"
          className="w-full p-2 my-5 border rounded-md focus:ring focus:ring-blue-300"
        />

        <textarea
          value={serviceDescription}
          onChange={(e) => setServiceDescription(e.target.value)}
          placeholder="Service description"
          className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
          rows={3}
        />

        {errorMessage && (
          <p className="text-red-500 mt-2">{errorMessage}</p>
        )}

        <button
          className="px-10 py-4 mt-5 text-white bg-customeRed rounded-md"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? <PulseLoader size={8} color="#fff" /> : "Create Service"}
        </button>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={onConfirm}
        message="Are you sure you want to delete this service?"
      />
    </div>
  );
}

export default Page;
