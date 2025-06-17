"use client";
import { useGetServicesQuery } from "@/features/api/apiSlice";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import Image from "next/image";
import Link from "next/link";

function Footer() {
  const { data, isLoading, isError } = useGetServicesQuery();

  return (
    <>
      <div className="bg-customBlue text-white px-10 md:px-0">
        <div className="border-b-[1px] border-gray-500">
          <div className="mx-auto max-w-[1200px] grid sm:grid-cols-2 md:grid-cols-3">
            <div className="flex items-center gap-3 sm:border-r-[1px] border-gray-500 sm:justify-center pt-7 pb-4">
              <LocationOnOutlinedIcon className="text-customeRed" fontSize="large" />
              <p>Addis Ababa, Ethiopia.</p>
            </div>
            <div className="flex items-center gap-3 sm:justify-center md:border-r-[1px] border-gray-500 pt-7 pb-4">
              <MarkEmailReadOutlinedIcon className="text-customeRed" fontSize="large" />
              <p>
                Email us:{" "}
                <a href="mailto:alemisaararsa88@gmail.com" className="">
                  alemisaararsa88@gmail.com
                </a>
              </p>
            </div>
            <div className="flex items-center gap-3 sm:justify-center pt-7 pb-4">
              <LocalPhoneOutlinedIcon className="text-customeRed" fontSize="large" />
              <p>Call us on +1961977459</p>
            </div>
          </div>
        </div>

        <div className="pt-16 max-w-[1200px] mx-auto grid md:grid-cols-3">
          <div className="md:mx-auto mb-10 md:mb-0">
            <Image
              src="/images/logo.png"
              width={271}
              height={50}
              alt="logo"
              className="text-white"
            />
            <p className="text-[#b2b9c5]">Experienced more than 24 years</p>
          </div>

          <div className="md:mx-auto mb-10 md:mb-0">
            <p className="text-xl font-bold mb-[30px]">Use full Links</p>
            <ul>
              <li className="mb-2 text-[#b2b9c5]">
                <Link href="/">Home</Link>
              </li>
              <li className="mb-2 text-[#b2b9c5]">
                <Link href="/about">About Us</Link>
              </li>
              <li className="mb-2 text-[#b2b9c5]">
                <Link href="/services">Services</Link>
              </li>
              <li className="mb-2 text-[#b2b9c5]">
                <Link href="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div className="md:mx-auto">
            <p className="text-xl font-bold mb-[30px]">Our Services</p>
            <ul>
              {isLoading && <li className="text-[#b2b9c5]">Loading services...</li>}
              {isError && <li className="text-[#b2b9c5]">Failed to load services.</li>}
              {data?.services?.map((service) => (
                <li key={service.service_id} className="mb-2 text-[#b2b9c5]">
                  <Link href="/services">{service.service_name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
