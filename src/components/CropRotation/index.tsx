import React from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';

import { useSelectedResearch, useCropRotationYieldData } from '@app/utils/hooks';
import { DataStateContext } from '@app/store/contexts';
import Header from '../childComponents/navigation/Header';

import ResearchLeftSidebar from '@app/components/childComponents/ResearchLeftSidebar';
import CropRotationYield from './CropRotationYield';
import withLoading from '@app/components/childComponents/hocs/withLoading';
import withErrorHandling from '@app/components/childComponents/hocs/withErrorHandling';

const CropRotationYieldWithLoading = withLoading(CropRotationYield);
const CropRotationYieldWithErrorHandling = withErrorHandling(CropRotationYieldWithLoading);

const CropRotationComponent: React.FC<{ research: ResearchDetail | null; research_id: string | undefined }> = ({
    research,
    research_id
}): JSX.Element => {
    const { selectedResearch } = React.useContext(DataStateContext);
    const [cropRotationYieldData, cropRotationYieldDataLoading, cropRotationYieldDataError] = useCropRotationYieldData(
        selectedResearch ? selectedResearch.id : research_id
    );
    const leftSidebarDetails = {
        dataType: 'Crop Rotation',
        pi: '-',
        contactInfo: '-',
        introduction: '-',
        conclusion: '-'
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <ResearchLeftSidebar {...{ selectedResearch: selectedResearch ?? research }} {...leftSidebarDetails} />
            <CropRotationYieldWithErrorHandling
                error={cropRotationYieldDataError}
                isLoading={cropRotationYieldDataLoading}
                cropRotationYieldData={cropRotationYieldData}
            />
        </Box>
    );
};

const CropRotationComponentWithLoading = withLoading(CropRotationComponent);
const CropRotationComponentWithErrorHandling = withErrorHandling(CropRotationComponentWithLoading);

const CropRotation = (): JSX.Element => {
    const { research_id } = useParams<{ research_id: string }>();
    const { selectedResearch } = React.useContext(DataStateContext);
    let loading = false;
    let error: string | null = null;
    let research: ResearchDetail | null = null;
    if (!selectedResearch && research_id) {
        [research, loading, error] = useSelectedResearch(research_id);
    }

    return (
        <Box>
            <Box sx={{ pointerEvents: 'auto' }}>
                <Header />
            </Box>
            <CropRotationComponentWithErrorHandling
                research={selectedResearch ?? research}
                research_id={research_id}
                error={error}
                isLoading={loading}
            />
        </Box>
    );
};

export default CropRotation;
