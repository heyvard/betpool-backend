import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function (req: VercelRequest, res: VercelResponse): void {
  const { name = 'World' } = req.query
  res.send(`Hello ${name}!`)
}
