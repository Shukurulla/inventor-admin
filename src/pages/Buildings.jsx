// pages/Buildings.jsx
import React, { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { dashboardApi } from "../api/dashboardApi";

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

  const handleBuildingSubmit = async (e) => {
    e.preventDefault();
    try {
      if (buildingModal.mode === "create") {
        await createBuilding(buildingForm).unwrap();
        showNotification("Здание создано успешно!");
      } else {
        await updateBuilding({
          id: buildingModal.data.id,
          ...buildingForm,
        }).unwrap();
        showNotification("Здание обновлено успешно!");
      }
      setBuildingModal({ open: false, mode: "create", data: null });
      setBuildingForm({ name: "", address: "", university: 1 });
    } catch (error) {
      showNotification("Ошибка при сохранении", "error");
    }
  };

  const handleBuildingDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить это здание?")) return;

    try {
      await deleteBuilding(id).unwrap();
      showNotification("Здание удалено!", "info");
    } catch (error) {
      showNotification("Ошибка при удалении", "error");
    }
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
            Управляйте зданиями университета
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
                        onClick={() => handleBuildingDelete(building.id)}
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
                    Отмена
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
    </div>
  );
};

export default Buildings;
