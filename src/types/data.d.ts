interface FieldsSummary {
    id: string;
    field_name: string;
    field_shape: LineCoordinates;
}

interface FarmSummary {
    id: string;
    farm_name: string;
    location_name: string;
}

interface ResearchSummary {
    id: string;
    research_name: string;
    research_area: string;
    research_type: string;
}

interface FieldDetail extends FieldsSummary {
    farm_ref_id: string;
    farm: FarmSummary;
}

interface ResearchDetail extends ResearchSummary {
    field_ref_id: string;
    field: FieldDetail;
}

interface DataState {
    researches: ResearchDetail[];
    selectedFilter: ExploreFilter;
}

type ExploreFilter = 'All' | 'Cover Crop' | 'Crop Rotation' | 'Drought-resistant Seeds' | 'Irrigation Strategies';
