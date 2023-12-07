import React, { StrictMode, Suspense } from 'react';
// eslint-disable-next-line import/no-unresolved
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import routes from './routes';
import { theme } from './theme';

import Loading from './components/Loading';
import './styles/main.scss';

const App = (): JSX.Element => {
    return (
        <StrictMode>
            <Router>
                <CssBaseline />
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <Suspense fallback={<Loading />}>
                            <Routes>
                                {Object.entries(routes).map(([path, props]) => (
                                    <Route key={path} path={path} {...props} />
                                ))}
                            </Routes>
                        </Suspense>
                    </ThemeProvider>
                </StyledEngineProvider>
            </Router>
        </StrictMode>
    );
};

const rootEl = document.getElementById('root');
if (rootEl) {
    createRoot(rootEl).render(<App />);
}

export default App;
