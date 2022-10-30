import { allowCors } from '../../cors/corsHelper'
import { auth } from '../../auth/authHandler'
import { ApiHandlerOpts } from '../../types/apiHandlerOpts'

const handler = async function handler(opts: ApiHandlerOpts): Promise<void> {
    const { res, req, user, knex } = opts
    if (!user) {
        res.status(401)
        return
    }
    if (req.method == 'POST') {
        const reqBody = JSON.parse(req.body)

        const data = {
            message: reqBody.message,
            user_id: user.id,
        }
        await knex('chat').insert(data)
        res.status(201).json(data)
    }

    const chat = (
        await knex.raw(`
        SELECT u.id userid,
               u.name,
               u.picture,
               c.*
        FROM chat c,
             users u
        WHERE c.user_id = u.id`)
    ).rows

    res.json(chat)
}
export default allowCors(auth(handler))
