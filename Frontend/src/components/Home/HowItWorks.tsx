const HowItWorks = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <div className="inline-block bg-blue-50 text-blue-600 text-[11px] font-extrabold px-3 py-1 rounded-full border border-blue-100 mb-4">
          THE PROCESS
        </div>
        <h2 className="text-4xl font-extrabold">
          3 Steps to <span className="text-blue-600">Create Beautiful</span>{" "}
          Form
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-slate-50/50 p-8 rounded-3xl border border-dashed border-slate-200 text-center hover:bg-white hover:shadow-xl transition-all group cursor-pointer">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
            1
          </div>
          <h3 className="font-bold text-lg mb-2">Drag & Drop Blocks</h3>
          <p className="text-slate-500 text-sm">
            Choose from 20+ question types including file uploads and payments.
          </p>
        </div>
        <div className="bg-slate-50/50 p-8 rounded-3xl border border-dashed border-slate-200 text-center hover:bg-white hover:shadow-xl transition-all group cursor-pointer">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
            2
          </div>
          <h3 className="font-bold text-lg mb-2">Brand It Your Way</h3>
          <p className="text-slate-500 text-sm">
            Add custom fonts, colors, and videos to match your brand identity
            perfectly.
          </p>
        </div>
        <div className="bg-slate-50/50 p-8 rounded-3xl border border-dashed border-slate-200 text-center hover:bg-white hover:shadow-xl transition-all group cursor-pointer">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
            3
          </div>
          <h3 className="font-bold text-lg mb-2">Share & Collect</h3>
          <p className="text-slate-500 text-sm">
            Embed on your site or share a link. Connect to Zapier, Slack, or
            Sheets.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
