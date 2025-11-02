// components/SignupForm.jsx
export default function SignupForm() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center -mt-15 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join Us and discover a world of magical wear
        </p>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-3/4">
        <div className="bg-white py-8 px-4 sm:rounded-sm sm:px-10">
          <form className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-600 rounded-sm shadow-sm py-2 px-3 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-600 rounded-sm shadow-sm py-2 px-3 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full border border-gray-600 rounded-sm shadow-sm py-2 px-3 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="mt-1 block w-full border border-gray-600 rounded-sm shadow-sm py-2 px-3 focus:outline-none focus:border-orange-500"
              />
              <p className="mt-2 text-sm text-gray-500">
                We strongly recommend adding a phone number. This will help
                verify your account and keep it safe.
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full border border-gray-600 rounded-sm shadow-sm py-2 px-3 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  <span className="text-gray-500">✔ Hide</span>
                </button>
              </div>

              {/* Password Requirements */}
              <div className="mt-2 text-sm text-gray-600 flex md:max-w-1/2 flex-wrap gap-4">
                <div className="flex items-center">
                  <span className="text-xs">• Use 8 or more characters</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs">
                    • Use upper and lower case letters (e.g. Aa)
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs">• Use a number (e.g. 1234)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs">• Use a symbol (e.g. @#$)</span>
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="block w-full border border-gray-600 rounded-sm shadow-sm py-2 px-3 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  <span className="text-gray-500">✔ Hide</span>
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <div className="flex justify-center mt-20">
              <button
                type="submit"
                className="w-2/3 flex justify-center py-4 px-2 border-2  border-orange-500  rounded-sm  text-lg font-medium text-orange-500 bg-white hover:bg-orange-500  hover:text-white "
              >
                Sign Up
              </button>
            </div>

            {/* Terms and Conditions */}
            <div className="text-center">
              <p className="text-xs text-gray-600">
                By creating an account, you agree to the{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Terms of use
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Have An Account?{" "}
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Log In
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
