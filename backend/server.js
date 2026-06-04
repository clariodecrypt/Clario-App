const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { buildClarioPrompt } = require('./prompt');
const { generateHTML } = require('./htmlGenerator');

const app = express();
app.use(cors({ origin: '*' }));;
app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post('/generate', async (req, res) => {
  const product = req.body;

  // Validation des champs obligatoires
  const required = ['name', 'type', 'emetteur', 'enveloppe', 'horizon', 'sri', 'fraisEntree', 'fraisGestion'];
  const missing = required.filter(f => !product[f]);
  if (missing.length > 0) {
    return res.status(400).json({ error: `Champs manquants : ${missing.join(', ')}` });
  }

  try {
    // 1. Appel Claude pour générer les données du rapport
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: buildClarioPrompt(product) }]
    });

    // 2. Parser le JSON retourné par Claude
    let reportData;
    try {
      const raw = message.content[0].text.trim();
      const clean = raw.replace(/```json|```/g, '').trim();
      reportData = JSON.parse(clean);
    } catch (e) {
      return res.status(500).json({ error: 'Erreur parsing JSON Claude', detail: e.message });
    }

    // 3. Générer le HTML
    const html = generateHTML(product, reportData);
    const tmpDir = '/tmp/clario';
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    const htmlPath = path.join(tmpDir, `rapport-${Date.now()}.html`);
    const pdfPath = htmlPath.replace('.html', '.pdf');
    fs.writeFileSync(htmlPath, html);

    // 4. Convertir en PDF avec wkhtmltopdf
    execSync(`wkhtmltopdf --page-size A4 --orientation Portrait --margin-top 0 --margin-bottom 0 --margin-left 0 --margin-right 0 --enable-local-file-access --zoom 1 --dpi 96 ${htmlPath} ${pdfPath}`);

    // 5. Renvoyer le PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="rapport-clario-${product.name.replace(/\s+/g,'-')}.pdf"`);
    const pdfBuffer = fs.readFileSync(pdfPath);
    res.send(pdfBuffer);

    // Nettoyage
    fs.unlinkSync(htmlPath);
    fs.unlinkSync(pdfPath);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur', detail: err.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Clario backend running on port ${PORT}`));
