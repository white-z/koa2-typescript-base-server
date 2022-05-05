import log from '../utils/log4js'
import {createClient} from 'redis'

export const client = createClient({
  url: 'redis://127.0.0.1:6379'
})
client.on('error', (err) => log.error('Redis Client Error', err));