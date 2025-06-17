import React from "react";
import {
  XMarkIcon,
  ComputerDesktopIcon,
  CpuChipIcon,
  CircleStackIcon,
  TvIcon,
  PrinterIcon,
  WifiIcon,
  ServerIcon,
  DevicePhoneMobileIcon,
  BuildingOfficeIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const EquipmentDetailModal = ({ isOpen, onClose, equipment }) => {
  if (!isOpen || !equipment) return null;

  const getEquipmentIcon = (typeName) => {
    const type = typeName?.toLowerCase() || "";
    if (type.includes("компьютер") || type.includes("computer"))
      return ComputerDesktopIcon;
    if (type.includes("принтер") || type.includes("printer"))
      return PrinterIcon;
    if (type.includes("телевизор") || type.includes("tv")) return TvIcon;
    if (type.includes("роутер") || type.includes("router")) return WifiIcon;
    if (type.includes("моноблок") || type.includes("ноутбук"))
      return ServerIcon;
    return ComputerDesktopIcon;
  };

  const IconComponent = getEquipmentIcon(equipment.type_data?.name);

  const renderSpecifications = () => {
    const typeName = equipment.type_data?.name?.toLowerCase() || "";

    // Компьютер спецификации
    if (typeName.includes("компьютер")) {
      const spec =
        equipment.computer_specification_data || equipment.computer_details;

      if (!spec)
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Технические характеристики компьютера не указаны</p>
          </div>
        );

      return (
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-900 flex items-center text-lg">
            <CpuChipIcon className="h-6 w-6 mr-3 text-blue-600" />
            Характеристики компьютера
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spec.cpu && (
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <div className="flex items-center">
                  <CpuChipIcon className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Процессор:
                  </span>
                </div>
                <div className="text-lg font-bold text-blue-800 mt-1">
                  {spec.cpu}
                </div>
              </div>
            )}

            {spec.ram && (
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <div className="flex items-center">
                  <CircleStackIcon className="h-5 w-5 mr-2 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    ОЗУ:
                  </span>
                </div>
                <div className="text-lg font-bold text-green-800 mt-1">
                  {spec.ram}
                </div>
              </div>
            )}

            {spec.storage && (
              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                <div className="flex items-center">
                  <CircleStackIcon className="h-5 w-5 mr-2 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">
                    Накопитель:
                  </span>
                </div>
                <div className="text-lg font-bold text-purple-800 mt-1">
                  {spec.storage}
                </div>
              </div>
            )}

            {spec.monitor_size && (
              <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
                <div className="flex items-center">
                  <ComputerDesktopIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-900">
                    Размер монитора:
                  </span>
                </div>
                <div className="text-lg font-bold text-indigo-800 mt-1">
                  {spec.monitor_size}"
                </div>
              </div>
            )}

            {spec.has_keyboard !== undefined && (
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <div className="flex items-center">
                  <DevicePhoneMobileIcon className="h-5 w-5 mr-2 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">
                    Клавиатура:
                  </span>
                </div>
                <div className="text-lg font-bold text-yellow-800 mt-1">
                  {spec.has_keyboard ? "Есть" : "Нет"}
                </div>
              </div>
            )}

            {spec.has_mouse !== undefined && (
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <div className="flex items-center">
                  <DevicePhoneMobileIcon className="h-5 w-5 mr-2 text-red-600" />
                  <span className="text-sm font-medium text-red-900">
                    Мышь:
                  </span>
                </div>
                <div className="text-lg font-bold text-red-800 mt-1">
                  {spec.has_mouse ? "Есть" : "Нет"}
                </div>
              </div>
            )}
          </div>

          {/* Диски для компьютера */}
          {spec.disk_specifications && spec.disk_specifications.length > 0 && (
            <div className="mt-6">
              <h5 className="font-medium text-gray-900 mb-4 flex items-center">
                <CircleStackIcon className="h-5 w-5 mr-2 text-gray-600" />
                Накопители
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {spec.disk_specifications.map((disk, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-gray-900">
                          {disk.disk_type}
                        </div>
                        <div className="text-sm text-gray-600">
                          Объем: {disk.capacity_gb}GB
                        </div>
                      </div>
                      <div className="text-2xl">
                        {disk.disk_type === "SSD" ||
                        disk.disk_type === "SATASSD"
                          ? "⚡"
                          : "💾"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Моноблок спецификации
    if (typeName.includes("моноблок")) {
      const spec =
        equipment.monoblok_specification_data || equipment.monoblok_char;

      if (!spec)
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Технические характеристики моноблока не указаны</p>
          </div>
        );

      return (
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <ServerIcon className="h-5 w-5 mr-2 text-green-600" />
            Характеристики моноблока
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spec.cpu && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900">
                  Процессор (CPU)
                </div>
                <div className="text-lg font-bold text-blue-800">
                  {spec.cpu}
                </div>
              </div>
            )}

            {spec.ram && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-900">
                  Оперативная память
                </div>
                <div className="text-lg font-bold text-green-800">
                  {spec.ram}
                </div>
              </div>
            )}

            {spec.monitor_size && (
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <div className="text-sm font-medium text-indigo-900">
                  Размер экрана
                </div>
                <div className="text-lg font-bold text-indigo-800">
                  {spec.monitor_size}
                </div>
              </div>
            )}

            {spec.has_keyboard !== undefined && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-sm font-medium text-yellow-900">
                  Клавиатура
                </div>
                <div className="text-lg font-bold text-yellow-800">
                  {spec.has_keyboard ? "✅ Есть" : "❌ Нет"}
                </div>
              </div>
            )}

            {spec.has_mouse !== undefined && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-sm font-medium text-red-900">Мышь</div>
                <div className="text-lg font-bold text-red-800">
                  {spec.has_mouse ? "✅ Есть" : "❌ Нет"}
                </div>
              </div>
            )}

            {spec.title && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-sm font-medium text-purple-900">
                  Модель
                </div>
                <div className="text-lg font-bold text-purple-800">
                  {spec.title}
                </div>
              </div>
            )}
          </div>

          {/* GPU спецификации для моноблока */}
          {spec.gpu_specifications && spec.gpu_specifications.length > 0 && (
            <div className="mt-6">
              <h5 className="font-medium text-gray-900 mb-4">🎮 Видеокарты</h5>
              <div className="space-y-3">
                {spec.gpu_specifications.map((gpu, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <div className="text-sm font-medium text-gray-600">
                          Модель:
                        </div>
                        <div className="font-bold text-gray-900">
                          {gpu.model}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">
                          Память:
                        </div>
                        <div className="font-bold text-gray-900">
                          {gpu.memory_gb}GB
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">
                          Тип памяти:
                        </div>
                        <div className="font-bold text-gray-900">
                          {gpu.memory_type}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Диски для моноблока */}
          {spec.disk_specifications && spec.disk_specifications.length > 0 && (
            <div className="mt-6">
              <h5 className="font-medium text-gray-900 mb-4 flex items-center">
                <CircleStackIcon className="h-5 w-5 mr-2 text-gray-600" />
                Накопители
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {spec.disk_specifications.map((disk, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-gray-900">
                          {disk.disk_type}
                        </div>
                        <div className="text-sm text-gray-600">
                          Объем: {disk.capacity_gb}GB
                        </div>
                      </div>
                      <div className="text-2xl">
                        {disk.disk_type === "SSD" ||
                        disk.disk_type === "SATASSD"
                          ? "⚡"
                          : "💾"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Ноутбук спецификации
    if (typeName.includes("ноутбук")) {
      const spec =
        equipment.notebook_specification_data || equipment.notebook_char;

      if (!spec)
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Технические характеристики ноутбука не указаны</p>
          </div>
        );

      return (
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-900 flex items-center">
            💻 Характеристики ноутбука
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spec.cpu && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900">
                  Процессор (CPU)
                </div>
                <div className="text-lg font-bold text-blue-800">
                  {spec.cpu}
                </div>
              </div>
            )}

            {spec.ram && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-900">
                  Оперативная память
                </div>
                <div className="text-lg font-bold text-green-800">
                  {spec.ram}
                </div>
              </div>
            )}

            {spec.storage && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-sm font-medium text-purple-900">
                  Накопитель
                </div>
                <div className="text-lg font-bold text-purple-800">
                  {spec.storage}
                </div>
              </div>
            )}

            {spec.monitor_size && (
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <div className="text-sm font-medium text-indigo-900">
                  Размер экрана
                </div>
                <div className="text-lg font-bold text-indigo-800">
                  {spec.monitor_size}"
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Проектор спецификации
    if (typeName.includes("проектор")) {
      const spec =
        equipment.projector_specification_data || equipment.projector_char;

      if (!spec)
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Технические характеристики проектора не указаны</p>
          </div>
        );

      return (
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-900 flex items-center text-lg">
            <TvIcon className="h-6 w-6 mr-3 text-green-600" />
            Характеристики проектора
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spec.model && (
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <div className="flex items-center">
                  <TagIcon className="h-5 w-5 mr-2 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    Модель:
                  </span>
                </div>
                <div className="text-lg font-bold text-green-800 mt-1">
                  {spec.model}
                </div>
              </div>
            )}

            {spec.lumens && (
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <div className="flex items-center">
                  <span className="text-yellow-600 mr-2">☀️</span>
                  <span className="text-sm font-medium text-yellow-900">
                    Яркость:
                  </span>
                </div>
                <div className="text-lg font-bold text-yellow-800 mt-1">
                  {spec.lumens} люмен
                </div>
              </div>
            )}

            {spec.resolution && (
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <div className="flex items-center">
                  <ComputerDesktopIcon className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Разрешение:
                  </span>
                </div>
                <div className="text-lg font-bold text-blue-800 mt-1">
                  {spec.resolution}
                </div>
              </div>
            )}

            {spec.throw_type && (
              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                <div className="flex items-center">
                  <span className="text-purple-600 mr-2">📏</span>
                  <span className="text-sm font-medium text-purple-900">
                    Тип проекции:
                  </span>
                </div>
                <div className="text-lg font-bold text-purple-800 mt-1">
                  {spec.throw_type === "standard"
                    ? "Стандартный"
                    : spec.throw_type === "short"
                    ? "Короткофокусный"
                    : spec.throw_type === "ultra_short"
                    ? "Ультракороткофокусный"
                    : spec.throw_type}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Принтер спецификации
    if (typeName.includes("принтер")) {
      const spec =
        equipment.printer_specification_data || equipment.printer_char;

      if (!spec)
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Технические характеристики принтера не указаны</p>
          </div>
        );

      return (
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-900 flex items-center">
            🖨️ Характеристики принтера
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spec.model && (
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <div className="text-sm font-medium text-pink-900">Модель</div>
                <div className="text-lg font-bold text-pink-800">
                  {spec.model}
                </div>
              </div>
            )}

            {spec.color !== undefined && (
              <div
                className={`p-4 rounded-lg border ${
                  spec.color
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="text-sm font-medium text-gray-900">
                  Цветная печать
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {spec.color ? "🌈 Цветная" : "⚫ Черно-белая"}
                </div>
              </div>
            )}

            {spec.duplex !== undefined && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900">
                  Двусторонняя печать
                </div>
                <div className="text-lg font-bold text-blue-800">
                  {spec.duplex ? "📄📄 Поддерживается" : "📄 Односторонняя"}
                </div>
              </div>
            )}

            {spec.serial_number && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-gray-900">
                  Серийный номер
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {spec.serial_number}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Телевизор спецификации
    if (typeName.includes("телевизор")) {
      const spec = equipment.tv_specification_data || equipment.tv_char;

      if (!spec)
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Технические характеристики телевизора не указаны</p>
          </div>
        );

      return (
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-900 flex items-center">
            📺 Характеристики телевизора
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spec.model && (
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="text-sm font-medium text-orange-900">
                  Модель
                </div>
                <div className="text-lg font-bold text-orange-800">
                  {spec.model}
                </div>
              </div>
            )}

            {spec.screen_size && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900">
                  Диагональ экрана
                </div>
                <div className="text-lg font-bold text-blue-800">
                  {spec.screen_size}" 📏
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Роутер спецификации
    if (typeName.includes("роутер")) {
      const spec = equipment.router_specification_data || equipment.router_char;

      if (!spec)
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Технические характеристики роутера не указаны</p>
          </div>
        );

      return (
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-900 flex items-center">
            📡 Характеристики роутера
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spec.model && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-sm font-medium text-red-900">Модель</div>
                <div className="text-lg font-bold text-red-800">
                  {spec.model}
                </div>
              </div>
            )}

            {spec.ports && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900">
                  Количество портов
                </div>
                <div className="text-lg font-bold text-blue-800">
                  {spec.ports} 🔌
                </div>
              </div>
            )}

            {spec.wifi_standart && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-900">
                  Wi-Fi стандарт
                </div>
                <div className="text-lg font-bold text-green-800">
                  {spec.wifi_standart} 📶
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Удлинитель спецификации
    if (typeName.includes("удлинитель")) {
      const spec =
        equipment.extender_specification_data || equipment.extender_char;

      if (!spec)
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Технические характеристики удлинителя не указаны</p>
          </div>
        );

      return (
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-900 flex items-center">
            🔌 Характеристики удлинителя
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spec.ports && (
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <div className="text-sm font-medium text-indigo-900">
                  Количество портов
                </div>
                <div className="text-lg font-bold text-indigo-800">
                  {spec.ports} розеток ⚡
                </div>
              </div>
            )}

            {spec.length && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-900">
                  Длина кабеля
                </div>
                <div className="text-lg font-bold text-green-800">
                  {spec.length}м 📏
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Электронная доска спецификации
    if (typeName.includes("доска") || typeName.includes("whiteboard")) {
      const spec =
        equipment.whiteboard_specification_data || equipment.whiteboard_char;

      if (!spec)
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Технические характеристики электронной доски не указаны</p>
          </div>
        );

      return (
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-900 flex items-center">
            📋 Характеристики электронной доски
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spec.model && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-sm font-medium text-purple-900">
                  Модель
                </div>
                <div className="text-lg font-bold text-purple-800">
                  {spec.model}
                </div>
              </div>
            )}

            {spec.screen_size && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900">
                  Размер экрана
                </div>
                <div className="text-lg font-bold text-blue-800">
                  {spec.screen_size}" 📐
                </div>
              </div>
            )}

            {spec.touch_type && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-900">
                  Тип сенсора
                </div>
                <div className="text-lg font-bold text-green-800">
                  {spec.touch_type === "infrared"
                    ? "🔴 Инфракрасный"
                    : spec.touch_type === "capacitive"
                    ? "⚡ Емкостный"
                    : spec.touch_type === "resistive"
                    ? "👆 Резистивный"
                    : spec.touch_type}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Монитор спецификации
    if (typeName.includes("монитор")) {
      const spec =
        equipment.monitor_specification_data || equipment.monitor_char;

      if (!spec)
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Технические характеристики монитора не указаны</p>
          </div>
        );

      return (
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-900 flex items-center">
            🖥️ Характеристики монитора
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spec.model && (
              <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                <div className="text-sm font-medium text-cyan-900">Модель</div>
                <div className="text-lg font-bold text-cyan-800">
                  {spec.model}
                </div>
              </div>
            )}

            {spec.screen_size && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900">
                  Диагональ
                </div>
                <div className="text-lg font-bold text-blue-800">
                  {spec.screen_size} 📏
                </div>
              </div>
            )}

            {spec.resolution && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-sm font-medium text-purple-900">
                  Разрешение
                </div>
                <div className="text-lg font-bold text-purple-800">
                  {spec.resolution} 🎯
                </div>
              </div>
            )}

            {spec.panel_type && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-900">
                  Тип матрицы
                </div>
                <div className="text-lg font-bold text-green-800">
                  {spec.panel_type} ⚡
                </div>
              </div>
            )}

            {spec.refresh_rate && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-sm font-medium text-yellow-900">
                  Частота обновления
                </div>
                <div className="text-lg font-bold text-yellow-800">
                  {spec.refresh_rate}Hz ⚡
                </div>
              </div>
            )}

            {spec.serial_number && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-gray-900">
                  Серийный номер
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {spec.serial_number}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <IconComponent className="w-8 h-8 text-gray-400" />
        </div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">
          Технические характеристики
        </h4>
        <p className="text-gray-500">
          Характеристики для данного типа оборудования не найдены
        </p>
        <div className="mt-4 text-sm text-gray-400">
          Тип оборудования: {equipment.type_data?.name || "Неизвестно"}
        </div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "WORKING":
        return "bg-green-100 text-green-800 border-green-200";
      case "NEEDS_REPAIR":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "DISPOSED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {equipment.name ||
                      equipment.type_data?.name ||
                      "Оборудование"}
                  </h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        equipment.status
                      )}`}
                    >
                      {getStatusText(equipment.status)}
                    </span>
                    {equipment.is_active !== undefined && (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          equipment.is_active
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {equipment.is_active ? "Активно" : "Неактивно"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Main Equipment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">ИНН:</span>
                  <span className="font-semibold text-lg">
                    {equipment.inn || equipment.inventory_number || "0"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Статус:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      equipment.status
                    )}`}
                  >
                    {getStatusText(equipment.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Тип:</span>
                  <span className="font-semibold text-lg">
                    {equipment.type_data?.name || "Неизвестно"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Активность:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      equipment.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {equipment.is_active ? "Активно" : "Неактивно"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Описание</h5>
                <p className="text-gray-700 text-sm">
                  {equipment.description || "Описание не указано"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">
                  Местоположение
                </h5>
                <p className="text-gray-700 text-sm">
                  {equipment.room_data
                    ? `${equipment.room_data.number} - ${equipment.room_data.name}`
                    : "Местоположение не указано"}
                </p>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="border-t border-gray-200 pt-6">
              {renderSpecifications()}
            </div>

            {/* Creation Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-gray-600" />
                Информация о создании
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Автор:</span>
                    <p className="font-medium">
                      {equipment.author
                        ? `${equipment.author.first_name} ${equipment.author.last_name}`
                        : "Не указан"}
                    </p>
                  </div>

                  {equipment.author?.email && (
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium">{equipment.author.email}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Роль автора:</span>
                    <p className="font-medium">
                      {equipment.author?.role === "admin"
                        ? "Администратор"
                        : "Менеджер"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">
                      Дата создания:
                    </span>
                    <p className="font-medium">
                      {equipment.created_at
                        ? new Date(equipment.created_at).toLocaleDateString(
                            "ru"
                          )
                        : "Не указана"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailModal;
