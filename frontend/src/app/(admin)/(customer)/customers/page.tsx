"use client";

import { useState } from "react";
import {
  useGetcustomersByKeywordQuery,
  useGetCustomersQuery,
  useUpdateCustomerInfoMutation,
} from "@/features/api/apiSlice";
import { HiSearch } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function CustomersPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [updateCustomerInfo] = useUpdateCustomerInfoMutation();

  // Fetch customers for pagination
  const { data: customers, isLoading, isError, error } = useGetCustomersQuery(
    { page, limit: 10 }
  );

  // Fetch customers by search keyword; skip if keyword is empty
  const {
    data: searchCustomers,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useGetcustomersByKeywordQuery({ keyword }, { skip: !keyword });

  // Toggle active status of a customer
  const toggleStatus = async (customer: any) => {
    try {
      await updateCustomerInfo({
        customer_id: customer.customer_id,
        customer_first_name: customer.customer_first_name,
        customer_last_name: customer.customer_last_name,
        customer_email: customer.customer_email,
        customer_phone_number: customer.customer_phone_number,
        active_customer_status: customer.active_customer_status ? 0 : 1,
      }).unwrap();
    } catch (err) {
      console.error("Failed to update customer status:", err);
    }
  };

  const handleNextPage = () => {
    if ((customers?.customers ?? []).length > 0) {
      setPage((p) => p + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const displayedCustomers = keyword
    ? searchCustomers?.customers
    : customers?.customers;

  const isLoadingCustomers = keyword ? isSearchLoading : isLoading;
  const isErrorCustomers = keyword ? isSearchError : isError;

  return (
    <div className="flex flex-col gap-10 mx-5 my-10 md:mx-16">
      <p className="text-4xl font-bold text-customBlue mb-3">
        Customers
        <span className="inline-block ml-3 w-10 h-[2px] bg-customeRed"></span>
      </p>

      <div className="relative">
        <input
          type="text"
          className="w-full border border-gray-300 p-4 rounded-md pr-10"
          placeholder="Search for a customer using first name, last name, or email address"
          value={keyword}
          onChange={handleSearchChange}
        />
        <HiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {isLoadingCustomers && <p>Loading...</p>}
      {isErrorCustomers && <p>Error loading customers</p>}

      {displayedCustomers && displayedCustomers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 mt-3">
            <thead>
              <tr>
                <th className="py-2 px-4 border border-gray-300">ID</th>
                <th className="py-2 px-4 border border-gray-300">First Name</th>
                <th className="py-2 px-4 border border-gray-300">Last Name</th>
                <th className="py-2 px-4 border border-gray-300">Email</th>
                <th className="py-2 px-4 border border-gray-300">Phone</th>
                <th className="py-2 px-4 border border-gray-300">Added Date</th>
                <th className="py-2 px-4 border border-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedCustomers.map((customer, idx) => (
                <tr
                  key={customer.customer_id}
                  onClick={() => router.push(`/customers/${customer.customer_id}`)}
                  className={`cursor-pointer ${idx % 2 ? "bg-gray-100" : ""} hover:bg-gray-200`}
                >
                  <td className="py-4 px-4 border border-gray-300">
                    {customer.customer_id}
                  </td>
                  <td className="py-4 px-4 border border-gray-300">
                    {customer.customer_first_name}
                  </td>
                  <td className="py-4 px-4 border border-gray-300">
                    {customer.customer_last_name}
                  </td>
                  <td className="py-4 px-4 border border-gray-300">
                    {customer.customer_email}
                  </td>
                  <td className="py-4 px-4 border border-gray-300">
                    {customer.customer_phone_number}
                  </td>
                  <td className="py-4 px-4 border border-gray-300">
                    {new Date(customer.customer_added_date).toLocaleDateString()}
                  </td>
                  <td
                    className="py-4 px-4 border border-gray-300 text-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStatus(customer);
                    }}
                  >
                    {customer.active_customer_status ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-customBlue font-semibold">No customers found</p>
      )}

      <div className="flex justify-center mt-5">
        <button
          className="btn w-36 btn-outline border rounded-l border-gray-300 px-4 py-3 text-customBlue font-semibold"
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          Previous Page
        </button>
        <button
          className="btn w-36 btn-outline border rounded-r border-gray-300 px-4 py-3 text-customBlue font-semibold"
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}
