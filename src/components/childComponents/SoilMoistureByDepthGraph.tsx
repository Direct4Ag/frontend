import React from 'react';

import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot, MarkPlot, LineHighlightPlot } from '@mui/x-charts/LineChart';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { AllSeriesType } from '@mui/x-charts';

interface SoilMoistureByDepthGraphProps {
    series: AllSeriesType[];
    xAxisLabels: string[];
    valueFormatter: (value: string) => string;
    yAxis: { id: string; label: string }[];
}

const SoilMoistureByDepthGraph: React.FC<SoilMoistureByDepthGraphProps> = ({
    series,
    xAxisLabels,
    valueFormatter,
    yAxis
}): JSX.Element => {
    if (yAxis.length === 2) {
        return (
            <ResponsiveChartContainer
                height={380}
                series={series}
                xAxis={[
                    {
                        scaleType: 'band',
                        data: xAxisLabels,
                        valueFormatter,
                        label: 'Date'
                    }
                ]}
                yAxis={yAxis}
            >
                <LinePlot />
                <BarPlot />
                <MarkPlot />
                <LineHighlightPlot />
                <ChartsTooltip trigger="axis" />
                <ChartsAxisHighlight x="line" />
                <ChartsXAxis />
                <ChartsYAxis axisId={yAxis[0].id} position="right" />
                <ChartsYAxis axisId="avg-precipitation" position="left" />
                <ChartsLegend />
                <ChartsGrid horizontal />
            </ResponsiveChartContainer>
        );
    }
    return (
        <ResponsiveChartContainer
            height={380}
            series={series}
            xAxis={[
                {
                    scaleType: 'band',
                    data: xAxisLabels,
                    valueFormatter,
                    label: 'Date'
                }
            ]}
            yAxis={[{ id: 'avg-precipitation', label: 'Precipitation (mm)' }]}
        >
            <BarPlot />
            <MarkPlot />
            <ChartsTooltip trigger="axis" />
            <ChartsAxisHighlight x="line" />
            <ChartsXAxis />
            <ChartsYAxis axisId="avg-precipitation" position="left" />
            <ChartsLegend />
            <ChartsGrid horizontal />
        </ResponsiveChartContainer>
    );
};

export default SoilMoistureByDepthGraph;
