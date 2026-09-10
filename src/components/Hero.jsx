import React from 'react';

export default function Hero({onOpenLogin}) {
  return (
    <section className="hero" id="accueil">
      <div className="conteneur hero__grille">
        <div className="hero__texte">
          <p className="etiquette" data-reveal>Espace étudiant ESFPP</p>
          <h1>Bienvenue sur <span className="accent">ESFPP Learning</span></h1>
          <p className="hero__soustitre">
            Votre espace numérique d'apprentissage. Accédez à vos vidéos pédagogiques,
            consultez vos supports de cours, réalisez vos évaluations et suivez votre
            progression jusqu'à l'obtention de votre certificat.
          </p>
          <div className="hero__actions">
            <button className="bouton bouton--principal bouton--grand" onClick={onOpenLogin}>Se connecter</button>
            <a href="#fonctionnalites" className="bouton bouton--secondaire bouton--grand">Découvrir la plateforme</a>
          </div>
          <div className="hero__confiance">
            Accès strictement réservé aux étudiants inscrits à l'ESFPP
          </div>
        </div>

        <div className="hero__apercu" aria-hidden="true">
          <div className="fenetre-app">
            <div className="fenetre-app__barre">
              <span></span><span></span><span></span>
              <span className="fenetre-app__url">esfpp-learning.ma/tableau-de-bord</span>
            </div>
            <div className="fenetre-app__corps">
              <aside className="fenetre-app__sidebar">
                <span className="fenetre-app__item fenetre-app__item--actif"></span>
                <span className="fenetre-app__item"></span>
                <span className="fenetre-app__item"></span>
              </aside>
              <div className="fenetre-app__contenu">
                <div className="fenetre-app__carte-video">
                  <span className="fenetre-app__lecture">▶</span>
                </div>
                <div className="fenetre-app__lignes">
                  <span className="ligne ligne--80"></span>
                </div>
                <div className="anneau-progression">
                  <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" className="anneau-progression__fond"/>
                    <circle cx="60" cy="60" r="50" className="anneau-progression__valeur"/>
                  </svg>
                  <span className="anneau-progression__texte">68%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}