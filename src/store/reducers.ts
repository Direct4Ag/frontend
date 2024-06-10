export const dataReducers = (state: DataState, action: DataAction): DataState => {
    switch (action.type) {
        case 'loadResearches':
            return {
                ...state,
                researches: action.researches
            };
        case 'loadFields':
            return {
                ...state,
                fields: action.fields
            };
        case 'updateExploreFilter':
            return {
                ...state,
                selectedFilter: action.selectedFilter
            };
        case 'updateSelectedField':
            return {
                ...state,
                selectedField: action.selectedField
            };
        case 'updateSelectedResearch':
            return {
                ...state,
                selectedResearch: action.selectedResearch
            };
        case 'updateSoilData':
            return {
                ...state,
                soilData: action.soilData
            };
        case 'updateDRSYieldData':
            return {
                ...state,
                drsYieldData: action.drsYieldData
            };
        case 'updateDepthSoilMoistureData':
            return {
                ...state,
                depthSoilMoistureData: action.depthSoilMoistureData
            };
        case 'updateWeatherData':
            return {
                ...state,
                weatherData: action.weatherData
            };
    }
    throw Error(`Received invalid action: ${action}`);
};
