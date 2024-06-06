import { Box, Tab, Tabs, TabsProps } from '@mui/material';
import { invoke } from '@tauri-apps/api';
import { FunctionComponent, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';

const tabHeight = '2rem';

const sxHeight = {
    height: tabHeight,
    minHeight: tabHeight,
};

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
        sx: {
            fontSize: 'caption.fontSize',
            paddingBlock: '1px',
            paddingInline: '1px',
            ...sxHeight,
        },
    };
}

const HomeRoute: FunctionComponent = () => {
    const [value, setValue] = useState(0);

    const [greet, setGreet] = useState('');

    // now we can call our Command!
    invoke<string>('greet', { name: 'World' })
        // `invoke` returns a Promise
        .then((response) => setGreet(response));

    const handleChange: TabsProps['onChange'] = (_, nextValue: number) => {
        setValue(nextValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    onChange={handleChange}
                    value={value}
                    scrollButtons="auto"
                    variant="scrollable"
                    sx={{
                        ...sxHeight,
                    }}
                >
                    <Tab label="Item One" {...a11yProps(0)} />
                    <Tab label="Item Two" {...a11yProps(1)} />
                    <Tab label="Item Three" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <AceEditor
                mode="json"
                width="100%"
                height="100%"
                value={`${greet} ${value}`}
                theme="github"
                highlightActiveLine
                setOptions={{
                    enableLiveAutocompletion: true,
                    showLineNumbers: true,
                    tabSize: 2,
                }}
                editorProps={{ $blockScrolling: true }}
            />
        </>
    );
};

export default HomeRoute;
