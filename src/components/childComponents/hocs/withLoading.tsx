import React from 'react';

import { Box, CircularProgress } from '@mui/material';

export default function withLoading<T>(Component: React.FC<T>) {
    return function WithLoadingComponent(props: T & { isLoading: boolean }) {
        const { isLoading } = props;
        if (isLoading) {
            return (
                <Box display="flex" justifyContent="center" justifyItems="center">
                    <CircularProgress />
                </Box>
            );
        }
        return <Component {...props} />;
    };
}
