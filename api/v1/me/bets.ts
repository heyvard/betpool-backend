import { allowCors } from '../../../cors/corsHelper'
import { auth } from '../../../auth/authHandlerPg'
import { ApiHandlerOptsPg } from '../../../types/apiHandlerOptsv2'

const handler = async function handler(opts: ApiHandlerOptsPg): Promise<void> {
    const { user, res, client } = opts

    if (!user) {
        res.status(401)
        return
    }

    const upcoming = (
        await client.query(
            `
          SELECT m.game_start,
                 m.away_team,
                 m.home_team,
                 b.home_score,
                 b.away_score,
                 b.match_id,
                 b.id bet_id
          FROM bets b,
               matches m
          WHERE b.user_id = $1
            AND b.match_id = m.id
          ORDER BY game_start, m.id asc;`,
            [user?.id],
        )
    ).rows
    res.status(200).json(upcoming)
}
export default allowCors(auth(handler))
