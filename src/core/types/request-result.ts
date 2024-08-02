import { RdsResult } from './rds';
import { RequestType } from './request-type';

export type RequestResult<TRequestType extends RequestType = RequestType> = {
    success: boolean;

    rds: TRequestType extends 'rds' ? RdsResult : undefined;
};
