import { allowCors } from '../../cors/corsHelper'
import { auth } from '../../auth/authHandler'
import { ApiHandlerOpts } from '../../types/apiHandlerOpts'

const handler = async function handler(opts: ApiHandlerOpts): Promise<void> {
    const { res, req, user, jwtPayload, client } = opts
    if (user) {
        if (req.method == 'PUT') {
            const reqBody = JSON.parse(req.body)
            if (reqBody.charity) {
                const charity = reqBody.charity
                if (!(charity >= 10 && charity <= 75)) {
                    res.status(400)
                    return
                }

                await client.query(
                    `
              UPDATE users
              SET charity = $1
              WHERE id = $2;
          `,
                    [charity, user.id],
                )
            }
            if (reqBody.winner) {
                await client.query(
                    `
              UPDATE users
              SET winner = $1
              WHERE id = $2;
          `,
                    [reqBody.winner, user.id],
                )
            }
            res.status(200).json({ ok: 123 })
            return
        }

        res.status(200).json(user)
        return
    }

    const nyBruker = await client.query(
        `
        INSERT INTO users (firebase_user_id, picture, active, email, name, admin, paid, charity, winner)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [jwtPayload.sub, jwtPayload.picture, true, jwtPayload.email, jwtPayload.name, false, true, 50, 'USA'],
    )

    const matchIds = (await client.query(' select id from matches')).rows

    for (let i = 0; i < matchIds.length; i++) {
        await client.query(
            `
          INSERT INTO bets (user_id, match_id)
          VALUES ($1, $2) RETURNING *`,
            [nyBruker.rows[0].id, matchIds[i].id],
        )
    }

    res.status(200).json(nyBruker.rows[0])
}

export default allowCors(auth(handler))
