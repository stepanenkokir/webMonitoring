import * as React from "react"
import { useHttp } from "../hooks/http.hooks";
import { AuthContext } from "../context/AuthContext"
import 'whatwg-fetch'; 
import {Table, TableBody, TableCell,TableHead,  TableContainer,  TableRow, Paper, Container, CircularProgress, Backdrop, Stack} from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ModalLogout from "../components/ModalLogout";

export const StatusPage = () =>{         
    const {loading, request} = useHttp();    
    const auth = React.useContext(AuthContext)
    const [names, setNames] = React.useState([]);
    const [logout, setLogout] = React.useState(false);    
    const [stateToast, setStateToast] = React.useState({
        open: false,       
        recInfo:{}
      });
    const timeout = React.useRef(null);
    const timeoutToast = React.useRef(null);

    const readFromServer = async ()=>{
        try{
            const response = await request('/mlat/recv','GET',null,{
                Authorization: `Bearer ${auth.token}`
            });                                       
           
             setNames(response.data);            
        }catch(e){
            console.log("Error 500",e);
            if (String(e).startsWith('Error: 401')) 
                setLogout(true)
        }
    }

    const handleClick = (info)=>{
        
        console.log("Click",info)
        let strInfo=  "В норме.";  
        let  severity="success";
        
        if (info.st==='running' && info.gps!=='fix'){
            strInfo=  "Проблема ГНСС";
            severity="warning";
        }
        if (info.st!=='running'){
            strInfo=  "Неисправна";
            if (info.err===18){
                strInfo=  "Обрыв связи";
                severity="error";
            }
                
            if (info.err===20){
                strInfo=  "Ошибки в данных";
                severity="warning";
            }                            
        }

        setStateToast({ open: true, recInfo:
        {
            name:info.name,
            info:strInfo,
            severity:severity

        }});
        timeoutToast.current = setTimeout(handleClose,5000);
    }

    const handleClose = () => {
        setStateToast({...stateToast, open: false});
        clearInterval(timeoutToast.current)  
      };

    React.useEffect(() =>{           
        readFromServer()        
        timeout.current = setInterval(async ()=>{
            await readFromServer()            
        },10000);
        return ()=> clearInterval(timeout.current)    
    },[])

    
    return (         
        <Container component="main" maxWidth="xl">            
             {logout && <ModalLogout/>}              
            <Stack spacing={2} sx={{ maxWidth: 200 }}>
            <Snackbar
                anchorOrigin={{vertical:'top', horizontal:'left'}}
                open={stateToast.open}
                onClose={handleClose}               
                key={stateToast.recInfo.name}                
            >
                            
                    <Alert 
                        onClose={handleClose} 
                        severity={stateToast.recInfo.severity}
                        sx={{ width: '100%' }}>
                        {stateToast.recInfo.name+": "+stateToast.recInfo.info}
                    </Alert>
            
                </Snackbar>
            </Stack>                     
        <TableContainer component={Paper} sx={{  mt:1,minWidth: 200}}>
            <Table stickyHeader  aria-label="a dense table" size="small"  >
              <TableHead  aria-label="simple table">            
                <TableRow>                    
                    <TableCell sx={{ maxWidth: 50}}><b>Позиция</b></TableCell>                   
                    <TableCell  sx={{ maxWidth: 50}}>ГНСС</TableCell>
                    <TableCell  sx={{ maxWidth: 50}}>Задержка</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>                  
            {names && names.map((row) => (                
                  <TableRow 
                    hover                    
                    key={row.name} 
                    onClick={() => { 
                        handleClose();
                        handleClick(row)                         
                    }} 
                    sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        background: row.st!=='running'?(row.err!=20?'#EF5350':'#FFFF00'):
                            row.gps==='fix'?'#B2FF59':'#FFF000'
                    }}>                    
                  <TableCell component="th" scope="row">{row.name}</TableCell>                  
                  <TableCell  sx={{ maxWidth: 50}}>{row.gps==='fix'?'OK':"-"}</TableCell>
                  <TableCell  sx={{ maxWidth: 50}}>{(+row.delay).toFixed(2)}</TableCell>
              </TableRow>                           
            ))}
            </TableBody> 
            </Table>   
        </TableContainer>                
        </Container>
    )
}