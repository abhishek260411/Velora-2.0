import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-white min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-10">
                {children}
            </main>
        </div>
    );
}
