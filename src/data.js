export default async function fetchData() {
  const res = await fetch('https://api.freeapi.app/api/v1/public/quotes')

  const data = await res.json()
  console.log(data);

  return data
}