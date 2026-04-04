import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";
import AppInit from "./AppInit";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen w-full bg-stone-950 overflow-hidden">
      <AppInit/>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#18181b",
            color: "#fff",
            border: "1px solid #27272a",
          },
        }}
      />

      <div className=" md:flex md:w-64 md:flex-shrink-0 md:h-screen border-r border-zinc-800">
        <Sidebar />
      </div>

      <div className="flex-1 relative overflow-y-auto overflow-x-hidden h-screen">

        
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute right-[-100px] bottom-[-100px]">
            <div className="h-[350px] w-[350px] md:h-[420px] md:w-[420px] rounded-full bg-indigo-500/20 blur-[120px]" />
            <div className="absolute top-10 left-10 h-[200px] w-[200px] rounded-full bg-indigo-400/20 blur-[90px]" />
          </div>
        </div>

        
        <div className="relative z-10 px-3 md:px-8 md:pb-0 md:py-0 py-6 pb-20 w-full md:overflow-hidden">
          {children}
        </div>

      </div>
    </div>
  );
}