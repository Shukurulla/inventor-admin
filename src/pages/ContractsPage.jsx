// src/pages/ContractsPage.jsx - Admin version with RTK Query
import React, { useState, useMemo } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Upload,
  message,
  Space,
  Popconfirm,
} from "antd";
import {
  FiPlus,
  FiEye,
  FiEdit,
  FiTrash2,
  FiDownload,
  FiUpload,
  FiFileText,
} from "react-icons/fi";
import {
  useGetContractsQuery,
  useCreateContractMutation,
  useUpdateContractMutation,
  useDeleteContractMutation,
} from "../api/dashboardApi";
import dayjs from "dayjs";

const ContractsPage = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEditFormValid, setIsEditFormValid] = useState(false);

  // Local pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // RTK Query hooks
  const {
    data: contractsResponse,
    isLoading,
    error,
    refetch,
  } = useGetContractsQuery();

  const [createContract, { isLoading: createLoading }] =
    useCreateContractMutation();
  const [updateContract, { isLoading: updateLoading }] =
    useUpdateContractMutation();
  const [deleteContract, { isLoading: deleteLoading }] =
    useDeleteContractMutation();

  // Extract contracts from response
  const contracts = useMemo(() => {
    if (!contractsResponse) return [];

    if (Array.isArray(contractsResponse)) {
      return contractsResponse;
    }

    if (contractsResponse.results && Array.isArray(contractsResponse.results)) {
      return contractsResponse.results;
    }

    if (contractsResponse.data && Array.isArray(contractsResponse.data)) {
      return contractsResponse.data;
    }

    return [];
  }, [contractsResponse]);

  // Calculate paginated data on client side
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return contracts.slice(startIndex, endIndex);
  }, [contracts, currentPage, pageSize]);

  // Calculate total for pagination
  const total = contracts.length;

  // Handle pagination change (client-side only)
  const handleTableChange = (paginationInfo) => {
    setCurrentPage(paginationInfo.current);
    setPageSize(paginationInfo.pageSize);
  };

  // Validation for create form
  const validateCreateForm = () => {
    const values = form.getFieldsValue();
    const isValid =
      values.number && values.number.trim() !== "" && values.signed_date;
    setIsFormValid(isValid);
  };

  // Validation for edit form
  const validateEditForm = () => {
    const values = editForm.getFieldsValue();
    const isValid =
      values.number && values.number.trim() !== "" && values.signed_date;
    setIsEditFormValid(isValid);
  };

  // Handle create contract
  const handleCreate = async (values) => {
    try {
      const formData = new FormData();
      formData.append("number", values.number.trim());
      formData.append("signed_date", values.signed_date.format("YYYY-MM-DD"));

      if (values.file && values.file.fileList && values.file.fileList[0]) {
        formData.append("file", values.file.fileList[0].originFileObj);
      }

      await createContract(formData).unwrap();
      message.success("Договор успешно создан!");
      setCreateModalVisible(false);
      form.resetFields();
      setIsFormValid(false);
      setCurrentPage(1); // Go to first page to see new contract
    } catch (error) {
      console.error("Create contract error:", error);
      message.error("Ошибка при создании договора");
    }
  };

  // Handle edit contract
  const handleEdit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("number", values.number.trim());
      formData.append("signed_date", values.signed_date.format("YYYY-MM-DD"));

      if (values.file && values.file.fileList && values.file.fileList[0]) {
        formData.append("file", values.file.fileList[0].originFileObj);
      }

      await updateContract({
        id: selectedContract.id,
        ...Object.fromEntries(formData),
      }).unwrap();

      message.success("Договор успешно обновлен!");
      setEditModalVisible(false);
      setSelectedContract(null);
      editForm.resetFields();
      setIsEditFormValid(false);
    } catch (error) {
      console.error("Update contract error:", error);
      message.error("Ошибка при обновлении договора");
    }
  };

  // Handle delete contract
  const handleDelete = async (id) => {
    try {
      await deleteContract(id).unwrap();
      message.success("Договор успешно удален!");

      // Check if we need to go to previous page after deletion
      const newTotal = total - 1;
      const maxPage = Math.ceil(newTotal / pageSize);
      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(maxPage);
      }
    } catch (error) {
      console.error("Delete contract error:", error);
      message.error("Ошибка при удалении договора");
    }
  };

  // Handle view contract file
  const handleView = (contract) => {
    if (contract.file) {
      window.open(contract.file, "_blank");
    } else {
      message.info("Файл договора не найден");
    }
  };

  // Handle download contract file
  const handleDownload = (contract) => {
    if (contract.file) {
      const link = document.createElement("a");
      link.href = contract.file;
      link.download = `contract_${contract.number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      message.info("Файл договора не найден");
    }
  };

  // Open edit modal
  const openEditModal = (contract) => {
    setSelectedContract(contract);
    editForm.setFieldsValue({
      number: contract.number,
      signed_date: dayjs(contract.signed_date),
    });
    setEditModalVisible(true);
    // Validate initial form state
    setTimeout(validateEditForm, 0);
  };

  // Open create modal
  const openCreateModal = () => {
    setCreateModalVisible(true);
    setIsFormValid(false);
  };

  // Table columns
  const columns = [
    {
      title: "Номер договора",
      dataIndex: "number",
      key: "number",
      render: (text) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <FiFileText className="text-indigo-600" />
          </div>
          <span className="font-medium text-gray-800">{text}</span>
        </div>
      ),
    },
    {
      title: "Дата заключения",
      dataIndex: "signed_date",
      key: "signed_date",
      render: (date) => (
        <span className="text-gray-600">
          {dayjs(date).format("DD.MM.YYYY")}
        </span>
      ),
    },
    {
      title: "Автор",
      dataIndex: "author",
      key: "author",
      render: (author) => (
        <div className="text-sm">
          {author ? (
            <div>
              <div className="font-medium text-gray-800">
                {author.first_name} {author.last_name}
              </div>
              <div className="text-gray-500">{author.email}</div>
            </div>
          ) : (
            <span className="text-gray-400">Неизвестно</span>
          )}
        </div>
      ),
    },
    {
      title: "Создан",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (
        <span className="text-gray-600">
          {date ? dayjs(date).format("DD.MM.YYYY HH:mm") : "Неизвестно"}
        </span>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<FiEye />}
            onClick={() => handleView(record)}
            className="text-indigo-500 hover:text-indigo-600"
            title="Просмотреть файл"
          />
          <Button
            type="text"
            icon={<FiEdit />}
            onClick={() => openEditModal(record)}
            className="text-orange-500 hover:text-orange-600"
            title="Редактировать"
          />
          <Popconfirm
            title="Удалить договор?"
            description={`Вы уверены, что хотите удалить договор "${record.number}"?`}
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
            okType="danger"
          >
            <Button
              type="text"
              danger
              icon={<FiTrash2 />}
              className="text-red-500 hover:text-red-600"
              title="Удалить"
              loading={deleteLoading}
            />
          </Popconfirm>
          <Button
            type="text"
            icon={<FiDownload />}
            onClick={() => handleDownload(record)}
            className="text-green-500 hover:text-green-600"
            title="Скачать файл"
          />
        </Space>
      ),
    },
  ];

  // Upload props
  const uploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
    accept: ".pdf,.doc,.docx",
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="shadow-sm">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">Ошибка загрузки договоров</div>
            <Button type="primary" onClick={() => refetch()}>
              Попробовать снова
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Договоры</h1>
            <p className="mt-1 text-sm text-gray-500">
              Управление договорами на оборудование
            </p>
          </div>
          <Button
            type="primary"
            icon={<FiPlus />}
            onClick={openCreateModal}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Добавить договор
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Всего договоров: {total}
          </h2>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={paginatedData}
          rowKey="id"
          loading={isLoading}
          onChange={handleTableChange}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} из ${total} договоров`,
            pageSizeOptions: ["5", "10", "20", "50", "100"],
          }}
          className="border rounded-lg"
        />
      </Card>

      {/* Create Contract Modal */}
      <Modal
        title="Добавить новый договор"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
          setIsFormValid(false);
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          onFieldsChange={validateCreateForm}
        >
          <Form.Item
            label="Номер договора"
            name="number"
            rules={[
              { required: true, message: "Введите номер договора!" },
              {
                validator: (_, value) => {
                  if (value && value.trim() === "") {
                    return Promise.reject(
                      new Error("Номер договора не может быть пустым!")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Введите номер договора" />
          </Form.Item>

          <Form.Item
            label="Дата заключения"
            name="signed_date"
            rules={[{ required: true, message: "Выберите дату заключения!" }]}
          >
            <DatePicker
              placeholder="Выберите дату"
              className="w-full"
              format="DD.MM.YYYY"
            />
          </Form.Item>

          <Form.Item label="Файл договора" name="file" valuePropName="file">
            <Upload {...uploadProps} listType="text">
              <Button icon={<FiUpload />}>Выберите файл</Button>
            </Upload>
            <div className="text-xs text-gray-500 mt-1">
              Поддерживаемые форматы: PDF, DOC, DOCX
            </div>
          </Form.Item>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              onClick={() => {
                setCreateModalVisible(false);
                form.resetFields();
                setIsFormValid(false);
              }}
            >
              Отмена
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createLoading}
              disabled={!isFormValid}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {createLoading ? "Создание..." : "Создать договор"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Contract Modal */}
      <Modal
        title="Редактировать договор"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedContract(null);
          editForm.resetFields();
          setIsEditFormValid(false);
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEdit}
          onFieldsChange={validateEditForm}
        >
          <Form.Item
            label="Номер договора"
            name="number"
            rules={[
              { required: true, message: "Введите номер договора!" },
              {
                validator: (_, value) => {
                  if (value && value.trim() === "") {
                    return Promise.reject(
                      new Error("Номер договора не может быть пустым!")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Введите номер договора" />
          </Form.Item>

          <Form.Item
            label="Дата заключения"
            name="signed_date"
            rules={[{ required: true, message: "Выберите дату заключения!" }]}
          >
            <DatePicker
              placeholder="Выберите дату"
              className="w-full"
              format="DD.MM.YYYY"
            />
          </Form.Item>

          <Form.Item label="Файл договора" name="file" valuePropName="file">
            <Upload {...uploadProps} listType="text">
              <Button icon={<FiUpload />}>Выберите новый файл</Button>
            </Upload>
            {selectedContract?.file && (
              <div className="mt-2 text-sm text-gray-500">
                Текущий файл: {selectedContract.file.split("/").pop()}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              Поддерживаемые форматы: PDF, DOC, DOCX
            </div>
          </Form.Item>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              onClick={() => {
                setEditModalVisible(false);
                setSelectedContract(null);
                editForm.resetFields();
                setIsEditFormValid(false);
              }}
            >
              Отмена
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateLoading}
              disabled={!isEditFormValid}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {updateLoading ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ContractsPage;
