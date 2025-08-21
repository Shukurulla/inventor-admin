// src/pages/AdminEquipmentPage.jsx - Enhanced version with my-equipments API
import React, { useState } from "react";
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
  Popconfirm,
  Tooltip,
  Form,
  Input,
  DatePicker,
  Upload,
} from "antd";
import {
  FiChevronRight,
  FiTrash2,
  FiEdit,
  FiFilter,
  FiEye,
  FiMapPin,
  FiUser,
  FiUpload,
  FiPlus,
  FiMonitor,
  FiPrinter,
  FiTv,
  FiWifi,
  FiTablet,
  FiLayers,
} from "react-icons/fi";
import { BsProjector, BsLaptop, BsDisplay, BsPlug } from "react-icons/bs";
import {
  dashboardApi,
  useGetMyEquipmentQuery,
  useGetBuildingsQuery,
  useGetRoomsQuery,
  useGetEquipmentTypesQuery,
  useDeleteEquipmentMutation,
  useUpdateEquipmentMutation,
  useCreateEquipmentMutation,
} from "../api/dashboardApi";
import { useGetUsersQuery } from "../api/usersApi";
const { Panel } = Collapse;
const { Option } = Select;

// Status utilities
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
      return status || "Неизвестно";
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
        text: status || "Неизвестно",
        color: "#6b7280",
        bgColor: "#f3f4f6",
        borderColor: "#d1d5db",
      };
  }
};

// Equipment Icon Component with React Icons
const EquipmentIcon = ({ type, className = "text-lg" }) => {
  const getIcon = () => {
    if (!type) return <FiLayers className={className} />;

    const typeLower = type.toLowerCase();

    if (typeLower.includes("проектор"))
      return <BsProjector className={className} />;
    if (typeLower.includes("компьютер"))
      return <FiMonitor className={className} />;
    if (typeLower.includes("принтер"))
      return <FiPrinter className={className} />;
    if (typeLower.includes("монитор"))
      return <BsDisplay className={className} />;
    if (typeLower.includes("телевизор")) return <FiTv className={className} />;
    if (typeLower.includes("роутер") || typeLower.includes("router"))
      return <FiWifi className={className} />;
    if (typeLower.includes("ноутбук"))
      return <BsLaptop className={className} />;
    if (typeLower.includes("моноблок"))
      return <BsDisplay className={className} />;
    if (typeLower.includes("доска") || typeLower.includes("электронная"))
      return <FiTablet className={className} />;
    if (typeLower.includes("удлинитель") || typeLower.includes("extender"))
      return <BsPlug className={className} />;

    return <FiLayers className={className} />;
  };

  return getIcon();
};

