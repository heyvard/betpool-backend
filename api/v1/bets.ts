import { allowCors } from '../../cors/corsHelper'
import { ApiHandlerOptsPg } from '../../types/apiHandlerOptsv2'
import { auth } from '../../auth/authHandlerPg'

const handler = async function handler(opts: ApiHandlerOptsPg): Promise<void> {
    const { res, user, client } = opts
    if (!user) {
        res.status(401)
        return
    }

    interface Bet {
        user_id: string
        match_id: string
        game_start: string
    }

    async function getBets(): Promise<Bet[]> {
        return (
            await client.query(`
          SELECT b.user_id,
                 b.match_id,
                 m.game_start,
                 m.away_team,
                 m.home_team,
                 b.home_score,
                 b.away_score,
                 m.round,
                 m.home_score home_result,
                 m.away_score away_result
          FROM bets b,
               matches m
          WHERE b.match_id = m.id
            AND game_start < now();`)
        ).rows
    }

    interface User {
        id: string
        name: string
        picture: string
    }

    async function getUsers(): Promise<User[]> {
        return (
            await client.query(`
          SELECT u.id, u.name, u.picture
          FROM users u`)
        ).rows
    }

    const alt = await Promise.all([getBets(), getUsers()])

    res.json({ bets: alt[0], users: alt[1] })
}

export default allowCors(auth(handler))
