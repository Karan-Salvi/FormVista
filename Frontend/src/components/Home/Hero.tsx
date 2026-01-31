import AI from "@/svgs/AI";
import Analytics from "@/svgs/Analytics";
import DragArrow from "@/svgs/DragArrow";
import Theme from "@/svgs/Theme";

const Hero = () => {
  return (
    <>
      <section className="max-w-7xl w-full mx-auto px-6 pt-28 pb-16 text-center relative">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-8">
          <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
            New Feature{" "}
          </span>
          <span className="text-blue-700 text-xs font-bold">
            AI Form Generation is now live!
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
          Stop Building{" "}
          <span className="text-slate-400 line-through decoration-blue-500/30">
            Boring
          </span>{" "}
          Forms. <br />
          <span className="text-blue-600"> Create Experiences. </span>
        </h1>

        <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-10">
          Turn every form into a powerful interaction that captures attention,
          increases submissions, and drives real results.
        </p>

        <div className="flex flex-col items-center gap-6">
          <button className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl shadow-blue-300 hover:scale-105 transition-transform flex items-center gap-3">
            Build your first form
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </button>

          <div className="flex flex-col items-center gap-3">
            <p className="text-[13px] text-slate-500 font-medium">
              No credit card required • Unlimited free forms
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-16">
          <div className="glass-card px-5 py-2.5 rounded-xl flex items-center gap-2 text-[12px] font-bold text-slate-600 shadow-sm animate-float">
            <Theme />
            10+ Custom Themes
          </div>
          <div
            className="glass-card px-5 py-2.5 rounded-xl gap-1 text-[12px] font-bold text-slate-600 shadow-sm animate-float inline-flex justify-center items-center"
            style={{ animationDelay: "1s" }}
          >
            <AI />
            AI-Powered Logic
          </div>
          <div
            className="glass-card px-5 py-2.5 rounded-xl flex items-center gap-2 text-[12px] font-bold text-slate-600 shadow-sm animate-float"
            style={{ animationDelay: "2s" }}
          >
            <Analytics />
            Real-time Analytics
          </div>
        </div>
        <div className="absolute bottom-56 right-10 animate-float hidden lg:block animate-float">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4 rounded-3xl shadow-2xl flex flex-col items-center">
            <span className="text-3xl font-black">+45%</span>
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">
              Avg. Completion
            </span>
          </div>
        </div>

        <div className="absolute bottom-56 left-5 lg:left-20 animate-float hidden lg:block">
          <div className="bg-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white text-xs shadow-sm">
                  S
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-400 flex items-center justify-center text-white text-xs shadow-sm">
                  N
                </div>
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-xs shadow-sm">
                  Z
                </div>
              </div>
              <div className="h-4 w-px bg-slate-200"></div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter">
                Syncing Data...
              </p>
            </div>
          </div>
        </div>

        <div className="absolute top-44 right-44 animate-drift hidden lg:flex items-center gap-2 pointer-events-none">
          <DragArrow />
          <div className="bg-blue-600 text-white px-3 py-1 rounded-md text-[10px] font-medium shadow-lg">
            Drag "Multi-Select"
          </div>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-xl animate-scale-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
              <span className="ml-4 text-xs text-muted-foreground">
                FormVista.app/builder
              </span>
            </div>
            <div className="p-8 bg-gradient-to-b from-card to-secondary/20 min-h-[400px]">
              <div className="max-w-lg mx-auto space-y-6">
                <div className="space-y-2">
                  <div className="h-10 w-3/4 bg-foreground/10 rounded-lg" />
                  <div className="h-4 w-full bg-muted-foreground/10 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-foreground/10 rounded" />
                  <div className="h-11 w-full bg-background border border-border rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-foreground/10 rounded" />
                  <div className="h-11 w-full bg-background border border-border rounded-lg" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-48 bg-foreground/10 rounded" />
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-primary" />
                    <div className="h-4 w-24 bg-muted-foreground/10 rounded" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-border" />
                    <div className="h-4 w-20 bg-muted-foreground/10 rounded" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-border" />
                    <div className="h-4 w-28 bg-muted-foreground/10 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
