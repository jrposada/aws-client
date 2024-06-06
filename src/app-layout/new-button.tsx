import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Menu, MenuItem } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import AppBarButton from './styled/app-bar-button';

const NewButton: FunctionComponent = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AppBarButton
                id="new-button"
                aria-controls={open ? 'new-button' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                color="success"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                    textTransform: 'none',
                }}
            >
                New
            </AppBarButton>
            <Menu
                anchorEl={anchorEl}
                onClose={handleClose}
                open={open}
                MenuListProps={{
                    'aria-labelledby': 'new-button',
                }}
            >
                <MenuItem onClick={handleClose} disableRipple>
                    <EditIcon />
                    DynamoDB
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                    <FileCopyIcon />
                    RDS
                </MenuItem>
            </Menu>
        </>
    );
};

export default NewButton;
