import { Box } from '@mui/material';
import { FunctionComponent, MouseEventHandler, useState } from 'react';
import { RdsRequest, RdsSendResult } from '../../core/commands/rds';
import { Request } from '../../core/hooks/request-context/request-service';
import RdsPanel from './rds-panel/rds-panel';

type Result = {
    success: boolean;
    data: unknown;
};

type RequestPanelProps = {
    request: Request;
};

const RequestPanel: FunctionComponent<RequestPanelProps> = ({ request }) => {
    const [result, setResult] = useState<Result>();
    const handleSend: MouseEventHandler<HTMLButtonElement> = () => {
        request
            .send()
            .then((response) => {
                setResult({ success: true, data: response });
            })
            .catch((error) => {
                setResult({ success: false, data: error });
            });
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    gap: 1,
                    px: 2,
                    py: 1,
                }}
            >
                {request.requestType === 'rds' ? (
                    <RdsPanel
                        onSend={handleSend}
                        request={request as unknown as RdsRequest}
                        result={result as RdsSendResult | undefined}
                    />
                ) : (
                    <span>TODO</span>
                )}
            </Box>
        </>
    );
};

export default RequestPanel;
