export default async function fetchData({ page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  })
  const url = `https://api.freeapi.app/api/v1/public/randomjokes?${params.toString()}`
  const res = await fetch(url, { cache: 'no-store' })

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  const data = await res.json()
  return data
}
