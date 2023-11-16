import React, { StrictMode, Suspense, FC } from 'react';
// eslint-disable-next-line import/no-unresolved
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import axios from 'axios';

import routes from './routes';
import { theme } from './theme';
import { dataReducers } from './store/reducers';
import { dataStateInitialValue } from './store/states';
import { DataActionDispatcherContext, DataStateContext } from './store/contexts';

import Loading from './components/Loading';
import './styles/main.scss';

import farmsURL from './files/farms.json';
import fieldsURL from './files/fields.json';

const App: FC = () => {
    const [dataState, dataActionDispatcher] = React.useReducer(dataReducers, dataStateInitialValue);
    const [initialized, setInitialized] = React.useState(false);

    React.useEffect(() => {
        Promise.all([
            axios.get(fieldsURL).then((res) => {
                dataActionDispatcher({ type: 'loadFields', fields: res.data.fieldsSummary });
            }),
            axios.get(farmsURL).then((res) => {
                dataActionDispatcher({ type: 'loadFarms', farms: res.data.farms });
            })
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
