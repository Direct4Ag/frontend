import React from 'react';
// import axios from 'axios';

import { getData } from '@app/store/api';
import { DataActionDispatcherContext, DataStateContext } from '@app/store/contexts';

export const useNitrateConcentrationData = (
    year: string | undefined | null,
    research_id: string | undefined
): [NitrateConcData | null, boolean, string | null] => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { nitrateConcentrationData } = React.useContext(DataStateContext);
    const [state, setState] = React.useState<{ loading: boolean; error: null | string }>({
        loading: true,
        error: null
    });

    React.useEffect(() => {
        if (research_id && year !== '' && nitrateConcentrationData?.year !== Number(year)) {
            getData<NitrateConcData>(
                `research/${research_id}/sensors/get-geostreams-data/nitrate-conc/${year}`,
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
    }, [year, research_id]);

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

export const useCoverCropData = (
    researchId: string | undefined
): [CoverCropYieldData[] | null, boolean, string | null] => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { coverCropYield } = React.useContext(DataStateContext);
    const [state, setState] = React.useState<{ loading: boolean; error: null | string }>({
        loading: true,
        error: null
    });

    React.useEffect(() => {
        if (researchId && !coverCropYield) {
            getData<CoverCropYieldData[]>(
                'cover-crop/by_research_id/' + researchId,
                (data) => {
                    dataActionDispatcher({
                        type: 'updateCoverCropYieldData',
                        coverCropYield: data
                    });
                    setState({ loading: false, error: null });
                },
                () => setState({ loading: false, error: 'Failed to fetch cover crop data' })
            );
        } else if (coverCropYield) {
            setState({ loading: false, error: null });
        }
    }, [researchId]);

    const { loading, error } = state;

    return [coverCropYield, loading, error];
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

const isEmptyData = (data: DepthSoilMoistureData | WeatherData): boolean => {
    if (Object.keys(data).length !== 0) {
        return false;
    }
    return true;
};

export const useDepthSoilMoistureData = (
    year: string | undefined,
    research_id: string | undefined
): [DepthSoilMoistureDataWithYear | null, boolean, string | null] => {
    const dataActionDispather = React.useContext(DataActionDispatcherContext);
    const { depthSoilMoistureData } = React.useContext(DataStateContext);
    const [state, setState] = React.useState<{ loading: boolean; error: null | string }>({
        loading: true,
        error: null
    });

    React.useEffect(() => {
        if (research_id && year !== '' && depthSoilMoistureData?.year !== year) {
            getData<{ depth_soil_moisture_data: DepthSoilMoistureData }>(
                `research/${research_id}/sensors/get-geostreams-data/soil-moisture/${year}`,
                (data) => {
                    if (isEmptyData(data.depth_soil_moisture_data)) {
                        setState({ loading: false, error: 'No Sensor data available for this year' });
                        dataActionDispather({
                            type: 'updateDepthSoilMoistureData',
                            depthSoilMoistureData: null
                        });
                        return;
                    }
                    dataActionDispather({
                        type: 'updateDepthSoilMoistureData',
                        depthSoilMoistureData: { year: year, data: data.depth_soil_moisture_data }
                    });
                    setState({ loading: false, error: null });
                },
                () => setState({ loading: false, error: 'Failed to fetch soil data' })
            );
        } else if (depthSoilMoistureData) {
            setState({ loading: false, error: null });
        }
    }, [year, research_id]);

    const { loading, error } = state;

    return [depthSoilMoistureData, loading, error];
};

export const useAvailableYears = (research_id: string | undefined): [string[] | null, boolean, string | null] => {
    const dataActionDispather = React.useContext(DataActionDispatcherContext);
    const { cropRotationWeatherYears } = React.useContext(DataStateContext);
    const [state, setState] = React.useState<{ loading: boolean; error: null | string }>({
        loading: true,
        error: null
    });

    React.useEffect(() => {
        if (research_id && !cropRotationWeatherYears) {
            getData<{ years: string[] }>(
                `research/${research_id}/sensors/get-years`,
                (data) => {
                    dataActionDispather({
                        type: 'updateCropRotationWeatherYears',
                        cropRotationWeatherYears: data.years
                    });
                    setState({ loading: false, error: null });
                },
                () => setState({ loading: false, error: 'Failed to fetch available years' })
            );
        } else if (cropRotationWeatherYears) {
            setState({ loading: false, error: null });
        }
    }, [research_id]);

    const { loading, error } = state;

    return [cropRotationWeatherYears, loading, error];
};

export const useWeatherData = (
    year: string | undefined | null,
    research_id: string | undefined
): [WeatherData | null, boolean, string | null] => {
    const dataActionDispather = React.useContext(DataActionDispatcherContext);
    const { weatherData } = React.useContext(DataStateContext);
    const [state, setState] = React.useState<{ loading: boolean; error: null | string }>({
        loading: true,
        error: null
    });

    React.useEffect(() => {
        if (research_id && year !== '' && weatherData?.year !== Number(year)) {
            getData<{ weather_data: WeatherData }>(
                `research/${research_id}/sensors/get-geostreams-data/weather/${year}`,
                (data) => {
                    if (isEmptyData(data.weather_data)) {
                        setState({ loading: false, error: 'No Sensor data available for this year' });
                        dataActionDispather({
                            type: 'updateWeatherData',
                            weatherData: null
                        });
                        return;
                    }
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
    }, [year, research_id]);

    const { loading, error } = state;

    return [weatherData, loading, error];
};
