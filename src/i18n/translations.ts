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
    "Anthology is a place to keep what you want to remember — notes, links, videos, ideas — organized into collections. Each collection is called an anthology: like a book of your own writing, except it can hold anything.",
  "about.localTitle": "Yours, on your device",
  "about.local":
    "Everything you save lives in your browser. No account, no server, nobody else reading it. Close the tab, come back next week — it's all still there. It even works offline.",
  "about.permanentTitle": "Make it permanent (optional)",
  "about.permanent":
    "If you want a collection to outlive your browser — or be public for anyone to read — you can publish it to the blockchain (Arbitrum). Think of it as carving it into stone instead of writing it in a notebook. It costs a small network fee, and it's completely optional.",
  "about.shareTitle": "Share it if you want",
  "about.share":
    "Collections you publish to the blockchain can be shared as a QR code — scan it on another device and it's imported instantly. Private collections stay in your browser, and can be exported as a file whenever you want.",
  "about.whyTitle": "Why \"anthology\"?",
  "about.why":
    "An anthology is a collection of writing — poems, stories, songs. This one is your collection of whatever matters to you.",

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
  "order.newer": "Newer first",
  "order.older": "Older first",
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
    "Anthology es un lugar para guardar lo que quieres recordar — notas, enlaces, videos, ideas — organizado en colecciones. Cada colección se llama antología: como un libro escrito por ti, solo que puede contener cualquier cosa.",
  "about.localTitle": "Tuyo, en tu dispositivo",
  "about.local":
    "Todo lo que guardas vive en tu navegador. Sin cuenta, sin servidor, nadie más lo lee. Cierra la pestaña, vuelve la próxima semana — todo sigue ahí. Incluso funciona sin conexión.",
  "about.permanentTitle": "Hazlo permanente (opcional)",
  "about.permanent":
    "Si quieres que una colección sobreviva a tu navegador — o que sea pública para que cualquiera la lea — puedes publicarla en la blockchain (Arbitrum). Piénsalo como tallarlo en piedra en lugar de escribirlo en un cuaderno. Cuesta una pequeña comisión de red y es totalmente opcional.",
  "about.shareTitle": "Compártelo si quieres",
  "about.share":
    "Las colecciones que publicas en la blockchain se pueden compartir como código QR — escanéalo en otro dispositivo y se importa al instante. Las colecciones privadas se quedan en tu navegador y puedes exportarlas como archivo cuando quieras.",
  "about.whyTitle": "¿Por qué «antología»?",
  "about.why":
    "Una antología es una colección de escritos — poemas, historias, canciones. Esta es tu colección de lo que sea que te importe.",

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
  "anthology.info": "Info de la antología",
  "anthology.show": "Ver antología",

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
  "order.newer": "Más recientes",
  "order.older": "Más antiguos",
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

  /* --------------------------------- Search --------------------------------- */
  "search.result": "resultado",
  "search.results": "resultados",
  "search.noMatch": "Ningún memoir coincide con «{term}».",
  "search.local": "Local",
  "search.blockchain": "Blockchain",
};

export const dictionaries = { en, es } as const;
