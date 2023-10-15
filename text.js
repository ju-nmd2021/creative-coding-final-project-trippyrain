export class Text {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  setText(str, density, offsetX = 0) {
    this.canvas.width = 1000;
    this.canvas.height = 550;

    const myText = str;
    const fontWidth = 400;
    const fontSize = 600;
    const fontName = "Hind";

    this.ctx.clearRect(0, 0, 1000, 550);
    this.ctx.font = `${fontWidth} ${fontSize}px ${fontName}`;
    this.ctx.fillStyle = `rgba(0, 0, 0, 1)`;
    this.ctx.textBaseline = `middle`;

    const fontPos = this.ctx.measureText(myText);
    this.ctx.fillText(
      myText,
      offsetX,
      fontPos.actualBoundingBoxAscent +
        fontPos.actualBoundingBoxDescent +
        (550 - fontSize) / 2
    );

    return {
      particles: this.dotPos(density),
      width: fontPos.width,
    };
  }

  dotPos(density) {
    const imageData = this.ctx.getImageData(0, 0, 1000, 550).data;
    const particles = [];
    let i = 0;
    let width = 0;
    let pixel;

    for (let height = 0; height < 550; height += density) {
      ++i;
      const slide = i % 2 == 0;
      width = 0;
      if (slide == 1) {
        width += 6;
      }

      for (width; width < 1000; width += density) {
        pixel = imageData[(width + height * 1000) * 4 - 1];

        if (
          pixel > 20 &&
          width > 0 &&
          width < 1000 &&
          height > 0 &&
          height < 550
        ) {
          particles.push({ x: width, y: height });
        }
      }
    }

    return particles;
  }
}
