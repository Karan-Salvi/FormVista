const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-background mx-auto min-h-screen w-full max-w-5xl px-2 sm:px-0">
      {children}
    </main>
  )
}

export default HomeLayout
