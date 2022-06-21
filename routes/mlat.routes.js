const {Router} = require('express');
const router = Router();
const config = require('config');
const curl = require('curlrequest');
const auth = require('../middleware/auth.middleware')

const period = config.get('periodSelectCrd')

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
  const current_old = []
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

const findIndex = (key)=>{

}

const loadCurrent = async ()=>{
    try {           
        //console.log("LOAD CURRENT",loadCurrentUrl)        
        curl.request(loadCurrentUrl, (err, stdout)=>{                     
            const c_data = JSON.parse(stdout)  
            // const n_data = [];

            if (c_data)
                if (c_data.features){
                    //console.log("current",c_data.features.length)
                    const arr_c = []                    
                    for (let i=0;i<c_data.features.length;i++){
                        const dt = c_data.features[i]
                        const key = dt.properties.mode+dt.properties.icao+dt.properties.name
                        const pos = [dt.geometry.coordinates[1],dt.geometry.coordinates[0],dt.geometry.coordinates[2]]
                        let indx = -1
                        const pos_shift = {dLat:0, dLon:0, dAlt:0}
                        indx = current_old.map(c=>c.key).indexOf(key)
                        //console.log(i,key, pos,current_old,indx)
                        if (indx>-1){
                            pos_shift.dLat = (pos[0]-current_old[indx].pos[0])/period
                            pos_shift.dLon = (pos[1]-current_old[indx].pos[1])/period
                            pos_shift.dAlt = (pos[2]-current_old[indx].pos[2])/period
                        }
                            
                        arr_c.push({key:key, pos:pos, pos_shift:pos_shift, prop:dt.properties})
                    }
                    current_old.length=0
                    current_old.push(...arr_c)
                }                        
            // current.data = n_data
            
            current.data =  current_old  
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
         console.log('Ошибка загрузки треков. Попробуйте позже.',error);        
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
    asyncLoader();
    const st_tmr = setInterval(async ()=>{                   
        await asyncLoader();
    },10000);
    return ()=> clearInterval(st_tmr)
}

const currentTimer = ()=>{
    loadCurrent()
    const cr_tmr = setInterval(async ()=>{                   
        await loadCurrent();        
    },period*1000);
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