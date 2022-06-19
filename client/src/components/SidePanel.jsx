import {CssBaseline,Box, Drawer, IconButton, Divider, Typography } from "@mui/material"
import React, {useEffect, useState} from "react"
import { styled, useTheme } from '@mui/material/styles';
import { ListPage } from "./ListPage"
import { StatusPage } from "./StatusPage"
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from "react-router-dom";

const drawerWidth = 300;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'space-between',
  }));

export const SidePanel = (props) =>{   
    const [drawData, setDrawData] = useState();
    const [drawName, setDrawName] = useState();

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerClose = () => {
        setOpen(false);
    };

    console.log("DrawMapPage")

    useEffect(()=>{                
        if (props)
        if (props.props){
            console.log("props SidePanel",props)
            if (props.props.stat){            
                setDrawName("Статусы")
                setDrawData(<StatusPage/>)
                setOpen(true);
            }
            else
            if (props.props.list){
                setDrawName("СписокВС")
                setDrawData(<ListPage/>)
                setOpen(true);
            }   
            else
                setOpen(false);         
        }
        else
                setOpen(false);
        

    },[props])   

    return (
        <>                   
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
        </>
    )
}
