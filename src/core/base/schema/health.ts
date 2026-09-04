import { object, string } from "yup";

export const HealthSchema = object({
    status: string().required(),
}).defined();
