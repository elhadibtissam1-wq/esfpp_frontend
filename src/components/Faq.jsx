import React, { useState } from 'react';

export default function Faq() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const questionsFAQ = [
    { q: 'Comment accéder aux cours ?', r: "Si votre CIN figure sur la liste des étudiants inscrits, vous activez votre compte en créant votre propre email et mot de passe. Connectez-vous ensuite avec ces identifiants depuis le bouton « Connexion » pour retrouver tous vos modules sur votre tableau de bord." },
    { q: 'Quand un module est-il débloqué ?', r: "Un chapitre se débloque automatiquement dès que vous avez répondu à toutes les questions du mini quiz du chapitre précédent." },
    { q: 'Combien de tentatives sont autorisées pour un quiz ?', r: "Il n'y a pas de nombre de tentatives limité : vous pouvez revoir la vidéo et retenter le quiz autant de fois que nécessaire." },
    { q: 'Comment obtenir mon certificat ?', r: "Une fois tous les modules de la formation validés, une notification de fin de parcours s'affiche. Contactez ensuite l'administration de l'ESFPP pour récupérer votre certificat de réussite." },
  ];

  return (
    <section className="faq" id="faq">
      <div className="conteneur conteneur--etroit">
        <div className="section__intro" data-reveal>
          <p className="etiquette">Questions fréquentes</p>
          <h2>Vous avez des questions ?</h2>
        </div>

        <div className="accordeon" data-reveal>
          {questionsFAQ.map((item, index) => {
            const idQuestion = `faq-${index + 1}`;
            const isOpen = openFaqIndex === index;
            return (
              <div className="accordeon__item" key={index}>
                <h3>
                  <button 
                    className="accordeon__bouton" 
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    aria-expanded={isOpen} 
                    aria-controls={idQuestion} 
                    id={`${idQuestion}-bouton`}
                  >
                    <span>{item.q}</span>
                    <span className="accordeon__icone" aria-hidden="true" style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}>+</span>
                  </button>
                </h3>
                <div className="accordeon__panneau" id={idQuestion} role="region" aria-labelledby={`${idQuestion}-bouton`} hidden={!isOpen}>
                  <p>{item.r}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}