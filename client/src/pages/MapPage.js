import {CssBaseline,Box } from "@mui/material";
import React, {useEffect, useState} from "react"
import { useParams } from "react-router-dom";
import Map from "../components/Map"
import ModalLogout from "../components/ModalLogout";

export const MapPage = () =>{ 
    const [logout, setLogout] = useState(false);          
    const {icao} = useParams();
    useEffect(()=>{
        console.log("START MAP WITH ICAO = ",icao)

    },[icao])

    return ( 
        <>  
            {logout && <ModalLogout/>} 
            <CssBaseline />              
            <Box sx={{ bgcolor: '#cfe8fc', height: '92vh' }}>
                <Map logout={setLogout} icao={icao}/>
            </Box>
        </>
        
    )
}
