/**
 * UI translations for Anthology.
 *
 * `en` is the source of truth: its keys define the `TranslationKey` type.
 * `es` is typed as `Record<TranslationKey, string>` so TypeScript fails the
 * build if a Spanish string is missing.
 *
 * Placeholders use `{name}` and are replaced by `t(key, vars)`.
 */

export const en = {
  /* --------------------------------- Common -------------------------------- */
  "common.cancel": "Cancel",
  "common.confirm": "Confirm",
  "common.save": "Save",
  "common.change": "Change",
  "common.add": "Add",
  "common.remove": "Remove",
  "common.back": "← Back",
  "common.loading": "Loading...",
  "common.enabled": "Enabled",
  "common.disabled": "Disabled",
  "common.untitled": "Untitled",
  "common.other": "Other",
  "common.unknownError": "Unknown error",

  /* ------------------------------ Accessibility ---------------------------- */
  "a11y.skipToMain": "Skip to main content",
  "a11y.sidePanel": "Open menu",
  "a11y.addMemoir": "Add memoir",
  "a11y.skinSelector": "View",
  "a11y.orderSelector": "Order",
  "a11y.searchType": "Search type",
  "a11y.searchMemoirs": "Search memoirs",
  "a11y.playVideo": "Play video",
  "a11y.playSpotify": "Play on Spotify",
  "a11y.qrCode": "Show QR code",
  "a11y.scanQr": "Scan QR code",
  "a11y.syncAnthologies": "Refresh anthologies",
  "a11y.checkAddress": "Check address",
  "a11y.connectorLogo": "Wallet connection option",

  /* ------------------------------ Navigation ------------------------------- */
  "nav.myAnthologies": "My Anthologies",
  "nav.discover": "Discover",
  "nav.privateMemory": "Private Memory",
  "nav.about": "About",
  "nav.factoryInfo": "Factory Info",
  "nav.settings": "Settings",

  /* --------------------------------- Footer -------------------------------- */
  "footer.tagline": "Recording the collective memory.",

  /* -------------------------------- NotFound -------------------------------- */
  "notFound.subtitle": "Page not found",
  "notFound.message":
    "This route doesn't exist. Maybe you mistyped the URL, or maybe the link is broken.",
  "notFound.back": "← Go back home",
  "notFound.quote":
    "“Madness is something rare in individuals — but in groups, parties, peoples, ages it is the rule.”",

  /* ---------------------------------- About --------------------------------- */
  "about.intro":
    "Anthology is a local-first place to keep what you want to remember — notes, links, videos, ideas — organized into collections. Everything works offline, and publishing to the blockchain is optional.",

  "about.whyTitle": "Why memory?",
  "about.whyIntro":
    "Every story has more than one side, and every piece of information passes through someone's lens. Before the internet, media was centralized — radio, TV, newspapers — so even with editorial bias, most people shared a baseline and could contrast sources. Today information is fragmented: you mostly see what you already click on, and if a topic never crosses your feed, an algorithm quietly decides what you believe about it.",
  "about.whyPerson":
    "Someone can be brilliant at one specific thing — a historian who documents sources, a researcher explaining their field — while their opinions on everything else hardly matter. Anthology organizes knowledge by topic and by value, not by idolizing people.",
  "about.whyForget":
    "Human memory is forgetful. Names fade, yesterday's meals disappear, and university lectures turn into vague notions — only the core ideas and feelings stay. And people usually search for information after they need it, not when they stumble upon it.",
  "about.whyFilter":
    "Anthology is a filter for those moments when something new appears during \"productive procrastination\" — history, geopolitics, music, cinema, art, technology — and one of these thoughts shows up:",
  "about.whyFilter1": "Everyone should know this.",
  "about.whyFilter2": "Why isn't this common knowledge?",
  "about.whyFilter3": "This is worth remembering in 5 or 10 years.",
  "about.whyIdeasTitle": "What a curated memory enables",
  "about.whyIdeas1Title": "Someone already said it",
  "about.whyIdeas1":
    "Instead of rebuilding an argument from scratch, point straight to the memoir — a clip, an article, a quote — where someone already said it best.",
  "about.whyIdeas2Title": "Question chains",
  "about.whyIdeas2":
    "People don't know what they don't know, and they distrust strangers. A curated chain of memoirs and questions lets anyone walk a topic step by step and reach their own conclusions.",
  "about.whyIdeas3Title": "Human-curated rabbit holes",
  "about.whyIdeas3":
    "Instead of an opaque corporate algorithm deciding the feed, an anthology is a transparent playlist of videos, posts and notes about a topic — curated by a person with a genuine interest in it.",

  "about.glossaryTitle": "Glossary",
  "about.glossaryMemoir": "Memoir",
  "about.glossaryMemoirDesc":
    "A single piece of information — a title and content (a note, link, video or post) — saved inside an anthology.",
  "about.glossaryAnthology": "Anthology",
  "about.glossaryAnthologyDesc":
    "A collection of memoirs about a topic. It can live privately in your browser or as an independent smart contract on the blockchain.",
  "about.glossaryMemory": "Memory",
  "about.glossaryMemoryDesc": "All of your anthologies together.",

  "about.staticTitle": "100% static — what runs where",
  "about.staticNoBackend":
    "memory.inbytes.xyz is a 100% static web app. There is no backend server, no user database and no tracking — the app runs entirely in your browser.",
  "about.staticLocal":
    "Private Memory (local): everything you save lives in your browser, on your device. It works offline, never leaves the device, and can be exported as a file whenever you want.",
  "about.staticChain":
    "Public Memory (on-chain): with a wallet connected, the browser talks directly to the Arbitrum blockchain through an RPC endpoint — changeable in Settings. Published anthologies can be shared as links or QR codes: scan one on another device and it opens instantly.",
  "about.staticCleanLinks":
    "Clean links: social platforms attach tracking IDs (?si=..., ?igsh=...) to shared links. Anthology highlights and strips them automatically when you save a memoir.",

  "about.walletTitle": "Wallets & smart contracts",
  "about.walletIdentity":
    "Web3 apps don't use passwords stored on a company server. A wallet holds a private key that only you control, and a public address (0x...) derived with secp256k1 cryptography — the same address identifies you across Ethereum, Arbitrum and every EVM chain. Because no central authority exists, only you are responsible for your keys.",
  "about.walletContracts":
    "A blockchain like Ethereum is a shared public computer (the EVM). Smart contracts are programs deployed onto it: decentralized (no single company runs them), transparent (the code and state are public) and immutable (the rules can't be secretly changed after deployment).",

  "about.contractsTitle": "The two smart contracts behind Anthology",
  "about.factoryTitle": "The Factory contract",
  "about.factoryDesc":
    "The directory contract that deploys new on-chain anthologies. Its administrator can manage the deployer whitelist, pause new deployments and set a deployment fee (ETH or ERC20) — but cannot edit, freeze or delete any anthology already created. Check its current state at /info.",
  "about.anthologyTitle": "Your Anthology contract",
  "about.anthologyDesc":
    "Deploying through the Factory creates a dedicated smart contract owned by your wallet. Only you can change its title or default view, add or delete memoirs, set a contribution price (anti-spam), manage the contributor whitelist, or enable the moderation buffer — where submitted memoirs wait for you to accept or decline them. Check its current state in \"Anthology Info\".",

  "about.showFull": "Read full version",
  "about.showShort": "Read short version",
  "about.onboarding": "Onboarding",
  "about.onboardingIframeTitle": "Anthology Onboarding Guide",
  "about.shortTitle": "What is Anthology?",
  "about.shortIntro":
    "A local-first filter for what's worth remembering: notes, links, videos and ideas — saved the moment something makes you think \"everyone should know this\" or \"worth remembering in 10 years\". You curate by topic and value; no algorithm decides your feed.",
  "about.shortGlossaryMemoirDesc":
    "One saved item — title plus a link, video or note.",
  "about.shortGlossaryAnthologyDesc":
    "A collection of memoirs about a topic.",
  "about.shortGlossaryMemoryDesc": "All of your anthologies together.",
  "about.shortHowTitle": "How it works (100% static)",
  "about.shortHowNoServer":
    "No server, no tracking — everything runs in your browser, and social tracking IDs (?si=, ?igsh=) are stripped automatically.",
  "about.shortHowLocal":
    "Private Memory: lives on your device, works offline, exports anytime.",
  "about.shortHowChain":
    "Public Memory: optional on-chain publishing. Connect a wallet to deploy your own Anthology contract on Arbitrum through the Factory contract — only your wallet controls its title, memoirs, price, whitelist and moderation buffer.",

  /* -------------------------------- Language -------------------------------- */
  "language.title": "Language",
  "language.auto": "Auto (System)",
  "language.english": "English",
  "language.spanish": "Español",

  /* -------------------------------- Settings -------------------------------- */
  "settings.downloadData": "Download your Data",
  "settings.downloadDataTitle": "Download Your Data",
  "settings.myDiscoveries": "My Discoveries",
  "settings.localAnthologies": "Local Anthologies",
  "settings.customSelection": "Custom Selection",
  "settings.customFileName": "Custom File Name",
  "settings.enterFileName": "Enter file name",
  "settings.download": "💾 Download",
  "settings.selectAnthologies": "Select Anthologies →",
  "settings.fileNameRequired": "File name required",
  "settings.fileNameRequiredDesc":
    "Please enter a file name for the download.",
  "settings.noOptionsSelected": "No options selected",
  "settings.selectOneDownload":
    "Please select at least one option to download.",
  "settings.selectAnthologiesTitle": "Select Anthologies",
  "settings.selectAll": "Select All",
  "settings.deselectAll": "Deselect All",
  "settings.noAnthologies": "No anthologies available",
  "settings.selectedCount": "{count} selected",
  "settings.downloadCount": "Download ({count})",

  /* --------------------------------- Storage -------------------------------- */
  "storage.viewUsage": "View app storage usage",
  "storage.title": "Storage",
  "storage.totalUsed": "Total used by the app",
  "storage.memory": "Memory (Anthologies)",
  "storage.cachedFiles": "Cached thumbnails and files",
  "storage.appData": "App data (wallet and others)",
  "storage.nA": "n/a",

  /* ------------------------------- Clear cache ------------------------------ */
  "cache.clearTrigger": "Clear cached files",
  "cache.clearTitle": "Clear cached files?",
  "cache.clearDesc":
    "Removes cached images, thumbnails and cached pages. Your memoirs and settings are not affected.",
  "cache.clearing": "Clearing...",
  "cache.clearFiles": "Clear files",
  "cache.clearedTitle": "Cached files cleared",
  "cache.clearedDesc":
    "Images and cached pages were removed. Your data was not touched.",

  /* ------------------------------ Delete memory ----------------------------- */
  "clean.deleteMemory": "Delete Memory",
  "clean.deleteTitle": "Delete private memory",
  "clean.allAnthologies": "All anthologies",
  "clean.cannotUndo": "This action cannot be undone.",
  "clean.deletedTitle": "Memory deleted",
  "clean.deletedDesc":
    "The memory has been deleted, reloading in 3 seconds...",

  /* --------------------------------- Load JSON ------------------------------ */
  "load.trigger": "Load JSON",
  "load.found": "Found:",
  "load.discoveries": "Discoveries",
  "load.localMemory": "Local Memory",
  "load.invalid": "⚠️ JSON file is not valid.",
  "load.upload": "Upload a .json file",
  "load.button": "Load JSON",
  "load.addToMemory": "Add to my memory",
  "load.anthologyAdded": "Anthology added to your memory",
  "load.discoverPart": "Discover",
  "load.memoryPart": "Private Memory",
  "load.addedToMemory": "Added to your memory",
  "load.noOptions": "No options selected",
  "load.selectOne": "Please select at least one option to import.",

  /* ----------------------------- Icon path switcher ------------------------- */
  "iconPath.trigger": "Icon Path Switcher",
  "iconPath.title": "Icon Path Switcher",
  "iconPath.local": "Local User Anthologies",
  "iconPath.web3": "Web3 Anthologies",
  "iconPath.changedTitle": "Icon path changed",
  "iconPath.changedLocal": "Now pointing to local anthologies",
  "iconPath.changedWeb3": "Now pointing to on-chain anthologies",

  /* ---------------------------- Network settings ---------------------------- */
  "network.trigger": "Network Settings",
  "network.setRpc": "Set new RPC",
  "network.updateRpc": "Update RPC",
  "network.changed": "RPC changed to:",
  "network.defaultRpc": "default RPC",
  "network.errorTitle": "Error changing RPC",
  "network.errorDesc": "Invalid RPC URL",

  /* --------------------------------- Install -------------------------------- */
  "install.label": "Install App: ",

  /* ------------------------------- Backgrounds ------------------------------ */
  "backgrounds.toggle": "Category Backgrounds",

  /* ---------------------------------- Wallet -------------------------------- */
  "wallet.disconnect": "Disconnect wallet",

  /* -------------------------------- Directory ------------------------------- */
  "directory.searchAll": "Search all memoirs...",
  "directory.local": "LOCAL",
  "discover.noAnthologies": "You have not discovered any Anthologies",
  "discover.notFound": "Anthologies not found",
  "discover.notWhitelisted": "Your address is not whitelisted",

  /* -------------------------------- Discover -------------------------------- */
  "discover.title": "Discover",
  "discover.addrPlaceholder": "Anthology/User Addr",
  "discover.invalidQr": "Invalid QR Code",
  "discover.invalidQrDesc": "Please scan a valid QR Code.",
  "discover.invalidUser": "Invalid User Address",
  "discover.invalidAnthology": "Invalid Anthology Address",
  "discover.scanValid": "Please scan a valid {type} address.",
  "discover.userType": "user",
  "discover.anthologyType": "anthology",
  "discover.enterAddress": "Enter address",
  "discover.enterValid": "Please enter a valid address",
  "discover.userAlready": "User already in directory",
  "discover.userAlreadyDesc": "User: {address} is already in the directory.",
  "discover.userFound": "User found",
  "discover.userFoundDesc": "User {address} has been added successfully.",
  "discover.userNotFound": "User not found",
  "discover.userNotFoundDesc": "No user found with address {address}.",
  "discover.anthologyAlready": "Anthology already in directory",
  "discover.anthologyAlreadyDesc":
    "Anthology: {address} is already in the directory.",
  "discover.anthologyFound": "Anthology found",
  "discover.anthologyFoundDesc":
    "Anthology {address} has been added successfully.",
  "discover.anthologyNotFound": "Anthology not found",
  "discover.anthologyNotFoundDesc":
    "No anthology found with address {address}.",
  "discover.unknownQrType": "Unknown QR Code Type",
  "discover.unknownQrTypeDesc": "The scanned QR Code is not recognized.",

  /* --------------------------------- Deploy --------------------------------- */
  "deploy.newAnthology": "New Anthology",
  "deploy.addPrivate": "Add Private Anthology",
  "deploy.addPublic": "Add Public Anthology",
  "deploy.created": "New Anthology was created",

  /* ------------------------------- Title editor ----------------------------- */
  "title.category": "Category (Optional)",
  "title.subcategory": "Subcategory (Optional)",
  "title.title": "Title",
  "title.categoryPlaceholder": "e.g. Art, Music, Tech...",
  "title.subcategoryPlaceholder": "e.g. Paintings, 80s...",
  "title.enterCategoryFirst": "Enter a category first",
  "title.titlePlaceholder": "My Anthology",
  "title.structure": "Structure",
  "title.noStructure": "No structure to show",

  /* ------------------------------ Anthology info ---------------------------- */
  "anthology.info": "Anthology Info",
  "anthology.show": "Show Anthology",

  /* ----------------------------- Anthology state ---------------------------- */
  "anthologyState.address": "Anthology Address",
  "anthologyState.shareQr": "Share QR Code",
  "anthologyState.shareLink": "Share Link",
  "anthologyState.saveToLocal": "Save to Private Memory",
  "anthologyState.owner": "Owner",
  "anthologyState.title": "Title",
  "anthologyState.memoirCount": "Memoirs count",
  "anthologyState.totalCreated": "Total created",
  "anthologyState.maxMemoirs": "Max memoirs",
  "anthologyState.price": "Price per memoir",
  "anthologyState.tokenPayment": "Token payment",
  "anthologyState.tokenAddress": "Token Address",
  "anthologyState.buffer": "Moderation buffer",
  "anthologyState.whitelistOnly": "Whitelist only",
  "anthologyState.defaultSkin": "Default Skin",
  "anthologyState.linkCopied": "Link copied",
  "anthologyState.linkCopiedDesc":
    "Shareable anthology link copied to clipboard.",
  "anthologyState.clonedTitle": "Saved to Private Memory",
  "anthologyState.clonedDesc": "{title} ({count} memoirs) saved offline.",
  "anthologyState.clonedFallback": "Cloned Anthology",

  /* --------------------------- Local anthology state ------------------------ */
  "localState.maxMemoirs": "Max memoirs",
  "localState.download": "Download Anthology",
  "localState.delete": "Delete Anthology",
  "localState.deleteTitle": "Delete this anthology?",
  "localState.deleteDesc":
    "All its memoirs will be deleted too. This action cannot be undone.",
  "localState.deletedTitle": "Anthology deleted",
  "localState.deletedDesc":
    "The anthology and all its memoirs were deleted.",

  /* ------------------------------ Anthology owner --------------------------- */
  "owner.settingsTitle": "Anthology Settings",
  "owner.changeTitle": "Change title",
  "owner.setNewTitle": "Set New Title",
  "owner.newTitleToast": "New title:",
  "owner.errorTitle": "Error setting new title",
  "owner.deleteAllMemoirs": "Delete all memoirs",
  "owner.deleteAllTitle": "Delete all memoirs in this anthology?",
  "owner.deleteAllDesc":
    "All {count} memoirs in {title} will be deleted. The anthology itself will remain. This action cannot be undone.",
  "owner.memoirsDeleted": "Memoirs deleted",
  "owner.memoirsDeletedDesc":
    "All memoirs in this anthology were deleted.",
  "owner.price": "Price per memoir",
  "owner.priceSet": "New price:",
  "owner.errorPrice": "Error setting new price",
  "owner.maxMemoirs": "Max memoirs allowed",
  "owner.maxPlaceholder": "Max memoirs",
  "owner.maxSet": "New max number of memoirs:",
  "owner.errorMax": "Error setting max memoirs",
  "owner.paymentMethod": "Payment method",
  "owner.switchToEth": "Switch to ETH payment",
  "owner.switchToToken": "Switch to Token (ERC20) payment",
  "owner.paymentChanged": "Payment method changed to:",
  "owner.errorPayment": "Error updating payment method",
  "owner.tokenPlaceholder": "Token contract address (0x...)",
  "owner.setToken": "Set Token",
  "owner.tokenSet": "Token address set to:",
  "owner.errorToken": "Error setting token address",
  "owner.whitelist": "Whitelist",
  "owner.enableWhitelist": "Enable whitelist",
  "owner.disableWhitelist": "Disable whitelist",
  "owner.whitelistChanged": "Whitelist has been:",
  "owner.whitelistActivated": "Activated",
  "owner.whitelistDisabled": "Disabled",
  "owner.errorWhitelist": "Error updating whitelist",
  "owner.addressAllow": "Address to allow (0x...)",
  "owner.addressRemove": "Address to remove (0x...)",
  "owner.addedToWhitelist": "Address added to whitelist",
  "owner.errorAddWL": "Error adding to whitelist",
  "owner.removedFromWhitelist": "Address removed from whitelist",
  "owner.errorRemoveWL": "Error removing from whitelist",
  "owner.buffer": "Moderation buffer",
  "owner.enableBuffer": "Enable moderation buffer",
  "owner.disableBuffer": "Disable moderation buffer",
  "owner.bufferChanged": "Buffer has been:",
  "owner.bufferActivated": "Activated",
  "owner.bufferDisabled": "Disabled",
  "owner.errorBuffer": "Error updating buffer status",
  "owner.dangerZone": "Danger Zone",
  "owner.clearBuffer": "Clear buffer",
  "owner.clearWhitelist": "Clear whitelist",
  "owner.confirmClearBuffer":
    "Clear all pending memoirs in the moderation buffer?",
  "owner.confirmClearWhitelist":
    "Remove all addresses from the whitelist?",
  "owner.confirmDeleteAllBody":
    "This will send a blockchain transaction to delete all memoirs in {title}. This action cannot be undone.",
  "owner.confirmClearBufferBody":
    "This will send a blockchain transaction to clear the moderation buffer in {title}. This action cannot be undone.",
  "owner.confirmClearWhitelistBody":
    "This will send a blockchain transaction to remove all addresses from the whitelist in {title}. This action cannot be undone.",
  "owner.cleaningMemoirs": "Cleaning memoirs",
  "owner.cleaningBuffer": "Cleaning memoir buffer",
  "owner.cleaningWhitelist": "Cleaning whitelist",
  "owner.errorCleaning": "Error cleaning {target}",
  "owner.thisAnthology": "this anthology",

  /* -------------------------------- Skin change ----------------------------- */
  "skin.default": "Default Skin:",
  "skin.changedTitle": "Default skin changed to",
  "skin.errorChanged": "Error setting new default skin",

  /* ------------------------------- Skin selector ---------------------------- */
  "skin.media": "Media",
  "skin.text": "Text",
  "skin.json": "JSON",
  "skin.list": "List",
  "skin.playlist": "Playlist",

  /* ------------------------------ Order selector ---------------------------- */
  "order.newer": "Newer",
  "order.older": "Older",
  "order.random": "Random",
  "order.az": "A → Z",
  "order.za": "Z → A",

  /* ----------------------------- Contract selector -------------------------- */
  "selector.user": "User:",
  "selector.localUser": "Local User",
  "selector.category": "Category:",
  "selector.subcategory": "Subcategory:",
  "selector.noSubcategory": "No subcategory",
  "selector.anthologyAddress": "Anthology Address:",
  "selector.selectCategory": "Select Category",
  "selector.untitled": "Untitled",

  /* ---------------------------------- Memoir -------------------------------- */
  "memoir.title": "Title",
  "memoir.content": "Content",
  "memoir.enterTitle": "Enter title",
  "memoir.addMemoir": "Add Memoir",
  "memoir.added": "Memoir Added",
  "memoir.addedLocalDesc":
    "Memoir added locally, not on blockchain yet",
  "memoir.removeTracking": "Remove Tracking from URL",
  "memoir.editTitle": "Edit Memoir",
  "memoir.saveChanges": "Save Changes",
  "memoir.updated": "Memoir updated",
  "memoir.updatedDesc": "Your changes were saved locally",
  "memoir.autoFill": "Auto-fill title",
  "memoir.fetching": "Fetching...",
  "memoir.titleNotFound": "Title not found",
  "memoir.titleNotFoundDesc":
    "Could not fetch a title for this link.",
  "memoir.duplicateTitleErr":
    "A memoir with this title already exists in this anthology",
  "memoir.duplicateUrlErr": "This URL already exists in this anthology",
  "memoir.urlInOtherWarning": "This URL exists in another anthology",
  "memoir.cannotAdd": "Cannot add memoir",
  "memoir.cannotSave": "Cannot save memoir",
  "memoir.shareTitle": "Share memoir",
  "memoir.deleteTitle": "Delete memoir",
  "memoir.shareOn": "Share on {name}",
  "memoir.copyTitle": "Copy memoir",
  "memoir.copied": "Copied to clipboard",
  "memoir.copiedDesc": "The memoir was copied to your clipboard",
  "memoir.copyFailed": "Copy failed",
  "memoir.copyFailedDesc": "Could not access the clipboard",
  "memoir.defaultShareTitle": "Anthology memoir",

  /* ------------------------------ Move / copy ------------------------------- */
  "move.title": "Copy / Move Memoir",
  "move.copyTo": "Copy to",
  "move.moveTo": "Move to",
  "move.move": "Move Memoir",
  "move.copy": "Copy Memoir",
  "move.saving": "Saving...",
  "move.pickDifferent": "Pick a different anthology",
  "move.pickDifferentDesc": "The destination is the current anthology.",
  "move.connectWallet": "Connect your wallet",
  "move.connectWalletDesc":
    "A blockchain destination needs a connected wallet.",
  "move.notWhitelisted": "Not whitelisted",
  "move.notWhitelistedDesc":
    "You are not whitelisted in the destination anthology.",
  "move.moved": "Memoir moved",
  "move.copied": "Memoir copied",
  "move.savedLocal": "Saved to the selected local anthology",
  "move.savedChain": "Saved to the selected blockchain anthology",
  "move.errorTitle": "Something went wrong",
  "move.errorDesc": "The memoir could not be copied or moved.",
  "move.txNotSent": "The transaction was not sent.",

  /* ------------------------------ Delete memoir ----------------------------- */
  "delete.confirmTitle": "Are you sure you want to delete:",
  "delete.yesDelete": "YES, DELETE",
  "delete.cannotUndo": "This action cannot be undone.",
  "delete.deleted": "Memoir deleted",
  "delete.errorTitle": "Error deleting memoir",

  /* -------------------------------- Memoirs --------------------------------- */
  "memoirs.searchPlaceholder":
    "Search memoirs by title or content...",
  "memoirs.none": "No memoirs available.",
  "memoirs.titleLabel": "Title:",
  "memoirs.contentLabel": "Content:",
  "memoirs.sentBy": "Sent by:",
  "memoirs.whenAdded": "When added:",
  "memoirs.decline": "Decline memoir",
  "memoir.accept": "Accept memoir",
  "memoirs.playlistNotFound": "Youtube videos not found",
  "memoirs.loadMore": "Load more",
  "memoirs.loadingMore": "Loading more memoirs...",
  "memoirs.showingCount": "Showing {loaded} of {total} memoirs",
  "memoirs.allLoaded": "All {total} memoirs loaded",

  /* --------------------------------- Search --------------------------------- */
  "search.result": "result",
  "search.results": "results",
  "search.noMatch": "No memoirs match \"{term}\".",
  "search.local": "Local",
  "search.blockchain": "Blockchain",
} as const;

