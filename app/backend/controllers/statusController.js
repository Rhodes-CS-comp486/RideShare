const Status = require('../models/Status');

const updateStatus = async (req, res) => {
  const { driverID, status } = req.body;

  if (!driverID || typeof status !== 'boolean') {
    return res.status(400).json({ error: 'Invalid request data.' });
  }

  try {
    const updatedStatus = await Status.updateStatus(driverID, status);
    res.status(200).json({ message: 'Status updated successfully', data: updatedStatus });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getStatus = async (req, res) => {
  const { driverID } = req.params;

  if (!driverID) {
    return res.status(400).json({ error: 'Driver ID is required.' });
  }

  try {
    const driverStatus = await Status.getStatus(driverID);
    if (!driverStatus) {
      return res.status(404).json({ error: 'Driver not found.' });
    }
    res.status(200).json({ status: driverStatus });
  } catch (error) {
    console.error('Error fetching status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { updateStatus, getStatus };
