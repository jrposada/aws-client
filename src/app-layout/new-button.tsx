import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Menu, MenuItem } from '@mui/material';
import { FunctionComponent, MouseEventHandler, useState } from 'react';
import { useRequestService } from '../core/hooks/request-context/use-request-service';
import AppBarButton from './styled/app-bar-button';

const NewButton: FunctionComponent = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const requestService = useRequestService();

    const open = Boolean(anchorEl);

    const handleOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDynamoDb: MouseEventHandler<HTMLLIElement> = () => {
        requestService.addRequest('dynamo-db');
        handleClose();
    };

    const handleRds: MouseEventHandler<HTMLLIElement> = () => {
        requestService.addRequest('rds');
        handleClose();
    };

    const handleOpenSearch: MouseEventHandler<HTMLLIElement> = () => {
        requestService.addRequest('open-search');
        handleClose();
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
                onClick={handleOpen}
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
                <MenuItem onClick={handleDynamoDb} disableRipple>
                    <EditIcon />
                    DynamoDB
                </MenuItem>
                <MenuItem onClick={handleRds} disableRipple>
                    <FileCopyIcon />
                    RDS
                </MenuItem>
                <MenuItem onClick={handleOpenSearch} disableRipple>
                    <FileCopyIcon />
                    OpenSearch
                </MenuItem>
            </Menu>
        </>
    );
};

export default NewButton;
