import React from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const YearsSelect: React.FC<{
    yearsSelect: string[] | null;
    selectedYear: string;
    setSelectedYear: React.Dispatch<React.SetStateAction<string>>;
}> = ({ yearsSelect, selectedYear, setSelectedYear }): JSX.Element => {
    if (!yearsSelect) {
        return <div>Years not available</div>;
    }
    return (
        <FormControl>
            <InputLabel id="year-select-label">Choose a Year</InputLabel>
            <Select
                labelId="year-select-label"
                id="year-select"
                value={selectedYear}
                label="Choose a Year"
                onChange={(e) => {
                    setSelectedYear(e.target.value);
                }}
                sx={{
                    width: '200px'
                }}
            >
                {yearsSelect &&
                    yearsSelect.map((year) => (
                        <MenuItem key={year} value={year}>
                            {year}
                        </MenuItem>
                    ))}
            </Select>
        </FormControl>
    );
};

export default YearsSelect;
