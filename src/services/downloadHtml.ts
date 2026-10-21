/**
 * Client-side trigger to download the standalone kuntur.html file.
 * This runs 100% inside the browser using Blob, preventing 404 navigation errors.
 */
export async function downloadStandaloneHtml(): Promise<void> {
  try {
    // Attempt to fetch the static single-file HTML generated at build time
    let htmlText = '';
    
    try {
      const res = await fetch('/kuntur.html');
      if (res.ok) {
        htmlText = await res.text();
      }
    } catch {
      // Fallback if direct fetch had an issue
    }

    if (!htmlText || !htmlText.includes('id="root"')) {
      // Secondary fallback attempt
      const res2 = await fetch('/public/kuntur.html');
      if (res2.ok) {
        htmlText = await res2.text();
      }
    }

    if (!htmlText) {
      throw new Error('No se pudo obtener el archivo compilado. Por favor recarga e intenta de nuevo.');
    }

    // Trigger local browser download via Blob
    const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kuntur_juego.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  } catch (err) {
    console.error('Error al descargar HTML:', err);
    // As last resort, open the URL in a new window or alert
    window.location.href = '/kuntur.html';
  }
}
