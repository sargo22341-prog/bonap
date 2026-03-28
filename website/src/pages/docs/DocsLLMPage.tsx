import { Sparkles } from 'lucide-react'
import { DocH1, DocH2, DocLead, Alert, DocsTable, InlineCode } from '../../components/docs/DocsComponents'

const providersRows = [
  { cells: ['Anthropic', 'Complet', 'Suggestions + assistant + streaming + tool use', 'claude-3-5-sonnet-latest'] },
  { cells: ['OpenAI', 'Complet*', 'Suggestions + assistant (sans tools ni streaming)', 'gpt-4o, gpt-4'] },
  { cells: ['Google Gemini', 'Complet*', 'Suggestions + assistant (sans tools ni streaming)', 'gemini-1.5-pro'] },
  { cells: ['Ollama', 'Complet*', 'Local (localhost:11434) — suggestions + assistant (sans tools)', 'llama3, mistral...'] },
]

const featuresRows = [
  { cells: ['Suggestions IA', 'Tous les providers', 'Page Suggestions → 5 idées selon saison, historique et critères libres'] },
  { cells: ['Assistant IA (chat)', 'Tous les providers', 'Drawer flottant avec historique de conversation multi-tours'] },
  { cells: ['Streaming temps réel', 'Anthropic uniquement', "Réponses qui s'affichent mot par mot"] },
  { cells: ['Tool — Recherche recettes', 'Anthropic uniquement', "L'assistant interroge votre Mealie et présente les résultats dans le chat"] },
  { cells: ['Tool — Ajout au planning', 'Anthropic uniquement', "L'assistant ajoute une recette au planning à la date demandée"] },
  { cells: ['Tool — Création de recette', 'Anthropic uniquement', "L'assistant crée une recette complète dans Mealie (ingrédients, instructions)"] },
]

export default function DocsLLMPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
          <Sparkles size={20} />
        </div>
        <DocH1>Configuration IA / LLM</DocH1>
      </div>

      <DocLead>
        Bonap intègre une couche IA qui alimente deux fonctionnalités : les <strong>Suggestions</strong>
        et l'<strong>Assistant</strong>. La configuration se fait dans Bonap → Paramètres,
        aucune clé API n'est envoyée au serveur — tout reste dans votre navigateur.
      </DocLead>

      <DocH2>Où configurer</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>
        Dans Bonap, cliquez sur l'icône <strong style={{ color: 'var(--text)' }}>Paramètres</strong> dans la sidebar.
        Section <strong style={{ color: 'var(--text)' }}>Intelligence Artificielle</strong> :
      </p>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2.2, marginBottom: '1rem' }}>
        <li><strong style={{ color: 'var(--text)' }}>Provider</strong> — choisissez Anthropic, OpenAI, Google ou Ollama</li>
        <li><strong style={{ color: 'var(--text)' }}>Clé API</strong> — votre clé du provider choisi</li>
        <li><strong style={{ color: 'var(--text)' }}>Modèle</strong> — le modèle à utiliser (ex: <InlineCode>claude-3-5-sonnet-latest</InlineCode>)</li>
        <li><strong style={{ color: 'var(--text)' }}>URL de base</strong> — utile pour Ollama ou un proxy custom</li>
      </ul>

      <Alert type="info">
        La clé API est stockée dans le <strong>localStorage</strong> de votre navigateur.
        Elle n'est jamais envoyée au serveur Bonap — les appels LLM partent directement
        depuis votre navigateur vers le provider.
      </Alert>

      <DocH2>Providers supportés</DocH2>
      <DocsTable
        headers={['Provider', 'Support', 'Notes', 'Modèles conseillés']}
        rows={providersRows}
      />

      <DocH2>Fonctionnalités IA</DocH2>
      <DocsTable
        headers={['Fonctionnalité', 'Provider requis', 'Description']}
        rows={featuresRows}
      />

      <Alert type="tip">
        Tous les providers fonctionnent pour les Suggestions et le chat Assistant.
        Seul <strong>Anthropic</strong> débloque le <strong>streaming</strong> et les <strong>tools</strong>
        (actions directes dans Mealie depuis l'assistant). Les autres providers affichent la réponse
        en une fois, sans possibilité d'agir sur vos données.
      </Alert>

      <DocH2>Page Suggestions</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        Accessible depuis la sidebar, la page Suggestions envoie au LLM :
      </p>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
        <li>La <strong style={{ color: 'var(--text)' }}>saison actuelle</strong> (printemps, été, automne, hiver)</li>
        <li>Les <strong style={{ color: 'var(--text)' }}>recettes récemment planifiées</strong> (pour éviter les répétitions)</li>
        <li>Vos <strong style={{ color: 'var(--text)' }}>critères texte libres</strong> (ex: "rapide, végétarien, moins de 30 min")</li>
      </ul>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginTop: '0.75rem' }}>
        Le LLM répond avec 5 suggestions de recettes parmi celles de votre Mealie, avec une justification pour chacune.
        Chaque suggestion peut être ajoutée directement au planning.
      </p>

      <DocH2>Assistant IA</DocH2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        L'assistant est accessible via le bouton <strong style={{ color: 'var(--text)' }}>✨ Sparkles</strong> en bas à droite de l'interface.
        Il maintient un historique de conversation multi-tours avec n'importe quel provider.
        Avec Anthropic, il peut en plus exécuter des actions directement dans Mealie :
      </p>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
        <li><strong style={{ color: 'var(--text)' }}>Rechercher une recette</strong> — "Trouve-moi une recette de risotto" <em>(Anthropic)</em></li>
        <li><strong style={{ color: 'var(--text)' }}>Ajouter au planning</strong> — "Mets le risotto aux champignons lundi soir" <em>(Anthropic)</em></li>
        <li><strong style={{ color: 'var(--text)' }}>Créer une recette</strong> — "Crée une recette de tarte aux pommes" <em>(Anthropic)</em></li>
      </ul>

      <Alert type="warning">
        Pour Ollama, assurez-vous que votre instance est accessible depuis le navigateur
        (généralement <InlineCode>http://localhost:11434</InlineCode>).
        Les CORS doivent être activés sur Ollama : <InlineCode>OLLAMA_ORIGINS=*</InlineCode>.
      </Alert>

      <DocH2>Obtenir une clé API</DocH2>
      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2.5 }}>
        <li><strong style={{ color: 'var(--text)' }}>Anthropic</strong> — <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>console.anthropic.com</a></li>
        <li><strong style={{ color: 'var(--text)' }}>OpenAI</strong> — <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>platform.openai.com/api-keys</a></li>
        <li><strong style={{ color: 'var(--text)' }}>Google Gemini</strong> — <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>aistudio.google.com</a></li>
        <li><strong style={{ color: 'var(--text)' }}>Ollama</strong> — pas de clé API, local uniquement</li>
      </ul>
    </div>
  )
}
