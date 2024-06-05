import { FunctionComponent, MouseEventHandler } from 'react';
import TextEditor, { TextEditorProps } from '../text-editor/text-editor';
import { Box, Button } from '@mui/material';
import ResponseViewport from '../response-viewport/response-viewport';

type RequestTabProps = {
    value: TextEditorProps['value'];
};

const RequestTab: FunctionComponent<RequestTabProps> = ({ value }) => {
    const handleSend: MouseEventHandler<HTMLButtonElement> = () => {
        console.log('send');
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
                <Box sx={{ display: 'flex' }}>
                    <Button
                        variant="contained"
                        onClick={handleSend}
                        sx={{
                            ml: 'auto',
                        }}
                    >
                        Send
                    </Button>
                </Box>
                <TextEditor value={value} />
                <ResponseViewport />
            </Box>
        </>
    );
};

export default RequestTab;
