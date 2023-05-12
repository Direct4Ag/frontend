import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface PaletteOptions {
        default: {
            dark: string;
            main: string;
            light: string;
            contrastText: string;
        };
    }
    interface Palette {
        default: {
            dark: string;
            main: string;
            light: string;
            contrastText: string;
        };
    }
}

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
    palette: {
        default: {
            dark: '#d9d9d9',
            main: '#fff',
            light: '#fff',
            contrastText: '#fff'
        }
    },
    typography: {
        fontFamily: ['Lexend Deca', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'].join(',')
    }
};

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