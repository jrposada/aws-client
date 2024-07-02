import CircleIcon from '@mui/icons-material/Circle';
import { Box, Tabs, TabsProps } from '@mui/material';
import { FunctionComponent } from 'react';
import ClosableTab, {
    ClosableTabProps,
} from '../../ui/closable-tab/closable-tab';
import RequestPanel from './request-panel/request-panel';
import { useOpenRequests } from '../../core/hooks/requests/use-open-requests';
import { useActiveRequest } from '../../core/hooks/requests/use-active-request';
import { findIndexById } from '../../core/utils/find-index-by-id';
import { useActiveRequestUpdate } from '../../core/hooks/requests/use-active-request-update';

const tabHeight = '2rem';

const sxHeight = {
    height: tabHeight,
    minHeight: tabHeight,
};

const HomeRoute: FunctionComponent = () => {
    const { data: openRequests } = useOpenRequests();
    const { data: activeRequest } = useActiveRequest();
    const { mutate: setActiveRequest } = useActiveRequestUpdate();

    const activeRequestIndex = findIndexById(
        activeRequest?.id,
        openRequests ?? [],
    );

    const handleChange: TabsProps['onChange'] = (_, value: number) => {
        if (!openRequests) return;

        setActiveRequest(openRequests[value].id);
    };

    const handleClose: ClosableTabProps['onClose'] = (index) => {
        console.log('TODO');
        // requestService.closeRequestById(
        //     requestService.openRequests[Number(index)].id,
        // );
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
                    value={activeRequestIndex}
                    scrollButtons="auto"
                    variant="scrollable"
                    sx={{
                        ...sxHeight,
                    }}
                >
                    {openRequests?.map(({ id, isDirty, title }, index) => (
                        <ClosableTab
                            label={
                                <Box
                                    sx={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        gap: 1,
                                    }}
                                >
                                    {title}
                                    {isDirty && (
                                        <span style={{ fontSize: '0.5rem' }}>
                                            <CircleIcon fontSize="inherit" />
                                        </span>
                                    )}
                                </Box>
                            }
                            key={id}
                            id={`${index}`}
                            onClose={handleClose}
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
            {!!activeRequest && <RequestPanel request={activeRequest} />}
        </Box>
    );
};

export default HomeRoute;
