import React from 'react';

import Box from '@mui/material/Box';

import Header from '../childComponents/navigation/Header';

import LeftSidebar from './LeftSidebar';
import DroughtResistantSeedYield from './DroughtResistantSeedYield';

const DroughtResistantSeed = (): JSX.Element => {
    return (
        <Box>
            <Box sx={{ pointerEvents: 'auto' }}>
                <Header />
            </Box>
            <Box sx={{ display: 'flex' }}>
                <LeftSidebar />
                <DroughtResistantSeedYield />
            </Box>
        </Box>
    );
};

export default DroughtResistantSeed;
