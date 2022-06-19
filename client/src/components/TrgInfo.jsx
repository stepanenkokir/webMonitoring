import { Box, Divider, Drawer, Grid, IconButton, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useCallback } from 'react';

const lightTheme = createTheme({ palette: { mode: 'light' } });

const Item = styled(Paper)(({ theme }) => ({   
    ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  
  }));



const TrgInfo = (props) => {

    const [open, setOpen] = useState(false);
    const [drawData, setDrawData] = useState();
    
    useEffect(()=>{
       // console.log("TRGINFO", props.data) 
        if (props){
            if (props.data){
                
                const arrTxt=[]
                arrTxt.push(props.data.properties.mode.toUpperCase())
                arrTxt.push(props.data.properties.icao.toUpperCase())
                arrTxt.push(props.data.properties.name.toUpperCase())
                arrTxt.push("ModeA:"+props.data.properties['mode-a'])
                arrTxt.push(props.data.geometry.coordinates.join(','))
                                                
                setDrawData(<Grid  container spacing={3}>
                    <Grid item xs={12}>
                    <ThemeProvider theme={lightTheme}>
                    <Box
                        sx={{
                        p: 1,
                        
                        display: 'grid',
                        gridTemplateColumns: { md: ' 1fr 1fr 1fr 1fr 2fr' },
                        gap: 4,
                        }}
                    >
                        {arrTxt.map((t,i)=>(
                            <Item key={"pr"+i}>
                            {t}
                        </Item>
                        ))}
                        
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
      
    const handleClose = ()=>{        
       // console.log("Close Box@@")
        props.clearKey()
        setDrawData()
        setOpen(false)
    }
    
    return  (  
        <React.Fragment key={"swBot"}>       
        <Drawer                               
            sx={{width: 'auto', display:'flex'}}
            variant="persistent"
            anchor="bottom"
            open={open}            
        >                               
            <Box 
               component="span" 
               sx={{ 
                flexGrow: 1, 
                p: 1, 
                border: '1px dashed grey' 
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
        </Drawer>  
        </React.Fragment>            
    )
}
export default TrgInfo