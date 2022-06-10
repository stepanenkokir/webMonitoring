import {CssBaseline,Box } from "@mui/material"
import React, {useState} from "react"
import Map from "../components/Map"
import ModalLogout from "../components/ModalLogout"

export const MapPage = () =>{
    const [logout, setLogout] = useState(false);
    return (
        <>
            {logout && <ModalLogout/>}
            <CssBaseline />
            <Box sx={{ bgcolor: '#cfe8fc', height: '92vh' }}>
                <Map logout={setLogout}/>
            </Box>
        </>
    )
}
