import { VercelRequest, VercelResponse } from '@vercel/node'
import { JWTPayload } from 'jose'
import { Knex } from 'knex'

import { User } from './db'

export interface ApiHandlerOpts {
    req: VercelRequest
    res: VercelResponse
    jwtPayload: JWTPayload
    knex: Knex
    user?: User
}
