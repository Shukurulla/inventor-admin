// api/dashboardApi.js
import { api } from "../store/store";

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // University endpoints
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

    // Equipment endpoints
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

    // My equipment
    getMyEquipment: builder.query({
      query: () => "inventory/equipment/my-equipments/",
      providesTags: ["Equipment"],
    }),

    // My actions
    getMyActions: builder.query({
      query: () => "inventory/equipment/my-actions/",
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

    // Specifications
    getComputerSpecifications: builder.query({
      query: () => "inventory/computer-specifications/",
      providesTags: ["Equipment"],
    }),

    createComputerSpecification: builder.mutation({
      query: (data) => ({
        url: "inventory/create-comp-spec/",
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

    // Additional specifications
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
  }),
});
