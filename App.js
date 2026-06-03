import { useState } from 'react';

const INITIAL = {
  name: '', type: '', emetteur: '', enveloppe: '', horizon: '',
  sri: '', fraisEntree: '', fraisGestion: '',
  fraisSortie: '', fraisPerformance: '', rendement: '',
  liquidite: '', complement: ''
};

const ENVELOPES = ['Assurance-vie', 'PEA', 'PER', 'Compte-titres', 'SCPI', 'Autre'];
const TYPES = ['Fonds daté', 'SCPI', 'OPCVM Actions', 'OPCVM Obligataire', 'ETF', 'Produit structuré', 'Autre'];

export default function App() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError('');
    const required = ['name', 'type', 'emetteur', 'enveloppe', 'horizon', 'sri', 'fraisEntree', 'fraisGestion'];
    const missing = required.filter(k => !form[k]);
    if (missing.length) { setError('Merci de remplir tous les champs obligatoires (*)'); return; }

    setLoading(true);
    try {
      const res = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur serveur');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-clario-${form.name.replace(/\s+/g, '-')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>CLARIO</div>
        <div style={styles.logoSub}>Générateur de rapports pédagogiques</div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Nouveau rapport</h2>
        <p style={styles.cardSub}>Renseignez les informations du produit financier à analyser</p>

        {/* BLOC 1 — Identité */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Identité du produit</div>
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
        </div>

        {/* BLOC 2 — Frais */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Frais</div>
          <div style={styles.grid2}>
            <Field label="Frais d'entrée (%) *" value={form.fraisEntree} onChange={v => set('fraisEntree', v)} placeholder="ex : 4" type="number" />
            <Field label="Frais de gestion (%/an) *" value={form.fraisGestion} onChange={v => set('fraisGestion', v)} placeholder="ex : 1.90" type="number" />
          </div>
          <div style={styles.grid2}>
            <Field label="Frais de sortie (%)" value={form.fraisSortie} onChange={v => set('fraisSortie', v)} placeholder="ex : 0 ou Non communiqués" />
            <Field label="Frais de performance" value={form.fraisPerformance} onChange={v => set('fraisPerformance', v)} placeholder="ex : 20% surperf. ou Non communiqués" />
          </div>
        </div>

        {/* BLOC 3 — Rendement & Liquidité */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Rendement &amp; Liquidité</div>
          <div style={styles.grid2}>
            <Field label="Rendement cible ou historique" value={form.rendement} onChange={v => set('rendement', v)} placeholder="ex : 4% brut ou Non communiqué" />
            <Field label="Conditions de liquidité" value={form.liquidite} onChange={v => set('liquidite', v)} placeholder="ex : Rachat sous 15 jours" />
          </div>
        </div>

        {/* BLOC 4 — Complément */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Informations complémentaires</div>
          <textarea
            style={styles.textarea}
            value={form.complement}
            onChange={e => set('complement', e.target.value)}
            placeholder="Toute information utile : composition du portefeuille, conditions particulières, contexte..."
            rows={4}
          />
        </div>

        {error && <div style={styles.error}>⚠ {error}</div>}

        <button style={loading ? styles.btnLoading : styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? '⏳ Génération en cours...' : '📄 Générer le rapport PDF'}
        </button>

        {loading && (
          <div style={styles.loadingInfo}>
            Analyse en cours avec Claude AI · Génération du PDF · ~30 secondes
          </div>
        )}
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
  header: { background: '#1B2E4B', padding: '24px 40px', display: 'flex', alignItems: 'center', gap: 16 },
  logo: { fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: 4 },
  logoSub: { fontSize: 12, color: '#4A90D9', textTransform: 'uppercase', letterSpacing: 2 },
  card: { maxWidth: 760, margin: '40px auto', background: '#fff', borderRadius: 12, padding: '40px 48px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: 24, fontWeight: 900, color: '#1B2E4B', marginBottom: 6 },
  cardSub: { fontSize: 14, color: '#7a9cc4', marginBottom: 32 },
  section: { marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid #EEF0F3' },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#1B2E4B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: '#555' },
  input: { padding: '10px 14px', border: '1px solid #DDE2EA', borderRadius: 6, fontSize: 14, color: '#1B2E4B', outline: 'none', width: '100%' },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #DDE2EA', borderRadius: 6, fontSize: 14, color: '#1B2E4B', resize: 'vertical', fontFamily: 'Arial, sans-serif' },
  btn: { width: '100%', padding: '16px', background: '#1B2E4B', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  btnLoading: { width: '100%', padding: '16px', background: '#7a9cc4', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'not-allowed', marginTop: 8 },
  error: { background: '#FDE8E8', color: '#C0392B', padding: '12px 16px', borderRadius: 6, fontSize: 14, marginBottom: 16 },
  loadingInfo: { textAlign: 'center', fontSize: 13, color: '#7a9cc4', marginTop: 12 }
};
