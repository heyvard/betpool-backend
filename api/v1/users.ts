import { ApiHandlerOpts } from '../../types/apiHandlerOpts'
import { allowCors } from '../../cors/corsHelper'
import { auth } from '../../auth/authHandler'

const handler = async function handler(opts: ApiHandlerOpts): Promise<void> {
    const { user, res, client } = opts

    if (!user) {
        res.status(401)
        return
    }

    if (!user.admin) {
        res.status(403)
        return
    }

    const users = (
        await client.query(
            `
                SELECT u.id,
                       u.email,
                       u.display_name,
                       u.paid,
                       u.admin,
                       u.active
                FROM users u`,
        )
    ).rows
    res.status(200).json(users)
}
export default allowCors(auth(handler))
