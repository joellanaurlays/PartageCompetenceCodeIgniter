import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface HeaderProps {
    title: string;
    onSearch?: (searchTerm: string) => void; // Rendre optionnel
}

const Header: React.FC<HeaderProps> = ({ title, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    return (
        <Box sx={{
            padding: '15px 24px',
            borderBottom: '2px solid #773399',
            margin: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap'
        }}>
            {/* Barre de recherche - affichée seulement si onSearch est fourni */}
            {onSearch && (
                <TextField
                    size="small"
                    placeholder="Rechercher par pseudo..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{
                        width: 250,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 45,
                            backgroundColor: '#f5f5f5',
                            '&.Mui-focused fieldset': {
                                borderColor: '#773399',
                                borderWidth: '2px'
                            },
                            '&:hover fieldset': {
                                borderColor: '#773399'
                            }
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#999' }} />
                            </InputAdornment>
                        )
                    }}
                />
            )}

            {/* Titre à droite */}
            <Typography sx={{
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: 20,
                background: 'linear-gradient(34deg, #000204 0%, #773399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                ml: onSearch ? 0 : 'auto' // Centrer le titre sans barre de recherche
            }}>
                {title}
            </Typography>
        </Box>
    );
};

export default Header;