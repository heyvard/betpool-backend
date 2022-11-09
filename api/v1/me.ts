import { allowCors } from '../../cors/corsHelper'
import { auth } from '../../auth/authHandler'
import { ApiHandlerOpts } from '../../types/apiHandlerOpts'

const handler = async function handler(opts: ApiHandlerOpts): Promise<void> {
    const { user, res, knex, jwtPayload, req } = opts
    if (user) {
        if (req.method == 'PUT') {
            const reqBody = JSON.parse(req.body)
            const charity = reqBody.charity
            if (!(charity >= 10 && charity <= 75)) {
                res.status(400)
                return
            }
            const oppdatert = await knex('users').where('id', '=', user.id).update({
                charity: charity,
            })
            res.status(200).json(oppdatert)
            return
        }

        res.status(200).json(user)
        return
    }

    const nyBruker = await knex
        .insert({
            name: jwtPayload.name,
            email: jwtPayload.email,
            picture: jwtPayload.picture,
            firebase_user_id: jwtPayload.sub,
            admin: false,
            active: true,
            charity: 50,
            paid: false,
        })
        .into('users')
        .returning('*')

    const matchIds = await knex.select('id').from('matches')

    const userBets = []

    for (let i = 0; i < matchIds.length; i++) {
        userBets.push({ user_id: nyBruker[0].id + '', match_id: matchIds[i].id + '' })
    }

    await knex('bets').insert(userBets)

    res.status(200).json(nyBruker[0])
}

export default allowCors(auth(handler))
