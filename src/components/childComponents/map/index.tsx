import React from 'react';
import maplibre from 'maplibre-gl';
import Box from '@mui/material/Box';
import {
    ThreeSixty as ThreeSixtyIcon,
    ZoomOutMap as ZoomOutMapIcon,
    QuestionMark as QuestionMarkIcon
} from '@mui/icons-material';
import BasemapsControl, { MapLibreBasemapsControlOptions } from 'maplibre-gl-basemaps';

import { MapControl } from './Control';
import Help from './Help';
import { IS_WEBGL_SUPPORTED } from './utils';

interface Props {
    mapOptions: Partial<maplibregl.MapOptions>;
    initialBounds?: maplibregl.LngLatBoundsLike;
    center?: maplibregl.LngLatLike;
    attribution?: boolean;
    help?: boolean;
    navigation?: boolean;
    basemaps?: MapLibreBasemapsControlOptions;
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
    onLoad
}: Props): JSX.Element => {
    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const mapRef = React.useRef<maplibregl.Map>();

    const resetPitchButtonRef = React.useRef<HTMLButtonElement>(null);
    const resetBoundsButtonRef = React.useRef<HTMLButtonElement>(null);

    const helpButtonRef = React.useRef<HTMLButtonElement>(null);
    const [showHelp, updateShowHelp] = React.useState(false);

    const [zoom] = React.useState(6);

    React.useEffect(() => {
        if (maplibre.supported() && mapContainerRef.current) {
            const mapInit = {
                container: mapContainerRef.current,
                zoom,
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

            map.on('load', () => {
                onLoad(map);
            });
            mapRef.current = map;
        }
    }, []);

    return (
        <Box
            ref={mapContainerRef}
            sx={{
                'height': '100%'
            }}
        >
            {IS_WEBGL_SUPPORTED ? null : 'Your browser does not support the map features.'}

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
                                        mapRef.current?.flyTo({ center, zoom });
                                    } else {
                                        mapRef.current?.fitBounds(initialBounds as maplibregl.LngLatBoundsLike);
                                    }
                                }
                            }}
                        >
                            <ZoomOutMapIcon sx={{ color: 'black' }} />
                        </button>
                    </Box>
                </>
            ) : null}

            {help ? (
                <Box ref={helpButtonRef} className="maplibre-ctrl-group">
                    <button type="button" title="How to navigate the map" onClick={() => updateShowHelp(true)}>
                        <QuestionMarkIcon sx={{ color: 'black' }} />
                    </button>
                    <Help open={showHelp} onClose={() => updateShowHelp(false)} />
                </Box>
            ) : null}
        </Box>
    );
};

export default Map;
