const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-background mx-auto min-h-screen w-full max-w-5xl">
      {children}
    </main>
  )
}

export default HomeLayout