const AdminEquipmentPage = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [filters, setFilters] = useState({
    building_id: undefined,
    room_id: undefined,
    type_id: undefined,
    status: undefined,
    author_id: undefined,
  });

  // Forms
  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();

  // Pagination states for each type
  const [paginationByType, setPaginationByType] = useState({});
  const [pageSize] = useState(5);

  // RTK Query hooks - using my-equipments API instead of general equipment API
  const {
    data: equipmentResponse,
    isLoading: equipmentLoading,
    error: equipmentError,
  } = useGetMyEquipmentQuery();

  const { data: buildings = [], isLoading: buildingsLoading } =
    useGetBuildingsQuery();
  const { data: rooms = [], isLoading: roomsLoading } = useGetRoomsQuery();
  const { data: equipmentTypes = [], isLoading: typesLoading } =
    useGetEquipmentTypesQuery();
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();

  const [deleteEquipment, { isLoading: deleteLoading }] =
    useDeleteEquipmentMutation();
  const [updateEquipment, { isLoading: updateLoading }] =
    useUpdateEquipmentMutation();
  const [createEquipment, { isLoading: createLoading }] =
    useCreateEquipmentMutation();

  // Safely extract equipment array from my-equipments response
  const getAllEquipment = () => {
    if (!equipmentResponse) return [];

    let equipmentArray = [];

    // Handle different response structures from my-equipments API
    if (Array.isArray(equipmentResponse)) {
      equipmentArray = equipmentResponse;
    } else if (
      equipmentResponse.results &&
      Array.isArray(equipmentResponse.results)
    ) {
      equipmentArray = equipmentResponse.results;
    } else if (
      equipmentResponse.data &&
      Array.isArray(equipmentResponse.data)
    ) {
      equipmentArray = equipmentResponse.data;
    }

    // Apply filters
    let filteredEquipment = [...equipmentArray];

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

    // Filter valid equipment items
    return filteredEquipment.filter(
      (item) =>
        item &&
        typeof item === "object" &&
        item.id &&
        (item.name || item.type_data || item.type)
    );
  };

  // Group equipment by type
  const groupEquipmentByType = () => {
    const validEquipment = getAllEquipment();
    const grouped = {};

    validEquipment.forEach((item) => {
      // Determine type name safely
      let typeName = "Неизвестный тип";

      if (item.type_data?.name) {
        typeName = item.type_data.name;
      } else if (item.type && equipmentTypes.length > 0) {
        const foundType = equipmentTypes.find((t) => t.id === item.type);
        if (foundType) {
          typeName = foundType.name;
        }
      }

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

  // Handle edit button click
  const handleEdit = (equipment) => {
    setSelectedEquipment(equipment);
    setEditModalVisible(true);

    // Pre-fill form
    setTimeout(() => {
      editForm.setFieldsValue({
        name: equipment.name,
        description: equipment.description,
        status: equipment.status,
        type: equipment.type_data?.id || equipment.type,
        room_id: equipment.room_data?.id,
      });
    }, 100);
  };

  // Handle create button click
  const handleCreate = () => {
    setCreateModalVisible(true);
  };

  // Handle edit submit
  const handleEditSubmit = async (values) => {
    try {
      await updateEquipment({
        id: selectedEquipment.id,
        ...values,
      }).unwrap();

      message.success("Оборудование успешно обновлено!");
      setEditModalVisible(false);
      setSelectedEquipment(null);
      editForm.resetFields();
    } catch (error) {
      console.error("Error updating equipment:", error);
      message.error("Ошибка при обновлении оборудования");
    }
  };

  // Handle create submit
  const handleCreateSubmit = async (values) => {
    try {
      await createEquipment(values).unwrap();

      message.success("Оборудование успешно создано!");
      setCreateModalVisible(false);
      createForm.resetFields();
    } catch (error) {
      console.error("Error creating equipment:", error);
      message.error("Ошибка при создании оборудования");
    }
  };

  // Handle delete confirmation
  const handleDelete = async (equipment) => {
    try {
      await deleteEquipment(equipment.id).unwrap();
      message.success("Оборудование успешно удалено!");
    } catch (error) {
      console.error("Ошибка при удалении оборудования:", error);
      message.error("Ошибка при удалении оборудования");
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset room filter when building changes
      ...(key === "building_id" ? { room_id: undefined } : {}),
    }));
    // Reset pagination for all types when filters change
    setPaginationByType({});
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      building_id: undefined,
      room_id: undefined,
      type_id: undefined,
      status: undefined,
      author_id: undefined,
    });
    setPaginationByType({});
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return Object.values(filters).some(
      (value) => value !== undefined && value !== null
    );
  };

  // Get rooms for selected building
  const getFilteredRooms = () => {
    if (!filters.building_id || rooms.length === 0) return rooms;
    return rooms.filter((room) => room.building === filters.building_id);
  };

  // Get unique authors for filter
  const getUniqueAuthors = () => {
    return Array.isArray(users) ? users : [];
  };

  // Render individual equipment item with enhanced info
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
              <span className="font-medium text-gray-800">
                {item.name || `Оборудование #${item.id}`}
              </span>
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
                <div className="flex items-center space-x-1">
                  <FiUser className="text-gray-400" />
                  <span>
                    {item.author.first_name} {item.author.last_name}
                  </span>
                </div>
              )}
            </div>

            {/* Enhanced details from my-equipments API */}
            {item.description && (
              <div className="text-xs text-gray-400 mt-1 max-w-md truncate">
                {item.description}
              </div>
            )}

            {/* Contract information */}
            {item.contract && (
              <div className="text-xs text-blue-600 mt-1">
                Договор: {item.contract.number}
              </div>
            )}

            {/* Creation date */}
            {item.created_at && (
              <div className="text-xs text-gray-400 mt-1">
                Создано: {new Date(item.created_at).toLocaleDateString("ru")}
              </div>
            )}
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
          {/* 
          <Button
            type="text"
            icon={<FiEdit />}
            onClick={() => handleEdit(item)}
            size="small"
            title="Редактировать"
            className="text-indigo-500 hover:text-indigo-700"
          /> */}

          <Popconfirm
            title="Удалить оборудование?"
            description={`Вы уверены, что хотите удалить "${
              item.name || `Оборудование #${item.id}`
            }"?`}
            onConfirm={() => handleDelete(item)}
            okText="Да"
            cancelText="Нет"
            okType="danger"
          >
            <Button
              type="text"
              danger
              icon={<FiTrash2 />}
              size="small"
              title="Удалить"
              loading={deleteLoading}
              className="text-red-500 hover:text-red-700"
            />
          </Popconfirm>
        </div>
      </div>
    );
  };

  // Render equipment list with accordion
  const renderEquipmentList = () => {
    if (equipmentError) {
      return (
        <div className="text-center py-8">
          <Empty
            description="Ошибка загрузки оборудования"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button type="primary" onClick={() => window.location.reload()}>
            Обновить страницу
          </Button>
        </div>
      );
    }

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
          ghost
        >
          {Object.entries(groupedEquipment).map(([typeName, items]) => {
            const { paginatedItems, totalItems, currentPage } =
              getPaginatedItemsForType(typeName, items);

            return (
              <Panel
                key={typeName}
                header={
                  <div className="flex items-center justify-between w-full pr-4">
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
                    />
                  </div>
                }
                className="mb-2 bg-white rounded-lg border border-gray-200"
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

  const isLoading =
    equipmentLoading ||
    buildingsLoading ||
    roomsLoading ||
    typesLoading ||
    usersLoading;

  return (
    <div className="space-y-6">
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
            <Button
              type="primary"
              icon={<FiPlus />}
              onClick={handleCreate}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Добавить оборудование
            </Button>
            <div className="text-sm text-gray-500">
              Всего:{" "}
              <span className="font-medium">{getAllEquipment().length}</span>{" "}
              единиц
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <Select
            placeholder="Корпус"
            style={{ width: 160 }}
            value={filters.building_id}
            onChange={(value) => handleFilterChange("building_id", value)}
            allowClear
            loading={buildingsLoading}
          >
            {buildings.map((building) => (
              <Option key={building.id} value={building.id}>
                {building.name}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Комната"
            style={{ width: 200 }}
            value={filters.room_id}
            onChange={(value) => handleFilterChange("room_id", value)}
            allowClear
            disabled={!filters.building_id || roomsLoading}
            loading={roomsLoading}
          >
            {getFilteredRooms().map((room) => (
              <Option key={room.id} value={room.id}>
                {room.number} - {room.name}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Тип оборудования"
            style={{ width: 200 }}
            value={filters.type_id}
            onChange={(value) => handleFilterChange("type_id", value)}
            allowClear
            loading={typesLoading}
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
            style={{ width: 160 }}
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
            style={{ width: 200 }}
            value={filters.author_id}
            onChange={(value) => handleFilterChange("author_id", value)}
            allowClear
            loading={usersLoading}
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
            <div className="flex flex-wrap items-center gap-2 text-sm text-indigo-800">
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

        {/* Equipment List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          renderEquipmentList()
        )}
      </Card>

      {/* Edit Equipment Modal */}
      <Modal
        title="Редактировать оборудование"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedEquipment(null);
          editForm.resetFields();
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: "Введите название!" }]}
          >
            <Input placeholder="Название оборудования" />
          </Form.Item>

          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={3} placeholder="Описание оборудования" />
          </Form.Item>

          <Form.Item
            label="Состояние"
            name="status"
            rules={[{ required: true, message: "Выберите состояние!" }]}
          >
            <Select placeholder="Выберите состояние">
              <Select.Option value="NEW">Новое</Select.Option>
              <Select.Option value="WORKING">Работает</Select.Option>
              <Select.Option value="NEEDS_REPAIR">
                Требует ремонта
              </Select.Option>
              <Select.Option value="DISPOSED">Утилизировано</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Комната" name="room_id">
            <Select placeholder="Выберите комнату" allowClear>
              {rooms.map((room) => (
                <Select.Option key={room.id} value={room.id}>
                  {room.number} - {room.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              onClick={() => {
                setEditModalVisible(false);
                setSelectedEquipment(null);
                editForm.resetFields();
              }}
            >
              Отмена
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateLoading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Сохранить
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Create Equipment Modal */}
      <Modal
        title="Добавить оборудование"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreateSubmit}>
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: "Введите название!" }]}
          >
            <Input placeholder="Название оборудования" />
          </Form.Item>

          <Form.Item
            label="Тип оборудования"
            name="type"
            rules={[{ required: true, message: "Выберите тип!" }]}
          >
            <Select placeholder="Выберите тип оборудования">
              {equipmentTypes.map((type) => (
                <Select.Option key={type.id} value={type.id}>
                  <div className="flex items-center space-x-2">
                    <EquipmentIcon type={type.name} />
                    <span>{type.name}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Комната"
            name="room_id"
            rules={[{ required: true, message: "Выберите комнату!" }]}
          >
            <Select placeholder="Выберите комнату">
              {rooms.map((room) => (
                <Select.Option key={room.id} value={room.id}>
                  {room.number} - {room.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={3} placeholder="Описание оборудования" />
          </Form.Item>

          <Form.Item label="Состояние" name="status" initialValue="NEW">
            <Select>
              <Select.Option value="NEW">Новое</Select.Option>
              <Select.Option value="WORKING">Работает</Select.Option>
              <Select.Option value="NEEDS_REPAIR">
                Требует ремонта
              </Select.Option>
              <Select.Option value="DISPOSED">Утилизировано</Select.Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              onClick={() => {
                setCreateModalVisible(false);
                createForm.resetFields();
              }}
            >
              Отмена
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createLoading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Создать
            </Button>
          </div>
        </Form>
      </Modal>
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
                {selectedEquipment.name ||
                  `Оборудование #${selectedEquipment.id}`}
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

            {/* Contract Info */}
            {selectedEquipment.contract && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <span className="mr-2">📄</span>
                  Информация о договоре
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500">Номер договора:</span>
                    <span className="ml-2 font-medium">
                      {selectedEquipment.contract.number}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Дата заключения:</span>
                    <span className="ml-2 font-medium">
                      {selectedEquipment.contract.signed_date
                        ? new Date(
                            selectedEquipment.contract.signed_date
                          ).toLocaleDateString("ru")
                        : "Неизвестно"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Author Info */}
            {selectedEquipment.author && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <span className="mr-2">👤</span>
                  Информация об авторе
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500">Автор:</span>
                    <span className="ml-2 font-medium">
                      {`${selectedEquipment.author.first_name} ${selectedEquipment.author.last_name}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 font-medium">
                      {selectedEquipment.author.email || "Неизвестно"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Роль:</span>
                    <span className="ml-2 font-medium">
                      {selectedEquipment.author.role === "admin"
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
                          ).toLocaleDateString("ru")
                        : "Неизвестно"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Equipment Image */}
            {selectedEquipment.image && (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h4 className="font-medium mb-3">Изображение оборудования</h4>
                <img
                  src={selectedEquipment.image}
                  alt="Equipment"
                  className="max-w-md mx-auto rounded-lg shadow-sm"
                  style={{ maxHeight: "300px" }}
                />
              </div>
            )}

            {/* QR Code */}
            {selectedEquipment.inn && (
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h4 className="font-medium mb-3">QR Код</h4>
                <div className="inline-block p-3 bg-white rounded-lg shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${selectedEquipment.inn}&size=200x200&bgcolor=FFFFFF&color=000000&format=png`}
                    alt="QR Code"
                    className="w-32 h-32 mx-auto"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <div
                    style={{ display: "none" }}
                    className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center"
                  >
                    <span className="text-gray-500">QR код недоступен</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Уникальный идентификатор:{" "}
                  {selectedEquipment.uid || selectedEquipment.inn}
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
