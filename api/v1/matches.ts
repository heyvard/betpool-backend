import type { VercelRequest, VercelResponse } from '@vercel/node'
import knex from 'knex'

import config from '../../knexfile.js'
import { allowCors } from '../../cors/corsHelper'

const handler = async function (req: VercelRequest, res: VercelResponse): Promise<void> {
    const knexen = knex(config)
    const matches = (
        await knexen.raw(
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

    await knexen.destroy()
}
export default allowCors(handler)
