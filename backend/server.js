const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data directory path
const DATA_DIR = path.join(__dirname, '../frontend/src/data');

// GET endpoint to read JSON files
app.get('/api/data/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const filePath = path.join(DATA_DIR, `${type}.json`);
    
    const data = await fs.readFile(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Failed to read data file' });
  }
});

// POST endpoint to save JSON files
app.post('/api/data/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const data = req.body;
    
    const filePath = path.join(DATA_DIR, `${type}.json`);
    
    // Write the data to the JSON file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    console.log(`Saved ${type}.json successfully`);
    res.json({ success: true, message: `${type} data saved successfully` });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data file' });
  }
});

// GET endpoint to list available data types
app.get('/api/data', async (req, res) => {
  try {
    const files = await fs.readdir(DATA_DIR);
    const dataTypes = files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
    
    res.json({ dataTypes });
  } catch (error) {
    console.error('Error listing data types:', error);
    res.status(500).json({ error: 'Failed to list data types' });
  }
});

app.listen(PORT, () => {
  console.log(`Data Manager API server running on http://localhost:${PORT}`);
}); 