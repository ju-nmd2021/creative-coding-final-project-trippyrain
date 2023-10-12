export class Text {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  setText(str, density) {
    this.canvas.width = 1000;
    this.canvas.height = 550;

    const myText = str;
    const fontWidth = 700;
    const fontSize = 600;
    const fontName = "Hind";

    this.ctx.clearRect(0, 0, 1000, 550);
    this.ctx.font = `${fontWidth} ${fontSize}px ${fontName}`;
    this.ctx.fillStyle = `rgba(0, 0, 0, 1)`;

    this.ctx.textBaseline = `middle`;
    const fontPos = this.ctx.measureText(myText);
    this.ctx.fillText(
      myText,
      (1000 - fontPos.width) / 2,
      fontPos.actualBoundingBoxAscent +
        fontPos.actualBoundingBoxDescent +
        (550 - fontSize) / 2
    );

    return this.dotPos(density);
  }

  dotPos(density) {
    const imageData = this.ctx.getImageData(0, 0, 1000, 550).data;
    const particles = [];
    let uniquePixels = new Set();
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
        uniquePixels.add(pixel);

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

    console.log("Unique Pixel Values:", uniquePixels);

    return particles;
  }
}
