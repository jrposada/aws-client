import { FunctionComponent, useMemo } from 'react';
import Table, { TableProps } from '../../../ui/table/table';
import { Request } from '../../../core/types/request';

type RdsResultProps = {
    data: NonNullable<Request<'rds'>['result']>;
};

const RdsResult: FunctionComponent<RdsResultProps> = ({ data }) => {
    const columnDefinitions = useMemo<TableProps['columnDefs']>(
        () =>
            Object.keys(data.rds?.[0] ?? {}).map((field) => ({
                field,
                headerName: field,
            })),
        [data.rds],
    );
    return (
        <>
            <Table columnDefs={columnDefinitions} rowData={data.rds} />
        </>
    );
};

export default RdsResult;
export type { RdsResultProps };
