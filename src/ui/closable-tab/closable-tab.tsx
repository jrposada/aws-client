import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, TabProps } from '@mui/material';
import { FunctionComponent } from 'react';
import IconButton from './styled/icon-button';
import Tab from './styled/tab';

type ClosableTabProps = Omit<TabProps, 'icon' | 'iconPosition'> & {
    onClose?: (id: string | undefined) => void;
};

const ClosableTab: FunctionComponent<ClosableTabProps> = ({
    id,
    label,
    onClose,
    ...restProps
}) => {
    return (
        <Tab
            {...restProps}
            id={id}
            label={
                <>
                    <Box sx={{ pl: 4, pr: 4 }}>{label}</Box>
                    <IconButton
                        className="close-icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose?.(id);
                        }}
                        size="small"
                    >
                        <CloseRoundedIcon fontSize="small" />
                    </IconButton>
                </>
            }
        />
    );
};

export default ClosableTab;
export type { ClosableTabProps };
