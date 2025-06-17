// api/authApi.js
import { api } from "../store/store";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "user/login/",
        method: "POST",
        body: credentials,
      }),
    }),
    refresh: builder.mutation({
      query: (refreshToken) => ({
        url: "user/login/refresh/", // Corrected endpoint from Postman
        method: "POST",
        body: { refresh: refreshToken },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "user/logout/",
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation, useLogoutMutation } =
  authApi;
