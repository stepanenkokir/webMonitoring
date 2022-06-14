import {CssBaseline,Box, Drawer, IconButton, Divider, Typography } from "@mui/material"
import React, {useEffect, useState} from "react"
import { styled, useTheme } from '@mui/material/styles';
import Map from "../components/Map"
import ModalLogout from "../components/ModalLogout"
import { ListPage } from "./ListPage"
import { StatusPage } from "./StatusPage"
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from "react-router-dom";

const drawerWidth = 300;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      }),
    }),
  );

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'space-between',
  }));

export const MapPage = (props) =>{
    const [logout, setLogout] = useState(false);
    const [drawData, setDrawData] = useState();
    const [drawName, setDrawName] = useState();

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(()=>{
        console.log("Map props = ",props)
        if (props.stat){            
            setDrawName("Статусы")
            setDrawData(<StatusPage/>)
            setOpen(true);
        }
        else
        if (props.list){
            setDrawName("СписокВС")
            setDrawData(<ListPage/>)
            setOpen(true);
        }
        else
            setOpen(false);

    },[props])

    return (
        <>
            {logout && <ModalLogout/>}
            <CssBaseline />

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { width: drawerWidth,boxSizing: 'border-box',},
                    
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >                
            
            <DrawerHeader>
                <b></b><b>{drawName}</b>
                <IconButton 
                    component={Link}
                    to={'/'}
                >
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>                
            </DrawerHeader>
            <Divider />
                {drawData}
            </Drawer>                            
            <Box sx={{ bgcolor: '#cfe8fc', height: '92vh' }}>
                <Map logout={setLogout}/>                
            </Box>            
        </>
    )
}
