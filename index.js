// // const request = require('request');
// const axios = require('axios');
// const path = require('path');
// const os = require('os');
// const fs = require('fs');
// const CronJob = require('node-cron');

// console.log(1)

// function fetchDataFromAPI() {
//   return new Promise((resolve, reject) => {
//     const apiAllCam = 'http://202.180.16.237:28080/master/api/vms/list';
//     console.log(3)
//     request(apiAllCam, (error, response, body) => {
//         console.log(4)
//       if (!error && response.statusCode === 200) {
//         const cameraFromApi = JSON.parse(body);
//         const data = cameraFromApi.data.filter(camera => camera.url !== null);
//         resolve(data);
//       } else {
//         reject(error);
//       }
//     });
//   });
// }

// let i = 0
// function runMainProg() {
//   fetchDataFromAPI()
//     .then(camerasData => {
        
//       const liveConfig = {
//           codecString: 'video/mp4; codecs="avc1.64001f"',
//           streamConfig: {
//             an: '',
//             vcodec: 'copy',
//             f: 'mp4',
//             movflags: '+frag_keyframe+empty_moov+default_base_moof',
//             reset_timestamps: '1'
//           }
//       };

//       const inputConfig = {
//           use_wallclock_as_timestamps: '1',
//           fflags: '+igndts',
//           analyzeduration: '1000000',
//           probesize: '1000000',
//           rtsp_transport: 'tcp',
//           stimeout: '30000000'
//       };

//       const resultObjects = {};

//       Object.keys(camerasData).forEach(key =>{

//           let record = false;
//           let live = false;

//           if (camerasData[key].vmsLive == 'Y') {
//             live = true;
//           }

//           if (camerasData[key].vmsRecording == 'Y') {
//             record = true;
//           }

//           const camConfig = {
//               path : camerasData[key].camId,
//               name : camerasData[key].detailCamera.name,
//               floor : camerasData[key].siteId,
//               inputConfig : inputConfig,
//               input : camerasData[key].detailCamera.url,
//               continuous: record,
//               live : live,
//               liveConfig : liveConfig
//           }

//           resultObjects[camerasData[key].camId] = camConfig;
          
//       })

//       console.log(resultObjects);
//       console.log(i)
//       i++

//       const configFile = path.join(os.homedir(), 'nvrjs.config.js');
//       let config = require(`${configFile}`);

//       config.cameras = resultObjects

//       const jsonString = JSON.stringify(config, null, 4);

//       fs.writeFileSync(configFile, `module.exports = ${jsonString};`, 'utf-8');

//     })
//     .catch(error => {
//       console.error(error);
//     });

// }

// console.log(2)


// runMainProg()

// // CronJob.schedule('* * * * *', runMainProg);

const axios = require('axios');


axios.get('http://202.180.16.237:28080/master/api/vms/list').then(resp => {

    console.log(resp.data);
});
