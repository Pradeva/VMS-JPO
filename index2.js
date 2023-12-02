// const axios = require('axios');

// axios.get('http://10.200.0.173:8000/hello/apel lebih dari tiga').then(resp => {

//     console.log(resp.data);
// });

const axios = require('axios');
const path = require('path');
const os = require('os');
const fs = require('fs');


const loginData = new URLSearchParams();
loginData.append('username', 'admin');
loginData.append('password', 'pass');
loginData.append('grant_type', 'password');

let token

function login(){
  axios.post('http://10.168.1.69:28080/account/auth/login', loginData, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  })
  .then(response => {
    console.log('Login response:', response.data);
    // console.log(response.data.access_token)
    token = response.data.access_token
    main(token)
  })
  .catch(error => {
    console.error('Error in login request:', error);
  });

}

async function fetchDataFromAPI(token) {
  try {
    const resp = await axios.get('http://10.168.1.69:28080/master/api/vms/list', {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (resp.data.code === "200 OK") {
      console.log("Code is 200 OK");
      return resp.data.data;
    } else {
      console.log("Code is not 200 OK");
    }
  } catch (error) {
    console.error("Error in the request:", error);
  }
}

async function main(token) {
  try {
    const hasil = await fetchDataFromAPI(token);

    const liveConfig = {
        codecString: 'video/mp4; codecs="avc1.64001f"',
        streamConfig: {
          an: '',
          vcodec: 'copy',
          f: 'mp4',
          movflags: '+frag_keyframe+empty_moov+default_base_moof',
          reset_timestamps: '1'
        }
    };

    const inputConfig = {
        use_wallclock_as_timestamps: '1',
        fflags: '+igndts',
        analyzeduration: '1000000',
        probesize: '1000000',
        rtsp_transport: 'tcp',
        stimeout: '30000000'
    };

    const resultObjects = {};

    hasil.forEach(cam => {
        let record
        let live

        if (cam.vmsLive === "Y") {
            live = true
        }else{
            live = false
        }

        if (cam.vmsRecording === "Y") {
            record = true
        }else{
            record = false
        }

        const camConfig = {
            path : cam.camId,
            name : cam.detailCamera.name,
            floor : cam.siteId,
            inputConfig : inputConfig,
            input : cam.detailCamera.url,
            continuous: record,
            live : live,
            liveConfig : liveConfig
        }
        resultObjects[cam.camId] = camConfig;
    });

    const configFile = path.join(os.homedir(), 'nvrjs-test.config.js');
    let config = require(`${configFile}`);

    config.cameras = resultObjects

    console.log(resultObjects)

    const jsonString = JSON.stringify(config, null, 4);

    fs.writeFileSync(configFile, `module.exports = ${jsonString};`, 'utf-8');



  } catch (error) {
    console.error("Error in main:", error);
  }

}

login()