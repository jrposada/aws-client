import { Box, Tabs, TabsProps } from '@mui/material';
import { FunctionComponent } from 'react';
import { useRequestService } from '../../core/hooks/request-context/use-request-service';
import RequestPanel from '../request-panel/request-panel';
import ClosableTab from '../../ui/closable-tab/closable-tab';

const tabHeight = '2rem';

const sxHeight = {
    height: tabHeight,
    minHeight: tabHeight,
};

const HomeRoute: FunctionComponent = () => {
    const requestService = useRequestService();

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
                        <ClosableTab
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
            {!!requestService.currentTab && (
                <RequestPanel data={requestService.currentTab} />
            )}
        </Box>
    );
};

export default HomeRoute;
