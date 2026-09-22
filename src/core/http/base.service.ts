import { AxiosError, AxiosRequestConfig } from 'axios';
import { ApiIResult } from './type';
import { Axios } from 'core/http';
import { AnySchema, ValidateOptions } from 'yup';
import { HttpStatusCodes } from 'core/base/enum/api';

export class ServiceBase {
    private static async makeRequest<T>(
        request: Promise<{ data: T; status: number }>,
        schema: AnySchema,
        validationOptions?: ValidateOptions,
    ): Promise<ApiIResult<T>> {
        try {
            const { data, status } = await request;
            if (data) {
                await this.validateSchema(data, schema, validationOptions);
            }
            return {
                data: data as T,
                status,
                hasErrors: false,
            };
        } catch (error) {
            const { message, response } = error as AxiosError;
            const responseData = response?.data as { message?: unknown } | undefined;
            const responseMessage =
                typeof responseData?.message === 'string'
                    ? responseData.message
                    : message;
            return {
                error: {
                    data: responseMessage,
                    status: response?.status || HttpStatusCodes.INTERNAL_SERVER_ERROR,
                },
                hasErrors: true,
            };
        }
    }

    private static async validateSchema<T>(
        data: T,
        schema: AnySchema,
        validationOptions?: ValidateOptions,
    ) {
        await schema.validate(data, validationOptions);
    }

    protected static get<T>(
        url: string,
        responseSchema: AnySchema,
        config?: AxiosRequestConfig,
    ): Promise<ApiIResult<T>> {
        //console.log('ServiceBase.get called with URL:', this.makeRequest<T>(Axios.get(url, config), responseSchema));
        return this.makeRequest<T>(Axios.get(url, config), responseSchema);
    }

    protected static post<T, U>(
        url: string,
        data: U,
        responseSchema: AnySchema,
        config?: AxiosRequestConfig,
    ): Promise<ApiIResult<T>> {
        return this.makeRequest<T>(Axios.post(url, data, config), responseSchema);
    }

    protected static put<T, U>(
        url: string,
        data: U,
        responseSchema: AnySchema,
        config?: AxiosRequestConfig,
    ): Promise<ApiIResult<T>> {
        return this.makeRequest<T>(Axios.put(url, data, config), responseSchema);
    }

    protected static patch<T, U>(
        url: string,
        data: U,
        responseSchema: AnySchema,
        config?: AxiosRequestConfig,
    ): Promise<ApiIResult<T>> {
        return this.makeRequest<T>(Axios.patch(url, data, config), responseSchema);
    }

    protected static delete<T>(
        url: string,
        responseSchema: AnySchema,
        config?: AxiosRequestConfig,
    ): Promise<ApiIResult<T>> {
        return this.makeRequest<T>(Axios.delete(url, config), responseSchema);
    }

    protected static async getBlob(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<ApiIResult<Blob>> {
        try {
            const response = await Axios.get(url, {
                ...config,
                responseType: 'blob',
            });
            return {
                data: response.data as Blob,
                status: response.status,
                hasErrors: false,
            };
        } catch (error) {
            const { message, response } = error as AxiosError;
            return {
                error: {
                    data: message,
                    status: response?.status || HttpStatusCodes.INTERNAL_SERVER_ERROR,
                },
                hasErrors: true,
            };
        }
    }
}