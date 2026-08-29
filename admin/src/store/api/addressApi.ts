import { api, BASE_URL } from "../api";

const API_URLS = {
    GET_ADDRESS: `${BASE_URL}/user/address`,
    ADD_OR_UPDATE_ADDRESS: `${BASE_URL}/user/address/create-or-update`,
};

export const addressApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAddress: builder.query<any[], void>({
            query: () => ({
                url: API_URLS.GET_ADDRESS,
                method: "GET",
            }),
            providesTags: ["Address"],
        }),

        addOrUpdateAddress: builder.mutation<any, any>({
            query: (address) => ({
                url: API_URLS.ADD_OR_UPDATE_ADDRESS,
                method: "POST",
                body: address,
            }),
            invalidatesTags: ["Address"],
        }),
    }),
});

export const {
    useGetAddressQuery,
    useAddOrUpdateAddressMutation,
} = addressApi;