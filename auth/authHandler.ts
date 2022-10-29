import { VercelRequest, VercelResponse } from '@vercel/node'
import knex from 'knex'

import { ApiHandlerOpts } from '../types/apiHandlerOpts'
import config from '../knexfile'
import { User } from '../types/db'

import { verifiserIdToken } from './verifiserIdToken'

export function auth(fn: { (opts: ApiHandlerOpts): Promise<void> }) {
    return async (req: VercelRequest, res: VercelResponse) => {
        const authheader = req.headers.authorization
        if (!authheader) {
            res.status(401)
            return
        }

        const verifisert = await verifiserIdToken(authheader.split(' ')[1])
        if (!verifisert) {
            res.status(401)
            return
        }
        const knexen = knex(config)

        const user = (await knexen
            .select('*')
            .from('users')
            .where('firebase_user_id', verifisert.payload.sub)
            .first()) as User | undefined

        await fn({ req, res, jwtPayload: verifisert.payload, knex: knexen, user })
        knexen.destroy().then()
    }
}
