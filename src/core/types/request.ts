import { RequestData } from './request-data';
import { RequestResult } from './request-result';
import { RequestType } from './request-type';

export type Request<TRequestType extends RequestType = RequestType> = {
    data: RequestData<TRequestType>;
    id: string;
    is_dirty: boolean;
    request_type: TRequestType;
    result?: RequestResult<TRequestType>;
    title: string;
};
