const Pricing = () => {
  return (
    <section className="bg-white py-20 sm:px-6">
      <div className="max-auto max-w-5xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl  sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Simple, <span className="text-blue-600">Transparent</span> Pricing
          </h2>
          <p className="text-xs text-gray-500 max-w-lg mx-auto">
            Choose the plan that's right for you. Start for free and upgrade as
            you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <div className="border border-gray-100 rounded-2xl sm:rounded-3xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900">Basic</h3>
              <p className="text-gray-500 text-sm mt-2">
                Perfect for side projects and individuals.
              </p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-black text-gray-900">$0</span>
              <span className="text-gray-500">/month</span>
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center text-gray-600 text-sm">
                <svg
                  className="w-5 h-5 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Unlimited free forms
              </li>
              <li className="flex items-center text-gray-600 text-sm">
                <svg
                  className="w-5 h-5 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Up to 100 submissions/mo
              </li>
              <li className="flex items-center text-gray-600 text-sm">
                <svg
                  className="w-5 h-5 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Basic Analytics
              </li>
            </ul>

            <button className="w-full py-3 px-6 rounded-xl font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer">
              Get Started
            </button>
          </div>

          <div className="relative border-2 border-blue-600 rounded-2xl sm:rounded-3xl p-8 bg-white shadow-xl flex flex-col">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Most Popular
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900">Pro</h3>
              <p className="text-gray-500 text-sm mt-2">
                Advanced tools for growing businesses.
              </p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-black text-gray-900">$2</span>
              <span className="text-gray-500">/month</span>
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center text-gray-600 text-sm">
                <svg
                  className="w-5 h-5 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Everything in Basic
              </li>
              <li className="flex items-center text-gray-600 text-sm">
                <svg
                  className="w-5 h-5 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Unlimited submissions
              </li>
              <li className="flex items-center text-gray-600 text-sm">
                <svg
                  className="w-5 h-5 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                AI-Powered Logic
              </li>
              <li className="flex items-center text-gray-600 text-sm">
                <svg
                  className="w-5 h-5 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Remove FormVista branding
              </li>
            </ul>

            <button className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 cursor-pointer">
              Go Pro
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
