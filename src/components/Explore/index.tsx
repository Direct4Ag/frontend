import React from 'react';
import Box from '@mui/material/Box';
import Container from "@mui/material/Container";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import Header from '../childComponents/navigation/Header';
import LeftSidebar from './LeftSidebar';
import ExploreMap from './ExploreMap';

interface InfoSnackbar {
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
}

const Explore = (): JSX.Element => {
    const [open, setOpen] = React.useState(false);
    const [openInfo, setOpenInfo] = React.useState<InfoSnackbar>({message: '', severity: 'info'});

    const handleInfoOpen = (newInfo: InfoSnackbar) => {
        setOpen(true);
        setOpenInfo(newInfo);
    };

    const handleInfoClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Box>
            <Box sx={{ pointerEvents: 'auto' }}>
                <Header />
            </Box>
            <Box sx={{ display: 'flex' }}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleInfoClose}>
                <Alert
                    onClose={handleInfoClose}
                    severity={openInfo.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {openInfo.message}
                    </Alert>
                </Snackbar>
                <LeftSidebar />
                <Container
                    disableGutters
                    sx={{ flexGrow: 1, width: '100vw', height: '92vh' }}
                >
                    <ExploreMap handleInfoOpen={handleInfoOpen} />
                </Container>
            </Box>
        </Box>
    )
};

export default Explore;
