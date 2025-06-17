import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  UserIcon,
  ComputerDesktopIcon,
  CalendarIcon,
  MapPinIcon,
  TagIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { usersApi } from '../api/usersApi';
import { dashboardApi } from '../api/dashboardApi';
import EquipmentDetailModal from '../components/EquipmentDetailModal';

const UserDetail = () => {
  const { userId } = useParams();
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [equipmentModal, setEquipmentModal] = useState(false);

  // Get user data
  const { data: users = [] } = usersApi.useGetUsersQuery();
  const user = users.find(u => u.id === parseInt(userId));

  // Get equipment data
  const { data: equipmentResponse = {} } = dashboardApi.useGetEquipmentQuery();
  const { data: rooms = [] } = dashboardApi.useGetRoomsQuery();
  const { data: buildings = [] } = dashboardApi.useGetBuildingsQuery();

  // Extract equipment array from response
  const allEquipment = Array.isArray(equipmentResponse) 
    ? equipmentResponse 
    : (equipmentResponse.results || equipmentResponse.data || []);

  // Filter equipment created by this user (assuming there's a created_by field)
  const userEquipment = allEquipment.filter(item => 
    item.created_by === parseInt(userId) || 
    item.responsible_person === parseInt(userId) ||
    item.author?.id === parseInt(userId)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'WORKING': return 'bg-green-100 text-green-800';
      case 'NEEDS_REPAIR': return 'bg-yellow-100 text-yellow-800';
      case 'DISPOSED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'NEW': return 'Новое';
      case 'WORKING': return 'Работает';
      case 'NEEDS_REPAIR': return 'Требует ремонта';
      case 'DISPOSED': return 'Утилизировано';
      default: return status;
    }
  };

  const getRoomInfo = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return 'Не указано';
    
    const building = buildings.find(b => b.id === room.building);
    return `${room.number} - ${room.name} (${building?.name || 'Неизвестное здание'})`;
  };

  const openEquipmentModal = (equipment) => {
    setSelectedEquipment(equipment);
    setEquipmentModal(true);
  };

  const closeEquipmentModal = () => {
    setSelectedEquipment(null);
    setEquipmentModal(false);
  };

  const getEquipmentTypeIcon = (typeName) => {
    if (!typeName) return ComputerDesktopIcon;
    const type = typeName.toLowerCase();
    if (type.includes('компьютер') || type.includes('computer')) return ComputerDesktopIcon;
    if (type.includes('принтер') || type.includes('printer')) return '🖨️';
    if (type.includes('проектор') || type.includes('projector')) return '📽️';
    if (type.includes('телевизор') || type.includes('tv')) return '📺';
    if (type.includes('роутер') || type.includes('router')) return '📡';
    if (type.includes('ноутбук') || type.includes('notebook')) return '💻';
    if (type.includes('моноблок') || type.includes('monoblok')) return '🖥️';
    if (type.includes('доска') || type.includes('whiteboard')) return '📋';
    if (type.includes('удлинитель') || type.includes('extender')) return '🔌';
    if (type.includes('монитор') || type.includes('monitor')) return '🖥️';
    return ComputerDesktopIcon;
  };

  const getSpecificationSummary = (equipment) => {
    const typeName = equipment.type_data?.name?.toLowerCase() || '';
    
    // Компьютер/Моноблок/Ноутбук
    if (typeName.includes('компьютер') || typeName.includes('моноблок') || typeName.includes('ноутбук')) {
      const spec = equipment.computer_specification_data || equipment.computer_details || 
                   equipment.monoblok_specification_data || equipment.notebook_specification_data;
      if (spec) {
        const parts = [];
        if (spec.cpu) parts.push(`CPU: ${spec.cpu}`);
        if (spec.ram) parts.push(`RAM: ${spec.ram}`);
        if (spec.storage) parts.push(`Storage: ${spec.storage}`);
        return parts.length > 0 ? parts.join(' • ') : null;
      }
    }
    
    // Проектор
    if (typeName.includes('проектор')) {
      const spec = equipment.projector_specification_data || equipment.projector_char;
      if (spec) {
        const parts = [];
        if (spec.model) parts.push(spec.model);
        if (spec.lumens) parts.push(`${spec.lumens} люмен`);
        if (spec.resolution) parts.push(spec.resolution);
        return parts.length > 0 ? parts.join(' • ') : null;
      }
    }
    
    // Принтер
    if (typeName.includes('принтер')) {
      const spec = equipment.printer_specification_data || equipment.printer_char;
      if (spec) {
        const parts = [];
        if (spec.model) parts.push(spec.model);
        if (spec.color !== undefined) parts.push(spec.color ? 'Цветной' : 'Ч/б');
        if (spec.duplex !== undefined) parts.push(spec.duplex ? 'Двусторонний' : 'Односторонний');
        return parts.length > 0 ? parts.join(' • ') : null;
      }
    }
    
    // Другие типы можно добавить аналогично
    return null;
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">Пользователь не найден</div>
        <Link
          to="/users"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/users"
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Назад
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Профиль пользователя
            </h1>
            <p className="text-sm text-gray-500">
              Детальная информация и история активности
            </p>
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {user.first_name?.charAt(0) || user.username?.charAt(0)}
              </span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {user.first_name} {user.last_name}
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">
                      Имя пользователя: <span className="font-medium">@{user.username}</span>
                    </span>
                  </div>
              </div>
              
              <div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <TagIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">
                      Роль: <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.role === 'admin' ? 'Администратор' : 'Менеджер'}
                      </span>
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">
                      Зарегистрирован: <span className="font-medium">
                        {user.date_joined ? new Date(user.date_joined).toLocaleDateString('ru') : 'Не указано'}
                      </span>
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <ComputerDesktopIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">
                      Добавлено оборудования: <span className="font-medium text-blue-600">{userEquipment.length}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ComputerDesktopIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Всего оборудования</p>
              <p className="text-2xl font-semibold text-gray-900">{userEquipment.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Работает</p>
              <p className="text-2xl font-semibold text-gray-900">
                {userEquipment.filter(item => item.status === 'WORKING').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Требует ремонта</p>
              <p className="text-2xl font-semibold text-gray-900">
                {userEquipment.filter(item => item.status === 'NEEDS_REPAIR').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Новое</p>
              <p className="text-2xl font-semibold text-gray-900">
                {userEquipment.filter(item => item.status === 'NEW').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment List */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            История добавленного оборудования
          </h3>
          <p className="text-sm text-gray-500">
            Оборудование, добавленное или управляемое этим пользователем
          </p>
        </div>
        
        <div className="p-6">
          {userEquipment.length === 0 ? (
            <div className="text-center py-8">
              <ComputerDesktopIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Нет оборудования</h3>
              <p className="mt-1 text-sm text-gray-500">
                Этот пользователь еще не добавил оборудование в систему.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {userEquipment.map((equipment) => {
                const IconComponent = getEquipmentTypeIcon(equipment.type_data?.name);
                const specSummary = getSpecificationSummary(equipment);
                
                return (
                  <div
                    key={equipment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300"
                    onClick={() => openEquipmentModal(equipment)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            {typeof IconComponent === 'string' ? (
                              <span className="text-xl">{IconComponent}</span>
                            ) : (
                              <IconComponent className="h-6 w-6 text-white" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              {equipment.name || equipment.type_data?.name || 'Без названия'}
                            </h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(equipment.status)}`}>
                              {getStatusText(equipment.status)}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Инв. №: {equipment.inventory_number || equipment.inn || 'Не указан'}</span>
                              <span>•</span>
                              <span>Сер. №: {equipment.serial_number || 'Не указан'}</span>
                            </div>
                            
                            {specSummary && (
                              <div className="text-sm text-blue-600 font-medium">
                                {specSummary}
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <MapPinIcon className="h-4 w-4" />
                              <span>{getRoomInfo(equipment.room_data?.id)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {equipment.created_at ? new Date(equipment.created_at).toLocaleDateString('ru') : 'Не указано'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Equipment Detail Modal */}
      {/* {equipmentModal && selectedEquipment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeEquipmentModal}
            />
            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Детали оборудования
                  </h3>
                  <button
                    onClick={closeEquipmentModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Основная информация</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Название:</span>
                        <p className="font-medium">{selectedEquipment.name || 'Не указано'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Тип:</span>
                        <p className="font-medium">{selectedEquipment.type_data?.name || 'Не указано'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Состояние:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedEquipment.status)}`}>
                          {getStatusText(selectedEquipment.status)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Активность:</span>
                        <p className="font-medium">{selectedEquipment.is_active ? 'Активно' : 'Неактивно'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Технические данные</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Инвентарный номер:</span>
                        <p className="font-medium">{selectedEquipment.inventory_number || 'Не указан'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Серийный номер:</span>
                        <p className="font-medium">{selectedEquipment.serial_number || 'Не указан'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Год выпуска:</span>
                        <p className="font-medium">{selectedEquipment.manufacture_year || 'Не указан'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Стоимость:</span>
                        <p className="font-medium">{selectedEquipment.price ? `${selectedEquipment.price}` : 'Не указана'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Местоположение</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">{getRoomInfo(selectedEquipment.room_data?.id)}</p>
                  </div>
                </div>
                
                {selectedEquipment.description && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Описание</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{selectedEquipment.description}</p>
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Даты</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Дата создания:</span>
                      <p className="font-medium">
                        {selectedEquipment.created_at ? new Date(selectedEquipment.created_at).toLocaleString('ru') : 'Не указано'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Последнее обновление:</span>
                      <p className="font-medium">
                        {selectedEquipment.updated_at ? new Date(selectedEquipment.updated_at).toLocaleString('ru') : 'Не указано'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200">
                <button
                  onClick={closeEquipmentModal}
                  className="w-full inline-flex justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
    </div>
  );
};

export default UserDetail;