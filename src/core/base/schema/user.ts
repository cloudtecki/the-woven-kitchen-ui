import { object, string } from "yup";

export const UserSchema = object({
    id: string().required(),
    name: string().required(),
    email: string().required(),
    address: string(),
});