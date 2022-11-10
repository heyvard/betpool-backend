import { allowCors } from '../../../../cors/corsHelper'
import { auth } from '../../../../auth/authHandler'
import { ApiHandlerOpts } from '../../../../types/apiHandlerOpts'

const handler = async function handler(opts: ApiHandlerOpts): Promise<void> {
    const { user, res, req, client } = opts

    if (!user) {
        res.status(401)
        return
    }

    const { id } = req.query
    if (!user) {
        res.status(401)
        return
    }
    const reqBody = JSON.parse(req.body)

    await client.query(
        `
        UPDATE bets
        SET home_score = $1,
            away_score = $2
        WHERE user_id = $3
          AND id = $4;
    `,
        [reqBody.home_score, reqBody.away_score, user.id, id],
    )
    res.status(200).json({ ok: 123 })
}
export default allowCors(auth(handler))
