interface Globals {
    CONSTANTS: {
        [key: string]: string;
    };
}

const CONSTANTS = {
    COVERCROP: 'Cover Crop',
    CROPROT: 'Crop Rotation',
    DROUGHT: 'Drought-resistant Seeds',
    IRRIGATION: 'Irrigation Strategies',
    NITCON: 'Nitrogen Conservation',
    WATMAN: 'Water Resource Management'
};

const globals: Globals = {
    CONSTANTS: CONSTANTS
};

export { globals };
