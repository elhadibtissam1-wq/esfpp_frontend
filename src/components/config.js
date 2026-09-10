// src/config.js

// L'adresse du backend NestJS. Change-la ici (et seulement ici) le jour
// où tu déploies en production (ex: 'https://api.esfpp.ma').
export const API_BASE_URL = 'http://localhost:3000';

// Transforme un chemin relatif renvoyé par le backend (ex: "/videos/xxx.mp4")
// en URL complète utilisable par le navigateur (ex: "http://localhost:3000/videos/xxx.mp4").
// Si l'URL est déjà complète (commence par http), elle est laissée telle quelle.
export function getUrlVideoAbsolue(cheminVideo) {
  if (!cheminVideo) return cheminVideo;
  return cheminVideo.startsWith('http') ? cheminVideo : `${API_BASE_URL}${cheminVideo}`;
}