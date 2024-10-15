import React from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import { CircularProgress, Typography } from '@mui/material';

import { useSelectedResearch } from '@app/utils/hooks';
import { theme } from '@app/theme';
import { DataStateContext } from '@app/store/contexts';
import Header from '../childComponents/navigation/Header';

import ResearchLeftSidebar from '../childComponents/ResearchLeftSidebar';
import DroughtResistantSeedYield from './DroughtResistantSeedYield';

const DroughtResistantSeed = (): JSX.Element => {
    const { research_id } = useParams<{ research_id: string }>();
    const { selectedResearch } = React.useContext(DataStateContext);
    let loading = false;
    let error = null;
    let research = null;

    if (!selectedResearch && research_id) {
        [research, loading, error] = useSelectedResearch(research_id);
    }
    const leftSidebarDetails = {
        dataType: 'Drought-resistant Seed Performance',
        pi: '-',
        contactInfo: '-',
        introduction:
            'As changing climate brings more uncertainty with regard to weather patterns, knowing how drought-resistant seed performs in your area is becoming more important. Researchers are growing and testing these lines scientifically to provide you with information you can trust. Location, weather, soil type and soil moisture are collected to produce a clear, unbiased picture of how these seeds perform in various conditions.',
        conclusion: 'Seed 1 is more drought tolerant than seed 2'
    };

    return (
        <Box>
            <Box sx={{ pointerEvents: 'auto' }}>
                <Header />
            </Box>
            {loading ? (
                <Box display="flex" justifyContent="center" justifyItems="center" sx={{ height: '100vh' }}>
                    <CircularProgress />
                </Box>
            ) : error === null ? (
                <Box sx={{ display: 'flex' }}>
                    <ResearchLeftSidebar
                        {...{ selectedResearch: selectedResearch ?? research }}
                        {...leftSidebarDetails}
                    />
                    <DroughtResistantSeedYield />
                </Box>
            ) : (
                <Typography
                    variant="h6"
                    sx={{
                        font: 'Poppins',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '25.6px',
                        letterSpacing: '0.15px',
                        marginRight: '5px',
                        color: theme.palette.text.primary
                    }}
                >
                    {error}
                </Typography>
            )}
        </Box>
    );
};

export default DroughtResistantSeed;
