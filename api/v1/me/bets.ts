import { allowCors } from '../../../cors/corsHelper'
import { auth } from '../../../auth/authHandler'
import { ApiHandlerOpts } from '../../../types/apiHandlerOpts'

const handler = async function handler(opts: ApiHandlerOpts): Promise<void> {
    const { user, res, knex } = opts

    const upcoming = (
        await knex.raw(
            `
          SELECT m.game_start,
                 m.away_team,
                 m.home_team,
                 b.home_score,
                 b.away_score,
                 b.match_id,
                 b.id bet_id,
                 m.channel
          FROM bets b,
               matches m
          WHERE b.user_id = ?
            AND b.match_id = m.id
          ORDER BY game_start, m.id asc;`,
            [user?.id],
        )
    ).rows
    res.status(200).json(upcoming)
}
export default allowCors(auth(handler))
