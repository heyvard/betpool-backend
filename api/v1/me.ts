import { VercelRequest, VercelResponse } from '@vercel/node'
import knex from 'knex'

import config from '../../knexfile.js'
import { verifiserIdToken } from '../../auth/verifiserIdToken'
import { allowCors } from '../../cors/corsHelper'

const handler = async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
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

    const user = await knexen.select('*').from('users').where('firebase_user_id', verifisert.payload.sub)

    if (user.length === 1) {
        res.status(200).json(user[0])
        knexen.destroy().then()
        return
    }

    const nyBruker = await knexen
        .insert({
            name: verifisert.payload.name,
            email: verifisert.payload.email,
            picture: verifisert.payload.picture,
            firebase_user_id: verifisert.payload.sub,
            admin: false,
            active: true,
        })
        .into('users')
        .returning('*')

    const matchIds = await knexen.select('id').from('matches')

    const userBets = []

    for (let i = 0; i < matchIds.length; i++) {
        userBets.push({ user_id: nyBruker[0].id + '', match_id: matchIds[i].id + '' })
    }

    await knexen('bets').insert(userBets)

    res.status(200).json(nyBruker[0])
    knexen.destroy().then()
}

export default allowCors(handler)
