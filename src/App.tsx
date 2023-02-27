import React, { StrictMode, Suspense } from 'react';
// eslint-disable-next-line import/no-unresolved
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// import { theme } from './theme';
// import routes from './routes';

import Loading from './components/Loading';
import Welcome from './components/Welcome';
import './styles/main.scss';
import logo from './images/logo.png';

const App = (): JSX.Element => {
    return (
        <StrictMode>
            <Router>
                <CssBaseline />
                <StyledEngineProvider injectFirst>
                    <Suspense fallback={<Loading />}>
                        <div className="app">
                            <header className="App-header">
                                <img src={logo} alt="logo" />
                                <Welcome />
                            </header>
                        </div>
                    </Suspense>
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
