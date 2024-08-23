import Appbar from "./Appbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-screen bg-red-500">
      <Sidebar />
      <section className="bg-gray-100 h-screen w-full">
        <Appbar />
        <main className="h-[calc(100%-9rem)] ml-56 w-[calc(100%-15rem)]">
          <Outlet />
        </main>
      </section>
    </div>
  );
}
