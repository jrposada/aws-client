import { Box, Button } from '@mui/material';
import { FunctionComponent, MouseEventHandler } from 'react';
import { RdsRequest } from '../../../core/commands/rds';
import TextEditor, { TextEditorProps } from '../../text-editor/text-editor';

type RdsOptionsProps = {
    request: RdsRequest;
    onSend: MouseEventHandler<HTMLButtonElement>;
};

const RdsOptions: FunctionComponent<RdsOptionsProps> = ({
    request,
    onSend,
}) => {
    const handleQueryChange: TextEditorProps['onChange'] = (next) => {
        request.setData((prev) => ({
            ...prev,

            database: 'scon',
            clusterArn:
                'arn:aws:rds:us-east-1:220162591379:cluster:scon-test-supply-connections-db-cluster',
            profileName: 'dsco',
            query: next,
            secretArn:
                'arn:aws:secretsmanager:us-east-1:220162591379:secret:scon-supply-connections-db-test-readonly-password-secret-zuWRhJ',
        }));
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
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
            </Box>
            <TextEditor
                value={request.data.query ?? ''}
                onChange={handleQueryChange}
            />
        </>
    );
};

export default RdsOptions;
export type { RdsOptionsProps };
