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
  }),
});
