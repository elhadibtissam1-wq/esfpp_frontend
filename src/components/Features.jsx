import React from 'react';

export default function Features() {
  const fonctionnalites = [
    { titre: 'Accès sécurisé', texte: "Un espace réservé exclusivement aux étudiants inscrits, protégé par identifiants personnels.", icone: 'cadenas' },
    { titre: 'Cours en ligne', texte: "Tous vos modules organisés et accessibles depuis un seul tableau de bord.", icone: 'livre' },
    { titre: 'Vidéos pédagogiques', texte: "Des vidéos claires pour chaque leçon, visionnables à votre rythme.", icone: 'lecture' },
    { titre: 'Explications détaillées', texte: "Après chaque question de quiz, une explication vous aide à comprendre la bonne réponse.", icone: 'document' },
    { titre: 'Quiz interactifs', texte: "Des mini-quiz après chaque leçon pour valider votre compréhension.", icone: 'quiz' },
    { titre: 'Suivi de progression', texte: "Visualisez en un coup d'œil l'avancement de chacun de vos modules.", icone: 'progression' },
    { titre: 'Confort de lecture', texte: "Basculez entre mode clair et mode sombre selon votre préférence, mémorisée automatiquement.", icone: 'examen' },
    { titre: 'Certificat de réussite', texte: "Une fois tous vos modules validés, contactez l'administration pour récupérer votre attestation.", icone: 'certificat' },
  ];

  const iconesFonctionnalites = {
    cadenas: <><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" fill="none"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.7" fill="none"/></>,
    livre: <><path d="M4 5.5c2.5-1 5-1 8 .3 3-1.3 5.5-1.3 8-.3v13c-2.5-1-5-1-8 .3-3-1.3-5.5-1.3-8-.3v-13Z" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinejoin="round"/><path d="M12 5.8v13" stroke="currentColor" strokeWidth="1.7"/></>,
    lecture: <><rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" fill="none"/><path d="M10 9.2v4.6l4-2.3-4-2.3Z" fill="currentColor"/></>,
    document: <><path d="M7 3h7l4 4v14H7V3Z" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinejoin="round"/><path d="M14 3v4h4" stroke="currentColor" strokeWidth="1.7" fill="none"/><path d="M9.5 13h5M9.5 16h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></>,
    quiz: <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" fill="none"/><path d="M9.3 9.6a2.7 2.7 0 1 1 3.6 2.5c-.7.3-.9.7-.9 1.4" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round"/><circle cx="12" cy="16.6" r="1" fill="currentColor"/></>,
    progression: <><path d="M4 19V13M10 19V9M16 19v-7M4 19h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 5h-4v4" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 5 12.5 12.5 9 9 4 14" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    examen: <><path d="M12 3 4 6.5v5c0 5 3.4 8.7 8 9.5 4.6-.8 8-4.5 8-9.5v-5L12 3Z" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinejoin="round"/><path d="M9 12.2l2.2 2.2L15.5 10" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    certificat: <><circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="1.7" fill="none"/><path d="M9 13.5 7.5 21l4.5-2.5 4.5 2.5-1.5-7.5" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinejoin="round"/></>
  };

  return (
    <section className="fonctionnalites" id="fonctionnalites">
      <div className="conteneur">
        <div className="section__intro" data-reveal>
          <p className="etiquette">Fonctionnalités</p>
          <h2>Pourquoi utiliser cette plateforme ?</h2>
          <p className="section__soustitre">Tout ce dont vous avez besoin pour apprendre, réviser et valider vos acquis, au même endroit.</p>
        </div>

        <div className="grille-fonctionnalites">
          {fonctionnalites.map((item, index) => (
            <article key={index} className="carte-fonctionnalite" data-reveal style={{ '--délai': `${index * 50}ms` }}>
              <div className="carte-fonctionnalite__icone" aria-hidden="true">
                <svg viewBox="0 0 24 24">{iconesFonctionnalites[item.icone]}</svg>
              </div>
              <h3>{item.titre}</h3>
              <p>{item.texte}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}