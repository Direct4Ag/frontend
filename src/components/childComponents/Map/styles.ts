export const layerStyles: { [group: string]: { [state: string]: Partial<maplibregl.LayerSpecification> } } = {
    fields: {
        default: {
            type: 'circle',
            paint: {
                'circle-radius': 7,
                'circle-color': '#d5ab1a',
                'circle-opacity': 0.9
            }
        },
        selectedFill: {
            // This style depends on `pulsingDot` in `components/Map/utils.ts`
            type: 'fill',
            layout: {},
            paint: {
                'fill-color': '#FFFFFF',
                'fill-opacity': 0.8,
                'fill-outline-color': '#1D58A7',
            }
        },
        selectedOutline: {
            type: 'line',
            paint: {
                'line-color': '#1D58A7',
                'line-width': 4
            }
        }
    }
};

export const mapStyle: maplibregl.StyleSpecification = {
    version: 8,
    glyphs: `${window.API_FONTS}/{fontstack}/{range}.pbf`,
    sources: {},
    layers: []
};
