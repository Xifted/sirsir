const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

const PAGE_SIZE = 10;

router.get('/', async (req, res) => {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * PAGE_SIZE;

    // Sorting (whitelisted)
    const sort = req.query.sort || null;
    const order = req.query.order === 'asc' ? 'ASC' : 'DESC';

    const sortableColumns = {
        user: 'username',
        cooldown: 'cooldown_until'
    };

    const sortColumn = sortableColumns[sort] || 'id';


    // Total rows
    const [[{ total }]] = await db.query(
        "SELECT COUNT(*) as total FROM accounts"
    );

    // Main query
    const [accounts] = await db.query(`
    SELECT *,
      CASE
        WHEN status='BANNED' THEN 'BANNED'
        WHEN status='COOLDOWN' AND cooldown_until > NOW() THEN 'COOLDOWN'
        ELSE 'READY'
      END AS display_status
    FROM accounts
    ORDER BY ${sortColumn} ${order}
    LIMIT ? OFFSET ?
  `, [PAGE_SIZE, offset]);

    // Render
    res.render('index', {
        accounts,
        page,
        totalPages: Math.ceil(total / PAGE_SIZE),
        sort,
        order
    });
});

/* ADD ACCOUNT */
router.post('/add', async (req, res) => {
    const { username, password } = req.body;

    await db.query(
        "INSERT INTO accounts (username, password) VALUES (?, ?)",
        [username, password]
    );

    res.redirect('/');
});

/* ACCOUNT ACTIONS */
router.post('/action', async (req, res) => {
    const { id, type, hours } = req.body;

    // Set cooldown
    if (type === 'COOLDOWN') {
        const h = parseInt(hours);

        // Validate custom hours
        if (isNaN(h) || h <= 0) {
            return res.redirect('/');
        }

        await db.query(`
      UPDATE accounts
      SET status='COOLDOWN',
          cooldown_start=NOW(),
          cooldown_until=DATE_ADD(NOW(), INTERVAL ? HOUR)
      WHERE id=?
    `, [h, id]);
    }

    // Permanent ban
    if (type === 'BANNED') {
        await db.query(`
      UPDATE accounts
      SET status='BANNED',
          cooldown_start=NULL,
          cooldown_until=NULL
      WHERE id=?
    `, [id]);
    }

    // Reset status
    if (type === 'RESET') {
        await db.query(`
      UPDATE accounts
      SET status='READY',
          cooldown_start=NULL,
          cooldown_until=NULL
      WHERE id=?
    `, [id]);
    }

    // Delete account
    if (type === 'DELETE') {
        await db.query(
            "DELETE FROM accounts WHERE id=?",
            [id]
        );
    }

    res.redirect('/');
});

module.exports = router;