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

interface SoilData {
    [key: string]: string | number;
}

interface DRSYieldData {
    id: string;
    replicate: number;
    line: string;
    planting_date: string;
    harvest_date: string;
    crop_yield: number;
}

interface GeostreamsData {
    average: number;
    year: number;
    month: number;
    day: number;
    label: string;
}

interface DepthSoilMoistureData {
    [key: string]: {
        data: GeostreamsData[];
    };
}

interface WeatherData {
    avg_air_temp: GeostreamsData[];
    avg_vpd: GeostreamsData[];
    precipitation: GeostreamsData[];
}

interface FieldSensors {
    id: string;
    depth: string;
    sensorType: string;
    sensor_id: number;
}

interface DataState {
    researches: ResearchDetail[];
    selectedFilter: ExploreFilter;
    fields: FieldsSummary[];
    selectedField: FieldsSummary | null;
    selectedResearch: ResearchDetail | null;
    soilData: SoilData[] | null;
    drsYieldData: DRSYieldData[] | null;
    depthSoilMoistureData: DepthSoilMoistureData | null;
    weatherData: WeatherData | null;
}

type ExploreFilter = 'All' | 'Cover Crop' | 'Crop Rotation' | 'Drought-resistant Seeds' | 'Irrigation Strategies';
