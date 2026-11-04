// Explicit HTTP response: Netlify redirect status is not a 410 response.
exports.handler = async () => ({ statusCode: 410, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex', 'Cache-Control': 'public, max-age=3600' }, body: 'Gone — este contenido del antiguo sitio ya no existe.' });
