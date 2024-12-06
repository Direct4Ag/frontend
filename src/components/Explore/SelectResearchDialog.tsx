import React from 'react';

import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Radio,
    RadioGroup,
    Typography
} from '@mui/material';
import { theme } from '@app/theme';

import CloseIcon from '@mui/icons-material/Close';

interface Props {
    open: boolean;
    handleClose: () => void;
    researches: ResearchDetail[];
    handleUpdateSelectedResearch: (research: string) => void;
}

const SelectResearchDialog = ({ open, handleClose, researches, handleUpdateSelectedResearch }: Props) => {
    const [selectedResearch, setSelectedResearch] = React.useState(researches[0] !== undefined ? researches[0].id : '');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedResearch(event.target.value);
    };
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle
                sx={{
                    mb: 1,
                    font: 'Roboto',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '28px',
                    color: theme.palette.text.primary
                }}
            >
                Select Research
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500]
                })}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                <Typography variant="body2" sx={{ font: 'Roboto' }} gutterBottom>
                    There are multiple researches available for this field. Please select a research to view the data.
                </Typography>
                <FormControl>
                    <FormLabel id="research-label">Research</FormLabel>
                    <RadioGroup aria-labelledby="research-label" value={selectedResearch} onChange={handleChange}>
                        {researches.map((research) => (
                            <FormControlLabel
                                key={research.id}
                                value={research.id}
                                control={<Radio />}
                                label={research.research_name}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    sx={{
                        color: theme.palette.default.contrastText,
                        backgroundColor: theme.palette.primary.main,
                        fontWeight: { xs: 300, md: 400 },
                        fontSize: { xs: 11, md: 13 },
                        font: 'Roboto',
                        minWidth: '90px',
                        transition: '0.2s all ease-out'
                    }}
                    onClick={() => handleUpdateSelectedResearch(selectedResearch)}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SelectResearchDialog;
