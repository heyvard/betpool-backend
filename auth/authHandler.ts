import { VercelRequest, VercelResponse } from '@vercel/node'
import knex from 'knex'

import { ApiHandlerOpts } from '../types/apiHandlerOpts'
import config from '../knexfile'
import { User } from '../types/db'

import { verifiserIdToken } from './verifiserIdToken'

let globalvar: null | number

export function auth(fn: { (opts: ApiHandlerOpts): Promise<void> }) {
    return async (req: VercelRequest, res: VercelResponse) => {
        if (globalvar == null) {
            console.log('global var er null')
            globalvar = Date.now()
            console.log('global var satt til ' + globalvar)
        } else {
            console.log('global var er ' + globalvar)
        }
        const start = Date.now()
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
        const verifsert = Date.now()

        const knexen = knex(config)
        const dbkobling = Date.now()

        const user = (await knexen
            .select('*')
            .from('users')
            .where('firebase_user_id', verifisert.payload.sub)
            .first()) as User | undefined
        const etterUser = Date.now()

        await fn({ req, res, jwtPayload: verifisert.payload, knex: knexen, user })
        const etterKoden = Date.now()
        console.log(
            `${req.url} Verifisering: ${verifsert - start}  - Db: ${dbkobling - verifsert}  - user: ${
                etterUser - dbkobling
            }  - kode: ${etterKoden - etterUser}  - `,
        )
        knexen.destroy().then()
    }
}
