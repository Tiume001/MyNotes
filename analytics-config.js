// Sostituisci G-XXXXXXXXXX con il tuo ID di misurazione di Google Analytics
const GA_ID = 'G-ZCHVRHTMYD'; 

// Caricamento dinamico dello script ufficiale di Google
const script = document.createElement('script');
script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
script.async = true;
document.head.appendChild(script);

// Inizializzazione di Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Tracciamento automatico della pagina
gtag('config', GA_ID);