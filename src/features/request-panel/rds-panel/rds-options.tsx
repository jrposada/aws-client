import { Box, Button, TextField, Toolbar } from '@mui/material';
import {
    ChangeEventHandler,
    FunctionComponent,
    MouseEventHandler,
} from 'react';
import { RdsRequest } from '../../../core/commands/rds';
import TextEditor, { TextEditorProps } from '../../text-editor/text-editor';
import { t } from 'i18next';

type RdsOptionsProps = {
    request: RdsRequest;
    onSend: MouseEventHandler<HTMLButtonElement>;
};

const RdsOptions: FunctionComponent<RdsOptionsProps> = ({
    request,
    onSend,
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
        </>
    );
};

export default RdsOptions;
export type { RdsOptionsProps };
// database: 'scon',
// clusterArn:
//     'arn:aws:rds:us-east-1:220162591379:cluster:scon-test-supply-connections-db-cluster',
// profileName: 'dsco',
// secretArn:
//     'arn:aws:secretsmanager:us-east-1:220162591379:secret:scon-supply-connections-db-test-readonly-password-secret-zuWRhJ',
