import Appbar from "./Appbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-screen bg-red-500">
      <Sidebar />
      <section className="bg-orange-400 h-screen w-full">
        <Appbar />
        <Outlet/>
      </section>
    </div>
  );
}
