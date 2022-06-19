import {Box} from "@mui/material"
import React, {useEffect, useState} from "react"
import Map from "../components/Map"
import { SidePanel } from "../components/SidePanel";
import TrgInfo from '../components/TrgInfo'

export const MapPage = (props) =>{
    const [trgInfo, setTrgInfo] = useState();
    const [sideInfo, setSideInfo] = useState();
    console.log("DrawMapPage")   
    useEffect(()=>{
        setSideInfo(props)
    },[props])
    return (
        <>                    
            <SidePanel props={sideInfo} />              
            <TrgInfo data={trgInfo}/>
            <Box sx={{ bgcolor: '#cfe8fc', height: '92vh' }}>
                <Map info={setTrgInfo}/>                
            </Box>            
        </>
    )
}
