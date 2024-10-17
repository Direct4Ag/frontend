import { PaletteOptions, createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface PaletteOptions {
        default: {
            dark: string;
            main: string;
            light: string;
            contrastText: string;
            btnHoverText: string;
            btnLightBackground: string;
            chipTextColor: string;
        };
    }
    interface Palette {
        default: {
            dark: string;
            main: string;
            light: string;
            contrastText: string;
            btnHoverText: string;
            btnLightBackground: string;
            chipTextColor: string;
        };
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        'explore-contained': true;
        'explore-card-btn': true;
    }
}

const palette: PaletteOptions = {
    primary: {
        main: '#1D58A7',
        light: 'rgba(224, 241, 248, 1)'
    },
    default: {
        dark: '#d9d9d9',
        main: '#fff',
        light: '#f2f2f2',
        contrastText: '#fff',
        chipTextColor: 'rgba(13, 72, 151, 1)',
        btnHoverText: '#0D4897',
        btnLightBackground: 'rgba(166, 215, 235, 1)'
    },
    text: {
        primary: 'rgba(19, 41, 75, 0.87)',
        secondary: 'rgba(19, 41, 75, 0.6)',
        disabled: 'rgba(0, 0, 0, 0.38)'
    }
};

export const themeOptions = {
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536
        }
    },
    palette,
    typography: {
        fontFamily: ['Lexend Deca', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'].join(',')
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 0 }
            }
        }
    }
} as ThemeOptions;

export const theme = createTheme(themeOptions);

theme.typography.h1 = {
    fontSize: '6rem',
    [theme.breakpoints.down('md')]: {
        fontSize: '5.5rem'
    }
};

theme.typography.h2 = {
    fontSize: '3.75rem',
    [theme.breakpoints.down('md')]: {
        fontSize: '3rem'
    }
};

theme.typography.h3 = {
    fontSize: '3rem',
    [theme.breakpoints.down('md')]: {
        fontSize: '2.75rem'
    }
};

theme.typography.h4 = {
    fontSize: '2.125rem',
    [theme.breakpoints.down('md')]: {
        fontSize: '2rem'
    }
};

theme.typography.h5 = {
    fontSize: '1.5rem',
    [theme.breakpoints.down('md')]: {
        fontSize: '1.25rem'
    }
};

theme.typography.h6 = {
    fontSize: '1.25rem',
    [theme.breakpoints.down('md')]: {
        fontSize: '1rem'
    }
};
