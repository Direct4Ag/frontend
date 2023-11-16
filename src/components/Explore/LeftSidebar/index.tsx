import React, { FC, ReactNode, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { DataStateContext } from '../../../store/contexts';
import FarmCard from './FarmCard';
import { theme } from '../../../theme';

const drawerWidth = 472;

interface RestructuredFarm {
    farm: FarmDetail;
    coverCropFields: FieldDetail[];
    cropRotationFields: FieldDetail[];
    droughtResSeedFields: FieldDetail[];
    irrigationStratFields: FieldDetail[];
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
            <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
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
    const { farms } = useContext(DataStateContext);

    const filters = ['All', 'Cover Crop', 'Crop Rotation', 'Drought-resistant Seed', 'Irrigation Strategies'];
    const [selectedFilter, setSelectedFilter] = useState(filters[0]);

    let coverCropFieldCount = 0;
    let cropRotationFieldCount = 0;
    let droughtResSeedFieldCount = 0;
    let irrigationStratFieldCount = 0;

    const restructuredFarms: RestructuredFarm[] = [];

    farms.forEach((farm) => {
        const coverCropFields = farm.fields.filter(
            (field) => field.researchName.toLowerCase().replace(/\s/g, '') === 'covercrop'
        );
        const cropRotationFields = farm.fields.filter(
            (field) => field.researchName.toLowerCase().replace(/\s/g, '') === 'croprotation'
        );
        const droughtResSeedFields = farm.fields.filter(
            (field) => field.researchName.toLowerCase().replace(/\s/g, '') === 'drought-resistantseed'
        );
        const irrigationStratFields = farm.fields.filter(
            (field) => field.researchName.toLowerCase().replace(/\s/g, '') === 'irrigationstrategies'
        );

        coverCropFieldCount += coverCropFields.length;
        cropRotationFieldCount += cropRotationFields.length;
        droughtResSeedFieldCount += droughtResSeedFields.length;
        irrigationStratFieldCount += irrigationStratFields.length;

        restructuredFarms.push({
            farm: farm,
            coverCropFields: coverCropFields,
            cropRotationFields: cropRotationFields,
            droughtResSeedFields: droughtResSeedFields,
            irrigationStratFields: irrigationStratFields
        });
    });

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
                    <Stack sx={{height: "100%"}} spacing={6}>
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
                            <Stack direction='row' flexWrap='wrap' useFlexGap spacing={2}>
                                {filters.map((filter) => {
                                    return (
                                        <Chip
                                            key={filter}
                                            label={filter}
                                            sx={{
                                              backgroundColor: selectedFilter === filter ? theme.palette.default.btnLightBackground : theme.palette.primary.light,
                                              color: theme.palette.default.chipTextColor,
                                              "&&:hover" : {
                                                backgroundColor: theme.palette.default.btnLightBackground
                                              },
                                              "&&:focus" : {
                                                backgroundColor: theme.palette.default.btnLightBackground
                                              }
                                            }}
                                            variant='filled'
                                            onClick={() => setSelectedFilter(filter)}
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
                                    mt: "12px",
                                }}
                            >
                                3 Sites fit your filter
                            </Typography>
                        </Box>
                        <Scroll key="farms">
                            <Stack direction="column" spacing={6}>
                                {((coverCropFieldCount > 0) && (selectedFilter === 'All' || selectedFilter === 'Cover Crop')) ? (
                                    <ResearchSection
                                        researchArea="Nitrogen Conservation"
                                        researchName="Cover Crop"
                                        count={coverCropFieldCount}
                                    >
                                        {restructuredFarms.map((farm, idx) => {
                                          if (farm.coverCropFields.length === 0) return null;
                                            return (
                                                <FarmCard
                                                    farm={farm.farm}
                                                    fields={farm.coverCropFields}
                                                    idx={idx + 1}
                                                    key={farm.farm.farmName}
                                                />
                                            );
                                        })}
                                    </ResearchSection>
                                ) : null}

                                {((cropRotationFieldCount > 0) && (selectedFilter === 'All' || selectedFilter === 'Crop Rotation')) ? (
                                    <ResearchSection
                                        researchArea="Nitrogen Conservation"
                                        researchName="Crop Rotation"
                                        count={cropRotationFieldCount}
                                    >
                                        {restructuredFarms.map((farm, idx) => {
                                          if (farm.cropRotationFields.length === 0) return null;
                                            return (
                                                <FarmCard
                                                    farm={farm.farm}
                                                    fields={farm.cropRotationFields}
                                                    idx={idx + 1}
                                                    key={farm.farm.farmName}
                                                />
                                            );
                                        })}
                                    </ResearchSection>
                                ) : null}

                                {((droughtResSeedFieldCount > 0) && (selectedFilter === 'All' || selectedFilter === 'Drought-resistant Seed')) ? (
                                    <ResearchSection
                                        researchArea="Water Resource Management"
                                        researchName="Drought-resistant Seed"
                                        count={droughtResSeedFieldCount}
                                    >
                                        {restructuredFarms.map((farm, idx) => {
                                          if (farm.droughtResSeedFields.length === 0) return null;
                                            return (
                                                <FarmCard
                                                    farm={farm.farm}
                                                    fields={farm.droughtResSeedFields}
                                                    idx={idx + 1}
                                                    key={farm.farm.farmName}
                                                />
                                            );
                                        })}
                                    </ResearchSection>
                                ) : null}

                                {((irrigationStratFieldCount > 0) && (selectedFilter === 'All' || selectedFilter === 'Irrigation Strategies')) ? (
                                    <ResearchSection
                                        researchArea="Water Resource Management"
                                        researchName="Irrigation Strategies"
                                        count={irrigationStratFieldCount}
                                    >
                                        {restructuredFarms.map((farm, idx) => {
                                          if (farm.irrigationStratFields.length === 0) return null;
                                            return (
                                                <FarmCard
                                                    farm={farm.farm}
                                                    fields={farm.irrigationStratFields}
                                                    idx={idx + 1}
                                                    key={farm.farm.farmName}
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
