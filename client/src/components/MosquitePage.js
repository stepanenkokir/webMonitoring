import {Container, Table, TableBody, TableCell, TableContainer,  TableRow, Paper, Typography, TableHead} from "@mui/material";
import React, { useContext, useEffect, useState } from "react"
import MarkersTrg from "./MarkersTrg";
import { TargetContext } from "../context/TargetContext"

export const MosquitePage = () =>{     
    const trg = useContext(TargetContext)
    const [page,setPage] = useState([])

    const {mosquites} = MarkersTrg()

    const handleClick = (pos)=>{       
        trg.flyTo=[pos.lat,pos.lng,0]
    }
   
    useEffect(()=>{
       
        const tbl = []        

        for (let i=0;i<mosquites.length;i++){
            const tblD = mosquites[i].props
            if (!tblD.lIcao)
                continue;
            tbl.push(
                <TableRow hover key={"mosqRow"+i} onClick = {()=>{handleClick(tblD.position)}}>                                                
                    <TableCell>
                        <Typography component="h5" >
                            {tblD.lIcao}
                        </Typography>                                                
                    </TableCell>                                                                                 
                    <TableCell> 
                        <Typography>
                            {tblD.lAlt}
                        </Typography>
                    </TableCell>                        
                </TableRow>
            )
        }
        setPage(tbl)

    },[mosquites])

    return (        
        <Container component="main" maxWidth="xl">                               
            <TableContainer component={Paper} sx={{ mt:1,minWidth: 200}}>
                <Table stickyHeader   size="small">     
                    <TableHead>
                        <TableRow>                                                
                            <TableCell><Typography component="h5" >ICAO</Typography></TableCell>                                                                                 
                            <TableCell><Typography>Высота</Typography></TableCell>                        
                        </TableRow>
                    </TableHead>               
                    <TableBody> 
                        {page}
                    </TableBody> 
                </Table>   
            </TableContainer>  
        </Container>
        
    )
}
