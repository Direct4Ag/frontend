import React from 'react';
// import axios from 'axios';

import { getData } from '@app/store/api';
import { DataActionDispatcherContext, DataStateContext } from '@app/store/contexts';

export const useSoilTextureData = (coordinates: PointCoordinates | undefined): SoilData[] | null => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { soilData } = React.useContext(DataStateContext);

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
                },
                () => undefined
            );
        }
    }, [coordinates]);

    return coordinates ? soilData ?? null : null;
};

export const useDRSYieldData = (researchId: string | undefined): DRSYieldData[] | null => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { drsYieldData } = React.useContext(DataStateContext);

    React.useEffect(() => {
        if (researchId && !drsYieldData) {
            getData<DRSYieldData[]>(
                'drought-resistant-seeds/by_research_id/' + researchId,
                (data) => {
                    dataActionDispatcher({
                        type: 'updateDRSYieldData',
                        drsYieldData: data
                    });
                },
                () => undefined
            );
        }
    }, [researchId]);

    return researchId ? drsYieldData ?? null : null;
};



export const useDepthSoilMoistureData = (
    year: string | undefined,
    field_id: string | undefined
) => {
    const dataActionDispather = React.useContext(DataActionDispatcherContext);
    const { depthSoilMoistureData } = React.useContext(DataStateContext);

    React.useEffect(() => {
        if (field_id && year && !depthSoilMoistureData) {
            getData<{depth_soil_moisture_data: DepthSoilMoistureData}>(
                `fields/${field_id}/sensors/get-geostreams-data/soil-moisture/${year}`,
                (data) => {
                    dataActionDispather({
                        type: 'updateDepthSoilMoistureData',
                        depthSoilMoistureData: data.depth_soil_moisture_data
                    });
                },
                () => undefined
            );
        }
    }, [year, field_id]);

    return depthSoilMoistureData
};

export const useWeatherData = (
    year: string | undefined,
    field_id: string | undefined
) => {
    const dataActionDispather = React.useContext(DataActionDispatcherContext);
    const { weatherData } = React.useContext(DataStateContext);

    React.useEffect(() => {
        if (field_id && year && !weatherData) {
            getData<{weather_data: DepthSoilMoistureData}>(
                `fields/${field_id}/sensors/get-geostreams-data/weather/${year}`,
                (data) => {
                    dataActionDispather({
                        type: 'updateWeatherData',
                        weatherData: data.weather_data
                    });
                },
                () => undefined
            );
        }
    }, [year, field_id]);

    return weatherData
};
