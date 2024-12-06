import React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { useSelectedResearch, useCoverCropData } from '@app/utils/hooks';
import { DataStateContext } from '@app/store/contexts';

import ResearchLeftSidebar from '@app/components/childComponents/ResearchLeftSidebar';
import withLoading from '@app/components/childComponents/hocs/withLoading';
import withErrorHandling from '@app/components/childComponents/hocs/withErrorHandling';
import Header from '@app/components/childComponents/navigation/Header';
import CoverCropYield from './CoverCropYield';

const CoverCropYieldWithLoading = withLoading(CoverCropYield);
const CoverCropYieldWithErrorHandling = withErrorHandling(CoverCropYieldWithLoading);

const CoverCropComponent: React.FC<{ research: ResearchDetail | null; research_id: string | undefined }> = ({
    research
}): JSX.Element => {
    const { selectedResearch } = React.useContext(DataStateContext);
    const [coverCropYieldData, coverCropDataLoading, coverCropDataError] = useCoverCropData(
        selectedResearch ? selectedResearch.id : ''
    );
    const leftSidebarDetails = {
        dataType: 'Cover Crop',
        pi: selectedResearch?.research_pi ?? '-',
        contactInfo: selectedResearch?.research_contact_info ?? '-',
        introduction: selectedResearch?.research_introduction ?? '-',
        conclusion: selectedResearch?.research_conclusion ?? '-'
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <ResearchLeftSidebar {...{ selectedResearch: selectedResearch ?? research }} {...leftSidebarDetails} />
            <CoverCropYieldWithErrorHandling
                error={coverCropDataError}
                isLoading={coverCropDataLoading}
                coverCropYieldData={coverCropYieldData}
            />
        </Box>
    );
};

const CoverCropWithLoading = withLoading(CoverCropComponent);
const CoverCropWithErrorHandling = withErrorHandling(CoverCropWithLoading);

const CoverCrop = (): JSX.Element => {
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
            <CoverCropWithErrorHandling
                research={selectedResearch ?? research}
                research_id={research_id}
                error={error}
                isLoading={loading}
            />
        </Box>
    );
};

export default CoverCrop;
