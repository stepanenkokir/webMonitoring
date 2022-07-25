const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth.middleware')

const dgram = require('dgram')
const server = dgram.createSocket('udp4');

const current = {data:[]}

server.on('error', (err) => {
    console.log(`MOSQUITE server error:\n${err.stack}`);
    server.close();
  });


const updateCurrent = (data)=>{    
    for (let i=0;i<current.data.length;i++){
        //console.log (i, current.data[i], nTm.getHours())
        if (current.data[i].icao == data.icao){
            current.data[i] = data            
            return
        }        
    }
    current.data.push(data)
}

server.on('message', (msg, rinfo) => {
    //console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

    const lMsg = String(msg).split(',');
    //console.log("server got: ",lMsg, +lMsg[1], +lMsg[1], +lMsg[3], +lMsg[0]);
    const data = {
        icao:lMsg[0],
        lat:+lMsg[1],
        lng:+lMsg[2],
        alt:+lMsg[3],
        time:lMsg[4]
    }
    updateCurrent(data)
});
  
server.on('listening', () => {
    const address = server.address();
    console.log(`MOSQUITE server listening ${address.address}:${address.port}`);
});
  

const loadCurrent = ()=>{
   // console.log("LoadCurr!!", current.data);
    const nTm = Math.floor(new Date().getTime()/1000)%86400
    for (let i=0;i<current.data.length;i++){
        const cTm = current.data[i].time.split(":")
        const ctmD =  Number(cTm[0])*60*60 + Number(cTm[1])*60 + Number(cTm[2])
        if (nTm-ctmD > 5){
            current.data.splice(i)        
        }
        
    }
    
}

const currentTimer = ()=>{
  loadCurrent()
  const cr_tmr = setInterval(async ()=>{                   
      loadCurrent();        
  },1000);
  return ()=> clearInterval(cr_tmr)
}


server.bind(41234);
currentTimer()

router.get('/current', auth, async (req, res) =>{       
        res.status(200).json(current);    
 })

module.exports = router;