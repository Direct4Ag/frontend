import React from 'react';
// import axios from 'axios';

import { getData, asyncGetData } from '@app/store/api';
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
): DepthSoilMoistureData | null => {
    const dataActionDispather = React.useContext(DataActionDispatcherContext);
    const { depthSoilMoistureData } = React.useContext(DataStateContext);
    const [fieldSensors, setFieldSensors] = React.useState<FieldSensors[]>([]);

    React.useEffect(() => {
        if (field_id) {
            getData<FieldSensors[]>(
                `fields/${field_id}/sensors`,
                (data) => {
                    setFieldSensors(data);
                },
                () => undefined
            );
        }
    }, [field_id]);

    React.useEffect(() => {
        if (year && !depthSoilMoistureData && fieldSensors.length !== 0) {
            let data = null
            let depthMoistureData = {}
            fieldSensors.forEach(async ({ depth, sensor_id }) => {
                // TODO: Replace this with variable once we have the API endpoint deployed
                data = await asyncGetData(`https://direct4ag.ncsa.illinois.edu/geostreams/api/cache/day/${sensor_id}?since=${year}-01-01T00:00:00&until=${year}-12-31T00:00:00`)
                depthMoistureData = {
                    ...depthMoistureData,
                    [depth]: {
                        data: data.properties.soil_moisture.map((sm: any) => {
                            return {
                                average: sm.average,
                                year: sm.year,
                                month: sm.month,
                                day: sm.day,
                                label: sm.label
                            };
                        })
                    }
                };
                // update the depthSoilMoistureData in datastate context
                dataActionDispather({
                    type: 'updateDepthSoilMoistureData',
                    depthSoilMoistureData: depthMoistureData
                });
            });
        }
    }, [year, fieldSensors]);
    return (year && field_id) ? depthSoilMoistureData ?? null : null;
};
