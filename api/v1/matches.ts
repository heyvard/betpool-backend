import { allowCors } from '../../cors/corsHelper'
import { auth } from '../../auth/authHandler'
import { ApiHandlerOpts } from '../../types/apiHandlerOpts'

const handler = async function handler(opts: ApiHandlerOpts): Promise<void> {
    const { res, knex } = opts

    const matches = (
        await knex.raw(
            `
          SELECT m.game_start,
                 m.away_team,
                 m.home_team,
                 m.channel
          FROM bets b,
               matches m
          ORDER BY game_start, m.id asc;`,
        )
    ).rows

    res.json(matches)
}
export default allowCors(auth(handler))
