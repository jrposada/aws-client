import { Container } from '@mui/material';
import { invoke } from '@tauri-apps/api';
import { FunctionComponent, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

const HomeRoute: FunctionComponent = () => {
    const [greet, setGreet] = useState('');

    // now we can call our Command!
    invoke<string>('greet', { name: 'World' })
        // `invoke` returns a Promise
        .then((response) => setGreet(response));

    return (
        <Container
            maxWidth={false}
            sx={{
                mt: 4,
                mb: 4,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <AceEditor
                mode="json"
                value={greet}
                theme="monokai"
                highlightActiveLine
                setOptions={{
                    enableLiveAutocompletion: true,
                    showLineNumbers: true,
                    tabSize: 2,
                }}
                editorProps={{ $blockScrolling: true }}
            />
        </Container>
    );
};

export default HomeRoute;
