import {Box} from "@mui/material"
import React, {useEffect, useState} from "react"
import { useNavigate } from "react-router-dom";
import Map from "../components/Map"
import { SidePanel } from "../components/SidePanel";
import TrgInfo from '../components/TrgInfo'
import { TargetContext } from "../context/TargetContext";
import { useTarget } from "../hooks/target.hook";

export const MapPage = (props) =>{
    const [trgInfo, setTrgInfo] = useState();
    const [sideInfo, setSideInfo] = useState();
    const [clearKey, setClearKey] = useState(false);
    const {key, currTarget, clearTarget} = useTarget(); 
    const flyTo = []

    const navigate = useNavigate()
   // console.log("DrawMapPage")   
    useEffect(()=>{
        setSideInfo(props)
    },[props])
   
    const setInf = (e)=>{       
        setTrgInfo(e)
        if (!e)
            navigate("/")
    }

    const handleClear = (e)=>{      
        setClearKey(true)
        setTimeout(() => {
            setClearKey(false)
        }, 500);           
    }

    return (
        <TargetContext.Provider value={{key, currTarget, clearTarget, clearKey, flyTo}}>                    
            <SidePanel props={sideInfo} />              
            <TrgInfo data={trgInfo} clearKey={handleClear}/>
            <Box sx={{ bgcolor: '#cfe8fc', height: '92vh' }}>
                <Map info={setInf} clrKey={clearKey}/>
            </Box>            
        </TargetContext.Provider>
    )
}
