import React from 'react';
import { HashLink } from 'react-router-hash-link';

import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import Header from '../childComponents/navigation/Header';
import Footer from '../childComponents/navigation/Footer';
import Map from '../childComponents/map';
import { mapStyle } from '../childComponents/map/styles';
import { basemapsArray } from '../childComponents/map/utils';

import maizeTopImg from './maize_top.png';
import coverCroppingImg from './cover_cropping.png';
import cropRotationImg from './crop_rotation.png';
import droughtResistantImg from './drought_resistant.png';
import irrigationStratImg from './irrigation_strategy.png';
import avatar from './avatar.png';
import collaboratorsImg from './affiliations.png';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'transparent',
    padding: theme.spacing(1),
    marginLeft: theme.spacing(5),
    textAlign: 'left',
    color: theme.palette.default.contrastText
}));

const Home = (): JSX.Element => {
    const resAreas = [
        {
            name: 'Nitrogen Conservation',
            resId: 'nitrogencons',
            research: [
                {
                    title: 'Cover Cropping',
                    description:
                        "Researchers at the University of Illinois in collaboration with researchers at Purdue University have developed a web-based Cover Crop Tool that simulates cereal rye growth and provides growers visualized outputs that include total biomass, carbon-to-nitrogen ratio, nitrogen taken up by the cover crop and reductions in nitrogen lost. Ground truth measurements combined with estimates from satellite images will be used to validate the model's accuracy and functioning to improve the information provided to the producer for managing a cereal rye cover crop.",
                    researchLink: '#',
                    dataToolLink: '#',
                    image: coverCroppingImg,
                    imgAlt: 'Cover Cropping Image'
                },
                {
                    title: 'Crop Rotation',
                    description:
                        'High crop yields and low nutrient losses are not mutually exclusive. Read our five-year economic evaluation research to see how we arrived at this conclusion.',
                    researchLink: '#',
                    dataToolLink: '#',
                    image: cropRotationImg,
                    imgAlt: 'Crop Rotation Image'
                }
            ]
        },
        {
            name: 'Water Resource Management',
            resId: 'waterres',
            research: [
                {
                    title: 'Drought-Resistant Seed Performance',
                    description:
                        'As changing climate brings more uncertainty with regard to weather patterns, knowing how drought-resistant seed performs in your area is becoming more important. Researchers are growing and testing these lines scientifically to provide you with information you can trust. Location, weather, soil type and soil moisture are collected to produce a clear, unbiased picture of how these seeds perform in various conditions.',
                    researchLink: '#',
                    dataToolLink: '#',
                    image: droughtResistantImg,
                    imgAlt: 'Drought Resistant Image'
                },
                {
                    title: 'Irrigation Strategies',
                    description: 'Coming soon: here will be explanations.',
                    researchLink: '#',
                    dataToolLink: '#',
                    image: irrigationStratImg,
                    imgAlt: 'Irrigation Strategies Image'
                }
            ]
        }
    ];

    const resInfo = [
        {
            title: 'Project Dashboard (Coming Soon)',
            text: 'Tell us your feedback, ask questions to our Extension workers, and exchange practical tricks with other expertise in your community.',
            listHeader: 'Our expertise:',
            listItems: [
                'The value of marketed WUE hybrid lines',
                'Cover crops and soil nitrogen availability in maize and soybean systems',
                'How to use the decision support tools',
                'Other research findings and technologies'
            ],
            buttonText: 'ASK A QUESTION (COMING SOON)'
        },
        {
            title: 'Webinars',
            text: 'Register and learn some new technologies and how to apply that on your farm.',
            listHeader: '',
            listItems: [
                'Cover crops and soil nitrogen availability in maize and soybean systems',
                'Precision and digital  agriculture training'
            ],
            buttonText: 'Register a webinar (Coming Soon)'
        }
    ];

    const collaborators = [
        {
            name: 'Studer, Anthony Joseph',
            title: 'Digital Agriculture',
            image: avatar
        },
        {
            name: 'Bowman, Dennis',
            title: 'Commercial Agriculture Educator',
            image: avatar
        },
        {
            name: 'Desmond Mortley',
            title: 'Plant and Soil Science',
            image: avatar
        },
        {
            name: 'Gentry, Lowell E',
            title: 'Natural Resources and Environmental Sciences',
            image: avatar
        },
        {
            name: 'Yu, Zhongjie',
            title: 'Biogeochemical',
            image: avatar
        },
        {
            name: 'Mitchell, Corey A',
            title: 'Water quality, Biochemistry',
            image: avatar
        },
        {
            name: 'Joseph Quansah',
            title: 'Water',
            image: avatar
        },
        {
            name: 'Bhattarai, Rabin',
            title: 'Water',
            image: avatar
        },
        {
            name: 'Coppess, Jonathan W',
            title: 'Policy',
            image: avatar
        }
    ];

    const onMapLoad = (_map: maplibregl.Map) => {
        /* eslint-disable-next-line no-console */
        console.log('Map rendered');
    };

    return (
        <>
            <Header />
            {/* Landing image section */}
            <Box>
                <Container maxWidth="xl" disableGutters>
                    <Grid
                        container
                        sx={(theme) => ({
                            height: '70vh',
                            color: theme.palette.default.contrastText,
                            alignContent: 'center',
                            textAlign: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundImage: `linear-gradient(90deg, #FF5F05 0%, rgba(255, 95, 5, 0) 100%), url(${maizeTopImg})`
                        })}
                    >
                        <Grid item xs={12} md={6}>
                            <Item elevation={0}>
                                <Typography
                                    variant="h3"
                                    sx={(_theme) => ({
                                        fontWeight: { xs: 400, md: 600 },
                                        fontSize: { xs: 32, md: 48 },
                                        font: 'Poppins'
                                    })}
                                >
                                    Science To Help You Farm Better
                                </Typography>
                            </Item>
                            <Item elevation={0}>
                                <Typography
                                    variant="h4"
                                    sx={(_theme) => ({
                                        fontWeight: { xs: 200, md: 400 },
                                        fontSize: { xs: 16, md: 24 },
                                        font: 'Open Sans'
                                    })}
                                >
                                    We provide unbiased data to help you learn from the latest research findings and
                                    make data driven decisions on your own farm.
                                </Typography>
                            </Item>
                            <Item elevation={0}>
                                <Button
                                    variant="contained"
                                    sx={(theme) => ({
                                        backgroundColor: theme.palette.primary.main,
                                        marginTop: theme.spacing(5),
                                        padding: theme.spacing(2)
                                    })}
                                >
                                    <HashLink smooth to="#about" style={{ textDecoration: 'none' }}>
                                        <Typography
                                            textAlign="center"
                                            sx={(theme) => ({
                                                color: theme.palette.default.contrastText,
                                                fontWeight: { xs: 600, md: 800 },
                                                fontSize: { xs: 14, md: 16 },
                                                font: 'Roboto',
                                                textDecoration: 'none'
                                            })}
                                        >
                                            ABOUT
                                        </Typography>
                                    </HashLink>
                                </Button>
                            </Item>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ alignContent: 'left' }} />
                    </Grid>
                </Container>
            </Box>

            {/* About section */}
            <Box sx={{ mt: '200px' }}>
                <Container maxWidth="xl" disableGutters>
                    <Grid container sx={{ alignContent: 'center', textAlign: 'center' }}>
                        <Grid item xs={12} md={6}>
                            <Item elevation={0} sx={(theme) => ({ color: theme.palette.text.primary, p: 2 })}>
                                <Typography
                                    variant="h3"
                                    sx={(_theme) => ({
                                        fontWeight: { xs: 400, md: 600 },
                                        fontSize: { xs: 32, md: 48 },
                                        font: 'Poppins'
                                    })}
                                >
                                    Discover Research Sites
                                </Typography>
                            </Item>
                            <Item elevation={0} sx={(theme) => ({ color: theme.palette.text.secondary, p: 2 })}>
                                <Typography
                                    variant="h4"
                                    sx={(_theme) => ({
                                        fontWeight: { xs: 200, md: 400 },
                                        fontSize: { xs: 16, md: 24 },
                                        font: 'Open Sans'
                                    })}
                                >
                                    Welcome to our network of researchers, extension educators, and producers.
                                    <br />
                                    <br />
                                    Our goal is to foster information exchange within the network. Here, you can access
                                    the latest research findings, and in return, share valuable feedback to help
                                    researchers find out practical research topics.
                                </Typography>
                            </Item>
                            <Item elevation={0} sx={{ p: 2 }}>
                                <Button
                                    variant="contained"
                                    sx={(theme) => ({
                                        color: theme.palette.default.contrastText,
                                        backgroundColor: theme.palette.primary.main,
                                        fontWeight: { xs: 600, md: 800 },
                                        fontSize: { xs: 14, md: 16 },
                                        font: 'Roboto',
                                        marginTop: theme.spacing(5),
                                        padding: theme.spacing(2)
                                    })}
                                >
                                    EXPLORE FIELDS
                                </Button>
                            </Item>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Container sx={{ height: '480px', width: '100%' }}>
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
            </Box>

            {/* Explore by Research Areas section */}
            <Box sx={{ mt: '200px' }}>
                <Container maxWidth="xl">
                    <Grid container sx={{ alignContent: 'center', textAlign: 'center' }}>
                        <Grid item xs={12} md={12}>
                            <Typography
                                id="explore"
                                variant="h3"
                                sx={(theme) => ({
                                    marginBottom: theme.spacing(5),
                                    color: theme.palette.text.primary,
                                    fontWeight: { xs: 400, md: 600 },
                                    fontSize: { xs: 32, md: 48 },
                                    font: 'Poppins'
                                })}
                            >
                                Explore by Research areas
                            </Typography>
                        </Grid>
                    </Grid>
                    {resAreas.map((area) => {
                        return (
                            <Box
                                key={area.name}
                                sx={(theme) => ({
                                    marginBottom: theme.spacing(5)
                                })}
                            >
                                <Typography
                                    id={area.resId}
                                    variant="h5"
                                    sx={(theme) => ({
                                        marginBottom: theme.spacing(2),
                                        color: theme.palette.text.primary,
                                        fontWeight: { xs: 600, md: 700 },
                                        fontSize: { xs: 26, md: 32 },
                                        font: 'Poppins'
                                    })}
                                >
                                    {area.name}
                                </Typography>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, md: 5 }}>
                                    {area.research.map((research) => {
                                        return (
                                            <Card
                                                key={research.title}
                                                sx={{
                                                    display: 'flex',
                                                    height: { xs: '500px', md: '600px' },
                                                    width: { xs: '100%', md: '50%' },
                                                    background:
                                                        'linear-gradient(292.79deg, rgba(232, 245, 250, 0.75) 0%, rgba(243, 248, 253, 0.37) 100%)'
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    sx={{ width: '30%' }}
                                                    image={research.image}
                                                    alt={research.imgAlt}
                                                />
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        padding: '10px',
                                                        overflow: 'auto'
                                                    }}
                                                >
                                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                                        <Typography
                                                            component="h6"
                                                            sx={(theme) => ({
                                                                marginBottom: theme.spacing(3),
                                                                color: theme.palette.text.primary,
                                                                fontWeight: { xs: 600, md: 700 },
                                                                fontSize: { xs: 16, md: 20 },
                                                                font: 'Poppins'
                                                            })}
                                                        >
                                                            {research.title}
                                                        </Typography>
                                                        <Typography
                                                            variant="body1"
                                                            color="text.secondary"
                                                            sx={(theme) => ({
                                                                color: theme.palette.text.secondary,
                                                                fontWeight: { xs: 300, md: 400 },
                                                                fontSize: { xs: 14, md: 16 },
                                                                font: 'Roboto'
                                                            })}
                                                        >
                                                            {research.description}
                                                        </Typography>
                                                    </CardContent>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            pl: 1,
                                                            pb: 1
                                                        }}
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            sx={(theme) => ({
                                                                color: theme.palette.default.contrastText,
                                                                backgroundColor: theme.palette.primary.main,
                                                                fontWeight: { xs: 600, md: 800 },
                                                                fontSize: { xs: 14, md: 16 },
                                                                font: 'Roboto',
                                                                marginTop: theme.spacing(5),
                                                                padding: theme.spacing(2)
                                                            })}
                                                        >
                                                            Explore Fields
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            sx={(theme) => ({
                                                                'color': theme.palette.text.primary,
                                                                'backgroundColor': theme.palette.primary.light,
                                                                'fontWeight': { xs: 600, md: 800 },
                                                                'fontSize': { xs: 14, md: 16 },
                                                                'font': 'Roboto',
                                                                'marginTop': theme.spacing(2),
                                                                'marginBottom': theme.spacing(5),
                                                                '&:hover': {
                                                                    color: theme.palette.default.contrastText,
                                                                    backgroundColor:
                                                                        theme.palette.default.btnLightBackground
                                                                },
                                                                'padding': theme.spacing(2)
                                                            })}
                                                        >
                                                            Learn more
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Card>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        );
                    })}
                </Container>
            </Box>

            {/* Contact and reach section */}
            <Box sx={{ mt: '200px' }}>
                <Container maxWidth="xl">
                    <Grid container sx={{ alignContent: 'center', textAlign: 'center' }}>
                        <Grid item xs={12} md={12}>
                            <Typography
                                id="explore"
                                variant="h3"
                                sx={(theme) => ({
                                    marginBottom: theme.spacing(5),
                                    color: theme.palette.text.primary,
                                    fontWeight: { xs: 400, md: 600 },
                                    fontSize: { xs: 32, md: 48 },
                                    font: 'Poppins'
                                })}
                            >
                                Get access to the most up-to-date
                                <br />
                                information about the research
                            </Typography>
                        </Grid>
                    </Grid>
                    <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
                        {resInfo.map((info) => {
                            return (
                                <Card
                                    key={info.title}
                                    sx={{
                                        // display: 'flex',
                                        height: { xs: '450px', md: '500px' },
                                        width: { xs: '100%', md: '50%' },
                                        background:
                                            'linear-gradient(292.79deg, rgba(232, 245, 250, 0.75) 0%, rgba(243, 248, 253, 0.37) 100%)'
                                    }}
                                >
                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                        <Typography
                                            component="h6"
                                            sx={(theme) => ({
                                                marginBottom: theme.spacing(3),
                                                color: theme.palette.text.primary,
                                                fontWeight: { xs: 600, md: 700 },
                                                fontSize: { xs: 16, md: 20 },
                                                font: 'Poppins'
                                            })}
                                        >
                                            {info.title}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                            sx={(theme) => ({
                                                color: theme.palette.text.secondary,
                                                fontWeight: { xs: 300, md: 400 },
                                                fontSize: { xs: 14, md: 16 },
                                                font: 'Roboto'
                                            })}
                                        >
                                            {info.text}
                                            <br />
                                            <br />
                                        </Typography>
                                        <Box>
                                            {info.listHeader ? (
                                                <Typography
                                                    variant="body1"
                                                    color="text.secondary"
                                                    sx={(theme) => ({
                                                        color: theme.palette.text.secondary,
                                                        fontWeight: { xs: 300, md: 400 },
                                                        fontSize: { xs: 14, md: 16 },
                                                        font: 'Roboto'
                                                    })}
                                                >
                                                    {info.listHeader}
                                                    <br />
                                                </Typography>
                                            ) : null}
                                            <List
                                                sx={(theme) => ({
                                                    'listStyleType': 'disc',
                                                    'pl': 2,
                                                    '& .MuiListItem-root': {
                                                        display: 'list-item'
                                                    },
                                                    'color': theme.palette.text.secondary,
                                                    'fontWeight': { xs: 300, md: 400 },
                                                    'fontSize': { xs: 14, md: 16 },
                                                    'font': 'Roboto'
                                                })}
                                            >
                                                {info.listItems.map((item) => {
                                                    return <ListItem key={item}>{item}</ListItem>;
                                                })}
                                            </List>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Button
                                                variant="contained"
                                                sx={(theme) => ({
                                                    color: theme.palette.default.contrastText,
                                                    backgroundColor: theme.palette.primary.main,
                                                    fontWeight: { xs: 600, md: 800 },
                                                    fontSize: { xs: 14, md: 16 },
                                                    font: 'Roboto',
                                                    marginTop: theme.spacing(5),
                                                    marginBottom: theme.spacing(5),
                                                    padding: theme.spacing(2)
                                                })}
                                            >
                                                {info.buttonText}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Stack>
                </Container>
            </Box>

            {/* Participating Organizations section */}
            <Box sx={{ mt: '180px' }}>
                <Container maxWidth="lg">
                    <Grid container sx={{ alignContent: 'center', textAlign: 'center' }}>
                        <Grid item xs={12} md={12}>
                            <Typography
                                id="about"
                                variant="h3"
                                sx={(theme) => ({
                                    marginBottom: theme.spacing(5),
                                    color: theme.palette.text.primary,
                                    fontWeight: { xs: 400, md: 600 },
                                    fontSize: { xs: 32, md: 48 },
                                    font: 'Poppins'
                                })}
                            >
                                Learn who the participating
                                <br />
                                organizations are for the project
                            </Typography>
                        </Grid>
                    </Grid>

                    <Stack spacing={4} direction="row" flexWrap="wrap" justifyContent="center" alignItems="center">
                        {collaborators.map((collaborator) => {
                            return (
                                <Stack
                                    key={collaborator.name}
                                    spacing={2}
                                    direction="column"
                                    sx={{ width: 180, height: 380, textAlign: 'center' }}
                                >
                                    <Box>
                                        <img src={collaborator.image} alt={collaborator.name} />
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="subtitle1"
                                            sx={(theme) => ({
                                                // marginBottom: theme.spacing(2),
                                                color: theme.palette.text.secondary,
                                                fontWeight: { xs: 600, md: 800 },
                                                fontSize: { xs: 14, md: 16 },
                                                font: 'Roboto'
                                            })}
                                        >
                                            {collaborator.name}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            sx={(theme) => ({
                                                // marginBottom: theme.spacing(2),
                                                color: theme.palette.text.secondary,
                                                fontWeight: { xs: 300, md: 400 },
                                                fontSize: { xs: 14, md: 16 },
                                                font: 'Roboto'
                                            })}
                                        >
                                            {collaborator.title}
                                        </Typography>
                                    </Box>
                                </Stack>
                            );
                        })}
                    </Stack>
                    <Divider sx={{ my: 3 }}>
                        <Typography
                            variant="h6"
                            sx={(theme) => ({
                                color: theme.palette.text.secondary,
                                fontWeight: { xs: 500, md: 700 },
                                fontSize: { xs: 16, md: 20 },
                                font: 'Poppins'
                            })}
                        >
                            Collaborators
                        </Typography>
                    </Divider>
                    <Box sx={{ textAlign: 'center', height: 104 }}>
                        <img style={{ width: '100%' }} src={collaboratorsImg} alt="Affiliations" />
                    </Box>
                </Container>
            </Box>

            {/* How to get involved section */}
            <Box sx={{ my: '150px' }}>
                <Container maxWidth="xl">
                    <Grid container sx={{ alignContent: 'center', textAlign: 'center' }}>
                        <Grid item xs={12} md={12}>
                            <Typography
                                id="explore"
                                variant="h3"
                                sx={(theme) => ({
                                    marginBottom: theme.spacing(5),
                                    color: theme.palette.text.primary,
                                    fontWeight: { xs: 400, md: 600 },
                                    fontSize: { xs: 32, md: 48 },
                                    font: 'Poppins'
                                })}
                            >
                                Learn how I can get involved in
                                <br />
                                Direct4Ag
                            </Typography>
                        </Grid>
                    </Grid>
                    <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
                        {/* Participate in demonstrative plot */}
                        <Card
                            sx={{
                                height: { xs: '400px', md: '500px' },
                                width: { xs: '100%', md: '50%' },
                                background:
                                    'linear-gradient(292.79deg, rgba(232, 245, 250, 0.75) 0%, rgba(243, 248, 253, 0.37) 100%)'
                            }}
                        >
                            <Box sx={{overflow: 'auto'}}>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography
                                    component="h6"
                                    sx={(theme) => ({
                                        marginBottom: theme.spacing(3),
                                        color: theme.palette.text.primary,
                                        fontWeight: { xs: 600, md: 700 },
                                        fontSize: { xs: 16, md: 20 },
                                        textAlign: 'center',
                                        font: 'Poppins'
                                    })}
                                >
                                    Participate in Demonstrative Plot
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={(theme) => ({
                                        color: theme.palette.text.secondary,
                                        fontWeight: { xs: 300, md: 400 },
                                        fontSize: { xs: 14, md: 16 },
                                        font: 'Roboto'
                                    })}
                                >
                                    You can help others in many ways!
                                    <br />
                                    <br />
                                    Join us and transform your field a demonstration plot in your community. Gain
                                    practical, hands-on guidance in implementing cover crops and share these methods
                                    with your neighbors to improve their soil health!
                                    <br />
                                    <br />
                                    Or, you can become a data contribution partner to help us refine the data model,
                                    benefiting all users of the Cover Crop tool!
                                    <br />
                                    <br />
                                </Typography>
                                <Box>
                                    <Stack
                                        spacing={2}
                                        direction="column"
                                        flexWrap="wrap"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Button
                                            variant="contained"
                                            sx={(theme) => ({
                                                color: theme.palette.default.contrastText,
                                                backgroundColor: theme.palette.primary.main,
                                                fontWeight: { xs: 600, md: 800 },
                                                fontSize: { xs: 14, md: 16 },
                                                width: '100%',
                                                font: 'Roboto',
                                                padding: theme.spacing(2)
                                            })}
                                        >
                                            GET INVOLVED
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={(theme) => ({
                                                'color': theme.palette.text.primary,
                                                'backgroundColor': theme.palette.primary.light,
                                                'fontWeight': { xs: 600, md: 800 },
                                                'fontSize': { xs: 14, md: 16 },
                                                'width': '100%',
                                                'font': 'Roboto',
                                                '&:hover': {
                                                    color: theme.palette.default.contrastText,
                                                    backgroundColor: theme.palette.default.btnLightBackground
                                                },
                                                'padding': theme.spacing(2)
                                            })}
                                        >
                                            Explore community partners
                                        </Button>
                                    </Stack>
                                </Box>
                            </CardContent>
                            </Box>
                        </Card>

                        {/* Contact Us */}
                        <Card
                            sx={{
                                height: { xs: '400px', md: '500px' },
                                width: { xs: '100%', md: '50%' },
                                background:
                                    'linear-gradient(292.79deg, rgba(232, 245, 250, 0.75) 0%, rgba(243, 248, 253, 0.37) 100%)'
                            }}
                        >
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography
                                    component="h6"
                                    sx={(theme) => ({
                                        marginBottom: theme.spacing(3),
                                        color: theme.palette.text.primary,
                                        fontWeight: { xs: 600, md: 700 },
                                        fontSize: { xs: 16, md: 20 },
                                        textAlign: 'center',
                                        font: 'Poppins'
                                    })}
                                >
                                    Contact Us
                                </Typography>
                                <List
                                    sx={(theme) => ({
                                        'listStyleType': 'decimal',
                                        'pl': 2,
                                        '& .MuiListItem-root': {
                                            display: 'list-item'
                                        },
                                        'color': theme.palette.text.secondary,
                                        'fontWeight': { xs: 300, md: 400 },
                                        'fontSize': { xs: 14, md: 16 },
                                        'font': 'Roboto'
                                    })}
                                >
                                    <ListItem>Introduce: what we expect you to communicate</ListItem>
                                    <ListItem>Media: Contact information</ListItem>
                                </List>
                                <Box>
                                    <Button
                                        variant="contained"
                                        sx={(theme) => ({
                                            color: theme.palette.default.contrastText,
                                            backgroundColor: theme.palette.primary.main,
                                            fontWeight: { xs: 600, md: 800 },
                                            fontSize: { xs: 14, md: 16 },
                                            width: '100%',
                                            font: 'Roboto',
                                            padding: theme.spacing(2)
                                        })}
                                    >
                                        GET INVOLVED
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Ask Questions */}
                        <Card
                            sx={{
                                height: { xs: '400px', md: '500px' },
                                width: { xs: '100%', md: '50%' },
                                background:
                                    'linear-gradient(292.79deg, rgba(232, 245, 250, 0.75) 0%, rgba(243, 248, 253, 0.37) 100%)'
                            }}
                        >
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography
                                    component="h6"
                                    sx={(theme) => ({
                                        marginBottom: theme.spacing(3),
                                        color: theme.palette.text.primary,
                                        fontWeight: { xs: 600, md: 700 },
                                        fontSize: { xs: 16, md: 20 },
                                        textAlign: 'center',
                                        font: 'Poppins'
                                    })}
                                >
                                    Ask questions of the researchers
                                </Typography>
                                <List
                                    sx={(theme) => ({
                                        'listStyleType': 'decimal',
                                        'pl': 2,
                                        '& .MuiListItem-root': {
                                            display: 'list-item'
                                        },
                                        'color': theme.palette.text.secondary,
                                        'fontWeight': { xs: 300, md: 400 },
                                        'fontSize': { xs: 14, md: 16 },
                                        'font': 'Roboto'
                                    })}
                                >
                                    <ListItem>Question and Answer blog: future</ListItem>
                                </List>
                                <Box>
                                    <Button
                                        variant="contained"
                                        sx={(theme) => ({
                                            color: theme.palette.default.contrastText,
                                            backgroundColor: theme.palette.primary.main,
                                            fontWeight: { xs: 600, md: 800 },
                                            fontSize: { xs: 14, md: 16 },
                                            width: '100%',
                                            font: 'Roboto',
                                            padding: theme.spacing(2)
                                        })}
                                    >
                                        Ask a Question (coming soon)
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Stack>
                </Container>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Footer />
            </Box>
        </>
    );
};

export default Home;
