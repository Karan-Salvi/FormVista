const Features = () => {
  return (
    <section className="py-16 sm:px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">
          Everything you need
        </h2>
        <h1 className="text-lg sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          Powerful features to create, customize, and analyze your forms.
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* <div className="group bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-lg mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Block-Based Editor
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Build forms using modular blocks. Drag, drop, and customize with
                ease to fit your exact needs.
              </p>
            </div> */}

        <div className="cursor-pointer group bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-lg mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Slash Commands
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            Type "/" to instantly add any block type. A fast and intuitive way
            to build without leaving your keyboard.
          </p>
        </div>

        <div className="cursor-pointer group bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-lg mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Beautiful Design
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            Modern, minimal aesthetics. Create forms that look like stunning
            landing pages out of the box.
          </p>
        </div>

        <div className="cursor-pointer group bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-lg mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Analytics & Insights
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            Track responses, completion rates, and user behavior to optimize
            your data collection.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
