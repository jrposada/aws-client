import { Box, Button, TextField, Toolbar } from '@mui/material';
import { t } from 'i18next';
import {
    ChangeEventHandler,
    FunctionComponent,
    MouseEventHandler,
} from 'react';
import { RdsRequest } from '../../../core/commands/rds';
import { Request } from '../../../core/hooks/workspace-context/request';
import { useWorkspaceFilepath } from '../../../core/hooks/workspace/use-workspace-filepath';
import { useWorkspaceSaveActive } from '../../../core/hooks/workspace/use-workspace-save-active';
import { useWorkspaceSaveActiveAs } from '../../../core/hooks/workspace/use-workspace-save-active-as';
import { saveAsDialog } from '../../../core/utils/system-dialog';
import useSnackbar from '../../../ui/snackbar/use-snackbar';
import RdsPanel from '../../rds/rds-panel/rds-panel';

type RequestPanelProps = {
    request: Request;
};

const RequestPanel: FunctionComponent<RequestPanelProps> = ({ request }) => {
    const { enqueueAutoHideSnackbar } = useSnackbar();
    const { data: filepath } = useWorkspaceFilepath();
    const { mutate: saveActive } = useWorkspaceSaveActive();
    const { mutate: saveActiveAs } = useWorkspaceSaveActiveAs({
        onError: () => {
            enqueueAutoHideSnackbar({
                message: 'Could not save request.',
                variant: 'error',
            });
        },
        onSuccess: () => {
            enqueueAutoHideSnackbar({
                message: 'Requests saved.',
                variant: 'success',
            });
        },
    });

    const handleSave: MouseEventHandler<HTMLButtonElement> = async () => {
        if (filepath) {
            saveActive();
        } else {
            const filepath = await saveAsDialog();
            if (filepath) {
                saveActiveAs(filepath);
            }
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
                    <></>
                )}
            </Box>
        </>
    );
};

export default RequestPanel;
