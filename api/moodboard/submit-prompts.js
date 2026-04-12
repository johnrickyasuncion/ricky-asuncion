export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompts } = req.body;
    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
        return res.status(400).json({ error: 'prompts array is required.' });
    }

    try {
        const tasks = await Promise.all(prompts.map(async (p) => {
            const response = await fetch(process.env.KIE_NANO_BANANA_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.KIE_API_KEY}` },
                body: JSON.stringify({ model: process.env.KIE_NANO_BANANA_MODEL, input: { prompt: p.prompt } })
            });
            const data = await response.json();
            const taskId = data.taskId || data.data?.taskId || data.task_id || data.id;
            return { taskId, prompt: p.prompt, label: p.label };
        }));

        res.json({ tasks });
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit prompts', detail: err.message });
    }
}
