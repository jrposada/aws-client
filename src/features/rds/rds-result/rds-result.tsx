import { FunctionComponent, useMemo } from 'react';
import { RdsSendResult } from '../../../core/commands/rds';
import { RequestResult } from '../../../core/hooks/workspace-context/request';
import Table, { TableProps } from '../../../ui/table/table';

type RdsResultProps = {
    data: RequestResult<RdsSendResult>;
};

const RdsResult: FunctionComponent<RdsResultProps> = ({ data }) => {
    const columnDefinitions = useMemo<TableProps['columnDefs']>(
        () =>
            Object.keys(data?.data?.[0] ?? {}).map((field) => ({
                field,
                headerName: field,
            })),
        [data.data],
    );
    return (
        <>
            <Table columnDefs={columnDefinitions} rowData={data.data} />
        </>
    );
};

export default RdsResult;
export type { RdsResultProps };
