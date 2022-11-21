import { allowCors } from '../../../cors/corsHelper'
import { auth } from '../../../auth/authHandler'
import { ApiHandlerOpts } from '../../../types/apiHandlerOpts'

const handler = async function handler(opts: ApiHandlerOpts): Promise<void> {
    const { user, res, req, client } = opts

    if (!user) {
        res.status(401)
        return
    }

    if (!user.admin) {
        res.status(403)
        return
    }

    const { id } = req.query

    const reqBody = JSON.parse(req.body)

    await client.query(
        `
        UPDATE matches
        SET home_score = $1,
            away_score = $2
        WHERE  id = $3;
    `,
        [reqBody.home_score, reqBody.away_score, id],
    )
    res.status(200).json({ ok: 123 })
}
export default allowCors(auth(handler))
