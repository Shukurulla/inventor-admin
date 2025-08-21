// api/dashboardApi.js - Updated with correct endpoints from Postman
import { api } from "../store/store";

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // University endpoints
    getComputerSpecifications: builder.query({
      query: () => "inventory/computer-specification/",
      providesTags: ["Specification"],
    }),
    createComputerSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/computer-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    updateComputerSpecification: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `inventory/computer-specification/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    deleteComputerSpecification: builder.mutation({
      query: (id) => ({
        url: `inventory/computer-specification/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Specification"],
    }),

    // Projector specifications
    getProjectorSpecifications: builder.query({
      query: () => "inventory/projector-specification/",
      providesTags: ["Specification"],
    }),
    createProjectorSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/projector-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    updateProjectorSpecification: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `inventory/projector-specification/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    deleteProjectorSpecification: builder.mutation({
      query: (id) => ({
        url: `inventory/projector-specification/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Specification"],
    }),

    // Printer specifications
    getPrinterSpecifications: builder.query({
      query: () => "inventory/printer-specification/",
      providesTags: ["Specification"],
    }),
    createPrinterSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/printer-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    updatePrinterSpecification: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `inventory/printer-specification/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    deletePrinterSpecification: builder.mutation({
      query: (id) => ({
        url: `inventory/printer-specification/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Specification"],
    }),

    // TV specifications
    getTvSpecifications: builder.query({
      query: () => "inventory/tv-specification/",
      providesTags: ["Specification"],
    }),
    createTvSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/tv-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    updateTvSpecification: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `inventory/tv-specification/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    deleteTvSpecification: builder.mutation({
      query: (id) => ({
        url: `inventory/tv-specification/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Specification"],
    }),

    // Router specifications
    getRouterSpecifications: builder.query({
      query: () => "inventory/router-specification/",
      providesTags: ["Specification"],
    }),
    createRouterSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/router-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    updateRouterSpecification: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `inventory/router-specification/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    deleteRouterSpecification: builder.mutation({
      query: (id) => ({
        url: `inventory/router-specification/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Specification"],
    }),

    // Notebook specifications
    getNotebookSpecifications: builder.query({
      query: () => "inventory/notebook-specification/",
      providesTags: ["Specification"],
    }),
    createNotebookSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/notebook-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    updateNotebookSpecification: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `inventory/notebook-specification/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    deleteNotebookSpecification: builder.mutation({
      query: (id) => ({
        url: `inventory/notebook-specification/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Specification"],
    }),

    // Monoblok specifications
    getMonoblokSpecifications: builder.query({
      query: () => "inventory/monoblok-specification/",
      providesTags: ["Specification"],
    }),
    createMonoblokSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/monoblok-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    updateMonoblokSpecification: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `inventory/monoblok-specification/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    deleteMonoblokSpecification: builder.mutation({
      query: (id) => ({
        url: `inventory/monoblok-specification/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Specification"],
    }),

    // Whiteboard specifications
    getWhiteboardSpecifications: builder.query({
      query: () => "inventory/whiteboard-specification/",
      providesTags: ["Specification"],
    }),
    createWhiteboardSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/whiteboard-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    updateWhiteboardSpecification: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `inventory/whiteboard-specification/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    deleteWhiteboardSpecification: builder.mutation({
      query: (id) => ({
        url: `inventory/whiteboard-specification/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Specification"],
    }),

    // Extender specifications
    getExtenderSpecifications: builder.query({
      query: () => "inventory/extender-specification/",
      providesTags: ["Specification"],
    }),
    createExtenderSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/extender-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    updateExtenderSpecification: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `inventory/extender-specification/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    deleteExtenderSpecification: builder.mutation({
      query: (id) => ({
        url: `inventory/extender-specification/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Specification"],
    }),

    // Monitor specifications
    getMonitorSpecifications: builder.query({
      query: () => "inventory/monitor-specification/",
      providesTags: ["Specification"],
    }),
    createMonitorSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/monitor-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    updateMonitorSpecification: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `inventory/monitor-specification/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Specification"],
    }),
    deleteMonitorSpecification: builder.mutation({
      query: (id) => ({
        url: `inventory/monitor-specification/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Specification"],
    }),

    // All equipment for admin (YANGI QO'SHILDI)
    getAllEquipment: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);
        if (params.building_id)
          queryParams.append("building_id", params.building_id);
        if (params.room_id) queryParams.append("room_id", params.room_id);
        if (params.type_id) queryParams.append("type_id", params.type_id);
        if (params.status) queryParams.append("status", params.status);
        if (params.author_id) queryParams.append("author_id", params.author_id);

        const queryString = queryParams.toString();
        return queryString
          ? `inventory/equipment/filter/?${queryString}`
          : "inventory/equipment/";
      },
      providesTags: ["Equipment"],
    }),
    getUniversity: builder.query({
      query: () => "university/",
      providesTags: ["University"],
    }),

    // Buildings endpoints
    getBuildings: builder.query({
      query: () => "university/buildings/",
      providesTags: ["Building"],
    }),
    createBuilding: builder.mutation({
      query: (data) => ({
        url: "university/buildings/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Building"],
    }),
    updateBuilding: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `university/buildings/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Building"],
    }),
    deleteBuilding: builder.mutation({
      query: (id) => ({
        url: `university/buildings/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Building"],
    }),

    // Floors endpoints
    getFloors: builder.query({
      query: (buildingId) => `university/floors/?building_id=${buildingId}`,
      providesTags: ["Floor"],
    }),
    getAllFloors: builder.query({
      query: () => "university/floors/",
      providesTags: ["Floor"],
    }),
    createFloor: builder.mutation({
      query: (data) => ({
        url: "university/floors/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Floor"],
    }),
    updateFloor: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `university/floors/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Floor"],
    }),
    deleteFloor: builder.mutation({
      query: (id) => ({
        url: `university/floors/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Floor"],
    }),

    // Faculties endpoints
    getFaculties: builder.query({
      query: () => "university/faculties/",
      providesTags: ["Faculty"],
    }),
    createFaculty: builder.mutation({
      query: (data) => ({
        url: "university/faculties/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Faculty"],
    }),
    updateFaculty: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `university/faculties/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Faculty"],
    }),
    deleteFaculty: builder.mutation({
      query: (id) => ({
        url: `university/faculties/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Faculty"],
    }),

    // Rooms endpoints
    getRooms: builder.query({
      query: () => "university/rooms/",
      providesTags: ["Room"],
    }),
    createRoom: builder.mutation({
      query: (data) => ({
        url: "university/rooms/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Room"],
    }),
    updateRoom: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `university/rooms/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Room"],
    }),
    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `university/rooms/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Room"],
    }),

    // Equipment endpoints - Updated based on Postman collection
    getEquipment: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);
        if (params.building_id)
          queryParams.append("building_id", params.building_id);

        const queryString = queryParams.toString();
        return queryString
          ? `inventory/equipment/filter/?${queryString}`
          : "inventory/equipment/";
      },
      providesTags: ["Equipment"],
    }),

    // My equipment - Correct endpoint from Postman
    getMyEquipment: builder.query({
      query: () => "inventory/equipment/my-equipments/",
      providesTags: ["Equipment"],
    }),

    // My actions - User's activity
    getMyActions: builder.query({
      query: () => "inventory/equipment/my-actions/",
      providesTags: ["Equipment"],
    }),

    // Equipment by room
    getEquipmentByRoom: builder.query({
      query: (roomId) => `inventory/equipment/equipment-by-room/${roomId}/`,
      providesTags: ["Equipment"],
    }),

    // Equipment types
    getEquipmentTypes: builder.query({
      query: () => "inventory/equipment-types/",
      providesTags: ["Equipment"],
    }),

    // Equipment CRUD
    createEquipment: builder.mutation({
      query: (data) => ({
        url: "inventory/equipment/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    updateEquipment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `inventory/equipment/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    deleteEquipment: builder.mutation({
      query: (id) => ({
        url: `inventory/equipment/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Equipment"],
    }),

    // Equipment operations
    moveEquipment: builder.mutation({
      query: (data) => ({
        url: "inventory/equipment/move-equipment/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    sendToRepair: builder.mutation({
      query: (equipmentId) => ({
        url: `inventory/equipment/${equipmentId}/send-to-repair/`,
        method: "POST",
      }),
      invalidatesTags: ["Equipment"],
    }),

    disposeEquipment: builder.mutation({
      query: ({ equipmentId, ...data }) => ({
        url: `inventory/equipment/${equipmentId}/dispose/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    // Repairs endpoints
    getRepairs: builder.query({
      query: () => "inventory/repairs/",
      providesTags: ["Equipment"],
    }),

    getRepairById: builder.query({
      query: (id) => `inventory/repairs/${id}/`,
      providesTags: ["Equipment"],
    }),

    completeRepair: builder.mutation({
      query: (repairId) => ({
        url: `inventory/repairs/${repairId}/complete/`,
        method: "POST",
      }),
      invalidatesTags: ["Equipment"],
    }),

    failRepair: builder.mutation({
      query: (repairId) => ({
        url: `inventory/repairs/${repairId}/fail/`,
        method: "POST",
      }),
      invalidatesTags: ["Equipment"],
    }),

    // Disposals endpoints
    getDisposals: builder.query({
      query: () => "inventory/disposals/",
      providesTags: ["Equipment"],
    }),

    getDisposalById: builder.query({
      query: (id) => `inventory/disposals/${id}/`,
      providesTags: ["Equipment"],
    }),

    // Movement history
    getMovementHistory: builder.query({
      query: () => "inventory/movement-history/",
      providesTags: ["Equipment"],
    }),

    // Contracts
    getContracts: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);

        const queryString = queryParams.toString();
        return queryString
          ? `inventory/contracts/?${queryString}`
          : "inventory/contracts/";
      },
      providesTags: ["Equipment"],
    }),

    createContract: builder.mutation({
      query: (data) => ({
        url: "inventory/contracts/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    // Specifications - Updated endpoints
    getComputerSpecifications: builder.query({
      query: () => "inventory/computer-specifications/",
      providesTags: ["Equipment"],
    }),

    createComputerSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/computer-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    getProjectorSpecifications: builder.query({
      query: () => "inventory/projector-specification/",
      providesTags: ["Equipment"],
    }),

    createProjectorSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/projector-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    // Additional specifications from Postman
    createPrinterSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/printer-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    createExtenderSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/extender-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    createTvSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/tv-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    createRouterSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/router-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    createWhiteboardSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/whiteboard-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    createNotebookSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/notebook-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    createMonoblokSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/monoblok-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    createMonitorSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/monitor-specification/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    // Bulk operations
    bulkCreateEquipment: builder.mutation({
      query: (data) => ({
        url: "inventory/equipment/bulk-create/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    bulkUpdateInn: builder.mutation({
      query: (data) => ({
        url: "inventory/equipment/bulk-update-inn/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    // QR Scanner
    scanQR: builder.mutation({
      query: (data) => ({
        url: "inventory/equipment/scan-qr/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),

    // Generate QR PDF
    generateQRPDF: builder.mutation({
      query: (data) => ({
        url: "inventory/equipment/generate-qr-pdf/",
        method: "POST",
        body: data,
      }),
    }),

    // Specification count
    getSpecificationCount: builder.query({
      query: () => "inventory/specifications/specification-count/",
      providesTags: ["Equipment"],
    }),

    // Room operations
    getRoomsByBuilding: builder.query({
      query: (buildingId) =>
        `inventory/equipment/rooms-by-building/${buildingId}`,
      providesTags: ["Room", "Equipment"],
    }),

    getRoomsInBuilding: builder.query({
      query: (buildingId) =>
        `university/rooms_in_building/?building_id=${buildingId}`,
      providesTags: ["Room"],
    }),

    // Equipment search and characteristics
    getAllCharacteristics: builder.query({
      query: () => "inventory/equipment-search/list_all_characteristics/",
      providesTags: ["Equipment"],
    }),
  }),
});

export const {
  // University
  useGetUniversityQuery,
  useGetBuildingsQuery,
  useCreateBuildingMutation,
  useUpdateBuildingMutation,
  useDeleteBuildingMutation,

  // Floors
  useGetFloorsQuery,
  useGetAllFloorsQuery,
  useCreateFloorMutation,
  useUpdateFloorMutation,
  useDeleteFloorMutation,

  // Faculties
  useGetFacultiesQuery,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,

  // Rooms
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useGetRoomsByBuildingQuery,
  useGetRoomsInBuildingQuery,

  // Equipment
  useGetEquipmentQuery,
  useGetMyEquipmentQuery,
  useGetMyActionsQuery,
  useGetEquipmentByRoomQuery,
  useGetEquipmentTypesQuery,
  useCreateEquipmentMutation,
  useUpdateEquipmentMutation,
  useDeleteEquipmentMutation,
  useMoveEquipmentMutation,
  useSendToRepairMutation,
  useDisposeEquipmentMutation,

  // Repairs & Disposals
  useGetRepairsQuery,
  useGetRepairByIdQuery,
  useCompleteRepairMutation,
  useFailRepairMutation,
  useGetDisposalsQuery,
  useGetDisposalByIdQuery,

  // History & Contracts
  useGetMovementHistoryQuery,
  useGetContractsQuery,
  useCreateContractMutation,

  // Bulk operations
  useBulkCreateEquipmentMutation,
  useBulkUpdateInnMutation,
  useScanQRMutation,
  useGenerateQRPDFMutation,
  useGetSpecificationCountQuery,
  useGetAllCharacteristicsQuery,
  // Specifications hooks
  useGetComputerSpecificationsQuery,
  useCreateComputerSpecificationMutation,
  useUpdateComputerSpecificationMutation,
  useDeleteComputerSpecificationMutation,

  useGetProjectorSpecificationsQuery,
  useCreateProjectorSpecificationMutation,
  useUpdateProjectorSpecificationMutation,
  useDeleteProjectorSpecificationMutation,

  useGetPrinterSpecificationsQuery,
  useCreatePrinterSpecificationMutation,
  useUpdatePrinterSpecificationMutation,
  useDeletePrinterSpecificationMutation,

  useGetTvSpecificationsQuery,
  useCreateTvSpecificationMutation,
  useUpdateTvSpecificationMutation,
  useDeleteTvSpecificationMutation,

  useGetRouterSpecificationsQuery,
  useCreateRouterSpecificationMutation,
  useUpdateRouterSpecificationMutation,
  useDeleteRouterSpecificationMutation,

  useGetNotebookSpecificationsQuery,
  useCreateNotebookSpecificationMutation,
  useUpdateNotebookSpecificationMutation,
  useDeleteNotebookSpecificationMutation,

  useGetMonoblokSpecificationsQuery,
  useCreateMonoblokSpecificationMutation,
  useUpdateMonoblokSpecificationMutation,
  useDeleteMonoblokSpecificationMutation,

  useGetWhiteboardSpecificationsQuery,
  useCreateWhiteboardSpecificationMutation,
  useUpdateWhiteboardSpecificationMutation,
  useDeleteWhiteboardSpecificationMutation,

  useGetExtenderSpecificationsQuery,
  useCreateExtenderSpecificationMutation,
  useUpdateExtenderSpecificationMutation,
  useDeleteExtenderSpecificationMutation,

  useGetMonitorSpecificationsQuery,
  useCreateMonitorSpecificationMutation,
  useUpdateMonitorSpecificationMutation,
  useDeleteMonitorSpecificationMutation,

  // Admin equipment
  useGetAllEquipmentQuery,
} = dashboardApi;
