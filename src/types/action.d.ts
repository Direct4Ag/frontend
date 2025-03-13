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

interface UpdateNitrateConcentrationData {
    type: 'updateNitrateConcentrationData';
    nitrateConcentrationData: GeostreamsData[];
}

interface UpdateCropRotationYieldData {
    type: 'updateCropRotationYieldData';
    cropRotationYield: CropRotationYieldData;
}

interface UpdateCropRotationWeatherYears {
    type: 'updateCropRotationWeatherYears';
    cropRotationWeatherYears: string[];
}

interface UpdateCoverCropYieldData {
    type: 'updateCoverCropYieldData';
    coverCropYield: CoverCropYieldData[];
}

type DataAction =
    | LoadResearches
    | UpdateExploreFilter
    | LoadFields
    | UpdateSelectedField
    | UpdateSelectedResearch
    | UpdateSoilData
    | UpdateDRSYieldData
    | UpdateNitrateConcentrationData
    | UpdateCropRotationYieldData
    | UpdateCropRotationWeatherYears
    | UpdateCoverCropYieldData;
