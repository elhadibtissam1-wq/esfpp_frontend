import React, { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from './config';

// ---------- Icônes (traits fins, style entreprise) ----------
const Icon = ({ path, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);
const IconGrid = (p) => <Icon {...p} path={<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>} />;
const IconUsers = (p) => <Icon {...p} path={<><circle cx="9" cy="8" r="3.2" /><path d="M3.5 20c0-3.3 2.6-5.5 5.5-5.5s5.5 2.2 5.5 5.5" /><circle cx="17" cy="8.5" r="2.6" /><path d="M15.5 14.8c2.4.4 4 2.3 4 5.2" /></>} />;
const IconShield = (p) => <Icon {...p} path={<><path d="M12 3l7 3v5.5c0 4.5-3 7.9-7 9.5-4-1.6-7-5-7-9.5V6l7-3z" /><path d="M9 12l2 2 4-4" /></>} />;
const IconBook = (p) => <Icon {...p} path={<><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" /></>} />;
const IconCertificate = (p) => <Icon {...p} path={<><circle cx="12" cy="8" r="5" /><path d="M8.5 12.5L7 21l5-2.5 5 2.5-1.5-8.5" /></>} />;
const IconSettings = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="3" /><path d="M19.4 13.5a1.7 1.7 0 000-3l-1-.5a7.6 7.6 0 00-.9-2.1l.4-1a1.7 1.7 0 00-2.4-2.4l-1 .4a7.6 7.6 0 00-2.1-.9l-.5-1a1.7 1.7 0 00-3 0l-.5 1a7.6 7.6 0 00-2.1.9l-1-.4a1.7 1.7 0 00-2.4 2.4l.4 1a7.6 7.6 0 00-.9 2.1l-1 .5a1.7 1.7 0 000 3l1 .5c.2.75.5 1.45.9 2.1l-.4 1a1.7 1.7 0 002.4 2.4l1-.4c.65.4 1.35.7 2.1.9l.5 1a1.7 1.7 0 003 0l.5-1c.75-.2 1.45-.5 2.1-.9l1 .4a1.7 1.7 0 002.4-2.4l-.4-1c.4-.65.7-1.35.9-2.1l1-.5z" /></>} />;
const IconSearch = (p) => <Icon {...p} path={<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>} />;
const IconBell = (p) => <Icon {...p} path={<><path d="M6 9a6 6 0 1112 0c0 4.5 1.5 6 1.5 6H4.5S6 13.5 6 9z" /><path d="M10 20a2 2 0 004 0" /></>} />;
const IconChevronDown = (p) => <Icon {...p} path={<path d="M6 9l6 6 6-6" />} />;
const IconUpload = (p) => <Icon {...p} path={<><path d="M12 16V4M12 4L7 9M12 4l5 5" /><path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" /></>} />;
const IconDots = (p) => <Icon {...p} path={<><circle cx="12" cy="5.5" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="18.5" r="1.2" fill="currentColor" stroke="none" /></>} />;
const IconEye = (p) => <Icon {...p} path={<><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>} />;
const IconAlert = (p) => <Icon {...p} path={<><path d="M12 9v4" /><circle cx="12" cy="16.5" r="0.6" fill="currentColor" stroke="none" /><path d="M10.3 3.9L1.8 18.5a1.5 1.5 0 001.3 2.3h17.8a1.5 1.5 0 001.3-2.3L13.7 3.9a1.5 1.5 0 00-2.6 0z" /></>} />;
const IconCheck = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.3 2.3L16 10" /></>} />;
const IconPencil = (p) => <Icon {...p} path={<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></>} />;
const IconTrash = (p) => <Icon {...p} path={<><path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /></>} />;
const IconLogout = (p) => <Icon {...p} path={<><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>} />;

// ---------- Mini sparkline SVG ----------
function Sparkline({ data, positive }) {
  const w = 88, h = 28;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={positive ? '#10B981' : '#EF4444'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------- 🆕 V1 : Sélecteur de vidéo (upload + liste des vidéos existantes) ----------
// Remplace le champ texte libre "/videos/coursX.mp4" par une interface que
// n'importe quel admin peut utiliser sans connaître la structure des fichiers.
function SelecteurVideo({ valeur, onChange, videos, chargementVideos, uploadEnCours, erreurUpload, onUploader, onSupprimerVideo }) {
  const inputRef = useRef(null);
  const videoChoisie = videos.find(v => v.url === valeur);
  const [panneauNettoyageOuvert, setPanneauNettoyageOuvert] = useState(false);
  const [suppressionEnCours, setSuppressionEnCours] = useState(null); // nom du fichier en cours de suppression
  const [erreurSuppression, setErreurSuppression] = useState('');

  const gererChoixFichier = async (e) => {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    const url = await onUploader(fichier);
    if (url) onChange(url);
    if (inputRef.current) inputRef.current.value = '';
  };

  const videosInutilisees = videos.filter(v => !v.estUtilisee);

  const gererSuppression = async (nom) => {
    if (!window.confirm('Supprimer définitivement cette vidéo du serveur ? Cette action est irréversible.')) return;
    setErreurSuppression('');
    setSuppressionEnCours(nom);
    try {
      await onSupprimerVideo(nom);
    } catch (err) {
      setErreurSuppression(err.message || 'Suppression impossible.');
    } finally {
      setSuppressionEnCours(null);
    }
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept="video/*" onChange={gererChoixFichier} style={{ display: 'none' }} />

      {valeur ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 11px', border: '1px solid #E2E8F0', borderRadius: '7px', backgroundColor: '#F8FAFC' }}>
          <span style={{ fontSize: '0.8rem', color: '#334155', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            🎬 {videoChoisie?.nomAffichage || videoChoisie?.nom || valeur}
          </span>
          <button type="button" onClick={() => onChange('')} style={{ ...s.iconActionButton, color: '#EF4444' }}>
            <IconTrash size={14} />
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploadEnCours}
            style={{ ...s.secondaryButton, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}
          >
            <IconUpload size={15} /> {uploadEnCours ? 'Envoi en cours...' : 'Uploader une nouvelle vidéo'}
          </button>

          <div style={{ fontSize: '0.72rem', color: '#94A3B8', textAlign: 'center', margin: '8px 0' }}>— ou choisir une vidéo déjà présente —</div>

          <select
            value=""
            onChange={(e) => e.target.value && onChange(e.target.value)}
            style={s.input}
            disabled={chargementVideos || videos.length === 0}
          >
            <option value="" disabled>
              {chargementVideos ? 'Chargement...' : videos.length === 0 ? 'Aucune vidéo disponible pour le moment' : 'Sélectionner une vidéo existante'}
            </option>
            {videos.map(v => (
              <option key={v.url} value={v.url}>
                {v.estUtilisee ? '✅ ' : '⚪ '}{v.nomAffichage || v.nom} ({v.tailleMo} Mo){v.estUtilisee ? '' : ' — inutilisée'}
              </option>
            ))}
          </select>

          {/* 🆕 Panneau de nettoyage : ne montre que les vidéos orphelines
              (aucun chapitre/cours ne les référence), avec suppression
              définitive du disque en un clic. */}
          {videosInutilisees.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setPanneauNettoyageOuvert(o => !o)}
                style={{ background: 'none', border: 'none', color: '#B45309', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                🧹 {panneauNettoyageOuvert ? 'Masquer' : `Nettoyer les vidéos inutilisées (${videosInutilisees.length})`}
              </button>

              {panneauNettoyageOuvert && (
                <div style={{ marginTop: '8px', border: '1px solid #FDE68A', backgroundColor: '#FFFBEB', borderRadius: '7px', padding: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  <p style={{ fontSize: '0.7rem', color: '#92400E', margin: '0 0 8px' }}>
                    Ces vidéos ne sont utilisées par aucun cours ni chapitre — probablement des restes de chapitres supprimés. Vous pouvez les supprimer définitivement du serveur.
                  </p>
                  {videosInutilisees.map(v => (
                    <div key={v.nom} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', borderTop: '1px solid #FDE68A' }}>
                      <span style={{ fontSize: '0.74rem', color: '#78350F', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {v.nomAffichage || v.nom} ({v.tailleMo} Mo)
                      </span>
                      <button
                        type="button"
                        onClick={() => gererSuppression(v.nom)}
                        disabled={suppressionEnCours === v.nom}
                        style={{ ...s.iconActionButton, color: '#EF4444', opacity: suppressionEnCours === v.nom ? 0.5 : 1 }}
                        title="Supprimer définitivement"
                      >
                        <IconTrash size={13} />
                      </button>
                    </div>
                  ))}
                  {erreurSuppression && <div style={{ fontSize: '0.72rem', color: '#B91C1C', marginTop: '6px' }}>{erreurSuppression}</div>}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {erreurUpload && (
        <div style={{ fontSize: '0.76rem', color: '#EF4444', marginTop: '6px' }}>{erreurUpload}</div>
      )}
    </div>
  );
}

const statutStyle = {
  actif: { color: '#10B981', label: 'Actif' },
  attente: { color: '#F59E0B', label: 'En attente' },
  bloque: { color: '#EF4444', label: 'Bloqué' },
};

const navGroups = [
  { label: 'Général', items: [{ id: 'dashboard', label: 'Tableau de bord', Icon: IconGrid }] },
  { label: 'Gestion', items: [
    { id: 'etudiants', label: 'Étudiants', Icon: IconUsers },
    { id: 'liste-blanche', label: 'Liste blanche', Icon: IconShield },
    { id: 'cours', label: 'Cours', Icon: IconBook },
    { id: 'certificats', label: 'Certificats', Icon: IconCertificate },
  ]},
  { label: 'Système', items: [{ id: 'parametres', label: 'Paramètres', Icon: IconSettings }] },
];

export default function AdminDashboard({ onOuvrirApercu, onDeconnexion } = {}) {
  const [actif, setActif] = useState('dashboard');
  const [filtreStatut, setFiltreStatut] = useState('tous');

  // 🆕 B6 : état et logique de l'import de la liste blanche
  const [importEnCours, setImportEnCours] = useState(false);
  const [resultatImport, setResultatImport] = useState(null);
  const fileInputRef = useRef(null);

  const gererImport = async (e) => {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    setImportEnCours(true);
    setResultatImport(null);

    const formData = new FormData();
    formData.append('fichier', fichier);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/liste-blanche/import`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
        body: formData,
      });
      const data = await res.json();
      setResultatImport(data);
      if (data.success) chargerListeBlanche(); // 🆕 B7 : rafraîchit le tableau après un import réussi
    } catch (err) {
      setResultatImport({ success: false, message: "Échec de l'envoi du fichier." });
    } finally {
      setImportEnCours(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 🆕 B7 : chargement, recherche, édition, suppression de la liste blanche
  const [entreesListeBlanche, setEntreesListeBlanche] = useState([]);
  const [totalListeBlanche, setTotalListeBlanche] = useState(0);
  const [rechercheListeBlanche, setRechercheListeBlanche] = useState('');
  const [chargementListeBlanche, setChargementListeBlanche] = useState(false);
  const [entreeEnEdition, setEntreeEnEdition] = useState(null);

  const chargerListeBlanche = async () => {
    setChargementListeBlanche(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/liste-blanche?recherche=${encodeURIComponent(rechercheListeBlanche)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
      });
      const data = await res.json();
      setEntreesListeBlanche(data.donnees || []);
      setTotalListeBlanche(data.total || 0);
    } catch (err) {
      console.error('Erreur chargement liste blanche:', err);
    } finally {
      setChargementListeBlanche(false);
    }
  };

  useEffect(() => {
    if (actif === 'liste-blanche') chargerListeBlanche();
  }, [actif, rechercheListeBlanche]);

  const supprimerEntreeListeBlanche = async (id) => {
    if (!window.confirm('Supprimer définitivement cette entrée de la liste blanche ?')) return;
    await fetch(`${API_BASE_URL}/admin/liste-blanche/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
    });
    chargerListeBlanche();
  };

  const enregistrerEditionListeBlanche = async () => {
    const { id, nom, prenom, cin } = entreeEnEdition;
    await fetch(`${API_BASE_URL}/admin/liste-blanche/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
      body: JSON.stringify({ nom, prenom, cin }),
    });
    setEntreeEnEdition(null);
    chargerListeBlanche();
  };

  // 🆕 E4 : gestion des étudiants
  const [entreesEtudiants, setEntreesEtudiants] = useState([]);
  const [totalEtudiants, setTotalEtudiants] = useState(0);
  const [rechercheEtudiants, setRechercheEtudiants] = useState('');
  const [chargementEtudiants, setChargementEtudiants] = useState(false);
  const [nbEligiblesCertificat, setNbEligiblesCertificat] = useState(0); // 🎓

  const chargerEtudiants = async () => {
    setChargementEtudiants(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/etudiants?recherche=${encodeURIComponent(rechercheEtudiants)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
      });
      const data = await res.json();
      setEntreesEtudiants(data.donnees || []);
      setTotalEtudiants(data.total || 0);
      setNbEligiblesCertificat(data.nbEligiblesCertificat || 0); // 🎓
    } catch (err) {
      console.error('Erreur chargement étudiants:', err);
    } finally {
      setChargementEtudiants(false);
    }
  };

  useEffect(() => {
    if (actif === 'etudiants') chargerEtudiants();
  }, [actif, rechercheEtudiants]);

  // 🎓 Page Certificats : liste des étudiants ayant validé 100% de la
  // formation. On récupère tous les étudiants (limite large) puisqu'on a
  // besoin de la liste complète des éligibles, pas d'une page paginée.
  const [etudiantsEligiblesCertificat, setEtudiantsEligiblesCertificat] = useState([]);
  const [chargementCertificats, setChargementCertificats] = useState(false);

  const chargerEtudiantsEligiblesCertificat = async () => {
    setChargementCertificats(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/etudiants?limite=1000`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
      });
      const data = await res.json();
      setEtudiantsEligiblesCertificat((data.donnees || []).filter(e => e.estEligibleCertificat));
    } catch (err) {
      console.error('Erreur chargement certificats:', err);
    } finally {
      setChargementCertificats(false);
    }
  };

  useEffect(() => {
    if (actif === 'certificats') chargerEtudiantsEligiblesCertificat();
  }, [actif]);

  // 🔔 Cloche de notification : nouveaux étudiants certifiés depuis la
  // dernière fois que l'admin a regardé. Rafraîchie au chargement puis
  // toutes les 60s, indépendamment de l'onglet actif.
  const [nouveauxCertificats, setNouveauxCertificats] = useState([]);
  const [clocheOuverte, setClocheOuverte] = useState(false);

  const chargerNouveauxCertificats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/certificats/nouveaux`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
      });
      const data = await res.json();
      setNouveauxCertificats(data.etudiants || []);
    } catch (err) {
      console.error('Erreur chargement notifications certificats:', err);
    }
  };

  useEffect(() => {
    chargerNouveauxCertificats();
    const intervalle = setInterval(chargerNouveauxCertificats, 60000);
    return () => clearInterval(intervalle);
  }, []);

  // Ouvrir la cloche = accuser réception : le badge rouge disparaît et ne
  // reviendra que pour de VRAIS nouveaux étudiants certifiés ensuite.
  const ouvrirCloche = async () => {
    setClocheOuverte((v) => !v);
    if (!clocheOuverte && nouveauxCertificats.length > 0) {
      await fetch(`${API_BASE_URL}/admin/certificats/marquer-vus`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
      });
      setNouveauxCertificats([]);
      if (actif === 'certificats') chargerEtudiantsEligiblesCertificat();
    }
  };

  // 📊 Tableau de bord : statistiques réelles (remplace les données fake)
  const [statsDashboard, setStatsDashboard] = useState(null);
  const [chargementStats, setChargementStats] = useState(false);

  const chargerStatsDashboard = async () => {
    setChargementStats(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
      });
      setStatsDashboard(await res.json());
    } catch (err) {
      console.error('Erreur chargement stats dashboard:', err);
    } finally {
      setChargementStats(false);
    }
  };

  useEffect(() => {
    if (actif === 'dashboard') chargerStatsDashboard();
  }, [actif]);

  const formaterDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const etudiantsRecents = statsDashboard?.etudiantsRecents || [];
  const listeDashboard = filtreStatut === 'tous' ? etudiantsRecents : etudiantsRecents.filter(e => e.statut === filtreStatut);

  const basculerBlocageEtudiant = async (etudiant) => {
    const action = etudiant.estBloque ? 'debloquer' : 'bloquer';
    await fetch(`${API_BASE_URL}/admin/etudiants/${etudiant.id}/${action}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
    });
    chargerEtudiants();
  };

  const supprimerEtudiant = async (id) => {
    if (!window.confirm('Supprimer définitivement ce compte étudiant ? Toute sa progression sera perdue.')) return;
    await fetch(`${API_BASE_URL}/admin/etudiants/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
    });
    chargerEtudiants();
  };

  // 🆕 V1 : bibliothèque de vidéos — remplace le champ texte "URL de la vidéo"
  // par un vrai upload + une liste des vidéos déjà présentes sur le serveur.
  const [videosDisponibles, setVideosDisponibles] = useState([]);
  const [chargementVideos, setChargementVideos] = useState(false);
  const [uploadVideoEnCours, setUploadVideoEnCours] = useState(false);
  const [erreurUploadVideo, setErreurUploadVideo] = useState('');

  const chargerVideosDisponibles = async () => {
    setChargementVideos(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/videos`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
      });
      const data = await res.json();
      setVideosDisponibles(data.videos || []);
    } catch (err) {
      console.error('Erreur chargement vidéos:', err);
    } finally {
      setChargementVideos(false);
    }
  };

  // uploade un fichier vidéo et renvoie son URL, ou lève une erreur lisible
  const uploaderFichierVideo = async (fichier) => {
    setErreurUploadVideo('');
    setUploadVideoEnCours(true);
    try {
      const formData = new FormData();
      formData.append('video', fichier);
      const res = await fetch(`${API_BASE_URL}/admin/videos/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Échec de l'envoi de la vidéo.");
      // 🔧 CORRECTION : `nom` doit rester le nom réel du fichier sur le
      // disque (extrait de `data.url`), pas le nom original — sinon toute
      // opération technique ultérieure (ex: suppression) échouerait.
      // `nomAffichage` est ce qui est montré à l'admin.
      const nomFichierDisque = data.url.split('/').pop();
      setVideosDisponibles((liste) => [
        { nom: nomFichierDisque, nomAffichage: data.nomOriginal, url: data.url, tailleMo: data.tailleMo, dateAjout: new Date(), estUtilisee: false, utiliseePar: [] },
        ...liste,
      ]);
      return data.url;
    } catch (err) {
      setErreurUploadVideo(err.message);
      return null;
    } finally {
      setUploadVideoEnCours(false);
    }
  };

  // 🆕 supprime définitivement une vidéo inutilisée du serveur, et la
  // retire localement de la liste si ça réussit. Laisse remonter l'erreur
  // au composant SelecteurVideo pour affichage (ex: "encore utilisée").
  const supprimerVideoDuServeur = async (nomFichier) => {
    const res = await fetch(`${API_BASE_URL}/admin/videos/${encodeURIComponent(nomFichier)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Suppression impossible.');
    setVideosDisponibles((liste) => liste.filter((v) => v.nom !== nomFichier));
  };

  // 🆕 C1 : gestion complète des cours (navigation à 3 niveaux : cours → chapitres → questions)
  const [coursApercu, setCoursApercu] = useState([]);
  const [chargementCours, setChargementCours] = useState(false);
  const [coursSelectionneId, setCoursSelectionneId] = useState(null);
  const [chapitreSelectionneId, setChapitreSelectionneId] = useState(null);

  const [modalCours, setModalCours] = useState(null);       // null | { titre, videoUrl } | { id, titre, videoUrl }
  const [modalChapitre, setModalChapitre] = useState(null); // null | { numChapitre, nom, videoUrl, finSeconde } | + id
  const [modalQuestion, setModalQuestion] = useState(null); // null | { question, options, reponseCorrecte, explication } | + id
  const [erreurModal, setErreurModal] = useState('');
  const [enregistrementEnCours, setEnregistrementEnCours] = useState(false);

  const chargerCoursApercu = async () => {
    setChargementCours(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/apercu/cours`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
      });
      const data = await res.json();
      setCoursApercu(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement cours:', err);
    } finally {
      setChargementCours(false);
    }
  };

  useEffect(() => {
    if (actif === 'cours') chargerCoursApercu();
  }, [actif]);

  // charge la bibliothèque de vidéos dès qu'une des deux modales concernées s'ouvre
  useEffect(() => {
    if (modalCours || modalChapitre) chargerVideosDisponibles();
  }, [!!modalCours, !!modalChapitre]);

  const coursSelectionne = coursApercu.find(c => c.id === coursSelectionneId) || null;
  const chapitreSelectionne = coursSelectionne?.chapters?.find(ch => ch.id === chapitreSelectionneId) || null;

  const formaterDuree = (secondes) => {
    const s = Number(secondes) || 0;
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, '0')}`;
  };

  // ---- Cours ----
  const enregistrerCours = async () => {
    setErreurModal('');
    setEnregistrementEnCours(true);
    try {
      const estEdition = !!modalCours.id;
      const url = estEdition ? `${API_BASE_URL}/admin/cours/${modalCours.id}` : `${API_BASE_URL}/admin/cours`;
      const res = await fetch(url, {
        method: estEdition ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
        body: JSON.stringify({ titre: modalCours.titre, videoUrl: modalCours.videoUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Une erreur est survenue.');
      setModalCours(null);
      chargerCoursApercu();
    } catch (err) {
      setErreurModal(err.message);
    } finally {
      setEnregistrementEnCours(false);
    }
  };

  const supprimerCoursAction = async (id) => {
    if (!window.confirm('Supprimer ce cours ? Tous ses chapitres et quiz seront supprimés définitivement.')) return;
    await fetch(`${API_BASE_URL}/admin/cours/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
    });
    if (coursSelectionneId === id) setCoursSelectionneId(null);
    chargerCoursApercu();
  };

  // ---- Chapitres ----
  const enregistrerChapitre = async () => {
    setErreurModal('');
    setEnregistrementEnCours(true);
    try {
      const estEdition = !!modalChapitre.id;
      const url = estEdition
        ? `${API_BASE_URL}/admin/chapitres/${modalChapitre.id}`
        : `${API_BASE_URL}/admin/cours/${coursSelectionneId}/chapitres`;
      const res = await fetch(url, {
        method: estEdition ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
        body: JSON.stringify({
          numChapitre: modalChapitre.numChapitre,
          nom: modalChapitre.nom,
          videoUrl: modalChapitre.videoUrl,
          finSeconde: Number(modalChapitre.finSeconde),
          dossierNom: modalChapitre.dossierNom || '',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Une erreur est survenue.');
      setModalChapitre(null);
      chargerCoursApercu();
    } catch (err) {
      setErreurModal(err.message);
    } finally {
      setEnregistrementEnCours(false);
    }
  };

  const supprimerChapitreAction = async (id) => {
    if (!window.confirm('Supprimer ce chapitre ? Ses questions de quiz seront supprimées définitivement.')) return;
    await fetch(`${API_BASE_URL}/admin/chapitres/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
    });
    if (chapitreSelectionneId === id) setChapitreSelectionneId(null);
    chargerCoursApercu();
  };

  // ---- Questions ----
  const enregistrerQuestion = async () => {
    setErreurModal('');
    setEnregistrementEnCours(true);
    try {
      const estEdition = !!modalQuestion.id;
      const url = estEdition
        ? `${API_BASE_URL}/admin/questions/${modalQuestion.id}`
        : `${API_BASE_URL}/admin/chapitres/${chapitreSelectionneId}/questions`;
      const res = await fetch(url, {
        method: estEdition ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
        body: JSON.stringify({
          question: modalQuestion.question,
          options: modalQuestion.options,
          reponseCorrecte: Number(modalQuestion.reponseCorrecte),
          explication: modalQuestion.explication,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Une erreur est survenue.');
      setModalQuestion(null);
      chargerCoursApercu();
    } catch (err) {
      setErreurModal(err.message);
    } finally {
      setEnregistrementEnCours(false);
    }
  };

  const supprimerQuestionAction = async (id) => {
    if (!window.confirm('Supprimer cette question ?')) return;
    await fetch(`${API_BASE_URL}/admin/questions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
    });
    chargerCoursApercu();
  };

  // 🆕 P1 : changement de mot de passe admin (Paramètres)
  const [ancienMotDePasse, setAncienMotDePasse] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
  const [messageMotDePasse, setMessageMotDePasse] = useState(null);
  const [chargementMotDePasse, setChargementMotDePasse] = useState(false);

  const changerMotDePasse = async (e) => {
    e.preventDefault();
    setMessageMotDePasse(null);

    if (nouveauMotDePasse !== confirmationMotDePasse) {
      setMessageMotDePasse({ success: false, message: 'La confirmation ne correspond pas au nouveau mot de passe.' });
      return;
    }
    if (nouveauMotDePasse.length < 8) {
      setMessageMotDePasse({ success: false, message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' });
      return;
    }

    setChargementMotDePasse(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/changer-mot-de-passe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
        body: JSON.stringify({ ancienMotDePasse, nouveauMotDePasse }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Une erreur est survenue.');
      setMessageMotDePasse({ success: true, message: data.message || 'Mot de passe mis à jour.' });
      setAncienMotDePasse('');
      setNouveauMotDePasse('');
      setConfirmationMotDePasse('');
    } catch (err) {
      setMessageMotDePasse({ success: false, message: err.message });
    } finally {
      setChargementMotDePasse(false);
    }
  };

  // 🆕 P2 : modification du profil admin (email + nom affiché)
  const [nouvelEmailAdmin, setNouvelEmailAdmin] = useState('');
  const [nouveauNomAdmin, setNouveauNomAdmin] = useState('');
  const [motDePasseProfil, setMotDePasseProfil] = useState('');
  const [messageProfil, setMessageProfil] = useState(null);
  const [chargementProfil, setChargementProfil] = useState(false);

  // Décode le JWT déjà stocké pour connaître l'admin connecté (email, nom),
  // sans appel réseau supplémentaire — réutilisé par le pied de menu et par
  // le pré-remplissage du formulaire de profil.
  const [adminConnecte, setAdminConnecte] = useState({ nom: '', email: '' });

  useEffect(() => {
    const token = localStorage.getItem('token_admin');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setAdminConnecte({ nom: payload.nom || '', email: payload.email || '' });
    } catch {}
  }, []);

  const initialesAdmin = adminConnecte.nom
    ? adminConnecte.nom.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const [menuProfilOuvert, setMenuProfilOuvert] = useState(false);

  const deconnecterAdmin = () => {
    localStorage.removeItem('token_admin');
    if (onDeconnexion) onDeconnexion();
    else window.location.reload(); // repli : force le retour à l'écran de connexion
  };

  // Pré-remplit les champs avec les infos actuelles de l'admin connecté,
  // lues directement depuis le token JWT déjà stocké (pas besoin d'une
  // clé localStorage séparée qui pourrait ne pas exister selon l'écran
  // de connexion utilisé).
  useEffect(() => {
    setNouvelEmailAdmin(adminConnecte.email);
    setNouveauNomAdmin(adminConnecte.nom);
  }, [adminConnecte]);

  const modifierProfilAdmin = async (e) => {
    e.preventDefault();
    setMessageProfil(null);
    setChargementProfil(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/profil`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
        body: JSON.stringify({ motDePasseActuel: motDePasseProfil, email: nouvelEmailAdmin, nom: nouveauNomAdmin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Une erreur est survenue.');
      setMessageProfil({ success: true, message: 'Profil mis à jour. Reconnecte-toi avec ton nouvel email.' });
      setMotDePasseProfil('');
    } catch (err) {
      setMessageProfil({ success: false, message: err.message });
    } finally {
      setChargementProfil(false);
    }
  };

  // (remplacée par listeDashboard, calculée plus haut à partir des vraies stats)

  return (
    <div style={s.app}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      {/* SIDEBAR */}
      <aside style={s.sidebar}>
        <div style={s.brand}>
          <div style={s.brandMark}>E</div>
          <div>
            <div style={s.brandName}>ESFPP</div>
            <div style={s.brandSub}>Console administrateur</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '4px 12px' }}>
          {navGroups.map(group => (
            <div key={group.label} style={{ marginBottom: '20px' }}>
              <div style={s.navGroupLabel}>{group.label}</div>
              {group.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActif(item.id)}
                  style={{
                    ...s.navItem,
                    background: actif === item.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                    color: actif === item.id ? '#FFFFFF' : '#94A3B8',
                  }}
                >
                  <span style={{ width: '3px', height: '16px', borderRadius: '2px', background: actif === item.id ? '#10B981' : 'transparent', marginRight: '10px' }} />
                  <item.Icon size={17} />
                  <span style={{ marginLeft: '10px' }}>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ position: 'relative' }}>
          {/* 🆕 Bouton de déconnexion visible en permanence — plus besoin
              d'ouvrir le menu profil pour se déconnecter. Reste séparé de
              "Paramètres du compte" qui, lui, reste dans le menu profil. */}
          <button
            onClick={deconnecterAdmin}
            style={{
              width: 'calc(100% - 24px)', margin: '0 12px 10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px', padding: '9px 0', borderRadius: '8px',
              border: '1px solid rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.08)',
              color: '#F87171', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            <IconLogout size={15} /> Se déconnecter
          </button>

          <div
            style={{ ...s.sidebarFooter, cursor: 'pointer' }}
            onClick={() => setMenuProfilOuvert((v) => !v)}
          >
            <div style={s.avatarCircle}>{initialesAdmin}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={s.footerName}>{adminConnecte.nom || 'Administrateur'}</div>
              <div style={s.footerRole}>{adminConnecte.email || 'Administrateur'}</div>
            </div>
            <IconChevronDown size={14} />
          </div>

          {menuProfilOuvert && (
            <div style={{
              position: 'absolute', bottom: '58px', left: '12px', right: '12px',
              background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.16)', overflow: 'hidden', zIndex: 60,
            }}>
              <button
                onClick={() => { setMenuProfilOuvert(false); setActif('parametres'); }}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 14px', border: 'none',
                  background: 'transparent', color: '#334155', fontSize: '0.83rem', cursor: 'pointer',
                }}
              >
                Paramètres du compte
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* CONTENU */}
      <div style={s.main}>
        <header style={s.topbar}>
          <div>
            <div style={s.breadcrumb}>Administration / {navGroups.flatMap(g => g.items).find(i => i.id === actif)?.label || 'Tableau de bord'}</div>
            <h1 style={s.pageTitle}>{navGroups.flatMap(g => g.items).find(i => i.id === actif)?.label || "Vue d'ensemble"}</h1>
          </div>
          <div style={s.topbarRight}>
            <div style={s.topSearch}>
              <IconSearch size={15} />
              <input placeholder="Rechercher..." style={s.topSearchInput} />
            </div>
            <button style={s.apercuButton} onClick={() => onOuvrirApercu && onOuvrirApercu()}>
              <IconEye size={15} /> Aperçu étudiant
            </button>
            <div style={{ position: 'relative' }}>
              <button style={s.iconButton} onClick={ouvrirCloche}>
                <IconBell size={17} />
                {nouveauxCertificats.length > 0 && (
                  <span style={{
                    position: 'absolute', top: '2px', right: '2px',
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#EF4444', border: '1.5px solid #fff',
                  }} />
                )}
              </button>

              {clocheOuverte && (
                <div style={{
                  position: 'absolute', top: '38px', right: 0, width: '300px',
                  background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 50, overflow: 'hidden',
                }}>
                  <div style={{ padding: '11px 14px', borderBottom: '1px solid #F1F5F9', fontWeight: 600, fontSize: '0.85rem', color: '#0F172A' }}>
                    🎓 Certificats
                  </div>
                  {nouveauxCertificats.length === 0 ? (
                    <div style={{ padding: '18px 14px', fontSize: '0.8rem', color: '#94A3B8', textAlign: 'center' }}>
                      Aucun nouveau certificat pour le moment.
                    </div>
                  ) : (
                    <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
                      {nouveauxCertificats.map((e) => (
                        <div key={e.id} style={{ padding: '10px 14px', borderBottom: '1px solid #F8FAFC', fontSize: '0.82rem' }}>
                          <div style={{ fontWeight: 600, color: '#0F172A' }}>{e.prenom} {e.nom}</div>
                          <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>a terminé 100% de la formation</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => { setClocheOuverte(false); setActif('certificats'); }}
                    style={{
                      width: '100%', padding: '10px', border: 'none', borderTop: '1px solid #F1F5F9',
                      background: '#F8FAFC', color: '#334155', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    Voir tous les certificats
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div style={s.scrollArea}>
          {/* 🆕 E4 : page dédiée Gestion des étudiants */}
          {actif === 'etudiants' ? (
            <div style={s.panel}>
              <div style={s.panelHeader}>
                <span style={s.panelTitle}>{totalEtudiants} étudiant(s)</span>
                <div style={s.topSearch}>
                  <IconSearch size={15} />
                  <input
                    placeholder="Rechercher un nom, CIN, email..."
                    value={rechercheEtudiants}
                    onChange={(e) => setRechercheEtudiants(e.target.value)}
                    style={s.topSearchInput}
                  />
                </div>
              </div>

              {/* 🎓 Bannière visible dès qu'au moins un étudiant a terminé 100% de la formation */}
              {nbEligiblesCertificat > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E',
                  borderRadius: '8px', padding: '11px 15px', margin: '0 0 14px 0', fontSize: '0.85rem',
                }}>
                  <span style={{ fontSize: '1.1rem' }}>🎓</span>
                  <span>
                    <strong>{nbEligiblesCertificat}</strong> étudiant{nbEligiblesCertificat > 1 ? 's ont' : ' a'} terminé 100% de la formation et {nbEligiblesCertificat > 1 ? 'sont éligibles' : 'est éligible'} au certificat.
                  </span>
                </div>
              )}

              {chargementEtudiants ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>Chargement...</div>
              ) : entreesEtudiants.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>Aucun étudiant trouvé.</div>
              ) : (
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Nom</th>
                      <th style={s.th}>CIN</th>
                      <th style={s.th}>Statut</th>
                      <th style={s.th}>Chapitres validés</th>
                      <th style={s.th}>Progression globale</th>
                      <th style={s.th}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {entreesEtudiants.map(e => (
                      <tr key={e.id} style={s.tr}>
                        <td style={s.td}>
                          {e.prenom} {e.nom}
                          {e.estEligibleCertificat && (
                            <span style={{
                              marginLeft: '8px', fontSize: '0.68rem', fontWeight: 700,
                              background: '#FEF3C7', color: '#92400E', borderRadius: '5px',
                              padding: '2px 7px', verticalAlign: 'middle',
                            }}>
                              🎓 Éligible certificat
                            </span>
                          )}
                        </td>
                        <td style={{ ...s.td, fontFamily: 'monospace', color: '#64748B', fontSize: '0.8rem' }}>{e.cin}</td>
                        <td style={s.td}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: e.estBloque ? '#EF4444' : (e.estDejaActive ? '#10B981' : '#F59E0B'), display: 'inline-block' }} />
                            {e.estBloque ? 'Bloqué' : e.estDejaActive ? 'Compte activé' : "En attente d'activation"}
                          </span>
                        </td>
                        <td style={{ ...s.td, color: '#64748B' }}>{e.chapitresAtteints} / {e.totalChapitresGlobal}</td>
                        <td style={s.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={s.progressTrack}><div style={{ ...s.progressBar, width: `${e.progressionGlobale}%` }} /></div>
                            <span style={{ fontSize: '0.78rem', color: '#64748B', width: '32px' }}>{e.progressionGlobale}%</span>
                          </div>
                        </td>
                        <td style={{ ...s.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button
                            style={{ ...s.textActionButton, color: e.estBloque ? '#10B981' : '#F59E0B' }}
                            onClick={() => basculerBlocageEtudiant(e)}
                          >
                            {e.estBloque ? 'Débloquer' : 'Bloquer'}
                          </button>
                          <button style={{ ...s.iconActionButton, color: '#EF4444' }} onClick={() => supprimerEtudiant(e.id)}><IconTrash size={15} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : actif === 'liste-blanche' ? (
            <>
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={gererImport} style={{ display: 'none' }} />

              <div style={s.panel}>
                <div style={s.panelHeader}>
                  <span style={s.panelTitle}>Liste blanche des étudiants</span>
                  <button style={s.primaryButton} onClick={() => fileInputRef.current?.click()} disabled={importEnCours}>
                    <IconUpload size={15} /> {importEnCours ? 'Import en cours...' : 'Importer un fichier Excel'}
                  </button>
                </div>

                {resultatImport && (
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ ...s.resultBox, ...(resultatImport.success ? s.resultSuccess : s.resultError) }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        {resultatImport.success ? <IconCheck size={18} /> : <IconAlert size={18} />}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{resultatImport.message}</div>
                          {resultatImport.erreurs && (
                            <ul style={s.errorList}>
                              {resultatImport.erreurs.map((e, i) => (
                                <li key={i}><strong>Ligne {e.ligne} :</strong> {e.erreurs.join(', ')}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!resultatImport && (
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{totalListeBlanche} entrée(s)</span>
                    <div style={s.topSearch}>
                      <IconSearch size={15} />
                      <input
                        placeholder="Rechercher un nom, CIN..."
                        value={rechercheListeBlanche}
                        onChange={(e) => setRechercheListeBlanche(e.target.value)}
                        style={s.topSearchInput}
                      />
                    </div>
                  </div>
                )}

                {chargementListeBlanche ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>Chargement...</div>
                ) : entreesListeBlanche.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                    Aucune entrée. Importe un fichier Excel pour commencer.
                  </div>
                ) : (
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>Nom</th>
                        <th style={s.th}>Prénom</th>
                        <th style={s.th}>CIN</th>
                        <th style={s.th}>Téléphone</th>
                        <th style={s.th}>Statut</th>
                        <th style={s.th}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {entreesListeBlanche.map(e => (
                        <tr key={e.id} style={s.tr}>
                          <td style={s.td}>{e.nom}</td>
                          <td style={s.td}>{e.prenom}</td>
                          <td style={{ ...s.td, fontFamily: 'monospace', color: '#64748B', fontSize: '0.8rem' }}>{e.cin}</td>
                          <td style={{ ...s.td, color: '#64748B' }}>{e.tel}</td>
                          <td style={s.td}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: e.estDejaActive ? '#10B981' : '#F59E0B', display: 'inline-block' }} />
                              {e.estDejaActive ? 'Compte activé' : "En attente d'activation"}
                            </span>
                          </td>
                          <td style={{ ...s.td, textAlign: 'right' }}>
                            <button style={s.iconActionButton} onClick={() => setEntreeEnEdition(e)}><IconPencil size={15} /></button>
                            <button style={{ ...s.iconActionButton, color: '#EF4444' }} onClick={() => supprimerEntreeListeBlanche(e.id)}><IconTrash size={15} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : actif === 'cours' ? (
            chapitreSelectionne ? (
              // ---------- NIVEAU 3 : QUESTIONS DU CHAPITRE ----------
              <div>
                <button onClick={() => setChapitreSelectionneId(null)} style={{ ...s.secondaryButton, width: 'auto', marginBottom: '14px' }}>
                  ← Retour aux chapitres de « {coursSelectionne?.titre} »
                </button>
                <div style={s.panel}>
                  <div style={s.panelHeader}>
                    <span style={s.panelTitle}>{chapitreSelectionne.nom} — {(chapitreSelectionne.questions || []).length} question(s)</span>
                    <button style={s.primaryButton} onClick={() => setModalQuestion({ question: '', options: ['', ''], reponseCorrecte: 0, explication: '' })}>
                      + Nouvelle question
                    </button>
                  </div>
                  {(chapitreSelectionne.questions || []).length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>Aucune question pour ce chapitre.</div>
                  ) : (
                    <table style={s.table}>
                      <thead>
                        <tr>
                          <th style={s.th}>Question</th>
                          <th style={s.th}>Réponse correcte</th>
                          <th style={s.th}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {chapitreSelectionne.questions.map(q => (
                          <tr key={q.id} style={s.tr}>
                            <td style={{ ...s.td, maxWidth: '420px' }}>{q.question}</td>
                            <td style={{ ...s.td, color: '#10B981', fontWeight: 500 }}>{q.options?.[q.reponseCorrecte]}</td>
                            <td style={{ ...s.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <button style={s.iconActionButton} onClick={() => setModalQuestion({ ...q })}><IconPencil size={15} /></button>
                              <button style={{ ...s.iconActionButton, color: '#EF4444' }} onClick={() => supprimerQuestionAction(q.id)}><IconTrash size={15} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            ) : coursSelectionne ? (
              // ---------- NIVEAU 2 : CHAPITRES DU COURS ----------
              <div>
                <button onClick={() => setCoursSelectionneId(null)} style={{ ...s.secondaryButton, width: 'auto', marginBottom: '14px' }}>
                  ← Retour aux cours
                </button>
                <div style={s.panel}>
                  <div style={s.panelHeader}>
                    <span style={s.panelTitle}>{coursSelectionne.titre} — {(coursSelectionne.chapters || []).length} chapitre(s)</span>
                    <button style={s.primaryButton} onClick={() => setModalChapitre({ numChapitre: '', nom: '', videoUrl: '', finSeconde: '', dossierNom: '' })}>
                      + Nouveau chapitre
                    </button>
                  </div>
                  {(coursSelectionne.chapters || []).length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>Aucun chapitre pour ce cours.</div>
                  ) : (
                    <table style={s.table}>
                      <thead>
                        <tr>
                          <th style={s.th}>N°</th>
                          <th style={s.th}>Chapitre</th>
                          <th style={s.th}>Déclenchement quiz</th>
                          <th style={s.th}>Questions</th>
                          <th style={s.th}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {coursSelectionne.chapters.map(ch => (
                          <tr key={ch.id} style={s.tr}>
                            <td style={{ ...s.td, fontFamily: 'monospace', color: '#64748B', fontSize: '0.8rem' }}>{ch.numChapitre}</td>
                            <td style={s.td}>{ch.nom}</td>
                            <td style={{ ...s.td, color: '#64748B' }}>{formaterDuree(ch.finSeconde)}</td>
                            <td style={{ ...s.td, color: '#64748B' }}>{(ch.questions || []).length}</td>
                            <td style={{ ...s.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <button style={s.textActionButton} onClick={() => setChapitreSelectionneId(ch.id)}>Gérer le quiz</button>
                              <button style={s.iconActionButton} onClick={() => setModalChapitre({ ...ch })}><IconPencil size={15} /></button>
                              <button style={{ ...s.iconActionButton, color: '#EF4444' }} onClick={() => supprimerChapitreAction(ch.id)}><IconTrash size={15} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            ) : (
              // ---------- NIVEAU 1 : LISTE DES COURS ----------
              <div style={s.panel}>
                <div style={s.panelHeader}>
                  <span style={s.panelTitle}>{coursApercu.length} cours</span>
                  <button style={s.primaryButton} onClick={() => setModalCours({ titre: '', videoUrl: '' })}>+ Nouveau cours</button>
                </div>

                {chargementCours ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>Chargement...</div>
                ) : coursApercu.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>Aucun cours disponible.</div>
                ) : (
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>Cours</th>
                        <th style={s.th}>Chapitres</th>
                        <th style={s.th}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {coursApercu.map(c => (
                        <tr key={c.id} style={s.tr}>
                          <td style={s.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={s.rowAvatar}><IconBook size={14} /></div>
                              <span style={{ fontWeight: 500, color: '#0F172A' }}>{c.titre}</span>
                            </div>
                          </td>
                          <td style={{ ...s.td, color: '#64748B' }}>{c.chapters?.length ?? 0} chapitre(s)</td>
                          <td style={{ ...s.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button style={s.textActionButton} onClick={() => setCoursSelectionneId(c.id)}>Gérer</button>
                            <button style={s.iconActionButton} onClick={() => setModalCours({ ...c })}><IconPencil size={15} /></button>
                            <button style={{ ...s.iconActionButton, color: '#EF4444' }} onClick={() => supprimerCoursAction(c.id)}><IconTrash size={15} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )
          ) : actif === 'certificats' ? (
            <div style={s.panel}>
              <div style={s.panelHeader}>
                <span style={s.panelTitle}>{etudiantsEligiblesCertificat.length} étudiant(s) éligible(s) au certificat</span>
              </div>

              {chargementCertificats ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>Chargement...</div>
              ) : etudiantsEligiblesCertificat.length === 0 ? (
                <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: '#94A3B8' }}>
                    <IconCertificate size={32} />
                  </div>
                  <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.92rem', marginBottom: '6px' }}>Aucun étudiant éligible pour le moment</div>
                  <div style={{ color: '#64748B', fontSize: '0.82rem', maxWidth: '360px', margin: '0 auto' }}>
                    Un étudiant apparaît ici automatiquement dès qu'il a validé 100% des quiz de tous les cours de la formation.
                  </div>
                </div>
              ) : (
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Nom</th>
                      <th style={s.th}>CIN</th>
                      <th style={s.th}>Email</th>
                      <th style={s.th}>Progression</th>
                    </tr>
                  </thead>
                  <tbody>
                    {etudiantsEligiblesCertificat.map(e => (
                      <tr key={e.id} style={s.tr}>
                        <td style={s.td}>
                          🎓 {e.prenom} {e.nom}
                        </td>
                        <td style={{ ...s.td, fontFamily: 'monospace', color: '#64748B', fontSize: '0.8rem' }}>{e.cin}</td>
                        <td style={{ ...s.td, color: '#64748B' }}>{e.email}</td>
                        <td style={s.td}>
                          <span style={{
                            fontSize: '0.72rem', fontWeight: 700, background: '#D1FAE5', color: '#065F46',
                            borderRadius: '5px', padding: '3px 8px',
                          }}>
                            100% terminé
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : actif === 'parametres' ? (
            <div style={{ maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={s.panel}>
                <div style={s.panelHeader}>
                  <span style={s.panelTitle}>Informations du compte</span>
                </div>
                <form onSubmit={modifierProfilAdmin} style={{ padding: '18px 20px' }}>
                  <label style={s.label}>Nom affiché</label>
                  <input value={nouveauNomAdmin} onChange={(e) => setNouveauNomAdmin(e.target.value)} required style={s.input} placeholder="Direction ESFPP" />

                  <label style={s.label}>Email de connexion</label>
                  <input type="email" value={nouvelEmailAdmin} onChange={(e) => setNouvelEmailAdmin(e.target.value)} required style={s.input} placeholder="directeur@esfpp.ma" />

                  <label style={s.label}>Mot de passe actuel (pour confirmer)</label>
                  <input type="password" value={motDePasseProfil} onChange={(e) => setMotDePasseProfil(e.target.value)} required style={s.input} />

                  {messageProfil && (
                    <div style={{ ...s.resultBox, ...(messageProfil.success ? s.resultSuccess : s.resultError), marginTop: '14px', padding: '10px 12px', fontSize: '0.8rem' }}>
                      {messageProfil.message}
                    </div>
                  )}

                  <button type="submit" disabled={chargementProfil} style={{ ...s.primaryButton, marginTop: '18px', width: '100%', justifyContent: 'center', opacity: chargementProfil ? 0.7 : 1 }}>
                    {chargementProfil ? 'Mise à jour...' : 'Enregistrer'}
                  </button>
                </form>
              </div>

              <div style={s.panel}>
                <div style={s.panelHeader}>
                  <span style={s.panelTitle}>Changer le mot de passe</span>
                </div>
                <form onSubmit={changerMotDePasse} style={{ padding: '18px 20px' }}>
                  <label style={s.label}>Mot de passe actuel</label>
                  <input type="password" value={ancienMotDePasse} onChange={(e) => setAncienMotDePasse(e.target.value)} required style={s.input} />

                  <label style={s.label}>Nouveau mot de passe</label>
                  <input type="password" value={nouveauMotDePasse} onChange={(e) => setNouveauMotDePasse(e.target.value)} required style={s.input} />

                  <label style={s.label}>Confirmer le nouveau mot de passe</label>
                  <input type="password" value={confirmationMotDePasse} onChange={(e) => setConfirmationMotDePasse(e.target.value)} required style={s.input} />

                  {messageMotDePasse && (
                    <div style={{ ...s.resultBox, ...(messageMotDePasse.success ? s.resultSuccess : s.resultError), marginTop: '14px', padding: '10px 12px', fontSize: '0.8rem' }}>
                      {messageMotDePasse.message}
                    </div>
                  )}

                  <button type="submit" disabled={chargementMotDePasse} style={{ ...s.primaryButton, marginTop: '18px', width: '100%', justifyContent: 'center', opacity: chargementMotDePasse ? 0.7 : 1 }}>
                    {chargementMotDePasse ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                  </button>
                </form>
              </div>
            </div>
          ) : (
          <>
          {/* KPI CARDS — données réelles, sans historique donc sans tendance fictive */}
          <div style={s.kpiGrid}>
            {[
              { label: 'Étudiants actifs', value: statsDashboard?.etudiantsActifs },
              { label: 'Activations en attente', value: statsDashboard?.activationsEnAttente },
              { label: 'Complétion moyenne', value: statsDashboard ? `${statsDashboard.completionMoyenne}%` : undefined },
              { label: 'Étudiants certifiés', value: statsDashboard?.etudiantsCertifies },
            ].map(k => (
              <div key={k.label} style={s.kpiCard}>
                <div style={s.kpiLabel}>{k.label}</div>
                <div style={s.kpiRow}>
                  <div style={s.kpiValue}>{chargementStats || k.value === undefined ? '—' : k.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* PANEL TABLEAU */}
          <div style={s.panel}>
            <div style={s.panelHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <span style={s.panelTitle}>Inscriptions récentes</span>
                <div style={s.tabRow}>
                  {[['tous', 'Tous'], ['actif', 'Actifs'], ['attente', 'En attente'], ['bloque', 'Bloqués']].map(([id, label]) => (
                    <button key={id} onClick={() => setFiltreStatut(id)} style={{ ...s.tabItem, ...(filtreStatut === id ? s.tabItemActive : {}) }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <button style={s.primaryButton} onClick={() => setActif('liste-blanche')}><IconUpload size={15} /> Importer un fichier</button>
            </div>

            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Étudiant</th>
                  <th style={s.th}>CIN</th>
                  <th style={s.th}>Statut</th>
                  <th style={s.th}>Progression</th>
                  <th style={s.th}>Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {chargementStats ? (
                  <tr><td colSpan={5} style={{ ...s.td, textAlign: 'center', color: '#94A3B8', padding: '30px' }}>Chargement...</td></tr>
                ) : listeDashboard.length === 0 ? (
                  <tr><td colSpan={5} style={{ ...s.td, textAlign: 'center', color: '#94A3B8', padding: '30px' }}>Aucun étudiant.</td></tr>
                ) : listeDashboard.map(e => (
                  <tr key={e.id} style={s.tr}>
                    <td style={s.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={s.rowAvatar}>{e.nom.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                        <span style={{ fontWeight: 500, color: '#0F172A' }}>{e.nom}</span>
                      </div>
                    </td>
                    <td style={{ ...s.td, fontFamily: "'SFMono-Regular', Consolas, monospace", color: '#64748B', fontSize: '0.8rem' }}>{e.cin}</td>
                    <td style={s.td}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#334155' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: statutStyle[e.statut].color, display: 'inline-block' }} />
                        {statutStyle[e.statut].label}
                      </span>
                    </td>
                    <td style={s.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={s.progressTrack}><div style={{ ...s.progressBar, width: `${e.progression}%` }} /></div>
                        <span style={{ fontSize: '0.78rem', color: '#64748B', width: '30px' }}>{e.progression}%</span>
                      </div>
                    </td>
                    <td style={{ ...s.td, color: '#64748B', fontSize: '0.82rem' }}>{formaterDate(e.inscrit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={s.tableFooter}>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Affichage des {listeDashboard.length} inscriptions les plus récentes sur {statsDashboard?.totalEtudiants ?? 0} étudiant(s) au total
              </span>
            </div>
          </div>
          </>
          )}
        </div>
      </div>

      {/* 🆕 B7 : modale d'édition d'une entrée de la liste blanche */}
      {entreeEnEdition && (
        <div style={s.modalOverlay}>
          <div style={s.modalCard}>
            <h3 style={s.modalTitle}>Modifier l'entrée</h3>
            {['nom', 'prenom', 'cin'].map(champ => (
              <div key={champ}>
                <label style={s.label}>{champ === 'cin' ? 'CIN' : champ.charAt(0).toUpperCase() + champ.slice(1)}</label>
                <input
                  value={entreeEnEdition[champ] || ''}
                  onChange={(e) => setEntreeEnEdition({ ...entreeEnEdition, [champ]: e.target.value })}
                  style={s.input}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
              <button onClick={() => setEntreeEnEdition(null)} style={s.secondaryButton}>Annuler</button>
              <button onClick={enregistrerEditionListeBlanche} style={s.primaryButton}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 C1 : modale création/édition d'un cours */}
      {modalCours && (
        <div style={s.modalOverlay}>
          <div style={s.modalCard}>
            <h3 style={s.modalTitle}>{modalCours.id ? 'Modifier le cours' : 'Nouveau cours'}</h3>

            <label style={s.label}>Titre du cours</label>
            <input value={modalCours.titre} onChange={(e) => setModalCours({ ...modalCours, titre: e.target.value })} style={s.input} />

            <label style={s.label}>Vidéo principale</label>
            <SelecteurVideo
              valeur={modalCours.videoUrl}
              onChange={(url) => setModalCours({ ...modalCours, videoUrl: url })}
              videos={videosDisponibles}
              chargementVideos={chargementVideos}
              uploadEnCours={uploadVideoEnCours}
              erreurUpload={erreurUploadVideo}
              onUploader={uploaderFichierVideo}
              onSupprimerVideo={supprimerVideoDuServeur}
            />

            {erreurModal && (
              <div style={{ ...s.resultBox, ...s.resultError, marginTop: '12px', padding: '9px 11px', fontSize: '0.78rem' }}>{erreurModal}</div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
              <button onClick={() => { setModalCours(null); setErreurModal(''); }} style={s.secondaryButton}>Annuler</button>
              <button onClick={enregistrerCours} disabled={enregistrementEnCours} style={{ ...s.primaryButton, flex: 1, justifyContent: 'center', opacity: enregistrementEnCours ? 0.7 : 1 }}>
                {enregistrementEnCours ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 C2 : modale création/édition d'un chapitre */}
      {modalChapitre && (
        <div style={s.modalOverlay}>
          <div style={s.modalCard}>
            <h3 style={s.modalTitle}>{modalChapitre.id ? 'Modifier le chapitre' : 'Nouveau chapitre'}</h3>

            <label style={s.label}>Numéro (ex: 1.1.5)</label>
            <input value={modalChapitre.numChapitre} onChange={(e) => setModalChapitre({ ...modalChapitre, numChapitre: e.target.value })} style={s.input} />

            <label style={s.label}>Nom du chapitre</label>
            <input value={modalChapitre.nom} onChange={(e) => setModalChapitre({ ...modalChapitre, nom: e.target.value })} style={s.input} />

            <label style={s.label}>Vidéo (optionnel — reprend celle du cours si laissée vide)</label>
            <SelecteurVideo
              valeur={modalChapitre.videoUrl}
              onChange={(url) => setModalChapitre({ ...modalChapitre, videoUrl: url })}
              videos={videosDisponibles}
              chargementVideos={chargementVideos}
              uploadEnCours={uploadVideoEnCours}
              erreurUpload={erreurUploadVideo}
              onUploader={uploaderFichierVideo}
              onSupprimerVideo={supprimerVideoDuServeur}
            />

            <label style={s.label}>Déclenchement du quiz (en secondes dans la vidéo)</label>
            <input
              type="number"
              min="0"
              value={modalChapitre.finSeconde}
              onChange={(e) => setModalChapitre({ ...modalChapitre, finSeconde: e.target.value })}
              style={s.input}
              placeholder="ex: 133"
            />
            {modalChapitre.finSeconde !== '' && !Number.isNaN(Number(modalChapitre.finSeconde)) && (
              <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '4px' }}>Soit {formaterDuree(modalChapitre.finSeconde)} dans la vidéo.</div>
            )}

            <label style={s.label}>Nom du dossier (optionnel)</label>
            <input
              value={modalChapitre.dossierNom || ''}
              onChange={(e) => setModalChapitre({ ...modalChapitre, dossierNom: e.target.value })}
              style={s.input}
              placeholder="ex: Microbiologie générale"
              list="dossiers-existants-du-cours"
            />
            {/* 💡 Suggestion des dossiers déjà utilisés dans CE cours, pour
                éviter qu'une faute de frappe crée un dossier en double
                (ex: "Microbiologie" vs "microbiologie générale"). */}
            <datalist id="dossiers-existants-du-cours">
              {[...new Set((coursSelectionne?.chapters || []).map(c => c.dossierNom).filter(Boolean))].map(nomDossier => (
                <option key={nomDossier} value={nomDossier} />
              ))}
            </datalist>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>
              Tous les chapitres portant exactement le même nom de dossier seront regroupés et repliés ensemble côté étudiant. Laisser vide pour un chapitre affiché à plat, sans dossier.
            </div>

            {erreurModal && (
              <div style={{ ...s.resultBox, ...s.resultError, marginTop: '12px', padding: '9px 11px', fontSize: '0.78rem' }}>{erreurModal}</div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
              <button onClick={() => { setModalChapitre(null); setErreurModal(''); }} style={s.secondaryButton}>Annuler</button>
              <button onClick={enregistrerChapitre} disabled={enregistrementEnCours} style={{ ...s.primaryButton, flex: 1, justifyContent: 'center', opacity: enregistrementEnCours ? 0.7 : 1 }}>
                {enregistrementEnCours ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 C3 : modale création/édition d'une question de quiz */}
      {modalQuestion && (
        <div style={s.modalOverlay}>
          <div style={{ ...s.modalCard, width: '440px' }}>
            <h3 style={s.modalTitle}>{modalQuestion.id ? 'Modifier la question' : 'Nouvelle question'}</h3>

            <label style={s.label}>Question</label>
            <textarea
              value={modalQuestion.question}
              onChange={(e) => setModalQuestion({ ...modalQuestion, question: e.target.value })}
              style={{ ...s.input, minHeight: '60px', resize: 'vertical', fontFamily: 'inherit' }}
            />

            <label style={s.label}>Options de réponse (sélectionnez la bonne réponse)</label>
            {modalQuestion.options.map((opt, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <input
                  type="radio"
                  checked={modalQuestion.reponseCorrecte === i}
                  onChange={() => setModalQuestion({ ...modalQuestion, reponseCorrecte: i })}
                />
                <input
                  value={opt}
                  onChange={(e) => {
                    const options = [...modalQuestion.options];
                    options[i] = e.target.value;
                    setModalQuestion({ ...modalQuestion, options });
                  }}
                  style={{ ...s.input, flex: 1 }}
                  placeholder={`Option ${i + 1}`}
                />
                {modalQuestion.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      const options = modalQuestion.options.filter((_, idx) => idx !== i);
                      const reponseCorrecte = modalQuestion.reponseCorrecte >= options.length ? 0 : modalQuestion.reponseCorrecte;
                      setModalQuestion({ ...modalQuestion, options, reponseCorrecte });
                    }}
                    style={s.iconActionButton}
                  >
                    <IconTrash size={14} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setModalQuestion({ ...modalQuestion, options: [...modalQuestion.options, ''] })}
              style={s.secondaryButton}
            >
              + Ajouter une option
            </button>

            <label style={s.label}>Explication (affichée à l'étudiant après sa réponse)</label>
            <textarea
              value={modalQuestion.explication || ''}
              onChange={(e) => setModalQuestion({ ...modalQuestion, explication: e.target.value })}
              style={{ ...s.input, minHeight: '50px', resize: 'vertical', fontFamily: 'inherit' }}
            />

            {erreurModal && (
              <div style={{ ...s.resultBox, ...s.resultError, marginTop: '12px', padding: '9px 11px', fontSize: '0.78rem' }}>{erreurModal}</div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
              <button onClick={() => { setModalQuestion(null); setErreurModal(''); }} style={s.secondaryButton}>Annuler</button>
              <button onClick={enregistrerQuestion} disabled={enregistrementEnCours} style={{ ...s.primaryButton, flex: 1, justifyContent: 'center', opacity: enregistrementEnCours ? 0.7 : 1 }}>
                {enregistrementEnCours ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  app: { display: 'flex', height: '100vh', width: '100vw', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", backgroundColor: '#F8FAFC', overflow: 'hidden' },

  sidebar: { width: '232px', backgroundColor: '#0B1220', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', padding: '20px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  brandMark: { width: '30px', height: '30px', borderRadius: '7px', background: '#10B981', color: '#04241C', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandName: { color: '#FFFFFF', fontWeight: 600, fontSize: '0.88rem', letterSpacing: '0.2px' },
  brandSub: { color: '#64748B', fontSize: '0.68rem', marginTop: '1px' },

  navGroupLabel: { color: '#475569', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase', padding: '10px 12px 6px' },
  navItem: { display: 'flex', alignItems: 'center', width: '100%', padding: '8px 12px 8px 4px', border: 'none', borderRadius: '6px', fontSize: '0.83rem', fontWeight: 500, cursor: 'pointer', marginBottom: '1px' },

  sidebarFooter: { display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' },
  avatarCircle: { width: '30px', height: '30px', borderRadius: '50%', background: '#1E293B', color: '#CBD5E1', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  footerName: { color: '#E2E8F0', fontSize: '0.78rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  footerRole: { color: '#64748B', fontSize: '0.68rem' },

  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 28px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', flexShrink: 0 },
  breadcrumb: { fontSize: '0.72rem', color: '#94A3B8', marginBottom: '2px' },
  pageTitle: { fontSize: '1.15rem', fontWeight: 600, color: '#0F172A', margin: 0, letterSpacing: '-0.2px' },
  topbarRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  topSearch: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F1F5F9', borderRadius: '7px', padding: '7px 12px', color: '#94A3B8' },
  topSearchInput: { border: 'none', outline: 'none', background: 'transparent', fontSize: '0.8rem', width: '160px', color: '#334155' },
  iconButton: { width: '34px', height: '34px', borderRadius: '7px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  apercuButton: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', color: '#334155', borderRadius: '7px', padding: '8px 14px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' },

  scrollArea: { flex: 1, overflowY: 'auto', padding: '24px 28px' },

  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '22px' },
  kpiCard: { backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '16px 18px' },
  kpiLabel: { fontSize: '0.74rem', color: '#64748B', fontWeight: 500, marginBottom: '10px' },
  kpiRow: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' },
  kpiValue: { fontSize: '1.65rem', fontWeight: 600, color: '#0F172A', letterSpacing: '-0.5px' },
  kpiDelta: { fontSize: '0.72rem', fontWeight: 600, marginTop: '10px' },

  panel: { backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' },
  resultBox: { borderRadius: '10px', padding: '14px 16px', border: '1px solid' },
  iconActionButton: { background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px 6px' },
  textActionButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px 10px', fontSize: '0.78rem', fontWeight: 600, marginRight: '4px' },
  secondaryButton: { flex: 1, padding: '9px', borderRadius: '7px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#334155', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', width: '340px', fontFamily: "'Inter', sans-serif" },
  modalTitle: { fontSize: '1rem', fontWeight: 600, color: '#0F172A', margin: '0 0 16px' },
  label: { display: 'block', fontSize: '0.74rem', fontWeight: 500, color: '#334155', marginBottom: '5px', marginTop: '12px' },
  input: { width: '100%', padding: '9px 11px', borderRadius: '7px', border: '1px solid #E2E8F0', fontSize: '0.82rem', boxSizing: 'border-box', outline: 'none' },
  resultSuccess: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', color: '#065F46' },
  resultError: { backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#991B1B' },
  errorList: { margin: '8px 0 0', paddingLeft: '18px', fontSize: '0.78rem', lineHeight: '1.6' },
  panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #F1F5F9' },
  panelTitle: { fontWeight: 600, fontSize: '0.92rem', color: '#0F172A' },

  tabRow: { display: 'flex', gap: '2px', backgroundColor: '#F1F5F9', borderRadius: '7px', padding: '3px' },
  tabItem: { border: 'none', background: 'transparent', fontSize: '0.76rem', fontWeight: 500, color: '#64748B', padding: '5px 11px', borderRadius: '5px', cursor: 'pointer' },
  tabItemActive: { backgroundColor: '#FFFFFF', color: '#0F172A', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' },

  primaryButton: { display: 'flex', alignItems: 'center', gap: '7px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '7px', padding: '8px 14px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' },

  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', padding: '10px 20px', borderBottom: '1px solid #F1F5F9' },
  tr: { borderBottom: '1px solid #F8FAFC' },
  td: { padding: '13px 20px', fontSize: '0.84rem', color: '#334155' },

  rowAvatar: { width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#047857', fontSize: '0.68rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },

  progressTrack: { width: '80px', height: '5px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#10B981' },

  dotsButton: { background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' },

  tableFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid #F1F5F9' },
  pageButton: { width: '26px', height: '26px', border: '1px solid #E2E8F0', background: '#FFFFFF', borderRadius: '5px', fontSize: '0.72rem', color: '#64748B', cursor: 'pointer' },
  pageButtonActive: { backgroundColor: '#0F172A', color: '#FFFFFF', borderColor: '#0F172A' },
};