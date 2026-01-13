const express = require('express');
const router = express.Router();
const jobsCtrl = require('../controllers/jobsController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', jobsCtrl.listJobs);
router.get('/:id', jobsCtrl.getJob);
router.post('/', authMiddleware, jobsCtrl.createJob);
router.put('/:id', authMiddleware, jobsCtrl.updateJob);
router.delete('/:id', authMiddleware, jobsCtrl.deleteJob);

module.exports = router;
