// This is a fallback value for when a component that is not in a DataStateContext provider tries to access its value.
export const dataStateInitialValue: DataState = {
    researches: [],
    selectedFilter: 'All',
    fields: [],
    selectedField: null,
    selectedResearch: null,
    soilData: null,
    drsYieldData: null,
    depthSoilMoistureData: null,
    weatherData: null,
    nitrateConcentrationData: null,
    cropRotationYield: null
};
