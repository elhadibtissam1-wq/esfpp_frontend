import React from 'react';

export default function Header({ isScrolled, isMenuOpen, setIsMenuOpen, activeSection, onOpenLogin}) {
  return (
    <header className={`entete ${isScrolled ? 'entete--scroll' : ''}`} id="entete">
      <div className="conteneur entete__barre">
        
        {/* LOGO & NOM DE LA MARQUE */}
        <a href="#accueil" className="marque" aria-label="ESFPP Learning, retour à l'accueil">
          <span className="marque__pastille" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7.5 12 4l8 3.5-8 3.5-8-3.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M7 9.6V15c0 1.6 2.2 3 5 3s5-1.4 5-3V9.6" stroke="currentColor" strokeWidth="1.6" fill="none"/>
            </svg>
          </span>
          <span className="marque__texte">ESFPP <strong>Learning</strong></span>
        </a>

        {/* NAVIGATION PRINCIPALE (Tous les liens de tes captures d'écran) */}
        <nav className="navigation" aria-label="Navigation principale">
          <ul className="navigation__liste">
            <li><a href="#accueil" className={`navigation__lien ${activeSection === 'accueil' ? 'navigation__lien--actif' : ''}`}>Accueil</a></li>
            <li><a href="#fonctionnalites" className={`navigation__lien ${activeSection === 'fonctionnalites' ? 'navigation__lien--actif' : ''}`}>Fonctionnalités</a></li>
            <li><a href="#comment-ca-marche" className={`navigation__lien ${activeSection === 'comment-ca-marche' ? 'navigation__lien--actif' : ''}`}>Comment ça fonctionne ?</a></li>
            <li><a href="#specialites" className={`navigation__lien ${activeSection === 'specialites' ? 'navigation__lien--actif' : ''}`}>Spécialités</a></li>
            <li><a href="#faq" className={`navigation__lien ${activeSection === 'faq' ? 'navigation__lien--actif' : ''}`}>FAQ</a></li>
          </ul>
        </nav>

        {/* ACTIONS DE L'ENTÊTE */}
        <div className="entete__actions">
          <button className="bouton bouton--principal bouton--petit" onClick={onOpenLogin}>Connexion</button>
          <button 
            className="hamburger" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"} 
            aria-expanded={isMenuOpen} 
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {/* MENU MOBILE INTERACTIF */}
      <nav className={`menu-mobile ${isMenuOpen ? 'menu-mobile--ouvert' : ''}`} id="menu-mobile">
        <ul>
          <li><a href="#accueil" onClick={() => setIsMenuOpen(false)}>Accueil</a></li>
          <li><a href="#fonctionnalites" onClick={() => setIsMenuOpen(false)}>Fonctionnalités</a></li>
          <li><a href="#comment-ca-marche" onClick={() => setIsMenuOpen(false)}>Comment ça fonctionne ?</a></li>
          <li><a href="#specialites" onClick={() => setIsMenuOpen(false)}>Spécialités</a></li>
          <li><a href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</a></li>
          <li><button className="bouton bouton--principal" style={{ width: '100%' }} onClick={onOpenLogin}>Connexion</button></li>
        </ul>
      </nav>
    </header>
  );
}