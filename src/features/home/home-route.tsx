import CircleIcon from '@mui/icons-material/Circle';
import { Box, Tabs, TabsProps } from '@mui/material';
import { FunctionComponent } from 'react';
import { useWorkspaceService } from '../../core/hooks/workspace-context/use-workspace-service';
import ClosableTab, {
    ClosableTabProps,
} from '../../ui/closable-tab/closable-tab';
import RequestPanel from './request-panel/request-panel';

const tabHeight = '2rem';

const sxHeight = {
    height: tabHeight,
    minHeight: tabHeight,
};

const HomeRoute: FunctionComponent = () => {
    const requestService = useWorkspaceService();

    const handleChange: TabsProps['onChange'] = (_, nextValue: number) => {
        requestService.setCurrentRequestByIndex(nextValue);
    };

    const handleClose: ClosableTabProps['onClose'] = (index) => {
        requestService.closeRequestById(
            requestService.openRequests[Number(index)].id,
        );
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
                    value={requestService.currentRequestIndex}
                    scrollButtons="auto"
                    variant="scrollable"
                    sx={{
                        ...sxHeight,
                    }}
                >
                    {requestService.openRequests.map(
                        ({ id, isDirty, title }, index) => (
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
                                            <span
                                                style={{ fontSize: '0.5rem' }}
                                            >
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
                        ),
                    )}
                </Tabs>
            </Box>
            {!!requestService.currentRequest && (
                <RequestPanel request={requestService.currentRequest} />
            )}
        </Box>
    );
};

export default HomeRoute;
