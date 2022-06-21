import { Box, SwipeableDrawer, Drawer, Grid, IconButton, Paper, Table, TableRow, TableCell, TableBody } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { borderRadius } from '@mui/system';


const lightTheme = createTheme({ palette: { mode: 'light' } });

const Item = styled(Paper)(({ theme }) => ({   
    ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,  
  
  }));

  const hdr = ['Тип','ICAO','CallSign','Squawk','Lat','Lon','Alt']


const TrgInfo = (props) => {

    const [open, setOpen] = useState(false);
    const [drawData, setDrawData] = useState();
    
    useEffect(()=>{
       // console.log("TRGINFO", props.data) 
        if (props){
            if (props.data){
                
                const arrTxt=[]
                arrTxt.push(props.data.prop.mode.toUpperCase())
                arrTxt.push(props.data.prop.icao.toUpperCase())
                arrTxt.push(props.data.prop.name.toUpperCase())
                arrTxt.push(props.data.prop['mode-a'])
                arrTxt.push(...props.data.position)               
                                                
                setDrawData(<Grid  container spacing={3}>
                    <Grid item xs={12}>
                    <ThemeProvider theme={lightTheme}>
                    <Box
                        sx={{
                        p: 1,                        
                        display: { xs: 'none', md: 'grid' }, 
                        gridTemplateColumns: { md: ' 1fr 1fr 1fr 1fr 0.5fr 0.5fr 1fr' },
                        gap: 1,
                        }}
                    >
                        {arrTxt.map((t,i)=>(
                            <Item key={"pr"+i}>
                                {hdr[i]}:                                 
                                <b>{t}</b>
                            </Item>
                        ))}                                                
                    </Box>

                    <Box
                        sx={{
                        p: 1,                        
                        display: { xs: 'grid', md: 'none' }, 
                        gridTemplateColumns: { md: ' 1fr 1fr 1fr 1fr 0.5fr 0.5fr 1fr' },
                        gap: 1,
                        }}
                    >
                        <Table size="small" aria-label="a dense table"><TableBody>
                        {arrTxt.map((t,i)=>(
                           
                                <TableRow  key={"tbl"+i}>
                                <TableCell key={"tc1"+i} align="right">{hdr[i]}:</TableCell>
                                <TableCell key={"tc2"+i}><b>{t}</b></TableCell>
                                </TableRow>
                           
                        ))}                
                        </TableBody>
                        </Table>                                
                    </Box>
                    </ThemeProvider>
                    </Grid>                   
                </Grid>)
                if(!open)
                    setOpen(true)              
            }
            else{
                if (open){
                    setOpen(false)                  
                }
                    
            }
                
        }                                
    },[props])
      

    const toggleDrawer = (newOpen)=>{
        console.log("Toggle",newOpen)
        setOpen(newOpen)          
        
    }

    const handleClose = ()=>{        
       // console.log("Close Box@@")
        props.clearKey()
        setDrawData()
        setOpen(false)
    }
    
    return  (  
        <React.Fragment key={"swBot"}>       
        <SwipeableDrawer                               
            sx={{width: 'auto', display:'flex'}}
            variant="persistent"
            anchor="bottom"
            onClose={()=>toggleDrawer(false)}
            onOpen={()=>toggleDrawer(true)}
            open={open}            
        >                               
            <Box 
               component="span" 
               sx={{ 
                flexGrow: 1, 
                p: 0.1, 
                border: '1px solid grey',
                borderRadius:'5px',
                textAlign:'center'
                }} >  
                Информация о наблюдаемом объекте
                           
                <IconButton sx={{
                    position:'absolute',
                    right:0,
                    top:0,                  
                 }}
                 onClick={handleClose}
                 >
                    <CloseIcon />                   
                </IconButton>
                {drawData}
            </Box>
        </SwipeableDrawer>  
        </React.Fragment>            
    )
}
export default TrgInfo