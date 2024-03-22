import React, { StrictMode, Suspense, FC } from 'react';
// eslint-disable-next-line import/no-unresolved
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import routes from './routes';
import { getData } from './store/api';
import { theme } from './theme';
import { dataReducers } from './store/reducers';
import { dataStateInitialValue } from './store/states';
import { DataActionDispatcherContext, DataStateContext } from './store/contexts';

import Loading from './components/Loading';
import './styles/main.scss';

window.API_PATH = `${window.API_SERVER}/api`;
window.API_FONTS = `${window.API_SERVER}/fonts`;

const App: FC = () => {
    const [dataState, dataActionDispatcher] = React.useReducer(dataReducers, dataStateInitialValue);
    const [initialized, setInitialized] = React.useState(false);
    console.log(window.API_PATH)
    React.useEffect(() => {
        Promise.all([
            getData<ResearchDetail[]>(
                'research/research_details',
                (researches) => {
                    dataActionDispatcher({ type: 'loadResearches', researches });
                },
                () => undefined
            ),
            getData<ResearchDetail[]>(
                'fields/all',
                (fields) => {
                    dataActionDispatcher({ type: 'loadFields', fields });
                },
                () => undefined
            )
        ]).then(() => {
            setInitialized(true);
        });
    }, []);

    if (!initialized) return null;

    return (
        <StrictMode>
            <Router>
                <CssBaseline />
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <Suspense fallback={<Loading />}>
                            <DataActionDispatcherContext.Provider value={dataActionDispatcher}>
                                <DataStateContext.Provider value={dataState}>
                                    <Routes>
                                        {Object.entries(routes).map(([path, props]) => (
                                            <Route key={path} path={path} {...props} />
                                        ))}
                                    </Routes>
                                </DataStateContext.Provider>
                            </DataActionDispatcherContext.Provider>
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
