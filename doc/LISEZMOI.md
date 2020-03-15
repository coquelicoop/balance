git config credential.helper store

npm install -g @quasar/cli
quasar create bal8
cd bal8
quasar mode add electron
npm install -s electron-packager

quasar dev -m electron
quasar build -m electron

// supression de la barre de menu et fullscreen
### Dans src-electron/main-process/electron-main.js

mainWindow = new BrowserWindow({
  frame: false,

if (process.env.PROD) {
    mainWindow.setMenu(null)
    mainWindow.setSimpleFullScreen(true)
  } else {
    mainWindow.maximize()
  }

Garder pages/Error404.vue et router (appelé par défaut)

### Dans quasar.conf.js
extendWebpack (cfg) {
        // ajouter
        cfg.devtool = 'source-map'

.eslintrc.js   // rules ajoutées en queue


### A la racine
Fichiers balance.ico (Windows) / balance.png et Balance.desktop pour Linux  
config.json : template pour Linux / Windows (n'est pas lu dans le code)

### Dans src/assets
Le fichier app-logo-128pxx128px.png est le logo de la balance

### Install serialport
Le require de serialport doit être fait dans le process principal
import { remote } from 'electron'
const SerialPort = remote.require('serialport')

### Problème de rebuild

**package.json**
Dans "scripts" ajouter : "install": "electron-rebuild"
Dans "dependencies" ajouter : "electron-rebuild": "^1.0.0"
Il est dit que ça devrait être dans "devDependencies" mais problème de build sous Linux, donc dans "dependencies"

Hi @DonavanMartin,

I solved this problem using the command below:

./node_modules/.bin/electron-rebuild

Steps:

    If you have not installed electron-rebuild just install it with the command: npm i -D electron-rebuild
    Remove from the node-modules folder the serialport and @serialport folders.
    Remove the file packages-lock.json
    Run npm i to install non-installed modules
    And finally run ./node_modules/.bin/electron-rebuild

It is very important to run ./node_modules/.bin/electron-rebuild directly after npm i.

Source: https://stackoverflow.com/a/52796884
_______________________________________________________________________
Dans ./electron/balance-linux-x64

zip -r /tmp/balance-linux-0.0.1.zip .
