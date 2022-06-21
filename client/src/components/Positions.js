import React, {useEffect, useState} from 'react'
import { Marker,Tooltip,GeoJSON } from 'react-leaflet'
import { GlobalContext } from "../context/GlobalContext"
import L from 'leaflet'
import { useHttp } from "../hooks/http.hooks";
import { FeatureGroup } from 'react-leaflet';
import zoneULP from './zones/ulp10-12.json'
import zoneULR from './zones/ulr1.json'

export const ZoneULP = ()=>{
    const [borderData, setBorderData] = useState([zoneULP]);      
    const allGSN=borderData.map((data,id) => {        
        const geojson0 = data.features[0].geometry;                
        const geojson1 = data.features[1].geometry;  
        const geojson2 = data.features[2].geometry;  
        return ( 
            <FeatureGroup key={"fg_ulp"+id}>
                <GeoJSON key={'key_ulp0'+id} data={geojson0} pathOptions={{color:'red'}} />               
                <GeoJSON key={'key_ulp1'+id} data={geojson1} pathOptions={{color:'red'}} />               
                <GeoJSON key={'key_ulp2'+id} data={geojson2} pathOptions={{color:'red'}} />               
            </FeatureGroup>                       
        )
    })
    return allGSN;
}

export const ZoneULR = ()=>{
    const [borderData, setBorderData] = useState([zoneULR]);  
    const allGSN=borderData.map((data,id) => {
        const geojson = data.features[0].geometry;        
        return (                        
            <GeoJSON key={'ulr'} data={geojson} pathOptions={{color:'blue'}} />                                       
        )
    })
    return allGSN;
}

const colorIicon = (color)=>{     
    const style=
        `background-color: hsl(${color},100%,40%);
        width:1rem;
        height:1rem;
        display:block;
        left:-0.5rem;
        top:-0.5rem;
        position:relative;
        border-radius: 1rem 1.2rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF;`        

    return L.divIcon({
  className: "my-custom-pin",
  iconAnchor: [0, 0],
  labelAnchor: [0, 0],
  popupAnchor: [0,0],
  html: `<span style="${style}" />`
})}

export const Positions = () =>{        
    const {request} = useHttp();
    const [positions, setPositions]=useState([]); 
    
    
    const auth = React.useContext(GlobalContext)
    const timeout = React.useRef(null);

    const readPositionsFromServer = async ()=>{
        try{
            const response = await request('/mlat/positions','GET');                     
            const recv = await request('/mlat/recv','GET',null,{
                Authorization: `Bearer ${auth.token}`
            });          
            //console.log("Load positions!",response,recv)
            const geojson = response.data;          
            let cntrCrd={lat:0,lng:0}  
            let myPos=[];    
            let arrCrdPos=[]    
            for (let i=0;i<geojson.features.length;i++){                           
                if (geojson.features[i].properties.id){
                    cntrCrd.lat+=geojson.features[i].geometry.coordinates[1]
                    cntrCrd.lng+=geojson.features[i].geometry.coordinates[0]
                    arrCrdPos.push([geojson.features[i].geometry.coordinates[1], geojson.features[i].geometry.coordinates[0]])
                    let clr = 40;
                    let strStat=' ( Статус неопределён )'

                    if (recv)
                        if (recv.data)
                            if (recv.data[i-3])
                                if (recv.data[i-3].st==='failed'){
                                    clr=0
                                    strStat=' ( НЕИСПРАВНА )'
                                }                                    
                                else{
                                    clr=90
                                    strStat=''
                                }
                                    

                    myPos.push(                
                        <Marker 
                            key={geojson.features[i].properties.id} 
                            position={L.latLng([
                                geojson.features[i].geometry.coordinates[1],
                                geojson.features[i].geometry.coordinates[0]
                                ])}
                            icon={colorIicon(clr)}> 
                            <Tooltip direction="top"  >
                                {geojson.features[i].properties.name + strStat}
                            </Tooltip>
                        </Marker>     
                    )
                }                        
            }      
            setPositions(myPos) 
            
            if (myPos.length>0){
                cntrCrd.lat/=myPos.length
                cntrCrd.lng/=myPos.length
                localStorage.setItem("centerPos",JSON.stringify(cntrCrd))
                localStorage.setItem("positions",JSON.stringify(arrCrdPos))
            }
            

        }catch(e){
            console.log("Error READ POSITIONS!!!",e);
        }
    }


    React.useEffect(() =>{           
        readPositionsFromServer()        
        timeout.current = setInterval(async ()=>{
            readPositionsFromServer()            
        },30000);
        return ()=> clearInterval(timeout.current)    
    },[])

    React.useEffect(() =>{           
        readPositionsFromServer();
    },[])
    
    return (        
        <>         
        <FeatureGroup>
            {positions}      
        </FeatureGroup>         
        </>
    )

}
