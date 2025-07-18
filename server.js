const express = require('express');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const IMAGE_PATH = path.join(__dirname, 'image', 'i dont know.png');
const ROWS = 5;
const COLS = 5;

app.use(express.static('public'));

app.get('/api/tiles', async (req, res) => {
  try {
    const imgBuffer = fs.readFileSync(IMAGE_PATH);
    const metadata = await sharp(imgBuffer).metadata();

    const tileWidth = Math.floor(metadata.width / COLS);
    const tileHeight = Math.floor(metadata.height / ROWS);

    const tiles = [];

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const tileBuffer = await sharp(imgBuffer)
          .extract({ left: col * tileWidth, top: row * tileHeight, width: tileWidth, height: tileHeight })
          .toBuffer();

        const base64 = tileBuffer.toString('base64');
        tiles.push({
          row,
          col,
          img: `data:image/png;base64,${base64}`
        });
      }
    }

    // Shuffle tiles
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    res.json({ tiles, rows: ROWS, cols: COLS });
  } catch (err) {
    console.error('Tile generation failed:', err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
