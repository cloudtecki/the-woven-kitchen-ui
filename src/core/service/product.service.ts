import { APIEndpoints } from "core/base/enum/api";
import { ProductListSchema } from "core/base/schema/product";
import { ProductListApiResponse, ProductParams } from "core/base/type/product";
import { ServiceBase } from "core/http/base.service";
import { ApiIResult } from "core/http/type";


export class ProductService extends ServiceBase {
    static getProduct(payload: ProductParams): Promise<ApiIResult<ProductListApiResponse>> {
        const url = `${APIEndpoints.GET_PRODUCTS}?limit=${payload.limit}&offset=${payload.offset}`;
        return this.get(url, ProductListSchema);
    }
}