import React from 'react';
// import axios from 'axios';

import { getData } from '@app/store/api';
import { DataActionDispatcherContext, DataStateContext } from '@app/store/contexts';

export const useNitrateConcentrationData = (
    year: string | undefined | null,
    field_id: string | undefined
): [NitrateConcData | null, boolean, string | null] => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { nitrateConcentrationData } = React.useContext(DataStateContext);
    const [state, setState] = React.useState<{ loading: boolean; error: null | string }>({
        loading: true,
        error: null
    });

    React.useEffect(() => {
        if (field_id && year !== '' && nitrateConcentrationData?.year !== Number(year)) {
            getData<NitrateConcData>(
                `fields/${field_id}/sensors/get-geostreams-data/nitrate-conc/${year}`,
                (data) => {
                    dataActionDispatcher({
                        type: 'updateNitrateConcentrationData',
                        nitrateConcentrationData: {
                            year: data.year,
                            nitrate_concentration_data: data.nitrate_concentration_data
                        }
                    });
                    setState({ loading: false, error: null });
                },
                () => setState({ loading: false, error: 'Failed to fetch nitrate concentration data' })
            );
        } else if (nitrateConcentrationData) {
            setState({ loading: false, error: null });
        }
    }, [year, field_id]);

    const { loading, error } = state;

    return [nitrateConcentrationData, loading, error];
};

export const useCropRotationYieldData = (
    research_id: string | undefined
): [CropRotationYieldData[] | null, boolean, string | null] => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { cropRotationYield } = React.useContext(DataStateContext);
    const [state, setState] = React.useState<{ loading: boolean; error: null | string }>({
        loading: true,
        error: null
    });

    React.useEffect(() => {
        if (research_id && !cropRotationYield) {
            getData<CropRotationYieldData[]>(
                `crop-rotation-yield/by_research_id/${research_id}`,
                (data) => {
                    dataActionDispatcher({
                        type: 'updateCropRotationYieldData',
                        cropRotationYield: data
                    });
                    setState({ loading: false, error: null });
                },
                () => setState({ loading: false, error: 'Failed to fetch crop rotation yield data' })
            );
        } else if (cropRotationYield) {
            setState({ loading: false, error: null });
        }
    }, [research_id]);

    const { loading, error } = state;

    return [cropRotationYield, loading, error];
};

export const useSelectedResearch = (researchId: string): [ResearchDetail | null, boolean, string | null] => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { selectedResearch } = React.useContext(DataStateContext);
    const [state, setState] = React.useState<{ loading: boolean; error: null | string }>({
        loading: true,
        error: null
    });

    React.useEffect(() => {
        if (researchId && !selectedResearch) {
            getData<ResearchDetail>(
                `research/${researchId}`,
                (data) => {
                    dataActionDispatcher({
                        type: 'updateSelectedResearch',
                        selectedResearch: data
                    });
                    dataActionDispatcher({
                        type: 'updateSelectedField',
                        selectedField: data.field
                    });
                    setState({ loading: false, error: null });
                },
                () => setState({ loading: false, error: 'Failed to fetch research data' })
            );
        }
    }, [researchId]);

    const { loading, error } = state;

    return [selectedResearch, loading, error];
};

export const useSoilTextureData = (
    coordinates: PointCoordinates | undefined
): [SoilData[] | null, boolean, string | null] => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { soilData } = React.useContext(DataStateContext);
    const [state, setState] = React.useState<{ loading: boolean; error: null | string }>({
        loading: true,
        error: null
    });

    React.useEffect(() => {
        if (coordinates && !soilData) {
            // TODO: Replace this with variable once we have the API endpoint deployed
            getData<SoilData[]>(
                `${window.COVERCROP_API}/covercrop/api/soils?lat=${coordinates[1]}&lon=${coordinates[0]}`,
                (data) => {
                    dataActionDispatcher({
                        type: 'updateSoilData',
                        soilData: data
                    });
                    setState({ loading: false, error: null });
                },
                () => setState({ loading: false, error: 'Failed to fetch soil texture data' })
            );
        } else if (soilData) {
            setState({ loading: false, error: null });
        }
    }, [coordinates]);

    const { loading, error } = state;

    return [soilData, loading, error];
};

export const useDRSYieldData = (researchId: string | undefined): [DRSYieldData[] | null, boolean, string | null] => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { drsYieldData } = React.useContext(DataStateContext);
    const [state, setState] = React.useState<{ loading: boolean; error: null | string }>({
        loading: true,
        error: null
    });

    React.useEffect(() => {
        if (researchId && !drsYieldData) {
            getData<DRSYieldData[]>(
                'drought-resistant-seeds/by_research_id/' + researchId,
                (data) => {
                    dataActionDispatcher({
                        type: 'updateDRSYieldData',
                        drsYieldData: data
                    });
                    setState({ loading: false, error: null });
                },
                () => setState({ loading: false, error: 'Failed to fetch Yield data' })
            );
        } else if (drsYieldData) {
            setState({ loading: false, error: null });
        }
    }, [researchId]);

    const { loading, error } = state;

    return [drsYieldData, loading, error];
};

export const useDepthSoilMoistureData = (
    year: string | undefined,
    field_id: string | undefined
): [DepthSoilMoistureData | null, boolean, string | null] => {
    const dataActionDispather = React.useContext(DataActionDispatcherContext);
    const { depthSoilMoistureData } = React.useContext(DataStateContext);
    const [state, setState] = React.useState<{ loading: boolean; error: null | string }>({
        loading: true,
        error: null
    });

    React.useEffect(() => {
        if (field_id && year && !depthSoilMoistureData) {
            getData<{ depth_soil_moisture_data: DepthSoilMoistureData }>(
                `fields/${field_id}/sensors/get-geostreams-data/soil-moisture/${year}`,
                (data) => {
                    dataActionDispather({
                        type: 'updateDepthSoilMoistureData',
                        depthSoilMoistureData: data.depth_soil_moisture_data
                    });
                    setState({ loading: false, error: null });
                },
                () => setState({ loading: false, error: 'Failed to fetch soil data' })
            );
        } else if (depthSoilMoistureData) {
            setState({ loading: false, error: null });
        }
    }, [year, field_id]);

    const { loading, error } = state;

    return [depthSoilMoistureData, loading, error];
};

export const useWeatherData = (
    year: string | undefined | null,
    field_id: string | undefined
): [WeatherData | null, boolean, string | null] => {
    const dataActionDispather = React.useContext(DataActionDispatcherContext);
    const { weatherData } = React.useContext(DataStateContext);
    const [state, setState] = React.useState<{ loading: boolean; error: null | string }>({
        loading: true,
        error: null
    });

    React.useEffect(() => {
        if (field_id && year !== '' && weatherData?.year !== Number(year)) {
            console.log('fetching weather data');
            getData<{ weather_data: DepthSoilMoistureData }>(
                `fields/${field_id}/sensors/get-geostreams-data/weather/${year}`,
                (data) => {
                    dataActionDispather({
                        type: 'updateWeatherData',
                        weatherData: data.weather_data
                    });
                    setState({ loading: false, error: null });
                },
                () => setState({ loading: false, error: 'Failed to fetch weather data' })
            );
        } else if (weatherData) {
            setState({ loading: false, error: null });
        }
    }, [year, field_id]);

    const { loading, error } = state;

    return [weatherData, loading, error];
};
