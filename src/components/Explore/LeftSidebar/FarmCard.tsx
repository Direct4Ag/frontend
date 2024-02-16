import React, { FC } from 'react';

import { Box, Button, Card, CardContent, CardMedia, Collapse, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import fieldImage from './field.png';
import { theme } from '../../../theme';
import { DataActionDispatcherContext } from '@app/store/contexts';

type Props = {
    farm: {
        farm: FarmSummary;
        fields: {
            res_id: string;
            research_name: string;
            field: FieldsSummary;
        }[];
    };
    idx: number;
};

const FarmCard: FC<Props> = ({ farm, idx }): JSX.Element => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const fields = farm.fields.map(({ field }) => field);
    const [, setIsHovered] = React.useState(false);
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <>
            <Card
                sx={{
                    display: 'flex',
                    width: '100%',
                    // height: '113px',
                    my: 3,
                    background:
                        'linear-gradient(292.79deg, rgba(232, 245, 250, 0.75) 0%, rgba(243, 248, 253, 0.37) 100%)'
                }}
                onPointerEnter={() => setIsHovered(true)}
                onPointerLeave={() => setIsHovered(false)}
            >
                <CardMedia component="img" image={fieldImage} sx={{ width: '120px' }} alt="Field image" />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: '4px'
                    }}
                >
                    <CardContent>
                        <Box
                            sx={(theme) => ({
                                display: 'flex',
                                flexWrap: 'wrap',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                font: 'Roboto',
                                fontWeight: 400,
                                fontSize: '12px',
                                color: theme.palette.text.secondary
                            })}
                        >
                            <Typography variant="caption">{`NO. ${idx}`}</Typography>
                            <Typography variant="caption">{farm.farm.location_name}</Typography>
                        </Box>
                        <Typography
                            sx={{
                                mb: 1,
                                font: 'Roboto',
                                fontWeight: 700,
                                fontSize: '16px',
                                lineHeight: '28px',
                                color: theme.palette.text.primary
                            }}
                            variant="subtitle1"
                        >
                            {farm.farm.farm_name}
                        </Typography>
                        <Box
                            sx={(theme) => ({
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                font: 'Roboto',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '20.02px',
                                color: theme.palette.text.secondary
                            })}
                        >
                            <Typography variant="body2">
                                {fields.length > 2
                                    ? `${fields[0].field_name}, ${fields[1].field_name}`
                                    : `${fields.map((field) => field.field_name).join(' and ')}`}
                            </Typography>
                            <Typography variant="body2">
                                {fields.length > 2 ? ` and ${fields.length - 2} more` : null}
                            </Typography>
                        </Box>
                    </CardContent>
                    <Box
                        sx={{
                            textAlign: 'center',
                            mb: 1
                        }}
                    >
                        <Button
                            size="small"
                            variant="contained"
                            sx={(theme) => ({
                                color: theme.palette.default.contrastText,
                                backgroundColor: theme.palette.primary.main,
                                fontWeight: { xs: 300, md: 400 },
                                fontSize: { xs: 11, md: 13 },
                                font: 'Roboto',
                                transition: '0.2s all ease-out'
                            })}
                            onClick={() => {
                                setIsExpanded(!isExpanded);
                            }}
                            endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        >
                            {'View ' + (isExpanded ? 'Less' : 'More')}
                        </Button>
                    </Box>
                </Box>
            </Card>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom component="div">
                        Fields
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        {fields.map((field, idx) => (
                            <Button
                                key={idx}
                                size="small"
                                variant="contained"
                                sx={(theme) => ({
                                    color: theme.palette.default.contrastText,
                                    backgroundColor: theme.palette.primary.main,
                                    fontWeight: { xs: 300, md: 400 },
                                    fontSize: { xs: 11, md: 13 },
                                    font: 'Roboto',
                                    transition: '0.2s all ease-out'
                                })}
                                onClick={() => {
                                    dataActionDispatcher({ type: 'updateSelectedField', selectedField: field });
                                }}
                                endIcon={<ChevronRightIcon />}
                            >
                                {field.field_name}
                            </Button>
                        ))}
                    </Stack>
                </Box>
            </Collapse>
        </>
    );
};

export default FarmCard;
