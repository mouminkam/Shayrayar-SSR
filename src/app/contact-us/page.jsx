
import Breadcrumb from "../../components/ui/Breadcrumb";
import ContactBoxes from "../../components/contact/ContactBoxes";
import ContactForm from "../../components/contact/ContactForm";
import Map from "../../components/contact/Map";

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

