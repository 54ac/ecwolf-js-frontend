## ecwolf-js-frontend

### What is this?

This is a simple, minimal frontend for [ECWolf-JS](https://github.com/54ac/ecwolf-js), a WebAssembly port of [ECWolf](https://maniacsvault.net/ecwolf/), used for launching games like Wolfenstein 3D in the browser. Written in TypeScript. Launches game from remote or local files and supports command line arguments. Uses JSZip to unpack zip files in the browser. Game saves and config saved by the Emscripten runtime in the browser's IndexedDB.

### How do I launch this?

Supply the following files:

- ecwolf.pk3 from [the latest release of ECWolf](https://maniacsvault.net/ecwolf/download.php) to /public/static
- ecwolf.wasm and ecwolf.js from [the latest release of ECWolf-JS](https://github.com/54ac/ecwolf-js/releases) (custom frontend zip) to /public/static and /src/static respectively
- shareware.zip containing the IWADs (.wl1 files) from [the shareware version of Wolfenstein 3D](https://archive.org/details/wolf3dsw) to /public/static (optional)

Then, use npm to launch a web server using Vite:

```
npm install
npm start
```
