import { RANDOM_TEXT } from "./visual.js";

const FRICTION = { 1: 0.98, 2: 0.86 };
const MOVE_SPEED = { 1: 0.6, 2: 1, 3: 0.03 };
const COLOR_SPEED = 0.12;

export class Particle1 {
  constructor(pos, texture) {
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.scale.set(0.2);

    this.savedX = pos.x;
    this.savedY = pos.y;
    this.x = pos.x;
    this.y = pos.y;
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.vx = 0;
    this.vy = 0;
    this.radius = 10;
  }

  draw() {
    this.x += (this.savedX - this.x) * MOVE_SPEED[1];
    this.y += (this.savedY - this.y) * MOVE_SPEED[1];

    this.vx *= FRICTION[1];
    this.vy *= FRICTION[1];

    this.x += this.vx;
    this.y += this.vy;

    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }
}

export class Particle2 {
  constructor(pos, texture) {
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.scale.set(0.06);

    this.savedX = pos.x;
    this.savedY = pos.y;
    this.x = pos.x;
    this.y = pos.y;
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.vx = 0;
    this.vy = 0;
    this.radius = 10;

    this.savedRgb = 0xf3316e;
    this.rgb = 0xf3316e;
  }

  collide() {
    this.rgb = 0x451966;
  }

  draw() {
    this.rgb += (this.savedRgb - this.rgb) * COLOR_SPEED;

    this.x += (this.savedX - this.x) * MOVE_SPEED[2];
    this.y += (this.savedY - this.y) * MOVE_SPEED[2];

    this.vx *= FRICTION[1];
    this.vy *= FRICTION[1];

    this.x += this.vx;
    this.y += this.vy;

    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.tint = this.rgb;
  }
}

export class Particle3 {
  constructor(pos) {
    this.textArr = RANDOM_TEXT.split("");
    this.shuffleText();

    this.textSprite = new PIXI.Text(this.currentChar, {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0xff0000,
      align: "center",
    });

    this.savedX = pos.x;
    this.savedY = pos.y;
    this.x = pos.x;
    this.y = pos.y;
    this.textSprite.x = this.x;
    this.textSprite.y = this.y;
    this.vx = 0;
    this.vy = 0;
    this.radius = 10;

    this.savedRgb = 0x000000;
    this.rgb = this.savedRgb;
  }

  collide() {
    this.shuffleText();
    this.textSprite.text = this.currentChar;
  }

  shuffleText() {
    this.currentChar = this.textArr.splice(
      Math.floor(Math.random() * this.textArr.length),
      1
    )[0];
    if (!this.textArr.length) this.textArr = RANDOM_TEXT.split("");
  }

  draw() {
    this.rgb += (this.savedRgb - this.rgb) * COLOR_SPEED;

    this.vx *= FRICTION[2];
    this.vy *= FRICTION[2];

    this.vx += (this.savedX - this.x) * MOVE_SPEED[3];
    this.vy += (this.savedY - this.y) * MOVE_SPEED[3];

    this.x += this.vx;
    this.y += this.vy;

    this.textSprite.x = this.x;
    this.textSprite.y = this.y;
    this.textSprite.tint = this.rgb;
  }
}

export class Particle4 {
  constructor(pos) {
    this.sprite = new PIXI.Graphics();
    this.color = (Math.random() * 0xffffff) & 0xffffcc;

    this.radius = Math.random() * 20 + 5;
    this.maxRadius = this.radius;
    this.minRadius = 0;
    this.shrinkSpeed = 1.5;
    this.growSpeed = 0.2;

    this.savedX = pos.x;
    this.savedY = pos.y;
    this.x = this.savedX;
    this.y = this.savedY;

    this.hovered = false;

    this.sprite.alpha = 0.7;

    this.blurFilter = new PIXI.filters.BlurFilter();
    this.blurFilter.blur = 1;
    this.sprite.filters = [this.blurFilter];
  }

  draw() {
    if (this.hovered) {
      this.radius -= this.shrinkSpeed;
      if (this.radius < this.minRadius) {
        this.radius = this.minRadius;
      }
    } else {
      this.radius += this.growSpeed;
      if (this.radius > this.maxRadius) {
        this.radius = this.maxRadius;
      }
    }

    this.sprite.clear();
    this.sprite.beginFill(this.color);
    this.sprite.drawCircle(this.x, this.y, this.radius);
    this.sprite.endFill();
  }

  setHovered(hoverState) {
    this.hovered = hoverState;
  }
}
