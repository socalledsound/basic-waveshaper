window.onload = init;
let context;
let bufferLoader;




function init() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      'snds/1.wav',
      'snds/2.wav',
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList) {
  // Create two sources and play them both together.
  const source1 = context.createBufferSource();
  const source2 = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const distortion = context.createWaveShaper();
  distortion.curve = makeDistortionCurve(400);
  distortion.oversample = '4x';



  source1.buffer = bufferList[0];
  source2.buffer = bufferList[1];
  source2.connect(distortion);
  distortion.connect(context.destination);
  filter.type = 'hipass'; 
  filter.frequency.value = 13000; // Set a high cutoff
  source2.connect(context.destination);
//   source1.start(0);
  source2.start(0);

}

function makeDistortionCurve(amount) {
  var k = typeof amount === 'number' ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
  for (; i < n_samples; ++i) {
      x = i * 2 / n_samples - 1;
      curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
  }
  return curve;
};

initializeElems();