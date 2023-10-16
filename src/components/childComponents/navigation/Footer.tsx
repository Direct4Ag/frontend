import React from 'react';

import AgricultureIcon from '@mui/icons-material/Agriculture';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import logo from './D4ALogo.png';

const Footer = (): JSX.Element => {
    return (
        <>
            <Box
                sx={(theme) => ({
                    p: 2,
                    mt: 'auto',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    background: "linear-gradient(292.79deg, rgba(232, 245, 250, 0.75) 0%, rgba(243, 248, 253, 0.37) 100%)"

                })}
            >
                <img alt="Direct4Ag Logo" src={logo} style={{ marginRight: "10px"}} />
                <Typography variant="body1" sx={{mx: "10px"}}>Copyright Statement</Typography>
                <Typography variant="body1" sx={{mx: "10px"}}>API</Typography>
                <Typography variant="body1" sx={{marginLeft: "10px"}}>Ask a Question</Typography>
            </Box>
        </>
    );
};

export default Footer;
