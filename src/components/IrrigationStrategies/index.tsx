import React from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';

import { useSelectedResearch } from '@app/utils/hooks';
import { DataStateContext } from '@app/store/contexts';
import Header from '@app/components/childComponents/navigation/Header';

import ResearchLeftSidebar from '@app/components/childComponents/ResearchLeftSidebar';
import withLoading from '@app/components/childComponents/hocs/withLoading';
import withErrorHandling from '@app/components/childComponents/hocs/withErrorHandling';
import IrrigationStrategiesPage from './IrrigationStrategiesPage';

const IrrigationStrategiesComponent: React.FC<{ research: ResearchDetail | null; research_id: string | undefined }> = ({
    research
    // research_id
}): JSX.Element => {
    const { selectedResearch } = React.useContext(DataStateContext);

    const leftSidebarDetails = {
        dataType: 'Irrigation Strategies',
        pi: selectedResearch?.research_pi ?? '-',
        contactInfo: selectedResearch?.research_contact_info ?? '-',
        introduction: selectedResearch?.research_introduction ?? '-',
        conclusion: selectedResearch?.research_conclusion ?? '-'
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <ResearchLeftSidebar {...{ selectedResearch: selectedResearch ?? research }} {...leftSidebarDetails} />
            <IrrigationStrategiesPage />
        </Box>
    );
};

const IrrigationStrategiesComponentWithLoading = withLoading(IrrigationStrategiesComponent);
const IrrigationStrategiesComponentWithErrorHandling = withErrorHandling(IrrigationStrategiesComponentWithLoading);

const IrrigationStrategies = (): JSX.Element => {
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
            <IrrigationStrategiesComponentWithErrorHandling
                research={selectedResearch ?? research}
                research_id={research_id}
                error={error}
                isLoading={loading}
            />
        </Box>
    );
};

export default IrrigationStrategies;
