import { FunctionComponent } from 'react';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import { Box } from '@mui/material';

type TextEditorProps = {
    value: string;
};

const TextEditor: FunctionComponent<TextEditorProps> = ({ value }) => {
    return (
        <>
            <Box
                sx={{
                    border: 1,
                    borderColor: 'grey.500',
                    borderRadius: 1,
                    flexGrow: 1,
                }}
            >
                <AceEditor
                    mode="json"
                    width="100%"
                    height="100%"
                    value={`${value}`}
                    theme="github"
                    highlightActiveLine
                    setOptions={{
                        enableLiveAutocompletion: true,
                        showLineNumbers: true,
                        tabSize: 2,
                    }}
                    editorProps={{ $blockScrolling: true }}
                />
            </Box>
        </>
    );
};

export default TextEditor;
export type { TextEditorProps };
