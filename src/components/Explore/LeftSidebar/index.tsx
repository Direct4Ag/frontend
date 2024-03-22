import React, { FC, ReactNode, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { DataStateContext, DataActionDispatcherContext } from '../../../store/contexts';
import { globals as gs } from '@app/globals';
import FarmCard from './FarmCard';
import { theme } from '../../../theme';

const drawerWidth = 472;

interface RestructuredResearches {
    [key: string]: {
        [key: string]: {
            [key: string]: {
                farm: FarmSummary;
                fields: {
                    res_id: string;
                    research_name: string;
                    field: FieldsSummary;
                }[];
            };
        };
    };
}

interface FilterCounts {
    [key: string]: number;
}

const Scroll: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <Box
            sx={{
                'scrollBehavior': 'smooth',
                'flex': 'auto',
                'overflow': 'scroll',
                '&::-webkit-scrollbar': {
                    display: 'none' // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge, etc.)
                },
                '&-ms-overflow-style:': {
                    display: 'none' // Hide the scrollbar for IE
                }
            }}
        >
            {children}
        </Box>
    );
};

const ResearchSection: FC<{ children: ReactNode; researchArea: string; researchName: string; count: number }> = ({
    children,
    researchArea,
    researchName,
    count
}) => {
    return (
        <Box>
            <Typography
                variant="caption"
                sx={{
                    font: 'Roboto',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: theme.palette.text.secondary
                }}
            >
                {researchArea}
            </Typography>
            <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
                <Typography
                    sx={{
                        font: 'Roboto',
                        fontWeight: 700,
                        fontSize: '16px',
                        lineHeight: '28px',
                        color: theme.palette.text.primary
                    }}
                    variant="subtitle1"
                >
                    {`${researchName} (${count})`}
                </Typography>
                <IconButton size="small" aria-label="info">
                    <InfoOutlinedIcon />
                </IconButton>
            </Stack>
            <Box sx={{ mt: 2 }}>{children}</Box>
        </Box>
    );
};

