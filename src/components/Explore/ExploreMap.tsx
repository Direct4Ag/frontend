import React from 'react';
import maplibregl, { MapLayerEventType } from 'maplibre-gl';
import { useNavigate } from 'react-router-dom';

import { basemapsArray } from '@app/components/childComponents/Map/utils';
import { globals as gs } from '@app/globals';
import Map from '@app/components/childComponents/Map';
import { layerStyles, mapStyle } from '@app/components/childComponents/Map/styles';

import { DataActionDispatcherContext, DataStateContext, MapContext } from '@app/store/contexts';

interface Props {
    handleInfoOpen: (newInfo: { message: string; severity: 'success' | 'info' | 'warning' | 'error' }) => void;
}

const ExploreMap = ({ handleInfoOpen }: Props): JSX.Element => {
    const navigate = useNavigate();
    const [isMapLoaded, setIsMapLoaded] = React.useState(false);
    const { fields, selectedField, researches } = React.useContext(DataStateContext);
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const mapRef = React.useContext(MapContext);

    let hoveredFieldId: number | string | undefined;

    const onMapLoad = (map: maplibregl.Map) => {
        map.addSource('fields-poly', {
            type: 'geojson',
            data: `${window.API_PATH}/fields/geojson`
        });

        map.addSource('fields', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: []
            }
        });

        map.addLayer({
            id: 'fields-poly-fill',
            type: 'fill',
            source: 'fields-poly',
            layout: {},
            paint: {
                'fill-color': '#FFFFFF',
                'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.5]
                // 'fill-outline-color': '#FF5F05',
            }
        });

        map.addLayer({
            id: 'fields-line',
            type: 'line',
            source: 'fields-poly',
            layout: {},
            paint: {
                'line-color': '#FF5F05',
                'line-width': 2
            }
        });

        // The layer for selected field
        map.addLayer({
            ...layerStyles.fields.selectedFill,
            id: 'field-selected-fill',
            source: 'fields-poly',
            filter: ['==', 'name', '']
        } as maplibregl.FillLayerSpecification);

        // The layer for selected field
        map.addLayer({
            ...layerStyles.fields.selectedOutline,
            id: 'field-selected-outline',
            source: 'fields-poly',
            filter: ['==', 'name', '']
        } as maplibregl.FillLayerSpecification);

        map.addLayer({
            id: 'fields-poly-data',
            type: 'symbol',
            source: 'fields-poly',
            layout: {
                'text-field': ['get', 'name'],
                'text-font': ['Roboto Medium'],
                'text-size': 10,
                'text-anchor': 'center',
                'text-offset': [0, 0]
            }
        });

        // When the user moves their mouse over the fields-poly-fill layer, we'll update the
        // feature state for the feature under the mouse.
        map.on('mousemove', 'fields-poly-fill', (e: MapLayerEventType['mousemove']) => {
            if (e.features && e.features.length > 0) {
                const feature = e.features[0];
                if (hoveredFieldId) {
                    map.setFeatureState({ source: 'fields-poly', id: hoveredFieldId }, { hover: false });
                }
                hoveredFieldId = feature.id;
                map.setFeatureState({ source: 'fields-poly', id: hoveredFieldId }, { hover: true });
            }
        });

        // When the mouse leaves the fields-poly-fill layer, update the feature state of the
        // previously hovered feature.
        // and change curser back to a pointer when it leaves.
        map.on('mouseleave', 'fields-poly-fill', () => {
            map.getCanvas().style.cursor = '';

            if (hoveredFieldId) {
                map.setFeatureState({ source: 'fields-poly', id: hoveredFieldId }, { hover: false });
            }
            hoveredFieldId = undefined;
        });

        // Change the cursor to a pointer when the mouse is over the layer layer.
        map.on('mouseenter', 'fields-poly-fill', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        mapRef.current = map;
        setIsMapLoaded(true);
    };

    React.useEffect(() => {
        const map = mapRef.current;
        if (map && isMapLoaded) {
            const fieldSource = map.getSource('fields') as maplibregl.GeoJSONSource;
            if (fieldSource) {
                fieldSource.setData({
                    type: 'FeatureCollection',
                    features: fields.map((field) => ({
                        type: 'Feature',
                        properties: {
                            id: field.id,
                            name: field.field_name
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: field.coordinates
                        }
                    }))
                });
            }

            // Update selected field on click on the following layers
            const eventListener = (e: MapLayerEventType['click']) => {
                if (e.features && e.features[0]) {
                    const feature = e.features[0];
                    const fieldProperties = feature.properties as FieldSmallSummary;
                    const newSelectedField =
                        fields.find(({ field_name }) => fieldProperties.name === field_name) ?? null;
                    const researchDetail = researches.find(
                        ({ field }) => field.field_name === newSelectedField?.field_name
                    );

                    dataActionDispatcher({
                        type: 'updateSelectedField',
                        selectedField: newSelectedField
                    });

                    if (researchDetail && researchDetail.research_type === gs.CONSTANTS.DROUGHT) {
                        dataActionDispatcher({
                            type: 'updateSelectedResearch',
                            selectedResearch: researchDetail
                        });
                        navigate(`/drought-resistant-seeds/${researchDetail.id}`);
                    } else if (researchDetail && researchDetail.research_type === gs.CONSTANTS.CROPROT) {
                        dataActionDispatcher({
                            type: 'updateSelectedResearch',
                            selectedResearch: researchDetail
                        });
                        navigate(`/crop-rotation/${researchDetail.id}`);
                    } else {
                        handleInfoOpen({
                            message: 'No research data available for this field',
                            severity: 'info'
                        });
                    }
                }
            };
            ['fields-poly-fill'].forEach((layerName) => {
                map.on('click', layerName, eventListener);
            });
            return () => {
                ['fields-poly-fill'].forEach((layerName) => {
                    map.off('click', layerName, eventListener);
                });
            };
        }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return () => {};
    }, [fields, selectedField, isMapLoaded]);

    React.useEffect(() => {
        // Update the filter on `field-selected` when selected station changes
        const map = mapRef.current;
        if (map && isMapLoaded) {
            map.setFilter('field-selected-fill', ['==', 'name', selectedField?.field_name || '']);
            map.setFilter('field-selected-outline', ['==', 'name', selectedField?.field_name || '']);
            if (selectedField) {
                map.easeTo({
                    center: selectedField.coordinates,
                    zoom: 15,
                    duration: 1000,
                    padding: 100
                });
            } else {
                const centerCoordinates = fields.map(({ coordinates }) => coordinates);

                const bounds = centerCoordinates.reduce(
                    (bounds, coord) => {
                        return bounds.extend(coord);
                    },
                    new maplibregl.LngLatBounds(centerCoordinates[0], centerCoordinates[0])
                );

                map.fitBounds(bounds, {
                    padding: 150
                });
            }
        }
    }, [selectedField, isMapLoaded]);

    return (
        <Map
            mapOptions={{
                style: mapStyle,
                minZoom: 1
            }}
            initialBounds={[-180, -90, 180, 90]}
            // center={[-88.24341191425448, 40.1164071212825]}
            init_zoom={10}
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
