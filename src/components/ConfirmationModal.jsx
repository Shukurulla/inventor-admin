// components/ConfirmationModal.jsx
import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "danger",
  confirmText,
  cancelText = "Bekor qilish",
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonBg: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      defaultConfirmText: "O'chirish",
    },
    warning: {
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      buttonBg: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
      defaultConfirmText: "Ha, davom etish",
    },
    info: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonBg: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      defaultConfirmText: "Tasdiqlash",
    },
    success: {
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      buttonBg: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
      defaultConfirmText: "Tasdiqlash",
    },
  };

  const currentStyle = typeStyles[type] || typeStyles.danger;
  const finalConfirmText = confirmText || currentStyle.defaultConfirmText;

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
              {finalConfirmText}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
