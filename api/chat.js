export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  if (req.headers["x-api-key"] !== process.env.API_PASSKEY)
    return res.status(401).json({ error: "Unauthorized" });

  try {
    const { message } = req.body;

    if (!message)
      return res.status(400).json({ error: "Message is required" });

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await r.json();

    if (!r.ok)
      return res.status(r.status).json({
        error: data.error?.message || "Groq error"
      });

    res.json({
      response: data.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
