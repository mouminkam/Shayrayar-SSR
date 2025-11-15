"use client";
import Breadcrumb from "../../components/ui/Breadcrumb";
import ContactBoxes from "../../sections/contact/ContactBoxes";
import ContactForm from "../../sections/contact/ContactForm";
import Map from "../../sections/contact/Map";

export default function ContactPage() {
  return (
    <div className="bg-bg3 min-h-screen">
      <Breadcrumb title="Contact us" />
      <ContactBoxes />
      <ContactForm />
      <Map />
    </div>
  );
}

