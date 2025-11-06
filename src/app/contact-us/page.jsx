"use client";
import Breadcrumb from "../../components/pages/contact/Breadcrumb";
import ContactBoxes from "../../components/pages/contact/ContactBoxes";
import ContactForm from "../../components/pages/contact/ContactForm";
import Map from "../../components/pages/contact/Map";

export default function ContactPage() {
  return (
    <div className="bg-[#F4F1EA] min-h-screen">
      <Breadcrumb title="Contact us" />
      <ContactBoxes />
      <ContactForm />
      <Map />
    </div>
  );
}

