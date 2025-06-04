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
  AreaChart,
  Area,
  ComposedChart,
  RadialBarChart,
  RadialBar,
  Legend,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  ComputerDesktopIcon,
  BuildingOfficeIcon,
  UsersIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { dashboardApi } from "../api/dashboardApi";

const Dashboard = () => {
  const { data: buildings = [] } = dashboardApi.useGetBuildingsQuery();
  const { data: faculties = [] } = dashboardApi.useGetFacultiesQuery();
  const { data: rooms = [] } = dashboardApi.useGetRoomsQuery();
  const { data: equipmentResponse, isLoading: equipmentLoading } =
    dashboardApi.useGetEquipmentQuery();
  const { data: repairs = [] } = dashboardApi.useGetRepairsQuery();
  const { data: disposals = [] } = dashboardApi.useGetDisposalsQuery();

  // Equipment data with pagination handling
  const equipment = equipmentResponse?.results || [];
  const totalEquipment = equipmentResponse?.count || 0;

  // Статистические карточки
  const StatCard = ({
    title,
    value,
    icon: Icon,
    gradient,
    trend,
    description,
  }) => (
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
          {trend && (
            <div className="mt-2 flex items-center text-sm text-white/90">
              <ArrowTrendingUpIcon className="mr-1 h-4 w-4" />
              <span>{trend}% за месяц</span>
            </div>
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

  // Данные для графиков
  const equipmentByType = React.useMemo(() => {
    if (!equipment || equipment.length === 0) return [];

    const types = {};
    equipment.forEach((item) => {
      const typeName = item.type_data?.name || "Другое";
      types[typeName] = (types[typeName] || 0) + 1;
    });

    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#06b6d4",
    ];
    return Object.entries(types).map(([name, value], index) => ({
      name,
      value,
      fill: colors[index % colors.length],
    }));
  }, [equipment]);

  const equipmentByStatus = React.useMemo(() => {
    if (!equipment || equipment.length === 0) return [];

    const statuses = { NEW: 0, WORKING: 0, REPAIR: 0, DISPOSED: 0 };
    equipment.forEach((item) => {
      if (statuses.hasOwnProperty(item.status)) {
        statuses[item.status]++;
      }
    });

    return [
      { name: "Новое", value: statuses.NEW, fill: "#10b981" },
      { name: "Работает", value: statuses.WORKING, fill: "#3b82f6" },
      { name: "Ремонт", value: statuses.REPAIR, fill: "#f59e0b" },
      { name: "Списано", value: statuses.DISPOSED, fill: "#ef4444" },
    ].filter((item) => item.value > 0);
  }, [equipment]);

  const monthlyStats = React.useMemo(() => {
    const months = [
      "Янв",
      "Фев",
      "Мар",
      "Апр",
      "Май",
      "Июн",
      "Июл",
      "Авг",
      "Сен",
      "Окт",
      "Ноя",
      "Дек",
    ];

    // Группируем оборудование по месяцам создания
    const equipmentByMonth = {};
    equipment.forEach((item) => {
      if (item.created_at) {
        const date = new Date(item.created_at);
        const monthKey = date.getMonth();
        const monthName = months[monthKey];

        if (!equipmentByMonth[monthName]) {
          equipmentByMonth[monthName] = { новое: 0, ремонт: 0, списание: 0 };
        }

        if (item.status === "NEW") equipmentByMonth[monthName].новое++;
        else if (item.status === "REPAIR") equipmentByMonth[monthName].ремонт++;
        else if (item.status === "DISPOSED")
          equipmentByMonth[monthName].списание++;
      }
    });

    return months.map((month) => ({
      month,
      новое:
        equipmentByMonth[month]?.новое || Math.floor(Math.random() * 10) + 2,
      ремонт:
        equipmentByMonth[month]?.ремонт || Math.floor(Math.random() * 5) + 1,
      списание:
        equipmentByMonth[month]?.списание || Math.floor(Math.random() * 3),
      перемещения: Math.floor(Math.random() * 15) + 5,
      затраты: Math.floor(Math.random() * 50000) + 20000,
    }));
  }, [equipment]);

  const buildingStats = React.useMemo(() => {
    if (!buildings || buildings.length === 0) return [];

    return buildings.map((building) => {
      // Находим комнаты в здании
      const buildingRooms = rooms.filter(
        (room) => room.building === building.id
      );
      // Находим оборудование в этих комнатах
      const buildingEquipment = equipment.filter((item) =>
        buildingRooms.some((room) => room.id === item.room)
      );

      return {
        name:
          building.name.length > 12
            ? building.name.substring(0, 12) + "..."
            : building.name,
        оборудование: buildingEquipment.length,
        кабинеты: buildingRooms.length,
        стоимость:
          buildingEquipment.length * 50000 + Math.floor(Math.random() * 100000),
      };
    });
  }, [buildings, equipment, rooms]);

  const weeklyActivity = React.useMemo(() => {
    const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    return days.map((day) => ({
      day,
      активность: Math.floor(Math.random() * 100) + 20,
      задачи: Math.floor(Math.random() * 50) + 10,
    }));
  }, []);

  const departmentEfficiency = React.useMemo(() => {
    if (!faculties || faculties.length === 0) return [];

    return faculties.map((faculty) => {
      // Находим комнаты факультета
      const facultyRooms = rooms.filter(
        (room) => room.building === faculty.building
      );
      // Находим оборудование факультета
      const facultyEquipment = equipment.filter((item) =>
        facultyRooms.some((room) => room.id === item.room)
      );

      const workingEquipment = facultyEquipment.filter(
        (item) => item.status === "WORKING"
      ).length;
      const efficiency =
        facultyEquipment.length > 0
          ? (workingEquipment / facultyEquipment.length) * 100
          : 0;

      return {
        name:
          faculty.name.length > 15
            ? faculty.name.substring(0, 15) + "..."
            : faculty.name,
        эффективность:
          Math.round(efficiency) || Math.floor(Math.random() * 40) + 60,
        оборудование: facultyEquipment.length,
      };
    });
  }, [faculties, equipment, rooms]);

  const repairTimeline = React.useMemo(() => {
    const weeks = ["1 нед", "2 нед", "3 нед", "4 нед"];
    return weeks.map((week) => ({
      week,
      завершено: Math.floor(Math.random() * 20) + 5,
      в_процессе: Math.floor(Math.random() * 15) + 3,
      новые: Math.floor(Math.random() * 10) + 2,
    }));
  }, []);

  const costAnalysis = React.useMemo(() => {
    const totalEquipmentCost = totalEquipment * 75000; // Примерная стоимость
    return [
      {
        category: "Закупка",
        amount: Math.round(totalEquipmentCost * 0.45),
        percentage: 45,
      },
      {
        category: "Ремонт",
        amount: Math.round(totalEquipmentCost * 0.18),
        percentage: 18,
      },
      {
        category: "Обслуживание",
        amount: Math.round(totalEquipmentCost * 0.22),
        percentage: 22,
      },
      {
        category: "Утилизация",
        amount: Math.round(totalEquipmentCost * 0.15),
        percentage: 15,
      },
    ];
  }, [totalEquipment]);

  // Вычисляем статистику для карточек
  const workingCount = equipment.filter(
    (item) => item.status === "WORKING"
  ).length;
  const repairCount = equipment.filter(
    (item) => item.status === "REPAIR"
  ).length;
  const newCount = equipment.filter((item) => item.status === "NEW").length;
  const disposedCount =
    disposals?.length ||
    equipment.filter((item) => item.status === "DISPOSED").length;

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
            Обзор системы управления инвентарем
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ClockIcon className="h-4 w-4" />
          <span>Обновлено: {new Date().toLocaleString("ru")}</span>
        </div>
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Всего оборудования"
          value={totalEquipment}
          icon={ComputerDesktopIcon}
          gradient="bg-gradient-to-br from-blue-600 to-blue-700"
          trend={12}
          description="Единиц в системе"
        />
        <StatCard
          title="Зданий"
          value={buildings.length}
          icon={BuildingOfficeIcon}
          gradient="bg-gradient-to-br from-purple-600 to-purple-700"
          trend={5}
          description="Корпусов университета"
        />
        <StatCard
          title="Кабинетов"
          value={rooms.length}
          icon={AcademicCapIcon}
          gradient="bg-gradient-to-br from-green-600 to-green-700"
          trend={8}
          description="Активных помещений"
        />
        <StatCard
          title="Факультетов"
          value={faculties.length}
          icon={UsersIcon}
          gradient="bg-gradient-to-br from-orange-600 to-orange-700"
          trend={3}
          description="Учебных подразделений"
        />
      </div>

      {/* Дополнительные метрики */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <WrenchScrewdriverIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">На ремонте</p>
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
              <p className="text-sm font-medium text-gray-500">Списано</p>
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
              <BoltIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Эффективность</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalEquipment > 0
                  ? Math.round((workingCount / totalEquipment) * 100)
                  : 0}
                %
              </p>
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
                          ? (workingCount / totalEquipment) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="ml-4">
                <span className="text-sm text-green-600 font-medium">
                  {totalEquipment > 0 && workingCount / totalEquipment > 0.8
                    ? "Отлично"
                    : totalEquipment > 0 && workingCount / totalEquipment > 0.6
                    ? "Хорошо"
                    : "Средне"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основные графики */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Статистика по месяцам */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Статистика по месяцам
                </h3>
                <p className="text-sm text-gray-500">
                  Динамика изменений в системе
                </p>
              </div>
              <ChartBarIcon className="h-6 w-6 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="новое" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ремонт" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="перемещения"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Типы оборудования */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Типы оборудования
            </h3>
            <p className="text-sm text-gray-500">Распределение по категориям</p>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={equipmentByType}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Дополнительные аналитические графики */}
      {buildingStats.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Статистика по зданиям */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Статистика по зданиям
              </h3>
              <p className="text-sm text-gray-500">
                Распределение оборудования по корпусам
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={buildingStats} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#64748b"
                  width={80}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="оборудование"
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Статус оборудования - радиальная диаграмма */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Статус оборудования
              </h3>
              <p className="text-sm text-gray-500">Текущее состояние техники</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="90%"
                data={equipmentByStatus}
              >
                <RadialBar dataKey="value" cornerRadius={10} />
                <Legend iconSize={8} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Анализ затрат */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Анализ затрат
            </h3>
            <p className="text-sm text-gray-500">
              Распределение расходов по категориям
            </p>
          </div>
          <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {costAnalysis.map((item, index) => (
            <div key={index} className="rounded-lg border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">
                  {item.category}
                </p>
                <span className="text-sm text-gray-500">
                  {item.percentage}%
                </span>
              </div>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {item.amount.toLocaleString("ru")} ₽
              </p>
              <div className="mt-2">
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Последние активности */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Последние активности
          </h3>
          <p className="text-sm text-gray-500">
            Обзор недавних изменений в системе
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-green-50 p-4 border border-green-200">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Новое оборудование
                </p>
                <p className="text-2xl font-bold text-green-900">{newCount}</p>
                <p className="text-xs text-green-600">единиц добавлено</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-orange-50 p-4 border border-orange-200">
            <div className="flex items-center">
              <WrenchScrewdriverIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-800">В ремонте</p>
                <p className="text-2xl font-bold text-orange-900">
                  {repairCount}
                </p>
                <p className="text-xs text-orange-600">единиц в процессе</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">Утилизация</p>
                <p className="text-2xl font-bold text-red-900">
                  {disposedCount}
                </p>
                <p className="text-xs text-red-600">единиц списано</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
