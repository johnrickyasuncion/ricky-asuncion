import Anthropic from '@anthropic-ai/sdk';

const HTML_GEN_SYSTEM_PROMPT = `You are an expert web designer who creates stunning, production-quality website homepage designs as standalone HTML files.

REQUIREMENTS:
- Generate a COMPLETE, self-contained HTML file starting with <!DOCTYPE html>
- ALL CSS must be inline in a <style> tag within <head> — no external stylesheets except Google Fonts
- You may include ONE Google Fonts <link> tag for typography
- The page MUST be fully responsive (mobile, tablet, desktop)
- Use modern CSS: CSS Grid, Flexbox, custom properties, clamp(), media queries
- Create a FULL homepage layout with these sections:
  * Navigation bar (fixed or sticky)
  * Hero section with headline, subtext, and CTA button
  * Features or services section (3-4 items with icons using CSS shapes, inline SVG, or Unicode symbols)
  * About or story section
  * Testimonials or social proof section (2-3 quotes)
  * Call-to-action banner
  * Footer with link columns and copyright
- For images: use CSS gradients, geometric shapes, or inline SVG as visual placeholders — NEVER reference external image URLs
- Include subtle CSS animations and transitions (hover effects, smooth scrolls) for polish
- Use a cohesive color palette defined with CSS custom properties in :root
- Ensure proper semantic HTML (header, main, section, footer, nav)
- The design must look like a real, professionally designed website — not a wireframe or prototype

OUTPUT: Return ONLY the HTML code. No explanations, no markdown fences, no commentary. The response must start with <!DOCTYPE html> and end with </html>.`;

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt, name } = req.body;
    if (!prompt) return res.status(400).json({ error: 'prompt is required.' });

    try {
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 16384,
            system: HTML_GEN_SYSTEM_PROMPT,
            messages: [{ role: 'user', content: prompt }]
        });

        let html = message.content[0].text;

        const fenceMatch = html.match(/```html\s*([\s\S]*?)\s*```/);
        if (fenceMatch) {
            html = fenceMatch[1];
        } else {
            const genericMatch = html.match(/```\s*([\s\S]*?)\s*```/);
            if (genericMatch && genericMatch[1].trim().startsWith('<!DOCTYPE')) {
                html = genericMatch[1];
            }
        }

        html = html.trim();
        res.json({ html, prompt, name: name || 'Untitled Design' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate HTML design', detail: err.message });
    }
}
