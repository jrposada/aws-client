import { Button, TextField, Toolbar } from '@mui/material';
import { t } from 'i18next';
import {
    ChangeEventHandler,
    FunctionComponent,
    MouseEventHandler,
} from 'react';
import { RdsRequest, RdsSendResult } from '../../../core/commands/rds';
import ResponseViewport from '../../response-viewport/response-viewport';
import TextEditor, { TextEditorProps } from '../../text-editor/text-editor';

type RdsPanelProps = {
    onSend: MouseEventHandler<HTMLButtonElement>;
    request: RdsRequest;
    result: RdsSendResult | undefined;
};

const RdsPanel: FunctionComponent<RdsPanelProps> = ({
    onSend,
    request,
    result,
}) => {
    const handleClusterArnChange: ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        request.setData((prev) => ({
            ...prev,
            clusterArn: event.target.value,
        }));
    };

    const handleDatabaseChange: ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        request.setData((prev) => ({
            ...prev,
            database: event.target.value,
        }));
    };

    const handleProfileNameChange: ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        request.setData((prev) => ({
            ...prev,
            profileName: event.target.value,
        }));
    };

    const handleQueryChange: TextEditorProps['onChange'] = (next) => {
        request.setData((prev) => ({
            ...prev,
            query: next,
        }));
    };

    const handleSecretArnChange: ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        request.setData((prev) => ({
            ...prev,
            secretArn: event.target.value,
        }));
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
                    value={request.data.database}
                    variant="outlined"
                />
                <TextField
                    label={t('rds-request.cluster-arn')}
                    onChange={handleClusterArnChange}
                    value={request.data.clusterArn}
                    variant="outlined"
                />
                <TextField
                    label={t('rds-request.secret-arn')}
                    onChange={handleSecretArnChange}
                    value={request.data.secretArn}
                    variant="outlined"
                />
                <TextField
                    label={t('rds-request.profile-name')}
                    onChange={handleProfileNameChange}
                    value={request.data.profileName}
                    variant="outlined"
                />
                <Button
                    variant="contained"
                    onClick={onSend}
                    disabled={
                        !request.data.clusterArn ||
                        !request.data.database ||
                        !request.data.profileName ||
                        !request.data.query ||
                        !request.data.secretArn
                    }
                    sx={{
                        ml: 'auto',
                    }}
                >
                    Send
                </Button>
            </Toolbar>
            <TextEditor
                value={request.data.query ?? ''}
                onChange={handleQueryChange}
            />
            <ResponseViewport>
                {!!result && <span>{result}</span>}
            </ResponseViewport>
        </>
    );
};

export default RdsPanel;
export type { RdsPanelProps as RdsOptionsProps };
