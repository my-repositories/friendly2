# friendly2
Google Chrome extension which automates sending requests to friends/subscribers.

## Usage
1. Download the latest [release](https://github.com/my-repositories/friendly2/releases)
2. Unzip the downloaded file
3. Navigate to Browser Settings -> More Tools -> Extensions
4. Enable the Developer mode
5. Click Load unpacked and pick the directory with the extension

## How It Works
1. When you open any site, a check is performed to see if the current address matches the address from the list of available for automation
2. If the check is executed, the script checks the authorization on the current web resource
3. Next, looks for all available links to profiles and save them
4. Subscribes to the current profile, if possible
5. Subscribes to all profiles that are available on this page
6. Goes to the next page, which will be the last element of the list of available links (from p. 3)

---

## bun-chrome-extension template 

> Develop chrome extension with full TypeScript support using [Bun](https://bun.sh) 🐰 & [React](https://react.dev/)

Bun chrome extension is a starter template for developing chrome-extensions using modern frontend tooling.

## What's inside?
- [x] First-class TypeScript support
- [x] Background & content scripts
- [x] Popup & Options page built with React
- [x] Lint & format with [BiomeJS](https://biomejs.dev/)
- [x] Latest Manifest v3
- [x] TailwindCSS

Install dependencies:

```bash
bun install
```

Run:

```bash
bun run dev
```

Build:

```bash
bun run build
```

Package extension for publishing

```bash
bun run pack
```

## License
This project is licensed under the [MIT](/LICENSE) License.
