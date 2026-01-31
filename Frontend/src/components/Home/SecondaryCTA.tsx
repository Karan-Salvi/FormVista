const SecondaryCTA = () => {
  return (
    <section className="max-w-6xl mx-auto sm:px-6 py-12 sm:py-20 text-start">
      <div className="bg-blue-50/30 rounded-2xl sm:rounded-[3rem] p-6 sm:p-12 md:flex items-center gap-16 border border-blue-50">
        <div className="md:w-1/2">
          <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full text-[8px] sm:text-[11px] font-bold text-blue-600 shadow-sm mb-3 sm:mb-6">
            ✨ Create forms in minutes no skills needed!
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight mb-3 sm:mb-6">
            Build <span className="text-blue-600">simple and beautiful</span>{" "}
            forms that people love to fill.
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-8 leading-relaxed">
            Design forms easily, share them anywhere, and collect responses in
            real time. Perfect for surveys, registrations, feedback, and more —
            all in one place.
          </p>
          <button className="text-sm sm:text-lg cursor-pointer font-bold text-blue-600 flex items-center gap-2 hover:gap-4 transition-all">
            Create your first form
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="hidden sm:block md:w-1/2 mb-10 md:mb-0 animate-float">
          <div className="bg-white p-8 rounded-xl shadow-2xl shadow-blue-100 border border-slate-100 max-w-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-100"></div>
              <div className="h-2 w-24 bg-slate-100 rounded-full"></div>
            </div>
            <h4 className="text-xl font-extrabold mb-4">
              Create Your First Form
            </h4>
            <div className="space-y-3">
              <div className="h-10 bg-slate-50 rounded-xl"></div>
              <div className="h-10 bg-slate-50 rounded-xl"></div>
              <button className="cursor-pointer w-full h-10 bg-blue-600 rounded-xl text-white font-bold text-sm">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondaryCTA;
