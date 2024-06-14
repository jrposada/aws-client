import { Box } from '@mui/material';
import { FunctionComponent, MouseEventHandler } from 'react';
import { Request } from '../../core/hooks/request-context/request-service';
import ResponseViewport from '../response-viewport/response-viewport';
import RdsOptions from './rds-panel/rds-options';
import { RdsRequest } from '../../core/commands/rds';

type RequestPanelProps = {
    request: Request;
};

const RequestPanel: FunctionComponent<RequestPanelProps> = ({ request }) => {
    const handleSend: MouseEventHandler<HTMLButtonElement> = () => {
        request.send().then((response) => console.log(response));
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
                    <RdsOptions
                        request={request as unknown as RdsRequest}
                        onSend={handleSend}
                    />
                ) : (
                    <span>TODO</span>
                )}
                <ResponseViewport />
            </Box>
        </>
    );
};

export default RequestPanel;
