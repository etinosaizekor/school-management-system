import { ReactNode } from "react";
import Appbar from "./Appbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-red-500">
      <Sidebar />
      <section className="bg-gray-100 h-screen w-full flex flex-col">
        <Appbar />
        <main className="flex-1 ml-56 w-[calc(100%-15rem)]">{children}</main>
        <Footer />
      </section>
    </div>
  );
}
