/* eslint-disable @typescript-eslint/no-explicit-any */

import { matchResultScores } from '../../bets/matchResultScores'
import { allowCors } from '../../cors/corsHelper'
import { scoreCalculator } from '../../bets/scoreCalculator'
import { auth } from '../../auth/authHandler'
import { ApiHandlerOpts } from '../../types/apiHandlerOpts'

const handler = async function handler(opts: ApiHandlerOpts): Promise<void> {
    const { res, knex } = opts

    async function getAllBets(): Promise<any> {
        return (
            await knex.raw(`
          SELECT u.id         userid,
                 u.name,
                 u.picture,
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
          WHERE b.user_id = u.id
            AND b.match_id = m.id
            AND game_start < now();`)
        ).rows
    }

    async function getEmptyBoard(): Promise<any> {
        return (
            await knex.raw(`
          SELECT u.id userid, u.name, u.picture, 0.0 score
          FROM users u`)
        ).rows
    }

    const allBets = await getAllBets()
    if (allBets.length === 0) {
        const emptyBoard = await getEmptyBoard()
        res.status(200).json(emptyBoard)
        return
    }

    const matchScoreMap = matchResultScores(allBets)

    const personMap = {}

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    allBets.forEach((bet) => (personMap[bet.userid] = []))

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    allBets.forEach((bet) => personMap[bet.userid].push(bet))

    const processedPersons = [] as any[]

    Object.keys(personMap).forEach(function (key) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const calculated = scoreCalculator(personMap[key], matchScoreMap)
        processedPersons.push(calculated)
        // key: the name of the object key
        // index: the ordinal position of the key within the object
    })

    const personsFlat = processedPersons.map(function (bets) {
        const person = { name: bets[0].name, picture: bets[0].picture, userid: bets[0].userid, score: 0.0 }
        bets.forEach(function (bet: any) {
            person.score += bet.score
        })
        return person
    })

    function compare(a: any, b: any): number {
        if (a.score < b.score) {
            return 1
        }
        if (a.score > b.score) {
            return -1
        }
        // a must be equal to b
        return a.name.localeCompare(b.name)
    }

    personsFlat.sort(compare)

    res.json(personsFlat)
}

export default allowCors(auth(handler))
