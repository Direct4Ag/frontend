import React from 'react';

import { Box } from '@mui/system';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Container } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Header from '../childComponents/navigation/Header';
import Footer from '../childComponents/navigation/Footer';
import Map from '../childComponents/map';
import { mapStyle } from '../childComponents/map/styles';
import { basemapsArray } from '../childComponents/map/utils';

const useStyles = makeStyles((theme: Theme) => ({
    welcomeParent: {
        height: '100vh',
        background: 'linear-gradient(to bottom, #f2f2f2 70%, #ffffff 30%);' /* set the vertical gradient background */
        // position: 'relative' /* set position to relative for the child divs */
    }
}));

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#f2f2f2',
    padding: theme.spacing(1),
    textAlign: 'left',
    color: 'black'
}));

const ToolBox = styled(Paper)(({ theme }) => ({
    backgroundColor: '#94eaac',
    padding: theme.spacing(1),
    height: '144px',
    width: '263px',
    margin: '5px',
    textAlign: 'left',
    color: 'black'
}));

const Home = (): JSX.Element => {
    const classes = useStyles();

    const features = [
        {
            name: 'Cover Crop',
            text: 'Cover your land at the right time.'
        },
        {
            name: 'Moisture',
            text: 'Actions will be taken because of this data.'
        },
        {
            name: 'Nutrition',
            text: 'Provide soil nutrients insights.'
        },
        {
            name: 'More',
            text: 'More tools to come.'
        }
    ];

    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const onMapLoad = (map: maplibregl.Map) => {
        console.log('Map rendered');
    };

    return (
        <>
            <Header />
            <Box className={classes.welcomeParent} sx={{ flexGrow: 1 }}>
                <Container maxWidth="lg">
                    <Grid container sx={{ height: '70vh', alignContent: 'center', textAlign: 'center' }}>
                        <Grid item xs={12} md={7}>
                            <Item elevation={0}>
                                <Typography variant="h4" sx={{ fontWeight: 900, fontSize: '3em' }}>
                                    Discover exciting possibilities of better farming decision making with Direct4Ag
                                </Typography>
                            </Item>
                            <Item elevation={0}>
                                <Typography variant="body1" sx={{ fontWeight: 400, fontSize: '1.2em' }}>
                                    Make use of the state of art research outcome to surge your farming.
                                </Typography>
                            </Item>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Container sx={{ height: '100%', width: '100%' }}>
                                <Map
                                    mapOptions={{
                                        style: mapStyle,
                                        minZoom: 1
                                    }}
                                    // initialBounds={[-180, -90, 180, 90]}
                                    center={[-89, 40]}
                                    attribution
                                    help
                                    navigation
                                    basemaps={{
                                        basemaps: [basemapsArray.OSM, basemapsArray.Carto, basemapsArray.World_Imagery],
                                        initialBasemap: 'OSM',
                                        expandDirection: 'top'
                                    }}
                                    onLoad={onMapLoad}
                                />
                            </Container>
                        </Grid>
                    </Grid>
                </Container>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={5}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ position: 'relative', top: '-72px' }}
                >
                    {features.map((feature) => {
                        return <ToolBox key={feature.name}>{feature.text}</ToolBox>;
                    })}
                </Stack>
            </Box>

            <Box>
                <Container>
                    <Typography variant="h5" sx={{ fontWeight: 900, fontSize: '3em' }}>
                        How does they benefit your farming?
                    </Typography>
                    <TabContext value={value}>
                        <Box
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                textColor: 'black',
                                indicatorColor: 'black'
                            }}
                        >
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Cover Crop Data" value="1" />
                                <Tab label="Moisture" value="2" />
                                <Tab label="Nutrition" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">Item One</TabPanel>
                        <TabPanel value="2">Item Two</TabPanel>
                        <TabPanel value="3">Item Three</TabPanel>
                    </TabContext>
                </Container>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Footer />
            </Box>
        </>
    );
};

export default Home;
