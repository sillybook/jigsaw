const canvas = document.getElementById("puzzleCanvas");
const ctx = canvas.getContext("2d");

let tiles = [];
let dragged = null;
let offsetX, offsetY;
let TILE_W, TILE_H;

async function loadPuzzle() {
  const res = await fetch("/api/tiles");
  const data = await res.json();

  const rows = data.rows, cols = data.cols;
  tiles = data.tiles;

  TILE_W = canvas.width / cols;
  TILE_H = canvas.height / rows;

  // Assign random positions
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].x = Math.random() * (canvas.width - TILE_W);
    tiles[i].y = Math.random() * (canvas.height - TILE_H);
    const img = new Image();
    img.src = tiles[i].img;
    tiles[i].image = img;
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const t of tiles) {
    if (t.image.complete) {
      ctx.drawImage(t.image, t.x, t.y, TILE_W, TILE_H);
      ctx.strokeStyle = "#222";
      ctx.strokeRect(t.x, t.y, TILE_W, TILE_H);
    }
  }
}

function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  return { x, y };
}

canvas.addEventListener("mousedown", startDrag);
canvas.addEventListener("mousemove", onDrag);
canvas.addEventListener("mouseup", endDrag);
canvas.addEventListener("touchstart", startDrag);
canvas.addEventListener("touchmove", onDrag);
canvas.addEventListener("touchend", endDrag);

function startDrag(e) {
  const { x, y } = getMousePos(e);
  for (let i = tiles.length - 1; i >= 0; i--) {
    const t = tiles[i];
    if (x > t.x && x < t.x + TILE_W && y > t.y && y < t.y + TILE_H) {
      dragged = t;
      offsetX = x - t.x;
      offsetY = y - t.y;
      tiles.splice(i, 1);
      tiles.push(t);
      break;
    }
  }
}

function onDrag(e) {
  if (!dragged) return;
  const { x, y } = getMousePos(e);
  dragged.x = x - offsetX;
  dragged.y = y - offsetY;
  draw();
}

function endDrag() {
  dragged = null;
  draw();
}

window.onload = loadPuzzle;
