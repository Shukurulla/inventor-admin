import React, { useState } from "react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  PlusIcon,
  BuildingOfficeIcon,
  HomeIcon,
  AcademicCapIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { dashboardApi } from "../api/dashboardApi";
import ConfirmationModal from "../components/ConfirmationModal";

const UniversityStructure = () => {
  const { data: buildings = [], isLoading: buildingsLoading } =
    dashboardApi.useGetBuildingsQuery();
  const { data: allFloors = [] } = dashboardApi.useGetAllFloorsQuery();
  const { data: faculties = [] } = dashboardApi.useGetFacultiesQuery();
  const { data: rooms = [] } = dashboardApi.useGetRoomsQuery();

  const [createBuilding] = dashboardApi.useCreateBuildingMutation();
  const [createFloor] = dashboardApi.useCreateFloorMutation();
  const [createFaculty] = dashboardApi.useCreateFacultyMutation();
  const [createRoom] = dashboardApi.useCreateRoomMutation();
  const [updateBuilding] = dashboardApi.useUpdateBuildingMutation();
  const [updateFloor] = dashboardApi.useUpdateFloorMutation();
  const [updateFaculty] = dashboardApi.useUpdateFacultyMutation();
  const [updateRoom] = dashboardApi.useUpdateRoomMutation();
  const [deleteBuilding] = dashboardApi.useDeleteBuildingMutation();
  const [deleteFloor] = dashboardApi.useDeleteFloorMutation();
  const [deleteFaculty] = dashboardApi.useDeleteFacultyMutation();
  const [deleteRoom] = dashboardApi.useDeleteRoomMutation();

  // State for expanded panels
  const [expandedBuildings, setExpandedBuildings] = useState(new Set());
  const [expandedFloors, setExpandedFloors] = useState(new Set());
  const [expandedFaculties, setExpandedFaculties] = useState(new Set());

  // Modal states
  const [modals, setModals] = useState({
    building: { open: false, mode: "create", data: null },
    floor: { open: false, mode: "create", data: null, buildingId: null },
    faculty: { open: false, mode: "create", data: null, buildingId: null },
    room: {
      open: false,
      mode: "create",
      data: null,
      buildingId: null,
      floorId: null,
    },
  });

  // Form states
  const [forms, setForms] = useState({
    building: { name: "", address: "", university: 1 },
    floor: { number: 1, description: "", building: "" },
    faculty: { name: "", building: "" },
    room: { number: "", name: "", is_special: false, building: "", floor: "" },
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

  // Toggle functions
  const toggleBuilding = (buildingId) => {
    const newExpanded = new Set(expandedBuildings);
    if (newExpanded.has(buildingId)) {
      newExpanded.delete(buildingId);
    } else {
      newExpanded.add(buildingId);
    }
    setExpandedBuildings(newExpanded);
  };

  const toggleFloor = (floorId) => {
    const newExpanded = new Set(expandedFloors);
    if (newExpanded.has(floorId)) {
      newExpanded.delete(floorId);
    } else {
      newExpanded.add(floorId);
    }
    setExpandedFloors(newExpanded);
  };

  const toggleFaculty = (facultyId) => {
    const newExpanded = new Set(expandedFaculties);
    if (newExpanded.has(facultyId)) {
      newExpanded.delete(facultyId);
    } else {
      newExpanded.add(facultyId);
    }
    setExpandedFaculties(newExpanded);
  };

  // Modal functions
  const openModal = (
    type,
    mode = "create",
    data = null,
    parentId = null,
    extraId = null
  ) => {
    const modalKey = type;

    if (mode === "edit" && data) {
      if (type === "building") {
        setForms((prev) => ({
          ...prev,
          building: {
            name: data.name,
            address: data.address,
            university: data.university,
          },
        }));
      } else if (type === "floor") {
        setForms((prev) => ({
          ...prev,
          floor: {
            number: data.number,
            description: data.description,
            building: data.building,
          },
        }));
      } else if (type === "faculty") {
        setForms((prev) => ({
          ...prev,
          faculty: { name: data.name, building: data.building },
        }));
      } else if (type === "room") {
        setForms((prev) => ({
          ...prev,
          room: {
            number: data.number,
            name: data.name,
            is_special: data.is_special,
            building: data.building,
            floor: data.floor,
          },
        }));
      }
    } else {
      // Reset form for create mode
      if (type === "floor" && parentId) {
        setForms((prev) => ({
          ...prev,
          floor: { number: 1, description: "", building: parentId },
        }));
      } else if (type === "faculty" && parentId) {
        setForms((prev) => ({
          ...prev,
          faculty: { name: "", building: parentId },
        }));
      } else if (type === "room" && parentId && extraId) {
        setForms((prev) => ({
          ...prev,
          room: {
            number: "",
            name: "",
            is_special: false,
            building: parentId,
            floor: extraId,
          },
        }));
      }
    }

    setModals((prev) => ({
      ...prev,
      [modalKey]: {
        open: true,
        mode,
        data,
        buildingId: parentId,
        floorId: extraId,
      },
    }));
  };

  const closeModal = (type) => {
    setModals((prev) => ({
      ...prev,
      [type]: {
        open: false,
        mode: "create",
        data: null,
        buildingId: null,
        floorId: null,
      },
    }));
  };

  // Handle form submissions
  const handleSubmit = async (type) => {
    try {
      const modal = modals[type];
      const form = forms[type];

      if (modal.mode === "create") {
        if (type === "building") {
          await createBuilding(form).unwrap();
          showNotification("Здание успешно создано!");
        } else if (type === "floor") {
          await createFloor(form).unwrap();
          showNotification("Этаж успешно создан!");
        } else if (type === "faculty") {
          await createFaculty(form).unwrap();
          showNotification("Факультет успешно создан!");
        } else if (type === "room") {
          await createRoom(form).unwrap();
          showNotification("Кабинет успешно создан!");
        }
      } else {
        if (type === "building") {
          await updateBuilding({ id: modal.data.id, ...form }).unwrap();
          showNotification("Здание успешно обновлено!");
        } else if (type === "floor") {
          await updateFloor({ id: modal.data.id, ...form }).unwrap();
          showNotification("Этаж успешно обновлен!");
        } else if (type === "faculty") {
          await updateFaculty({ id: modal.data.id, ...form }).unwrap();
          showNotification("Факультет успешно обновлен!");
        } else if (type === "room") {
          await updateRoom({ id: modal.data.id, ...form }).unwrap();
          showNotification("Кабинет успешно обновлен!");
        }
      }
      closeModal(type);
    } catch (error) {
      showNotification("Ошибка при сохранении", "error");
    }
  };

  // Handle deletions
  const handleDelete = (type, item) => {
    const itemName =
      type === "building"
        ? item.name
        : type === "floor"
        ? `${item.number}-этаж`
        : type === "faculty"
        ? item.name
        : `${item.number} - ${item.name}`;

    showConfirmation(
      `Удаление ${
        type === "building"
          ? "здания"
          : type === "floor"
          ? "этажа"
          : type === "faculty"
          ? "факультета"
          : "кабинета"
      }`,
      `Подтвердить удаление "${itemName}"? Это действие нельзя отменить.`,
      async () => {
        try {
          if (type === "building") {
            await deleteBuilding(item.id).unwrap();
          } else if (type === "floor") {
            await deleteFloor(item.id).unwrap();
          } else if (type === "faculty") {
            await deleteFaculty(item.id).unwrap();
          } else if (type === "room") {
            await deleteRoom(item.id).unwrap();
          }
          showNotification("Успешно удалено!", "info");
        } catch (error) {
          showNotification("Ошибка при удалении", "error");
        }
      }
    );
  };

  // Get related data
  const getFloorsByBuilding = (buildingId) => {
    return allFloors.filter((floor) => floor.building === buildingId);
  };

  const getFacultiesByBuilding = (buildingId) => {
    return faculties.filter((faculty) => faculty.building === buildingId);
  };

  const getRoomsByFloor = (floorId) => {
    return rooms.filter((room) => room.floor === floorId);
  };

  const getRoomsByFaculty = (facultyId, buildingId) => {
    return rooms.filter((room) => {
      const faculty = faculties.find((f) => f.id === facultyId);
      return faculty && room.building === buildingId;
    });
  };

  // Render functions
  const renderActionButtons = (type, item, parentId = null, extraId = null) => (
    <div
      className="flex items-center space-x-2"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => openModal(type, "edit", item)}
        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
        title="Редактировать"
      >
        <PencilIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleDelete(type, item)}
        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
        title="Удалить"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );

  const renderAddButton = (type, text, parentId = null, extraId = null) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        openModal(type, "create", null, parentId, extraId);
      }}
      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
    >
      <PlusIcon className="h-4 w-4" />
      <span>{text}</span>
    </button>
  );

  const renderRooms = (buildingId, floorId) => {
    const roomsData = getRoomsByFloor(floorId);

    if (roomsData.length === 0) {
      return (
        <div className="ml-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">Кабинеты не найдены</p>
            {renderAddButton("room", "Добавить кабинет", buildingId, floorId)}
          </div>
        </div>
      );
    }

    return (
      <div className="ml-8 space-y-2">
        {roomsData.map((room) => (
          <div
            key={room.id}
            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <HomeIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {room.number} - {room.name}
                </div>
                <div className="text-sm text-gray-500">
                  {room.is_special ? "Специальный кабинет" : "Обычный кабинет"}
                </div>
              </div>
            </div>
            {renderActionButtons("room", room, buildingId, floorId)}
          </div>
        ))}
        <div className="pt-2">
          {renderAddButton("room", "Добавить кабинет", buildingId, floorId)}
        </div>
      </div>
    );
  };

  const renderFaculties = (buildingId) => {
    const facultiesData = getFacultiesByBuilding(buildingId);

    if (facultiesData.length === 0) {
      return (
        <div className="ml-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">Факультеты не найдены</p>
            {renderAddButton("faculty", "Добавить факультет", buildingId)}
          </div>
        </div>
      );
    }

    return (
      <div className="ml-6 space-y-2">
        {facultiesData.map((faculty) => (
          <div
            key={faculty.id}
            className="border border-gray-200 rounded-lg bg-white"
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleFaculty(faculty.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {expandedFaculties.has(faculty.id) ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                  )}
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <AcademicCapIcon className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="font-medium text-gray-900">{faculty.name}</div>
              </div>
              {renderActionButtons("faculty", faculty, buildingId)}
            </div>

            {expandedFaculties.has(faculty.id) && (
              <div className="pb-4">
                <div className="ml-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">
                    Кабинеты факультета будут отображаться здесь
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="pt-2">
          {renderAddButton("faculty", "Добавить факультет", buildingId)}
        </div>
      </div>
    );
  };

  const renderFloors = (buildingId) => {
    const floorsData = getFloorsByBuilding(buildingId);

    if (floorsData.length === 0) {
      return (
        <div className="ml-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">Этажи не найдены</p>
            {renderAddButton("floor", "Добавить этаж", buildingId)}
          </div>
        </div>
      );
    }

    return (
      <div className="ml-6 space-y-2">
        {floorsData.map((floor) => (
          <div
            key={floor.id}
            className="border border-gray-200 rounded-lg bg-white"
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleFloor(floor.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {expandedFloors.has(floor.id) ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                  )}
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <HomeIcon className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {floor.number}-этаж
                  </div>
                  {floor.description && (
                    <div className="text-sm text-gray-500">
                      {floor.description}
                    </div>
                  )}
                </div>
              </div>
              {renderActionButtons("floor", floor, buildingId)}
            </div>

            {expandedFloors.has(floor.id) && (
              <div className="pb-4">{renderRooms(buildingId, floor.id)}</div>
            )}
          </div>
        ))}
        <div className="pt-2">
          {renderAddButton("floor", "Добавить этаж", buildingId)}
        </div>
      </div>
    );
  };

  const renderModal = (type) => {
    const modal = modals[type];
    const form = forms[type];

    if (!modal.open) return null;

    const titles = {
      building:
        modal.mode === "create" ? "Создать здание" : "Редактировать здание",
      floor: modal.mode === "create" ? "Создать этаж" : "Редактировать этаж",
      faculty:
        modal.mode === "create"
          ? "Создать факультет"
          : "Редактировать факультет",
      room:
        modal.mode === "create" ? "Создать кабинет" : "Редактировать кабинет",
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={() => closeModal(type)}
          />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(type);
              }}
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {titles[type]}
                </h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                {type === "building" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Название здания *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForms((prev) => ({
                            ...prev,
                            building: {
                              ...prev.building,
                              name: e.target.value,
                            },
                          }))
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
                        value={form.address}
                        onChange={(e) =>
                          setForms((prev) => ({
                            ...prev,
                            building: {
                              ...prev.building,
                              address: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Введите адрес здания"
                      />
                    </div>
                  </>
                )}

                {type === "floor" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Номер этажа *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={form.number}
                        onChange={(e) =>
                          setForms((prev) => ({
                            ...prev,
                            floor: {
                              ...prev.floor,
                              number: parseInt(e.target.value) || 1,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Описание
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) =>
                          setForms((prev) => ({
                            ...prev,
                            floor: {
                              ...prev.floor,
                              description: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        rows="3"
                        placeholder="Дополнительная информация об этаже"
                      />
                    </div>
                  </>
                )}

                {type === "faculty" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Название факультета *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForms((prev) => ({
                          ...prev,
                          faculty: { ...prev.faculty, name: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Введите название факультета"
                    />
                  </div>
                )}

                {type === "room" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Номер кабинета *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.number}
                        onChange={(e) =>
                          setForms((prev) => ({
                            ...prev,
                            room: { ...prev.room, number: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Например: 101, A-205"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Название кабинета *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForms((prev) => ({
                            ...prev,
                            room: { ...prev.room, name: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Например: Компьютерный класс"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_special"
                        checked={form.is_special}
                        onChange={(e) =>
                          setForms((prev) => ({
                            ...prev,
                            room: {
                              ...prev.room,
                              is_special: e.target.checked,
                            },
                          }))
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="is_special"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Специальный кабинет
                      </label>
                    </div>
                  </>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => closeModal(type)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Отменить
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  {modal.mode === "create" ? "Создать" : "Сохранить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (buildingsLoading) {
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
            Структура университета
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Управление зданиями, этажами, факультетами и кабинетами
          </p>
        </div>
        {renderAddButton("building", "Добавить здание")}
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

      {/* Main Content */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
        {buildings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">Здания не найдены</div>
            {renderAddButton("building", "Создать первое здание")}
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {buildings.map((building) => (
              <div
                key={building.id}
                className="border border-gray-200 rounded-lg bg-white"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleBuilding(building.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {expandedBuildings.has(building.id) ? (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                      )}
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-gray-900">
                        {building.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {building.address}
                      </div>
                    </div>
                  </div>
                  {renderActionButtons("building", building)}
                </div>

                {expandedBuildings.has(building.id) && (
                  <div className="pb-4">
                    <div className="border-t border-gray-100 pt-4">
                      {/* Tabs for Floors and Faculties */}
                      <div className="px-4 mb-4">
                        <div className="border-b border-gray-200">
                          <nav className="-mb-px flex space-x-8">
                            <button className="py-2 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
                              Этажи и кабинеты
                            </button>
                          </nav>
                        </div>
                      </div>

                      {/* Floors Section */}
                      <div className="px-4">{renderFloors(building.id)}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {renderModal("building")}
      {renderModal("floor")}
      {renderModal("faculty")}
      {renderModal("room")}

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

export default UniversityStructure;
