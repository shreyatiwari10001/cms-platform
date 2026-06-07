import TopBar from "@/components/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
  <TopBar />

  <main className="bg-blue-50 p-8">
    {children}
  </main>
</div>
  );
}