import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, TabProps } from '@mui/material';
import { FunctionComponent } from 'react';
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
                    <CloseRoundedIcon
                        className="close-icon"
                        fontSize="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose?.(id);
                        }}
                        role="button"
                    />
                </>
            }
        />
    );
};

export default ClosableTab;
export type { ClosableTabProps };
