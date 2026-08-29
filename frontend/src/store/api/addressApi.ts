import { api, BASE_URL } from "../api";

const API_URLS = {
  GET_ADDRESS: `${BASE_URL}/user/address`,
  ADD_OR_UPDATE_ADDRESS: `${BASE_URL}/user/address/create-or-update`,
};

export interface Address {
  _id: string;
  user: string;
  addressLine1: string;
  addressLine2?: string;
  phoneNumber?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  pickupLocation?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface GetAddressResponse {
  success: boolean;
  message: string;
  data: Address[];
}

interface AddressMutationResponse {
  success: boolean;
  message: string;
  data: Address;
}

export const addressApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAddress: builder.query<GetAddressResponse, void>({
      query: () => ({
        url: API_URLS.GET_ADDRESS,
        method: "GET",
      }),
      providesTags: ["Address"],
    }),

    addOrUpdateAddress: builder.mutation<
      AddressMutationResponse,
      Partial<Address> & {
        addressId?: string;
      }
    >({
      query: (address) => ({
        url: API_URLS.ADD_OR_UPDATE_ADDRESS,
        method: "POST",
        body: address,
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const { useGetAddressQuery, useAddOrUpdateAddressMutation } = addressApi;
