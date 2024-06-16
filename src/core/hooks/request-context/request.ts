import { Dispatch, SetStateAction } from 'react';

export type RequestType = 'dynamo-db' | 'open-search' | 'rds';

export type RequestData = {
    profileName: string;
};

export type Request<
    TData extends RequestData = RequestData,
    TResult = unknown,
> = {
    data: TData;
    id: string;
    requestType: RequestType;
    send: () => Promise<TResult>;
    setData: Dispatch<SetStateAction<TData>>;
    title: string;
};
