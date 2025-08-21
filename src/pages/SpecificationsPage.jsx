import React, { useState, useEffect } from "react";
import {
  Card,
  Collapse,
  Button,
  Badge,
  Empty,
  Modal,
  message,
  Pagination,
  Popconfirm,
  Tooltip,
  Form,
} from "antd";
import { useSelector } from "react-redux";
import {
  FiChevronRight,
  FiTrash2,
  FiEdit,
  FiEye,
  FiLock,
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
  useGetComputerSpecificationsQuery,
  useGetProjectorSpecificationsQuery,
  useGetPrinterSpecificationsQuery,
  useGetTvSpecificationsQuery,
  useGetRouterSpecificationsQuery,
  useGetNotebookSpecificationsQuery,
  useGetMonoblokSpecificationsQuery,
  useGetWhiteboardSpecificationsQuery,
  useGetExtenderSpecificationsQuery,
  useGetMonitorSpecificationsQuery,
  useDeleteComputerSpecificationMutation,
  useDeleteProjectorSpecificationMutation,
  useDeletePrinterSpecificationMutation,
  useDeleteTvSpecificationMutation,
  useDeleteRouterSpecificationMutation,
  useDeleteNotebookSpecificationMutation,
  useDeleteMonoblokSpecificationMutation,
  useDeleteWhiteboardSpecificationMutation,
  useDeleteExtenderSpecificationMutation,
  useDeleteMonitorSpecificationMutation,
  useCreateComputerSpecificationMutation,
  useCreateProjectorSpecificationMutation,
  useCreatePrinterSpecificationMutation,
  useCreateTvSpecificationMutation,
  useCreateRouterSpecificationMutation,
  useCreateNotebookSpecificationMutation,
  useCreateMonoblokSpecificationMutation,
  useCreateWhiteboardSpecificationMutation,
  useCreateExtenderSpecificationMutation,
  useCreateMonitorSpecificationMutation,
  useUpdateComputerSpecificationMutation,
  useUpdateProjectorSpecificationMutation,
  useUpdatePrinterSpecificationMutation,
  useUpdateTvSpecificationMutation,
  useUpdateRouterSpecificationMutation,
  useUpdateNotebookSpecificationMutation,
  useUpdateMonoblokSpecificationMutation,
  useUpdateWhiteboardSpecificationMutation,
  useUpdateExtenderSpecificationMutation,
  useUpdateMonitorSpecificationMutation,
} from "../api/dashboardApi";
import CreateSpecificationForm from "../components/CreateSpecificationForm";

const { Panel } = Collapse;

