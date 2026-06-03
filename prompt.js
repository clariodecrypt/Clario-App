const buildClarioPrompt = (product) => `
Tu es un expert en analyse pédagogique de produits financiers français.
Génère un rapport Clario complet pour le produit suivant.

DONNÉES PRODUIT :
- Nom : ${product.name}
- Type : ${product.type}
- Émetteur : ${product.emetteur}
- Enveloppe fiscale : ${product.enveloppe}
- Horizon recommandé : ${product.horizon}
- SRI : ${product.sri}/7
- Frais d'entrée : ${product.fraisEntree} %
- Frais de gestion : ${product.fraisGestion} %/an
- Frais de sortie : ${product.fraisSortie || 'Non communiqués'}
- Frais de performance : ${product.fraisPerformance || 'Non communiqués'}
- Rendement cible : ${product.rendement || 'Non communiqué'}
- Conditions de liquidité : ${product.liquidite || 'Non communiquées'}
- Informations complémentaires : ${product.complement || 'Aucune'}

CALCUL DES SCORES :

FRAIS (35 pts) :
- Frais de gestion < 0,5%/an → 33-35 | 0,5-1% → 27-32 | 1-2% → 18-26 | 2-3% → 10-17 | >3% → 0-9
- Pénalité si frais d'entrée élevés sur horizon court
- Plafonné à 20/35 si frais incomplets

FISCALITÉ (25 pts) :
- Enveloppe optimisée + horizon adapté → 23-25
- Enveloppe mais horizon sous-optimal → 15-22
- Flat tax 30% sans enveloppe → 10-14

RISQUE & LIQUIDITÉ (40 pts) :
- Adéquation risque/horizon/liquidité
- Pénalité forte si produit illiquide sur horizon court
- Pénalité si données de liquidité manquantes

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown, sans backticks) avec cette structure exacte :

{
  "scores": {
    "frais": 0,
    "fiscalite": 0,
    "risque": 0,
    "global": 0
  },
  "interpretation": "texte",
  "pointsForts": [
    {"titre": "titre", "texte": "texte"},
    {"titre": "titre", "texte": "texte"},
    {"titre": "titre", "texte": "texte"}
  ],
  "vigilances": [
    {"titre": "titre", "texte": "texte"},
    {"titre": "titre", "texte": "texte"},
    {"titre": "titre", "texte": "texte"}
  ],
  "analyseFrags": {
    "tableauComparatif": [
      {"type": "Frais d'entrée", "produit": "X%", "marche": "Y%", "evaluation": "Élevé|Normal|Faible"}
    ],
    "impactRendement": {
      "brut": 0,
      "fraisGestion": 0,
      "fraisAV": 0,
      "fraisEntreeAmorti": 0,
      "net": 0
    },
    "amortissement": [
      {"horizon": "3 ans", "annuel": "X%/an", "total": "Y%", "pct": 90},
      {"horizon": "5 ans", "annuel": "X%/an", "total": "Y%", "pct": 65},
      {"horizon": "6.5 ans", "annuel": "X%/an", "total": "Y%", "pct": 48},
      {"horizon": "8 ans", "annuel": "X%/an", "total": "Y%", "pct": 35}
    ],
    "lectureP": "texte pédagogique"
  },
  "risques": {
    "marche": {"niveau": "Modéré|Faible|Élevé", "texte": "texte"},
    "contrepartie": {"niveau": "Modéré|Faible|Élevé", "texte": "texte"},
    "liquidite": {"niveau": "Modéré|Faible|Élevé|À vérifier", "texte": "texte"},
    "inflation": {"niveau": "Modéré|Faible|Élevé", "texte": "texte"},
    "retrait": "texte sur les conditions de sortie"
  },
  "fiscalite": {
    "regime": "texte explicatif du régime",
    "coherence": "texte sur la cohérence horizon/fiscalité",
    "vigilances": ["texte1", "texte2", "texte3"],
    "optimisations": ["texte1", "texte2", "texte3"]
  },
  "conclusion": {
    "pointsCles": [
      {"titre": "titre", "texte": "texte"},
      {"titre": "titre", "texte": "texte"},
      {"titre": "titre", "texte": "texte"},
      {"titre": "titre", "texte": "texte"},
      {"titre": "titre", "texte": "texte"}
    ],
    "questions": ["Q1", "Q2", "Q3", "Q4", "Q5"],
    "ressources": [
      {"nom": "AMF", "url": "amf-france.org", "desc": "Vérification agréments"},
      {"nom": "Banque de France", "url": "banque-france.fr", "desc": "Éducation financière"},
      {"nom": "${product.emetteur}", "url": "", "desc": "Page produit officielle"},
      {"nom": "Comparateur AV", "url": "moneyvox.fr", "desc": "Comparateur assurance-vie"}
    ]
  }
}
`;

module.exports = { buildClarioPrompt };
