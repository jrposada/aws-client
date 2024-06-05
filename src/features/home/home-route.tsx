import { Box, Tab, Tabs, TabsProps } from '@mui/material';
import { invoke } from '@tauri-apps/api';
import { FunctionComponent, useState } from 'react';
import RequestTab from '../request-tab/request-tab';

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
        <Box
            sx={{
                pb: 1,
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
            }}
        >
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
            <RequestTab value={`${greet} ${value}`} />
        </Box>
    );
};

export default HomeRoute;
