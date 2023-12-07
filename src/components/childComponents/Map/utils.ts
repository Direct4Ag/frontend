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