const SpecificationsPage = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState(null);
  const [selectedSpecType, setSelectedSpecType] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Forms
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Pagination states for each type
  const [paginationByType, setPaginationByType] = useState({});
  const [pageSize] = useState(5);

  // Get current user from Redux store
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role || localStorage.getItem("userRole") || "admin";

  // RTK Query hooks for all specification types
  const { data: computerSpecs = [], isLoading: loadingComputer } =
    useGetComputerSpecificationsQuery();
  const { data: projectorSpecs = [], isLoading: loadingProjector } =
    useGetProjectorSpecificationsQuery();
  const { data: printerSpecs = [], isLoading: loadingPrinter } =
    useGetPrinterSpecificationsQuery();
  const { data: tvSpecs = [], isLoading: loadingTv } =
    useGetTvSpecificationsQuery();
  const { data: routerSpecs = [], isLoading: loadingRouter } =
    useGetRouterSpecificationsQuery();
  const { data: notebookSpecs = [], isLoading: loadingNotebook } =
    useGetNotebookSpecificationsQuery();
  const { data: monoblokSpecs = [], isLoading: loadingMonoblok } =
    useGetMonoblokSpecificationsQuery();
  const { data: whiteboardSpecs = [], isLoading: loadingWhiteboard } =
    useGetWhiteboardSpecificationsQuery();
  const { data: extenderSpecs = [], isLoading: loadingExtender } =
    useGetExtenderSpecificationsQuery();
  const { data: monitorSpecs = [], isLoading: loadingMonitor } =
    useGetMonitorSpecificationsQuery();

  // Delete mutations
  const [deleteComputerSpec] = useDeleteComputerSpecificationMutation();
  const [deleteProjectorSpec] = useDeleteProjectorSpecificationMutation();
  const [deletePrinterSpec] = useDeletePrinterSpecificationMutation();
  const [deleteTvSpec] = useDeleteTvSpecificationMutation();
  const [deleteRouterSpec] = useDeleteRouterSpecificationMutation();
  const [deleteNotebookSpec] = useDeleteNotebookSpecificationMutation();
  const [deleteMonoblokSpec] = useDeleteMonoblokSpecificationMutation();
  const [deleteWhiteboardSpec] = useDeleteWhiteboardSpecificationMutation();
  const [deleteExtenderSpec] = useDeleteExtenderSpecificationMutation();
  const [deleteMonitorSpec] = useDeleteMonitorSpecificationMutation();

  // Create mutations
  const [createComputerSpec] = useCreateComputerSpecificationMutation();
  const [createProjectorSpec] = useCreateProjectorSpecificationMutation();
  const [createPrinterSpec] = useCreatePrinterSpecificationMutation();
  const [createTvSpec] = useCreateTvSpecificationMutation();
  const [createRouterSpec] = useCreateRouterSpecificationMutation();
  const [createNotebookSpec] = useCreateNotebookSpecificationMutation();
  const [createMonoblokSpec] = useCreateMonoblokSpecificationMutation();
  const [createWhiteboardSpec] = useCreateWhiteboardSpecificationMutation();
  const [createExtenderSpec] = useCreateExtenderSpecificationMutation();
  const [createMonitorSpec] = useCreateMonitorSpecificationMutation();

  // Update mutations
  const [updateComputerSpec] = useUpdateComputerSpecificationMutation();
  const [updateProjectorSpec] = useUpdateProjectorSpecificationMutation();
  const [updatePrinterSpec] = useUpdatePrinterSpecificationMutation();
  const [updateTvSpec] = useUpdateTvSpecificationMutation();
  const [updateRouterSpec] = useUpdateRouterSpecificationMutation();
  const [updateNotebookSpec] = useUpdateNotebookSpecificationMutation();
  const [updateMonoblokSpec] = useUpdateMonoblokSpecificationMutation();
  const [updateWhiteboardSpec] = useUpdateWhiteboardSpecificationMutation();
  const [updateExtenderSpec] = useUpdateExtenderSpecificationMutation();
  const [updateMonitorSpec] = useUpdateMonitorSpecificationMutation();

  const loading =
    loadingComputer ||
    loadingProjector ||
    loadingPrinter ||
    loadingTv ||
    loadingRouter ||
    loadingNotebook ||
    loadingMonoblok ||
    loadingWhiteboard ||
    loadingExtender ||
    loadingMonitor;

  // Get current user info on component mount
  useEffect(() => {
    if (!user && localStorage.getItem("accessToken")) {
      setCurrentUser({ role: userRole });
    } else {
      setCurrentUser(user);
    }
  }, [user, userRole]);

  // Check if user can edit/delete specification (for admin all permissions)
  const canUserModifySpec = (spec) => {
    if (!currentUser || !spec) return true; // Admin has all permissions

    // Admin can modify all specifications
    if (currentUser.role === "admin" || userRole === "admin") return true;

    // User can only modify their own specifications
    return (
      spec.created_by === currentUser.id || spec.author?.id === currentUser.id
    );
  };

  // Equipment type templates for creating new specifications
  const equipmentTypeTemplates = [
    {
      name: "Компьютер",
      key: "computer",
      icon: <FiMonitor />,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      name: "Проектор",
      key: "projector",
      icon: <BsProjector />,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Принтер",
      key: "printer",
      icon: <FiPrinter />,
      color: "bg-pink-100 text-pink-600",
    },
    {
      name: "Телевизор",
      key: "tv",
      icon: <FiTv />,
      color: "bg-orange-100 text-orange-600",
    },
    {
      name: "Роутер",
      key: "router",
      icon: <FiWifi />,
      color: "bg-red-100 text-red-600",
    },
    {
      name: "Ноутбук",
      key: "notebook",
      icon: <BsLaptop />,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      name: "Моноблок",
      key: "monoblok",
      icon: <BsDisplay />,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Электронная доска",
      key: "whiteboard",
      icon: <FiTablet />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Удлинитель",
      key: "extender",
      icon: <BsPlug />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Монитор",
      key: "monitor",
      icon: <BsDisplay />,
      color: "bg-cyan-100 text-cyan-600",
    },
  ];

  // Group specifications by type
  const groupSpecificationsByType = () => {
    const grouped = {};

    const specTypes = [
      { key: "computer", name: "Компьютеры", data: computerSpecs },
      { key: "projector", name: "Проекторы", data: projectorSpecs },
      { key: "printer", name: "Принтеры", data: printerSpecs },
      { key: "tv", name: "Телевизоры", data: tvSpecs },
      { key: "router", name: "Роутеры", data: routerSpecs },
      { key: "notebook", name: "Ноутбуки", data: notebookSpecs },
      { key: "monoblok", name: "Моноблоки", data: monoblokSpecs },
      { key: "whiteboard", name: "Электронные доски", data: whiteboardSpecs },
      { key: "extender", name: "Удлинители", data: extenderSpecs },
      { key: "monitor", name: "Мониторы", data: monitorSpecs },
    ];

    specTypes.forEach((type) => {
      if (type.data.length > 0) {
        grouped[type.key] = {
          name: type.name,
          data: type.data,
        };
      }
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

  // Handle view specification
  const handleView = (spec, type) => {
    setSelectedSpec(spec);
    setSelectedSpecType(type);
    setDetailModalVisible(true);
  };

  // Handle create new specification
  const handleCreateNew = (equipmentType) => {
    setSelectedSpecType(equipmentType.key);
    setCreateModalVisible(true);
  };

  // Handle edit specification
  const handleEdit = (spec, type) => {
    if (!canUserModifySpec(spec)) {
      message.error("У вас нет прав для редактирования этой характеристики");
      return;
    }
    setSelectedSpec(spec);
    setSelectedSpecType(type);
    setEditModalVisible(true);

    // Pre-fill edit form with existing data - IMPROVED
    setTimeout(() => {
      // Process the spec data based on type
      const formData = { ...spec };

      // Handle disk specifications for computer/notebook/monoblok
      if (
        (type === "computer" || type === "notebook" || type === "monoblok") &&
        spec.disk_specifications
      ) {
        spec.disk_specifications.forEach((disk, index) => {
          formData[`storage_${Date.now() + index}_size`] = disk.capacity_gb;
          formData[`storage_${Date.now() + index}_type`] = disk.disk_type;
        });
      }

      // Handle GPU specifications
      if (spec.gpu_specifications && spec.gpu_specifications.length > 0) {
        formData.gpu_model = spec.gpu_specifications[0].model;
      }

      editForm.setFieldsValue(formData);
    }, 100);
  };

  // Handle delete specification
  const handleDelete = async (spec, type) => {
    if (!canUserModifySpec(spec)) {
      message.error("У вас нет прав для удаления этой характеристики");
      return;
    }

    try {
      let deleteAction;

      switch (type) {
        case "computer":
          deleteAction = deleteComputerSpec;
          break;
        case "projector":
          deleteAction = deleteProjectorSpec;
          break;
        case "printer":
          deleteAction = deletePrinterSpec;
          break;
        case "tv":
          deleteAction = deleteTvSpec;
          break;
        case "router":
          deleteAction = deleteRouterSpec;
          break;
        case "notebook":
          deleteAction = deleteNotebookSpec;
          break;
        case "monoblok":
          deleteAction = deleteMonoblokSpec;
          break;
        case "whiteboard":
          deleteAction = deleteWhiteboardSpec;
          break;
        case "extender":
          deleteAction = deleteExtenderSpec;
          break;
        case "monitor":
          deleteAction = deleteMonitorSpec;
          break;
        default:
          throw new Error("Unknown specification type");
      }

      await deleteAction(spec.id).unwrap();
      message.success("Характеристика успешно удалена!");
    } catch (error) {
      console.error("Error deleting specification:", error);
      message.error("Ошибка при удалении характеристики");
    }
  };

  // Handle create specification submission
  const handleCreateSubmit = async (values) => {
    try {
      let createAction;

      switch (selectedSpecType) {
        case "computer":
          createAction = createComputerSpec;
          break;
        case "projector":
          createAction = createProjectorSpec;
          break;
        case "printer":
          createAction = createPrinterSpec;
          break;
        case "tv":
          createAction = createTvSpec;
          break;
        case "router":
          createAction = createRouterSpec;
          break;
        case "notebook":
          createAction = createNotebookSpec;
          break;
        case "monoblok":
          createAction = createMonoblokSpec;
          break;
        case "whiteboard":
          createAction = createWhiteboardSpec;
          break;
        case "extender":
          createAction = createExtenderSpec;
          break;
        case "monitor":
          createAction = createMonitorSpec;
          break;
        default:
          throw new Error("Unknown specification type");
      }

      await createAction(values).unwrap();
      message.success("Характеристика успешно создана!");
      setCreateModalVisible(false);
      createForm.resetFields();
    } catch (error) {
      console.error("Error creating specification:", error);
      message.error("Ошибка при создании характеристики");
    }
  };

  // Handle edit specification submission
  const handleEditSubmit = async (values) => {
    try {
      let updateAction;

      switch (selectedSpecType) {
        case "computer":
          updateAction = updateComputerSpec;
          break;
        case "projector":
          updateAction = updateProjectorSpec;
          break;
        case "printer":
          updateAction = updatePrinterSpec;
          break;
        case "tv":
          updateAction = updateTvSpec;
          break;
        case "router":
          updateAction = updateRouterSpec;
          break;
        case "notebook":
          updateAction = updateNotebookSpec;
          break;
        case "monoblok":
          updateAction = updateMonoblokSpec;
          break;
        case "whiteboard":
          updateAction = updateWhiteboardSpec;
          break;
        case "extender":
          updateAction = updateExtenderSpec;
          break;
        case "monitor":
          updateAction = updateMonitorSpec;
          break;
        default:
          throw new Error("Unknown specification type");
      }

      await updateAction({ id: selectedSpec.id, ...values }).unwrap();
      message.success("Характеристика успешно обновлена!");
      setEditModalVisible(false);
      setSelectedSpec(null);
      editForm.resetFields();
    } catch (error) {
      console.error("Error updating specification:", error);
      message.error("Ошибка при обновлении характеристики");
    }
  };

  // Render individual specification item
  const renderSpecificationItem = (spec, type) => {
    const canModify = canUserModifySpec(spec);

    const getSpecTitle = () => {
      switch (type) {
        case "computer":
        case "notebook":
        case "monoblok":
          return spec.cpu || spec.title || `Характеристика ${spec.id}`;
        case "projector":
        case "printer":
        case "tv":
        case "router":
        case "whiteboard":
        case "monitor":
          return spec.model || spec.title || `Характеристика ${spec.id}`;
        case "extender":
          return (
            spec.title ||
            `${spec.ports || "N/A"} портов, ${spec.length || "N/A"}м`
          );
        default:
          return spec.title || `Характеристика ${spec.id}`;
      }
    };

    const getSpecSummary = () => {
      switch (type) {
        case "computer":
        case "notebook":
        case "monoblok":
          return `${spec.ram || "N/A"} RAM • ${
            spec.storage ||
            (spec.disk_specifications?.length > 0
              ? spec.disk_specifications
                  .map((d) => `${d.capacity_gb}GB ${d.disk_type}`)
                  .join(", ")
              : "N/A")
          }`;
        case "projector":
          return `${spec.lumens || "N/A"} люмен • ${spec.resolution || "N/A"}`;
        case "printer":
          return `${spec.color ? "Цветной" : "Ч/б"} • ${
            spec.duplex ? "Двусторонний" : "Односторонний"
          }`;
        case "tv":
        case "monitor":
          return `${spec.screen_size || "N/A"}" • ${spec.resolution || "N/A"}`;
        case "router":
          return `${spec.ports || "N/A"} портов • ${
            spec.wifi_standart || "N/A"
          }`;
        case "whiteboard":
          return `${spec.screen_size || "N/A"}" • ${spec.touch_type || "N/A"}`;
        case "extender":
          return `${spec.ports || "N/A"} портов • ${spec.length || "N/A"}м`;
        default:
          return "Характеристика";
      }
    };

    return (
      <div
        key={spec.id}
        className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow"
      >
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {type.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-gray-800">
                {getSpecTitle()}
              </span>
              {!canModify && (
                <Tooltip title="Вы не можете редактировать эту характеристику">
                  <FiLock className="text-gray-400 text-sm" />
                </Tooltip>
              )}
            </div>

            <div className="text-sm text-gray-500">{getSpecSummary()}</div>

            {spec.created_at && (
              <div className="text-xs text-gray-400 mt-1">
                Создано: {new Date(spec.created_at).toLocaleDateString("ru")}
                {spec.author && (
                  <span className="ml-2">
                    • Автор: {spec.author.first_name} {spec.author.last_name}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            type="text"
            icon={<FiEye />}
            onClick={() => handleView(spec, type)}
            size="small"
            title="Подробнее"
            className="text-blue-500 hover:text-blue-700"
          />

          {/* <Button
            type="text"
            icon={<FiEdit />}
            onClick={() => handleEdit(spec, type)}
            size="small"
            title={canModify ? "Редактировать" : "Нет доступа"}
            className={
              canModify
                ? "text-indigo-500 hover:text-indigo-700"
                : "text-gray-300"
            }
            disabled={!canModify}
          /> */}

          <Popconfirm
            title="Вы уверены, что хотите удалить эту характеристику?"
            onConfirm={() => handleDelete(spec, type)}
            okText="Да"
            cancelText="Нет"
            disabled={!canModify}
          >
            <Button
              type="text"
              danger
              icon={<FiTrash2 />}
              size="small"
              title={canModify ? "Удалить" : "Нет доступа"}
              className={
                canModify ? "text-red-500 hover:text-red-700" : "text-gray-300"
              }
              disabled={!canModify}
            />
          </Popconfirm>
        </div>
      </div>
    );
  };

  // Render create new section
  const renderCreateNewSection = () => (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Создать новые характеристики
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipmentTypeTemplates.map((template) => (
          <div
            key={template.key}
            className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow cursor-pointer"
            onClick={() => handleCreateNew(template)}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-10 h-10 rounded-lg ${template.color} flex items-center justify-center`}
              >
                <span className="text-lg">{template.icon}</span>
              </div>
              <span className="font-medium text-gray-900">{template.name}</span>
            </div>
            <Button
              type="text"
              icon={<FiPlus />}
              className="text-indigo-500 hover:text-indigo-600"
            />
          </div>
        ))}
      </div>
    </div>
  );

  // Render specifications list
  const renderSpecificationsList = () => {
    const groupedSpecs = groupSpecificationsByType();

    if (Object.keys(groupedSpecs).length === 0) {
      return (
        <Empty
          description="Характеристики не найдены"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Существующие характеристики
        </h2>
        <Collapse
          expandIcon={({ isActive }) => (
            <FiChevronRight
              className={`transition-transform ${isActive ? "rotate-90" : ""}`}
            />
          )}
          className="space-y-2"
        >
          {Object.entries(groupedSpecs).map(([typeKey, typeData]) => {
            const { paginatedItems, totalItems, currentPage } =
              getPaginatedItemsForType(typeKey, typeData.data);

            return (
              <Panel
                key={typeKey}
                header={
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-semibold">
                          {typeKey.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium">{typeData.name}</span>
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
                  {/* Specification Items */}
                  <div className="space-y-2">
                    {paginatedItems.map((spec) =>
                      renderSpecificationItem(spec, typeKey)
                    )}
                  </div>

                  {/* Pagination for this type */}
                  {totalItems > pageSize && (
                    <div className="flex justify-end pt-4 border-t">
                      <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalItems}
                        onChange={(page) =>
                          handlePageChangeForType(typeKey, page)
                        }
                        showQuickJumper={false}
                        showTotal={(total, range) =>
                          `${range[0]}-${range[1]} из ${total} характеристик`
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
    <div className="space-y-6">
      <Card className="shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Характеристики оборудования
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Управление техническими характеристиками оборудования
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {userRole === "admin" ? (
                  <span className="text-green-600">
                    Администратор - полный доступ
                  </span>
                ) : (
                  <span className="text-blue-600">
                    Доступ только к своим характеристикам
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div>
            {renderCreateNewSection()}
            {renderSpecificationsList()}
          </div>
        )}
      </Card>

      {/* Create Modal */}
      <Modal
        title="Создать новую характеристику"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          setSelectedSpecType(null);
          createForm.resetFields();
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        {selectedSpecType && (
          <CreateSpecificationForm
            form={createForm}
            equipmentType={{
              name: equipmentTypeTemplates.find(
                (t) => t.key === selectedSpecType
              )?.name,
            }}
            onSubmit={handleCreateSubmit}
            onCancel={() => {
              setCreateModalVisible(false);
              setSelectedSpecType(null);
              createForm.resetFields();
            }}
            isEdit={false}
          />
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Редактировать характеристику"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedSpec(null);
          setSelectedSpecType(null);
          editForm.resetFields();
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        {selectedSpec && selectedSpecType && (
          <CreateSpecificationForm
            form={editForm}
            equipmentType={{
              name: equipmentTypeTemplates.find(
                (t) => t.key === selectedSpecType
              )?.name,
            }}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              setEditModalVisible(false);
              setSelectedSpec(null);
              setSelectedSpecType(null);
              editForm.resetFields();
            }}
            isEdit={true}
            initialData={selectedSpec}
          />
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Подробная информация о характеристике"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedSpec(null);
          setSelectedSpecType(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setDetailModalVisible(false);
              setSelectedSpec(null);
              setSelectedSpecType(null);
            }}
          >
            Закрыть
          </Button>,
        ]}
        width={800}
      >
        {selectedSpec && (
          <div className="space-y-4">
            {/* Render specification details based on type */}
            {(selectedSpecType === "computer" ||
              selectedSpecType === "notebook" ||
              selectedSpecType === "monoblok") && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Название:</span>
                  <div className="font-medium">
                    {selectedSpec.title || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Процессор:</span>
                  <div className="font-medium">{selectedSpec.cpu || "N/A"}</div>
                </div>
                <div>
                  <span className="text-gray-600">ОЗУ:</span>
                  <div className="font-medium">{selectedSpec.ram || "N/A"}</div>
                </div>
                <div>
                  <span className="text-gray-600">Накопитель:</span>
                  <div className="font-medium">
                    {selectedSpec.disk_specifications?.length > 0
                      ? selectedSpec.disk_specifications
                          .map((d) => `${d.capacity_gb}GB ${d.disk_type}`)
                          .join(", ")
                      : selectedSpec.storage || "N/A"}
                  </div>
                </div>
                {(selectedSpecType === "notebook" ||
                  selectedSpecType === "monoblok") && (
                  <div>
                    <span className="text-gray-600">Размер экрана:</span>
                    <div className="font-medium">
                      {selectedSpec.monitor_size ||
                        selectedSpec.screen_size ||
                        "N/A"}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Видеокарта:</span>
                  <div className="font-medium">
                    {selectedSpec.gpu_specifications?.[0]?.model ||
                      selectedSpec.gpu_model ||
                      "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Клавиатура:</span>
                  <div className="font-medium">
                    {selectedSpec.has_keyboard ? "Есть" : "Нет"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Мышь:</span>
                  <div className="font-medium">
                    {selectedSpec.has_mouse ? "Есть" : "Нет"}
                  </div>
                </div>
              </div>
            )}

            {selectedSpecType === "projector" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Название:</span>
                  <div className="font-medium">
                    {selectedSpec.title || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Модель:</span>
                  <div className="font-medium">
                    {selectedSpec.model || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Яркость:</span>
                  <div className="font-medium">
                    {selectedSpec.lumens || "N/A"} люмен
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Разрешение:</span>
                  <div className="font-medium">
                    {selectedSpec.resolution || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Тип проекции:</span>
                  <div className="font-medium">
                    {selectedSpec.throw_type || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Серийный номер:</span>
                  <div className="font-medium">
                    {selectedSpec.serial_number || "N/A"}
                  </div>
                </div>
              </div>
            )}

            {/* Add other specification type details as needed */}
            {selectedSpecType === "printer" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Название:</span>
                  <div className="font-medium">
                    {selectedSpec.title || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Модель:</span>
                  <div className="font-medium">
                    {selectedSpec.model || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Цветная печать:</span>
                  <div className="font-medium">
                    {selectedSpec.color ? "Да" : "Нет"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Двусторонняя печать:</span>
                  <div className="font-medium">
                    {selectedSpec.duplex ? "Да" : "Нет"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Серийный номер:</span>
                  <div className="font-medium">
                    {selectedSpec.serial_number || "N/A"}
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="text-sm text-gray-500">
                <div>ID: {selectedSpec.id}</div>
                {selectedSpec.created_at && (
                  <div>
                    Создано:{" "}
                    {new Date(selectedSpec.created_at).toLocaleString("ru")}
                  </div>
                )}
                {selectedSpec.author && (
                  <div>
                    Автор: {selectedSpec.author.first_name}{" "}
                    {selectedSpec.author.last_name}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SpecificationsPage;
