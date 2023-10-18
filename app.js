import {
  fetchData,
  fixedCurrentTemperature,
  fixedCurrentTime,
} from "./particle.js";

export let charactersArray = [];

import { calculateRadius, globalMouse } from "./visual.js";
import { Visual1, Visual2, Visual3, Visual4 } from "./visual.js";

class App {
  constructor() {
    WebFont.load({
      google: {
        families: ["Hind: 700"],
      },
      fontactive: () => {
        this.setupApp();
      },
    });

    const submitBtn = document.getElementById("submit");
    submitBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      await fetchData();

      const inputText = document.getElementById("text").value;
      if (inputText) {
        this.textToRender = inputText;
        charactersArray = [...inputText];
        globalMouse.radius = calculateRadius(charactersArray.length);
        this.resize();

        this.adjustBackgroundColor();
      }
    });

    this.visuals = [];
    document.addEventListener("pointermove", this.onMove.bind(this), false);
    const regenerateBtn = document.getElementById("regenerate");
    regenerateBtn.addEventListener("click", this.regenerate.bind(this));
  }

  regenerate() {
    const submitBtn = document.getElementById("submit");
    submitBtn.click();

    setTimeout(() => {
      this.adjustBackgroundColorBasedOnArt();
    }, 100);
  }

  adjustBackgroundColorBasedOnArt() {
    const rEffecting = 0.5 + (charactersArray.length % 50) / 100;

    const lastVisual = this.visuals[this.visuals.length - 1];
    const visualTypeEffect =
      lastVisual instanceof Visual1
        ? 0.5
        : lastVisual instanceof Visual2
        ? 0.8
        : lastVisual instanceof Visual3
        ? 1.1
        : 1.4;
    const gEffecting = visualTypeEffect;

    const bEffecting = fixedCurrentTemperature <= 0 ? 1.5 : 1;

    this.adjustBackgroundColor(rEffecting, gEffecting, bEffecting);
  }

  async setupApp() {
    await fetchData();
    this.setWebgl();

    this.adjustBackgroundColor();

    console.log("Fetched Temperature:", fixedCurrentTemperature);
    console.log(
      "Fetched Time:",
      fixedCurrentTime.hour +
        ":" +
        fixedCurrentTime.minute +
        ":" +
        fixedCurrentTime.second
    );

    this.visual = new Visual2(this.renderer);

    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();

    requestAnimationFrame(this.animate.bind(this));
  }

  adjustBackgroundColor(rEffecting = 1, gEffecting = 1, bEffecting = 1) {
    const morningColor = { r: 1, g: 0.5, b: 0 };
    const nightColor = { r: 0, g: 0.5, b: 1 };

    const timeFactor =
      (fixedCurrentTime.hour * 60 + fixedCurrentTime.minute) / (24 * 60);
    const r =
      ((1 - timeFactor) * morningColor.r + timeFactor * nightColor.r) *
      rEffecting;
    const g =
      ((1 - timeFactor) * morningColor.g + timeFactor * nightColor.g) *
      gEffecting;
    const b =
      ((1 - timeFactor) * morningColor.b + timeFactor * nightColor.b) *
      bEffecting;
    const temperatureFactor = fixedCurrentTemperature <= 0 ? 1.5 : 1;
    const backgroundColor = PIXI.utils.rgb2hex([
      r * temperatureFactor,
      g * temperatureFactor,
      b * temperatureFactor,
    ]);

    this.renderer.backgroundColor = backgroundColor;
  }

  setWebgl() {
    this.renderer = new PIXI.Renderer({
      width: 1000,
      height: 550,
      antialias: true,
      transparent: false,
      resolution: window.devicePixelRatio > 1 ? 2 : 1,
      autoDensity: true,
      powerPreference: "high-performance",
      backgroundColor: 0xf34fff,
    });
    document.body.appendChild(this.renderer.view);

    this.stage = new PIXI.Container();
  }

  onMove(e) {
    const canvasPos = this.renderer.view.getBoundingClientRect();
    const mouseX = e.clientX - canvasPos.left;
    const mouseY = e.clientY - canvasPos.top;

    for (let visual of this.visuals) {
      visual.mouse.x = mouseX;
      visual.mouse.y = mouseY;
    }
  }

  resize() {
    this.stageWidth = 1000;
    this.stageHeight = 550;

    while (this.stage.children[0]) {
      this.stage.removeChild(this.stage.children[0]);
    }

    const textToRender = this.textToRender || "Type";

    let totalWidth = 0;
    const widths = [];

    for (let char of textToRender) {
      const result = this.visual.text.setText(char, 2, 0);
      totalWidth += result.width;
      widths.push(result.width);
    }

    let offsetX = (this.stageWidth - totalWidth) / 2;

    this.visuals = [];

    for (let i = 0; i < textToRender.length; i++) {
      const char = textToRender[i];
      const VisualClasses = [Visual1, Visual2, Visual3, Visual4];
      const VisualClass =
        VisualClasses[Math.floor(Math.random() * VisualClasses.length)];
      const visual = new VisualClass(this.renderer);

      this.visuals.push(visual);
      visual.show(this.stageWidth, this.stageHeight, this.stage, char, offsetX);

      offsetX += widths[i];
    }
  }

  animate(t) {
    requestAnimationFrame(this.animate.bind(this));

    for (let visual of this.visuals) {
      visual.animate();
    }

    this.renderer.render(this.stage);
  }
}

window.onload = () => {
  new App();
};
