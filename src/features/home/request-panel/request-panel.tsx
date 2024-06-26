import { Box, Button, TextField, Toolbar } from '@mui/material';
import { t } from 'i18next';
import {
    ChangeEventHandler,
    FunctionComponent,
    MouseEventHandler,
} from 'react';
import { RdsRequest } from '../../../core/commands/rds';
import { Request } from '../../../core/hooks/workspace-context/request';
import { useWorkspaceService } from '../../../core/hooks/workspace-context/use-workspace-service';
import useSnackbar from '../../../ui/snackbar/use-snackbar';
import RdsPanel from '../../rds/rds-panel/rds-panel';

type RequestPanelProps = {
    request: Request;
};

const RequestPanel: FunctionComponent<RequestPanelProps> = ({ request }) => {
    const { enqueueAutoHideSnackbar } = useSnackbar();
    const requestService = useWorkspaceService();

    const handleSave: MouseEventHandler<HTMLButtonElement> = () => {
        if (requestService.filepath) {
            requestService
                .saveCurrent(requestService.filepath)
                .then(() => {
                    enqueueAutoHideSnackbar({
                        message: 'Requests saved.',
                        variant: 'success',
                    });
                })
                .catch(() => {
                    enqueueAutoHideSnackbar({
                        message: 'Could not save request.',
                        variant: 'error',
                    });
                });
        } else {
            requestService.saveCurrentAs();
        }
    };

    const handleSend: MouseEventHandler<HTMLButtonElement> = () => {
        request.send();
    };

    const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        request.setTitle(event.target.value);
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
                    <TextField
                        onChange={handleTitleChange}
                        value={request.title}
                        variant="standard"
                        sx={{
                            flexGrow: 1,
                        }}
                    />
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
