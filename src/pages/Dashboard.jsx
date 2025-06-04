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
  const { data: equipmentResponse, isLoading: equipmentLoading } =
    dashboardApi.useGetEquipmentQuery();
  const { data: repairs = [] } = dashboardApi.useGetRepairsQuery();
  const { data: disposals = [] } = dashboardApi.useGetDisposalsQuery();

  // Equipment data with pagination handling
  const equipment = equipmentResponse?.results || [];
  const totalEquipment = equipmentResponse?.count || 0;

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

  // Fakultetlar bo'yicha equipment statistikasi
  const facultyEquipmentStats = React.useMemo(() => {
    if (!faculties.length || !equipment.length || !rooms.length) return [];

    return faculties.map((faculty) => {
      // Bu fakultetga tegishli binolar va xonalarni topish
      const facultyRooms = rooms.filter((room) => {
        // Fakultet binosiga tegishli xonalar
        return room.building === faculty.building;
      });

      // Bu xonalardagi barcha equipmentlarni topish
      const facultyEquipment = equipment.filter((item) =>
        facultyRooms.some((room) => room.id === item.room)
      );

      // Status bo'yicha statistika
      const newCount = facultyEquipment.filter(
        (item) => item.status === "NEW"
      ).length;
      const workingCount = facultyEquipment.filter(
        (item) => item.status === "WORKING"
      ).length;
      const repairCount = facultyEquipment.filter(
        (item) => item.status === "REPAIR"
      ).length;
      const disposedCount = facultyEquipment.filter(
        (item) => item.status === "DISPOSED"
      ).length;

      return {
        name:
          faculty.name.length > 20
            ? faculty.name.substring(0, 20) + "..."
            : faculty.name,
        jami: facultyEquipment.length,
        yangi: newCount,
        ishlaydi: workingCount,
        tamirlash: repairCount,
        eski: disposedCount,
      };
    });
  }, [faculties, equipment, rooms]);

  // Barcha equipment statuslari uchun pie chart
  const equipmentStatusData = React.useMemo(() => {
    if (!equipment || equipment.length === 0) return [];

    const statuses = {
      NEW: { count: 0, name: "Yangi", color: "#10b981" },
      WORKING: { count: 0, name: "Ishlaydi", color: "#3b82f6" },
      REPAIR: { count: 0, name: "Ta'mirlash", color: "#f59e0b" },
      DISPOSED: { count: 0, name: "Eski", color: "#ef4444" },
    };

    equipment.forEach((item) => {
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
        percentage: ((data.count / equipment.length) * 100).toFixed(1),
      }));
  }, [equipment]);

  // Hisoblangan statistikalar
  const workingCount = equipment.filter(
    (item) => item.status === "WORKING"
  ).length;
  const repairCount = equipment.filter(
    (item) => item.status === "REPAIR"
  ).length;
  const newCount = equipment.filter((item) => item.status === "NEW").length;
  const disposedCount = equipment.filter(
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
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Boshqaruv paneli</h1>
          <p className="mt-1 text-sm text-gray-500">
            Inventar boshqaruv tizimi umumiy ko'rinishi
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ClockIcon className="h-4 w-4" />
          <span>Yangilangan: {new Date().toLocaleString("uz")}</span>
        </div>
      </div>

      {/* Asosiy statistikalar */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Barcha jihozlar"
          value={totalEquipment}
          icon={ComputerDesktopIcon}
          gradient="bg-gradient-to-br from-blue-600 to-blue-700"
          description="Tizimdagi birliklar"
        />
        <StatCard
          title="Binolar"
          value={buildings.length}
          icon={BuildingOfficeIcon}
          gradient="bg-gradient-to-br from-purple-600 to-purple-700"
          description="Universitet korpuslari"
        />
        <StatCard
          title="Xonalar"
          value={rooms.length}
          icon={AcademicCapIcon}
          gradient="bg-gradient-to-br from-green-600 to-green-700"
          description="Faol xonalar"
        />
        <StatCard
          title="Fakultetlar"
          value={faculties.length}
          icon={UsersIcon}
          gradient="bg-gradient-to-br from-orange-600 to-orange-700"
          description="O'quv bo'limlari"
        />
      </div>

      {/* Status ko'rsatkichlari */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <WrenchScrewdriverIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Ta'mirlashda</p>
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
              <p className="text-sm font-medium text-gray-500">Ishlaydi</p>
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
              <p className="text-sm font-medium text-gray-500">Eskirgan</p>
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
              <p className="text-sm font-medium text-gray-500">Yangi</p>
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

      {/* Asosiy diagrammalar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Fakultetlar bo'yicha statistika */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Fakultetlar bo'yicha jihozlar
            </h3>
            <p className="text-sm text-gray-500">
              Har bir fakultetdagi jihozlar soni va holati
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
              <Bar dataKey="yangi" stackId="a" fill="#10b981" name="Yangi" />
              <Bar
                dataKey="ishlaydi"
                stackId="a"
                fill="#3b82f6"
                name="Ishlaydi"
              />
              <Bar
                dataKey="tamirlash"
                stackId="a"
                fill="#f59e0b"
                name="Ta'mirlash"
              />
              <Bar dataKey="eski" stackId="a" fill="#ef4444" name="Eski" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Barcha jihozlar holati - donut chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Jihozlar holati
            </h3>
            <p className="text-sm text-gray-500">
              Barcha jihozlarning umumiy holati
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
                  formatter={(value, name) => [`${value} ta`, name]}
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
      </div>

      {/* Qo'shimcha ma'lumotlar */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-green-50 p-6 border border-green-200">
          <div className="flex items-center">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-800">
                Yangi jihozlar
              </p>
              <p className="text-3xl font-bold text-green-900">{newCount}</p>
              <p className="text-xs text-green-600">birlik qo'shildi</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-orange-50 p-6 border border-orange-200">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-10 w-10 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-800">
                Ta'mirlashda
              </p>
              <p className="text-3xl font-bold text-orange-900">
                {repairCount}
              </p>
              <p className="text-xs text-orange-600">birlik jarayonda</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-red-50 p-6 border border-red-200">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-red-800">Eskirgan</p>
              <p className="text-3xl font-bold text-red-900">{disposedCount}</p>
              <p className="text-xs text-red-600">birlik hisobdan chiqarildi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
