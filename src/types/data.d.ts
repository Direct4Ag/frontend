interface FieldsSummary {
    fieldId: string;
    fieldName: string;
    farm: FarmSummary;
    coordinates: PointCoordinates;
    researchArea: string;
    researchName: string;
    fieldDataId: string;
}

interface FarmSummary {
    farmId: string;
    farmName: string;
    location: string;
}

interface FarmDetail {
    farmId: string;
    farmName: string;
    location: string;
    fields: FieldDetail[];
}

interface FieldDetail {
    fieldId: string;
    fieldName: string;
    researchArea: string;
    researchName: string;
    coordinates: PointCoordinates;
    fieldDataId: string;
}

interface DataState {
    farms: FarmDetail[];
    fields: FieldsSummary[];
    selectedFilter: ExploreFilter;
}

type ExploreFilter = 'All' | 'Cover Crop' | 'Crop Rotation' | 'Drought-resistant Seed' | 'Irrigation Strategies';
