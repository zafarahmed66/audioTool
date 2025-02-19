import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

import Navbar from "./navbar";
import { AudioContextProvider } from "@/context/audio-context";

export default function Layout() {
  return (
    <AudioContextProvider>
      <div className="max-w-full md:max-w-2xl lg:max-w-7xl mx-auto px-4">
        <Navbar />
        <Outlet />
        <Toaster richColors />
      </div>
    </AudioContextProvider>
  );
}
