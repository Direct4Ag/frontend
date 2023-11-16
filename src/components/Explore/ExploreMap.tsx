import React from "react";

import { basemapsArray } from '../childComponents/Map/utils';
import Map from "../childComponents/Map";
import { mapStyle } from '../childComponents/Map/styles';

const ExploreMap = (): JSX.Element => {

    const [isMapLoaded, setIsMapLoaded] = React.useState(false);

    const onMapLoad = (map: maplibregl.Map) => {
        setIsMapLoaded(true);
    }

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
    )
}

export default ExploreMap;