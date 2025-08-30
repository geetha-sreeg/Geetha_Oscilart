//define canvas variables (below this thingy)
let reset = false;
var interval = null;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d"); //So far so good, JS IS ALWAYS a problem in jams :(
var width = ctx.canvas.width;      // ← ADDED: width was missing!
var height = ctx.canvas.height;
var amplitude = 40;
var counter = 0;
let x = 0;                         // I DIDN'T READ THE JAM PROPERLY LOL, IT WAS MY FAULT
let y = 0;

function drawWave() {
    ctx.clearRect(0, 0, width, height);  
    x = 0;
    y = height/2;
    ctx.moveTo(x, y);  
    ctx.beginPath(); 

    counter = 0;
    interval = setInterval(line, 20);
    reset = false;
}

function line() {
    y = height/2 + (amplitude * Math.sin(x * 2 * Math.PI * freq));
    ctx.lineTo(x, y);
    ctx.stroke();
    x = x + 1;
    counter++;
    if(counter > 50){
        clearInterval(interval);
    }
}



//audio stuff -- that stupid phobia where I keep checking if my old code works after adding new shtuff (is it just me?)
const input = document.getElementById('input');
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

notenames = new Map();
notenames.set("C", 216.6);
notenames.set("D", 293.7);
notenames.set("E", 329.6);
notenames.set("F", 349.2 );
notenames.set("G", 392.0);
notenames.set("A", 440.0 );
notenames.set("B", 493.9);

// create Oscillator node

gainNode.gain.value = 0;

gainNode.connect(audioCtx.destination);

gainNode.gain.setValueAtTime(100, audioCtx.currentTime); // ← NOTE: still high, but keeping as-is per your request

gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 0.9);

//INSTRUCTIONS WERE A BIT CONFUSING IN THE JAM, IT INITIALLY DIDN'T WORK BUT I REFERRED MDN DOCS AND REALIZED THAT I HAD OT PUT THIS IN THE FUNCTION :(
function frequency(pitch, oscillator){
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    freq = pitch / 10000; //"that" function lol
}


/*function handle(){
    audioCtx.resume();

    const inputVal = input.value.trim().toUpperCase(); //WASN'T IN THE JAM, BUT THANKS TO MY COMPUTER APPLICATIONS TEACHER FOR HELPING ME WITH THE LOGIC!!!

    for (let i = 0; i < inputVal.length; i++) {
        const noteChar = inputVal[i]; // break down input one character at a time
        const mappedFreq = notenames.get(noteChar);
        const finalFreq = mappedFreq || parseFloat(noteChar); // fallback if someone types a number (unlikely per char)

        if (!isNaN(finalFreq)) {
            const oscillator = audioCtx.createOscillator(); // create new oscillator for each note
            oscillator.type = "sine";
            oscillator.connect(gainNode);
            oscillator.start(audioCtx.currentTime + i * 0.5); // stagger notes so they don't overlap
            oscillator.stop(audioCtx.currentTime + i * 0.5 + 0.4); // short burst

            gainNode.gain.setValueAtTime(1, audioCtx.currentTime + i * 0.5);
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.5 + 0.4);

            frequency(finalFreq, oscillator);  // sets pitch and freq
            drawWave();                        // uses freq to draw (help from my prof again :())
        }
    }
}*/

function handle(){
    reset = true;
    audioCtx.resume();

    const inputVal = input.value.trim().toUpperCase(); //WASN'T IN THE JAM, BUT THANKS TO MY COMPUTER APPLICATIONS TEACHER FOR HELPING ME WITH THE LOGIC!!!

    for (let i = 0; i < inputVal.length; i++) {
        const noteChar = inputVal[i];
        const mappedFreq = notenames.get(noteChar);
        const finalFreq = mappedFreq || parseFloat(noteChar); // fallback if someone types a number (unlikely per char)

        if (!isNaN(finalFreq)) {
            const oscillator = audioCtx.createOscillator(); // create new oscillator for each note
            const localGain = audioCtx.createGain();        // ← NEW: separate gain node for each oscillator

            oscillator.type = "sine";
            oscillator.connect(localGain);
            localGain.connect(audioCtx.destination);

            const startTime = audioCtx.currentTime + i * 0.6;
            const stopTime = startTime + 0.5;

            oscillator.frequency.setValueAtTime(finalFreq, startTime);
            oscillator.start(startTime);
            oscillator.stop(stopTime);

            localGain.gain.setValueAtTime(1, startTime);
            localGain.gain.setValueAtTime(0, stopTime);

            // Delay drawing the wave to match the note timing
            setTimeout(() => {
                freq = finalFreq / 10000; // update global freq for drawWave
                drawWave();               // uses freq to draw (help from my prof again :())
            }, i * 600); // match audio delay
        }
    }
}