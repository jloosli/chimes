const pitches = {
  0: {
    note: "A",
    freq: 110,
  },
  1: {
    note: "A♯ / B♭",
    freq: 116.54,
  },
  2: {
    note: "B",
    freq: 123.47,
  },
  3: {
    note: "C",
    freq: 130.81,
  },
  4: {
    note: "C♯ / D♭",
    freq: 138.59,
  },
  5: {
    note: "D",
    freq: 146.83,
  },
  6: {
    note: "D♯ / E♭",
    freq: 155.56,
  },
  7: {
    note: "E",
    freq: 164.81,
  },
  8: {
    note: "F",
    freq: 174.61,
  },
  9: {
    note: "F♯ / G♭",
    freq: 185,
  },
  10: {
    note: "G",
    freq: 196,
  },
  11: {
    note: "G♯ / A♭",
    freq: 207.65,
  },
  12: {
    note: "A",
    freq: 220,
  },
  13: {
    note: "A♯ / B♭",
    freq: 233.08,
  },
  14: {
    note: "B",
    freq: 246.94,
  },
  15: {
    note: "C",
    freq: 261.63,
  },
  16: {
    note: "C♯ / D♭",
    freq: 277.18,
  },
  17: {
    note: "D",
    freq: 293.66,
  },
  18: {
    note: "D♯ / E♭",
    freq: 311.13,
  },
  19: {
    note: "E",
    freq: 329.63,
  },
  20: {
    note: "F",
    freq: 349.23,
  },
};

const RAMP_VALUE = 0.00001;
const DEFAULT_DURATION = 0.5;
const DEFAULT_COLS = 7;

const noteBucket = document.getElementById("note_bucket");
const testButton = document.getElementById("test_button");
const output = document.getElementById("output");
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
  playNote(pitches[note].freq);
  if (pos < notes.length - 1) {
    setTimeout(
      () => playNotes(notes, pos + 1, DEFAULT_DURATION),
      1000 * DEFAULT_DURATION
    );
  }
}

function setOutput() {
  const notes = getNotes();
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
  setOutput();
  playNotes();
});
