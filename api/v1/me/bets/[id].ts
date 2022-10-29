import { allowCors } from '../../../../cors/corsHelper'
import { auth } from '../../../../auth/authHandler'
import { ApiHandlerOpts } from '../../../../types/apiHandlerOpts'

const handler = async function handler(opts: ApiHandlerOpts): Promise<void> {
    const { res, req, knex, user } = opts
    const { id } = req.query
    if (!user) {
        res.status(401)
        return
    }
    const reqBody = JSON.parse(req.body)
    const bet = {
        home_score: reqBody.home_score,
        away_score: reqBody.away_score,
    }
    await knex('bets').where('user_id', '=', user.id).where('id', '=', id).update(bet)
    res.status(200).json(bet)
}
export default allowCors(auth(handler))
