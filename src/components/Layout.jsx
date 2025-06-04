// components/Layout.jsx
import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  ChartBarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// Confirmation Modal komponenti
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "danger",
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonBg: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      buttonText: "Tasdiqlash",
    },
    warning: {
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      buttonBg: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
      buttonText: "Ha, davom etish",
    },
    info: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonBg: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      buttonText: "Tasdiqlash",
    },
  };

  const currentStyle = typeStyles[type] || typeStyles.danger;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all">
          <div className="px-6 py-6">
            <div className="flex items-center">
              <div
                className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${currentStyle.iconBg}`}
              >
                <ExclamationTriangleIcon
                  className={`h-6 w-6 ${currentStyle.iconColor}`}
                  aria-hidden="true"
                />
              </div>
              <div className="ml-4 text-left">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-xl">
            <button
              type="button"
              onClick={onConfirm}
              className={`inline-flex justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${currentStyle.buttonBg}`}
            >
              {currentStyle.buttonText}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "danger",
  });

  const menuItems = [
    { path: "/dashboard", text: "Boshqaruv paneli", icon: ChartBarIcon },
    { path: "/users", text: "Foydalanuvchilar", icon: UsersIcon },
    { path: "/buildings", text: "Binolar", icon: BuildingOfficeIcon },
    { path: "/floors", text: "Qavatlar", icon: HomeIcon },
    { path: "/faculties", text: "Fakultetlar", icon: AcademicCapIcon },
    { path: "/rooms", text: "Xonalar", icon: HomeIcon },
  ];

  const showConfirmation = (title, message, onConfirm, type = "danger") => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal({
          isOpen: false,
          title: "",
          message: "",
          onConfirm: null,
          type: "danger",
        });
      },
      type,
    });
  };

  const closeConfirmation = () => {
    setConfirmModal({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
      type: "danger",
    });
  };

  const handleLogout = () => {
    showConfirmation(
      "Chiqish tasdiqi",
      "Haqiqatan ham tizimdan chiqmoqchimisiz?",
      () => {
        dispatch({ type: "auth/logout" });
        navigate("/login");
      },
      "warning"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar для десктопа */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">IM</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                InventMaster
              </span>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={item.path}>
                        <button
                          onClick={() => navigate(item.path)}
                          className={`
                            group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full transition-all duration-200
                            ${
                              isActive
                                ? "bg-gray-50 text-blue-600 border-r-2 border-blue-600"
                                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                            }
                          `}
                        >
                          <item.icon
                            className={`h-6 w-6 shrink-0 ${
                              isActive
                                ? "text-blue-600"
                                : "text-gray-400 group-hover:text-blue-600"
                            }`}
                            aria-hidden="true"
                          />
                          {item.text}
                          {isActive && (
                            <ChevronRightIcon className="ml-auto h-5 w-5 text-blue-600" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Sidebar для мобильных устройств */}
      <div className={`relative z-50 lg:hidden ${sidebarOpen ? "" : "hidden"}`}>
        <div
          className="fixed inset-0 bg-gray-900/80"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button
                type="button"
                className="-m-2.5 p-2.5"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">IM</span>
                  </div>
                  <span className="ml-3 text-xl font-bold text-gray-900">
                    InventMaster
                  </span>
                </div>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <li key={item.path}>
                            <button
                              onClick={() => {
                                navigate(item.path);
                                setSidebarOpen(false);
                              }}
                              className={`
                                group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full
                                ${
                                  isActive
                                    ? "bg-gray-50 text-blue-600"
                                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                }
                              `}
                            >
                              <item.icon
                                className={`h-6 w-6 shrink-0 ${
                                  isActive
                                    ? "text-blue-600"
                                    : "text-gray-400 group-hover:text-blue-600"
                                }`}
                              />
                              {item.text}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="h-6 w-px bg-gray-200 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <h1 className="text-lg font-semibold text-gray-900">
                {menuItems.find((item) => item.path === location.pathname)
                  ?.text || "Boshqaruv paneli"}
              </h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Profile dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="-m-1.5 flex items-center p-1.5"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <span className="sr-only">
                    Foydalanuvchi menyusini ochish
                  </span>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">A</span>
                  </div>
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-4 text-sm font-semibold leading-6 text-gray-900">
                      Administrator
                    </span>
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50 items-center"
                    >
                      <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                      Tizimdan chiqish
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:pl-72">
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />
    </div>
  );
};

export default Layout;
