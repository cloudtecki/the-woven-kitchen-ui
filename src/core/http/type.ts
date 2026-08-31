export type ApiSuccessResult<T> = {
    data: T;
    status: number;
    hasErrors: false;
};

export type ApiErrorResult = {
    error: {
        status: number;
        data: string;
    };
    hasErrors: true;
};

export type ApiIResult<T> = ApiSuccessResult<T> | ApiErrorResult;