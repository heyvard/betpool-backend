import { allowCors } from '../../../cors/corsHelper'
import { auth } from '../../../auth/authHandler'
import { ApiHandlerOpts } from '../../../types/apiHandlerOpts'

const handler = async function handler(opts: ApiHandlerOpts): Promise<void> {
    const { user, res, req, client } = opts

    if (!user) {
        res.status(401)
        return
    }

    if (!user.admin) {
        res.status(403)
        return
    }

    const { id } = req.query

    const reqBody = JSON.parse(req.body)

    if (typeof reqBody.paid !== 'undefined') {
        await client.query(
            `
                UPDATE users
                SET paid = $1
                WHERE id = $2;
            `,
            [reqBody.paid, id],
        )
    }

    res.status(200).json(reqBody)
}
export default allowCors(auth(handler))
