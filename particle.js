const FRICTION = 0.98;
const MOVE_SPEED = { 1: 0.6, 2: 0.12 };
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

    this.vx *= FRICTION;
    this.vy *= FRICTION;

    this.x += this.vx;
    this.y += this.vy;

    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }
}

export class Particle2 {
  constructor(pos, texture) {
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.scale.set(0.3);

    this.savedX = pos.x;
    this.savedY = pos.y;
    this.x = pos.x;
    this.y = pos.y;
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.vx = 0;
    this.vy = 0;
    this.radius = 10;

    this.savedRgb = 0x3316e;
    this.rgb = 0x3316e;
  }

  collide() {
    this.rgb = 0x451966;
  }

  draw() {
    this.rgb += (this.savedRgb - this.rgb) * COLOR_SPEED;

    this.x += (this.savedX - this.x) * MOVE_SPEED[2];
    this.y += (this.savedY - this.y) * MOVE_SPEED[2];

    this.vx *= FRICTION;
    this.vy *= FRICTION;

    this.x += this.vx;
    this.y += this.vy;

    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.tint = this.rgb;
  }
}
