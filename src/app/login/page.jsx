
import Breadcrumb from "../../components/ui/Breadcrumb";
import LoginSection from "../../components/pages/login/LoginSection";

export default function LoginPage() {
  return (
    <div className="bg-bg3 min-h-screen">
      <Breadcrumb title="Login" />
      <section className="login-section section-padding fix bg-bg3 py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-md mx-auto">
            <LoginSection />
          </div>
        </div>
      </section>
    </div>
  );
}

