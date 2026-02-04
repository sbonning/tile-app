const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const imageInput = document.getElementById("tileImageInput");
const generateBtn = document.getElementById("generateBtn");

const tileWidthInput = document.getElementById("tileWidth");
const tileHeightInput = document.getElementById("tileHeight");

const surfaceWidthInput = document.getElementById("surfaceWidth");
const surfaceHeightInput = document.getElementById("surfaceHeight");

const rotationSelect = document.getElementById("rotationType");
const rotationStyleSelect = document.getElementById("rotationStyle");
const rotationScopeSelect = document.getElementById("rotationScope");
const layoutSelect = document.getElementById("layoutType");

const groutSizeInput = document.getElementById("groutSize");
const groutColorInput = document.getElementById("groutColor");

let tileImage = new Image();
tileImage.src = "default-tile.jpg";

const rotationPatterns = {
  alternating: [0, 180],
  double: [0, 0, 180, 180],
  quarter: [0, 90, 180, 270]
};

function getRotation(rotationType) {
  if (rotationType === "none") return 0;

  if (rotationType === "two") {
    return Math.random() < 0.5 ? 0 : 180;
  }

  if (rotationType === "four") {
    const rotations = [0, 90, 180, 270];
    return rotations[Math.floor(Math.random() * rotations.length)];
  }

  return 0;
}

imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  tileImage.src = URL.createObjectURL(file);
});

generateBtn.addEventListener("click", () => {
  const tileWidth = Number(tileWidthInput.value);
  const tileHeight = Number(tileHeightInput.value);
  const surfaceWidth = Number(surfaceWidthInput.value);
  const surfaceHeight = Number(surfaceHeightInput.value);

  canvas.width = surfaceWidth;
  canvas.height = surfaceHeight;
    const groutColor = groutColorInput.value;
    ctx.fillStyle = groutColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cols = Math.floor(surfaceWidth / tileWidth);
  const rows = Math.floor(surfaceHeight / tileHeight);

  const layout = layoutSelect.value;
  const rotationType = rotationSelect.value;
  const rotationStyle = rotationStyleSelect.value;
  const rotationScope = rotationScopeSelect.value;

  const groutSize = Number(groutSizeInput.value);

    // visible tile size (face)
    const drawTileWidth = tileWidth - groutSize;
    const drawTileHeight = tileHeight - groutSize;

  for (let row = 0; row < rows; row++) {
    const isOffsetRow = layout === "offset" && row % 2 === 1;
    const offsetX = isOffsetRow ? tileWidth / 2 : 0;
    const startCol = isOffsetRow ? -1 : 0;
    let patternIndex = 0;

    for (let col = startCol; col < cols; col++) {
  const x = col * tileWidth + offsetX;
  const y = row * tileHeight;

  const isHalfTile = isOffsetRow && col === -1;

  let rotation = 0;

if (rotationType !== "none") {
  if (rotationStyle === "random") {
    // 🔥 TRUE random per tile
    rotation = getRotation(rotationType);
  } else {
    // patterned rotation
    const pattern = rotationPatterns[rotationStyle];
    rotation = pattern[patternIndex % pattern.length];
  }
}

  ctx.save();

  if (isHalfTile) {
    // clip to half tile
    ctx.beginPath();
    ctx.rect(x + tileWidth / 2, y, tileWidth / 2, tileHeight);
    ctx.clip();
  }

  ctx.translate(x + tileWidth / 2, y + tileHeight / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(
    tileImage,
    -drawTileWidth / 2,
    -drawTileHeight / 2,
    drawTileWidth,
    drawTileHeight
  );

  ctx.restore();

  // ✅ ALWAYS advance pattern (half tile counts)
  patternIndex++;
}
  }
});