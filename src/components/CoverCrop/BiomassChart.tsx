import React from 'react';

import { Box, Typography } from '@mui/material';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot, MarkPlot, LineHighlightPlot } from '@mui/x-charts/LineChart';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

import { theme } from '@app/theme';

const BiomassChart: React.FC<{ data: CoverCropData[] }> = ({ data }) => {
    const [xLabels, setXLabels] = React.useState<string[]>([]);
    const [predictedBiomass, setPredictedBiomass] = React.useState<(number | null)[]>([]);
    const [actualBiomass, setActualBiomass] = React.useState<(number | null)[]>([]);

    React.useEffect(() => {
        if (data.length > 0) {
            const xLabelsTemp: string[] = [];
            const predictedBiomassTemp: (number | null)[] = [];
            const actualBiomassTemp: (number | null)[] = [];

            data.sort((a, b) => new Date(a.sampling_date).getTime() - new Date(b.sampling_date).getTime()).forEach(
                (d) => {
                    xLabelsTemp.push(d.sampling_date);
                    predictedBiomassTemp.push(d.predicted_cover_crop_biomass);
                    actualBiomassTemp.push(d.observed_cover_crop_biomass);
                }
            );

            setXLabels(xLabelsTemp);
            setPredictedBiomass(predictedBiomassTemp);
            setActualBiomass(actualBiomassTemp);
        }
    }, [data]);

    if (data.length === 0) {
        return null;
    }
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options);
    return (
        <Box>
            <Typography
                variant="h6"
                sx={{
                    font: 'Poppins',
                    fontWeight: 700,
                    fontSize: '20px',
                    lineHeight: '32px',
                    letterSpacing: '0.15px',
                    color: theme.palette.text.primary,
                    textTransform: 'capitalize'
                }}
            >
                Yield (Biomass)
            </Typography>
            <ResponsiveChartContainer
                height={380}
                series={[
                    {
                        data: predictedBiomass,
                        type: 'line',
                        label: 'Predicted Biomass',
                        valueFormatter: (value: number | null) =>
                            value ? `${value.toFixed(2)} ${data[0].cover_crop_biomass_unit ?? ''}` : 'N/A'
                    },
                    {
                        data: actualBiomass,
                        type: 'line',
                        label: 'Observed Biomass',
                        valueFormatter: (value: number | null) =>
                            value ? `${value.toFixed(2)} ${data[0].cover_crop_biomass_unit ?? ''}` : 'N/A'
                    }
                ]}
                xAxis={[
                    {
                        scaleType: 'point',
                        data: xLabels,
                        valueFormatter: (value: string) => `${formattedDate.format(new Date(`${value}T00:00:00`))}`,
                        label: 'Date'
                    }
                ]}
                yAxis={[{ label: 'Predicted Biomass' }]}
                sx={{
                    [`.${axisClasses.left} .${axisClasses.label}`]: {
                        // Move the y-axis label with CSS
                        transform: 'translateX(-10px)'
                    }
                }}
                // yAxis={[{ id: 'predicted-biomass', label: 'Predicted Biomass' }, { id: 'actual-biomass', label: 'Observed Biomass' }]}
            >
                <LinePlot />
                <MarkPlot />
                <LineHighlightPlot />
                <ChartsTooltip trigger="axis" />
                <ChartsAxisHighlight x="line" />
                <ChartsXAxis />
                <ChartsYAxis />
                <ChartsLegend />
                <ChartsGrid horizontal />
            </ResponsiveChartContainer>
        </Box>
    );
};

export default BiomassChart;
