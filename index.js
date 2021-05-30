import Game from "./game.js";

const game = new Game();
game.start();

let gameStarted = false;

var punchSound = new Howl({ src: ["audio/huh1.wav"] });
var hadokenSound = new Howl({ src: ["audio/hadoken.mp3"] });
var shoryuken = new Howl({ src: ["audio/shoryuken.mp3"] });

console.log(
  `%c If you're having some problems using this demo, please visit the repo: https://github.com/charliegerard/street-fighter-arduino-tflite`,
  `color:gray; background:cyan`
);

if (!navigator.bluetooth) {
  let notSupported = document.getElementsByClassName("not-supported")[0];
  notSupported.style.display = "block";
}

const onInferenceSketch = (data) => {
  if (gameStarted) {
    switch (data) {
      case 3:
        punchSound.play();
        game.setLoopAndPosition([0, 1, 2], 2);
        break;
      case 2:
        hadokenSound.play();
        game.setLoopAndPosition([0, 1, 2, 3], 0);
        break;
      case 4:
        shoryuken.play();
        game.setLoopAndPosition([0, 1, 2, 3, 4, 5, 6], 4);
        break;
      default:
        break;
    }
  }
};

window.tinyMlExperimentBleInterface.createConnectButton(
  "#connectButtonContainer",
  {
    model: "SFModel/model.tflite",
    numClasses: 5,
    threshold: 0.215,
    numSamples: 30,
    captureDelay: 0.4,
    useMagnetometer: false,
    onConnect() {
      console.log("The BLE is connected!");
    },

    onTransferProgress(progress) {
      console.log(`Loaded ${Math.round(progress * 100)}%)`);
      var progressBarBlock = document.getElementsByClassName("progress-bar")[0];
      progressBarBlock.style.display = "block";
      var bar = document.getElementsByTagName("progress")[0];
      bar.value = progress * 100;
      bar.setAttribute("data-label", `${Math.trunc(progress * 100)}%`);
    },

    onTransferCompleted() {
      let step1 = document.getElementsByClassName("step-1")[0];
      step1.style.display = "none";
      let step2 = document.getElementsByClassName("step-2")[0];
      step2.style.display = "block";

      let startButton = document.getElementsByClassName("start")[0];
      startButton.onclick = () => {
        document.getElementsByClassName("intro")[0].style.display = "none";
        gameStarted = true;
      };
    },

    onDisconnect() {
      console.log("The BLE is disconnected!");
    },

    onInference(data) {
      onInferenceSketch(data.index);
    },
  }
);
