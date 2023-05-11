import React from 'react';

import AgricultureIcon from '@mui/icons-material/Agriculture';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Footer = (): JSX.Element => {
    return (
        <>
            <Box
                sx={(theme) => ({
                    width: '100%',
                    p: 8,
                    mt: 'auto',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: theme.palette.default.dark
                })}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <AgricultureIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'black' }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 400,
                            letterSpacing: '.1rem',
                            color: 'black',
                            textDecoration: 'none'
                        }}
                    >
                        Direct4Ag
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                    <Typography variant="body1">Contact</Typography>
                    <Typography variant="body1">Copyright Statement</Typography>
                    <Typography variant="body1">API</Typography>
                    <Typography variant="body1">Bug Feedback</Typography>
                </Box>
            </Box>
        </>
    );
};

export default Footer;
