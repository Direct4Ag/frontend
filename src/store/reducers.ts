export const dataReducers = (state: DataState, action: DataAction): DataState => {
    switch (action.type) {
        case 'loadFarms':
            return {
                ...state,
                farms: action.farms
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
    }
    throw Error(`Received invalid action: ${action}`);
}