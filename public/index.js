import pitches from './pitches.json';

const RAMP_VALUE = 0.00001;
const DEFAULT_DURATION = 0.5;
const DEFAULT_COLS = 7;

const noteBucket = document.getElementById("note_bucket");
const testButton = document.getElementById("test_button");
const output = document.getElementById("output");
const current_note_box = document.getElementById("current-note");
let context;

function init() {
  context = new AudioContext();
}

function playNote(freq = 110, duration = 0.5) {
  if (!context) init();
  const currentTime = context.currentTime;
  const osc = context.createOscillator();
  const gain = context.createGain();

  osc.connect(gain);
  gain.connect(context.destination);
  gain.gain.setValueAtTime(gain.gain.value, currentTime);
  gain.gain.exponentialRampToValueAtTime(RAMP_VALUE, currentTime + duration);

  osc.onended = function () {
    gain.disconnect(context.destination);
    osc.disconnect(gain);
  };

  osc.type = "sine";
  osc.frequency.value = freq;
  osc.start(currentTime);
  osc.stop(currentTime + duration);
}

function getNotes() {
  return noteBucket.value.match(/\S+/g).map((note) => parseInt(note));
}

function playNotes(notes, pos = 0) {
  notes = notes || getNotes();
  if (pos === 0) console.log(notes.length, notes);
  const note = notes[pos];
  console.log("Current Pos", pos);
  highlightCurrentNote(pos);
  console.log(note, pitches[note]);
  showCurrentNote(note);
  playNote(pitches[note].freq);
  if (pos < notes.length - 1) {
    setTimeout(
      () => playNotes(notes, pos + 1, DEFAULT_DURATION),
      1000 * DEFAULT_DURATION
    );
  }
}

function setOutput(notes) {
  const chunked = chunkArray(notes, DEFAULT_COLS);
  output.innerHTML = "";
  chunked.forEach((row) => {
    const newDiv = document.createElement("div");
    row.forEach((note) => {
      const newNote = document.createElement("span");
      newNote.innerHTML = note + "&nbsp;";
      newDiv.appendChild(newNote);
    });
    output.appendChild(newDiv);
  });
}

function showCurrentNote(note) {
  current_note_box.innerHTML = pitches[note].note;
}

function highlightCurrentNote(pos) {
  const notes = output.getElementsByTagName("span");
  Array.from(notes).forEach((note, index) => {
    note.classList.toggle("current", index === pos);
  });
}

function chunkArray(arr, size) {
  const chunkedArray = [];
  for (let i = 0; i < arr.length; i += size) {
    chunkedArray.push(arr.slice(i, i + size));
  }
  return chunkedArray;
}

testButton.addEventListener("click", () => {
  const notes = getNotes();
  addNotesToUrl(notes);
  setOutput(notes);
  playNotes(notes);
});

function addNotesToUrl(notes) {
  const url = new URL(window.location.href);
  url.searchParams.set("notes", notes.join(" "));
  window.history.pushState({}, "", url);
}

function getNotesFromUrl() {
  const url = new URL(window.location.href);
  return url.searchParams.get("notes");
}

function addNotesToTextarea(notes) {
  noteBucket.value = notes;
}

document.addEventListener("DOMContentLoaded", () => {
  const notes = getNotesFromUrl();
  if (notes) {
    addNotesToTextarea(notes);
    console.log(notes);
    setOutput(notes);
  }
});

// function that takes an array of numbers and gives the count of each number in the array
function countNumbers(arr) {
  const counts = {};
  arr.forEach((num) => {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  });
  return counts;
}
