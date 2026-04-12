export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { idea, theme, products } = req.body;
    if (!idea) return res.status(400).json({ error: 'Idea is required.' });

    try {
        const themeStr = theme ? `, ${theme} aesthetic` : '';
        const productStr = products ? ` featuring ${products}` : '';
        const base = `${idea}${themeStr}${productStr}`;

        const prompts = [
            { label: 'Hero Concept', prompt: `A stunning homepage hero section design for ${base}. Cinematic composition with dramatic lighting, bold headline typography, prominent call-to-action button, immersive visual atmosphere with rich color palette and depth. Professional website design mockup, high fidelity, ultra detailed.` },
            { label: 'Color Story', prompt: `An abstract color palette and mood visualization for ${base}. Gradient washes, textured surfaces, layered transparency, swatches of the dominant and accent colors arranged in an artistic composition. Design inspiration board, sophisticated tones, atmospheric lighting.` },
            { label: 'Product Layout', prompt: `A product showcase section layout for ${base}. Grid or card-based arrangement displaying products with elegant spacing, subtle shadows, clean typography labels, and refined background. Modern e-commerce website design, premium feel, studio-quality presentation.` },
            { label: 'Typography Study', prompt: `A typography and brand identity exploration for ${base}. Display of headline and body font pairings, text hierarchy samples, decorative lettering, logo placement concepts. Editorial design style, contrasting weights and sizes, sophisticated type arrangement.` }
        ];

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
        res.status(500).json({ error: 'Failed to generate moodboard', detail: err.message });
    }
}
