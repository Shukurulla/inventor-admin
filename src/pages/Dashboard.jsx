// pages/Dashboard.jsx
import React from "react";
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

const Dashboard = () => {
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

  // Статистические карточки
  const StatCard = ({ title, value, icon: Icon, gradient, description }) => (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl ${gradient}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-white/70">{description}</p>
          )}
        </div>
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8 text-white/80" />
        </div>
      </div>
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -right-2 -bottom-2 h-16 w-16 rounded-full bg-white/5" />
    </div>
  );

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

  // Статусы оборудования для pie chart
  const equipmentStatusData = React.useMemo(() => {
    if (!myEquipment || myEquipment.length === 0) return [];

    const statuses = {
      NEW: { count: 0, name: "Новое", color: "#10b981" },
      WORKING: { count: 0, name: "Работает", color: "#3b82f6" },
      REPAIR: { count: 0, name: "Требуется ремонт", color: "#f59e0b" },
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

  // Статистика по активности оборудования
  const activeEquipmentCount = myEquipment.filter(
    (item) => item.is_active
  ).length;
  const inactiveEquipmentCount = totalEquipment - activeEquipmentCount;

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

  if (equipmentLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Панель управления
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Обзор моего оборудования и статистика
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ClockIcon className="h-4 w-4" />
          <span>Обновлено: {new Date().toLocaleString("ru")}</span>
        </div>
      </div>

      {/* Основная статистика */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Моё оборудование"
          value={totalEquipment}
          icon={ComputerDesktopIcon}
          gradient="bg-gradient-to-br from-blue-600 to-blue-700"
          description="единиц в системе"
        />
        <StatCard
          title="Здания"
          value={buildings.length}
          icon={BuildingOfficeIcon}
          gradient="bg-gradient-to-br from-purple-600 to-purple-700"
          description="корпусов университета"
        />
        <StatCard
          title="Кабинеты"
          value={rooms.length}
          icon={AcademicCapIcon}
          gradient="bg-gradient-to-br from-green-600 to-green-700"
          description="активных кабинетов"
        />
        <StatCard
          title="Факультеты"
          value={faculties.length}
          icon={UsersIcon}
          gradient="bg-gradient-to-br from-orange-600 to-orange-700"
          description="учебных подразделений"
        />
      </div>

      {/* Статусные индикаторы */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <WrenchScrewdriverIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">
                Требуется ремонт
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {repairCount}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-orange-600"
                    style={{
                      width: `${
                        totalEquipment > 0
                          ? (repairCount / totalEquipment) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="ml-4">
                <span className="text-sm text-gray-500">
                  {totalEquipment > 0
                    ? Math.round((repairCount / totalEquipment) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Работает</p>
              <p className="text-2xl font-semibold text-gray-900">
                {workingCount}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-green-600"
                    style={{
                      width: `${
                        totalEquipment > 0
                          ? (workingCount / totalEquipment) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="ml-4">
                <span className="text-sm text-gray-500">
                  {totalEquipment > 0
                    ? Math.round((workingCount / totalEquipment) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Утилизация</p>
              <p className="text-2xl font-semibold text-gray-900">
                {disposedCount}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-red-600"
                    style={{
                      width: `${
                        totalEquipment > 0
                          ? (disposedCount / totalEquipment) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="ml-4">
                <span className="text-sm text-gray-500">
                  {totalEquipment > 0
                    ? Math.round((disposedCount / totalEquipment) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Новое</p>
              <p className="text-2xl font-semibold text-gray-900">{newCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{
                      width: `${
                        totalEquipment > 0
                          ? (newCount / totalEquipment) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="ml-4">
                <span className="text-sm text-gray-500">
                  {totalEquipment > 0
                    ? Math.round((newCount / totalEquipment) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основные диаграммы */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Состояние всего оборудования - donut chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Состояние оборудования
            </h3>
            <p className="text-sm text-gray-500">
              Общее состояние моего оборудования
            </p>
          </div>
          <div className="flex flex-col items-center">
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

            {/* Легенда */}
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

        {/* Типы оборудования */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Типы оборудования
            </h3>
            <p className="text-sm text-gray-500">
              Распределение по типам оборудования
            </p>
          </div>
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

      {/* Дополнительная статистика */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Статистика по факультетам */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Оборудование по факультетам
            </h3>
            <p className="text-sm text-gray-500">
              Количество и состояние оборудования в каждом факультете
            </p>
          </div>
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

        {/* Распределение по кабинетам */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Топ кабинетов по оборудованию
            </h3>
            <p className="text-sm text-gray-500">
              Кабинеты с наибольшим количеством оборудования
            </p>
          </div>
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
  );
};

export default Dashboard;
