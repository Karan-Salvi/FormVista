const HowItWorks = () => {
  return (
    <section className="mx-auto max-w-7xl pt-20 sm:px-6 sm:py-24">
      <div className="mb-16 text-center">
        <div className="mb-4 inline-block rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-extrabold text-blue-600">
          THE PROCESS
        </div>
        <h2 className="w-full text-3xl font-extrabold sm:text-4xl">
          3 Steps to <span className="text-blue-600">Create Beautiful</span>{' '}
          Form
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="group cursor-pointer rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition-all hover:bg-white hover:shadow-xl">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white font-bold text-blue-600 shadow-sm transition-colors group-hover:bg-blue-600 group-hover:text-white">
            1
          </div>
          <h3 className="mb-2 text-lg font-bold">Drag & Drop Blocks</h3>
          <p className="text-sm text-slate-500">
            Choose from 20+ question types including file uploads and payments.
          </p>
        </div>
        <div className="group cursor-pointer rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition-all hover:bg-white hover:shadow-xl">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white font-bold text-blue-600 shadow-sm transition-colors group-hover:bg-blue-600 group-hover:text-white">
            2
          </div>
          <h3 className="mb-2 text-lg font-bold">Brand It Your Way</h3>
          <p className="text-sm text-slate-500">
            Add custom fonts, colors, and videos to match your brand identity
            perfectly.
          </p>
        </div>
        <div className="group cursor-pointer rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition-all hover:bg-white hover:shadow-xl">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white font-bold text-blue-600 shadow-sm transition-colors group-hover:bg-blue-600 group-hover:text-white">
            3
          </div>
          <h3 className="mb-2 text-lg font-bold">Share & Collect</h3>
          <p className="text-sm text-slate-500">
            Embed on your site or share a link. Connect to Zapier, Slack, or
            Sheets.
          </p>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
