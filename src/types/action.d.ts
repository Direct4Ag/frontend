interface LoadReserches {
    type: 'loadResearches';
    farms: ResearchDetail[];
}

interface LoadFields {
    type: 'loadFields';
    fields: FieldsSummary[];
}

interface UpdateExploreFilter {
    type: 'updateExploreFilter';
    selectedFilter: ExploreFilter;
}

interface UpdateSelectedField {
    type: 'updateSelectedField';
    selectedField: FieldsSummary | null;
}

interface UpdateSelectedResearch {
    type: 'updateSelectedresearch';
    selectedResearch: ResearchDetail | null;
}

interface UpdateSoilData {
    type: 'updateSoilData';
    soilData: SoilData[] | null;
}

interface UpdateDRSYieldData {
    type: 'updateDRSYieldData';
    drsYieldData: DRSYieldData[] | null;
}

interface UpdateDepthSoilMoistureData {
    type: 'updateDepthSoilMoistureData';
    depthSoilMoistureData: DepthSoilMoistureData;
}

interface UpdateWeatherData {
    type: 'updateWeatherData';
    weatherData: WeatherData;
}

type DataAction =
    | LoadResearches
    | UpdateExploreFilter
    | LoadFields
    | UpdateSelectedField
    | UpdateSelectedResearch
    | UpdateSoilData
    | UpdateDRSYieldData
    | UpdateDepthSoilMoistureData
    | UpdateWeatherData;
