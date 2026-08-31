import { InferType } from "yup";
import { ProductListSchema, ProductSchema } from "../schema/product";

export type ProductListApiResponse = InferType<typeof ProductListSchema>;
export type ProductListItem = InferType<typeof ProductSchema>;


export type ProductParams = {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortDirection?: string;
};

