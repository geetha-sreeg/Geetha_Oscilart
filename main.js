const input = document.getElementById('input');
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

notenames = new Map();
notenames.set("C", 216.6);
notenames.set("D", 293.7);
notenames.set("E", 329.6);
notenames.set("F", 349.2 );
notenames.set("G",392.0);
notenames.set("A", 440.0 );
notenames.set("B", 493.9);

// create Oscillator node

gainNode.gain.value = 0;

gainNode.connect(audioCtx.destination);

gainNode.gain.setValueAtTime(100, audioCtx.currentTime);

gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);



//INSTRUCTIONS WERE A BIT CONFUSING IN THE JAM, IT INITIALLY DIDN'T WORK BUT I REFERRED MDN DOCS AND REALIZED THAT I HAD OT PUT THIS IN THE FUNCTION :(
function frequency(pitch, oscillator){
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
}
function handle(){
    audioCtx.resume();

    const oscillator = audioCtx.createOscillator();
    oscillator.type = "sine";
    oscillator.connect(gainNode);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1);

    gainNode.gain.value = 1;

    const inputVal = input.value.trim().toUpperCase(); //WASN'T IN THE JAM, BUT THANKS TO MY COMPUTER APPLICATIONS TEACHER FOR HELPING ME WITH THE LOGIC!!!
    const mappedFreq = notenames.get(inputVal);
    const finalFreq = mappedFreq || parseFloat(inputVal);

    if (!isNaN(finalFreq)) {
        frequency(finalFreq, oscillator);
    }
}