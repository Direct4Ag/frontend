import React from 'react';
// import axios from 'axios';

import { getData } from '@app/store/api';
import { DataActionDispatcherContext, DataStateContext } from '@app/store/contexts';

export const useSoilTextureData = (coordinates: PointCoordinates | undefined): [SoilData[] | null, boolean, string | null] => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { soilData } = React.useContext(DataStateContext);
    const [state, setState] = React.useState<{loading: boolean, error: null | string}>({loading: true, error: null});

    React.useEffect(() => {
        if (coordinates && !soilData) {
            // TODO: Replace this with variable once we have the API endpoint deployed
            getData<SoilData[]>(
                `https://direct4ag.ncsa.illinois.edu/api/soils?lat=${coordinates[1]}&lon=${coordinates[0]}`,
                (data) => {
                    dataActionDispatcher({
                        type: 'updateSoilData',
                        soilData: data
                    });
                    setState({loading: false, error: null});
                },
                () => setState({loading: false, error: 'Failed to fetch soil texture data'})
            );
        } else if (soilData) {
            setState({loading: false, error: null});
        }
    }, [coordinates]);

    const { loading, error } = state;

    return coordinates ? [soilData, loading, error] ?? [null, loading, error] : [null, loading, error];
};

export const useDRSYieldData = (researchId: string | undefined): [DRSYieldData[] | null, boolean, string | null] => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { drsYieldData } = React.useContext(DataStateContext);
    const [state, setState] = React.useState<{loading: boolean, error: null | string}>({loading: true, error: null});

    React.useEffect(() => {
        if (researchId && !drsYieldData) {
            getData<DRSYieldData[]>(
                'drought-resistant-seeds/by_research_id/' + researchId,
                (data) => {
                    dataActionDispatcher({
                        type: 'updateDRSYieldData',
                        drsYieldData: data
                    });
                    setState({loading: false, error: null});
                },
                () => setState({loading: false, error: 'Failed to fetch Yield data'})
            );
        }
        else if (drsYieldData) {
            setState({loading: false, error: null});
        }
    }, [researchId]);

    const { loading, error } = state;

    return researchId ? [drsYieldData, loading, error] ?? [null, loading, error] : [null, loading, error];
};



export const useDepthSoilMoistureData = (
    year: string | undefined,
    field_id: string | undefined
): [DepthSoilMoistureData | null, boolean, string | null] => {
    const dataActionDispather = React.useContext(DataActionDispatcherContext);
    const { depthSoilMoistureData } = React.useContext(DataStateContext);
    const [state, setState] = React.useState<{loading: boolean, error: null | string}>({loading: true, error: null});

    React.useEffect(() => {
        if (field_id && year && !depthSoilMoistureData) {
            getData<{depth_soil_moisture_data: DepthSoilMoistureData}>(
                `fields/${field_id}/sensors/get-geostreams-data/soil-moisture/${year}`,
                (data) => {
                    dataActionDispather({
                        type: 'updateDepthSoilMoistureData',
                        depthSoilMoistureData: data.depth_soil_moisture_data
                    });
                    setState({loading: false, error: null});
                },
                () => setState({loading: false, error: 'Failed to fetch soil data'})
            );
        } else if (depthSoilMoistureData) {
            setState({loading: false, error: null});
        }
    }, [year, field_id]);

    const { loading, error } = state;

    return [depthSoilMoistureData, loading, error]
};

export const useWeatherData = (
    year: string | undefined,
    field_id: string | undefined
): [WeatherData | null, boolean, string | null] => {
    const dataActionDispather = React.useContext(DataActionDispatcherContext);
    const { weatherData } = React.useContext(DataStateContext);
    const [state, setState] = React.useState<{loading: boolean, error: null | string}>({loading: true, error: null});

    React.useEffect(() => {
        if (field_id && year && !weatherData) {
            getData<{weather_data: DepthSoilMoistureData}>(
                `fields/${field_id}/sensors/get-geostreams-data/weather/${year}`,
                (data) => {
                    dataActionDispather({
                        type: 'updateWeatherData',
                        weatherData: data.weather_data
                    });
                    setState({loading: false, error: null});
                },
                () => setState({loading: false, error: 'Failed to fetch weather data'})
            );
        } else if (weatherData) {
            setState({loading: false, error: null});
        }
    }, [year, field_id]);

    const { loading, error } = state;

    return [weatherData, loading, error]
};
