const APP_ID = '';
const CHANNEL = sessionStorage.getItem('room');
const TOKEN = sessionStorage.getItem('token');
let UID = Number(sessionStorage.getItem('UID'));
let NAME = sessionStorage.getItem('name');
// console.log('Stream.js Connected');

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

let localTracks = [];
let remoteUsers = {};

let joinAndDisplayLocalStream = async () => {

    document.getElementById('room-name').innerText = CHANNEL;
    // whenever a user publishes a track, this event will be triggered
    client.on('user-published', handleUserJoined);
    
    // whenever a user leaves the channel, this event will be triggered
    client.on('user-left', handleUserLeft);
    
    try {
        // join a channel
        await client.join(APP_ID, CHANNEL, TOKEN, UID);
    } catch (error) {
        console.error('Error joining channel: ', error);
        window.open('/lobby/', '_self');
    }
    // get audio and video tracks
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    
    let member = await createMember();
    // create a player to display the local video track
    let player = `<div class="video-container" id="user-container-${UID}">
            <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
            <div class="video-player" id="user-${UID}"></div>
        </div>`;

    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);
    
    // play the local video track
    localTracks[1].play(`user-${UID}`);

    // localTracks[0]= audio track; // localTracks[1]= video track
    // publish the tracks so that other users can subscribe to them
    await client.publish(localTracks);
};
// handle the user joined event
let handleUserJoined = async (user, mediaType) => {
    // add user to the remoteUsers object
    remoteUsers[user.uid] = user;
    
    await client.subscribe(user, mediaType);
    
    if (mediaType === 'video') {
        // create a player to display the remote video track
        let player = document.getElementById(`user-container-${user.uid}`);
        if(player != null){
            player.remove();
        }

        let member = await getMember(user);
        // create a player to display the local video track
        player = `<div class="video-container" id="user-container-${user.uid}">
            <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
            <div class="video-player" id="user-${user.uid}"></div>
        </div>`;

        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);
        
        user.videoTrack.play(`user-${user.uid}`);
    }
    
    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
};

// handle the user left event
let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid];
    document.getElementById(`user-container-${user.uid}`).remove();
};

let leaveAndRemoveLocalStream = async () => {
    for (let i = 0; i < localTracks.length; i++) {
        localTracks[i].stop();
        localTracks[i].close();
    }
    await client.leave();
    deleteMember();
    window.open('/lobby/', '_self');
};

let toggleCamera = async (e) => {
    // if the camera is off
    if (localTracks[1].muted) {
        await localTracks[1].setMuted(false);
        e.target.style.backgroundColor = '#fff';
    }
    else {
        await localTracks[1].setMuted(true);
        e.target.style.backgroundColor = '#f00';
    }
};

let toggleMic = async (e) => {
    // if the camera is off
    if (localTracks[0].muted) {
        await localTracks[0].setMuted(false);
        e.target.style.backgroundColor = '#fff';
    }
    else {
        await localTracks[0].setMuted(true);
        e.target.style.backgroundColor = '#f00';
    }
};

let createMember = async () => {
    const response = await fetch('/create_member/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: NAME,
            UID: UID,
            room_name: CHANNEL,
        }),
    });
    let member = await response.json();
    return member;
};
let deleteMember = async () => {
    const response = await fetch('/delete_member/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: NAME,
            UID: UID,
            room_name: CHANNEL,
        }),
    });
    let member = await response.json();
};

let getMember = async (user) =>{
    console.log("Get : " +user)
    let response = await fetch(`/get_member/?UID=${user.uid}&room_name=${CHANNEL}`);
    let member = response.json();
    return member;
}
joinAndDisplayLocalStream ();

// if user close the browser or tab, leave the channel
window.addEventListener('beforeunload', deleteMember);

document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream);
document.getElementById('camera-btn').addEventListener('click', toggleCamera);
document.getElementById('mic-btn').addEventListener('click', toggleMic);
