// src/pages/AdminEquipmentPage.jsx - RTK Query version
import { useState } from "react";
import {
  Card,
  Collapse,
  Button,
  Badge,
  Empty,
  Modal,
  message,
  Select,
  Pagination,
} from "antd";
import {
  FiChevronRight,
  FiTrash2,
  FiEdit,
  FiFilter,
  FiEye,
  FiMapPin,
} from "react-icons/fi";
import {
  dashboardApi,
  useGetEquipmentQuery,
  useGetBuildingsQuery,
  useGetRoomsQuery,
  useGetEquipmentTypesQuery,
  useGetUsersQuery,
  useDeleteEquipmentMutation,
} from "../api/dashboardApi";

const { Panel } = Collapse;
const { Option } = Select;

// Status utilities (create this file if not exists)
const getStatusText = (status) => {
  switch (status) {
    case "NEW":
      return "Новое";
    case "WORKING":
      return "Работает";
    case "NEEDS_REPAIR":
      return "Требует ремонта";
    case "DISPOSED":
      return "Утилизировано";
    default:
      return status;
  }
};

const getStatusConfig = (status) => {
  switch (status) {
    case "NEW":
      return {
        text: "Новое",
        color: "#1e40af",
        bgColor: "#dbeafe",
        borderColor: "#93c5fd",
      };
    case "WORKING":
      return {
        text: "Работает",
        color: "#059669",
        bgColor: "#d1fae5",
        borderColor: "#6ee7b7",
      };
    case "NEEDS_REPAIR":
      return {
        text: "Требует ремонта",
        color: "#d97706",
        bgColor: "#fef3c7",
        borderColor: "#fcd34d",
      };
    case "DISPOSED":
      return {
        text: "Утилизировано",
        color: "#dc2626",
        bgColor: "#fee2e2",
        borderColor: "#fca5a5",
      };
    default:
      return {
        text: status,
        color: "#6b7280",
        bgColor: "#f3f4f6",
        borderColor: "#d1d5db",
      };
  }
};

// Equipment Icon Component
const EquipmentIcon = ({ type, className = "text-lg" }) => {
  const getIcon = () => {
    const typeLower = type?.toLowerCase() || "";

    if (typeLower.includes("проектор")) {
      return "📽️";
    }
    if (typeLower.includes("компьютер")) {
      return "💻";
    }
    if (typeLower.includes("принтер")) {
      return "🖨️";
    }
    if (typeLower.includes("монитор")) {
      return "🖥️";
    }
    if (typeLower.includes("телевизор")) {
      return "📺";
    }
    if (typeLower.includes("роутер") || typeLower.includes("router")) {
      return "📡";
    }
    if (typeLower.includes("ноутбук")) {
      return "💻";
    }
    if (typeLower.includes("моноблок")) {
      return "🖥️";
    }
    if (typeLower.includes("доска") || typeLower.includes("электронная")) {
      return "📋";
    }
    if (typeLower.includes("удлинитель") || typeLower.includes("extender")) {
      return "🔌";
    }

    return "⚙️";
  };

  return <span className={className}>{getIcon()}</span>;
};

