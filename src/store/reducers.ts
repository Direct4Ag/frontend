export const dataReducers = (state: DataState, action: DataAction): DataState => {
    switch (action.type) {
        case 'loadResearches':
            return {
                ...state,
                researches: action.researches
            };
        case 'updateExploreFilter':
            return {
                ...state,
                selectedFilter: action.selectedFilter
            };
    }
    throw Error(`Received invalid action: ${action}`);
}