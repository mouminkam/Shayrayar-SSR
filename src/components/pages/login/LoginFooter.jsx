import Link from "next/link";

export default function LoginFooter() {
  return (
    <div className="mt-6 text-center">
      <p className="text-text text-sm">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-theme3 hover:text-theme font-semibold transition-colors"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}

