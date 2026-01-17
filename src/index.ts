import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import EmployeeRoute from './Employee/index.js'


const app = new Hono()


app.route('/employee', EmployeeRoute)

serve(
  {
    fetch: app.fetch,
    port: 3000
  },
  (info) => {
    console.log(`Server running on :${info.port}`)
  }
)
