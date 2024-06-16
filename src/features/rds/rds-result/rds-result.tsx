import { FunctionComponent, useMemo } from 'react';
import { RdsSendResult } from '../../../core/commands/rds';
import { Result } from '../../../core/commands/common';
import Table, { TableProps } from '../../../ui/table/table';

type RdsResultProps = {
    data: Result<RdsSendResult>;
};

const RdsResult: FunctionComponent<RdsResultProps> = ({ data }) => {
    const columnDefinitions = useMemo<TableProps['columnDefs']>(
        () => Object.keys(data.data[0]).map((field) => ({ field })),
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
