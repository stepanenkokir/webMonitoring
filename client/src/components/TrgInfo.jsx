import { Box, Divider, Drawer, Grid, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';


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

        if (props){
            if (props.data){
                console.log("TRGINFO", props.data) 
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
                setOpen(true)
            }
            else
                setOpen(false)
        }                                
    },[props])
      

    return  (  
        <React.Fragment key={"swBot"}>       
        <Drawer                               
            sx={{width: 'auto'}}
            variant="persistent"
            anchor="bottom"
            open={open}            
        >                    
            <Divider />
            <Box> 
                {drawData}
            </Box>
        </Drawer>  
        </React.Fragment>            
    )
}
export default TrgInfo