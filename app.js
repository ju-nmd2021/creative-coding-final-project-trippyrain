// function setup() {
//   createCanvas(1000, 550);
//   background(220);
// }

// import { Text } from "./text.js";

import { Visual, Visual2 } from "./visual.js";

class App {
  constructor() {
    WebFont.load({
      google: {
        families: ["Hind: 700"],
      },
      fontactive: () => {
        this.setWebgl();
        // this.visual = new Visual(this.renderer);
        this.visual = new Visual2(this.renderer);

        window.addEventListener("resize", this.resize.bind(this), false);
        this.resize();

        requestAnimationFrame(this.animate.bind(this));
      },
    });
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

  resize() {
    this.stageWidth = 1000;
    this.stageHeight = 550;

    this.visual.show(this.stageWidth, this.stageHeight, this.stage);
  }

  animate(t) {
    requestAnimationFrame(this.animate.bind(this));

    this.visual.animate();

    this.renderer.render(this.stage);
  }
}

window.onload = () => {
  new App();
};
