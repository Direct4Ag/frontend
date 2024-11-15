import React from 'react';

import { Alert, Box } from '@mui/material';

export default function withErrorHandling<T>(Component: React.FC<T>) {
    return function WithErrorHandlingComponent(props: T & { error: string | null }) {
        const { error } = props;
        if (error !== null) {
            return (
                <Box sx={{ my: '10px' }}>
                    <Alert severity={error.includes('Failed') ? 'error' : 'info'}>{error}</Alert>
                </Box>
            );
        }
        return <Component {...props} />;
    };
}
