import { api, BASE_URL } from "../api";

const API_URLS = {
  UPLOAD_PRODUCT_EXCEL: `${BASE_URL}/product-imports/upload`,
  PRODUCT_IMPORTS: `${BASE_URL}/product-imports`,
  DOWNLOAD_PRODUCT_IMPORT_ERRORS: (id: string) =>
    `${BASE_URL}/product-imports/${id}/errors/download`,
};

export const productImportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Upload Excel
    uploadProductExcel: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: API_URLS.UPLOAD_PRODUCT_EXCEL,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ProductImport"],
    }),

    // Get ALL Product Imports
    getProductImports: builder.query<any, void>({
      query: () => API_URLS.PRODUCT_IMPORTS,
      providesTags: ["ProductImport"],
    }),

    // Get Product Import By ID
    getProductImportById: builder.query<any, string>({
      query: (id) => `${API_URLS.PRODUCT_IMPORTS}/${id}`,
      providesTags: ["ProductImport"],
    }),

    // Delete Product Import
    deleteProductImport: builder.mutation<any, string>({
      query: (id) => ({
        url: `${API_URLS.PRODUCT_IMPORTS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductImport"],
    }),
   
  }),

  overrideExisting: false,
});

export const {
  useUploadProductExcelMutation,
  useGetProductImportsQuery,
  useGetProductImportByIdQuery,
  useDeleteProductImportMutation,
} = productImportApi;
