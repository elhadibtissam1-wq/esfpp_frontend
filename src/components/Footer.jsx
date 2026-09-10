import React from 'react';

export default function Footer({ anneeCourante, nomPlateforme }) {
  return (
    <footer className="pied-de-page">
      <div className="conteneur pied-de-page__grille">
        <div className="pied-de-page__marque">
          <span className="marque__texte">ESFPP <strong>Learning</strong></span>
        </div>
        <div>
          <h3>Liens</h3>
          <ul>
            <li><a href="#accueil">Accueil</a></li>
            <li><a href="#fonctionnalites">Fonctionnalités</a></li>
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <ul>
            <li><a href="mailto:support@esfpp-learning.ma">support@esfpp-learning.ma</a></li>
          </ul>
        </div>
      </div>
      <div className="conteneur pied-de-page__bas">
        <p>&copy; {anneeCourante} {nomPlateforme}. Plateforme réservée aux étudiants de l'ESFPP.</p>
      </div>
    </footer>
  );
}