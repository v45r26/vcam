'use strict';


let mediaRecorder;
let recordedBlobs;

const output_screen = document.querySelector('#output_screen'),
      start_cam = document.querySelector('#start'),
      errorMsgbox = document.querySelector('.errorMsg_box'),
      errorMsgElement = document.querySelector('#errorMsg'),
      start_rec_btn = document.querySelector('#rec_start'),
      stop_rec_btn = document.querySelector('#rec_pause'),
      play_btn = document.querySelector('#play_vid'),
      download_btn = document.querySelector('#download_vid');


start_rec_btn.disabled = true;
stop_rec_btn.disabled = true;
play_btn.disabled = true;
download_btn.disabled = true;

// record Video
start_rec_btn.addEventListener('click', () => {
    output_screen.play();
    startRecording();
    errorMsgElement.innerHTML = `Recording Started!`;
    errorMsgbox.style.display = 'block';
});

stop_rec_btn.addEventListener('click', () => 
{  
    output_screen.pause();
    stopRecording();
    errorMsgElement.innerHTML = `Recording Stopped. Video Recorded Successfully!`;
    errorMsgbox.style.display = 'block';
});

play_btn.addEventListener('click', () => {
    const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
    output_screen.src = null;
    output_screen.srcObject = null;
    output_screen.src = window.URL.createObjectURL(superBuffer);
    output_screen.controls = true;
    output_screen.play();
    errorMsgElement.innerHTML = `Video in Preview!`;
    errorMsgbox.style.display = 'block';
});

download_btn.addEventListener('click', () => {

    const file_name_input = document.querySelector('#file_name_input').value;
    if (file_name_input == '') 
    {
        file_name_input.focus();
        errorMsgElement.innerHTML = `Write a File Name!`;
        errorMsgbox.style.display = 'block';
    }
    else
    {
        const blob = new Blob(recordedBlobs, {type: 'video/mp4'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = file_name_input+'.mp4';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        }, 100);
        errorMsgElement.innerHTML = `Downloading...!`;
        errorMsgbox.style.display = 'block';
    }
});

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}
// live camera view
function handleSuccess(stream) 
{
    // start_rec_btn.disabled = false;
    console.log('getUserMedia() got stream:', stream);
    window.stream = stream;
    output_screen.srcObject = stream;
}

function startRecording() {
    recordedBlobs = [];
    let options = {mimeType: 'video/webm;codecs=vp9,opus'};
    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } 
    catch (e) 
    {
        // console.error('Exception while creating MediaRecorder:', e);
        errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
        errorMsgbox.style.display = 'block';
        return;
    }

    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    stop_rec_btn.disabled = false;
    // play_btn.disabled = true;
    // download_btn.disabled = false;
    mediaRecorder.onstop = (event) => 
    {
        console.log('Recorder stopped: ', event);
        console.log('Recorded Blobs: ', recordedBlobs);
    }
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
    mediaRecorder.stop();
    rec_start.disabled = true;
    play_btn.disabled = false;
    download_btn.disabled = false;
}


// getting permition to user
async function init(constraints) 
{
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: "screen"}},constraints
        );
        // const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
        start_rec_btn.disabled = false;
    } 
    catch (e) {
        //it will through Permission denied error in console
        // console.error('navigator.getUserMedia error:', e); 
        //it will through Permission denied error in webpage
        // errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
        errorMsgElement.innerHTML = `${e.toString()}`;
        errorMsgbox.style.display = 'block';
    }
}

start_cam.addEventListener('click', 
    async () => 
    {
        const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
        const hasNoiseSuppression = document.querySelector('#noiseSuppression').checked;
        const constraints = { 
            audio: 
            {
                echoCancellation: {exact: hasEchoCancellation},
                noiseSuppression: {exact: hasNoiseSuppression}
            }
        };
        console.log('Using media constraints:', constraints);
        await init(constraints);
    }
);

document.querySelector('#download_form').onsubmit = (e)=>
{
    e.preventDefault();// prevent from form submitting
}
// window.onload = ()=>
// {
//     async () => 
//     {
//         const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
//         const hasNoiseSuppression = document.querySelector('#noiseSuppression').checked;
//         const constraints = { 
//             audio: 
//             {
//                 echoCancellation: {exact: hasEchoCancellation}
//                 noiseSuppression: {exact: hasNoiseSuppression}
//                     },
//             video: {width: 1280, height: 720}
//         };
//         console.log('Using media constraints:', constraints);
//         await init(constraints);
//     }
// }


/*

'use strict';

let mediaRecorder;
let recordedBlobs;

const errorMsgElement = document.querySelector('span#errorMsg');
const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button#record');
const playButton = document.querySelector('button#play');
const downloadBurecordButton.addEventListener('click', () => {
  if (recordButton.textContent === 'Record') {
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = 'Record';
    playButton.disabled = false;
    downloadButton.disabled = false;
  }
});tton = document.querySelector('button#download');





playButton.addEventListener('click', () => {
  const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
  recordedVideo.src = null;
  recordedVideo.srcObject = null;
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
  recordedVideo.controls = true;
  recordedVideo.play();
});


downloadButton.addEventListener('click', () => {
  const blob = new Blob(recordedBlobs, {type: 'video/mp4'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.mp4';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  recordedBlobs = [];
  let options = {mimeType: 'video/webm;codecs=vp9,opus'};
  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.textContent = 'Stop Recording';
  playButton.disabled = true;
  downloadButton.disabled = true;
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;

  const gumVideo = document.querySelector('video#gum');
  gumVideo.srcObject = stream;
}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error('navigator.getUserMedia error:', e);
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

document.querySelector('button#start').addEventListener('click', async () => {
  const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
  const constraints = {
    audio: {
      echoCancellation: {exact: hasEchoCancellation}
    },
    video: {
      width: 1280, height: 720
    }
  };
  console.log('Using media constraints:', constraints);
  await init(constraints);
});

*/