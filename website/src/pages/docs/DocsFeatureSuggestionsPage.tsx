import { Lightbulb } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DocH1, DocH2, DocLead, Alert } from '../../components/docs/DocsComponents'

function DemoGif({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <img src={src} alt={alt} style={{ width: '100%', borderRadius: '10px', border: '1px solid var(--border)', display: 'block' }} />
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{alt}</p>
    </div>
  )
}

export default function DocsFeatureSuggestionsPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
          <Lightbulb size={20} />
        </div>
        <DocH1>Suggestions IA</DocH1>
      </div>

      <DocLead>
        Laissez l'IA parcourir votre catalogue et proposer 5 recettes adaptées à vos critères du moment.
      </DocLead>

      <DemoGif src="/demo/suggestions.gif" alt="Génération de suggestions IA depuis le catalogue Mealie" />

      <DocH2>Comment ça fonctionne</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Bonap envoie votre catalogue complet au modèle IA configuré, accompagné des critères que vous avez définis. Le modèle sélectionne 5 recettes parmi les vôtres et fournit pour chacune un nom, une courte description et une justification (pourquoi cette recette correspond à vos critères).
      </p>
      <Alert type="warning">
        Les suggestions sont toujours choisies parmi vos recettes existantes dans Mealie — l'IA ne crée pas de nouvelles recettes. Si votre catalogue est vide ou très limité, les suggestions seront peu variées.
      </Alert>

      <DocH2>Critères de sélection</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Deux types de critères sont combinés :
      </p>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
        <li><strong style={{ color: 'var(--text)' }}>Critères prédéfinis</strong> — saison actuelle, durée maximale, catégories préférées. Ces critères sont cochables rapidement sans saisie.</li>
        <li><strong style={{ color: 'var(--text)' }}>Texte libre</strong> — un champ pour exprimer des contraintes spécifiques : "recettes sans gluten", "plats à préparer à l'avance", "cuisine asiatique légère", etc.</li>
      </ul>

      <DocH2>Ajouter au planning</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Chaque suggestion affiche un bouton <strong style={{ color: 'var(--text)' }}>Ajouter au planning</strong> qui ouvre un sélecteur de date et créneau (déjeuner/dîner). La recette est planifiée en un clic, sans quitter la page.
      </p>

      <DocH2>Providers IA supportés</DocH2>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
        <li><strong style={{ color: 'var(--text)' }}>Anthropic</strong> (Claude) — recommandé</li>
        <li><strong style={{ color: 'var(--text)' }}>OpenAI</strong> (GPT-4o, etc.)</li>
        <li><strong style={{ color: 'var(--text)' }}>Google Gemini</strong></li>
        <li><strong style={{ color: 'var(--text)' }}>Ollama</strong> — modèles locaux, aucune donnée envoyée sur internet</li>
      </ul>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginTop: '0.75rem' }}>
        La configuration du provider se fait dans{' '}
        <Link to="/docs/configuration/llm" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
          Configuration → IA / LLM
        </Link>.
      </p>
    </div>
  )
}
