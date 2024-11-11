import React from 'react';

import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot, MarkPlot, LineHighlightPlot } from '@mui/x-charts/LineChart';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { AllSeriesType } from '@mui/x-charts';
import { DatasetType } from '@mui/x-charts/models/seriesType/config';

interface AirTempAndVPDPlotProps {
    dataset: DatasetType;
    series: AllSeriesType[];
    xAxisLabels: string[];
    valueFormatter: (value: string) => string;
}

const AirTempAndVPDPlot: React.FC<AirTempAndVPDPlotProps> = ({
    dataset,
    series,
    xAxisLabels,
    valueFormatter
}): JSX.Element => {
    return (
        <ResponsiveChartContainer
            height={380}
            dataset={dataset}
            series={series}
            xAxis={[
                {
                    scaleType: 'band',
                    data: xAxisLabels,
                    valueFormatter: valueFormatter,
                    label: 'Date'
                }
            ]}
            yAxis={[
                { id: 'avg-air-temp', label: 'Temperature (°F)' },
                { id: 'avg-vpd', label: 'Vapor Pressure Deficit (kPa)' }
            ]}
        >
            <ChartsGrid horizontal />
            <LinePlot />
            <MarkPlot />
            <LineHighlightPlot />
            <ChartsTooltip trigger="axis" />
            <ChartsAxisHighlight x="line" />
            <ChartsXAxis />
            <ChartsYAxis axisId="avg-air-temp" position="right" />
            <ChartsYAxis axisId="avg-vpd" position="left" />
            <ChartsLegend />
        </ResponsiveChartContainer>
    );
};

export default AirTempAndVPDPlot;
