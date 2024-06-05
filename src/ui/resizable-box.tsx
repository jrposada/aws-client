import Box from '@mui/material/Box';
import { FunctionComponent, PropsWithChildren } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const ResizableHeightBox: FunctionComponent<PropsWithChildren> = ({
    children,
}) => {
    return (
        <Box sx={{ width: '100%' }}>
            <ResizableBox
                width={Infinity}
                height={200}
                minConstraints={[Infinity, 100]}
                maxConstraints={[Infinity, 500]}
                axis="y"
                resizeHandles={['n']}
                handle={
                    <Box
                        sx={{
                            position: 'absolute',
                            zIndex: 1000,
                            top: -6,
                            left: 0,
                            right: 0,
                            height: 4,
                            backgroundColor: 'grey.500',
                            borderRadius: 1,
                            // cursor: 'ns-resize',
                        }}
                    />
                }
            >
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        border: '1px solid #ddd',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </ResizableBox>
        </Box>
    );
};

export default ResizableHeightBox;
