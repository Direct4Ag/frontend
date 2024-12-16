import React from 'react';
import { Link } from 'react-router-dom';

import { Box } from '@mui/system';

import logo from './D4ALogo.png';

const Footer = (): JSX.Element => {
    return (
        <Box
            sx={(_theme) => ({
                p: 2,
                mt: 'auto',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                background: 'linear-gradient(292.79deg, rgba(232, 245, 250, 0.75) 0%, rgba(243, 248, 253, 0.37) 100%)'
            })}
        >
            <Box>
                <img alt="Direct4Ag Logo" src={logo} style={{ marginRight: '10px' }} />
            </Box>
            <Box sx={{ mx: '10px' }}>
                <a
                    href={`${window.COVERCROP_API}/api/docs`}
                    style={{ textDecoration: 'none', color: 'black' }}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    API
                </a>
            </Box>
            <Box sx={{ mx: '10px' }}>
                <Link to="mailto: dir4agteam@illinois.edu" style={{ textDecoration: 'none', color: 'black' }}>
                    Ask a Question
                </Link>
            </Box>
        </Box>
    );
};

export default Footer;
