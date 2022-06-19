import React, { useContext, useState } from "react"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Alert, Collapse, CssBaseline, Grid, LinearProgress } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useHttp } from "../hooks/http.hooks";
import { GlobalContext } from "../context/GlobalContext";
import 'whatwg-fetch'; 

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://lemz.ru/">
        ПАО "НПО "АЛМАЗ" НПЦ-СПб
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

function checkRussian(str){
    for (let i=0;i<str.length;i++)
    {
        let x=str.charCodeAt(i);       
        if (x>122)                    
            return true;                    
    }
    return false;
}

export const  SignIn = () =>  {
    const auth = useContext(GlobalContext);
    const [form,setForm] = useState({login:'', password: ''});
    const {loading, request} = useHttp();
    const [errorString,setErrorString] = useState("");
    
    const changeHandler = event =>{
        setForm({...form, [event.target.name]: event.target.value});               
        if (checkRussian(event.target.value))            
            setErrorString("Недопустимые символы!");                    
        else        
            setErrorString("");                    
    }
    
    const handleSubmit = async (event) => { 
        event.preventDefault(); 
        try {
            const response = await request('/db/login','POST',{...form});                      
            auth.login(response.token, response.userId, response.name);
        }catch (e) {    
            //console.log("ERRR_KEK",e);        
            let strErr = e;
            if (String(e).includes('Unexpected'))
                strErr = "Неизвестная ошибка сервера. Попробуйте позже"

            //setErrorString("Ошибка авторизации. Нет доступа к базе данных. Попробуйте позже.");
            setErrorString("Ошибка авторизации. "+strErr);
        }                     
    };
        
    return (      
   
        <Container component="main" maxWidth="sm">  
            <CssBaseline />     
            <Grid container columnSpacing={{ xs: 3, sm: 2, md: 1 }}>
                <Grid item xs={6}>
                    <Link underline="none" href="https://lemz.ru/">
                    <Box                        
                        sx={{                                                        
                            marginTop:1,
                            textAlign: 'center'
                    }}>
                        <img src="/images/lemz.png" alt="LEMZ" width="32" />
                        <p>ПАО "НПО "АЛМАЗ"</p>
                    </Box>
                    </Link>
                </Grid>
                <Grid item xs={6}>
                <Link underline="none" href="http://avt.spb.ru/">                
                    <Box
                        sx={{           
                            marginTop:1,                                             
                            textAlign: 'center'
                    }}>
                        <img src="/images/avt.jpg" alt="AVT" width="32" />
                        <p>СПб ГКУ "АВТ"</p>
                    </Box>
                </Link>
                </Grid>               
            </Grid>                                            
            <Box
                component="div"
                sx={{                   
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <img src="/images/logo.svg" width="96" />
                <Typography component="h1" variant="h5">
                    Авторизация                
                </Typography>            
                
                <Collapse in={loading} sx={{ width: '100%' }}>            
                    <LinearProgress />            
                </Collapse>        
                            
                <Collapse in={errorString!==""}>
                    <Alert severity="error">
                        {errorString}
                    </Alert>
                </Collapse>          
                            
                <Box 
                    component="form" 
                    onSubmit={handleSubmit} 
                    noValidate 
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="login"
                        label="Имя"
                        name="login"
                        error={errorString !== ""}                    
                        autoComplete="login"
                        autoFocus
                        onChange={changeHandler}                  
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Пароль"
                        type="password"
                        id="password"
                        error={errorString !== ""}  
                        autoComplete="current-password"
                        onChange={changeHandler}
                    />                    
                    <Button                   
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        sx={{ mt: 1, mb: 1 }}            
                    >
                    Войти в систему
                    </Button> 
                </Box>
                <Copyright sx={{ mt: 2, mb: 2 }} />                
            </Box>             
        </Container>               
   
  );
}