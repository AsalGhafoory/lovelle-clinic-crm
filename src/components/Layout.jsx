import { Link, useLocation } from "react-router-dom";

import { useState } from "react";

import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";

import { signOut } from "firebase/auth";

import { auth } from "../firebase";

export default function Layout({ children }) {

  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {

    try {

      await signOut(auth);

    } catch (error) {

      alert(error.message);

    }

  }

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/"
    },
    {
      label: "Clients",
      icon: Users,
      path: "/clients"
    },
    {
      label: "Appointments",
      icon: Calendar,
      path: "/appointments"
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings"
    }
  ];

  return (

    <div className="min-h-screen bg-[#f7f6f3] text-[#111111]">

      {/* MOBILE TOPBAR */}

      <div
        className="
          lg:hidden
          sticky
          top-0
          z-40
          px-5
          py-5
          border-b
          border-black/[0.04]
          backdrop-blur-2xl
          bg-white/70
        "
      >

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-1">
              Luxury CRM
            </p>

            <h1 className="text-2xl font-semibold tracking-tight">
              Lovelle
            </h1>

          </div>

          <button
            onClick={() => setSidebarOpen(true)}
            className="
              w-11
              h-11
              rounded-2xl
              bg-white
              border
              border-black/[0.05]
              flex
              items-center
              justify-center
              shadow-sm
              hover:shadow-md
            "
          >

            <Menu size={19} />

          </button>

        </div>

      </div>

      <div className="flex">

        {sidebarOpen && (

          <div
            className="
              fixed
              inset-0
              bg-black/30
              backdrop-blur-sm
              z-40
              lg:hidden
            "
            onClick={() => setSidebarOpen(false)}
          />

        )}

        {/* SIDEBAR */}

        <aside
          className={`
            fixed
            top-0
            left-0
            z-50
            h-screen
            w-[290px]
            px-6
            py-6
            transform
            transition-transform
            duration-300
            lg:translate-x-0

            ${sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            }
          `}
        >

          <div
            className="
              h-full
              rounded-[34px]
              border
              border-black/[0.05]
              bg-black/[0.88]
              backdrop-blur-2xl
              text-white
              px-5
              py-6
              flex
              flex-col
              justify-between
              shadow-[0_20px_60px_rgba(0,0,0,0.18)]
            "
          >

            <div>

              {/* HEADER */}

              <div className="flex items-start justify-between mb-14">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 mb-2">
                    Luxury CRM
                  </p>

                  <h1 className="text-[34px] leading-none font-semibold tracking-[-0.05em]">
                    Lovelle
                  </h1>

                </div>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="
                    lg:hidden
                    w-10
                    h-10
                    rounded-2xl
                    bg-white/5
                    flex
                    items-center
                    justify-center
                    hover:bg-white/10
                  "
                >

                  <X size={18} />

                </button>

              </div>

              {/* NAVIGATION */}

              <div className="space-y-2">

                {navItems.map((item) => {

                  const Icon = item.icon;

                  const isActive =
                    location.pathname === item.path;

                  return (

                    <Link
                      to={item.path}
                      key={item.label}
                      onClick={() => setSidebarOpen(false)}
                    >

                      <div
                        className={`
                          group
                          flex
                          items-center
                          gap-4
                          px-4
                          py-4
                          rounded-[22px]
                          transition-all
                          duration-300

                          ${isActive
                            ? `
                              bg-white
                              text-black
                              shadow-[0_10px_30px_rgba(255,255,255,0.08)]
                            `
                            : `
                              text-white/55
                              hover:text-white
                              hover:bg-white/[0.06]
                            `
                          }
                        `}
                      >

                        <div
                          className={`
                            w-10
                            h-10
                            rounded-2xl
                            flex
                            items-center
                            justify-center
                            transition-all

                            ${isActive
                              ? `
                                bg-black/[0.05]
                              `
                              : `
                                bg-white/[0.04]
                                group-hover:bg-white/[0.08]
                              `
                            }
                          `}
                        >

                          <Icon size={18} />

                        </div>

                        <p className="font-medium tracking-[-0.02em]">
                          {item.label}
                        </p>

                      </div>

                    </Link>

                  );

                })}

              </div>

            </div>

            {/* FOOTER */}

            <div className="space-y-4">

              <div
                className="
                  rounded-[26px]
                  border
                  border-white/[0.06]
                  bg-white/[0.04]
                  p-5
                "
              >

                <p className="text-xs uppercase tracking-[0.25em] text-white/35 mb-3">
                  Workspace
                </p>

                <h3 className="text-lg font-semibold tracking-[-0.03em]">
                  Lovelle Premium
                </h3>

                <p className="text-sm text-white/45 mt-2 leading-relaxed">
                  Luxury wellness relationship management platform.
                </p>

              </div>

              <button
                onClick={handleLogout}
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-3
                  rounded-[22px]
                  border
                  border-white/[0.08]
                  px-5
                  py-4
                  text-white/75
                  hover:bg-white/[0.06]
                  hover:text-white
                "
              >

                <LogOut size={18} />

                <span className="font-medium">
                  Logout
                </span>

              </button>

            </div>

          </div>

        </aside>

        {/* PAGE CONTENT */}

        <main className="flex-1 min-w-0 lg:ml-[290px]">

          <div
            className="
              px-5
              py-6
              sm:px-8
              lg:px-12
              lg:py-10
              max-w-[1700px]
            "
          >

            {children}

          </div>

        </main>

      </div>

    </div>

  );

}