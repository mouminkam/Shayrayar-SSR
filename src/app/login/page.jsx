"use client";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center -mt-15 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Log in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Welcome back to our JEWELRY world
        </p>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-3/4">
        <div className="bg-white py-8 px-4 sm:rounded-sm sm:px-10">
          <form className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  <span className="text-gray-500">✔ Hide</span>
                </button>
              </div>
            </div>

           

            {/* Submit */}
            <div className="flex justify-center mt-12">
              <button
                type="submit"
                className="w-2/3 flex justify-center py-4 px-2 border-2 border-orange-500 rounded-sm text-lg font-medium text-orange-500 bg-white hover:bg-orange-500 hover:text-white"
              >
                Log In
              </button>
            </div>

            {/* Divider text */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Create one
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


