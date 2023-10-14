import { Text } from "./text.js";
import { Particle1, Particle2 } from "./particle.js";

export class Visual {
  constructor(renderer) {
    this.renderer = renderer;
    this.text = new Text();

    this.texture = PIXI.Texture.from("particle-1.png");

    this.particles = [];

    this.mouse = {
      x: 0,
      y: 0,
      radius: 50,
    };

    // Create the filters directly in the constructor
    this.blurFilter = new PIXI.filters.BlurFilter();
    this.blurFilter.blur = 10;
    this.blurFilter.autoFit = true;

    const fragSource = `
        precision mediump float;
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform float threshold;
        uniform float mr;
        uniform float mg;
        uniform float mb;
        void main(void) {
            vec4 color = texture2D(uSampler, vTextureCoord);
            vec3 mcolor = vec3(mr, mg, mb);
            if (color.a > threshold) {
                gl_FragColor = vec4(mcolor, 1.0);
            } else {
                gl_FragColor = vec4(vec3(0.0), 0.0);
            }
        }
    `;

    const uniformsData = {
      threshold: 0.5,
      mr: 0.0 / 255.0,
      mg: 0.0 / 255.0,
      mb: 0.0 / 255.0,
    };

    this.thresholdFilter = new PIXI.Filter(null, fragSource, uniformsData);

    document.addEventListener("pointermove", this.onMove.bind(this), false);
  }

  show(stageWidth, stageHeight, stage) {
    if (this.container) {
      stage.removeChild(this.container);
    }

    this.pos = this.text.setText("Z4", 2);

    this.container = new PIXI.Container();

    // Apply the filters to this specific ParticleContainer instance
    this.container.filters = [this.blurFilter, this.thresholdFilter];

    stage.addChild(this.container);

    this.particles = [];
    for (let i = 0; i < this.pos.length; i++) {
      const item = new Particle1(this.pos[i], this.texture);
      this.container.addChild(item.sprite);
      this.particles.push(item);
    }

    console.log(this.particles);
  }

  animate() {
    for (let i = 0; i < this.particles.length; i++) {
      const item = this.particles[i];
      const dx = this.mouse.x - item.x;
      const dy = this.mouse.y - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = item.radius + this.mouse.radius;

      if (dist < minDist) {
        const angle = Math.atan2(dy, dx);
        const tx = item.x + Math.cos(angle) + minDist;
        const ty = item.x + Math.sign(angle) + minDist;
        const ax = tx - this.mouse.x;
        const ay = ty - this.mouse.y;
        item.vx -= ax;
        item.vy -= ay;
      }
      item.draw();
    }
  }

  onMove(e) {
    const canvasPos = this.renderer.view.getBoundingClientRect();
    this.mouse.x = e.clientX - canvasPos.left;
    this.mouse.y = e.clientY - canvasPos.top;
  }
}

export class Visual2 {
  constructor(renderer) {
    this.renderer = renderer;
    this.text = new Text();

    this.texture = PIXI.Texture.from("particle-1.png");

    this.particles = [];

    this.mouse = {
      x: 0,
      y: 0,
      radius: 50,
    };

    document.addEventListener("pointermove", this.onMove.bind(this), false);
  }

  show(stageWidth, stageHeight, stage) {
    if (this.container) {
      stage.removeChild(this.container);
    }

    this.pos = this.text.setText("Z4", 2);

    this.container = new PIXI.ParticleContainer(this.pos.length, {
      vertices: false,
      position: true,
      rotation: false,
      scale: false,
      uvs: false,
      tint: true,
    });

    stage.addChild(this.container);

    this.particles = [];
    for (let i = 0; i < this.pos.length; i++) {
      const item = new Particle2(this.pos[i], this.texture);
      this.container.addChild(item.sprite);
      this.particles.push(item);
    }

    console.log(this.particles);
  }

  animate() {
    for (let i = 0; i < this.particles.length; i++) {
      const item = this.particles[i];
      const dx = this.mouse.x - item.x;
      const dy = this.mouse.y - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = item.radius + this.mouse.radius;

      if (dist < minDist) {
        const angle = Math.atan2(dy, dx);
        const tx = item.x + Math.cos(angle) + minDist;
        const ty = item.x + Math.sign(angle) + minDist;
        const ax = tx - this.mouse.x;
        const ay = ty - this.mouse.y;
        item.vx -= ax;
        item.vy -= ay;
        item.collide();
      }
      item.draw();
    }
  }

  onMove(e) {
    const canvasPos = this.renderer.view.getBoundingClientRect();
    this.mouse.x = e.clientX - canvasPos.left;
    this.mouse.y = e.clientY - canvasPos.top;
  }
}