export type TranslationKey = keyof typeof en;

export const es: Record<TranslationKey, string> = {
  /* --------------------------------- Common -------------------------------- */
  "common.cancel": "Cancelar",
  "common.confirm": "Confirmar",
  "common.save": "Guardar",
  "common.change": "Cambiar",
  "common.add": "Añadir",
  "common.remove": "Quitar",
  "common.back": "← Atrás",
  "common.loading": "Cargando...",
  "common.enabled": "Activado",
  "common.disabled": "Desactivado",
  "common.untitled": "Sin título",
  "common.other": "Otros",
  "common.unknownError": "Error desconocido",

  /* ------------------------------ Accessibility ---------------------------- */
  "a11y.skipToMain": "Saltar al contenido principal",
  "a11y.sidePanel": "Abrir menú",
  "a11y.addMemoir": "Añadir memoir",
  "a11y.skinSelector": "Vista",
  "a11y.orderSelector": "Orden",
  "a11y.searchType": "Tipo de búsqueda",
  "a11y.searchMemoirs": "Buscar memoirs",
  "a11y.playVideo": "Reproducir video",
  "a11y.playSpotify": "Reproducir en Spotify",
  "a11y.qrCode": "Mostrar código QR",
  "a11y.scanQr": "Escanear código QR",
  "a11y.syncAnthologies": "Actualizar antologías",
  "a11y.checkAddress": "Verificar dirección",
  "a11y.connectorLogo": "Opción de conexión de billetera",

  /* ------------------------------ Navigation ------------------------------- */
  "nav.myAnthologies": "Mis antologías",
  "nav.discover": "Explorar",
  "nav.privateMemory": "Memoria privada",
  "nav.about": "Acerca de",
  "nav.factoryInfo": "Info de fábrica",
  "nav.settings": "Ajustes",

  /* --------------------------------- Footer -------------------------------- */
  "footer.tagline": "Registrando la memoria colectiva.",

  /* -------------------------------- NotFound -------------------------------- */
  "notFound.subtitle": "Página no encontrada",
  "notFound.message":
    "Esta ruta no existe. Quizá escribiste mal la URL, o quizá el enlace está roto.",
  "notFound.back": "← Volver al inicio",
  "notFound.quote":
    "«La locura es algo raro en los individuos, pero en los grupos, partidos, pueblos y épocas es la regla.»",

  /* ---------------------------------- About --------------------------------- */
  "about.intro":
    "Anthology es un lugar local-first para guardar lo que quieres recordar — notas, enlaces, videos, ideas — organizado en colecciones. Todo funciona sin conexión y publicar en la blockchain es opcional.",

  "about.whyTitle": "¿Por qué la memoria?",
  "about.whyIntro":
    "Toda historia tiene más de un lado, y cada pieza de información pasa por el lente de alguien. Antes de internet, los medios estaban centralizados — radio, TV, periódicos — así que incluso con sesgo editorial, la mayoría compartía una base común y podía contrastar fuentes. Hoy la información está fragmentada: ves sobre todo lo que ya clickeas, y si un tema nunca cruza tu feed, un algoritmo decide en silencio qué crees sobre él.",
  "about.whyPerson":
    "Alguien puede ser brillante en una cosa concreta — un historiador que documenta fuentes, un investigador que explica su campo — mientras que sus opiniones sobre todo lo demás importan poco. Anthology organiza el conocimiento por tema y por valor, no idolatrando personas.",
  "about.whyForget":
    "La memoria humana olvida. Los nombres se desvanecen, la comida de ayer desaparece y las clases de la universidad se vuelven nociones vagas — solo quedan las ideas y sentimientos centrales. Además, la gente suele buscar información después de necesitarla, no cuando se la topa.",
  "about.whyFilter":
    "Anthology es un filtro para esos momentos en que algo nuevo aparece durante la \"procrastinación productiva\" — historia, geopolítica, música, cine, arte, tecnología — y surge uno de estos pensamientos:",
  "about.whyFilter1": "Esto debería saberlo todo el mundo.",
  "about.whyFilter2": "¿Por qué esto no es conocimiento público?",
  "about.whyFilter3": "Quiero recordar esto en 5 o 10 años.",
  "about.whyIdeasTitle": "Lo que permite una memoria curada",
  "about.whyIdeas1Title": "Alguien ya lo dijo",
  "about.whyIdeas1":
    "En lugar de reconstruir un argumento desde cero, apunta directo al memoir — un clip, un artículo, una cita — donde alguien ya lo dijo mejor.",
  "about.whyIdeas2Title": "Cadenas de preguntas",
  "about.whyIdeas2":
    "La gente no sabe lo que no sabe, y desconfía de los desconocidos. Una cadena curada de memoirs y preguntas permite recorrer un tema paso a paso y llegar a las propias conclusiones.",
  "about.whyIdeas3Title": "Madrigueras curadas por personas",
  "about.whyIdeas3":
    "En vez de que un algoritmo corporativo opaco decida el feed, una antología es una lista transparente de videos, posts y notas sobre un tema — curada por una persona con interés genuino en él.",

  "about.glossaryTitle": "Glosario",
  "about.glossaryMemoir": "Memoir",
  "about.glossaryMemoirDesc":
    "Una pieza de información — título y contenido (una nota, enlace, video o post) — guardada dentro de una antología.",
  "about.glossaryAnthology": "Antología",
  "about.glossaryAnthologyDesc":
    "Una colección de memoirs sobre un tema. Puede vivir en privado en tu navegador o como un contrato inteligente independiente en la blockchain.",
  "about.glossaryMemory": "Memoria",
  "about.glossaryMemoryDesc": "Todas tus antologías juntas.",

  "about.staticTitle": "100% estático — qué corre dónde",
  "about.staticNoBackend":
    "memory.inbytes.xyz es una web app 100% estática. No hay servidor backend, ni base de datos de usuarios, ni rastreo — la app corre por completo en tu navegador.",
  "about.staticLocal":
    "Memoria privada (local): todo lo que guardas vive en tu navegador, en tu dispositivo. Funciona sin conexión, nunca sale del dispositivo y puedes exportarla como archivo cuando quieras.",
  "about.staticChain":
    "Memoria pública (on-chain): con una billetera conectada, el navegador habla directamente con la blockchain de Arbitrum a través de un endpoint RPC — configurable en Ajustes. Las antologías publicadas se comparten como enlaces o códigos QR: escanea uno en otro dispositivo y se abre al instante.",
  "about.staticCleanLinks":
    "Enlaces limpios: las plataformas sociales adjuntan identificadores de rastreo (?si=..., ?igsh=...) a los enlaces compartidos. Anthology los resalta y los quita automáticamente cuando guardas un memoir.",

  "about.walletTitle": "Billeteras y contratos inteligentes",
  "about.walletIdentity":
    "Las apps Web3 no usan contraseñas guardadas en un servidor. Una billetera guarda una clave privada que solo tú controlas y una dirección pública (0x...) derivada con criptografía secp256k1 — la misma dirección te identifica en Ethereum, Arbitrum y cualquier cadena EVM. Como no existe una autoridad central, solo tú eres responsable de tus claves.",
  "about.walletContracts":
    "Una blockchain como Ethereum es una computadora pública compartida (la EVM). Los contratos inteligentes son programas desplegados en ella: descentralizados (ninguna empresa los ejecuta), transparentes (el código y el estado son públicos) e inmutables (las reglas no pueden cambiarse en secreto tras el despliegue).",

  "about.contractsTitle": "Los dos contratos inteligentes detrás de Anthology",
  "about.factoryTitle": "El contrato Factory",
  "about.factoryDesc":
    "El contrato directorio que despliega nuevas antologías on-chain. Su administrador puede gestionar la lista blanca de creadores, pausar nuevos despliegues y fijar una comisión de despliegue (ETH o ERC20) — pero no puede editar, congelar ni borrar ninguna antología ya creada. Consulta su estado actual en /info.",
  "about.anthologyTitle": "Tu contrato de antología",
  "about.anthologyDesc":
    "Desplegar a través de la Factory crea un contrato inteligente propio, con tu billetera como dueña. Solo tú puedes cambiar su título o vista predeterminada, añadir o borrar memoirs, fijar un precio por contribución (anti-spam), gestionar la lista blanca de colaboradores o activar el búfer de moderación — donde los memoirs enviados esperan a que los aceptes o rechaces. Consulta su estado en \"Info Antología\".",

  "about.showFull": "Leer versión completa",
  "about.showShort": "Leer versión corta",
  "about.onboarding": "Onboarding",
  "about.onboardingIframeTitle": "Guía de onboarding de Anthology",
  "about.shortTitle": "¿Qué es Anthology?",
  "about.shortIntro":
    "Un filtro local-first para lo que vale la pena recordar: notas, enlaces, videos e ideas — guardado en el momento en que algo te hace pensar «esto debería saberlo todo el mundo» o «vale la pena recordarlo en 10 años». Tú curas por tema y valor; ningún algoritmo decide tu feed.",
  "about.shortGlossaryMemoirDesc":
    "Una pieza guardada — título más un enlace, video o nota.",
  "about.shortGlossaryAnthologyDesc":
    "Una colección de memoirs sobre un tema.",
  "about.shortGlossaryMemoryDesc": "Todas tus antologías juntas.",
  "about.shortHowTitle": "Cómo funciona (100% estático)",
  "about.shortHowNoServer":
    "Sin servidor ni rastreo — todo corre en tu navegador, y los identificadores de rastreo social (?si=, ?igsh=) se quitan automáticamente.",
  "about.shortHowLocal":
    "Memoria privada: vive en tu dispositivo, funciona sin conexión y se exporta cuando quieras.",
  "about.shortHowChain":
    "Memoria pública: publicación on-chain opcional. Conecta una billetera para desplegar tu propio contrato de Antología en Arbitrum mediante el contrato Factory — solo tu billetera controla su título, memoirs, precio, lista blanca y búfer de moderación.",

  /* -------------------------------- Language -------------------------------- */
  "language.title": "Idioma",
  "language.auto": "Automático (sistema)",
  "language.english": "English",
  "language.spanish": "Español",

  /* -------------------------------- Settings -------------------------------- */
  "settings.downloadData": "Descargar tus datos",
  "settings.downloadDataTitle": "Descargar tus datos",
  "settings.myDiscoveries": "Mis descubrimientos",
  "settings.localAnthologies": "Antologías locales",
  "settings.customSelection": "Selección personalizada",
  "settings.customFileName": "Nombre de archivo personalizado",
  "settings.enterFileName": "Escribe un nombre de archivo",
  "settings.download": "💾 Descargar",
  "settings.selectAnthologies": "Seleccionar antologías →",
  "settings.fileNameRequired": "Nombre de archivo requerido",
  "settings.fileNameRequiredDesc":
    "Escribe un nombre para el archivo que vas a descargar.",
  "settings.noOptionsSelected": "No hay opciones seleccionadas",
  "settings.selectOneDownload":
    "Selecciona al menos una opción para descargar.",
  "settings.selectAnthologiesTitle": "Seleccionar antologías",
  "settings.selectAll": "Seleccionar todo",
  "settings.deselectAll": "Quitar todo",
  "settings.noAnthologies": "No hay antologías disponibles",
  "settings.selectedCount": "{count} seleccionadas",
  "settings.downloadCount": "Descargar ({count})",

  /* --------------------------------- Storage -------------------------------- */
  "storage.viewUsage": "Ver uso de almacenamiento",
  "storage.title": "Almacenamiento",
  "storage.totalUsed": "Total usado por la app",
  "storage.memory": "Memoria (antologías)",
  "storage.cachedFiles": "Miniaturas y archivos en caché",
  "storage.appData": "Datos de la app (billetera y otros)",
  "storage.nA": "n/d",

  /* ------------------------------- Clear cache ------------------------------ */
  "cache.clearTrigger": "Borrar archivos en caché",
  "cache.clearTitle": "¿Borrar archivos en caché?",
  "cache.clearDesc":
    "Elimina imágenes, miniaturas y páginas en caché. Tus memoirs y ajustes no se ven afectados.",
  "cache.clearing": "Borrando...",
  "cache.clearFiles": "Borrar archivos",
  "cache.clearedTitle": "Archivos en caché borrados",
  "cache.clearedDesc":
    "Se eliminaron imágenes y páginas en caché. Tus datos no se tocaron.",

  /* ------------------------------ Delete memory ----------------------------- */
  "clean.deleteMemory": "Borrar memoria",
  "clean.deleteTitle": "Borrar memoria privada",
  "clean.allAnthologies": "Todas las antologías",
  "clean.cannotUndo": "Esta acción no se puede deshacer.",
  "clean.deletedTitle": "Memoria borrada",
  "clean.deletedDesc":
    "La memoria fue borrada; recargando en 3 segundos...",

  /* --------------------------------- Load JSON ------------------------------ */
  "load.trigger": "Cargar JSON",
  "load.found": "Encontrado:",
  "load.discoveries": "Descubrimientos",
  "load.localMemory": "Memoria local",
  "load.invalid": "⚠️ El archivo JSON no es válido.",
  "load.upload": "Sube un archivo .json",
  "load.button": "Cargar JSON",
  "load.addToMemory": "Añadir a mi memoria",
  "load.anthologyAdded": "Antología añadida a tu memoria",
  "load.discoverPart": "Explorar",
  "load.memoryPart": "Memoria privada",
  "load.addedToMemory": "Añadido a tu memoria",
  "load.noOptions": "No hay opciones seleccionadas",
  "load.selectOne": "Selecciona al menos una opción para importar.",

  /* ----------------------------- Icon path switcher ------------------------- */
  "iconPath.trigger": "Selector de ruta del ícono",
  "iconPath.title": "Selector de ruta del ícono",
  "iconPath.local": "Antologías locales",
  "iconPath.web3": "Antologías Web3",
  "iconPath.changedTitle": "Ruta del ícono cambiada",
  "iconPath.changedLocal": "Ahora apunta a las antologías locales",
  "iconPath.changedWeb3": "Ahora apunta a las antologías en la blockchain",

  /* ---------------------------- Network settings ---------------------------- */
  "network.trigger": "Ajustes de red",
  "network.setRpc": "Establecer nuevo RPC",
  "network.updateRpc": "Actualizar RPC",
  "network.changed": "RPC cambiado a:",
  "network.defaultRpc": "RPC predeterminado",
  "network.errorTitle": "Error al cambiar el RPC",
  "network.errorDesc": "URL de RPC no válida",

  /* --------------------------------- Install -------------------------------- */
  "install.label": "Instalar app: ",

  /* ------------------------------- Backgrounds ------------------------------ */
  "backgrounds.toggle": "Fondos de categoría",

  /* ---------------------------------- Wallet -------------------------------- */
  "wallet.disconnect": "Desconectar billetera",

  /* -------------------------------- Directory ------------------------------- */
  "directory.searchAll": "Buscar en todos los memoirs...",
  "directory.local": "LOCAL",
  "discover.noAnthologies": "Aún no has descubierto antologías",
  "discover.notFound": "No se encontraron antologías",
  "discover.notWhitelisted": "Tu dirección no está en la lista blanca",

  /* -------------------------------- Discover -------------------------------- */
  "discover.title": "Explorar",
  "discover.addrPlaceholder": "Dirección de antología/usuario",
  "discover.invalidQr": "Código QR no válido",
  "discover.invalidQrDesc": "Escanea un código QR válido.",
  "discover.invalidUser": "Dirección de usuario no válida",
  "discover.invalidAnthology": "Dirección de antología no válida",
  "discover.scanValid": "Escanea una dirección de {type} válida.",
  "discover.userType": "usuario",
  "discover.anthologyType": "antología",
  "discover.enterAddress": "Escribe una dirección",
  "discover.enterValid": "Escribe una dirección válida",
  "discover.userAlready": "El usuario ya está en el directorio",
  "discover.userAlreadyDesc":
    "El usuario {address} ya está en el directorio.",
  "discover.userFound": "Usuario encontrado",
  "discover.userFoundDesc": "El usuario {address} se añadió correctamente.",
  "discover.userNotFound": "Usuario no encontrado",
  "discover.userNotFoundDesc":
    "No se encontró ningún usuario con la dirección {address}.",
  "discover.anthologyAlready": "La antología ya está en el directorio",
  "discover.anthologyAlreadyDesc":
    "La antología {address} ya está en el directorio.",
  "discover.anthologyFound": "Antología encontrada",
  "discover.anthologyFoundDesc":
    "La antología {address} se añadió correctamente.",
  "discover.anthologyNotFound": "Antología no encontrada",
  "discover.anthologyNotFoundDesc":
    "No se encontró ninguna antología con la dirección {address}.",
  "discover.unknownQrType": "Tipo de código QR desconocido",
  "discover.unknownQrTypeDesc": "El código QR escaneado no se reconoce.",

  /* --------------------------------- Deploy --------------------------------- */
  "deploy.newAnthology": "Nueva antología",
  "deploy.addPrivate": "Añadir antología privada",
  "deploy.addPublic": "Añadir antología pública",
  "deploy.created": "Se creó una nueva antología",

  /* ------------------------------- Title editor ----------------------------- */
  "title.category": "Categoría (opcional)",
  "title.subcategory": "Subcategoría (opcional)",
  "title.title": "Título",
  "title.categoryPlaceholder": "p. ej. Arte, Música, Tecnología...",
  "title.subcategoryPlaceholder": "p. ej. Pinturas, Años 80...",
  "title.enterCategoryFirst": "Primero escribe una categoría",
  "title.titlePlaceholder": "Mi antología",
  "title.structure": "Estructura",
  "title.noStructure": "Aún no hay estructura que mostrar",

  /* ------------------------------ Anthology info ---------------------------- */
  "anthology.info": "Info Antología",
  "anthology.show": "Ver Antología",

  /* ----------------------------- Anthology state ---------------------------- */
  "anthologyState.address": "Dirección de la antología",
  "anthologyState.shareQr": "Código QR para compartir",
  "anthologyState.shareLink": "Enlace para compartir",
  "anthologyState.saveToLocal": "Guardar en memoria privada",
  "anthologyState.owner": "Propietario",
  "anthologyState.title": "Título",
  "anthologyState.memoirCount": "Cantidad de memoirs",
  "anthologyState.totalCreated": "Total creados",
  "anthologyState.maxMemoirs": "Máximo de memoirs",
  "anthologyState.price": "Precio por memoir",
  "anthologyState.tokenPayment": "Pago con token",
  "anthologyState.tokenAddress": "Dirección del token",
  "anthologyState.buffer": "Búfer de moderación",
  "anthologyState.whitelistOnly": "Solo lista blanca",
  "anthologyState.defaultSkin": "Vista predeterminada",
  "anthologyState.linkCopied": "Enlace copiado",
  "anthologyState.linkCopiedDesc":
    "El enlace para compartir se copió al portapapeles.",
  "anthologyState.clonedTitle": "Guardado en memoria privada",
  "anthologyState.clonedDesc":
    "{title} ({count} memoirs) se guardó sin conexión.",
  "anthologyState.clonedFallback": "Antología clonada",

  /* --------------------------- Local anthology state ------------------------ */
  "localState.maxMemoirs": "Máximo de memoirs",
  "localState.download": "Descargar antología",
  "localState.delete": "Borrar antología",
  "localState.deleteTitle": "¿Borrar esta antología?",
  "localState.deleteDesc":
    "Todos sus memoirs también se borrarán. Esta acción no se puede deshacer.",
  "localState.deletedTitle": "Antología borrada",
  "localState.deletedDesc":
    "La antología y todos sus memoirs fueron borrados.",

  /* ------------------------------ Anthology owner --------------------------- */
  "owner.settingsTitle": "Ajustes de la antología",
  "owner.changeTitle": "Cambiar título",
  "owner.setNewTitle": "Establecer nuevo título",
  "owner.newTitleToast": "Nuevo título:",
  "owner.errorTitle": "Error al establecer el nuevo título",
  "owner.deleteAllMemoirs": "Borrar todos los memoirs",
  "owner.deleteAllTitle": "¿Borrar todos los memoirs de esta antología?",
  "owner.deleteAllDesc":
    "Se borrarán los {count} memoirs de {title}. La antología se mantendrá. Esta acción no se puede deshacer.",
  "owner.memoirsDeleted": "Memoirs borrados",
  "owner.memoirsDeletedDesc":
    "Todos los memoirs de esta antología fueron borrados.",
  "owner.price": "Precio por memoir",
  "owner.priceSet": "Nuevo precio:",
  "owner.errorPrice": "Error al establecer el nuevo precio",
  "owner.maxMemoirs": "Máximo de memoirs permitidos",
  "owner.maxPlaceholder": "Máximo de memoirs",
  "owner.maxSet": "Nuevo máximo de memoirs:",
  "owner.errorMax": "Error al establecer el máximo de memoirs",
  "owner.paymentMethod": "Método de pago",
  "owner.switchToEth": "Cambiar a pago en ETH",
  "owner.switchToToken": "Cambiar a pago con token (ERC20)",
  "owner.paymentChanged": "Método de pago cambiado a:",
  "owner.errorPayment": "Error al actualizar el método de pago",
  "owner.tokenPlaceholder": "Dirección del contrato del token (0x...)",
  "owner.setToken": "Establecer token",
  "owner.tokenSet": "Dirección del token establecida en:",
  "owner.errorToken": "Error al establecer la dirección del token",
  "owner.whitelist": "Lista blanca",
  "owner.enableWhitelist": "Activar lista blanca",
  "owner.disableWhitelist": "Desactivar lista blanca",
  "owner.whitelistChanged": "La lista blanca ha sido:",
  "owner.whitelistActivated": "activada",
  "owner.whitelistDisabled": "desactivada",
  "owner.errorWhitelist": "Error al actualizar la lista blanca",
  "owner.addressAllow": "Dirección a permitir (0x...)",
  "owner.addressRemove": "Dirección a quitar (0x...)",
  "owner.addedToWhitelist": "Dirección añadida a la lista blanca",
  "owner.errorAddWL": "Error al añadir a la lista blanca",
  "owner.removedFromWhitelist": "Dirección quitada de la lista blanca",
  "owner.errorRemoveWL": "Error al quitar de la lista blanca",
  "owner.buffer": "Búfer de moderación",
  "owner.enableBuffer": "Activar búfer de moderación",
  "owner.disableBuffer": "Desactivar búfer de moderación",
  "owner.bufferChanged": "El búfer ha sido:",
  "owner.bufferActivated": "activado",
  "owner.bufferDisabled": "desactivado",
  "owner.errorBuffer": "Error al actualizar el estado del búfer",
  "owner.dangerZone": "Zona peligrosa",
  "owner.clearBuffer": "Vaciar búfer",
  "owner.clearWhitelist": "Vaciar lista blanca",
  "owner.confirmClearBuffer":
    "¿Vaciar todos los memoirs pendientes en el búfer de moderación?",
  "owner.confirmClearWhitelist":
    "¿Quitar todas las direcciones de la lista blanca?",
  "owner.confirmDeleteAllBody":
    "Esto enviará una transacción a la blockchain para borrar todos los memoirs en {title}. Esta acción no se puede deshacer.",
  "owner.confirmClearBufferBody":
    "Esto enviará una transacción a la blockchain para vaciar el búfer de moderación en {title}. Esta acción no se puede deshacer.",
  "owner.confirmClearWhitelistBody":
    "Esto enviará una transacción a la blockchain para quitar todas las direcciones de la lista blanca en {title}. Esta acción no se puede deshacer.",
  "owner.cleaningMemoirs": "Borrando memoirs",
  "owner.cleaningBuffer": "Vaciando el búfer de memoirs",
  "owner.cleaningWhitelist": "Vaciando la lista blanca",
  "owner.errorCleaning": "Error al vaciar {target}",
  "owner.thisAnthology": "esta antología",

  /* -------------------------------- Skin change ----------------------------- */
  "skin.default": "Vista predeterminada:",
  "skin.changedTitle": "Vista predeterminada cambiada a",
  "skin.errorChanged": "Error al establecer la nueva vista predeterminada",

  /* ------------------------------- Skin selector ---------------------------- */
  "skin.media": "Multimedia",
  "skin.text": "Texto",
  "skin.json": "JSON",
  "skin.list": "Lista",
  "skin.playlist": "Reproducción",

  /* ------------------------------ Order selector ---------------------------- */
  "order.newer": "Recientes",
  "order.older": "Antiguos",
  "order.random": "Aleatorio",
  "order.az": "A → Z",
  "order.za": "Z → A",

  /* ----------------------------- Contract selector -------------------------- */
  "selector.user": "Usuario:",
  "selector.localUser": "Usuario local",
  "selector.category": "Categoría:",
  "selector.subcategory": "Subcategoría:",
  "selector.noSubcategory": "Sin subcategoría",
  "selector.anthologyAddress": "Dirección de la antología:",
  "selector.selectCategory": "Selecciona una categoría",
  "selector.untitled": "Sin título",

  /* ---------------------------------- Memoir -------------------------------- */
  "memoir.title": "Título",
  "memoir.content": "Contenido",
  "memoir.enterTitle": "Escribe un título",
  "memoir.addMemoir": "Añadir memoir",
  "memoir.added": "Memoir añadido",
  "memoir.addedLocalDesc":
    "Memoir añadido localmente, aún no en la blockchain",
  "memoir.removeTracking": "Quitar seguimiento de la URL",
  "memoir.editTitle": "Editar memoir",
  "memoir.saveChanges": "Guardar cambios",
  "memoir.updated": "Memoir actualizado",
  "memoir.updatedDesc": "Tus cambios se guardaron localmente",
  "memoir.autoFill": "Autocompletar título",
  "memoir.fetching": "Obteniendo...",
  "memoir.titleNotFound": "Título no encontrado",
  "memoir.titleNotFoundDesc":
    "No se pudo obtener un título para este enlace.",
  "memoir.duplicateTitleErr":
    "Ya existe un memoir con este título en esta antología",
  "memoir.duplicateUrlErr": "Esta URL ya existe en esta antología",
  "memoir.urlInOtherWarning": "Esta URL existe en otra antología",
  "memoir.cannotAdd": "No se puede añadir el memoir",
  "memoir.cannotSave": "No se puede guardar el memoir",
  "memoir.shareTitle": "Compartir memoir",
  "memoir.deleteTitle": "Borrar memoir",
  "memoir.shareOn": "Compartir en {name}",
  "memoir.copyTitle": "Copiar memoir",
  "memoir.copied": "Copiado al portapapeles",
  "memoir.copiedDesc": "El memoir se copió al portapapeles",
  "memoir.copyFailed": "Error al copiar",
  "memoir.copyFailedDesc": "No se pudo acceder al portapapeles",
  "memoir.defaultShareTitle": "Memoir de Anthology",

  /* ------------------------------ Move / copy ------------------------------- */
  "move.title": "Copiar / Mover memoir",
  "move.copyTo": "Copiar a",
  "move.moveTo": "Mover a",
  "move.move": "Mover memoir",
  "move.copy": "Copiar memoir",
  "move.saving": "Guardando...",
  "move.pickDifferent": "Elige otra antología",
  "move.pickDifferentDesc": "El destino es la antología actual.",
  "move.connectWallet": "Conecta tu billetera",
  "move.connectWalletDesc":
    "Un destino en la blockchain necesita una billetera conectada.",
  "move.notWhitelisted": "No estás en la lista blanca",
  "move.notWhitelistedDesc":
    "No estás en la lista blanca de la antología de destino.",
  "move.moved": "Memoir movido",
  "move.copied": "Memoir copiado",
  "move.savedLocal": "Guardado en la antología local seleccionada",
  "move.savedChain":
    "Guardado en la antología de la blockchain seleccionada",
  "move.errorTitle": "Algo salió mal",
  "move.errorDesc": "No se pudo copiar ni mover el memoir.",
  "move.txNotSent": "La transacción no fue enviada.",

  /* ------------------------------ Delete memoir ----------------------------- */
  "delete.confirmTitle": "¿Seguro que quieres borrar:",
  "delete.yesDelete": "SÍ, BORRAR",
  "delete.cannotUndo": "Esta acción no se puede deshacer.",
  "delete.deleted": "Memoir borrado",
  "delete.errorTitle": "Error al borrar el memoir",

  /* -------------------------------- Memoirs --------------------------------- */
  "memoirs.searchPlaceholder":
    "Buscar memoirs por título o contenido...",
  "memoirs.none": "No hay memoirs disponibles.",
  "memoirs.titleLabel": "Título:",
  "memoirs.contentLabel": "Contenido:",
  "memoirs.sentBy": "Enviado por:",
  "memoirs.whenAdded": "Añadido:",
  "memoirs.decline": "Rechazar memoir",
  "memoir.accept": "Aceptar memoir",
  "memoirs.playlistNotFound": "No se encontraron videos de YouTube",
  "memoirs.loadMore": "Cargar más",
  "memoirs.loadingMore": "Cargando más memoirs...",
  "memoirs.showingCount": "Mostrando {loaded} de {total} memoirs",
  "memoirs.allLoaded": "Se cargaron los {total} memoirs",

  /* --------------------------------- Search --------------------------------- */
  "search.result": "resultado",
  "search.results": "resultados",
  "search.noMatch": "Ningún memoir coincide con «{term}».",
  "search.local": "Local",
  "search.blockchain": "Blockchain",
};

export const dictionaries = { en, es } as const;
