import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { makeStyles } from '@mui/styles';

import { DataStateContext } from '@app/store/contexts';

import { theme } from '../../../theme';

const drawerWidth = 472;

const useStyles = makeStyles({
    backToMapText: {
        font: 'Roboto',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20.02px',
        color: theme.palette.text.primary
    },
    subText: {
        font: 'Roboto',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '19.92px',
        letterSpacing: '0.4px',
        color: theme.palette.text.secondary
    },
    farmNameText: {
        font: 'Poppins',
        fontSize: '20px',
        fontWeight: 700,
        lineHeight: '32px',
        letterSpacing: '0.15px',
        color: theme.palette.text.primary
    },
    aboutResearchHeader: {
        font: 'Roboto',
        fontWeight: 700,
        fontSize: '16px',
        lineHeight: '28px',
        letterSpacing: '0.15px',
        color: theme.palette.text.primary
    },
    aboutResearchTextTitle: {
        font: 'Roboto',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '21.98px',
        letterSpacing: '0.1px',
        color: theme.palette.text.primary
    },
    aboutResearchText: {
        font: 'Roboto',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '21.98px',
        letterSpacing: '0.17px',
        color: theme.palette.text.secondary
    }
});

const howToSection = [
    {
        title: 'How to read precipitation',
        content: 'Some explanation'
    },
    {
        title: 'How to read soil moisture',
        content: 'Some explanation'
    },
    {
        title: 'How we implemented sensors',
        content: 'Some explanation'
    }
];

const LeftSidebar: FC = (): JSX.Element => {
    const classes = useStyles();
    const navigate = useNavigate();
    const { selectedResearch } = React.useContext(DataStateContext);
    const selectedFieldDetail = selectedResearch !== null ? selectedResearch.field : null;

    React.useEffect(() => {
        if (!selectedFieldDetail) {
            navigate('/explore');
        }
    }, [selectedFieldDetail]);

    return (
        <>
            <CssBaseline />
            <Stack direction="row">
                <Box
                    sx={{
                        width: drawerWidth,
                        p: '24px',
                        pointerEvents: 'auto',
                        scrollBehavior: 'smooth',
                        // 'overflow': 'scroll',

                        background:
                            'linear-gradient(292.79deg, rgba(232, 245, 250, 0.75) 0%, rgba(243, 248, 253, 0.37) 100%)'
                    }}
                >
                    <Stack sx={{ marginBottom: 6 }} spacing={2}>
                        <Box>
                            <Button href="/explore" variant="text" startIcon={<ChevronLeftIcon />}>
                                <Typography className={classes.backToMapText} variant="body2">
                                    Back to Map
                                </Typography>
                            </Button>
                        </Box>
                        <Box>
                            <Typography variant="caption" className={classes.subText}>
                                {selectedFieldDetail?.farm.location_name}
                            </Typography>
                            <Typography variant="h6" className={classes.farmNameText}>
                                {selectedFieldDetail?.farm.farm_name}
                            </Typography>
                            <Typography variant="caption" className={classes.subText}>
                                {selectedFieldDetail?.field_name}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack sx={{ marginBottom: 3 }} spacing={2}>
                        <Box>
                            <Typography variant="subtitle1" className={classes.aboutResearchHeader}>
                                About the Research
                            </Typography>
                            <Stack direction="row" spacing={2} justifyContent="flex-start">
                                <Typography variant="subtitle2" className={classes.aboutResearchTextTitle}>
                                    Data Type
                                </Typography>
                                <Typography variant="body2" className={classes.aboutResearchText}>
                                    Drought-resistant Seed Performance
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={2} justifyContent="flex-start">
                                <Typography variant="subtitle2" className={classes.aboutResearchTextTitle}>
                                    PI
                                </Typography>
                                <Typography variant="body2" className={classes.aboutResearchText}>
                                    -
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={2} justifyContent="flex-start">
                                <Typography variant="subtitle2" className={classes.aboutResearchTextTitle}>
                                    Contact Info
                                </Typography>
                                <Typography variant="body2" className={classes.aboutResearchText}>
                                    -
                                </Typography>
                            </Stack>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" className={classes.aboutResearchTextTitle}>
                                Introduction:
                            </Typography>
                            <Typography variant="body2" className={classes.aboutResearchText}>
                                As changing climate brings more uncertainty with regard to weather patterns, knowing how
                                drought-resistant seed performs in your area is becoming more important. Researchers are
                                growing and testing these lines scientifically to provide you with information you can
                                trust. Location, weather, soil type and soil moisture are collected to produce a clear,
                                unbiased picture of how these seeds perform in various conditions.
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" className={classes.aboutResearchTextTitle}>
                                Take-aways / Conclusions:
                            </Typography>
                            <Typography variant="body2" className={classes.aboutResearchText}>
                                Seed 1 is more drought tolerant than seed 2
                            </Typography>
                        </Box>
                    </Stack>
                    <Box sx={{ marginBottom: 8 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            disableElevation
                            sx={{
                                'color': theme.palette.text.primary,
                                'backgroundColor': theme.palette.primary.light,
                                'fontWeight': { xs: 600, md: 800 },
                                'fontSize': { xs: 14, md: 16 },
                                'font': 'Roboto',
                                '&:hover': {
                                    color: theme.palette.default.btnHoverText,
                                    backgroundColor: theme.palette.default.btnLightBackground
                                },
                                'padding': theme.spacing(2)
                            }}
                        >
                            MORE ABOUT THE RESEARCH
                        </Button>
                    </Box>
                    <Stack spacing={2}>
                        {howToSection.map((section) => {
                            return (
                                <Box key={section.title}>
                                    <Typography variant="subtitle1" className={classes.aboutResearchHeader}>
                                        {section.title}
                                    </Typography>
                                    <Typography variant="body2" className={classes.aboutResearchText}>
                                        {section.content}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Stack>
                </Box>
            </Stack>
        </>
    );
};

export default LeftSidebar;
