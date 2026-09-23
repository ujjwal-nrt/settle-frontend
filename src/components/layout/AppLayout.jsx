

import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="app-main">

        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="app-content">
          <Outlet />
        </main>
         <BottomNav />

      </div>

    </div>
  );
}