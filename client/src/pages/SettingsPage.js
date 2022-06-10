import React from "react"
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const theme = createTheme();
export const SettingsPage = () =>{     
   console.log("render List!!");
    return (
        <ThemeProvider theme={theme}>  
            <Container component="main" maxWidth="sm">  
                <CssBaseline /> 
                <Box
                    component="h2"
                    noValidate 
                    sx={{ mt: 8 }}
                >
               Извините, но Вам не доступно изменение настроек.<br/>
               Обратитесь к администратору. 
               <br/>             
               <br/>             
               <Typography  
                            component={Link}
                            to={'/'}
                            noWrap                                           
                            sx={{                              
                                fontFamily: 'serif',
                                fontWeight: 700,
                                fontSize: 24,
                                color: 'blue',
                                textDecoration: 'none',
                            }}
                        >            
                            Вернуться                        
                        </Typography>
               </Box>
            </Container>
        </ThemeProvider>         
    )
}
