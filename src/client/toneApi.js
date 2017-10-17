import Tone from 'tone';

let synth = new Tone.Synth().toMaster();

export function newMessageSound(){
    synth.triggerAttackRelease(300, '8n');
}

export function newMoveSound(){
    synth.triggerAttackRelease(100, '8n');
}

export function ding(){
    synth.triggerAttackRelease(300, '8n');
}