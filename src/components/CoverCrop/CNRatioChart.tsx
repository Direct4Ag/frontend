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

const CNRatioChart: React.FC<{ data: CoverCropData[] }> = ({ data }) => {
    const [xLabels, setXLabels] = React.useState<string[]>([]);
    const [predictedCNRatio, setPredictedCNRatio] = React.useState<(number | null)[]>([]);
    const [actualCNRatio, setActualCNRatio] = React.useState<(number | null)[]>([]);

    React.useEffect(() => {
        if (data.length > 0) {
            const xLabelsTemp: string[] = [];
            const predictedCNRatioTemp: (number | null)[] = [];
            const actualCNRatioTemp: (number | null)[] = [];

            data.sort((a, b) => new Date(a.sampling_date).getTime() - new Date(b.sampling_date).getTime()).forEach(
                (d) => {
                    xLabelsTemp.push(d.sampling_date);
                    predictedCNRatioTemp.push(d.predicted_CN_ratio);
                    actualCNRatioTemp.push(d.observed_CN_ratio);
                }
            );

            setXLabels(xLabelsTemp);
            setPredictedCNRatio(predictedCNRatioTemp);
            setActualCNRatio(actualCNRatioTemp);
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
                C:N Ratio (Carbon-to-Nitrogen Ratio)
            </Typography>
            <ResponsiveChartContainer
                height={380}
                series={[
                    {
                        type: 'line',
                        data: predictedCNRatio,
                        label: 'Predicted C:N Ratio',
                        color: '#FFB946',
                        valueFormatter: (value: number | null) => (value ? value.toFixed(2) : 'N/A')
                    },
                    {
                        type: 'line',
                        data: actualCNRatio,
                        label: 'Observed C:N Ratio',
                        color: '#FF5C5C',
                        valueFormatter: (value: number | null) => (value ? value.toFixed(2) : 'N/A')
                    }
                ]}
                xAxis={[
                    {
                        scaleType: 'point',
                        data: xLabels,
                        label: 'Date',
                        valueFormatter: (value: string) => `${formattedDate.format(new Date(`${value}T00:00:00`))}`
                    }
                ]}
                yAxis={[
                    {
                        label: 'C:N Ratio'
                    }
                ]}
                sx={{
                    [`.${axisClasses.left} .${axisClasses.label}`]: {
                        // Move the y-axis label with CSS
                        transform: 'translateX(-10px)'
                    }
                }}
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

export default CNRatioChart;
