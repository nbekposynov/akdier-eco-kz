import { Grid, TextField, MenuItem, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const WasteItem = ({ index, item, wastes, onChange, onRemove }) => {
    return (
        <Box sx={{ marginBottom: 4 }}> {/* Отступ между элементами */}
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                    <TextField
                        label="Тип отхода"
                        fullWidth
                        select
                        value={item.waste_id}
                        onChange={(e) => onChange(index, 'waste_id', e.target.value)}
                    >
                        {wastes.map((waste) => (
                            <MenuItem key={waste.id} value={waste.id}>
                                {waste.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Количество"
                        fullWidth
                        type="number"
                        value={item.amount}
                        onChange={(e) => onChange(index, 'amount', e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        label="Коэффициент (опционально)"
                        type="number"
                        fullWidth
                        value={item.factor === null || item.factor === undefined ? '' : item.factor}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Если пустое значение, устанавливаем null
                            if (value === '') {
                                onChange(index, 'factor', null);
                            } else {
                                // Разрешаем любой ввод, валидация при отправке
                                onChange(index, 'factor', value);
                            }
                        }}
                        placeholder="Стандартный"
                        helperText="Переопределяет коэффициент типа отхода"
                        inputProps={{
                            min: 0,
                            step: 0.01
                        }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <IconButton onClick={() => onRemove(index)} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    );
};

export default WasteItem;
