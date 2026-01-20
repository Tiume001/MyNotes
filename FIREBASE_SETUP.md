# Guida Completa: Configurazione Firebase

Questa guida ti accompagnerà passo-passo nella configurazione di Firebase per il tuo sistema di autenticazione.

## 📋 Prerequisiti

- Un account Google
- Un browser web
- Questo progetto pronto sul tuo computer

---

## 🚀 Passo 1: Creare un Progetto Firebase

1. Vai alla [Firebase Console](https://console.firebase.google.com/)
2. Clicca su **"Aggiungi progetto"** o **"Add project"**
3. Inserisci un nome per il progetto (es. "My Website Auth")
4. (Facoltativo) Disabilita Google Analytics se non ti serve
5. Clicca su **"Crea progetto"**
6. Attendi che Firebase finisca di configurare il progetto
7. Clicca su **"Continua"**

---

## 🌐 Passo 2: Registrare l'App Web

1. Nella pagina principale del progetto, clicca sull'icona **Web** (`</>`) per registrare una web app
2. Inserisci un nickname per l'app (es. "My Website")
3. **NON** selezionare "Firebase Hosting" (non necessario per ora)
4. Clicca su **"Registra app"**
5. Vedrai uno snippet di codice con le credenziali - **COPIALO** e tienilo da parte
   
   Il codice avrà questo formato:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "tuo-progetto.firebaseapp.com",
     projectId: "tuo-progetto",
     storageBucket: "tuo-progetto.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123..."
   };
   ```

6. Clicca su **"Continua alla console"**

---

## 🔐 Passo 3: Abilitare l'Autenticazione Email/Password

1. Nel menu laterale sinistro, clicca su **"Authentication"** (o "Autenticazione")
2. Clicca sul pulsante **"Get started"** se è la prima volta
3. Vai alla tab **"Sign-in method"** (o "Metodo di accesso")
4. Trova **"Email/Password"** nella lista dei provider
5. Clicca su **"Email/Password"**
6. Abilita il primo interruttore **"Email/Password"** (lascia disabilitato "Email link")
7. Clicca su **"Salva"** o **"Save"**

---

## 🔑 Passo 4: Abilitare l'Autenticazione Google

1. Sempre nella tab **"Sign-in method"**
2. Trova **"Google"** nella lista dei provider
3. Clicca su **"Google"**
4. Abilita l'interruttore
5. Seleziona un **"Email di supporto per il progetto"** dal menu a tendina (puoi usare la tua email)
6. Clicca su **"Salva"** o **"Save"**

---

## 🔧 Passo 5: Configurare Domini Autorizzati

Per far funzionare Firebase in locale durante lo sviluppo:

1. Sempre in **"Authentication"** > **"Settings"** (Impostazioni)
2. Scorri fino a **"Authorized domains"** (Domini autorizzati)
3. Dovresti già vedere `localhost` nella lista
4. Se non c'è, clicca su **"Add domain"** e aggiungi `localhost`
5. Quando caricherai il sito online, dovrai aggiungere anche il tuo dominio reale qui

---

## 📝 Passo 6: Inserire le Credenziali nel Codice

1. Apri il file `firebase-config.js` in questo progetto
2. Trova l'oggetto `firebaseConfig`
3. Sostituisci i valori placeholder con quelli che hai copiato al Passo 2
4. Il file dovrebbe apparire così:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC_TUA_API_KEY_QUI",
  authDomain: "tuo-progetto.firebaseapp.com",
  projectId: "tuo-progetto-id",
  storageBucket: "tuo-progetto.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890"
};
```

5. Salva il file

---

## ✅ Passo 7: Testare l'Autenticazione

1. Apri `auth.html` nel tuo browser (puoi trascinare il file nel browser o usare un server locale)
2. Prova a:
   - Registrarti con email e password
   - Fare login con Google
   - Verificare che vieni reindirizzato a `index.html` dopo il login

> **⚠️ Importante per il Testing Locale**
> 
> Se usi `file://` (aprendo direttamente il file HTML), il Google Sign-In potrebbe non funzionare. È meglio usare un server locale:
> 
> **Metodo 1: Python**
> ```bash
> # Python 3
> python3 -m http.server 8000
> ```
> Poi vai su `http://localhost:8000/login_firebase/auth.html`
>


Quando il tuo sito esistente è pronto:

1. Apri `index.html` (il placeholder che ho creato)
2. **Mantieni** lo script all'inizio del file che verifica l'autenticazione:
   ```html
   <script type="module">
     import { auth } from './firebase-config.js';
     import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
     
     onAuthStateChanged(auth, (user) => {
       if (!user) {
         window.location.href = 'auth.html';
       }
     });
   </script>
   ```
3. Sostituisci il resto del contenuto del `<body>` con il contenuto del tuo sito esistente
4. Se vuoi aggiungere un pulsante di logout nel tuo sito, usa il codice già presente

---

## 🆘 Risoluzione Problemi Comuni

### Errore: "Firebase: Error (auth/unauthorized-domain)"
- Vai a **Authentication** > **Settings** > **Authorized domains**
- Aggiungi il dominio che stai usando (es. `localhost` o il tuo dominio)

### Google Sign-In non funziona in locale
- Usa un server locale invece di aprire il file direttamente
- Verifica che `localhost` sia nei domini autorizzati

### "Firebase: Error (auth/invalid-api-key)"
- Controlla che le credenziali in `firebase-config.js` siano corrette
- Assicurati di non aver aggiunto spazi extra

### Gli utenti possono registrarsi ma non fare login
- Vai alla Firebase Console > **Authentication** > **Users**
- Verifica che l'utente sia stato creato correttamente
- Controlla che email e password siano corrette

---

## 📚 Risorse Aggiuntive

- [Documentazione Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase JavaScript SDK Reference](https://firebase.google.com/docs/reference/js)

---

## 🎉 Fatto!

Ora hai un sistema di autenticazione completo e funzionante! Gli utenti dovranno fare login prima di accedere al tuo sito.
