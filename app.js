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
      }
    });

    this.visuals = [];
    document.addEventListener("pointermove", this.onMove.bind(this), false);
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

  adjustBackgroundColor() {
    const morningColor = { r: 1, g: 0.5, b: 0 };
    const nightColor = { r: 0, g: 0.5, b: 1 };

    const timeFactor =
      (fixedCurrentTime.hour * 60 + fixedCurrentTime.minute) / (24 * 60);
    const r = (1 - timeFactor) * morningColor.r + timeFactor * nightColor.r;
    const g = (1 - timeFactor) * morningColor.g + timeFactor * nightColor.g;
    const b = (1 - timeFactor) * morningColor.b + timeFactor * nightColor.b;

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
