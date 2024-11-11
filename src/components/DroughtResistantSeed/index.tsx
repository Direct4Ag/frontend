import React from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';

import { useSelectedResearch, useDRSYieldData } from '@app/utils/hooks';
import { DataStateContext } from '@app/store/contexts';
import Header from '../childComponents/navigation/Header';

import ResearchLeftSidebar from '../childComponents/ResearchLeftSidebar';
import DroughtResistantSeedYield from './DroughtResistantSeedYield';
import withLoading from '@app/components/childComponents/hocs/withLoading';
import withErrorHandling from '@app/components/childComponents/hocs/withErrorHandling';

const DroughtResistantSeedYieldWithLoading = withLoading(DroughtResistantSeedYield);
const DroughtResistantSeedYieldWithErrorHandling = withErrorHandling(DroughtResistantSeedYieldWithLoading);

const DroughtResistantSeedComponent: React.FC<{ research: ResearchDetail | null; research_id: string | undefined }> = ({
    research,
    research_id
}): JSX.Element => {
    const { selectedResearch } = React.useContext(DataStateContext);
    const [drsYieldData, drsYieldDataLoading, drsYieldDataLoadingError] = useDRSYieldData(
        selectedResearch ? selectedResearch.id : research_id
    );

    const leftSidebarDetails = {
        dataType: 'Drought-resistant Seed Performance',
        pi: '-',
        contactInfo: '-',
        introduction:
            'As changing climate brings more uncertainty with regard to weather patterns, knowing how drought-resistant seed performs in your area is becoming more important. Researchers are growing and testing these lines scientifically to provide you with information you can trust. Location, weather, soil type and soil moisture are collected to produce a clear, unbiased picture of how these seeds perform in various conditions.',
        conclusion: 'Seed 1 is more drought tolerant than seed 2'
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <ResearchLeftSidebar {...{ selectedResearch: selectedResearch ?? research }} {...leftSidebarDetails} />
            <DroughtResistantSeedYieldWithErrorHandling
                error={drsYieldDataLoadingError}
                isLoading={drsYieldDataLoading}
                drsYieldData={drsYieldData}
            />
        </Box>
    );
};

const DroughtResistantSeedComponentWithLoading = withLoading(DroughtResistantSeedComponent);
const DroughtResistantSeedComponentWithErrorHandling = withErrorHandling(DroughtResistantSeedComponentWithLoading);

const DroughtResistantSeed = (): JSX.Element => {
    const { research_id } = useParams<{ research_id: string }>();
    const { selectedResearch } = React.useContext(DataStateContext);
    let loading = false;
    let error = null;
    let research = null;

    if (!selectedResearch && research_id) {
        [research, loading, error] = useSelectedResearch(research_id);
    }

    return (
        <Box>
            <Box sx={{ pointerEvents: 'auto' }}>
                <Header />
            </Box>
            <DroughtResistantSeedComponentWithErrorHandling
                research={selectedResearch ?? research}
                research_id={research_id}
                error={error}
                isLoading={loading}
            />
        </Box>
    );
};

export default DroughtResistantSeed;
