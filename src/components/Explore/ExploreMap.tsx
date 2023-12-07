import React from 'react';

import { basemapsArray } from '../childComponents/Map/utils';
import Map from '../childComponents/Map';
import { mapStyle } from '../childComponents/Map/styles';

const ExploreMap = (): JSX.Element => {
    const [isMapLoaded, setIsMapLoaded] = React.useState(false);

    const onMapLoad = (map: maplibregl.Map) => {
        setIsMapLoaded(true);
        map.addSource('maine', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [-88.26620323, 40.025925997],
                            [-88.26618567, 40.027128697],
                            [-88.265998642, 40.027257323],
                            [-88.265408073, 40.027515505],
                            [-88.264669538, 40.027821058],
                            [-88.264153562, 40.028089853],
                            [-88.263717955, 40.028400581],
                            [-88.263111703, 40.02888896],
                            [-88.2594983, 40.026062611],
                            [-88.258544538, 40.026805266],
                            [-88.262125804, 40.029637211],
                            [-88.261191544, 40.03035553],
                            [-88.262668734, 40.031542607],
                            [-88.262644662, 40.032735448],
                            [-88.262568938, 40.032726598],
                            [-88.261949138, 40.032148047],
                            [-88.259222743, 40.032120042],
                            [-88.257049136, 40.032096239],
                            [-88.256946173, 40.024866049],
                            [-88.258180338, 40.024843825],
                            [-88.25817831, 40.02620493],
                            [-88.258476138, 40.026213138],
                            [-88.258508864, 40.024844392],
                            [-88.26507484, 40.024894109],
                            [-88.265920262, 40.024903506],
                            [-88.265968521, 40.025928561],
                            [-88.26620323, 40.025925997]
                        ]
                    ]
                }
            }
        });
        map.addLayer({
            id: 'maine',
            type: 'fill',
            source: 'maine',
            layout: {},
            paint: {
                'fill-color': '#088',
                'fill-opacity': 0.8,
                'fill-outline-color': '#000'
            }
        });
    };

    return (
        <Map
            mapOptions={{
                style: mapStyle,
                minZoom: 1
            }}
            // initialBounds={[-180, -90, 180, 90]}
            center={[-89, 40]}
            attribution
            help
            navigation
            basemaps={{
                basemaps: [basemapsArray.OSM],
                initialBasemap: 'OSM',
                expandDirection: 'top'
            }}
            onLoad={onMapLoad}
        />
    );
};

export default ExploreMap;
