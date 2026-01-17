import { Hono } from 'hono'
import db from '../db/index.js'

const route = new Hono()

/* =========================
   READ ALL
========================= */
route.get('/', (c) => {
  const positions = db
    .prepare('SELECT * FROM Position ORDER BY PositionID DESC')
    .all()

  return c.json(positions)
})

/* =========================
   READ BY ID
========================= */
route.get('/:id', (c) => {
  const position = db
    .prepare('SELECT * FROM Position WHERE PositionID = ?')
    .get(c.req.param('id'))

  if (!position) {
    return c.json({ message: 'Position not found' }, 404)
  }

  return c.json(position)
})

/* =========================
   CREATE
========================= */
route.post('/', async (c) => {
  const { title, description, level } = await c.req.json()

  if (!title || level === undefined) {
    return c.json(
      { message: 'Title and Level are required' },
      400
    )
  }

  const result = db.prepare(`
    INSERT INTO Position (Title, Description, Level)
    VALUES (?, ?, ?)
  `).run(title, description, level)

  return c.json(
    {
      message: 'Position created',
      PositionID: result.lastInsertRowid
    },
    201
  )
})

/* =========================
   UPDATE
========================= */
route.put('/:id', async (c) => {
  const { title, description, level } = await c.req.json()

  const result = db.prepare(`
    UPDATE Position
    SET Title = ?, Description = ?, Level = ?
    WHERE PositionID = ?
  `).run(title, description, level, c.req.param('id'))

  if (result.changes === 0) {
    return c.json({ message: 'Position not found' }, 404)
  }

  return c.json({ message: 'Position updated' })
})

/* =========================
   DELETE
========================= */
route.delete('/:id', (c) => {
  const result = db
    .prepare('DELETE FROM Position WHERE PositionID = ?')
    .run(c.req.param('id'))

  if (result.changes === 0) {
    return c.json({ message: 'Position not found' }, 404)
  }

  return c.json({ message: 'Position deleted' })
})

export default route
