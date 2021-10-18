'use strict';


var img = document.querySelector('img') || document.createElement('img');
const hasta = document.querySelector('h1#hasta').innerHTML;
let recordedBlobs = [];
let recordedBlobs2 = [];
let mediaRecorder;
let mediaRecorder2;
let camera1stream;
let camera2stream;
let stream;


const videoButton1 = document.querySelector('video#camera1');
const videoButton2 = document.querySelector('video#camera2');

const cleanUp = (whichCamera) => {
    try{
        stream = camera.srcObject;
        const tracks = stream.getTracks();
        tracks.array.forEach(element => {
            tracks.stop();
        });
    }catch(err){}
}
cleanUp(camera1);
cleanUp(camera2);



let myVideoInputs = [];

async function doGetDevicesInfo() {
    await navigator.mediaDevices.enumerateDevices().
    then(results => {
        results.forEach(result => {
            if(result.kind === 'videoinput'){
                console.log(result);
                myVideoInputs.push(result);
            }
        })
    }).catch(err => {
        console.log(err);
    });

    myVideoInputs.forEach(element => {
        if (element === '') {console.log("null")};
    });

    console.log(myVideoInputs);
}


// const doGetDevicesInfo = async () => {
//     await navigator.mediaDevices.enumerateDevices().
//     then(results => {
//         results.forEach(result => {
//             if(result.kid === 'videoinput'){
//                 console.log(result);
//                 myVideoInputs.push(result);
//             }
//         })
//     }).catch(err => {
//         console.log(err);
//     });
// }

const startCamera = async (myVideoInput, whichCamera) => {
   
    if (myVideoInput === undefined) { console.log('myVideoInput id undefined'); return; }
    
    await navigator.mediaDevices.getUserMedia({
        video:{
            width:1260,
            height:780,
            deviceId:myVideoInput.deviceId
        }
    })
    .then(streamm => {
        whichCamera.srcObject = streamm;
        if ( myVideoInputs[0]===myVideoInput) {
            camera1stream = whichCamera.srcObject;
        }
        else if(myVideoInputs[1]===myVideoInput){
            camera2stream = whichCamera.srcObject;
        }
    })
    .catch(err => {
        console.log(err);
    });
    
}

const doStartCamera = (button) => {
    const id = button.id;
    switch(id){
        case 'startCamera1':
            startCamera(myVideoInputs[0], camera1);
            const recordButton1 = document.querySelector('button#startRecord1');
            recordButton1.disabled = false;
            videoButton1.style.display = 'block';
            videoButton2.style.display = 'none';
            break;
        case 'startCamera2':
            startCamera(myVideoInputs[1], camera2);
            const recordButton2 = document.querySelector('button#startRecord2');
            recordButton2.disabled = false;
            videoButton1.style.display = 'none';
            videoButton2.style.display = 'block';
            break;

    }
}

const doCaptureSnapShot = (button) => {
    const id = button.id;
    switch(id){
        case 'capture1':
            captureImage(camera1,canvas1);
            break;
        case 'capture2':
            captureImage(camera2,canvas2);
            break;
    }
}

const captureImage = (camera,canvas) => {
    canvas.width = 780; canvas.height = 600;
    canvas.getContext('2d').drawImage(camera, 0, 0, 780, 600,);
    downloadCapture(canvas);
}


const downloadCapture = (canvas) => {
    var zz = img.src = canvas.toDataURL('image/png');
    img.style.display = 'none';
    document.body.appendChild(img);   
    const url = zz;
    const a = document.createElement('a');
    a.style.display='none';
    a.href = url;
    a.download = 'test.png';
    document.body.appendChild(a);
    a.click();
    setTimeout(()=> {
        console.log('buradayım');
        document.body.removeChild(img);
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },100);
}


const doStartRecord = async (button) => {
    const id = button.id;
    switch(id){
        case 'startRecord1':
            if (button.textContent === "Record 1") {
                button.textContent = "Stop Recording 1";
                startRecording1();
                
                
            }
            else{
                button.textContent = "Record 1";
                stopRecording1();
                
               
            }
            break;
            
        case 'startRecord2':
            if (button.textContent === "Record 2") {
                button.textContent = "Stop Recording 2";
                startRecording2();
                
                
            }
            else{
                button.textContent = "Record 2";
                stopRecording2();
                
            }
            break;
            }
            
}



async function startRecording1() {
    let options = {mimeType: 'video/webm;codecs=vp9,opus'};
    recordedBlobs = [];
    
    try {
        mediaRecorder = new MediaRecorder(camera1stream, options);
        console.log(typeof(mediaRecorder));
        } catch (e) {
          console.error('Exception while creating MediaRecorder:', e);
          return;
        }
  
    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    mediaRecorder.onstop = (event) => {
      console.log('Recorder stopped: ', event);
      console.log('Recorded Blobs: ', recordedBlobs);
    };
    mediaRecorder.ondataavailable = handleDataAvailable1;
    mediaRecorder.start();
    console.log('MediaRecorder started', mediaRecorder);
  }


async function handleDataAvailable1(event) {
    
    if(event.data && event.data.size > 0){
        await recordedBlobs.push(event.data);
        downloadVideo();
    }
    
}

async function stopRecording1() {
    await mediaRecorder.stop();
    
}



async function startRecording2() {
    let options = {mimeType: 'video/webm;codecs=vp9,opus'};
    recordedBlobs2 = [];
    
    try {
        mediaRecorder2 = new MediaRecorder(camera2stream, options);
    } catch (e) {
            console.error('Exception while creating MediaRecorder:', e);
            return;
        }

    console.log('Created MediaRecorder', mediaRecorder2, 'with options', options);
    mediaRecorder2.onstop = (event) => {
      console.log('Recorder stopped: ', event);
      console.log('Recorded Blobs: ', recordedBlobs2);
    };
    mediaRecorder2.ondataavailable = handleDataAvailable2;
    mediaRecorder2.start();
    console.log('MediaRecorder started', mediaRecorder2);
  }


async function handleDataAvailable2(event) {
    
    if(event.data && event.data.size > 0){
        await recordedBlobs2.push(event.data);
        downloadVideo2();
    }
    
}

async function stopRecording2() {
    await mediaRecorder2.stop();
    
}






const downloadVideo = async () => {
    const blob = new Blob(recordedBlobs, {type: 'video/webm'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${hasta}.webm`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
    console.log("Bitti");
}


const downloadVideo2 = async () => {
    const blob = new Blob(recordedBlobs2, {type: 'video/webm'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${hasta}.webm`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
    console.log("Bitti");
}

