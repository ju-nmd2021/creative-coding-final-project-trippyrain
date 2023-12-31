import { Text } from "./text.js";
import { getColorFromSeconds, fixedCurrentTime } from "./particle.js";
import { Particle1, Particle2, Particle3, Particle4 } from "./particle.js";

export const RANDOM_TEXT = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function calculateRadius(length) {
  if (length <= 3) {
    return 50;
  } else if (length == 4) {
    return 40;
  } else if (length == 5) {
    return 30;
  } else if (length == 6) {
    return 20;
  } else if (length >= 7) {
    return 10;
  }
}

export const globalMouse = {
  x: 0,
  y: 0,
  radius: 50,
};

export class Visual1 {
  constructor(renderer) {
    this.renderer = renderer;
    this.text = new Text();

    this.texture = PIXI.Texture.from("particle-1.png");

    this.particles = [];

    this.mouse = {
      x: globalMouse.x,
      y: globalMouse.y,
      radius: globalMouse.radius,
    };

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

    const color = getColorFromSeconds(fixedCurrentTime.second);
    const rgbColor = PIXI.utils.hex2rgb(color);

    const uniformsData = {
      threshold: 0.5,
      mr: rgbColor[0],
      mg: rgbColor[1],
      mb: rgbColor[2],
    };
    this.thresholdFilter = new PIXI.Filter(null, fragSource, uniformsData);
  }

  show(stageWidth, stageHeight, stage, text = "Type", offsetX = 0) {
    if (this.container) {
      stage.removeChild(this.container);
    }

    const result = this.text.setText(text, 2);
    this.pos = result.particles;

    this.container = new PIXI.Container();
    this.container.x = offsetX;

    this.container.filters = [this.blurFilter, this.thresholdFilter];

    stage.addChild(this.container);

    this.particles = [];
    for (let i = 0; i < this.pos.length; i++) {
      const item = new Particle1(this.pos[i], this.texture);
      this.container.addChild(item.sprite);
      this.particles.push(item);
    }
  }

  animate() {
    const adjustedMouseX = this.mouse.x - this.container.x;
    const adjustedMouseY = this.mouse.y - this.container.y;

    for (let i = 0; i < this.particles.length; i++) {
      const item = this.particles[i];
      const dx = adjustedMouseX - item.x;
      const dy = adjustedMouseY - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = item.radius + this.mouse.radius;

      if (dist < minDist) {
        const angle = Math.atan2(dy, dx);
        const tx = item.x - Math.cos(angle) * minDist;
        const ty = item.y - Math.sin(angle) * minDist;
        const ax = tx - item.x;
        const ay = ty - item.y;

        item.vx += ax;
        item.vy += ay;
      }
      item.draw();
    }
  }
}

export class Visual2 {
  constructor(renderer) {
    this.renderer = renderer;
    this.text = new Text();

    this.texture = PIXI.Texture.from("particle-1.png");

    this.particles = [];

    this.mouse = {
      x: globalMouse.x,
      y: globalMouse.y,
      radius: globalMouse.radius,
    };
  }

  show(stageWidth, stageHeight, stage, text = "Type", offsetX = 0) {
    if (this.container) {
      stage.removeChild(this.container);
    }

    const result = this.text.setText(text, 2);
    this.pos = result.particles;

    this.container = new PIXI.ParticleContainer(this.pos.length, {
      vertices: false,
      position: true,
      rotation: false,
      scale: false,
      uvs: false,
      tint: true,
    });

    this.container.x = offsetX;

    stage.addChild(this.container);

    this.particles = [];
    for (let i = 0; i < this.pos.length; i++) {
      const item = new Particle2(this.pos[i], this.texture);
      this.container.addChild(item.sprite);
      this.particles.push(item);
    }
  }

  animate() {
    const adjustedMouseX = this.mouse.x - this.container.x;
    const adjustedMouseY = this.mouse.y - this.container.y;

    for (let i = 0; i < this.particles.length; i++) {
      const item = this.particles[i];
      const dx = adjustedMouseX - item.x;
      const dy = adjustedMouseY - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = item.radius + this.mouse.radius;

      if (dist < minDist) {
        const angle = Math.atan2(dy, dx);
        const tx = item.x - Math.cos(angle) * minDist;
        const ty = item.y - Math.sin(angle) * minDist;
        const ax = tx - item.x;
        const ay = ty - item.y;

        item.vx += ax;
        item.vy += ay;
        item.collide();
      }
      item.draw();
    }
  }
}

export class Visual3 {
  constructor(renderer) {
    this.renderer = renderer;
    this.text = new Text();
    this.particles = [];
    this.mouse = {
      x: globalMouse.x,
      y: globalMouse.y,
      radius: globalMouse.radius,
    };
  }

  show(stageWidth, stageHeight, stage, text = "Type", offsetX = 0) {
    if (this.container) {
      stage.removeChild(this.container);
    }

    const result = this.text.setText(text, 18);
    this.pos = result.particles;

    this.container = new PIXI.Container();
    this.container.x = offsetX;
    stage.addChild(this.container);

    this.particles = [];
    for (let i = 0; i < this.pos.length; i++) {
      const item = new Particle3(this.pos[i]);
      this.container.addChild(item.textSprite);
      this.particles.push(item);
    }
  }

  animate() {
    const adjustedMouseX = this.mouse.x - this.container.x;
    const adjustedMouseY = this.mouse.y - this.container.y;

    for (let i = 0; i < this.particles.length; i++) {
      const item = this.particles[i];
      const dx = adjustedMouseX - item.x;
      const dy = adjustedMouseY - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = item.radius + this.mouse.radius;

      if (dist < minDist) {
        const angle = Math.atan2(dy, dx);
        const tx = item.x - Math.cos(angle) * minDist;
        const ty = item.y - Math.sin(angle) * minDist;
        const ax = tx - item.x;
        const ay = ty - item.y;

        item.vx += ax;
        item.vy += ay;
        item.collide();
      }
      item.draw();
    }

    if (Math.random() < 0.01) {
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].collide();
      }
    }
  }
}

export class Visual4 {
  constructor(renderer) {
    this.renderer = renderer;
    this.text = new Text();

    this.particles = [];
    this.mouse = {
      x: globalMouse.x,
      y: globalMouse.y,
      radius: globalMouse.radius,
    };
  }

  show(stageWidth, stageHeight, stage, text = "Type", offsetX = 0) {
    if (this.container) {
      stage.removeChild(this.container);
    }

    const result = this.text.setText(text, 18);
    this.pos = result.particles;

    this.container = new PIXI.Container();
    this.container.x = offsetX;
    stage.addChild(this.container);

    this.particles = [];
    for (let i = 0; i < this.pos.length; i++) {
      const item = new Particle4(this.pos[i]);
      this.container.addChild(item.sprite);
      this.particles.push(item);
    }
  }

  animate() {
    const adjustedMouseX = this.mouse.x - this.container.x;
    const adjustedMouseY = this.mouse.y - this.container.y;

    for (let i = 0; i < this.particles.length; i++) {
      const item = this.particles[i];
      const dx = adjustedMouseX - item.x;
      const dy = adjustedMouseY - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = item.radius + this.mouse.radius;

      item.setHovered(dist < minDist);
      item.draw();
    }
  }
}
