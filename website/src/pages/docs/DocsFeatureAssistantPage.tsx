import { Sparkles } from 'lucide-react'
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

export default function DocsFeatureAssistantPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
          <Sparkles size={20} />
        </div>
        <DocH1>Assistant IA</DocH1>
      </div>

      <DocLead>
        Un assistant conversationnel flottant qui peut chercher, planifier et créer des recettes directement depuis le chat.
      </DocLead>

      <DemoGif src="/demo/ia.gif" alt="Assistant IA avec streaming et tool use" />

      <DocH2>Accès</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Le bouton <strong style={{ color: 'var(--text)' }}>✦</strong> en bas à droite de l'écran ouvre le drawer de l'assistant. Il est accessible depuis toutes les pages de Bonap — vous n'avez pas besoin de quitter ce que vous faites pour interagir avec lui.
      </p>

      <DocH2>Conversation et streaming</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        L'assistant maintient un historique de la conversation pendant votre session. Avec Anthropic, les réponses s'affichent <strong style={{ color: 'var(--text)' }}>en streaming</strong> — les mots apparaissent au fur et à mesure, sans attente. L'historique est conservé tant que le drawer reste ouvert.
      </p>

      <DocH2>Actions disponibles (tool use)</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Avec Anthropic, l'assistant peut effectuer des actions réelles dans Bonap :
      </p>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
        <li>
          <strong style={{ color: 'var(--text)' }}>Chercher une recette</strong> — "trouve-moi une recette avec des courgettes". L'assistant interroge votre catalogue Mealie et affiche les résultats dans le chat.
        </li>
        <li>
          <strong style={{ color: 'var(--text)' }}>Ajouter au planning</strong> — "planifie des pâtes carbonara mercredi soir". L'assistant cherche la recette et l'ajoute directement à la date et au créneau demandés.
        </li>
        <li>
          <strong style={{ color: 'var(--text)' }}>Créer une recette</strong> — "crée une recette de tarte aux pommes avec les ingrédients suivants…". L'assistant crée la recette dans Mealie avec les informations fournies.
        </li>
      </ul>
      <Alert type="warning">
        Le tool use (actions réelles) est disponible uniquement avec le provider <strong>Anthropic</strong>. Avec OpenAI, Google ou Ollama, l'assistant répond en texte mais ne peut pas interagir avec vos données.
      </Alert>

      <DocH2>Configuration</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
        Le provider et le modèle utilisés sont ceux configurés dans{' '}
        <Link to="/docs/configuration/llm" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
          Configuration → IA / LLM
        </Link>. L'assistant et les Suggestions IA partagent la même configuration.
      </p>
    </div>
  )
}
