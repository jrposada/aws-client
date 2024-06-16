import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { FunctionComponent } from 'react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

type TableProps = AgGridReactProps;

const Table: FunctionComponent<TableProps> = (props) => {
    return (
        <div
            className="ag-theme-quartz"
            style={{ height: '100%', width: '100%' }}
        >
            <AgGridReact {...props} />
        </div>
    );
};

export default Table;
export type { TableProps };
