import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL, getUrlVideoAbsolue } from './config'; // adapte le chemin si config.js n'est pas au même niveau

// 🎨 Icônes SVG (remplacent les emojis 🌙/🌐/♿ du header, peu fiables
// selon l'OS/le navigateur et non redimensionnables proprement).
const IconLune = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
  </svg>
);
const IconSoleil = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8L6 18M18 6l1.8-1.8" />
  </svg>
);

export default function StudentDashboard({ modeApercuAdmin = false, onRetourAdmin } = {}) {
  const [infosEtudiant, setInfosEtudiant] = useState({ id: "", prenom: "", nom: "" });
  const [tousLesCours, setTousLesCours] = useState([]);
  const [chargement, setChargement] = useState(true);

  // 🆕 Affiché uniquement quand TOUS les cours (pas juste un seul) sont
  // entièrement terminés — invite l'étudiant à aller chercher son certificat.
  const [afficherFelicitationsFinales, setAfficherFelicitationsFinales] = useState(false);
  
  const [recherche, setRecherche] = useState("");
  const [accordeonsOuverts, setAccordeonsOuverts] = useState({});
  const [sousGroupesOuverts, setSousGroupesOuverts] = useState({ 
    "toilette-au-lit": true,
    "toilette-au-lavabo": true,
    "changement-de-couche": true,
    "lavage-des-mains": true,
    "prevention-escarres": true,
    "sterilisation": true,
    "microbiologie-generale": true,
    "sociologie-generale": true,
    "systeme-sanitaire": true,
    "reseau-hospitalier": true,
    "soins-palliatifs": true,
    "aide-soignant-psychiatrie": true,
    "materiels-medicaux": true,
    "techniques-bandage-parametres": true,
    "cours-anatomie-generale": true,
    "types-os": true,
    "tous-les-os": true,
    "systeme-cardiovasculaire": true,
    "anatomie-reins": true,
    "systeme-respiratoire": true,
    "systeme-digestif": true,
    "systeme-nerveux": true,
    "systeme-endocrinien": true,
    "appareil-genital-feminin": true,
    "appareil-genital-masculin": true
  });

  // Tableau des numChapitre réellement validés par l'étudiant
  const [chapitresValidesParCours, setChapitresValidesParCours] = useState({});

  // Cours et sous-chapitre actifs
  const [coursActifIndex, setCoursActifIndex] = useState(0);
  const [chapitreActifIndex, setChapitreActifIndex] = useState(0);
  const [tempsMaxAutorise, setTempsMaxAutorise] = useState(99999);
  
  // Quiz
  const [indexQuestionQuiz, setIndexQuestionQuiz] = useState(0);
  const [afficherQuiz, setAfficherQuiz] = useState(false);
  const [quizMasqueTemporairement, setQuizMasqueTemporairement] = useState(false); 
  const [optionSelectionnee, setOptionSelectionnee] = useState(null);
  const [estValide, setEstValide] = useState(false);
  const [erreurQuiz, setErreurQuiz] = useState(false);
  const [erreurChargementVideo, setErreurChargementVideo] = useState(false);
  const [estEnPleinEcran, setEstEnPleinEcran] = useState(false);

  // 🌙 Mode sombre — remplace l'icône 🌙 décorative par un vrai bouton
  // fonctionnel. Préférence mémorisée d'une session à l'autre.
  const [modeSombre, setModeSombre] = useState(() => localStorage.getItem('mode_sombre') === '1');
  useEffect(() => {
    localStorage.setItem('mode_sombre', modeSombre ? '1' : '0');
  }, [modeSombre]);

  const videoRef = useRef(null);
  const conteneurLecteurRef = useRef(null);

  const coursActif = tousLesCours[coursActifIndex] || null;
  const chapitreActif = coursActif?.chapters?.[chapitreActifIndex] || null;
  const questionsDuChapitre = chapitreActif?.questions || chapitreActif?.quiz || [];
  const questionActuelle = questionsDuChapitre[indexQuestionQuiz] || null;

  const videoSourceExtraite = chapitreActif?.videoUrl || chapitreActif?.video_url || coursActif?.videoUrl || coursActif?.video_url;

  // 1️⃣ Charger la liste des cours et la progression BDD
  useEffect(() => {
    // 💡 NOUVEAU : en mode aperçu admin, on charge les cours via la route
    // admin dédiée, avec le token admin — pas de compte étudiant, donc pas
    // de progression à récupérer.
    if (modeApercuAdmin) {
      const tokenAdmin = localStorage.getItem('token_admin');

      fetch(`${API_BASE_URL}/admin/apercu/cours`, {
        headers: { 'Authorization': `Bearer ${tokenAdmin}` }
      })
        .then(res => {
          if (!res.ok) throw new Error(`Erreur serveur: ${res.status}`);
          return res.json();
        })
        .then((dataCourses) => {
          if (Array.isArray(dataCourses) && dataCourses.length > 0) {
            dataCourses.forEach(c => {
              if (c.chapters && Array.isArray(c.chapters)) {
                c.chapters.sort((a, b) => {
                  if (a.numChapitre && b.numChapitre) {
                    return a.numChapitre.localeCompare(b.numChapitre, undefined, { numeric: true, sensitivity: 'base' });
                  }
                  return 0;
                });
              }
            });

            setTousLesCours(dataCourses);
            const premierCours = dataCourses[0];
            setAccordeonsOuverts({ [premierCours.id]: true });
            // Pas de récupération de progression : elle sera traitée à
            // l'étape 2c (déverrouillage automatique de tous les chapitres).
          }
          setChargement(false);
        })
        .catch(err => {
          console.error("Erreur chargement des cours (aperçu admin):", err);
          setChargement(false);
        });
      return; // on ne fait pas le chargement étudiant classique en dessous
    }

    const infosLocal = localStorage.getItem('infos_etudiant');
    const token = localStorage.getItem('token_etudiant');
    const etudiant = infosLocal ? JSON.parse(infosLocal) : null;

    if (etudiant) setInfosEtudiant(etudiant);

    fetch(`${API_BASE_URL}/students/courses`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Erreur serveur: ${res.status}`);
        return res.json();
      })
      .then(async (dataCourses) => {
        if (Array.isArray(dataCourses) && dataCourses.length > 0) {
          
          dataCourses.forEach(c => {
            if (c.chapters && Array.isArray(c.chapters)) {
              c.chapters.sort((a, b) => {
                if (a.numChapitre && b.numChapitre) {
                  return a.numChapitre.localeCompare(b.numChapitre, undefined, { numeric: true, sensitivity: 'base' });
                }
                return 0;
              });
            }
          });

          setTousLesCours(dataCourses);
          const premierCours = dataCourses[0];
          setAccordeonsOuverts({ [premierCours.id]: true });

          if (etudiant && etudiant.id) {
            const reponsesProgress = await Promise.all(
              dataCourses.map(c => 
                fetch(`${API_BASE_URL}/students/progress/${etudiant.id}?courseId=${c.id}`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                }).then(r => r.json()).catch(() => null)
              )
            );

            const mapValides = {};
            dataCourses.forEach((c, idx) => {
              const prog = reponsesProgress[idx];
              mapValides[c.id] = prog?.completedChapters || [];
            });

            setChapitresValidesParCours(mapValides);
          }
        }
        setChargement(false);
      })
      .catch(err => {
        console.error("Erreur chargement des cours:", err);
        setChargement(false);
      });
  }, []);


  // Plein écran
  useEffect(() => {
    const gererChangementFullscreen = () => {
      setEstEnPleinEcran(!!document.fullscreenElement || !!document.webkitFullscreenElement);
    };
    document.addEventListener('fullscreenchange', gererChangementFullscreen);
    document.addEventListener('webkitfullscreenchange', gererChangementFullscreen);
    return () => {
      document.removeEventListener('fullscreenchange', gererChangementFullscreen);
      document.removeEventListener('webkitfullscreenchange', gererChangementFullscreen);
    };
  }, []);

  // Clavier
  useEffect(() => {
    const gererClavier = (e) => {
      if ((afficherQuiz && !quizMasqueTemporairement) || !videoRef.current) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 5);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (videoRef.current.paused) videoRef.current.play().catch(() => {});
        else videoRef.current.pause();
      }
    };

    window.addEventListener('keydown', gererClavier);
    return () => window.removeEventListener('keydown', gererClavier);
  }, [afficherQuiz, quizMasqueTemporairement]);

  const gererTempsVideo = () => {
    if (videoRef.current) {
      const tempsActuel = videoRef.current.currentTime;
      const dureeTotale = videoRef.current.duration;

      if (chapitreActif && chapitreActif.finSeconde && tempsActuel >= chapitreActif.finSeconde - 0.4) {
        if (!quizMasqueTemporairement && questionsDuChapitre.length > 0) {
          videoRef.current.pause();
          setAfficherQuiz(true);
        }
      }

      if (dureeTotale && tempsActuel >= dureeTotale - 1) {
        if (!quizMasqueTemporairement && questionsDuChapitre.length > 0) {
          videoRef.current.pause();
          setAfficherQuiz(true);
        }
      }
    }
  };

  const gererFinVideo = () => {
    if (questionsDuChapitre.length > 0) {
      setQuizMasqueTemporairement(false);
      if (videoRef.current) videoRef.current.pause();
      setAfficherQuiz(true);
    }
  };

  const basculerPleinEcranManuel = () => {
    if (conteneurLecteurRef.current) {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        const req = conteneurLecteurRef.current.requestFullscreen || conteneurLecteurRef.current.webkitRequestFullscreen;
        if (req) req.call(conteneurLecteurRef.current).catch(err => console.log(err));
      } else {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) exit.call(document).catch(() => {});
      }
    }
  };

  const handleDeconnexion = () => {
    localStorage.removeItem('token_etudiant');
    localStorage.removeItem('infos_etudiant');
    window.location.reload();
  };

  // 🎯 VALIDATION DU QUIZ ET SAUVEGARDE EN BDD
  const gererBoutonActionQuiz = () => {
    if (!questionActuelle) return;

    if (!estValide) {
      setErreurQuiz(optionSelectionnee !== questionActuelle.reponseCorrecte);
      setEstValide(true);
      return;
    }

    setEstValide(false);
    setOptionSelectionnee(null);
    setErreurQuiz(false);

    if (indexQuestionQuiz < questionsDuChapitre.length - 1) {
      setIndexQuestionQuiz(prev => prev + 1);
    } else {
      setAfficherQuiz(false);
      setQuizMasqueTemporairement(false);
      setIndexQuestionQuiz(0);

      const numChapitreValide = chapitreActif?.numChapitre;
      const validesActuels = chapitresValidesParCours[coursActif.id] || [];

      // 🆕 Calculée AVANT le setState (qui est asynchrone) pour pouvoir
      // vérifier tout de suite, plus bas, si la plateforme entière est
      // désormais terminée — sans attendre le prochain rendu React.
      const nouveauxValidesPourCeCours = (numChapitreValide && !validesActuels.includes(numChapitreValide))
        ? [...validesActuels, numChapitreValide]
        : validesActuels;
      const mapApresMiseAJour = {
        ...chapitresValidesParCours,
        [coursActif.id]: nouveauxValidesPourCeCours,
      };

      if (numChapitreValide && !validesActuels.includes(numChapitreValide)) {
        setChapitresValidesParCours(prev => ({
          ...prev,
          [coursActif.id]: nouveauxValidesPourCeCours
        }));

        // 💡 NOUVEAU : en mode aperçu admin, on ne sauvegarde jamais rien
        // en base — l'admin voit quand même la coche se cocher à l'écran
        // (mise à jour locale ci-dessus), mais aucune requête n'est envoyée.
        if (!modeApercuAdmin) {
          const token = localStorage.getItem('token_etudiant');
          if (infosEtudiant && infosEtudiant.id) {
            fetch(`${API_BASE_URL}/students/update-progress`, {
              method: 'PUT',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                studentId: infosEtudiant.id,
                courseId: coursActif.id,
                numChapitre: numChapitreValide
              }),
            })
            .then(res => res.json())
            .catch(err => console.error("Erreur sauvegarde BDD :", err));
          }
        }
      }

      const nbTotalChapitres = coursActif?.chapters?.length || 1;
      const estDernierChapitre = chapitreActifIndex === nbTotalChapitres - 1;

      if (!estDernierChapitre) {
        // ✅ CORRECTION DU BUG : on détermine si le chapitre suivant
        // utilise le MÊME fichier vidéo que le chapitre actuel.
        // Si oui, on NE TOUCHE PAS à currentTime : la lecture continue
        // naturellement là où elle s'était arrêtée pour le quiz.
        // Si non (nouveau fichier), on repart bien de 0.
        const chapitreActuel = coursActif.chapters[chapitreActifIndex];
        const prochainChapitre = coursActif.chapters[chapitreActifIndex + 1];
        const sourceActuelle = chapitreActuel?.videoUrl || chapitreActuel?.video_url;
        const sourceProchaine = prochainChapitre?.videoUrl || prochainChapitre?.video_url;
        const memeFichierVideo = sourceActuelle && sourceProchaine && sourceActuelle === sourceProchaine;

        setChapitreActifIndex(prev => prev + 1);

        setTimeout(() => {
          if (videoRef.current) {
            if (!memeFichierVideo) {
              // Nouveau fichier vidéo : on repart du début
              videoRef.current.currentTime = 0;
            }
            // Sinon : on laisse currentTime tel quel (la vidéo continue
            // exactement où elle s'était arrêtée avant le quiz)
            videoRef.current.play().catch(() => {});
          }
        }, 100);
      } else {
        // 🆕 On vérifie si CE cours était le DERNIER cours qu'il restait à
        // terminer sur toute la plateforme (pas juste "ce module").
        const toutEstTermine = tousLesCours.every((c) => {
          const chapitresDuCoursValides = mapApresMiseAJour[c.id] || [];
          return (c.chapters || []).every((ch) => chapitresDuCoursValides.includes(ch.numChapitre));
        });

        if (toutEstTermine) {
          setAfficherFelicitationsFinales(true);
        } else {
          alert("🎉 Félicitations ! Vous avez validé toutes les leçons de ce module !");
        }
      }
    }
  };

  if (chargement) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f6f8' }}>
        <h3>Chargement de votre espace de cours...</h3>
      </div>
    );
  }

  if (tousLesCours.length === 0) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f6f8' }}>
        <h3>Aucun cours disponible dans la base de données.</h3>
      </div>
    );
  }

  // 🎯 LOGIQUE DE VERROUILLAGE UNIFIÉE (fonctionne pour tous les cours,
  // y compris les futurs, sans jamais avoir besoin de coder un cas spécial) :
  //
  // Le "groupe" d'un chapitre = son numChapitre sans le dernier segment.
  // Ex: "13.8.1" et "13.8.2" sont dans le groupe "13.8".
  //     "3.2.1" est seul dans le groupe "3.2".
  //     "nvgfdtr" (pas de point) n'a pas de groupe : il est considéré
  //     comme son propre groupe, donc toujours débloqué s'il est seul.
  //
  // Règle : le premier chapitre du cours, ET le premier chapitre de
  // chaque nouveau groupe, sont débloqués automatiquement. À l'intérieur
  // d'un même groupe, chaque chapitre suivant nécessite que le précédent
  // ait été validé.
  const calculerGroupeChapitre = (numChapitre) => {
    if (!numChapitre) return '';
    const segments = numChapitre.split('.');
    // 🔧 CORRECTION : un numChapitre SANS point (ex: "1", "2" — cas des
    // cours créés simplement depuis l'admin, sans sous-modules) est
    // maintenant rattaché à un groupe commun implicite (chaîne vide),
    // au lieu d'être son propre groupe. Avant ce correctif, chaque
    // chapitre "à plat" était vu comme le premier chapitre d'un nouveau
    // groupe et donc automatiquement débloqué, quel que soit l'état du
    // chapitre précédent. Les cours utilisant une numérotation à points
    // (ex: "13.7.1", "13.7.2") ne sont pas affectés par ce changement.
    return segments.length > 1 ? segments.slice(0, -1).join('.') : '';
  };

  const rendreItemChapitre = (chap, cours, idxCours) => {
    const listValides = chapitresValidesParCours[cours.id] || [];
    const idxChap = cours.chapters.findIndex(c => c.id === chap.id);

    // 🆕 Détermine le "groupe de verrouillage" d'un chapitre : si le
    // chapitre a un dossierNom, le dossier LUI-MÊME est le groupe (donc
    // tous les chapitres d'un même dossier sont séquentiels entre eux,
    // peu importe leur numéro). Sans dossier, on retombe sur l'ancien
    // calcul par numChapitre, pour ne rien changer aux cours qui
    // n'utilisent pas les dossiers.
    const obtenirGroupeVerrouillage = (c) => {
      const dossier = c?.dossierNom || c?.dossier_nom;
      return dossier ? `dossier:${dossier}` : calculerGroupeChapitre(c?.numChapitre);
    };

    let estDebloque = false;

    // 💡 En mode aperçu admin, tout est débloqué d'office —
    // on saute toute la logique normale de verrouillage séquentiel.
    if (modeApercuAdmin) {
      estDebloque = true;
    } else if (idxChap === 0) {
      // Premier chapitre du cours entier : toujours débloqué.
      estDebloque = true;
    } else {
      const chapPrecedent = cours.chapters[idxChap - 1];
      const groupeCourant = obtenirGroupeVerrouillage(chap);
      const groupePrecedent = obtenirGroupeVerrouillage(chapPrecedent);

      if (groupeCourant !== groupePrecedent) {
        // Premier chapitre d'un nouveau groupe/dossier : débloqué.
        estDebloque = true;
      } else if (chapPrecedent && listValides.includes(chapPrecedent.numChapitre)) {
        // Même groupe/dossier que le précédent : il faut que celui-ci soit validé.
        estDebloque = true;
      }
    }

    const estActif = (idxCours === coursActifIndex) && idxChap === chapitreActifIndex;
    const estComplete = listValides.includes(chap.numChapitre);

    return (
      <li 
        key={chap.id || idxChap} 
        onClick={() => {
          if (!estDebloque) {
            alert("🔒 Ce chapitre est verrouillé. Veuillez d'abord valider le chapitre précédent !");
            return;
          }

          setCoursActifIndex(idxCours);
          setChapitreActifIndex(idxChap);
          setAfficherQuiz(false);
          setQuizMasqueTemporairement(false);
          setIndexQuestionQuiz(0);
          setEstValide(false);
          setErreurChargementVideo(false);

          if (videoRef.current) {
            videoRef.current.currentTime = 0;
          }
        }}
        style={{
          ...styles.chapterItem,
          backgroundColor: estActif ? '#eafcf0' : 'transparent',
          cursor: estDebloque ? 'pointer' : 'not-allowed',
          opacity: estDebloque ? 1 : 0.6
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: '12px', width: '85%'}}>
          <div style={{
            ...styles.statusCircle,
            backgroundColor: estComplete ? '#28a745' : 'transparent',
            borderColor: estActif || estComplete ? '#28a745' : '#cccccc'
          }}>
            {estComplete && <span style={{color: '#ffffff', fontSize: '0.65rem', fontWeight: 'bold'}}>✓</span>}
          </div>

          <span style={{
            color: estActif ? '#155724' : (estComplete ? '#28a745' : '#333333'),
            fontWeight: estActif ? '700' : '500',
            fontSize: '0.85rem'
          }}>
            {chap.nom}
          </span>
        </div>

        <span style={{fontSize: '0.85rem'}}>{estDebloque ? '🔓' : '🔒'}</span>
      </li>
    );
  };

  return (
    <div data-theme={modeSombre ? 'dark' : 'light'} style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <style>{`
        [data-theme="light"] {
          --bg-app: #f4f6f8;
          --bg-surface: #ffffff;
          --bg-surface-alt: #f8f9fa;
          --text-primary: #222222;
          --text-secondary: #555555;
          --text-tertiary: #333333;
          --border-color: #e0e0e0;
          --border-color-light: #f0f0f0;
        }
        [data-theme="dark"] {
          --bg-app: #0f1420;
          --bg-surface: #1a2233;
          --bg-surface-alt: #232c3f;
          --text-primary: #e8ecf3;
          --text-secondary: #94a3b8;
          --text-tertiary: #cbd5e1;
          --border-color: #2d3748;
          --border-color-light: #232c3f;
        }
      `}</style>
      {/* 💡 NOUVEAU : bandeau visible uniquement quand un admin ouvre l'aperçu */}
      {modeApercuAdmin && (
        <div style={styles.bandeauApercuAdmin}>
          <span>👁️ Mode aperçu administrateur — tous les chapitres sont déverrouillés, rien n'est enregistré</span>
          <button style={styles.boutonRetourAdmin} onClick={() => onRetourAdmin && onRetourAdmin()}>
            ← Retour à l'administration
          </button>
        </div>
      )}

      <div style={{ ...styles.appContainer, height: modeApercuAdmin ? 'calc(100vh - 38px)' : '100vh' }}>
      
      {/* BARRE LATÉRALE */}
      <aside style={styles.sidebar}>
        <div style={styles.tabContainer}>
          <button style={styles.tabButton}>
            📋 Plan du cours
          </button>
        </div>

        <div style={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="Rechercher dans le plan..." 
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            style={styles.searchInput}
          />
          <span style={styles.searchIcon}>🔍</span>
        </div>

        <div style={styles.outlineContent}>
          <div style={styles.knowledgeCheckItem}>
            <span style={{fontWeight: '700', color: '#1e7e34', fontSize: '0.95rem'}}>Progression du module</span>
            <span style={{fontSize: '1.1rem'}}>📈</span>
          </div>

          {tousLesCours.map((cours, idxCours) => {
            const estOuvert = !!accordeonsOuverts[cours.id];
            const estLeCoursActif = idxCours === coursActifIndex;
            const nbChapitres = cours.chapters?.length || 1;

            const validesDuCours = chapitresValidesParCours[cours.id] || [];
            const pourcentageReel = Math.min(100, Math.round((validesDuCours.length / nbChapitres) * 100));

            const chapitresFitres = cours.chapters?.filter(chap => 
              chap.nom.toLowerCase().includes(recherche.toLowerCase())
            ) || [];

            // Détection robuste du cours par le préfixe numérique de ses chapitres
            // (indépendante de l'id auto-incrémenté en base, qui peut varier).
            const premierChapDuCours = [...(cours.chapters || [])].sort((a, b) => 
              (a.numChapitre || '').localeCompare(b.numChapitre || '', undefined, { numeric: true, sensitivity: 'base' })
            )[0];
            const prefixeCours = premierChapDuCours?.numChapitre?.split('.')[0];

            const chapitresToiletteLit = chapitresFitres.filter(c => c.numChapitre?.startsWith('2.1.'));
            const chapitresToiletteLavabo = chapitresFitres.filter(c => c.numChapitre?.startsWith('2.2.'));
            const chapitresChangementCouche = chapitresFitres.filter(c => c.numChapitre?.startsWith('2.3.'));
            const chapitresLavageMains = chapitresFitres.filter(c => c.numChapitre?.startsWith('2.4.'));
            const chapitresPreventionEscarres = chapitresFitres.filter(c => c.numChapitre?.startsWith('2.5.'));

            // Cours 3 : la Stérilisation (numChapitre 3.2.x, vidéo cours16.mp4) devient
            // un sous-dossier à part. Tout le reste (3.1, 3.3, 3.4, 3.5) reste
            // strictement inchangé, avec ses numéros d'origine.
            const chapitresSterilisation = chapitresFitres.filter(c => c.numChapitre?.startsWith('3.2.'));
            const chapitresResteMicrobio = chapitresFitres.filter(c => !c.numChapitre?.startsWith('3.2.'));

            // Cours 8 (Éléments de sociologie) : 1 seul sous-chapitre "La sociologie"
            const chapitresSociologieGenerale = chapitresFitres.filter(c => c.numChapitre?.startsWith('8.1.'));

            // Cours 9 (Droit et Législation) : 2 sous-chapitres nommés
            const chapitresSystemeSanitaire = chapitresFitres.filter(c => c.numChapitre?.startsWith('9.1.'));
            const chapitresReseauHospitalier = chapitresFitres.filter(c => c.numChapitre?.startsWith('9.2.'));

            // Cours 10 (Soins palliatifs et santé mentale) : 2 sous-chapitres nommés
            const chapitresSoinsPalliatifs = chapitresFitres.filter(c => c.numChapitre?.startsWith('10.1.'));
            const chapitresAideSoignantPsychiatrie = chapitresFitres.filter(c => c.numChapitre?.startsWith('10.2.'));

            // Cours 11 (Matériel médical et techniques de soins) : 4 sous-chapitres nommés
            const chapitresMaterielsMedicaux = chapitresFitres.filter(c => c.numChapitre?.startsWith('11.1.'));
            const chapitresTechniquesBandagesParametres = chapitresFitres.filter(c => 
              c.numChapitre?.startsWith('11.2.') || c.numChapitre?.startsWith('11.3.') || c.numChapitre?.startsWith('11.4.')
            );

            // Cours 12 (Anatomie générale) : 3 sous-chapitres nommés
            const chapitresCoursAnatomieGenerale = chapitresFitres.filter(c => c.numChapitre?.startsWith('12.1.'));
            const chapitresTypesOs = chapitresFitres.filter(c => c.numChapitre?.startsWith('12.2.'));
            const chapitresTousLesOs = chapitresFitres.filter(c => c.numChapitre?.startsWith('12.3.'));

            // Cours 13 (Anatomie des appareils et systèmes) : 3 sous-chapitres nommés
            const chapitresSystemeCardiovasculaire = chapitresFitres.filter(c => c.numChapitre?.startsWith('13.1.'));
            const chapitresAnatomieReins = chapitresFitres.filter(c => c.numChapitre?.startsWith('13.2.'));
            const chapitresSystemeRespiratoire = chapitresFitres.filter(c => c.numChapitre?.startsWith('13.3.'));
            const chapitresSystemeDigestif = chapitresFitres.filter(c => c.numChapitre?.startsWith('13.4.'));
            const chapitresSystemeNerveux = chapitresFitres.filter(c => c.numChapitre?.startsWith('13.5.'));
            const chapitresSystemeEndocrinien = chapitresFitres.filter(c => c.numChapitre?.startsWith('13.6.'));
            const chapitresAppareilGenitalFeminin = chapitresFitres.filter(c => c.numChapitre?.startsWith('13.7.'));
            const chapitresAppareilGenitalMasculin = chapitresFitres.filter(c => c.numChapitre?.startsWith('13.8.'));

            return (
              <div key={cours.id} style={styles.moduleAccordion}>
                <button 
                  onClick={() => setAccordeonsOuverts(prev => ({ ...prev, [cours.id]: !prev[cours.id] }))} 
                  style={{
                    ...styles.moduleHeader,
                    backgroundColor: estLeCoursActif ? '#f8f9fa' : 'transparent'
                  }}
                >
                  <div style={{display: 'flex', flexDirection: 'column', gap: '6px', width: '82%'}}>
                    <span style={styles.moduleTitle}>{cours.titre}</span>
                    <div style={styles.progressTrack}>
                      <div style={{
                        ...styles.progressBar, 
                        width: `${pourcentageReel}%`
                      }}></div>
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start', marginTop: '2px'}}>
                    <span style={{fontSize: '0.8rem', color: '#555555', fontWeight: 'bold'}}>
                      {pourcentageReel}%
                    </span>
                    <span style={{fontSize: '0.75rem', transform: estOuvert ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}}>▼</span>
                  </div>
                </button>

                {estOuvert && (
                  <div style={{ paddingLeft: '8px' }}>
                    {prefixeCours === '2' ? (
                      <>
                        {/* DOSSIER 1.2 : TOILETTE AU LIT */}
                        {chapitresToiletteLit.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button 
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "toilette-au-lit": !prev["toilette-au-lit"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>2.1 Toilette au lit</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["toilette-au-lit"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["toilette-au-lit"] && (
                              <ul style={styles.chapterList}>
                                {chapitresToiletteLit.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* DOSSIER 1.3 : TOILETTE AU LAVABO ET DOUCHE COUCHÉE */}
                        {chapitresToiletteLavabo.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button 
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "toilette-au-lavabo": !prev["toilette-au-lavabo"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>2.2 Toilette au lavabo et Douche couchée</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["toilette-au-lavabo"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["toilette-au-lavabo"] && (
                              <ul style={styles.chapterList}>
                                {chapitresToiletteLavabo.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* DOSSIER 1.4 : CHANGEMENT DE COUCHE AU LIT */}
                        {chapitresChangementCouche.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button 
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "changement-de-couche": !prev["changement-de-couche"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>2.3 Changement de couche au lit</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["changement-de-couche"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["changement-de-couche"] && (
                              <ul style={styles.chapterList}>
                                {chapitresChangementCouche.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* DOSSIER 1.5 : TECHNIQUE DE LAVAGE SIMPLE ET DE FRICTION HYDROALCOOLISQUE DES MAINS */}
                        {chapitresLavageMains.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button 
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "lavage-des-mains": !prev["lavage-des-mains"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>2.4 Technique de lavage simple et de friction hydroalcoolique des mains</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["lavage-des-mains"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["lavage-des-mains"] && (
                              <ul style={styles.chapterList}>
                                {chapitresLavageMains.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* DOSSIER 1.6 : PRÉVENTION DES ESCARRES */}
                        {chapitresPreventionEscarres.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button 
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "prevention-escarres": !prev["prevention-escarres"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>2.5 Prévention des escarres</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["prevention-escarres"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["prevention-escarres"] && (
                              <ul style={styles.chapterList}>
                                {chapitresPreventionEscarres.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}
                      </>
                    ) : prefixeCours === '3' ? (
                      <>
                        {/* DOSSIER : MICROBIOLOGIE GÉNÉRALE (regroupe 3.1, 3.3, 3.4, 3.5 - progression séquentielle) */}
                        {chapitresResteMicrobio.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button 
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "microbiologie-generale": !prev["microbiologie-generale"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>Microbiologie générale</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["microbiologie-generale"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["microbiologie-generale"] && (
                              <ul style={styles.chapterList}>
                                {chapitresResteMicrobio.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* DOSSIER : STÉRILISATION À L'HÔPITAL (à part, indépendant) */}
                        {chapitresSterilisation.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button 
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "sterilisation": !prev["sterilisation"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>La stérilisation à l'hôpital</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["sterilisation"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["sterilisation"] && (
                              <ul style={styles.chapterList}>
                                {chapitresSterilisation.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}
                      </>
                    ) : prefixeCours === '8' ? (
                      <>
                        {/* DOSSIER : LA SOCIOLOGIE */}
                        {chapitresSociologieGenerale.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button 
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "sociologie-generale": !prev["sociologie-generale"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>La sociologie</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["sociologie-generale"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["sociologie-generale"] && (
                              <ul style={styles.chapterList}>
                                {chapitresSociologieGenerale.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}
                      </>
                    ) : prefixeCours === '9' ? (
                      <>
                        {/* DOSSIER : LE SYSTÈME SANITAIRE AU MAROC (3 parties séquentielles) */}
                        {chapitresSystemeSanitaire.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button 
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "systeme-sanitaire": !prev["systeme-sanitaire"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>Le système sanitaire au Maroc</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["systeme-sanitaire"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["systeme-sanitaire"] && (
                              <ul style={styles.chapterList}>
                                {chapitresSystemeSanitaire.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* DOSSIER : RÉSEAU HOSPITALIER AU MAROC, ORGANISATION ET TYPOLOGIE */}
                        {chapitresReseauHospitalier.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button 
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "reseau-hospitalier": !prev["reseau-hospitalier"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>Réseau hospitalier au Maroc, organisation et typologie</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["reseau-hospitalier"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["reseau-hospitalier"] && (
                              <ul style={styles.chapterList}>
                                {chapitresReseauHospitalier.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}
                      </>
                    ) : prefixeCours === '10' ? (
                      <>
                        {/* DOSSIER : LES SOINS PALLIATIFS */}
                        {chapitresSoinsPalliatifs.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button 
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "soins-palliatifs": !prev["soins-palliatifs"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>Les soins palliatifs</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["soins-palliatifs"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["soins-palliatifs"] && (
                              <ul style={styles.chapterList}>
                                {chapitresSoinsPalliatifs.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* DOSSIER : L'AIDE-SOIGNANT EN PSYCHIATRIE */}
                        {chapitresAideSoignantPsychiatrie.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button 
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "aide-soignant-psychiatrie": !prev["aide-soignant-psychiatrie"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>L'aide-soignant en psychiatrie</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["aide-soignant-psychiatrie"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["aide-soignant-psychiatrie"] && (
                              <ul style={styles.chapterList}>
                                {chapitresAideSoignantPsychiatrie.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}
                      </>
                    ) : prefixeCours === '11' ? (
                      <>
                        {/* DOSSIER : LES MATÉRIELS MÉDICAUX */}
                        {chapitresMaterielsMedicaux.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button 
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "materiels-medicaux": !prev["materiels-medicaux"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>Les matériels médicaux</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["materiels-medicaux"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["materiels-medicaux"] && (
                              <ul style={styles.chapterList}>
                                {chapitresMaterielsMedicaux.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* DOSSIER : TECHNIQUES DE BANDAGE ET PRISE DES PARAMÈTRES */}
                        {chapitresTechniquesBandagesParametres.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button 
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "techniques-bandage-parametres": !prev["techniques-bandage-parametres"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>Techniques de bandage et prise des paramètres</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["techniques-bandage-parametres"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["techniques-bandage-parametres"] && (
                              <ul style={styles.chapterList}>
                                {chapitresTechniquesBandagesParametres.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}
                      </>
                    ) : prefixeCours === '12' ? (
                      <>
                        {/* DOSSIER : COURS ANATOMIE GÉNÉRALE */}
                        {chapitresCoursAnatomieGenerale.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button 
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "cours-anatomie-generale": !prev["cours-anatomie-generale"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>Cours anatomie générale</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["cours-anatomie-generale"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["cours-anatomie-generale"] && (
                              <ul style={styles.chapterList}>
                                {chapitresCoursAnatomieGenerale.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* DOSSIER : ANATOMIE DU SQUELETTE - LES TYPES D'OS */}
                        {chapitresTypesOs.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button 
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "types-os": !prev["types-os"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>Anatomie du squelette – les types d'os</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["types-os"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["types-os"] && (
                              <ul style={styles.chapterList}>
                                {chapitresTypesOs.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* DOSSIER : TOUS LES OS DU CORPS HUMAIN EN 7 MIN */}
                        {chapitresTousLesOs.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button 
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "tous-les-os": !prev["tous-les-os"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>Tous les os du corps humain en 7 min</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["tous-les-os"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["tous-les-os"] && (
                              <ul style={styles.chapterList}>
                                {chapitresTousLesOs.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}
                      </>
                    ) : prefixeCours === '13' ? (
                      <>
                        {/* DOSSIER : SYSTÈME CARDIOVASCULAIRE */}
                        {chapitresSystemeCardiovasculaire.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "systeme-cardiovasculaire": !prev["systeme-cardiovasculaire"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>Système cardiovasculaire</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["systeme-cardiovasculaire"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["systeme-cardiovasculaire"] && (
                              <ul style={styles.chapterList}>
                                {chapitresSystemeCardiovasculaire.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* DOSSIER : ANATOMIE DES REINS */}
                        {chapitresAnatomieReins.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "anatomie-reins": !prev["anatomie-reins"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>Anatomie des reins</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["anatomie-reins"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["anatomie-reins"] && (
                              <ul style={styles.chapterList}>
                                {chapitresAnatomieReins.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* DOSSIER : SYSTÈME RESPIRATOIRE */}
                        {chapitresSystemeRespiratoire.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "systeme-respiratoire": !prev["systeme-respiratoire"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>Système respiratoire</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["systeme-respiratoire"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["systeme-respiratoire"] && (
                              <ul style={styles.chapterList}>
                                {chapitresSystemeRespiratoire.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* DOSSIER : SYSTÈME DIGESTIF */}
                        {chapitresSystemeDigestif.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "systeme-digestif": !prev["systeme-digestif"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>Système digestif</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["systeme-digestif"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["systeme-digestif"] && (
                              <ul style={styles.chapterList}>
                                {chapitresSystemeDigestif.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* DOSSIER : SYSTÈME NERVEUX */}
                        {chapitresSystemeNerveux.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "systeme-nerveux": !prev["systeme-nerveux"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>Système nerveux</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["systeme-nerveux"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["systeme-nerveux"] && (
                              <ul style={styles.chapterList}>
                                {chapitresSystemeNerveux.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* DOSSIER : SYSTÈME ENDOCRINIEN */}
                        {chapitresSystemeEndocrinien.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "systeme-endocrinien": !prev["systeme-endocrinien"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>Système endocrinien</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["systeme-endocrinien"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["systeme-endocrinien"] && (
                              <ul style={styles.chapterList}>
                                {chapitresSystemeEndocrinien.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* DOSSIER : APPAREIL GÉNITAL FÉMININ */}
                        {chapitresAppareilGenitalFeminin.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "appareil-genital-feminin": !prev["appareil-genital-feminin"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>Appareil génital féminin</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["appareil-genital-feminin"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["appareil-genital-feminin"] && (
                              <ul style={styles.chapterList}>
                                {chapitresAppareilGenitalFeminin.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* DOSSIER : APPAREIL GÉNITAL MASCULIN */}
                        {chapitresAppareilGenitalMasculin.length > 0 && (
                          <div style={{ margin: '6px 0' }}>
                            <button
                              onClick={() => setSousGroupesOuverts(prev => ({ ...prev, "appareil-genital-masculin": !prev["appareil-genital-masculin"] }))}
                              style={styles.sousGroupeHeader}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📁</span>
                                <span style={{ fontWeight: 'bold' }}>Appareil génital masculin</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts["appareil-genital-masculin"] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>

                            {sousGroupesOuverts["appareil-genital-masculin"] && (
                              <ul style={styles.chapterList}>
                                {chapitresAppareilGenitalMasculin.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      /* 🆕 RENDU GÉNÉRIQUE PILOTÉ PAR L'ADMIN — remplace le besoin
                         de coder un cas spécial par cours. Les chapitres qui ont
                         un `dossierNom` défini (via le dashboard admin) sont
                         automatiquement regroupés dans un dossier dépliable,
                         exactement comme les blocs codés en dur ci-dessus.
                         Les chapitres sans dossierNom s'affichent à plat, comme
                         avant — donc aucun changement pour les cours existants
                         qui n'utilisent pas cette option. */
                      (() => {
                        const blocsAffiches = [];
                        let dossierEnCours = null;
                        let chapitresEnAttente = [];

                        const viderFileAttente = () => {
                          if (chapitresEnAttente.length === 0) return;

                          if (dossierEnCours) {
                            const cleDossier = `${cours.id}-dossier-${dossierEnCours}`;
                            blocsAffiches.push(
                              <div key={cleDossier} style={{ margin: '6px 0' }}>
                                <button
                                  onClick={() => setSousGroupesOuverts(prev => ({ ...prev, [cleDossier]: !prev[cleDossier] }))}
                                  style={styles.sousGroupeHeader}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>📁</span>
                                    <span style={{ fontWeight: 'bold' }}>{dossierEnCours}</span>
                                  </div>
                                  <span style={{ fontSize: '0.75rem', transform: sousGroupesOuverts[cleDossier] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                                </button>

                                {sousGroupesOuverts[cleDossier] && (
                                  <ul style={styles.chapterList}>
                                    {chapitresEnAttente.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                                  </ul>
                                )}
                              </div>
                            );
                          } else {
                            blocsAffiches.push(
                              <ul key={`plat-${chapitresEnAttente[0].id}`} style={styles.chapterList}>
                                {chapitresEnAttente.map(chap => rendreItemChapitre(chap, cours, idxCours))}
                              </ul>
                            );
                          }

                          dossierEnCours = null;
                          chapitresEnAttente = [];
                        };

                        chapitresFitres.forEach(chap => {
                          const nomDossierChap = chap.dossierNom || chap.dossier_nom || null;
                          // Nouveau dossier (ou sortie de dossier) : on referme le
                          // groupe précédent avant d'en commencer un nouveau.
                          if (nomDossierChap !== dossierEnCours) {
                            viderFileAttente();
                            dossierEnCours = nomDossierChap;
                          }
                          chapitresEnAttente.push(chap);
                        });
                        viderFileAttente();

                        return <>{blocsAffiches}</>;
                      })()
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* LECTEUR VIDÉO ET QUIZ */}
      <div style={styles.workspace}>
        <header style={styles.topHeader}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <span style={{fontSize: '1.2rem', cursor: 'pointer', color: '#555'}}>☰</span>
            <h2 style={styles.headerTitle}>{chapitreActif?.nom || coursActif?.titre}</h2>
          </div>
          
          <div style={styles.headerTools}>
            <span style={{fontSize: '0.85rem', color: '#555', fontWeight: '500'}}>
              {modeApercuAdmin ? '👁️ Aperçu administrateur' : `Bonjour, ${infosEtudiant.prenom || ''}`}
            </span>
            <button
              type="button"
              onClick={() => setModeSombre(v => !v)}
              style={styles.toolIconButton}
              title={modeSombre ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              {modeSombre ? <IconSoleil size={16} /> : <IconLune size={16} />}
            </button>
            <button onClick={handleDeconnexion} style={styles.logoutButton} title="Quitter la session">
              🚪 Déconnexion
            </button>
          </div>
        </header>

        <div style={styles.contentWrapper}>
          <button 
            disabled={chapitreActifIndex === 0 && coursActifIndex === 0}
            onClick={() => {
              if (chapitreActifIndex > 0) {
                setChapitreActifIndex(prev => prev - 1);
                setAfficherQuiz(false);
                setQuizMasqueTemporairement(false);
                setIndexQuestionQuiz(0);
                setEstValide(false);
                if (videoRef.current) videoRef.current.currentTime = 0;
              }
            }}
            style={{...styles.navArrow, left: '20px', opacity: chapitreActifIndex === 0 ? 0.3 : 1}}
          >
            ❮
          </button>

          <div ref={conteneurLecteurRef} style={{ ...styles.mainCard, ...(estEnPleinEcran ? styles.mainCardFullscreen : {}) }} tabIndex={0}>
            {!erreurChargementVideo && coursActif ? (
              <>
                <video
                  key={videoSourceExtraite || chapitreActif?.id}
                  ref={videoRef}
                  src={getUrlVideoAbsolue(videoSourceExtraite)}
                  onTimeUpdate={gererTempsVideo}
                  onEnded={gererFinVideo}
                  onError={() => setErreurChargementVideo(true)}
                  controls
                  controlsList="nodownload nofullscreen"
                  playsInline
                  webkit-playsinline="true"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000000' }}
                />

                {(!afficherQuiz || quizMasqueTemporairement) && (
                  <button onClick={basculerPleinEcranManuel} style={styles.boutonPleinEcranHautDroite} title="Plein écran">
                    <span>⛶</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 'bold' }}>{estEnPleinEcran ? "Réduire" : "Plein écran"}</span>
                  </button>
                )}
              </>
            ) : (
              <div style={styles.erreurVideoBox}>
                <span style={{ fontSize: '3rem' }}>⚠️</span>
                <p style={{ fontWeight: 'bold', margin: '15px 0 5px' }}>Fichier vidéo introuvable.</p>
                <small style={{ color: '#666' }}>URL demandée : {getUrlVideoAbsolue(videoSourceExtraite) || 'aucune'}</small>
              </div>
            )}

            {/* OVERLAY INTERACTIF DU QUIZ */}
            {afficherQuiz && !quizMasqueTemporairement && questionActuelle && (
              <div style={styles.quizOverlay}>
                <div style={styles.quizBoite}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={styles.quizBadge}>📝 QUESTION {indexQuestionQuiz + 1} / {questionsDuChapitre.length}</span>
                    <button 
                      onClick={() => {
                        setAfficherQuiz(false);
                        setQuizMasqueTemporairement(false);
                        setIndexQuestionQuiz(0);
                        setEstValide(false);
                        setOptionSelectionnee(null);
                        if (videoRef.current) {
                          videoRef.current.currentTime = 0;
                          videoRef.current.play().catch(() => {});
                        }
                      }} 
                      style={styles.boutonRevoirVideo}
                    >
                      🔄 Revoir la vidéo
                    </button>
                  </div>

                  <h3 style={styles.quizQuestion}>{questionActuelle.question}</h3>
                  
                  <div style={styles.listeOptions}>
                    {questionActuelle.options?.map((option, index) => {
                      const estLaReponseCorrecte = index === questionActuelle.reponseCorrecte;
                      const estOptionChoisie = optionSelectionnee === index;

                      let styleDynamique = { border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-tertiary)' };

                      if (!estValide) {
                        if (estOptionChoisie) {
                          styleDynamique.border = '2px solid #007bff';
                          styleDynamique.backgroundColor = '#e8f0fe';
                        }
                      } else {
                        if (estLaReponseCorrecte) {
                          styleDynamique.border = '2px solid #28a745';
                          styleDynamique.backgroundColor = '#eafcf0';
                          styleDynamique.color = '#155724';
                        } else if (estOptionChoisie) {
                          styleDynamique.border = '2px solid #dc3545';
                          styleDynamique.backgroundColor = '#f8d7da';
                          styleDynamique.color = '#721c24';
                        }
                      }

                      return (
                        <button
                          key={index}
                          disabled={estValide}
                          onClick={() => setOptionSelectionnee(index)}
                          style={{ ...styles.optionBouton, ...styleDynamique }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{option}</span>
                            {estValide && estLaReponseCorrecte && <span style={{ fontWeight: 'bold' }}>✓</span>}
                            {estValide && estOptionChoisie && !estLaReponseCorrecte && <span style={{ fontWeight: 'bold' }}>✗</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {estValide && questionActuelle.explication && (
                    <div style={styles.explicationBoite}>
                      <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>💡 Explication :</span>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', lineHeight: '1.4' }}>{questionActuelle.explication}</p>
                    </div>
                  )}

                  {estValide && erreurQuiz && <p style={styles.messageErreur}>❌ Réponse incorrecte. Lisez l'explication ci-dessus.</p>}

                  <button 
                    onClick={gererBoutonActionQuiz}
                    disabled={optionSelectionnee === null}
                    style={{ ...styles.boutonValider, backgroundColor: estValide ? '#007bff' : '#28a745' }}
                  >
                    {!estValide ? "Valider la réponse" : (indexQuestionQuiz < questionsDuChapitre.length - 1 ? "Question suivante ➔" : "Valider le chapitre et continuer ➔")}
                  </button>
                </div>
              </div>
            )}

            {/* 🆕 Félicitations finales — tous les cours de la plateforme sont terminés */}
            {afficherFelicitationsFinales && (
              <div style={styles.quizOverlay}>
                <div style={styles.felicitationsBoite}>
                  <div style={{ fontSize: '3.2rem', lineHeight: 1 }}>🎓</div>
                  <h2 style={styles.felicitationsTitre}>Félicitations !</h2>
                  <p style={styles.felicitationsTexte}>
                    Vous avez validé l'ensemble des cours et des quiz de la plateforme ESFPP.
                  </p>
                  <p style={styles.felicitationsTexte}>
                    Rendez-vous à l'administration de l'école pour obtenir votre certificat de réussite.
                  </p>
                  <button
                    onClick={() => setAfficherFelicitationsFinales(false)}
                    style={{ ...styles.boutonValider, backgroundColor: '#28a745', width: '100%' }}
                  >
                    Continuer
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            disabled={coursActif && chapitreActifIndex === coursActif.chapters.length - 1}
            onClick={() => {
              if (coursActif && chapitreActifIndex < coursActif.chapters.length - 1) {
                setChapitreActifIndex(prev => prev + 1);
                setAfficherQuiz(false);
                setQuizMasqueTemporairement(false);
                setIndexQuestionQuiz(0);
                setEstValide(false);
                if (videoRef.current) videoRef.current.currentTime = 0;
              }
            }}
            style={{...styles.navArrow, right: '20px', opacity: (coursActif && chapitreActifIndex === coursActif.chapters.length - 1) ? 0.3 : 1}}
          >
            ❯
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

const styles = {
  bandeauApercuAdmin: {
    height: '38px', flexShrink: 0, backgroundColor: '#0F172A', color: '#FFFFFF',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px',
    fontSize: '0.8rem', fontWeight: '600', fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
    letterSpacing: '0.2px',
  },
  boutonRetourAdmin: {
    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', color: '#FFFFFF',
    borderRadius: '5px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer',
  },
  appContainer: { display: 'flex', height: '100vh', width: '100vw', fontFamily: '"Segoe UI", Roboto, Arial, sans-serif', backgroundColor: 'var(--bg-app)', overflow: 'hidden' },
  sidebar: { width: '360px', backgroundColor: 'var(--bg-surface)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' },
  tabContainer: { display: 'flex', borderBottom: '2px solid #28a745' },
  tabButton: { flex: 1, padding: '15px 10px', background: 'none', border: 'none', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-tertiary)', cursor: 'pointer' },

  searchContainer: { padding: '15px', position: 'relative', borderBottom: '1px solid var(--border-color-light)' },
  searchInput: { width: '100%', padding: '9px 35px 9px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.85rem', boxSizing: 'border-box', outline: 'none', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' },
  searchIcon: { position: 'absolute', right: '25px', top: '22px', color: '#007bff', fontSize: '0.85rem' },
  outlineContent: { flex: 1, overflowY: 'auto', padding: '10px 0' },
  knowledgeCheckItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', backgroundColor: '#eefcf1', borderLeft: '4px solid #28a745', marginBottom: '15px' },
  moduleAccordion: { display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--border-color-light)' },
  moduleHeader: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' },
  moduleTitle: { fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: '1.35' },
  progressTrack: { width: '100%', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#28a745', transition: 'width 0.3s ease' },
  
  sousGroupeHeader: {
    width: '95%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    backgroundColor: '#f0f4f8',
    border: '1px solid #d0e1fd',
    borderRadius: '6px',
    color: '#1a73e8',
    cursor: 'pointer',
    fontSize: '0.85rem',
    margin: '6px auto'
  },

  chapterList: { listStyle: 'none', padding: 0, margin: 0, backgroundColor: 'var(--bg-surface)' },
  chapterItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px 12px 20px', borderBottom: '1px solid var(--border-color-light)' },
  statusCircle: { width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', flexShrink: 0 },
  
  workspace: { flex: 1, display: 'flex', flexDirection: 'column' },
  topHeader: { height: '60px', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 25px', boxSizing: 'border-box' },
  headerTitle: { fontSize: '1rem', color: 'var(--text-tertiary)', margin: 0, fontWeight: '600' },
  headerTools: { display: 'flex', gap: '15px', alignItems: 'center' },
  toolIcon: { fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer' },
  toolIconButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-secondary)', cursor: 'pointer' },
  logoutButton: { background: 'none', border: '1px solid #dc3545', color: '#dc3545', borderRadius: '4px', padding: '4px 8px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', marginLeft: '5px' },
  
  contentWrapper: { flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
  navArrow: { position: 'absolute', width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-secondary)', zIndex: '5' },
  
  mainCard: { position: 'relative', width: '90%', maxWidth: '850px', aspectRatio: '16/9', borderRadius: '12px', backgroundColor: 'var(--bg-surface)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden', outline: 'none' },
  mainCardFullscreen: { width: '100vw', maxWidth: '100vw', height: '100vh', maxHeight: '100vh', borderRadius: '0px', aspectRatio: 'unset' },
  erreurVideoBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' },
  
  boutonPleinEcranHautDroite: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '6px',
    padding: '6px 10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    zIndex: 10,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(3px)',
    transition: 'background-color 0.2s ease, transform 0.15s ease',
  },

  quizOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(8, 26, 46, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 2147483647 },
  felicitationsBoite: {
    backgroundColor: '#ffffff', borderRadius: '14px', padding: '36px 32px', width: '100%', maxWidth: '420px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.3)', boxSizing: 'border-box',
  },
  felicitationsTitre: { fontSize: '1.3rem', fontWeight: '800', color: '#155724', margin: '4px 0 0' },
  felicitationsTexte: { fontSize: '0.88rem', color: '#333333', lineHeight: '1.5', margin: 0 },
  quizBoite: { backgroundColor: 'var(--bg-surface)', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 15px 35px rgba(0,0,0,0.3)', boxSizing: 'border-box', maxHeight: '90%', overflowY: 'auto' },
  quizBadge: { alignSelf: 'flex-start', fontSize: '0.65rem', fontWeight: '700', color: '#28a745', backgroundColor: '#eafcf0', padding: '4px 8px', borderRadius: '4px' },
  boutonRevoirVideo: { backgroundColor: '#f0f4f8', color: '#1a73e8', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' },
  
  quizQuestion: { fontSize: '0.95rem', color: 'var(--text-tertiary)', margin: 0, lineHeight: '1.4', fontWeight: '600' },
  listeOptions: { display: 'flex', flexDirection: 'column', gap: '8px' },
  optionBouton: { padding: '10px 12px', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '500', outline: 'none', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' },
  
  explicationBoite: {
    padding: '10px 14px',
    backgroundColor: '#eef2ff',
    borderLeft: '4px solid #4f46e5',
    borderRadius: '6px',
    color: '#1e1b4b',
    fontSize: '0.82rem',
    marginTop: '4px',
  },

  boutonValider: { padding: '12px', borderRadius: '6px', border: 'none', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px', fontSize: '0.85rem', transition: 'background-color 0.2s' },
  messageErreur: { color: '#dc3545', fontSize: '0.78rem', fontWeight: 'bold', margin: 0 }
};