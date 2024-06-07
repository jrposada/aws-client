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
                    <Box sx={{ pl: 3, pr: 3 }}>{label}</Box>
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

// function TabsWithClose() {
//   const [tabs, setTabs] = useState(['Tab 1', 'Tab 2', 'Tab 3']);
//   const [value, setValue] = useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleClose = (index) => {
//     setTabs((prevTabs) => prevTabs.filter((_, i) => i !== index));
//     if (value === index && tabs.length > 1) {
//       setValue(index === 0 ? 0 : index - 1);
//     } else if (value >= tabs.length - 1) {
//       setValue(tabs.length - 2);
//     }
//   };

//   return (
//     <Box sx={{ width: '100%' }}>
//       <Tabs value={value} onChange={handleChange}>
//         {tabs.map((tab, index) => (
//
//         ))}
//       </Tabs>
//     </Box>
//   );
// }

// export default TabsWithClose;
