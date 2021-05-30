import React from 'react'
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core'

const FormSelect = ({ label, valuesList, setValue, initialValue }) => {
    return (
        <>
            <Grid item xs={12} sm={6}>
                <InputLabel>{label}</InputLabel>
                <Select value={initialValue} fullWidth onChange={(e) => setValue(e.target.value)}>
                    {valuesList.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
        </>
    )
}

export default FormSelect
