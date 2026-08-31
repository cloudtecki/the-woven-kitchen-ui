import { baseApi } from "core/api/base.api";
import { STORE_TAGS } from "core/base/const/store";
import { ProductListApiResponse, ProductParams } from "core/base/type/product";
import { ProductService } from "core/service/product.service";

export const ProductApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProduct: builder.query<ProductListApiResponse, ProductParams>({

            queryFn: async (payload: ProductParams) => {
                return ProductService.getProduct(payload);
            },
            providesTags: [STORE_TAGS.PRODUCT],
        }),
    })
});

export const {
    useGetProductQuery,
    useLazyGetProductQuery
} = ProductApi;