import { Box, Button, Toolbar } from '@mui/material';
import { t } from 'i18next';
import { FunctionComponent, MouseEventHandler, useState } from 'react';
import { Result } from '../../../core/commands/common';
import { RdsRequest, RdsSendResult } from '../../../core/commands/rds';
import { Request } from '../../../core/hooks/request-context/request-service';
import { useRequestService } from '../../../core/hooks/request-context/use-request-service';
import RdsPanel from '../../rds/rds-panel/rds-panel';

type RequestPanelProps = {
    request: Request;
};

const RequestPanel: FunctionComponent<RequestPanelProps> = ({ request }) => {
    const requestService = useRequestService();

    const [result, setResult] = useState<Result>();

    const handleSave: MouseEventHandler<HTMLButtonElement> = () => {
        console.log('TODO save tab');
        // requestService
        //     .save()
        //     .then(() => console.log('save'))
        //     .catch(() => console.log('error'));
    };
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
                <Toolbar
                    sx={{
                        gap: 1,
                    }}
                    style={{
                        paddingLeft: 0,
                        paddingRight: 0,
                    }}
                    variant="dense"
                >
                    <Button onClick={handleSave} sx={{ ml: 'auto' }}>
                        {t('save')}
                    </Button>
                </Toolbar>
                {request.requestType === 'rds' ? (
                    <RdsPanel
                        onSend={handleSend}
                        request={request as unknown as RdsRequest}
                        result={result as Result<RdsSendResult> | undefined}
                    />
                ) : (
                    <span>TODO</span>
                )}
            </Box>
        </>
    );
};

export default RequestPanel;
