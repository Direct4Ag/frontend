export const basemapsArray = {
    World_Imagery: {
        id: 'World_Imagery',
        tiles: ['https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        sourceExtraParams: {
            tileSize: 256,
            attribution: 'Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
        }
    },
    World_Street_Map: {
        id: 'World_Street_Map',
        tiles: ['https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'],
        sourceExtraParams: {
            tileSize: 256,
            attribution:
                'Sources: Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, (c) OpenStreetMap contributors, and the GIS User Community'
        }
    },
    OSM: {
        id: 'OSM',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        sourceExtraParams: {
            tileSize: 256,
            attribution: 'Tiles courtesy of <a href="http://openstreetmap.org">OpenStreetMap</a>'
        }
    },
    World_Terrain_Base: {
        id: 'World_Terrain_Base',
        tiles: ['https://services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}'],
        sourceExtraParams: {
            tileSize: 256,
            attribution:
                'Sources: Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, (c) OpenStreetMap contributors, and the GIS User Community'
        }
    },
    World_Terrain_Base_Ref: {
        id: 'World_Terrain_Base_Ref',
        tiles: [
            'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/tile/{z}/{y}/{x}'
        ],
        sourceExtraParams: {
            tileSize: 256,
            attribution: 'Sources: Esri, Garmin, USGS, NPS'
        }
    },
    Carto: {
        id: 'Carto',
        tiles: [
            'https://a.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
            'https://b.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
            'https://c.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
            'https://d.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png'
        ],
        sourceExtraParams: {
            tileSize: 256,
            attribution: '&#169; <a href="https://www.carto.com">Carto</a>'
        }
    }
};

/**
 * See discussions here: https://github.com/mapbox/mapbox-gl-js/issues/6707
 */
export function runWhenReady(map: maplibregl.Map, fn: () => void) {
    if (map.loaded()) {
        fn();
    } else {
        map.once('render', fn);
    }
}

/**
 * MapLibre GL JS v3 has removed `mapbox-gl-supported` from their API.
 * This function is copied from: https://maplibre.org/maplibre-gl-js/docs/examples/check-for-support/
 *
 * Caveat: This function creates a new WebGL context which won't be destroyed until garbage collection.
 * Calling this function repeatedly will likely cause the "too many active WebGL contexts" error.
 */
function detectWebglSupport() {
    if (window.WebGLRenderingContext) {
        const canvas = document.createElement('canvas');
        try {
            // Note that { failIfMajorPerformanceCaveat: true } can be passed as a second argument
            // to canvas.getContext(), causing the check to fail if hardware rendering is not available. See
            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
            // for more details.
            const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
            if (context && typeof context.getParameter === 'function') {
                return true;
            }
        } catch (e) {
            // WebGL is supported, but disabled
        }
        return false;
    }
    // WebGL not supported
    return false;
}

export const IS_WEBGL_SUPPORTED = detectWebglSupport();
