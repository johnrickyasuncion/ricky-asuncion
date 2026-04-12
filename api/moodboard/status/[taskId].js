export default async function handler(req, res) {
    const { taskId } = req.query;

    try {
        const response = await fetch(
            `${process.env.KIE_TASK_STATUS_ENDPOINT}?taskId=${taskId}`,
            { headers: { 'Authorization': `Bearer ${process.env.KIE_API_KEY}` } }
        );
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to check task status' });
    }
}
