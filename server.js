
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors package

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/dailyreportapp');

const reportSchema = new mongoose.Schema({
  slNo: Number,
  time: String,
  staff: String,
  subject: String,
  topicCovered: String,
  date: String,
  semester: Number,
  department: String, // Add department field
});

const Report = mongoose.model('Report', reportSchema);


app.use(express.static('public'));

app.post('/save-data', (req, res) => {
  const dataToSave = req.body;

Report.insertMany(dataToSave)
  .then(result => {
    console.log('Data saved successfully:', result);
    return res.json({ success: true });
  })
  .catch(err => {
    console.error('Error saving data:', err);
    return res.status(500).json({ error: 'Failed to save data' });
  });

});

app.get('/get-data', async (req, res) => {
    const { date, semester, department } = req.query;
    console.log('Received request for department:', department, 'date:', date, 'semester:', semester);

    try {
        const data = await Report.find({ date, semester, department }).exec();
        console.log('Fetched data:', data); // Add this line for logging
        return res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Failed to fetch data' });
    }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
