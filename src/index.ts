import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import PositionRoute from './Position/index.js'


const app = new Hono()


app.route('/position', PositionRoute)

serve(
  {
    fetch: app.fetch,
    port: 3000
  },
  (info) => {
    console.log(`Server running on :${info.port}`)
  }
)
