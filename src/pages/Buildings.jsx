// pages/Buildings.jsx
import React, { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { dashboardApi } from "../api/dashboardApi";

// Confirmation Modal компонент
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
      buttonText: "Удалить",
    },
    warning: {
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      buttonBg: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
      buttonText: "Да, продолжить",
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
              Отменить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Buildings = () => {
  const { data: buildings = [], isLoading } =
    dashboardApi.useGetBuildingsQuery();
  const [createBuilding] = dashboardApi.useCreateBuildingMutation();
  const [updateBuilding] = dashboardApi.useUpdateBuildingMutation();
  const [deleteBuilding] = dashboardApi.useDeleteBuildingMutation();

  const [buildingModal, setBuildingModal] = useState({
    open: false,
    mode: "create",
    data: null,
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [buildingForm, setBuildingForm] = useState({
    name: "",
    address: "",
    university: 1,
  });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const showConfirmation = (title, message, onConfirm) => {
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
        });
      },
    });
  };

  const closeConfirmation = () => {
    setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null });
  };

  const handleBuildingSubmit = async (e) => {
    e.preventDefault();
    try {
      if (buildingModal.mode === "create") {
        await createBuilding(buildingForm).unwrap();
        showNotification("Здание успешно создано!");
      } else {
        await updateBuilding({
          id: buildingModal.data.id,
          ...buildingForm,
        }).unwrap();
        showNotification("Здание успешно обновлено!");
      }
      setBuildingModal({ open: false, mode: "create", data: null });
      setBuildingForm({ name: "", address: "", university: 1 });
    } catch (error) {
      showNotification("Ошибка при сохранении", "error");
    }
  };

  const handleBuildingDelete = async (building) => {
    showConfirmation(
      "Удаление здания",
      `Подтвердить удаление здания "${building.name}"? Это действие нельзя отменить.`,
      async () => {
        try {
          await deleteBuilding(building.id).unwrap();
          showNotification("Здание удалено!", "info");
        } catch (error) {
          showNotification("Ошибка при удалении", "error");
        }
      }
    );
  };

  const openBuildingModal = (mode, building = null) => {
    if (mode === "edit" && building) {
      setBuildingForm({
        name: building.name,
        address: building.address,
        university: building.university,
      });
    } else {
      setBuildingForm({ name: "", address: "", university: 1 });
    }
    setBuildingModal({ open: true, mode, data: building });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Управление зданиями
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Управление зданиями университета
          </p>
        </div>
        <button
          onClick={() => openBuildingModal("create")}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Добавить здание
        </button>
      </div>

      {/* Notification */}
      {notification.show && (
        <div
          className={`rounded-lg p-4 ${
            notification.type === "error"
              ? "bg-red-50 border border-red-200"
              : notification.type === "info"
              ? "bg-blue-50 border border-blue-200"
              : "bg-green-50 border border-green-200"
          }`}
        >
          <p
            className={`text-sm ${
              notification.type === "error"
                ? "text-red-800"
                : notification.type === "info"
                ? "text-blue-800"
                : "text-green-800"
            }`}
          >
            {notification.message}
          </p>
        </div>
      )}

      {/* Buildings Table */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Адрес
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {buildings.map((building) => (
                <tr
                  key={building.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {building.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {building.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openBuildingModal("edit", building)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                        title="Редактировать"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleBuildingDelete(building)}
                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                        title="Удалить"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Building Modal */}
      {buildingModal.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() =>
                setBuildingModal({ ...buildingModal, open: false })
              }
            ></div>
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
              <form onSubmit={handleBuildingSubmit}>
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {buildingModal.mode === "create"
                      ? "Создать здание"
                      : "Редактировать здание"}
                  </h3>
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Название здания *
                    </label>
                    <input
                      type="text"
                      required
                      value={buildingForm.name}
                      onChange={(e) =>
                        setBuildingForm({
                          ...buildingForm,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Введите название здания"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Адрес *
                    </label>
                    <input
                      type="text"
                      required
                      value={buildingForm.address}
                      onChange={(e) =>
                        setBuildingForm({
                          ...buildingForm,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Введите адрес здания"
                    />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() =>
                      setBuildingModal({ ...buildingModal, open: false })
                    }
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Отменить
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    {buildingModal.mode === "create" ? "Создать" : "Сохранить"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type="danger"
      />
    </div>
  );
};

export default Buildings;
