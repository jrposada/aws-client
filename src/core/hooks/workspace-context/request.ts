export type RequestType = 'rds';

export type RequestData = {
    profileName: string;
};

export type RequestResult<TData = unknown> = {
    success: boolean;
    data?: TData; // TODO use conditional type
};

export type Request<
    TData extends RequestData = RequestData,
    TResult = unknown,
> = {
    data: TData;
    id: string;
    isDirty: boolean;
    requestType: RequestType;
    result?: RequestResult<TResult>;
    title: string;
};
