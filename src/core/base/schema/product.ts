import { array, number, object, string } from "yup";

export const ProductSchema = object({
    id: number().required(),
    title: string().required(),
    slug: string().required(),
    price: number().required(),
    description: string().required(),
    category: object({
        id: number().required(),
        name: string().required(),
        slug: string().required(),
        image: string().required(),
        creationAt: string().required(),
        updatedAt: string().required(),
    }).required(),
    images: array().of(string().required()).required(),
    creationAt: string().required(),
    updatedAt: string().required(),
});

export const ProductListSchema = array(ProductSchema).required();