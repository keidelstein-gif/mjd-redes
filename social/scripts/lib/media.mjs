// Construye la URL pública desde donde Meta descargará la imagen.
export function publicMediaUrl(mediaPath, baseUrl) {
  const base = baseUrl.replace(/\/+$/, '');
  const rel = mediaPath.replace(/^\/+/, '');
  return `${base}/${rel}`;
}
