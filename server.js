const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { Tree } = require('./models/treeModel'); // assume sequelize instance is inside the model

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File upload config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Growth intervals (days)
const growthIntervals = {
  Neem: 7,
  Banyan: 10,
  Mango: 8,
};

// POST /upload
app.post('/upload', upload.single('treeImage'), async (req, res) => {
  try {
    const { userName, species, location } = req.body;
    const imagePath = `/uploads/${req.file.filename}`;
    const intervalDays = growthIntervals[species] || 7;

    const existingTree = await Tree.findOne({ where: { userName, species, location } });

    if (existingTree) {
      const now = new Date();
      const last = new Date(existingTree.lastUpdated);
      const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
      if (diff < intervalDays) {
        return res.status(400).json({
          message: `Wait ${intervalDays - diff} more day(s) to upload again.`,
        });
      }
    }

    const voucherCode = `${userName}-${Date.now()}`;

    await Tree.create({
      userName,
      species,
      location,
      imagePath,
      lastUpdated: new Date(),
      voucherCode,
    });

    res.json({ success: true, voucherCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /trees
app.get('/trees', async (req, res) => {
  try {
    const trees = await Tree.findAll();
    res.json(trees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not fetch trees' });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
