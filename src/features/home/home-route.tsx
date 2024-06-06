import { Box, Tab, Tabs, TabsProps } from '@mui/material';
import { invoke } from '@tauri-apps/api';
import { FunctionComponent, useState } from 'react';
import RequestTab from '../request-tab/request-tab';
import { useRequestService } from '../../core/hooks/request-context/use-request-service';

const tabHeight = '2rem';

const sxHeight = {
    height: tabHeight,
    minHeight: tabHeight,
};

const HomeRoute: FunctionComponent = () => {
    const requestService = useRequestService();

    const [greet, setGreet] = useState('');

    // now we can call our Command!
    invoke<string>('greet', { name: 'World' })
        // `invoke` returns a Promise
        .then((response) => setGreet(response));

    const handleChange: TabsProps['onChange'] = (_, nextValue: number) => {
        requestService.setCurrentTabByIndex(nextValue);
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
                    value={requestService.currentTabIndex}
                    scrollButtons="auto"
                    variant="scrollable"
                    sx={{
                        ...sxHeight,
                    }}
                >
                    {requestService.tabs.map(({ title, id }, index) => (
                        <Tab
                            label={title}
                            key={id}
                            id={`${index}`}
                            sx={{
                                fontSize: 'caption.fontSize',
                                paddingBlock: '1px',
                                paddingInline: '1px',
                                ...sxHeight,
                            }}
                        />
                    ))}
                </Tabs>
            </Box>
            {Boolean(requestService.currentTab) && (
                <RequestTab
                    value={`${greet} ${requestService.currentTab!.id}`}
                />
            )}
        </Box>
    );
};

export default HomeRoute;
