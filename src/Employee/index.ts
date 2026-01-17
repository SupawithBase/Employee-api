import { Hono } from 'hono'
import db from '../db/index.js'

const route = new Hono()

/* =========================
   READ ALL
========================= */
route.get('/', (c) => {
  const employees = db
    .prepare('SELECT * FROM Employee ORDER BY EmployeeID DESC')
    .all()

  return c.json(employees)
})

/* =========================
   READ BY ID
========================= */
route.get('/:id', (c) => {
  const employee = db
    .prepare('SELECT * FROM Employee WHERE EmployeeID = ?')
    .get(c.req.param('id'))

  if (!employee) {
    return c.json({ message: 'Employee not found' }, 404)
  }

  return c.json(employee)
})

/* =========================
   CREATE
========================= */
route.post('/', async (c) => {
  const { firstName, lastName, position, salary, hireDate } = await c.req.json()

  if (!firstName || !lastName) {
    return c.json(
      { message: 'FirstName and LastName are required' },
      400
    )
  }

  const result = db.prepare(`
    INSERT INTO Employee (FirstName, LastName, Position, Salary, HireDate)
    VALUES (?, ?, ?, ?, ?)
  `).run(firstName, lastName, position, salary, hireDate)

  return c.json(
    {
      message: 'Employee created',
      EmployeeID: result.lastInsertRowid
    },
    201
  )
})

/* =========================
   UPDATE
========================= */
route.put('/:id', async (c) => {
  const { firstName, lastName, position, salary, hireDate } = await c.req.json()

  const result = db.prepare(`
    UPDATE Employee
    SET FirstName = ?, LastName = ?, Position = ?, Salary = ?, HireDate = ?
    WHERE EmployeeID = ?
  `).run(firstName, lastName, position, salary, hireDate, c.req.param('id'))

  if (result.changes === 0) {
    return c.json({ message: 'Employee not found' }, 404)
  }

  return c.json({ message: 'Employee updated' })
})

/* =========================
   DELETE
========================= */
route.delete('/:id', (c) => {
  const result = db
    .prepare('DELETE FROM Employee WHERE EmployeeID = ?')
    .run(c.req.param('id'))

  if (result.changes === 0) {
    return c.json({ message: 'Employee not found' }, 404)
  }

  return c.json({ message: 'Employee deleted' })
})

export default route
