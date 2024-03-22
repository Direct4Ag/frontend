import React from 'react';
import Box from '@mui/material/Box';
import Container from "@mui/material/Container";

import Header from '../childComponents/navigation/Header';
import LeftSidebar from './LeftSidebar';
import ExploreMap from './ExploreMap';

const Explore = (): JSX.Element => {

    return (
        <Box>
            <Box sx={{ pointerEvents: 'auto' }}>
                <Header />
            </Box>
            <Box sx={{ display: 'flex' }}>
                <LeftSidebar />
                <Container
                    disableGutters
                    sx={{ flexGrow: 1, width: '100vw', height: '92vh' }}
                >
                    <ExploreMap />
                </Container>
            </Box>
        </Box>
    )
};

export default Explore;
