import React from 'react';
import maplibre from 'maplibre-gl';
import Box from '@mui/material/Box';
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import BasemapsControl, { MapLibreBasemapsControlOptions } from 'maplibre-gl-basemaps';

import { MapControl } from './Control';
import LayersControl from './LayersControl';
import Help from './Help';

interface Props {
    mapOptions: Partial<maplibregl.MapOptions>;
    initialBounds?: maplibregl.LngLatBoundsLike;
    center?: maplibregl.LngLatLike;
    attribution?: boolean;
    help?: boolean;
    navigation?: boolean;
    basemaps?: MapLibreBasemapsControlOptions;
    LayersControlProps?: LayersControlProps[];
    onLoad: (map: maplibregl.Map) => void;
}

const Map = ({
    mapOptions,
    initialBounds,
    center,
    attribution,
    help,
    navigation,
    basemaps,
    LayersControlProps,
    onLoad
}: Props): JSX.Element => {
    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const mapRef = React.useRef<maplibregl.Map>();

    const resetPitchButtonRef = React.useRef<HTMLButtonElement>(null);
    const resetBoundsButtonRef = React.useRef<HTMLButtonElement>(null);

    const helpButtonRef = React.useRef<HTMLButtonElement>(null);
    const [showHelp, updateShowHelp] = React.useState(false);

    const [zoom] = React.useState(6);

    const layersControlRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (maplibre.supported() && mapContainerRef.current) {
            let mapInit = {
                container: mapContainerRef.current,
                zoom: zoom,
                attributionControl: !attribution,
                ...mapOptions
            };

            if (center) {
                mapInit.center = center;
            } else {
                mapInit.bounds = initialBounds;
            }

            const map = new maplibre.Map(mapInit as maplibregl.MapOptions);

            if (attribution) {
                map.addControl(new maplibre.AttributionControl({ compact: true }), 'bottom-right');
            }

            if (navigation) {
                map.addControl(new maplibre.NavigationControl({}));
                if (resetPitchButtonRef.current) {
                    map.addControl(new MapControl(resetPitchButtonRef.current));
                }
                if (resetBoundsButtonRef.current) {
                    map.addControl(new MapControl(resetBoundsButtonRef.current));
                }
            }

            if (basemaps) {
                map.addControl(new BasemapsControl(basemaps), 'bottom-left');
            }

            if (help && helpButtonRef.current) {
                map.addControl(new MapControl(helpButtonRef.current), 'bottom-right');
            }

            if (LayersControlProps && layersControlRef.current) {
                map.addControl(new MapControl(layersControlRef.current), 'top-left');
            }

            map.on('load', () => {
                onLoad(map);
            });
            mapRef.current = map;
        }
    }, []);

    return (
        <Box ref={mapContainerRef} sx={{ height: '100%', flexGrow: 1, background: 'white' }}>
            {maplibre.supported() ? null : 'Your browser does not support the map features.'}

            {LayersControlProps ? (
                <Box ref={layersControlRef} className="maplibregl-ctrl-group">
                    <LayersControl map={mapRef.current} layers={LayersControlProps} />
                </Box>
            ) : null}

            {navigation ? (
                <>
                    <Box ref={resetPitchButtonRef} className="maplibregl-ctrl-group">
                        <button
                            type="button"
                            title="Reset map pitch"
                            onClick={() => {
                                if (mapRef.current) {
                                    mapRef.current.easeTo({ pitch: 0 });
                                }
                            }}
                        >
                            <ThreeSixtyIcon sx={{ color: 'black' }} />
                        </button>
                    </Box>

                    <Box ref={resetBoundsButtonRef} className="maplibregl-ctrl-group">
                        <button
                            type="button"
                            title="Reset Map"
                            onClick={() => {
                                if (mapRef.current) {
                                    if (center) {
                                        mapRef.current?.flyTo({ center: center, zoom: zoom });
                                    } else {
                                        mapRef.current?.fitBounds(initialBounds as maplibregl.LngLatBoundsLike);
                                    }
                                }
                            }}
                        >
                            <ZoomOutMapIcon sx={{ color: 'black' }}></ZoomOutMapIcon>
                        </button>
                    </Box>
                </>
            ) : null}

            {help ? (
                <>
                    <Box ref={helpButtonRef} className="maplibre-ctrl-group">
                        <button type="button" title="How to navigate the map" onClick={() => updateShowHelp(true)}>
                            <QuestionMarkIcon sx={{ color: 'black' }}></QuestionMarkIcon>
                        </button>
                        <Help open={showHelp} onClose={() => updateShowHelp(false)} />
                    </Box>
                </>
            ) : null}
        </Box>
    );
};

export default Map;