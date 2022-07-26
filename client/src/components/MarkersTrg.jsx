import React, {useState, useContext,  useRef, useEffect} from 'react'
import L, { Point } from 'leaflet'
import { useHttp } from "../hooks/http.hooks";
import { GlobalContext } from '../context/GlobalContext';
import { TargetContext } from "../context/TargetContext";
import {FeatureGroup,  Marker, Tooltip, Polyline, Circle} from 'react-leaflet'
import "leaflet-rotatedmarker";
import flyIcons from './flyIcons';

const posCrd = JSON.parse(localStorage.getItem("positions"))

const MarkersTrg = (props) =>{        
    const [markers, setMarkers] = useState([])
    const [mosquites, setMosquites] = useState([])
    const [lines, setLines] = useState([])
    const [currInfo, setCurrInfo] = useState()
    const [currKey, setCurrKey] = useState(-1)   
    const ctxt = useContext(GlobalContext)
    const timeoutContext = useRef(null)
    const timeoutRecalc = useRef(null)
    
    const { request} = useHttp();

    const trg = useContext(TargetContext)
   

    const  {mediumAdsb, mediumMlat, 
        smallMlat, smallAdsb, 
        largeMlat,  largeAdsb,
        triangleMlat, triangleAdsb, 
        rotorAdsb, rotorMlat, 
        flyIconNone, mosquteIcon} = flyIcons() 

    const nDt = new Date().getTime()

    const markerRefs = useRef([])

    const findMarkerIndex =  (key)=>{        
        const indx = markers.map(mrk=>mrk.key).indexOf(key)        
        if (markers[indx]){
          //  console.log("MARKERS: find ",key,markers[indx], markers[indx].props.position) 
            const arrLines = []               
         
            setCurrInfo(markers[indx].props)
            const c_crd=[ markers[indx].props.position[0],markers[indx].props.position[1]]
            //lines
            const listStG = markers[indx].props.prop['visible-stations'].split(',')
            const listStE = markers[indx].props.prop['error-stations'].split(',')                     
           // console.log(listStG,listStE)
            if ( ctxt.showLines){
                if (listStG.length>0){                
                    const linesCrd = listStG.map(i=>{
                        if (i!=='')
                            return [posCrd[i] , c_crd]
                    })                        
                    arrLines.push(<Polyline key={'gdLines'} pathOptions={{ weight:1, color: 'blue' }} positions={linesCrd} />)
                }
                if (listStE.length>0){                
                    const linesCrd = listStE.map(i=>{                    
                        if (i!==''){                       
                            return [posCrd[i] , c_crd]
                        }                            
                    })                
                    if (linesCrd[0])           
                        arrLines.push(<Polyline key={'bdLines'} pathOptions={{ weight:1, color: 'red' }} positions={linesCrd} />)
                }
            }
            
            if (arrLines)
                setLines(arrLines) 
            else           
                setLines([]) 
                
        }  
        else{            
            if (currKey!=-1){
                clearKey()
                setCurrInfo()
            }
            
        }            
    }  

    const handleClick = (key,e)=>{      
        setCurrKey(key)       
    }

    const Markers = ()=>{
        return (
            <FeatureGroup>                
                {markers}
                {lines}
                {mosquites}
            </FeatureGroup>            
        )
    }

    const selectIcon = (mode)=>{
        let icon = flyIconNone
        if (mode.mode ==='adsb' && ctxt.showADSB){
            switch (mode.type) {
                case "medium":
                    icon = mediumAdsb
                    break;
                case "heavy":
                    icon = largeAdsb
                    break;
                case "light":
                    icon = smallAdsb
                    break;
                case "rotorcraft":
                    icon = rotorAdsb
                    break;
                default:
                    icon = triangleAdsb
                    break;
            }
        
            if (mode.heading==='nan' && mode['mode-a']==='0000')   
                icon = triangleAdsb
        }        
        if (mode.mode === 'mlat' && ctxt.showMLAT){

            switch (mode.type) {
                case "medium":
                    icon = mediumMlat
                    break;
                case "heavy":
                    icon = largeMlat
                    break;
                case "light":
                    icon = smallMlat
                    break;
                case "rotorcraft":
                    icon = rotorMlat
                    break;                    
                default:
                    icon = triangleMlat
                    break;
            }   
            // if (mode.heading==='nan' && mode[mode-a]==='0000')   
            //     icon = triangleMlat        
        }        
       //console.log(mode.icao, mode.mode, mode.type, mode.heading ,mode.heading==='nan')
        return icon
    }    

    const parseData = (dataP) =>{       
     //  console.log("parseData",dataP, markerRefs)
        const arrTrg=[]
        const lTime =  new Date().getTime()/1000
        markerRefs.current.length = 0;

        for (let i=0;i<dataP.length;i++){
            const data = dataP[i]                       
            const cIicon = selectIcon(data.prop)
            arrTrg.push(<Marker                       
                rotationAngle={data.prop.heading}
                rotationOrigin="center" 
                key = {data.key}   
                ref = {ref=>markerRefs.current.push(ref)}                            
                eventHandlers={{
                    mousedown: (e)=>handleClick(data.key,e)
                }}
                lTime = {lTime}
                lKey = {data.key}
                prop = {data.prop}
                icon={cIicon}               
                position={data.pos}
                pos_shift={data.pos_shift}
            >
                <Tooltip direction="top">
                    {data.prop.icao.toUpperCase()+" "+
                    data.prop.name}
                </Tooltip>
            </Marker>
            )            
        }       
        setMarkers(arrTrg)        
    }

    const parseMosquiteData = (res) =>{       
          // console.log("parseMosquite Data",data, data.length)
           const arrTrg=[]

         //  console.log(res.data)
   
           for (let i=0;i<res.data.length;i++){
               const dat = res.data[i]                 
               const plots = res.plots[i]
               arrTrg.push(<Marker                                          
                   key = {dat.icao}                   
                   lTime = {dat.time}
                   lIcao = {dat.icao} 
                   lAlt = {dat.alt}                  
                   icon={mosquteIcon}               
                   position={L.latLng(dat.lat, dat.lng)} 
               >
                   <Tooltip direction="top">
                       {dat.icao.toUpperCase()+" ("+
                       dat.alt+")"}
                   </Tooltip>
               </Marker>
               )    
               //console.log(i, plots)  
               const oldCrd=[]    
                for (let j=0;j<plots.length;j++){
                    if (oldCrd.includes(plots[j]))
                        continue;
                    oldCrd.push(plots[j])
                    arrTrg.push(<Circle 
                        key={"plt"+j}
                        center={plots[j]} 
                        radius={1} 
                    />
                    )
               } 
           }              
           setMosquites(arrTrg)                   
    }

    const clearKey = ()=>{
      //  console.log("ClearKey!!")
        setCurrKey(-1)
        setLines([])
    }

    const clearKeyAndLines = ()=>{
       // console.log("ClearKeyAndLines!!")
        setCurrKey(-1)
        setLines([])
    }

    const readContextFromServer = async ()=>{
        try{ 
            const response = await request('/mlat/current','GET',null,{
                Authorization: `Bearer ${ctxt.token}`
            });                                           
            if (response) 
                if (response.data)                
                    parseData(response.data);                       
            
        }catch(e){
            console.log("Error CURRENT ==> ",e);
            if (String(e).includes('401') || String(e).includes('SyntaxError')) 
            {
                console.log("Send logout!!");
                ctxt.logout();
            }                
        }

        //Mosquite

        try{             
            const response = await request('/mosquite/current','GET',null,{
                Authorization: `Bearer ${ctxt.token}`
            });                                           
           
            if (response) 
                if (response.data)    {
                    parseMosquiteData(response);                       
                    //console.log("MOSQUTE RES = ",response)
                }            
                    
            
        }catch(e){
            console.log("Error CURRENT MOSQUTE ==> ",e);
            if (String(e).includes('401') || String(e).includes('SyntaxError')) 
            {
                console.log("Send logout!!");
                ctxt.logout();
            }                
        }
    }

    useEffect(()=>{
        //console.log("CHANGE LIST KEY = ",trg.key, markers)        
        const resM = markers.filter((m,i) =>(m.key.toUpperCase().includes(trg.key)))

        if (resM.length>0)
            if (resM[0].props){
                //console.log("RESULT = ",resM[0].props.position)
                trg.flyTo=resM[0].props.position
            }
    },[trg.key])
    
    useEffect(() =>{    
       // console.log("Update Markers CurrKey")  
        findMarkerIndex(currKey)                       
        timeoutContext.current = setInterval(()=>{                  
                readContextFromServer()                                  
        },1000);
        return ()=> clearInterval(timeoutContext.current)    
    },[markers, currKey])   

    // useEffect(() =>{            
    //      timeoutRecalc.current = setInterval(()=>{                  
    //             //recalc()
    //      },200);
    //      return ()=> clearInterval(timeoutRecalc.current)    
    //  },[markers])   
    
    useEffect(() =>{           
        readContextFromServer()    
    },[])   

    return {Markers,mosquites, currInfo, clearKey, clearKeyAndLines}
}

export default MarkersTrg