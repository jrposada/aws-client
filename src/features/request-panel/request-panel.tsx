import { Box, Button } from '@mui/material';
import { FunctionComponent, MouseEventHandler } from 'react';
import { TabInfo } from '../../core/hooks/request-context/request-service';
import ResponseViewport from '../response-viewport/response-viewport';
import TextEditor, { TextEditorProps } from '../text-editor/text-editor';

type RequestPanelProps = {
    data: TabInfo;
};

const RequestPanel: FunctionComponent<RequestPanelProps> = ({ data }) => {
    const handleValueChange: TextEditorProps['onChange'] = (next) => {
        data.setText(next);
    };
    const handleSend: MouseEventHandler<HTMLButtonElement> = () => {
        data.send();
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
                <TextEditor value={data.text} onChange={handleValueChange} />
                <ResponseViewport />
            </Box>
        </>
    );
};

export default RequestPanel;
