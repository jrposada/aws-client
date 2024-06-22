import { Box, Button, Toolbar } from '@mui/material';
import { t } from 'i18next';
import { FunctionComponent, MouseEventHandler } from 'react';
import { RdsRequest } from '../../../core/commands/rds';
import { Request } from '../../../core/hooks/workspace-context/request';
import { useWorkspaceService } from '../../../core/hooks/workspace-context/use-workspace-service';
import RdsPanel from '../../rds/rds-panel/rds-panel';

type RequestPanelProps = {
    request: Request;
};

const RequestPanel: FunctionComponent<RequestPanelProps> = ({ request }) => {
    const requestService = useWorkspaceService();

    const handleSave: MouseEventHandler<HTMLButtonElement> = () => {
        if (requestService.filepath) {
            requestService.saveCurrent(requestService.filepath);
        } else {
            requestService.saveCurrentAs();
        }
    };

    const handleSend: MouseEventHandler<HTMLButtonElement> = () => {
        request.send();
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
                    <Button
                        disabled={!request.isDirty}
                        onClick={handleSave}
                        sx={{ ml: 'auto' }}
                    >
                        {t('save')}
                    </Button>
                </Toolbar>
                {request.requestType === 'rds' ? (
                    <RdsPanel
                        onSend={handleSend}
                        request={request as unknown as RdsRequest}
                    />
                ) : (
                    <span>TODO</span>
                )}
            </Box>
        </>
    );
};

export default RequestPanel;
