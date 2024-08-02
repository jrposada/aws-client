import { RdsData } from './rds';
import { RequestType } from './request-type';

export type RequestData<TRequestType extends RequestType = RequestType> = {
    rds: TRequestType extends 'rds' ? RdsData : undefined;
    profile_name: string;
};
