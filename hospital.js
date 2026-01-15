import { query } from './database.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { patient_name, age, diagnosis } = req.body;
      if (!patient_name || !diagnosis) return res.status(400).json({ error: 'Invalid payload' });
      const result = await query(
        `INSERT INTO hospital_records (patient_name, age, diagnosis)
         VALUES ($1, $2, $3) RETURNING *`,
        [patient_name, age, diagnosis]
      );
      return res.status(201).json(result.rows[0]);
    }

    if (req.method === 'GET') {
      const result = await query(`SELECT * FROM hospital_records ORDER BY id DESC`);
      return res.status(200).json(result.rows);
    }

    if (req.method === 'PUT') {
      const { id, diagnosis } = req.body;
      const result = await query(
        `UPDATE hospital_records SET diagnosis=$1 WHERE id=$2 RETURNING *`,
        [diagnosis, id]
      );
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await query(`DELETE FROM hospital_records WHERE id=$1`, [id]);
      return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end();

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
