import { allowCors } from '../../cors/corsHelper'
import { auth } from '../../auth/authHandlerPg'
import { ApiHandlerOptsPg } from '../../types/apiHandlerOptsv2'

const handler = async function handler(opts: ApiHandlerOptsPg): Promise<void> {
    const { res, req, user, client } = opts
    if (!user) {
        res.status(401)
        return
    }
    if (req.method == 'POST') {
        const reqBody = JSON.parse(req.body)

        await client.query('INSERT INTO chat (message, user_id) VALUES ($1, $2)', [reqBody.message, user.id])
        res.status(201).json({ ok: ':)' })
        return
    }

    const chat = (
        await client.query(`
        SELECT u.id userid,
               u.name,
               u.picture,
               c.*
        FROM chat c,
             users u
        WHERE c.user_id = u.id
        ORDER BY c.created_at asc 
        `)
    ).rows

    res.json(chat)
}
export default allowCors(auth(handler))
