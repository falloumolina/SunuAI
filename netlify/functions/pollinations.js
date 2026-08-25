export default async (req) => {
  const body = await req.json()
  const res = await fetch('https://text.pollinations.ai/openai', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.POLLINATIONS_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  return new Response(res.body, { 
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
