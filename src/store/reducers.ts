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
    }
    throw Error(`Received invalid action: ${action}`);
}