const LeftSidebar: FC = (): JSX.Element => {
    const dataActionDispatcher = useContext(DataActionDispatcherContext);
    const { researches, selectedFilter } = useContext(DataStateContext);

    const filters = ['All', gs.CONSTANTS.COVERCROP, gs.CONSTANTS.CROPROT, gs.CONSTANTS.DROUGHT, gs.CONSTANTS.IRRIGATION];

    let coverCropFieldCount = 0;
    let cropRotationFieldCount = 0;
    let droughtResSeedFieldCount = 0;
    let irrigationStratFieldCount = 0;

    const resetructuredResearches: RestructuredResearches = {};

    researches.forEach((research) => {
        const { id, research_name, research_type, research_area, field } = research;
        const { farm } = field;
        const { farm_name } = farm;

        if (research_type === gs.CONSTANTS.COVERCROP) {
            coverCropFieldCount++;
        } else if (research_type === gs.CONSTANTS.CROPROT) {
            cropRotationFieldCount++;
        } else if (research_type === gs.CONSTANTS.DROUGHT) {
            droughtResSeedFieldCount++;
        } else if (research_type === gs.CONSTANTS.IRRIGATION) {
            irrigationStratFieldCount++;
        }

        if (!resetructuredResearches[research_area]) {
            resetructuredResearches[research_area] = {
                [research_type]: {
                    [farm_name]: {
                        farm: farm,
                        fields: [
                            {
                                res_id: id,
                                research_name: research_name,
                                field: {
                                    id: field.id,
                                    field_name: field.field_name,
                                    coordinates: field.coordinates
                                }
                            }
                        ]
                    }
                }
            };
        } else if (!resetructuredResearches[research_area][research_type]) {
            resetructuredResearches[research_area][research_type] = {
                [farm_name]: {
                    farm: farm,
                    fields: [
                        {
                            res_id: id,
                            research_name: research_name,
                            field: {
                                id: field.id,
                                field_name: field.field_name,
                                coordinates: field.coordinates
                            }
                        }
                    ]
                }
            };
        } else if (!resetructuredResearches[research_area][research_type][farm_name]) {
            resetructuredResearches[research_area][research_type][farm_name] = {
                farm: farm,
                fields: [
                    {
                        res_id: id,
                        research_name: research_name,
                        field: {
                            id: field.id,
                            field_name: field.field_name,
                            coordinates: field.coordinates
                        }
                    }
                ]
            };
        } else {
            resetructuredResearches[research_area][research_type][farm_name]['fields'].push({
                res_id: id,
                research_name: research_name,
                field: {
                    id: field.id,
                    field_name: field.field_name,
                    coordinates: field.coordinates
                }
            });
        }
    });

    const filterCounts: FilterCounts = {
        'All': researches.length,
        [gs.CONSTANTS.COVERCROP]: coverCropFieldCount,
        [gs.CONSTANTS.CROPROT]: cropRotationFieldCount,
        [gs.CONSTANTS.DROUGHT]: droughtResSeedFieldCount,
        [gs.CONSTANTS.IRRIGATION]: irrigationStratFieldCount
    };

    return (
        <>
            <CssBaseline />
            <Stack
                direction="row"
                sx={{
                    height: '92vh'
                }}
            >
                <Box
                    sx={{
                        width: drawerWidth,
                        p: '24px',
                        pointerEvents: 'auto'
                    }}
                >
                    <Stack sx={{ height: '100%' }} spacing={6}>
                        <Box>
                            <Button href="/" variant="text" startIcon={<ChevronLeftIcon />}>
                                <Typography
                                    sx={{
                                        font: 'Roboto',
                                        fontWeight: 400,
                                        fontSize: '14px',
                                        lineHeight: '20.02px',
                                        color: theme.palette.text.primary
                                    }}
                                    variant="body2"
                                >
                                    Back to Home
                                </Typography>
                            </Button>
                            <Typography
                                variant="h6"
                                sx={{
                                    font: 'Poppins',
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    color: theme.palette.text.primary,
                                    mb: 3
                                }}
                            >
                                Explore Data
                            </Typography>
                        </Box>
                        <Box>
                            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={2}>
                                {filters.map((filter) => {
                                    return (
                                        <Chip
                                            key={filter}
                                            label={filter}
                                            sx={{
                                                'backgroundColor':
                                                    selectedFilter === filter
                                                        ? theme.palette.default.btnLightBackground
                                                        : theme.palette.primary.light,
                                                'color': theme.palette.default.chipTextColor,
                                                '&&:hover': {
                                                    backgroundColor: theme.palette.default.btnLightBackground
                                                },
                                                '&&:focus': {
                                                    backgroundColor: theme.palette.default.btnLightBackground
                                                }
                                            }}
                                            variant="filled"
                                            onClick={() =>
                                                dataActionDispatcher({
                                                    type: 'updateExploreFilter',
                                                    selectedFilter: filter as ExploreFilter
                                                })
                                            }
                                        />
                                    );
                                })}
                            </Stack>
                            <Typography
                                variant="caption"
                                sx={{
                                    font: 'Roboto',
                                    fontSize: '12px',
                                    fontWeight: 400,
                                    color: theme.palette.text.primary,
                                    mt: '12px'
                                }}
                            >
                                {filterCounts[selectedFilter]} Fields fit your filter
                            </Typography>
                        </Box>
                        <Scroll key="farms">
                            <Stack direction="column" spacing={6}>
                                {researches.length === 0 ? (
                                    <Typography
                                        sx={{
                                            font: 'Roboto',
                                            fontWeight: 400,
                                            fontSize: '14px',
                                            lineHeight: '20.02px',
                                            color: theme.palette.text.primary
                                        }}
                                    >
                                        No farms found for the selected filter
                                    </Typography>
                                ) : null}
                                {coverCropFieldCount > 0 &&
                                (selectedFilter === 'All' || selectedFilter === gs.CONSTANTS.COVERCROP) ? (
                                    <ResearchSection
                                        researchArea={gs.CONSTANTS.NITCON}
                                        researchName={gs.CONSTANTS.COVERCROP}
                                        count={coverCropFieldCount}
                                    >
                                        {Object.keys(
                                            resetructuredResearches[gs.CONSTANTS.NITCON][gs.CONSTANTS.COVERCROP]
                                        ).map((farm_name, idx) => {
                                            return (
                                                <FarmCard
                                                    farm={
                                                        resetructuredResearches[gs.CONSTANTS.NITCON][gs.CONSTANTS.COVERCROP][
                                                            farm_name
                                                        ]
                                                    }
                                                    idx={idx + 1}
                                                    key={farm_name}
                                                />
                                            );
                                        })}
                                    </ResearchSection>
                                ) : null}

                                {cropRotationFieldCount > 0 &&
                                (selectedFilter === 'All' || selectedFilter === gs.CONSTANTS.CROPROT) ? (
                                    <ResearchSection
                                        researchArea={gs.CONSTANTS.NITCON}
                                        researchName={gs.CONSTANTS.CROPROT}
                                        count={cropRotationFieldCount}
                                    >
                                        {Object.keys(
                                            resetructuredResearches[gs.CONSTANTS.NITCON][gs.CONSTANTS.CROPROT]
                                        ).map((farm_name, idx) => {
                                            return (
                                                <FarmCard
                                                    farm={
                                                        resetructuredResearches[gs.CONSTANTS.NITCON][
                                                            gs.CONSTANTS.CROPROT
                                                        ][farm_name]
                                                    }
                                                    idx={idx + 1}
                                                    key={farm_name}
                                                />
                                            );
                                        })}
                                    </ResearchSection>
                                ) : null}

                                {droughtResSeedFieldCount > 0 &&
                                (selectedFilter === 'All' || selectedFilter === gs.CONSTANTS.DROUGHT) ? (
                                    <ResearchSection
                                        researchArea={gs.CONSTANTS.WATMAN}
                                        researchName={gs.CONSTANTS.DROUGHT}
                                        count={droughtResSeedFieldCount}
                                    >
                                        {Object.keys(
                                            resetructuredResearches[gs.CONSTANTS.WATMAN][gs.CONSTANTS.DROUGHT]
                                        ).map((farm_name, idx) => {
                                            return (
                                                <FarmCard
                                                    farm={
                                                        resetructuredResearches[gs.CONSTANTS.WATMAN][
                                                            gs.CONSTANTS.DROUGHT
                                                        ][farm_name]
                                                    }
                                                    idx={idx + 1}
                                                    key={farm_name}
                                                />
                                            );
                                        })}
                                    </ResearchSection>
                                ) : null}

                                {irrigationStratFieldCount > 0 &&
                                (selectedFilter === 'All' || selectedFilter === gs.CONSTANTS.IRRIGATION) ? (
                                    <ResearchSection
                                        researchArea={gs.CONSTANTS.WATMAN}
                                        researchName={gs.CONSTANTS.IRRIGATION}
                                        count={irrigationStratFieldCount}
                                    >
                                        {Object.keys(
                                            resetructuredResearches[gs.CONSTANTS.WATMAN][gs.CONSTANTS.IRRIGATION]
                                        ).map((farm_name, idx) => {
                                            return (
                                                <FarmCard
                                                    farm={
                                                        resetructuredResearches[gs.CONSTANTS.WATMAN][
                                                            gs.CONSTANTS.IRRIGATION
                                                        ][farm_name]
                                                    }
                                                    idx={idx + 1}
                                                    key={farm_name}
                                                />
                                            );
                                        })}
                                    </ResearchSection>
                                ) : null}
                            </Stack>
                        </Scroll>
                    </Stack>
                </Box>
            </Stack>
        </>
    );
};

export default LeftSidebar;
