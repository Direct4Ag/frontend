interface FieldSmallSummary {
    id: string;
    field_name?: string;
    name?: string;
}

interface FieldsSummary extends FieldSmallSummary {
    coordinates: PointCoordinates;
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
    fields: FieldsSummary[];
    selectedField: FieldsSummary | null;
    selectedResearch: ResearchDetail | null;
}

type ExploreFilter = 'All' | 'Cover Crop' | 'Crop Rotation' | 'Drought-resistant Seeds' | 'Irrigation Strategies';
