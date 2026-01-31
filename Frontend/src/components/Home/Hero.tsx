import AI from '@/svgs/AI'
import Analytics from '@/svgs/Analytics'
import DragArrow from '@/svgs/DragArrow'
import Theme from '@/svgs/Theme'

const Hero = () => {
  return (
    <>
      <section className="relative mx-auto w-full pt-16 pb-16 text-center sm:px-6 sm:pt-28">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5">
          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[6px] font-extrabold text-nowrap text-white uppercase sm:text-[10px]">
            New Feature{' '}
          </span>
          <span className="text-xs font-bold text-nowrap text-blue-700">
            AI Form Generation is now live!
          </span>
        </div>

        <h1 className="mb-6 text-3xl leading-[1.1] font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-7xl">
          Stop Building{' '}
          <span className="text-slate-400 line-through decoration-blue-500/30">
            Boring
          </span>{' '}
          Forms. <br />
          <span className="text-blue-600"> Create Experiences. </span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-sm leading-relaxed text-slate-500 md:text-base">
          Turn every form into a powerful interaction that captures attention,
          increases submissions, and drives real results.
        </p>

        <div className="flex flex-col items-center gap-6">
          <button className="flex cursor-pointer items-center gap-3 rounded-full bg-blue-600 px-6 py-2 text-lg font-bold text-white shadow-2xl shadow-blue-300 transition-transform hover:scale-105 sm:px-10 sm:py-4">
            Build your first form
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
            <p className="text-[13px] font-medium text-slate-500">
              No credit card required • Unlimited free forms
            </p>
          </div>
        </div>

        <div className="mt-16 hidden flex-wrap justify-center gap-4 sm:flex">
          <div className="glass-card animate-float flex items-center gap-2 rounded-xl px-5 py-2.5 text-[12px] font-bold text-slate-600 shadow-sm">
            <Theme />
            10+ Custom Themes
          </div>
          <div
            className="glass-card animate-float inline-flex items-center justify-center gap-1 rounded-xl px-5 py-2.5 text-[12px] font-bold text-slate-600 shadow-sm"
            style={{ animationDelay: '1s' }}
          >
            <AI />
            AI-Powered Logic
          </div>
          <div
            className="glass-card animate-float flex items-center gap-2 rounded-xl px-5 py-2.5 text-[12px] font-bold text-slate-600 shadow-sm"
            style={{ animationDelay: '2s' }}
          >
            <Analytics />
            Real-time Analytics
          </div>
        </div>
        <div className="animate-float animate-float absolute right-10 bottom-56 hidden lg:block">
          <div className="flex flex-col items-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white shadow-2xl">
            <span className="text-3xl font-black">+45%</span>
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">
              Avg. Completion
            </span>
          </div>
        </div>

        <div className="animate-float absolute bottom-56 left-5 hidden lg:left-20 lg:block">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)]">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-xs text-white shadow-sm">
                  S
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400 text-xs text-white shadow-sm">
                  N
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-xs text-white shadow-sm">
                  Z
                </div>
              </div>
              <div className="h-4 w-px bg-slate-200"></div>
              <p className="text-[10px] font-bold tracking-tighter text-slate-400 uppercase">
                Syncing Data...
              </p>
            </div>
          </div>
        </div>

        <div className="animate-drift pointer-events-none absolute top-44 right-44 hidden items-center gap-2 lg:flex">
          <DragArrow />
          <div className="rounded-md bg-blue-600 px-3 py-1 text-[10px] font-medium text-white shadow-lg">
            Drag "Multi-Select"
          </div>
        </div>
      </section>

      <section className="w-full sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-5xl">
          <div
            className="border-border bg-card animate-scale-in relative overflow-hidden rounded-2xl border shadow-xl"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="border-border bg-muted/50 flex items-center gap-2 border-b px-4 py-3">
              <div className="bg-destructive/60 h-3 w-3 rounded-full" />
              <div className="bg-warning/60 h-3 w-3 rounded-full" />
              <div className="bg-success/60 h-3 w-3 rounded-full" />
              <span className="text-muted-foreground ml-4 text-xs">
                formvista.app/builder
              </span>
            </div>
            <div className="from-card to-secondary/20 min-h-[400px] bg-gradient-to-b p-8">
              <div className="mx-auto max-w-lg space-y-6">
                <div className="space-y-2">
                  <div className="bg-foreground/10 h-10 w-3/4 rounded-lg" />
                  <div className="bg-muted-foreground/10 h-4 w-full rounded" />
                </div>
                <div className="space-y-2">
                  <div className="bg-foreground/10 h-4 w-32 rounded" />
                  <div className="bg-background border-border h-11 w-full rounded-lg border" />
                </div>
                <div className="space-y-2">
                  <div className="bg-foreground/10 h-4 w-40 rounded" />
                  <div className="bg-background border-border h-11 w-full rounded-lg border" />
                </div>
                <div className="space-y-3">
                  <div className="bg-foreground/10 h-4 w-48 rounded" />
                  <div className="flex items-center gap-3">
                    <div className="border-primary h-5 w-5 rounded-full border-2" />
                    <div className="bg-muted-foreground/10 h-4 w-24 rounded" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="border-border h-5 w-5 rounded-full border-2" />
                    <div className="bg-muted-foreground/10 h-4 w-20 rounded" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="border-border h-5 w-5 rounded-full border-2" />
                    <div className="bg-muted-foreground/10 h-4 w-28 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero
