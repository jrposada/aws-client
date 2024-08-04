import { Button, TextField, Toolbar } from '@mui/material';
import { t } from 'i18next';
import {
    ChangeEventHandler,
    FunctionComponent,
    MouseEventHandler,
} from 'react';
import { Request } from '../../../core/types/request';
import ResponseViewport from '../../home/response-viewport/response-viewport';
import TextEditor, {
    TextEditorProps,
} from '../../home/text-editor/text-editor';
import RdsResult from '../rds-result/rds-result';
import { useRequestsUpdate } from '../../../core/hooks/requests/use-requests-update';
import { event } from '@tauri-apps/api';

type RdsPanelProps = {
    request: Request<'rds'>;
};

const RdsPanel: FunctionComponent<RdsPanelProps> = ({ request }) => {
    const { mutate: updateRequest } = useRequestsUpdate();

    const handleClusterArnChange: ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        updateRequest({
            id: request.id,
            title: request.title,
            data: {
                ...request.data,
                rds: {
                    ...request.data.rds,
                    cluster_arn: event.target.value,
                },
            },
        });
    };

    const handleDatabaseChange: ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        updateRequest({
            id: request.id,
            title: request.title,
            data: {
                ...request.data,
                rds: {
                    ...request.data.rds,
                    database: event.target.value,
                },
            },
        });
    };

    const handleProfileNameChange: ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        updateRequest({
            id: request.id,
            title: request.title,
            data: {
                ...request.data,
                profile_name: event.target.value,
            },
        });
    };

    const handleQueryChange: TextEditorProps['onChange'] = (next) => {
        updateRequest({
            id: request.id,
            title: request.title,
            data: {
                ...request.data,
                rds: {
                    ...request.data.rds,
                    query: next,
                },
            },
        });
    };

    const handleSecretArnChange: ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        updateRequest({
            id: request.id,
            title: request.title,
            data: {
                ...request.data,
                rds: {
                    ...request.data.rds,
                    secret_arn: event.target.value,
                },
            },
        });
    };

    const handleSend: MouseEventHandler<HTMLButtonElement> = () => {
        // request.send();
        console.log('TODO');
    };

    return (
        <>
            <Toolbar
                sx={{
                    gap: 1,
                }}
                style={{
                    paddingLeft: 0,
                    paddingRight: 0,
                }}
            >
                <TextField
                    label={t('rds-request.database')}
                    onChange={handleDatabaseChange}
                    value={request.data.rds.database}
                    variant="outlined"
                />
                <TextField
                    label={t('rds-request.cluster-arn')}
                    onChange={handleClusterArnChange}
                    value={request.data.rds.cluster_arn}
                    variant="outlined"
                />
                <TextField
                    label={t('rds-request.secret-arn')}
                    onChange={handleSecretArnChange}
                    value={request.data.rds.secret_arn}
                    variant="outlined"
                />
                <TextField
                    label={t('rds-request.profile-name')}
                    onChange={handleProfileNameChange}
                    value={request.data.profile_name}
                    variant="outlined"
                />
                <Button
                    variant="contained"
                    onClick={handleSend}
                    disabled={
                        !request.data.rds.cluster_arn ||
                        !request.data.rds.database ||
                        !request.data.profile_name ||
                        !request.data.rds.query ||
                        !request.data.rds.secret_arn
                    }
                    sx={{
                        ml: 'auto',
                    }}
                >
                    Send
                </Button>
            </Toolbar>
            <TextEditor
                value={request.data.rds.query ?? ''}
                onChange={handleQueryChange}
            />
            <ResponseViewport>
                {!!request.result?.success && (
                    <RdsResult data={request.result} />
                )}
            </ResponseViewport>
        </>
    );
};

export default RdsPanel;
export type { RdsPanelProps as RdsOptionsProps };
