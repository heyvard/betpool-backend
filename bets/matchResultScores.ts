/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-ts-comment */
export function matchResultScores(allBets: any): any {
  const matchMap = {}
  const poengTilDeling = 10
  const maxpoeng = 5
  const minpoeng = 2
  // @ts-ignore
  allBets.forEach((bet: any) => (matchMap[bet.match_id] = []))

  // @ts-ignore
  allBets.forEach((bet) => matchMap[bet.match_id].push(bet))

  const processedMatches = {}

  Object.keys(matchMap).forEach(function (key) {
    let correctResult = 0
    // @ts-ignore
    matchMap[key].forEach(function (bet) {
      if (bet.home_score === bet.home_result && bet.away_score === bet.away_result) {
        correctResult++
      }
    })
    const grunnpoeng = Math.ceil(poengTilDeling / Math.max(correctResult, 1))
    // @ts-ignore
    processedMatches[key] = Math.max(Math.min(grunnpoeng, maxpoeng), minpoeng)
  })

  return processedMatches
}
