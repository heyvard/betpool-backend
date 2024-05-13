import dayjs from 'dayjs';
import { allowCors } from '../../cors/corsHelper';
import { auth } from '../../auth/authHandler';
const handler = async function handler(opts) {
    const { res, user, client } = opts;
    if (!user) {
        res.status(401);
        return;
    }
    async function getBets() {
        return (await client.query(`
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
               matches m,
               users u
          WHERE b.match_id = m.id
            AND game_start < now()
            AND u.id = b.user_id
            AND u.active is true;`)).rows;
    }
    async function getUsers() {
        return (await client.query(`
          SELECT u.id, u.name, u.picture, u.winner, u.topscorer
          FROM users u
          WHERE u.active is true`)).rows;
    }
    const alt = await Promise.all([getBets(), getUsers()]);
    if (dayjs('2022-11-25T10:00:00.000Z').isAfter(dayjs())) {
        alt[1].forEach((a) => {
            delete a.winner;
            delete a.topscorer;
        });
    }
    res.json({ bets: alt[0], users: alt[1] });
};
export default allowCors(auth(handler));
