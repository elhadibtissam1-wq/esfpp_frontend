import React from 'react';

export default function Specialities() {
  const filieres = [
    { titre: "Infirmiers Anesthésistes Réanimateurs", icone: "🫁" },
    { titre: "Techniciens en Radiologie", icone: "🩻" },
    { titre: "Sages-Femmes", icone: "👶" },
    { titre: "Diététiciennes", icone: "🍎" },
    { titre: "Infirmières Polyvalentes", icone: "🩺" },
    { titre: "Infirmières Auxiliaires", icone: "🩹" },
    { titre: "Aides-Soignantes", icone: "🤝" }
  ];

  return (
    <section className="fonctionnalites" id="specialites" style={{ background: 'var(--gris-clair)' }}>
      <div className="conteneur">
        <div className="section__intro" data-reveal>
          <p className="etiquette">Filières ESFPP</p>
          <h2>Nos Spécialités Paramédicales</h2>
        </div>
        <div className="grille-fonctionnalites">
          {filieres.map((filiere, index) => (
            <article key={index} className="carte-fonctionnalite" data-reveal style={{ background: '#ffffff' }}>
              <div className="carte-fonctionnalite__icone" style={{ fontSize: '1.4rem' }}>{filiere.icone}</div>
              <h3>{filiere.titre}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}