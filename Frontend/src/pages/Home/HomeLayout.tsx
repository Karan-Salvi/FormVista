const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full min-h-screen bg-background max-w-5xl mx-auto">
      {children}
    </main>
  );
};

export default HomeLayout;
