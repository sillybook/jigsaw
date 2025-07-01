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
  ctx.clearRect(0, 0, canvas.width
