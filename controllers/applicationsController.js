const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Application = require('../models/Application');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random()*1e9) + ext);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

const apply = [
  upload.single('resume'),
  async (req, res) => {
    try {
      const { job_id, cover_letter } = req.body;
      const user_id = req.user.id;
      if (!job_id) return res.status(400).json({ error: 'job_id required' });

      const resume_path = req.file ? `/uploads/${req.file.filename}` : null;
      const appId = await Application.createApplication({ job_id, user_id, cover_letter, resume_path });
      res.json({ id: appId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
];

const getForJob = async (req, res) => {
  try {
    const job_id = req.params.jobId;
    const apps = await Application.getApplicationsForJob(job_id);
    res.json({ applications: apps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { apply, getForJob };
