import React from 'react';

export default function CoursePath() {
  const etapes = [
    { texte: 'Connexion à votre espace étudiant', icone: 'connexion' },
    { texte: 'Visionner la vidéo du chapitre', icone: 'lecture' },
    { texte: 'Répondre aux questions du mini quiz', icone: 'quiz' },
    { texte: 'Lire l\'explication de chaque question', icone: 'document' },
    { texte: 'Suivre votre progression en temps réel', icone: 'seuil' },
    { texte: 'Débloquer automatiquement le chapitre suivant', icone: 'cadenas-ouvert' },
    { texte: "Répéter jusqu'au dernier chapitre", icone: 'repeter' },
    { texte: 'Terminer tous les modules de la formation', icone: 'examen' },
    { texte: 'Récupérer votre certificat auprès de l\'administration', icone: 'certificat' },
  ];

  const iconesEtapes = {
    connexion: <><rect x="4" y="10" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none"/><path d="M7 10V7a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.6" fill="none"/><path d="M17 12h4m0 0-2-2m2 2-2 2" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    lecture: <><rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none"/><path d="M10 9.2v4.6l4-2.3-4-2.3Z" fill="currentColor"/></>,
    document: <><path d="M7 3h7l4 4v14H7V3Z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/><path d="M9.5 13h5M9.5 16h5" stroke="currentColor" stroke-width="1.6" strokeLinecap="round"/></>,
    quiz: <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" fill="none"/><path d="M9 10.2 12 13l4-4.4" stroke="currentColor" stroke-width="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    seuil: <><path d="M4 19V13M10 19V9M16 19v-7" stroke="currentColor" stroke-width="1.6" strokeLinecap="round"/><path d="M3 15h18" strokeDasharray="3 3" stroke="currentColor" stroke-width="1.4"/></>,
    'cadenas-ouvert': <><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none"/><path d="M8 11V8a4 4 0 0 1 7.5-2" stroke="currentColor" stroke-width="1.6" fill="none" strokeLinecap="round"/></>,
    repeter: <><path d="M4 12a8 8 0 0 1 13.7-5.7L20 8M20 4v4h-4" stroke="currentColor" stroke-width="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 12a8 8 0 0 1-13.7 5.7L4 16m0 4v-4h4" stroke="currentColor" stroke-width="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    examen: <><path d="M12 3 4 6.5v5c0 5 3.4 8.7 8 9.5 4.6-.8 8-4.5 8-9.5v-5L12 3Z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/></>,
    certificat: <><circle cx="12" cy="9" r="5" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M9 13.5 7.5 21l4.5-2.5 4.5 2.5-1.5-7.5" stroke="currentColor" stroke-width="1.6" fill="none" strokeLinejoin="round"/></>
  };

  return (
    <section className="parcours" id="comment-ca-marche">
      <div className="conteneur">
        <div className="section__intro" data-reveal>
          <p className="etiquette etiquette--claire">Votre parcours</p>
          <h2 className="titre--clair">Comment fonctionne votre apprentissage ?</h2>
          <p className="section__soustitre section__soustitre--claire">Un cheminement clair, étape par étape, jusqu'à votre certification.</p>
        </div>

        <ol className="parcours__liste">
          {etapes.map((etape, index) => {
            const numero = String(index + 1).padStart(2, '0');
            const estFinale = index === etapes.length - 1;
            return (
              <li key={index} className={`parcours__etape ${estFinale ? 'parcours__etape--finale' : ''}`} data-reveal style={{ '--délai': `${index * 45}ms` }}>
                <span className="parcours__numero">{numero}</span>
                <span className="parcours__icone" aria-hidden="true">
                  <svg viewBox="0 0 24 24">{iconesEtapes[etape.icone]}</svg>
                </span>
                <span className="parcours__texte">{etape.texte}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}