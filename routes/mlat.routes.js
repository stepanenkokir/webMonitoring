const {Router} = require('express');
const router = Router();
const config = require('config');
const curl = require('curlrequest');
const auth = require('../middleware/auth.middleware')


const listRecv = {
    url: config.get('dbConfig').HOST+":"+config.get('dbConfig').PORT+"/mlat/status",  
    method: 'GET'
  };

  const statusRecv = {
    url: config.get('dbConfig').HOST+":"+config.get('dbConfig').PORT+"/mlat/block_status.json",   
    method: 'GET'
  };

  const loadPositionsUrl = {
    url: config.get('dbConfig').HOST+":"+config.get('dbConfig').PORT+"/mlat/stations.geojson",    
    method: 'GET'
  };

  const loadCurrentUrl = {
    url: config.get('dbConfig').HOST+":"+config.get('dbConfig').PORT+"/mlat/tracks/current.geojson",    
    method: 'GET'
  };
  
  const loadTracksUrl = {
    url: config.get('dbConfig').HOST+":"+config.get('dbConfig').PORT+"/mlat/tracks.json",
    method: 'GET'
  };
  


  const status = {data:null, error:false}
  const positions = {data:null}
  const current = {data:null}
  const tracks = {data:null}

  const infoREC = {
      dataStatus:null, 
      errorStatus:false,
      dataRec:null, 
      errorRec:false,
    }

const loadStatus = async ()=>{   
    try { 
       // console.log("LOAD STATUS")                  
         curl.request(listRecv, (err, stdout)=>{
            infoREC.errorStatus = !!err            
            infoREC.dataStatus = JSON.parse(stdout)
       })

        curl.request(statusRecv, (err, stdout)=>{
        infoREC.errorRec = !!err            
        infoREC.dataRec = JSON.parse(stdout)
    })
    } catch (error) {
        console.log('Ошибка загрузки CURL. Попробуйте позже.',error);        
    } 
}

const loadPositions = async ()=>{
    try {           
        curl.request(loadPositionsUrl, (err, stdout)=>{                                                    
            positions.data = JSON.parse(stdout)
       })      
    }
    catch (error) {
        console.log('Ошибка загрузки POSITIONS. Попробуйте позже.',error);        
    } 
}


const loadCurrent = async ()=>{
    try {           
        //console.log("LOAD CURRENT",loadCurrentUrl)        
        curl.request(loadCurrentUrl, (err, stdout)=>{                     
            current.data = JSON.parse(stdout)            
       })
    }
    catch (error) {
        console.log('Ошибка загрузки обстановки. Попробуйте позже.',error);        
    } 



    try {           
        // console.log("LOAD Tracks")        
         await curl.request(loadTracksUrl, (err, stdout)=>{                     
             tracks.data = JSON.parse(stdout)            
        })
     }
     catch (error) {
         console.log('Ошибка загрузки трекоы. Попробуйте позже.',error);        
     } 
}

const asyncLoader = async ()=>{
    await loadStatus();
       
    if (infoREC.dataRec && infoREC.dataStatus){
        
        const nms = infoREC.dataStatus.general.station_names;
        const sts = infoREC.dataStatus.component_status.components;
        const spbPRM = infoREC.dataRec.prm;        
        const tmskPRM = infoREC.dataRec.tomsk;

        let arr=[];
        for (let i=0;i<nms.length;i++){
           arr.push({
               id:sts[i].cid,
               name:nms[i].name,
               err:sts[i].error,
               st:sts[i].state,
               delay:0,
               gps:0,               
           })
        }

        for (let i=0;i<spbPRM.length;i++){
            
            const indx = spbPRM[i].st;
            arr[indx].delay = spbPRM[i].delay;
            arr[indx].gps = spbPRM[i].fix==='on'?"fix":"Error";
        }

        for (let i=0;i<tmskPRM.length;i++){
            const indx = tmskPRM[i].st;
            arr[indx].delay = tmskPRM[i].delay;
            arr[indx].gps = tmskPRM[i].gnss_quality;
        } 
        
        
        if (arr){
            status.data=arr;
            status.error=false
        }       
    }
    else
        status.error=true
}

const statusTimer = ()=>{
    const st_tmr = setInterval(async ()=>{                   
        await asyncLoader();
    },10000);
    return ()=> clearInterval(st_tmr)
}

const currentTimer = ()=>{
    const cr_tmr = setInterval(async ()=>{                   
        await loadCurrent();        
    },5000);
    return ()=> clearInterval(cr_tmr)
}

statusTimer()
loadPositions()
currentTimer()



 router.get('/recv', auth, async (req, res) =>{       
        res.status(200).json(status);    
 })


 router.get('/positions',  async (req, res) =>{       
        res.status(200).json(positions);    
 })

 router.get('/current',  auth,(req, res) =>{      
        res.status(200).json(current);
 })

 router.get('/list',  auth,(req, res) =>{        
    res.status(200).json(tracks);
})

module.exports = router;