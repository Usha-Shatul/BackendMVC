const pool = require('../config/database');

const createJob = async (job) => {
  const { title, company, location, type, salary, description, posted_by } = job;
  const [result] = await pool.query(
    `INSERT INTO jobs (title, company, location, type, salary, description, posted_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, company, location, type, salary, description, posted_by]
  );
  return result.insertId;
};

const getJobById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [id]);
  return rows[0];
};

const searchJobs = async ({ query = '', page = 1, limit = 10, filters = {} }) => {
  const offset = (page - 1) * limit;
  let where = 'WHERE 1=1';
  const params = [];

  if (query) {
    where += ' AND (title LIKE ? OR company LIKE ? OR description LIKE ? OR location LIKE ?)';
    const q = `%${query}%`;
    params.push(q, q, q, q);
  }

  if (filters.type) {
    where += ' AND type = ?';
    params.push(filters.type);
  }
  if (filters.location) {
    where += ' AND location LIKE ?';
    params.push(`%${filters.location}%`);
  }

  const [jobs] = await pool.query(`SELECT * FROM jobs ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(limit), Number(offset)]);
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM jobs ${where}`, params);
  return { jobs, total };
};

const updateJob = async (id, fields) => {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const sql = `UPDATE jobs SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
  const params = [...keys.map(k => fields[k]), id];
  await pool.query(sql, params);
};

const deleteJob = async (id) => {
  await pool.query('DELETE FROM jobs WHERE id = ?', [id]);
};

module.exports = { createJob, getJobById, searchJobs, updateJob, deleteJob };
