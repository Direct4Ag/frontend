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

import Header from '../childComponents/navigation/Header';
import Footer from '../childComponents/navigation/Footer';
import Map from '../childComponents/map';
import { mapStyle } from '../childComponents/map/styles';
import { basemapsArray } from '../childComponents/map/utils';

const useStyles = makeStyles((theme: Theme) => ({
    welcomeParent: {
        height: '100vh',
        background: 'linear-gradient(to bottom, #f5f5f5 50%, #d8d8d8 50%);' /* set the vertical gradient background */
        // position: 'relative' /* set position to relative for the child divs */
    }
}));

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#f5f5f5',
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

    const onMapLoad = (map: maplibregl.Map) => {
        console.log('Map rendered');
        map.addSource('reflayer', {
            type: 'raster',
            tiles: ['https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256
        });

        map.addLayer({
            id: 'reflayer',
            source: 'reflayer',
            type: 'raster'
        } as maplibregl.RasterLayerSpecification);
    };

    return (
        <>
            <Header />
            <Box className={classes.welcomeParent} sx={{ flexGrow: 1 }}>
                <Container>
                    <Grid container spacing={2} sx={{ height: '50vh', alignContent: 'center', textAlign: 'center' }}>
                        <Grid item xs={7}>
                            <Item elevation={0}>
                                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                                    Discover exciting possibilities of better farming decision making with Direct4Ag
                                </Typography>
                            </Item>
                        </Grid>
                        <Grid item xs={6}></Grid>
                        <Grid item xs={7}>
                            <Item elevation={0}>
                                <Typography variant="body1" sx={{ fontWeight: 400 }}>
                                    Make use of the state of art research outcome to surge your farming.
                                </Typography>
                            </Item>
                        </Grid>
                    </Grid>
                </Container>
                <Stack
                    direction="row"
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
            <Container sx={{ height: '100vh' }}>
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
                    LayersControlProps={[
                        {
                            id: 'reflayer',
                            label: 'Topological Layer',
                            initialOpacity: 0.2,
                            style: {
                                type: 'fill',
                                paint: {
                                    'fill-color': '#794c5a',
                                    'fill-opacity': 0.2
                                }
                            },
                            opacityType: 'fill'
                        }
                    ]}
                    onLoad={onMapLoad}
                />
            </Container>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Footer />
            </Box>
        </>
    );
};

export default Home;
