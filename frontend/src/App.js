import { useState } from 'react';

const INITIAL = {
  email: '',
  name: '', type: '', emetteur: '', enveloppe: '', horizon: '',
  sri: '', fraisEntree: '', fraisGestion: '',
  fraisSortie: '', fraisPerformance: '', rendement: '',
  liquidite: '', urlProduit: '', complement: ''
};

const ENVELOPES = ['Assurance-vie', 'PEA', 'PER', 'Compte-titres', 'SCPI', 'Autre'];
const TYPES = ['Fonds daté', 'SCPI', 'OPCVM Actions', 'OPCVM Obligataire', 'ETF', 'Produit structuré', 'Autre'];

export default function App() {
  const [form, setForm] = useState(INITIAL);
  const [files, setFiles] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const setFile = (i, file) => {
    const updated = [...files];
    updated[i] = file;
    setFiles(updated);
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);
    const required = ['email', 'name', 'type', 'emetteur', 'enveloppe', 'horizon', 'sri', 'fraisEntree', 'fraisGestion'];
    const missing = required.filter(k => !form[k]);
    if (missing.length) { setError('Merci de remplir tous les champs obligatoires (*)'); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setError('Adresse email invalide'); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      files.forEach((f, i) => { if (f) formData.append(`file${i + 1}`, f); });

      await fetch('https://hook.eu1.make.com/a7hka6vibj3tllpm7vskolb7o0u20gtt', {
        method: 'POST',
        body: formData
      });

      setSuccess(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.logo}>CLARIO</div>
          <div style={styles.logoSub}>Générateur de rapports pédagogiques</div>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Nouveau rapport d'analyse</h2>
        <p style={styles.cardSub}>Renseignez les informations du produit financier à analyser</p>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>📧 Vos coordonnées</div>
          <Field label="Adresse email *" value={form.email} onChange={v => set('email', v)} placeholder="votre@email.com" type="email" />
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>📋 Identité du produit</div>
          <div style={styles.grid2}>
            <Field label="Nom du produit *" value={form.name} onChange={v => set('name', v)} placeholder="ex : Carmignac 2027" />
            <Field label="Émetteur / Gestionnaire *" value={form.emetteur} onChange={v => set('emetteur', v)} placeholder="ex : Carmignac" />
          </div>
          <div style={styles.grid2}>
            <Select label="Type de produit *" value={form.type} onChange={v => set('type', v)} options={TYPES} />
            <Select label="Enveloppe fiscale *" value={form.enveloppe} onChange={v => set('enveloppe', v)} options={ENVELOPES} />
          </div>
          <div style={styles.grid2}>
            <Field label="Horizon recommandé *" value={form.horizon} onChange={v => set('horizon', v)} placeholder="ex : 5 à 8 ans" />
            <Field label="SRI (1 à 7) *" value={form.sri} onChange={v => set('sri', v)} placeholder="ex : 3" type="number" min="1" max="7" />
          </div>
          <Field label="URL de la page produit" value={form.urlProduit} onChange={v => set('urlProduit', v)} placeholder="https://..." type="url" />
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>💶 Frais</div>
          <div style={styles.grid2}>
            <Field label="Frais d'entrée (%) *" value={form.fraisEntree} onChange={v => set('fraisEntree', v)} placeholder="ex : 4" type="number" />
            <Field label="Frais de gestion (%/an) *" value={form.fraisGestion} onChange={v => set('fraisGestion', v)} placeholder="ex : 1.90" type="number" />
          </div>
          <div style={styles.grid2}>
            <Field label="Frais de sortie (%)" value={form.fraisSortie} onChange={v => set('fraisSortie', v)} placeholder="ex : 0 ou Non communiqués" />
            <Field label="Frais de performance" value={form.fraisPerformance} onChange={v => set('fraisPerformance', v)} placeholder="ex : 20% surperf. ou Non communiqués" />
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>📈 Rendement &amp; Liquidité</div>
          <div style={styles.grid2}>
            <Field label="Rendement cible ou historique" value={form.rendement} onChange={v => set('rendement', v)} placeholder="ex : 4% brut ou Non communiqué" />
            <Field label="Conditions de liquidité" value={form.liquidite} onChange={v => set('liquidite', v)} placeholder="ex : Rachat sous 15 jours" />
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>📎 Documents (optionnels)</div>
          <p style={styles.hint}>Joignez jusqu'à 3 documents : DICI, fiche produit, prospectus... (PDF ou image)</p>
          <div style={styles.filesGrid}>
            {[0, 1, 2].map(i => (
              <div key={i} style={styles.fileBox}>
                <label style={styles.fileLabel}>
                  {files[i] ? (
                    <div style={styles.fileSelected}>
                      <span style={styles.fileCheck}>✓</span>
                      <span style={styles.fileName}>{files[i].name.length > 20 ? files[i].name.substring(0, 20) + '...' : files[i].name}</span>
                      <span style={styles.fileRemove} onClick={(e) => { e.preventDefault(); setFile(i, null); }}>✕</span>
                    </div>
                  ) : (
                    <div style={styles.filePlaceholder}>
                      <span style={styles.fileIcon}>📄</span>
                      <span style={styles.fileText}>Document {i + 1}</span>
                      <span style={styles.fileSub}>Cliquer pour ajouter</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                    onChange={e => setFile(i, e.target.files[0] || null)}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>💬 Informations complémentaires</div>
          <textarea
            style={styles.textarea}
            value={form.complement}
            onChange={e => set('complement', e.target.value)}
            placeholder="Toute information utile : composition du portefeuille, conditions particulières, contexte du produit..."
            rows={4}
          />
        </div>

        {error && <div style={styles.error}>⚠ {error}</div>}
        {success && (
          <div style={styles.successBox}>
            ✓ Votre demande a bien été envoyée ! Votre analyse est en cours de génération, vous recevrez vos résultats dans quelques instants.
          </div>
        )}

        <button style={loading ? styles.btnLoading : styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? '⏳ Analyse en cours...' : '📄 Générer le rapport PDF'}
        </button>

        {loading && (
          <div style={styles.loadingInfo}>
            Analyse en cours avec Claude AI · Génération du PDF · ~30 secondes
          </div>
        )}

        <div style={styles.disclaimer}>
          Vos données sont utilisées uniquement pour générer votre rapport. Clario ne constitue pas un conseil en investissement.
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, value, onChange, placeholder, type = 'text', min, max }) => (
  <div style={styles.fieldWrap}>
    <label style={styles.label}>{label}</label>
    <input
      style={styles.input}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      min={min} max={max}
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={styles.fieldWrap}>
    <label style={styles.label}>{label}</label>
    <select style={styles.input} value={value} onChange={e => onChange(e.target.value)}>
      <option value="">-- Sélectionner --</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const styles = {
  container: { minHeight: '100vh', background: '#F0F4F8', fontFamily: 'Arial, sans-serif' },
  header: { background: '#1B2E4B', padding: '20px 40px', display: 'flex', alignItems: 'center' },
  logo: { fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: 4 },
  logoSub: { fontSize: 11, color: '#4A90D9', textTransform: 'uppercase', letterSpacing: 2, marginTop: 2 },
  card: { maxWidth: 780, margin: '32px auto', background: '#fff', borderRadius: 12, padding: '36px 44px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: 22, fontWeight: 900, color: '#1B2E4B', marginBottom: 6 },
  cardSub: { fontSize: 13, color: '#7a9cc4', marginBottom: 28 },
  section: { marginBottom: 26, paddingBottom: 26, borderBottom: '1px solid #EEF0F3' },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#1B2E4B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 4 },
  label: { fontSize: 12, fontWeight: 600, color: '#555' },
  input: { padding: '10px 13px', border: '1px solid #DDE2EA', borderRadius: 6, fontSize: 13, color: '#1B2E4B', width: '100%', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 13px', border: '1px solid #DDE2EA', borderRadius: 6, fontSize: 13, color: '#1B2E4B', resize: 'vertical', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' },
  hint: { fontSize: 12, color: '#7a9cc4', marginBottom: 12 },
  filesGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 },
  fileBox: { border: '2px dashed #DDE2EA', borderRadius: 8, overflow: 'hidden' },
  fileLabel: { display: 'block', cursor: 'pointer', padding: '16px 10px' },
  filePlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  fileIcon: { fontSize: 24 },
  fileText: { fontSize: 12, fontWeight: 600, color: '#1B2E4B' },
  fileSub: { fontSize: 10, color: '#7a9cc4' },
  fileSelected: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  fileCheck: { fontSize: 20, color: '#27AE60' },
  fileName: { fontSize: 11, color: '#1B2E4B', textAlign: 'center', wordBreak: 'break-all' },
  fileRemove: { fontSize: 11, color: '#C0392B', cursor: 'pointer', marginTop: 4 },
  btn: { width: '100%', padding: '15px', background: '#1B2E4B', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 6 },
  btnLoading: { width: '100%', padding: '15px', background: '#7a9cc4', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'not-allowed', marginTop: 6 },
  error: { background: '#FDE8E8', color: '#C0392B', padding: '11px 14px', borderRadius: 6, fontSize: 13, marginBottom: 14 },
  successBox: { background: '#F0FAF4', color: '#27AE60', padding: '14px', borderRadius: 6, fontSize: 13, marginBottom: 14, fontWeight: 700, lineHeight: 1.5 },
  loadingInfo: { textAlign: 'center', fontSize: 12, color: '#7a9cc4', marginTop: 10 },
  disclaimer: { textAlign: 'center', fontSize: 11, color: '#bbb', marginTop: 16, lineHeight: 1.5 }
};
