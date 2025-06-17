// pages/Dashboard.jsx - Updated with export functionality
import React, { useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  ComputerDesktopIcon,
  BuildingOfficeIcon,
  UsersIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { dashboardApi } from "../api/dashboardApi";
import ExcelExportUtils from "../components/ExcelExportUtils";
import EquipmentDetailModal from "../components/EquipmentDetailModal";

const Dashboard = () => {
  // Equipment detail modal state
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [equipmentDetailModal, setEquipmentDetailModal] = useState(false);

  // Chart refs for export
  const statusChartRef = useRef(null);
  const facultyChartRef = useRef(null);
  const typeChartRef = useRef(null);
  const roomChartRef = useRef(null);

  // Equipment detail modal state

  const openEquipmentDetail = (equipment) => {
    setSelectedEquipment(equipment);
    setEquipmentDetailModal(true);
  };

  const closeEquipmentDetail = () => {
    setSelectedEquipment(null);
    setEquipmentDetailModal(false);
  };

  const { data: buildings = [] } = dashboardApi.useGetBuildingsQuery();
  const { data: faculties = [] } = dashboardApi.useGetFacultiesQuery();
  const { data: rooms = [] } = dashboardApi.useGetRoomsQuery();

  // Используем API для моего оборудования
  const { data: myEquipment = [], isLoading: equipmentLoading } =
    dashboardApi.useGetMyEquipmentQuery();

  const { data: repairs = [] } = dashboardApi.useGetRepairsQuery();
  const { data: disposals = [] } = dashboardApi.useGetDisposalsQuery();

  // Общее количество оборудования
  const totalEquipment = myEquipment.length;

  // Статусы оборудования для pie chart
  const equipmentStatusData = React.useMemo(() => {
    if (!myEquipment || myEquipment.length === 0) return [];

    const statuses = {
      NEW: { count: 0, name: "Новое", color: "#10b981" },
      WORKING: { count: 0, name: "Работает", color: "#3b82f6" },
      NEEDS_REPAIR: { count: 0, name: "Требуется ремонт", color: "#f59e0b" },
      DISPOSED: { count: 0, name: "Утилизация", color: "#ef4444" },
    };

    myEquipment.forEach((item) => {
      if (statuses[item.status]) {
        statuses[item.status].count++;
      }
    });

    return Object.entries(statuses)
      .filter(([, data]) => data.count > 0)
      .map(([status, data]) => ({
        name: data.name,
        value: data.count,
        fill: data.color,
        percentage: ((data.count / myEquipment.length) * 100).toFixed(1),
      }));
  }, [myEquipment]);

  // Статистика по типам оборудования
  const equipmentTypeStats = React.useMemo(() => {
    if (!myEquipment || myEquipment.length === 0) return [];

    const typeCount = {};
    myEquipment.forEach((item) => {
      const typeName = item.type_data?.name || "Неизвестно";
      typeCount[typeName] = (typeCount[typeName] || 0) + 1;
    });

    return Object.entries(typeCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Показываем топ 8 типов
  }, [myEquipment]);

  // Факультеты по оборудованию - используем my-equipments API
  const facultyEquipmentStats = React.useMemo(() => {
    if (!faculties.length || !myEquipment.length || !rooms.length) return [];

    return faculties.map((faculty) => {
      // Найти комнаты, принадлежащие этому факультету
      const facultyRooms = rooms.filter((room) => {
        return room.building === faculty.building;
      });

      // Найти все оборудование в этих комнатах
      const facultyEquipment = myEquipment.filter((item) => {
        if (!item.room_data) return false;
        return facultyRooms.some((room) => room.id === item.room_data.id);
      });

      // Статистика по статусам
      const newCount = facultyEquipment.filter(
        (item) => item.status === "NEW"
      ).length;
      const workingCount = facultyEquipment.filter(
        (item) => item.status === "WORKING"
      ).length;
      const repairCount = facultyEquipment.filter(
        (item) => item.status === "NEEDS_REPAIR"
      ).length;
      const disposedCount = facultyEquipment.filter(
        (item) => item.status === "DISPOSED"
      ).length;

      return {
        name:
          faculty.name.length > 20
            ? faculty.name.substring(0, 20) + "..."
            : faculty.name,
        всего: facultyEquipment.length,
        новое: newCount,
        работает: workingCount,
        ремонт: repairCount,
        утилизация: disposedCount,
      };
    });
  }, [faculties, myEquipment, rooms]);

  // Статистика по локациям (комнатам)
  const roomStats = React.useMemo(() => {
    if (!myEquipment || myEquipment.length === 0) return [];

    const roomCount = {};
    myEquipment.forEach((item) => {
      if (item.room_data) {
        const roomName = `${item.room_data.number} - ${item.room_data.name}`;
        roomCount[roomName] = (roomCount[roomName] || 0) + 1;
      } else {
        roomCount["Без локации"] = (roomCount["Без локации"] || 0) + 1;
      }
    });

    return Object.entries(roomCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Показываем топ 10 комнат
  }, [myEquipment]);

  // Подсчет по статусам
  const workingCount = myEquipment.filter(
    (item) => item.status === "WORKING"
  ).length;
  const repairCount = myEquipment.filter(
    (item) => item.status === "NEEDS_REPAIR"
  ).length;
  const newCount = myEquipment.filter((item) => item.status === "NEW").length;
  const disposedCount = myEquipment.filter(
    (item) => item.status === "DISPOSED"
  ).length;

  if (equipmentLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Export Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Панель управления
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Обзор моего оборудования и статистика
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* <ExcelExportUtils
            data={equipmentStatusData}
            chartRef={statusChartRef}
            filename="dashboard_overview"
            title="Dashboard Overview"
          /> */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ClockIcon className="h-4 w-4" />
            <span>Обновлено: {new Date().toLocaleString("ru")}</span>
          </div>
        </div>
      </div>

      {/* ... existing StatCard components ... */}

      {/* Updated Charts with Export Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution with Export */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Состояние оборудования
              </h3>
              <p className="text-sm text-gray-500">
                Общее состояние моего оборудования
              </p>
            </div>
            <ExcelExportUtils
              data={equipmentStatusData}
              chartRef={statusChartRef}
              filename="equipment_status"
              title="Equipment Status"
            />
          </div>
          <div ref={statusChartRef} className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={equipmentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {equipmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} шт.`, name]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-4 mt-4 w-full">
              {equipmentStatusData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="text-sm text-gray-600">
                    {entry.name}: {entry.value} ({entry.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Equipment Types with Export */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Типы оборудования
              </h3>
              <p className="text-sm text-gray-500">
                Распределение по типам оборудования
              </p>
            </div>
            <ExcelExportUtils
              data={equipmentTypeStats}
              chartRef={typeChartRef}
              filename="equipment_types"
              title="Equipment Types"
            />
          </div>
          <div ref={typeChartRef}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={equipmentTypeStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" name="Количество" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Charts with Export */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty Stats with Export */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Оборудование по факультетам
              </h3>
              <p className="text-sm text-gray-500">
                Количество и состояние оборудования в каждом факультете
              </p>
            </div>
            <ExcelExportUtils
              data={facultyEquipmentStats}
              chartRef={facultyChartRef}
              filename="faculty_equipment"
              title="Faculty Equipment Distribution"
            />
          </div>
          <div ref={facultyChartRef}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={facultyEquipmentStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="новое" stackId="a" fill="#10b981" name="Новое" />
                <Bar
                  dataKey="работает"
                  stackId="a"
                  fill="#3b82f6"
                  name="Работает"
                />
                <Bar
                  dataKey="ремонт"
                  stackId="a"
                  fill="#f59e0b"
                  name="Требуется ремонт"
                />
                <Bar
                  dataKey="утилизация"
                  stackId="a"
                  fill="#ef4444"
                  name="Утилизация"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Stats with Export */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Топ кабинетов по оборудованию
              </h3>
              <p className="text-sm text-gray-500">
                Кабинеты с наибольшим количеством оборудования
              </p>
            </div>
            <ExcelExportUtils
              data={roomStats}
              chartRef={roomChartRef}
              filename="room_equipment"
              title="Room Equipment Distribution"
            />
          </div>
          <div ref={roomChartRef}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={roomStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" name="Количество" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Equipment Detail Modal */}
      <EquipmentDetailModal
        isOpen={equipmentDetailModal}
        onClose={closeEquipmentDetail}
        equipment={selectedEquipment}
      />
    </div>
  );
};

export default Dashboard;
