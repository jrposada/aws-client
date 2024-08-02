import { Box, Button, TextField, Toolbar } from '@mui/material';
import { t } from 'i18next';
import {
    ChangeEventHandler,
    FunctionComponent,
    MouseEventHandler,
} from 'react';
import { RdsRequest } from '../../../core/commands/rds';
import { useRequestsUpdate } from '../../../core/hooks/requests/use-requests-update';
import { Request } from '../../../core/hooks/workspace-context/request';
import { useWorkspaceFilepath } from '../../../core/hooks/workspace/use-workspace-filepath';
import { useWorkspaceSaveActive } from '../../../core/hooks/workspace/use-workspace-save-active';
import { useWorkspaceSaveActiveAs } from '../../../core/hooks/workspace/use-workspace-save-active-as';
import { saveAsDialog } from '../../../core/utils/system-dialog';
import RdsPanel from '../../rds/rds-panel/rds-panel';

type RequestPanelProps = {
    request: Request;
};

const RequestPanel: FunctionComponent<RequestPanelProps> = ({ request }) => {
    const { data: filepath } = useWorkspaceFilepath();
    const { mutate: saveActive } = useWorkspaceSaveActive();
    const { mutate: saveActiveAs } = useWorkspaceSaveActiveAs();
    const { mutate: setTitle } = useRequestsUpdate();

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
        // request.send();
        console.log('TODO');
    };

    const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setTitle({ id: request.id, data: event.target.value });
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
