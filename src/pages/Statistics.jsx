import React, { useState, useRef, useMemo } from "react";
import {
  ChartBarIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
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
import { dashboardApi } from "../api/dashboardApi";
import ExcelExportUtils from "../components/ExcelExportUtils";
import EquipmentDetailModal from "../components/EquipmentDetailModal";

const Statistics = () => {
  // Chart refs for export
  const statusChartRef = useRef(null);
  const typeChartRef = useRef(null);
  const facultyChartRef = useRef(null);

  // API queries
  const { data: faculties = [] } = dashboardApi.useGetFacultiesQuery();
  const { data: buildings = [] } = dashboardApi.useGetBuildingsQuery();
  const { data: rooms = [] } = dashboardApi.useGetRoomsQuery();
  const { data: myEquipment = [] } = dashboardApi.useGetMyEquipmentQuery();
  const { data: equipmentTypes = [] } =
    dashboardApi.useGetEquipmentTypesQuery();

  // State variables
  const [filters, setFilters] = useState({
    faculty: "",
    building: "",
    status: "",
    equipmentType: "",
  });

  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [equipmentDetailModal, setEquipmentDetailModal] = useState(false);

  // Modal functions
  const openEquipmentDetail = (equipment) => {
    setSelectedEquipment(equipment);
    setEquipmentDetailModal(true);
  };

  const closeEquipmentDetail = () => {
    setSelectedEquipment(null);
    setEquipmentDetailModal(false);
  };

  // Filtered data
  const filteredEquipment = useMemo(() => {
    return myEquipment.filter((item) => {
      if (filters.faculty && item.room_data) {
        const room = rooms.find((r) => r.id === item.room_data.id);
        if (!room) return false;
        const building = buildings.find((b) => b.id === room.building);
        if (!building) return false;
        const faculty = faculties.find((f) => f.building === building.id);
        if (!faculty || faculty.id !== parseInt(filters.faculty)) return false;
      }

      if (filters.building && item.room_data) {
        const room = rooms.find((r) => r.id === item.room_data.id);
        if (!room || room.building !== parseInt(filters.building)) return false;
      }

      if (filters.status && item.status !== filters.status) return false;

      if (
        filters.equipmentType &&
        item.type_data?.id !== parseInt(filters.equipmentType)
      )
        return false;

      return true;
    });
  }, [myEquipment, filters, faculties, buildings, rooms]);

  // Chart data
  const statusData = useMemo(() => {
    const statuses = {
      NEW: { count: 0, name: "Новое", color: "#10b981" },
      WORKING: { count: 0, name: "Работает", color: "#3b82f6" },
      NEEDS_REPAIR: { count: 0, name: "Требуется ремонт", color: "#f59e0b" },
      DISPOSED: { count: 0, name: "Утилизация", color: "#ef4444" },
    };

    filteredEquipment.forEach((item) => {
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
        status: status,
      }));
  }, [filteredEquipment]);

  const typeData = useMemo(() => {
    const typeCount = {};
    filteredEquipment.forEach((item) => {
      const typeName = item.type_data?.name || "Неизвестно";
      typeCount[typeName] = (typeCount[typeName] || 0) + 1;
    });

    return Object.entries(typeCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredEquipment]);

  const facultyData = useMemo(() => {
    const facultyCount = {};

    filteredEquipment.forEach((item) => {
      if (item.room_data) {
        const room = rooms.find((r) => r.id === item.room_data.id);
        if (room) {
          const building = buildings.find((b) => b.id === room.building);
          if (building) {
            const faculty = faculties.find((f) => f.building === building.id);
            if (faculty) {
              const facultyName =
                faculty.name.length > 20
                  ? faculty.name.substring(0, 20) + "..."
                  : faculty.name;

              if (!facultyCount[facultyName]) {
                facultyCount[facultyName] = {
                  всего: 0,
                  новое: 0,
                  работает: 0,
                  ремонт: 0,
                  утилизация: 0,
                };
              }

              facultyCount[facultyName].всего++;

              switch (item.status) {
                case "NEW":
                  facultyCount[facultyName].новое++;
                  break;
                case "WORKING":
                  facultyCount[facultyName].работает++;
                  break;
                case "NEEDS_REPAIR":
                  facultyCount[facultyName].ремонт++;
                  break;
                case "DISPOSED":
                  facultyCount[facultyName].утилизация++;
                  break;
              }
            }
          }
        }
      }
    });

    return Object.entries(facultyCount).map(([name, data]) => ({
      name,
      ...data,
    }));
  }, [filteredEquipment, faculties, buildings, rooms]);

  const clearFilters = () => {
    setFilters({
      faculty: "",
      building: "",
      status: "",
      equipmentType: "",
    });
  };

  const getFilteredBuildings = () => {
    if (!filters.faculty) return buildings;
    const faculty = faculties.find((f) => f.id === parseInt(filters.faculty));
    return faculty
      ? buildings.filter((b) => b.id === faculty.building)
      : buildings;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Детальная статистика
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Расширенная аналитика оборудования с фильтрами
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Фильтры</h2>
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Очистить все
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Факультет
            </label>
            <select
              value={filters.faculty}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  faculty: e.target.value,
                  building: "",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все факультеты</option>
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Здание
            </label>
            <select
              value={filters.building}
              onChange={(e) =>
                setFilters({ ...filters, building: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все здания</option>
              {getFilteredBuildings().map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Состояние
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все состояния</option>
              <option value="NEW">Новое</option>
              <option value="WORKING">Работает</option>
              <option value="NEEDS_REPAIR">Требуется ремонт</option>
              <option value="DISPOSED">Утилизация</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип оборудования
            </label>
            <select
              value={filters.equipmentType}
              onChange={(e) =>
                setFilters({ ...filters, equipmentType: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все типы</option>
              {equipmentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters summary */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Показано:{" "}
            <span className="font-medium">{filteredEquipment.length}</span> из{" "}
            {myEquipment.length} единиц оборудования
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Распределение по состоянию
            </h3>
            <ExcelExportUtils
              data={statusData}
              chartRef={statusChartRef}
              filename="equipment_status"
              title="Equipment Status Distribution"
            />
          </div>
          <div ref={statusChartRef}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} шт.`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {statusData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-sm text-gray-600">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Types */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Типы оборудования
            </h3>
            <ExcelExportUtils
              data={typeData}
              chartRef={typeChartRef}
              filename="equipment_types"
              title="Equipment Types Distribution"
            />
          </div>
          <div ref={typeChartRef}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData}>
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
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" name="Количество" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Faculty Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Распределение по факультетам
          </h3>
          <ExcelExportUtils
            data={facultyData}
            chartRef={facultyChartRef}
            filename="faculty_distribution"
            title="Faculty Equipment Distribution"
          />
        </div>
        <div ref={facultyChartRef}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={facultyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Всего оборудования</p>
              <p className="text-2xl font-bold">{filteredEquipment.length}</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Работает</p>
              <p className="text-2xl font-bold">
                {
                  filteredEquipment.filter((item) => item.status === "WORKING")
                    .length
                }
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Требует ремонта</p>
              <p className="text-2xl font-bold">
                {
                  filteredEquipment.filter(
                    (item) => item.status === "NEEDS_REPAIR"
                  ).length
                }
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Типов оборудования</p>
              <p className="text-2xl font-bold">{typeData.length}</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-purple-200" />
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

export default Statistics;
