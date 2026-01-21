// Codice AdSense
const adSenseScript = document.createElement('script');
adSenseScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5649862133349961";
adSenseScript.async = true;
adSenseScript.crossOrigin = "anonymous";
document.head.appendChild(adSenseScript);

// ... qui sotto lasci il resto del codice di Analytics che avevi già ...
// Sostituisci G-XXXXXXXXXX con il tuo ID di misurazione di Google Analyticstt
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