const AdminEquipmentPage = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [filters, setFilters] = useState({
    building_id: null,
    room_id: null,
    type_id: null,
    status: null,
    author_id: null,
  });

  // Pagination states for each type
  const [paginationByType, setPaginationByType] = useState({});
  const [pageSize] = useState(5);

  // RTK Query hooks
  const { data: equipment = [], isLoading: equipmentLoading } =
    useGetEquipmentQuery(filters);
  const { data: buildings = [] } = useGetBuildingsQuery();
  const { data: rooms = [] } = useGetRoomsQuery();
  const { data: equipmentTypes = [] } = useGetEquipmentTypesQuery();
  const { data: users = [] } = useGetUsersQuery();
  const [deleteEquipment] = useDeleteEquipmentMutation();

  // Get all equipment (ensure it's an array)
  const getAllEquipment = () => {
    // Handle different response structures
    let equipmentArray = [];

    if (Array.isArray(equipment)) {
      equipmentArray = equipment;
    } else if (equipment.results && Array.isArray(equipment.results)) {
      equipmentArray = equipment.results;
    } else if (equipment.data && Array.isArray(equipment.data)) {
      equipmentArray = equipment.data;
    }

    return equipmentArray.filter(
      (item) =>
        item &&
        typeof item === "object" &&
        item.id &&
        (item.name || item.type_data || item.type)
    );
  };

  const groupEquipmentByType = () => {
    const validEquipment = getAllEquipment();
    let filteredEquipment = [...validEquipment];

    // Apply filters (RTK Query will handle most filtering, but we can do client-side filtering too)
    if (filters.building_id) {
      filteredEquipment = filteredEquipment.filter(
        (item) => item.room_data?.building === filters.building_id
      );
    }
    if (filters.room_id) {
      filteredEquipment = filteredEquipment.filter(
        (item) => item.room_data?.id === filters.room_id
      );
    }
    if (filters.type_id) {
      filteredEquipment = filteredEquipment.filter(
        (item) => (item.type_data?.id || item.type) === filters.type_id
      );
    }
    if (filters.status) {
      filteredEquipment = filteredEquipment.filter(
        (item) => item.status === filters.status
      );
    }
    if (filters.author_id) {
      filteredEquipment = filteredEquipment.filter(
        (item) => item.author?.id === filters.author_id
      );
    }

    const grouped = {};
    filteredEquipment.forEach((item) => {
      const typeName =
        item.type_data?.name ||
        equipmentTypes.find((t) => t.id === item.type)?.name ||
        "Неизвестный тип";
      if (!grouped[typeName]) {
        grouped[typeName] = [];
      }
      grouped[typeName].push(item);
    });

    return grouped;
  };

  // Get paginated items for specific type
  const getPaginatedItemsForType = (typeName, items) => {
    const currentPage = paginationByType[typeName] || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      paginatedItems: items.slice(startIndex, endIndex),
      totalItems: items.length,
      currentPage,
    };
  };

  // Handle pagination change for specific type
  const handlePageChangeForType = (typeName, page) => {
    setPaginationByType((prev) => ({
      ...prev,
      [typeName]: page,
    }));
  };

  // Handle view button click
  const handleView = (equipment) => {
    setSelectedEquipment(equipment);
    setDetailModalVisible(true);
  };

  // Handle detail modal close
  const handleDetailModalClose = () => {
    setDetailModalVisible(false);
    setSelectedEquipment(null);
  };

  // Handle delete confirmation
  const handleDelete = async (equipment) => {
    Modal.confirm({
      title: "Удалить оборудование?",
      content: `Вы уверены, что хотите удалить "${equipment.name}"?`,
      onOk: async () => {
        try {
          await deleteEquipment(equipment.id).unwrap();
          message.success("Оборудование успешно удалено!");
        } catch (error) {
          console.error("Ошибка при удалении оборудования:", error);
          message.error("Ошибка при удалении оборудования");
        }
      },
      okText: "Да",
      cancelText: "Нет",
      okType: "danger",
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset room filter when building changes
      ...(key === "building_id" ? { room_id: null } : {}),
    }));
    // Reset pagination for all types when filters change
    setPaginationByType({});
  };

  const clearFilters = () => {
    setFilters({
      building_id: null,
      room_id: null,
      type_id: null,
      status: null,
      author_id: null,
    });
    setPaginationByType({});
  };

  const hasActiveFilters = () => {
    return (
      filters.building_id ||
      filters.room_id ||
      filters.type_id ||
      filters.status ||
      filters.author_id
    );
  };

  // Get rooms for selected building
  const getFilteredRooms = () => {
    if (!filters.building_id) return rooms;
    return rooms.filter((room) => room.building === filters.building_id);
  };

  // Get unique authors for filter
  const getUniqueAuthors = () => {
    return users || [];
  };

  const renderEquipmentItem = (item) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <div
        key={item.id}
        className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow"
      >
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <EquipmentIcon
              type={
                item.type_data?.name ||
                equipmentTypes.find((t) => t.id === item.type)?.name
              }
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-gray-800">{item.name}</span>
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: statusConfig.bgColor,
                  color: statusConfig.color,
                  border: `1px solid ${statusConfig.borderColor}`,
                }}
              >
                {statusConfig.text}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <FiMapPin className="text-gray-400" />
                <span>
                  {item.room_data?.number && item.room_data?.name
                    ? `${item.room_data.number} - ${item.room_data.name}`
                    : "Комната не указана"}
                </span>
              </div>
              <span>ИНН: {item.inn || "Не присвоен"}</span>
              <span>ID: {item.id}</span>
              {item.author && (
                <span>
                  Автор: {item.author.first_name} {item.author.last_name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            type="text"
            icon={<FiEye />}
            onClick={() => handleView(item)}
            size="small"
            title="Подробнее"
            className="text-blue-500 hover:text-blue-700"
          />
          <Button
            type="text"
            icon={<FiEdit />}
            onClick={() => message.info("Редактирование будет добавлено позже")}
            size="small"
            title="Редактировать"
            className="text-indigo-500 hover:text-indigo-700"
          />
          <Button
            type="text"
            danger
            icon={<FiTrash2 />}
            onClick={() => handleDelete(item)}
            size="small"
            title="Удалить"
            className="text-red-500 hover:text-red-700"
          />
        </div>
      </div>
    );
  };

  const renderEquipmentList = () => {
    const groupedEquipment = groupEquipmentByType();

    if (Object.keys(groupedEquipment).length === 0) {
      if (hasActiveFilters()) {
        return (
          <div className="text-center py-8">
            <Empty
              description="Оборудование по заданным фильтрам не найдено"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <Button type="link" onClick={clearFilters} className="mt-2">
              Очистить фильтры
            </Button>
          </div>
        );
      }
      return (
        <Empty
          description="Нет оборудования в системе"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <div>
        <Collapse
          expandIcon={({ isActive }) => (
            <FiChevronRight
              className={`transition-transform ${isActive ? "rotate-90" : ""}`}
            />
          )}
          className="space-y-2"
        >
          {Object.entries(groupedEquipment).map(([typeName, items]) => {
            const { paginatedItems, totalItems, currentPage } =
              getPaginatedItemsForType(typeName, items);

            return (
              <Panel
                key={typeName}
                header={
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <EquipmentIcon
                          type={typeName}
                          className="text-green-600"
                        />
                      </div>
                      <span className="font-medium">{typeName}</span>
                    </div>
                    <Badge
                      count={totalItems}
                      style={{ backgroundColor: "#6366f1" }}
                      className="mr-4"
                    />
                  </div>
                }
              >
                <div className="space-y-4">
                  {/* Equipment Items */}
                  <div className="space-y-2">
                    {paginatedItems.map(renderEquipmentItem)}
                  </div>

                  {/* Pagination for this type */}
                  {totalItems > pageSize && (
                    <div className="flex justify-end pt-4 border-t">
                      <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalItems}
                        onChange={(page) =>
                          handlePageChangeForType(typeName, page)
                        }
                        showQuickJumper={false}
                        showTotal={(total, range) =>
                          `${range[0]}-${range[1]} из ${total} единиц`
                        }
                        size="default"
                      />
                    </div>
                  )}
                </div>
              </Panel>
            );
          })}
        </Collapse>
      </div>
    );
  };

  return (
    <div>
      <Card className="shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Управление оборудованием (Админ)
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Просмотр и управление всем оборудованием в системе
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Всего:{" "}
              <span className="font-medium">{getAllEquipment().length}</span>{" "}
              единиц
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <Select
            placeholder="Корпус"
            className="w-40"
            value={filters.building_id}
            onChange={(value) => handleFilterChange("building_id", value)}
            allowClear
          >
            {buildings.map((building) => (
              <Option key={building.id} value={building.id}>
                {building.name}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Комната"
            className="w-48"
            value={filters.room_id}
            onChange={(value) => handleFilterChange("room_id", value)}
            allowClear
            disabled={!filters.building_id}
          >
            {getFilteredRooms().map((room) => (
              <Option key={room.id} value={room.id}>
                {room.number} - {room.name}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Тип оборудования"
            className="w-48"
            value={filters.type_id}
            onChange={(value) => handleFilterChange("type_id", value)}
            allowClear
          >
            {equipmentTypes.map((type) => (
              <Option key={type.id} value={type.id}>
                <div className="flex items-center space-x-2">
                  <EquipmentIcon type={type.name} />
                  <span>{type.name}</span>
                </div>
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Состояние"
            className="w-40"
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            allowClear
          >
            <Option value="NEW">Новое</Option>
            <Option value="WORKING">Работает</Option>
            <Option value="NEEDS_REPAIR">Требует ремонта</Option>
            <Option value="DISPOSED">Утилизировано</Option>
          </Select>

          <Select
            placeholder="Автор"
            className="w-48"
            value={filters.author_id}
            onChange={(value) => handleFilterChange("author_id", value)}
            allowClear
          >
            {getUniqueAuthors().map((author) => (
              <Option key={author.id} value={author.id}>
                {author.first_name} {author.last_name}
              </Option>
            ))}
          </Select>

          <Button
            icon={<FiFilter />}
            onClick={clearFilters}
            disabled={!hasActiveFilters()}
          >
            Очистить
          </Button>
        </div>

        {/* Show active filters */}
        {hasActiveFilters() && (
          <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-indigo-800">
              <span>Активные фильтры:</span>
              {filters.building_id && (
                <span className="px-2 py-1 bg-indigo-200 rounded text-xs">
                  Корпус:{" "}
                  {buildings.find((b) => b.id === filters.building_id)?.name}
                </span>
              )}
              {filters.room_id && (
                <span className="px-2 py-1 bg-indigo-200 rounded text-xs">
                  Комната: {rooms.find((r) => r.id === filters.room_id)?.number}{" "}
                  - {rooms.find((r) => r.id === filters.room_id)?.name}
                </span>
              )}
              {filters.type_id && (
                <span className="px-2 py-1 bg-indigo-200 rounded text-xs">
                  Тип:{" "}
                  {equipmentTypes.find((t) => t.id === filters.type_id)?.name}
                </span>
              )}
              {filters.status && (
                <span className="px-2 py-1 bg-indigo-200 rounded text-xs">
                  Состояние: {getStatusText(filters.status)}
                </span>
              )}
              {filters.author_id && (
                <span className="px-2 py-1 bg-indigo-200 rounded text-xs">
                  Автор:{" "}
                  {(() => {
                    const author = getUniqueAuthors().find(
                      (a) => a.id === filters.author_id
                    );
                    return author
                      ? `${author.first_name} ${author.last_name}`
                      : "Неизвестно";
                  })()}
                </span>
              )}
            </div>
          </div>
        )}

        {equipmentLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          renderEquipmentList()
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Подробная информация об оборудовании"
        open={detailModalVisible}
        onCancel={handleDetailModalClose}
        footer={[
          <Button key="close" onClick={handleDetailModalClose}>
            Закрыть
          </Button>,
        ]}
        width={900}
      >
        {selectedEquipment && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-medium text-indigo-600 mb-4">
                {selectedEquipment.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500">ИНН:</span>
                  <span className="ml-2 font-medium">
                    {selectedEquipment.inn || "Не указан"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Тип:</span>
                  <span className="ml-2 font-medium">
                    {selectedEquipment.type_data?.name || "Неизвестный тип"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Статус:</span>
                  <span
                    className="ml-2 px-2 py-1 rounded text-sm"
                    style={{
                      backgroundColor: getStatusConfig(selectedEquipment.status)
                        .bgColor,
                      color: getStatusConfig(selectedEquipment.status).color,
                      border: `1px solid ${
                        getStatusConfig(selectedEquipment.status).borderColor
                      }`,
                    }}
                  >
                    {getStatusConfig(selectedEquipment.status).text}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Активность:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm ${
                      selectedEquipment.is_active
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {selectedEquipment.is_active ? "Активно" : "Неактивно"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description and Location */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Описание</h4>
                  <p className="text-gray-700">
                    {selectedEquipment.description || "Описание не указано"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <FiMapPin className="mr-2" />
                    Местоположение
                  </h4>
                  <p className="text-gray-700">
                    {selectedEquipment.room_data
                      ? `${selectedEquipment.room_data.number} - ${selectedEquipment.room_data.name}`
                      : "Не указано"}
                  </p>
                </div>
              </div>
            </div>

            {/* Author Info */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <span className="mr-2">👤</span>
                Информация об авторе
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500">Автор:</span>
                  <span className="ml-2 font-medium">
                    {selectedEquipment.author
                      ? `${selectedEquipment.author.first_name} ${selectedEquipment.author.last_name}`
                      : "Неизвестно"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <span className="ml-2 font-medium">
                    {selectedEquipment.author?.email || "Неизвестно"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Роль:</span>
                  <span className="ml-2 font-medium">
                    {selectedEquipment.author?.role === "admin"
                      ? "Администратор"
                      : "Менеджер"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Дата создания:</span>
                  <span className="ml-2 font-medium">
                    {selectedEquipment.created_at
                      ? new Date(
                          selectedEquipment.created_at
                        ).toLocaleDateString()
                      : "Неизвестно"}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            {selectedEquipment.inn && (
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h4 className="font-medium mb-3">QR Код</h4>
                <div className="inline-block p-3 bg-white rounded-lg shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${selectedEquipment.inn}&size=200x200&bgcolor=FFFFFF&color=000000&format=png`}
                    alt="QR Code"
                    className="w-32 h-32 mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Уникальный идентификатор: {selectedEquipment.uid}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminEquipmentPage;
