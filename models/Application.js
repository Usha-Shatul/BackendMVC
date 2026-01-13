const pool = require('../config/database');

const createApplication = async ({ job_id, user_id, cover_letter, resume_path }) => {
  const [result] = await pool.query(
    `INSERT INTO applications (job_id, user_id, cover_letter, resume_path)
     VALUES (?, ?, ?, ?)`,
    [job_id, user_id, cover_letter, resume_path]
  );
  return result.insertId;
};

const getApplicationsForJob = async (job_id) => {
  const [rows] = await pool.query(
    `SELECT a.*, u.name as applicant_name, u.email as applicant_email
     FROM applications a
     JOIN users u ON u.id = a.user_id
     WHERE a.job_id = ? ORDER BY a.created_at DESC`,
    [job_id]
  );
  return rows;
};

module.exports = { createApplication, getApplicationsForJob };
