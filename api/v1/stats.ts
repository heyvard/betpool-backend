import { allowCors } from '../../cors/corsHelper'
import { auth } from '../../auth/authHandler'
import { ApiHandlerOpts } from '../../types/apiHandlerOpts'

const handler = async function handler(opts: ApiHandlerOpts): Promise<void> {
    const { user, res, client } = opts

    if (!user) {
        res.status(401)
        return
    }

    const ids = (await client.query('SELECT id from users where active is true')).rows
    res.json(ids)
}
export default allowCors(auth(handler))
