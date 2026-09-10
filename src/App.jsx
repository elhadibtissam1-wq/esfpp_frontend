import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CoursePath from './components/CoursePath'; 
import Specialities from './components/Specialities';
import Faq from './components/Faq'; 
import Footer from './components/Footer';
import LoginModal from './components/LoginModal'; 
import StudentDashboard from './components/StudentDashboard'; // 💡 Importation du Dashboard
import AdminLogin from './components/AdminLogin'; // 💡 NOUVEAU : page de connexion admin
import AdminDashboard from './components/AdminDashboard'; // 💡 NOUVEAU : dashboard admin

export default function App() {
  const anneeCourante = new Date().getFullYear();
  const nomPlateforme = "ESFPP Learning";

  // ---- ÉTATS DE L'INTERFACE ----
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // 💡 État de connexion de l'étudiant
  const [estConnecte, setEstConnecte] = useState(false);

  // 💡 NOUVEAU : État de connexion de l'admin (même logique, token séparé)
  const [estAdminConnecte, setEstAdminConnecte] = useState(false);

  // 💡 NOUVEAU : Mode aperçu étudiant, ouvert depuis AdminDashboard
  const [modeApercuActif, setModeApercuActif] = useState(false);

  // ---- VÉRIFICATION DE LA CONNEXION AU CHARGEMENT ----
  useEffect(() => {
    const token = localStorage.getItem('token_etudiant');
    if (token) {
      setEstConnecte(true);
    } else {
      setEstConnecte(false);
    }
  }, []);

  // 💡 NOUVEAU : Vérification de la connexion admin au chargement
  useEffect(() => {
    const tokenAdmin = localStorage.getItem('token_admin');
    setEstAdminConnecte(!!tokenAdmin);
  }, []);

  // 💡 NOUVELLE FONCTION : Appelée par la modal quand la connexion réussit
  const handleLoginSuccess = () => {
    setEstConnecte(true);
    setIsLoginOpen(false); // Ferme la modal automatiquement
  };

  // ---- GESTION DU SCROLL ----
  useEffect(() => {
    if (estConnecte) return;

    const gererScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const sections = ['accueil', 'fonctionnalites', 'comment-ca-marche', 'faq'];
      const positionScroll = window.scrollY + 130;
      
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && positionScroll >= el.offsetTop) {
          setActiveSection(id);
        }
      }
    };
    window.addEventListener('scroll', gererScroll, { passive: true });
    return () => window.removeEventListener('scroll', gererScroll);
  }, [estConnecte]);

  // ---- ANIMATIONS REVEAL ----
  useEffect(() => {
    if (estConnecte) return;

    const elements = document.querySelectorAll('[data-reveal]');
    const observateur = new IntersectionObserver((entrees) => {
      entrees.forEach((entree) => {
        if (entree.isIntersecting) {
          entree.target.classList.add('est-visible');
          observateur.unobserve(entree.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    elements.forEach((el) => observateur.observe(el));
    return () => observateur.disconnect();
  }, [estConnecte]);

  // 💡 NOUVEAU : AIGUILLAGE ADMIN — en tout premier, avant tout le reste.
  // Si l'URL commence par /admin, on sort complètement du site vitrine
  // et du système étudiant, quoi qu'il arrive.
  const estPageAdmin = window.location.pathname.startsWith('/admin');
  if (estPageAdmin) {
    if (estAdminConnecte) {
      // 💡 NOUVEAU : si le mode aperçu est actif, on affiche StudentDashboard
      // en plein écran à la place d'AdminDashboard, jusqu'au clic "Retour"
      if (modeApercuActif) {
        return <StudentDashboard modeApercuAdmin={true} onRetourAdmin={() => setModeApercuActif(false)} />;
      }
      return <AdminDashboard onOuvrirApercu={() => setModeApercuActif(true)} />;
    }
    return <AdminLogin onConnecte={() => setEstAdminConnecte(true)} />;
  }

  // 💡 AFFICHAGE CONDITIONNEL : Si l'étudiant est connecté, on affiche uniquement le Dashboard
  if (estConnecte) {
    return <StudentDashboard />;
  }

  // Sinon, on affiche le site vitrine d'accueil avec sa modal de connexion
  return (
    <>
      <Header 
        isScrolled={isScrolled} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        activeSection={activeSection} 
        onOpenLogin={() => setIsLoginOpen(true)} 
      />
      
      <main id="contenu-principal">
        <Hero onOpenLogin={() => setIsLoginOpen(true)} />
        <Features />
        <CoursePath />
        <Specialities />
        <Faq />
      </main>
      
      <Footer anneeCourante={anneeCourante} nomPlateforme={nomPlateforme} />
      
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </>
  );
}