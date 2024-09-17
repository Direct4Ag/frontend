import React from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import { CircularProgress, Typography } from '@mui/material';

import Header from '../childComponents/navigation/Header';
import { useSelectedResearch } from '@app/utils/hooks';
import { theme } from '@app/theme';

import ResearchLeftSidebar from '../childComponents/ResearchLeftSidebar';
import { DataStateContext } from '@app/store/contexts';
import CropRotationYield from './CropRotationYield';

const CropRotation = (): JSX.Element => {
    const { research_id } = useParams<{ research_id: string }>();
    const { selectedResearch } = React.useContext(DataStateContext);
    let loading = false;
    let error = null;
    let research = null;
    if (!selectedResearch && research_id) {
        [research, loading, error] = useSelectedResearch(research_id);
    }
    const leftSidebarDetails = {
        dataType: 'Crop Rotation',
        pi: '-',
        contactInfo: '-',
        introduction: '-',
        conclusion: '-'
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
                    <CropRotationYield />
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

export default CropRotation;
