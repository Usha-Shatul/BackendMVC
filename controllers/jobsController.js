const Job = require('../models/Job');

const createJob = async (req, res) => {
  try {
    const { title, company, location, type, salary, description } = req.body;
    if (!title || !company) return res.status(400).json({ error: 'Title and company required' });

    const posted_by = req.user.id;
    const jobId = await Job.createJob({ title, company, location, type, salary, description, posted_by });
    res.json({ id: jobId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const listJobs = async (req, res) => {
  try {
    const { q, page = 1, limit = 10, type, location } = req.query;
    const { jobs, total } = await Job.searchJobs({
      query: q,
      page: Number(page),
      limit: Number(limit),
      filters: { type, location }
    });
    res.json({ jobs, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getJob = async (req, res) => {
  try {
    const job = await Job.getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateJob = async (req, res) => {
  try {
    const id = req.params.id;
    const fields = req.body;
    await Job.updateJob(id, fields);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteJob = async (req, res) => {
  try {
    await Job.deleteJob(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createJob, listJobs, getJob, updateJob, deleteJob };
