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

const isEmptyDepthSoilMoistureData = (data: DepthSoilMoistureData): boolean => {
    // check if data with these keys are empty
    if (Object.values(data).every((value) => value.data && value.data.length === 0)) {
        return true;
    }
    return false;
};

const isEmptyWeatherData = (data: WeatherData): boolean => {
    // check if data with these keys are empty
    if (Object.values(data).every((value) => value.length === 0)) {
        return true;
    }
    return false;
};

export const useDepthSoilMoistureData = (
    year: string | null,
    research_id: string | undefined
): [DepthSoilMoistureDataWithYear | null, boolean, string | null] => {
    const [depthSoilMoistureData, setDepthSoilMoistureData] = React.useState<DepthSoilMoistureDataWithYear | null>(
        null
    );
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchDepthSoilMoistureData = React.useCallback(() => {
        if (!year || !research_id) {
            setLoading(false);
            setError(null);
            return;
        }

        getData<{ depth_soil_moisture_data: DepthSoilMoistureData }>(
            `research/${research_id}/sensors/get-geostreams-data/soil-moisture/${year}`,
            (data) => {
                if (!isEmptyDepthSoilMoistureData(data.depth_soil_moisture_data)) {
                    setDepthSoilMoistureData({
                        year,
                        data: data.depth_soil_moisture_data
                    });
                }
                setLoading(false);
            },
            () => {
                setError('Failed to fetch soil data');
                setLoading(false);
            }
        );
    }, [year, research_id]);

    React.useEffect(() => {
        if (!year || !research_id) {
            setLoading(false);
            setError(null);
            return;
        }

        fetchDepthSoilMoistureData();
    }, [year, research_id, fetchDepthSoilMoistureData]);

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
    const [weatherData, setWeatherData] = React.useState<WeatherData | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchWeatherData = React.useCallback(async () => {
        if (!year || !research_id) return;

        getData<{ weather_data: WeatherData }>(
            `research/${research_id}/sensors/get-geostreams-data/weather/${year}`,
            (data) => {
                if (!isEmptyWeatherData(data.weather_data)) {
                    console.log(data.weather_data);
                    setWeatherData(data.weather_data);
                }
                setLoading(false);
            },
            () => {
                setError('Failed to fetch weather data');
                setLoading(false);
            }
        );
    }, [year, research_id]);

    React.useEffect(() => {
        if (!year || !research_id) {
            setLoading(false);
            setError(null);
            return;
        }

        fetchWeatherData();
    }, [year, research_id, fetchWeatherData]);

    return [weatherData, loading, error];
};

export type CombinedSensorData = {
    depthSoilMoistureData: DepthSoilMoistureDataWithYear | null;
    weatherData: WeatherData | null;
};

export const useCombinedSensorData = (
    year: string | null,
    research_id: string | undefined
): [CombinedSensorData | null, boolean, string | null] => {
    const [combinedData, setCombinedData] = React.useState<CombinedSensorData | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        // If year or research_id is missing, we stop loading and clear any previous data/error.
        if (!year || !research_id) {
            setCombinedData(null);
            setLoading(false);
            setError(null);
            return;
        }

        let isCancelled = false;
        setLoading(true);
        setError(null);

        // Wrap each getData call in a Promise
        const fetchDepthData = new Promise<DepthSoilMoistureDataWithYear | null>((resolve, reject) => {
            getData<{ depth_soil_moisture_data: DepthSoilMoistureData }>(
                `research/${research_id}/sensors/get-geostreams-data/soil-moisture/${year}`,
                (data) => {
                    if (!isEmptyDepthSoilMoistureData(data.depth_soil_moisture_data)) {
                        resolve({
                            year,
                            data: data.depth_soil_moisture_data
                        });
                    } else {
                        resolve(null);
                    }
                },
                () => {
                    reject('Failed to fetch soil data');
                }
            );
        });

        const fetchWeatherData = new Promise<WeatherData | null>((resolve, reject) => {
            getData<{ weather_data: WeatherData }>(
                `research/${research_id}/sensors/get-geostreams-data/weather/${year}`,
                (data) => {
                    if (!isEmptyWeatherData(data.weather_data)) {
                        resolve(data.weather_data);
                    } else {
                        resolve(null);
                    }
                },
                () => {
                    reject('Failed to fetch weather data');
                }
            );
        });

        // Run both calls concurrently
        Promise.all([fetchDepthData, fetchWeatherData])
            .then(([depthData, weatherData]) => {
                if (!isCancelled) {
                    setCombinedData({
                        depthSoilMoistureData: depthData,
                        weatherData: weatherData
                    });
                    setLoading(false);
                    setError(null);
                }
            })
            .catch((err) => {
                if (!isCancelled) {
                    setError(err);
                    setLoading(false);
                }
            });

        return () => {
            isCancelled = true;
        };
    }, [year, research_id]);

    return [combinedData, loading, error];
};
