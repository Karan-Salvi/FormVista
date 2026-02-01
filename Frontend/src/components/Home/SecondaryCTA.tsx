const SecondaryCTA = () => {
  return (
    <section className="mx-auto max-w-6xl py-12 text-start sm:px-6 sm:py-20">
      <div className="items-center gap-16 rounded-2xl border border-blue-50 bg-blue-50/30 p-6 sm:rounded-[3rem] sm:p-12 md:flex">
        <div className="md:w-1/2">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[8px] font-bold text-blue-600 shadow-sm sm:mb-6 sm:text-[11px]">
            ✨ Create forms in minutes no skills needed!
          </div>
          <h2 className="mb-3 text-2xl leading-tight font-extrabold sm:mb-6 sm:text-4xl">
            Build <span className="text-blue-600">simple and beautiful</span>{' '}
            forms that people love to fill.
          </h2>
          <p className="mb-4 text-xs leading-relaxed text-slate-500 sm:mb-8 sm:text-sm">
            Design forms easily, share them anywhere, and collect responses in
            real time. Perfect for surveys, registrations, feedback, and more —
            all in one place.
          </p>
          <button className="flex cursor-pointer items-center gap-2 text-sm font-bold text-blue-600 transition-all hover:gap-4 sm:text-lg">
            Create your first form
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="animate-float mb-10 hidden sm:block md:mb-0 md:w-1/2">
          <div className="max-w-sm rounded-xl border border-slate-100 bg-white p-8 shadow-2xl shadow-blue-100">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100"></div>
              <div className="h-2 w-24 rounded-full bg-slate-100"></div>
            </div>
            <h4 className="mb-4 text-xl font-extrabold">
              Create Your First Form
            </h4>
            <div className="space-y-3">
              <div className="h-10 rounded-xl bg-slate-50"></div>
              <div className="h-10 rounded-xl bg-slate-50"></div>
              <button className="h-10 w-full cursor-pointer rounded-xl bg-blue-600 text-sm font-bold text-white">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SecondaryCTA
