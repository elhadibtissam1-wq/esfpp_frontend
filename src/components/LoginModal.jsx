import React, { useState } from 'react';
import { API_BASE_URL } from './config';

export default function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  // États de navigation : 'login' | 'activate' | 'forgot'
  const [ongletActif, setOngletActif] = useState('login');
  const [messageErreur, setMessageErreur] = useState('');
  const [messageSucces, setMessageSucces] = useState('');
  const [donneesEtudiant, setDonneesEtudiant] = useState(null);
  
  // États des formulaires
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // États pour l'Activation
  const [cinActivation, setCinActivation] = useState(''); 
  const [nouvelEmail, setNouvelEmail] = useState('');
  const [nouvelMdp, setNouvelMdp] = useState('');
  const [etapeActivation, setEtapeActivation] = useState(1); 

  // États pour la Récupération de mot de passe (OTP)
  const [emailRecuperation, setEmailRecuperation] = useState('');
  const [codeOTP, setCodeOTP] = useState('');
  const [mdpRecuperation, setMdpRecuperation] = useState('');
  const [etapeRecuperation, setEtapeRecuperation] = useState(1); // 1 = Demande de code, 2 = Saisie du code + nouveau MDP

  // États pour afficher / masquer les mots de passe
  const [voirPassword, setVoirPassword] = useState(false);
  const [voirNouvelMdp, setVoirNouvelMdp] = useState(false);
  const [voirMdpRecuperation, setVoirMdpRecuperation] = useState(false);

  // Réinitialisation de tous les messages et champs
  const réinitialiserFormulaires = (onglet) => {
    setOngletActif(onglet);
    setMessageErreur('');
    setMessageSucces('');
    setEtapeActivation(1);
    setEtapeRecuperation(1);
    setCinActivation('');
    setNouvelEmail('');
    setNouvelMdp('');
    setEmailRecuperation('');
    setCodeOTP('');
    setMdpRecuperation('');
    setVoirPassword(false);
    setVoirNouvelMdp(false);
    setVoirMdpRecuperation(false);
  };

  const gererConnexion = async (e) => {
    e.preventDefault();
    setMessageErreur('');
    setMessageSucces('');

    try {
      const reponse = await fetch(`${API_BASE_URL}/students/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motDePasse: password }),
      });

      const resultat = await reponse.json();

      if (!reponse.ok) {
        throw new Error(resultat.message || "Impossible de se connecter.");
      }

      // 💡 1. Stocker le badge d'accès (Token) de l'étudiant dans le navigateur
      localStorage.setItem('token_etudiant', resultat.accessToken);
      
      // 💡 2. Stocker les infos de base (nom, prénom) pour pouvoir les afficher plus tard sur le Dashboard
      localStorage.setItem('infos_etudiant', JSON.stringify(resultat.etudiant));

      setMessageSucces(`✓ Bienvenue ${resultat.etudiant.prenom} !`);
      console.log("Token d'accès généré :", resultat.accessToken);

      setTimeout(() => {
        onClose();
        réinitialiserFormulaires('login');
        // 💡 3. Optionnel : Rafraîchir ou rediriger l'utilisateur
        window.location.reload(); 
      }, 1500);

    } catch (erreur) {
      setMessageErreur(erreur.message === "Failed to fetch" ? "Serveur NestJS éteint." : erreur.message);
    }
  };

  // Activation - Étape 1 : Vérification du CIN
  const gererVérificationActivation = async (e) => {
    e.preventDefault();
    setMessageErreur(''); 

    try {
      const reponse = await fetch(`${API_BASE_URL}/students/verify-activation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cin: cinActivation }),
      });

      const resultat = await reponse.json();

      if (!reponse.ok) throw new Error(resultat.message || "Une erreur est survenue.");

      setDonneesEtudiant(resultat.donnees);
      setEtapeActivation(2);

    } catch (erreur) {
      setMessageErreur(erreur.message === "Failed to fetch" ? "Serveur NestJS éteint." : erreur.message);
    }
  };

  // Activation - Étape 2 : Enregistrement final
  const gererFinalisationActivation = async (e) => {
    e.preventDefault();
    setMessageErreur('');

    try {
      const reponse = await fetch(`${API_BASE_URL}/students/finalize-activation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cin: cinActivation, email: nouvelEmail, motDePasse: nouvelMdp }),
      });

      const resultat = await reponse.json();
      if (!reponse.ok) throw new Error(resultat.message || "Impossible de finaliser.");

      alert(resultat.message);
      onClose(); 
      réinitialiserFormulaires('login');
      
    } catch (erreur) {
      setMessageErreur(erreur.message);
    }
  };

  // Récupération Étape 1 : Demander le code OTP par email
  const gererDemandeCode = async (e) => {
    e.preventDefault();
    setMessageErreur('');
    setMessageSucces('');

    try {
      const reponse = await fetch(`${API_BASE_URL}/students/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailRecuperation }),
      });

      const resultat = await reponse.json();
      if (!reponse.ok) throw new Error(resultat.message || "Erreur lors de la demande.");

      setMessageSucces(resultat.message);
      setEtapeRecuperation(2); 

    } catch (erreur) {
      setMessageErreur(erreur.message === "Failed to fetch" ? "Serveur NestJS éteint." : erreur.message);
    }
  };

  // Récupération Étape 2 : Valider le code et changer le mot de passe
  const gererChangementMdp = async (e) => {
    e.preventDefault();
    setMessageErreur('');
    setMessageSucces('');

    try {
      const reponse = await fetch(`${API_BASE_URL}/students/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailRecuperation,
          code: codeOTP,
          nouveauMdp: mdpRecuperation
        }),
      });

      const resultat = await reponse.json();
      if (!reponse.ok) throw new Error(resultat.message || "Code incorrect ou expiré.");

      setMessageSucces("✓ Votre mot de passe a été réinitialisé avec succès ! Redirection vers la page de connexion...");
      
      setTimeout(() => {
        réinitialiserFormulaires('login');
      }, 3000);

    } catch (erreur) {
      setMessageErreur(erreur.message);
    }
  };

  // Composant Icône Œil (Visible)
  const IconeOeilOuvert = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="#6c757d" style={{ width: '20px', height: '20px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );

  // Composant Icône Œil Barré (Masqué)
  const IconeOeilFerme = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="#6c757d" style={{ width: '20px', height: '20px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );

  return (
    <div className="modal-zone" style={styles.overlay}>
      <div className="modal-corps" style={styles.modal}>
        
        <button onClick={onClose} style={styles.boutonFermer} aria-label="Fermer">✕</button>

        {/* BARRE D'ONGLETS (Masquée si on est en mode récupération) */}
        {ongletActif !== 'forgot' && (
          <div style={styles.ongletsBarre}>
            <button 
              style={{...styles.onglet, ...(ongletActif === 'login' ? styles.ongletActif : {})}}
              onClick={() => réinitialiserFormulaires('login')}
            >
              Se connecter
            </button>
            <button 
              style={{...styles.onglet, ...(ongletActif === 'activate' ? styles.ongletActif : {})}}
              onClick={() => réinitialiserFormulaires('activate')}
            >
              Activer mon compte
            </button>
          </div>
        )}

        {/* 1. FORMULAIRE : CONNEXION */}
        {ongletActif === 'login' && (
          <form onSubmit={gererConnexion} style={styles.formulaire}>
            <h2 style={styles.titreForm}>Espace Étudiant</h2>
            <p style={styles.description}>Connectez-vous pour accéder à vos modules de cours.</p>
            
            <div style={styles.groupeChamp}>
              <label style={styles.label}>Adresse Email</label>
              <input 
                type="email" 
                placeholder="exemple@esfpp-learning.ma" 
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div style={styles.groupeChamp}>
              <label style={styles.label}>Mot de passe</label>
              <div style={styles.conteneurMdp}>
                <input 
                  type={voirPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  style={{...styles.input, paddingRight: '45px', width: '100%'}}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  style={styles.boutonOeil} 
                  onClick={() => setVoirPassword(!voirPassword)}
                >
                  {voirPassword ? <IconeOeilOuvert /> : <IconeOeilFerme />}
                </button>
              </div>
            </div>

            {/* Lien mot de passe oublié */}
            <span 
              style={styles.lienOublie} 
              onClick={() => réinitialiserFormulaires('forgot')}
            >
              Mot de passe oublié ?
            </span>

            {/* Zone de messages dynamiques */}
            {messageErreur && <p style={styles.texteErreur}>❌ {messageErreur}</p>}
            {messageSucces && <p style={{...styles.texteSucces, color: '#155724'}}>{messageSucces}</p>}

            <button type="submit" className="bouton bouton--principal" style={{...styles.boutonSoumettre, backgroundColor: '#007bff'}}>
              Entrer dans l'espace privé
            </button>
          </form>
        )}

        {/* 2. FORMULAIRE : ACTIVATION */}
        {ongletActif === 'activate' && (
          <div style={styles.formulaire}>
            <h2 style={styles.titreForm}>Première connexion ?</h2>
            
            {etapeActivation === 1 ? (
              <form onSubmit={gererVérificationActivation}>
                <p style={styles.description}>
                  Entrez votre <strong>CIN</strong> pour vérifier votre autorisation d'accès sur la liste officielle.
                </p>
                
                <div style={styles.groupeChamp}>
                  <label style={styles.label}>Code CIN</label>
                  <input 
                    type="text" 
                    placeholder="Ex: BK123456" 
                    style={styles.input}
                    value={cinActivation}
                    onChange={(e) => setCinActivation(e.target.value)}
                    required 
                  />
                </div>

                {messageErreur && <p style={styles.texteErreur}>❌ {messageErreur}</p>}

                <button type="submit" className="bouton bouton--principal" style={{...styles.boutonSoumettre, backgroundColor: '#007bff'}}>
                  Vérifier mon CIN
                </button>
              </form>
            ) : (
              <form onSubmit={gererFinalisationActivation}>
                <p style={styles.texteSucces}>
                  ✓ Statut étudiant validé ! Bonjour {donneesEtudiant?.prenom} {donneesEtudiant?.nom}
                </p>
                
                <div style={styles.groupeChamp}>
                  <label style={styles.label}>Renseignez votre adresse Email personnelle</label>
                  <input 
                    type="email" 
                    placeholder="votre.email@gmail.com" 
                    style={styles.input}
                    value={nouvelEmail}
                    onChange={(e) => setNouvelEmail(e.target.value)}
                    required 
                  />
                </div>

                <div style={styles.groupeChamp}>
                  <label style={styles.label}>Définissez votre mot de passe secret</label>
                  <div style={styles.conteneurMdp}>
                    <input 
                      type={voirNouvelMdp ? "text" : "password"} 
                      placeholder="Créez un mot de passe fort" 
                      style={{...styles.input, paddingRight: '45px', width: '100%'}} 
                      value={nouvelMdp}
                      onChange={(e) => setNouvelMdp(e.target.value)}
                      required 
                    />
                    <button 
                      type="button" 
                      style={styles.boutonOeil} 
                      onClick={() => setVoirNouvelMdp(!voirNouvelMdp)}
                    >
                      {voirNouvelMdp ? <IconeOeilOuvert /> : <IconeOeilFerme />}
                    </button>
                  </div>
                </div>

                {messageErreur && <p style={styles.texteErreur}>❌ {messageErreur}</p>}

                <button type="submit" className="bouton bouton--principal" style={{...styles.boutonSoumettre, backgroundColor: '#28a745'}}>
                  Finaliser et Activer mon espace
                </button>
              </form>
            )}
          </div>
        )}

        {/* 3. FORMULAIRE : RÉCUPÉRATION MOT DE PASSE (OTP) */}
        {ongletActif === 'forgot' && (
          <div style={styles.formulaire}>
            <h2 style={styles.titreForm}>Récupération de compte</h2>
            
            {etapeRecuperation === 1 ? (
              <form onSubmit={gererDemandeCode}>
                <p style={styles.description}>
                  Saisissez votre adresse email personnelle pour recevoir votre code de validation sécurisé à 6 chiffres.
                </p>
                
                <div style={styles.groupeChamp}>
                  <label style={styles.label}>Votre adresse Email</label>
                  <input 
                    type="email" 
                    placeholder="votre.email@gmail.com" 
                    style={styles.input}
                    value={emailRecuperation}
                    onChange={(e) => setEmailRecuperation(e.target.value)}
                    required 
                  />
                </div>

                {messageErreur && <p style={styles.texteErreur}>❌ {messageErreur}</p>}

                <button type="submit" className="bouton bouton--principal" style={{...styles.boutonSoumettre, backgroundColor: '#007bff'}}>
                  Envoyer le code secret
                </button>
              </form>
            ) : (
              <form onSubmit={gererChangementMdp}>
                {/* Message d'envoi initial */}
                {messageSucces && !messageSucces.includes("réinitialisé") && (
                  <p style={styles.texteSucces}>
                    ✓ Un code de validation à 6 chiffres a été envoyé sur votre boîte email.
                  </p>
                )}

                {/* Message de réussite finale après modification */}
                {messageSucces && messageSucces.includes("réinitialisé") && (
                  <p style={{...styles.texteSucces, color: '#155724', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', padding: '12px', borderRadius: '8px', marginBottom: '15px'}}>
                    {messageSucces}
                  </p>
                )}
                
                <div style={styles.groupeChamp}>
                  <label style={styles.label}>Code de validation (6 chiffres)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 123456" 
                    style={styles.input}
                    maxLength="6"
                    value={codeOTP}
                    onChange={(e) => setCodeOTP(e.target.value)}
                    required 
                  />
                </div>

                <div style={styles.groupeChamp}>
                  <label style={styles.label}>Nouveau mot de passe</label>
                  <div style={styles.conteneurMdp}>
                    <input 
                      type={voirMdpRecuperation ? "text" : "password"} 
                      placeholder="Entrez votre nouveau mot de passe" 
                      style={{...styles.input, paddingRight: '45px', width: '100%'}}
                      value={mdpRecuperation}
                      onChange={(e) => setMdpRecuperation(e.target.value)}
                      required 
                    />
                    <button 
                      type="button" 
                      style={styles.boutonOeil} 
                      onClick={() => setVoirMdpRecuperation(!voirMdpRecuperation)}
                    >
                      {voirMdpRecuperation ? <IconeOeilOuvert /> : <IconeOeilFerme />}
                    </button>
                  </div>
                </div>

                {messageErreur && <p style={styles.texteErreur}>❌ {messageErreur}</p>}

                <button 
                  type="submit" 
                  className="bouton bouton--principal" 
                  style={{...styles.boutonSoumettre, backgroundColor: '#e67e22'}}
                  disabled={messageSucces.includes("réinitialisé")}
                >
                  Mettre à jour mon mot de passe
                </button>
              </form>
            )}

            {/* Bouton pour revenir en arrière */}
            <span 
              style={styles.lienRetour} 
              onClick={() => réinitialiserFormulaires('login')}
            >
              ← Retour à la connexion
            </span>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(8, 26, 46, 0.6)', backdropFilter: 'blur(6px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  modal: { position: 'relative', width: '100%', maxWidth: '460px', background: '#ffffff', borderRadius: '18px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' },
  boutonFermer: { position: 'absolute', top: '16px', right: '16px', fontSize: '1.2rem', color: '#6c757d', background: 'none', border: 'none', cursor: 'pointer' },
  ongletsBarre: { display: 'flex', borderBottom: '1px solid #dee2e6', marginBottom: '24px' },
  onglet: { flex: 1, padding: '12px', textAlign: 'center', fontWeight: '600', fontSize: '0.95rem', color: '#6c757d', borderBottom: '2px solid transparent', background: 'none', cursor: 'pointer', transition: 'all 0.2s' },
  ongletActif: { color: '#007bff', borderBottomColor: '#007bff' },
  formulaire: { display: 'flex', flexDirection: 'column' },
  titreForm: { fontSize: '1.5rem', color: '#1a202c', marginBottom: '6px' },
  description: { fontSize: '0.9rem', color: '#4a5568', marginBottom: '20px', lineHeight: '1.4' },
  groupeChamp: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#2d3748' },
  input: { padding: '12px', border: '1px solid #ced4da', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' },
  boutonSoumettre: { width: '100%', marginTop: '10px', padding: '14px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', color: 'white' },
  lienOublie: { alignSelf: 'flex-end', fontSize: '0.85rem', color: '#007bff', cursor: 'pointer', marginBottom: '15px', textDecoration: 'underline' },
  lienRetour: { textAlign: 'center', fontSize: '0.85rem', color: '#6c757d', cursor: 'pointer', marginTop: '20px', fontWeight: '600' },
  texteErreur: { color: '#dc3545', fontSize: '0.85rem', marginBottom: '15px', fontWeight: 'bold' },
  texteSucces: { color: 'green', marginBottom: '15px', fontWeight: 'bold', fontSize: '0.95rem' },
  
  // Styles pour le bouton d'oeil
  conteneurMdp: { 
    position: 'relative', 
    display: 'flex', 
    alignItems: 'center',
    width: '100%' 
  },
  boutonOeil: { 
    position: 'absolute', 
    right: '12px', 
    background: 'none', 
    border: 'none', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    outline: 'none'
  }
};