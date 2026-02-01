const Pricing = () => {
  return (
    <section className="bg-white py-20 sm:px-6">
      <div className="max-auto max-w-5xl">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-4 text-2xl font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
            Simple, <span className="text-blue-600">Transparent</span> Pricing
          </h2>
          <p className="mx-auto max-w-lg text-xs text-gray-500">
            Choose the plan that's right for you. Start for free and upgrade as
            you grow.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md sm:rounded-3xl">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900">Basic</h3>
              <p className="mt-2 text-sm text-gray-500">
                Perfect for side projects and individuals.
              </p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-black text-gray-900">$0</span>
              <span className="text-gray-500">/month</span>
            </div>

            <ul className="mb-10 flex-grow space-y-4">
              <li className="flex items-center text-sm text-gray-600">
                <svg
                  className="mr-3 h-5 w-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Unlimited free forms
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <svg
                  className="mr-3 h-5 w-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Up to 100 submissions/mo
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <svg
                  className="mr-3 h-5 w-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Basic Analytics
              </li>
            </ul>

            <button className="w-full cursor-pointer rounded-xl border-2 border-blue-600 px-6 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50">
              Get Started
            </button>
          </div>

          <div className="relative flex flex-col rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-xl sm:rounded-3xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold tracking-wider text-white uppercase">
              Most Popular
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900">Pro</h3>
              <p className="mt-2 text-sm text-gray-500">
                Advanced tools for growing businesses.
              </p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-black text-gray-900">$2</span>
              <span className="text-gray-500">/month</span>
            </div>

            <ul className="mb-10 flex-grow space-y-4">
              <li className="flex items-center text-sm text-gray-600">
                <svg
                  className="mr-3 h-5 w-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Everything in Basic
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <svg
                  className="mr-3 h-5 w-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Unlimited submissions
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <svg
                  className="mr-3 h-5 w-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                AI-Powered Logic
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <svg
                  className="mr-3 h-5 w-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Remove FormVista branding
              </li>
            </ul>

            <button className="w-full transform cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:-translate-y-1 hover:bg-blue-700">
              Go Pro
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
