(function(exports) {

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion

//#region plugins/modded-msg-logger/types.ts
const messageReRenderTriggers = [
	"MESSAGE_CREATE",
	"CHANNEL_SELECT",
	"LOAD_MESSAGES_SUCCESS",
	"UPDATE_CHANNEL_DIMENSIONS",
	"MESSAGE_END_EDIT",
	"MESSAGE_UPDATE"
];
function getMessageStore() {
	return shelter.flux.storesFlat.MessageStore;
}

//#endregion
//#region plugins/modded-msg-logger/index.css
var modded_msg_logger_default = `.nea-before-edit {
  color: gray;
  opacity: .8;
  font-size: .85em;
}

.deleted-word {
  color: red;
}

.added-word {
  color: #00de00;
}
`;

//#endregion
//#region solid-js/web
var require_web = __commonJS({ "solid-js/web"(exports, module) {
	module.exports = shelter.solidWeb;
} });

//#endregion
//#region plugins/modded-msg-logger/settings.tsx
var import_web = __toESM(require_web(), 1);
var import_web$1 = __toESM(require_web(), 1);
var import_web$2 = __toESM(require_web(), 1);
var import_web$3 = __toESM(require_web(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web.template)(`<div></div>`, 2);
const { plugin: plugin$1, solid, ui: ui$1 } = shelter;
const settings = () => {
	const [ignoredUsersString, setIgnoredUsersString] = solid.createSignal(plugin$1.store.ignoredUsers || "");
	const [ignoredChannelsString, setIgnoredChannelsString] = solid.createSignal(plugin$1.store.ignoredChannels || "");
	const [showDiffsValue, setShowDiffsValue] = solid.createSignal(plugin$1.store.showDiffs !== false);
	function saveSettings() {
		plugin$1.store.ignoredUsers = ignoredUsersString();
		plugin$1.store.ignoredChannels = ignoredChannelsString();
		plugin$1.store.showDiffs = showDiffsValue();
		ui$1.showToast("Settings saved!", { type: "success" });
		updateIgnoredUsers$1();
		updateIgnoredChannels$1();
	}
	let updateIgnoredUsers$1;
	let updateIgnoredChannels$1;
	solid.onMount(() => {
		updateIgnoredUsers$1 = window.updateIgnoredUsers;
		updateIgnoredChannels$1 = window.updateIgnoredChannels;
	});
	return [
		(0, import_web$3.createComponent)(ui$1.SwitchItem, {
			get value() {
				return plugin$1.store.showEditHistory !== false;
			},
			onChange: (value) => {
				plugin$1.store.showEditHistory = value;
				setShowEditHistory(value);
			},
			note: "Show message content before edits",
			children: "Show Edit History"
		}),
		(0, import_web$3.createComponent)(ui$1.SwitchItem, {
			get value() {
				return showDiffsValue();
			},
			onChange: (value) => {
				setShowDiffsValue(value);
				setShowDiffs(value);
			},
			note: "Highlight added and deleted words in the before edit text",
			children: "Show Diffs"
		}),
		(0, import_web$3.createComponent)(ui$1.Header, {
			get tag() {
				return ui$1.HeaderTags.H3;
			},
			children: "Ignored User IDs"
		}),
		(0, import_web$3.createComponent)(ui$1.TextBox, {
			placeholder: "Enter user IDs (comma-separated)",
			get value() {
				return ignoredUsersString();
			},
			onInput: (value) => setIgnoredUsersString(value),
			style: {
				width: "100%",
				minHeight: "100px",
				resize: "vertical"
			},
			multiline: true
		}),
		(0, import_web$3.createComponent)(ui$1.Header, {
			get tag() {
				return ui$1.HeaderTags.H3;
			},
			children: "Ignored Channel IDs"
		}),
		(0, import_web$3.createComponent)(ui$1.TextBox, {
			placeholder: "Enter channel IDs (comma-separated)",
			get value() {
				return ignoredChannelsString();
			},
			onInput: (value) => setIgnoredChannelsString(value),
			style: {
				width: "100%",
				minHeight: "100px",
				resize: "vertical"
			},
			multiline: true
		}),
		(() => {
			const _el$ = (0, import_web$1.getNextElement)(_tmpl$);
			_el$.style.setProperty("display", "flex");
			_el$.style.setProperty("justifyContent", "center");
			_el$.style.setProperty("marginTop", "10px");
			(0, import_web$2.insert)(_el$, (0, import_web$3.createComponent)(ui$1.Button, {
				onClick: saveSettings,
				children: "Save"
			}));
			return _el$;
		})()
	];
};

//#endregion
//#region plugins/modded-msg-logger/index.tsx
const { flux, ui, plugin } = shelter;
const unintercept = flux.intercept(block);
const uninjectCss = ui.injectCss(modded_msg_logger_default);
let ignoredUsers = [];
let ignoredChannels = [];
const messageEditHistory = {};
let showEditHistory = plugin.store.showEditHistory !== false;
let showDiffs = plugin.store.showDiffs !== false;
function updateIgnoredUsers() {
	const ignoredUsersString = plugin.store.ignoredUsers || "";
	ignoredUsers = ignoredUsersString.split(",").map((id) => id.trim()).filter((id) => id);
}
function updateIgnoredChannels() {
	const ignoredChannelsString = plugin.store.ignoredChannels || "";
	ignoredChannels = ignoredChannelsString.split(",").map((id) => id.trim()).filter((id) => id);
}
function updateMessageDisplay() {
	const messageStore = getMessageStore();
	if (!messageStore) return;
	const messages = messageStore.getMessages(getSelectedChannel())?._array;
	if (!messages) return;
	for (const message of messages) {
		const messageDom = document.getElementById(`chat-messages-${message.channel_id}-${message.id}`);
		if (!messageDom) continue;
		displayBeforeEdit(message.id, message.channel_id, messageDom);
	}
}
function onLoad() {
	for (const trigger of messageReRenderTriggers) flux.dispatcher.subscribe(trigger, onReRenderEvent);
	updateIgnoredUsers();
	updateIgnoredChannels();
	showEditHistory = plugin.store.showEditHistory !== false;
	showDiffs = plugin.store.showDiffs !== false;
	updateMessageDisplay();
}
const oldTimeStamp = "2001-09-11T12:46:30.000Z";
function attachDismissListener(channelId, messageId) {
	const messageDom = document.getElementById(`chat-messages-${channelId}-${messageId}`);
	if (!messageDom) return;
	const dismissButton = messageDom.querySelector(`[class*="ephemeralMessage"] a[role="button"][tabindex="0"]`);
	if (!dismissButton) return;
	if (dismissButton.dataset.dismissListenerAdded === "true") return;
	dismissButton.onclick = () => {
		flux.dispatcher.dispatch({
			type: "MESSAGE_DELETE",
			channelId,
			id: messageId,
			dismissed: true
		});
	};
	dismissButton.dataset.dismissListenerAdded = "true";
}
function block(payload) {
	if (payload.type === "MESSAGE_DELETE") {
		if (payload.dismissed) return;
		let messageStore = getMessageStore();
		if (!messageStore) return;
		let storedMessage = messageStore.getMessage(payload.channelId, payload.id);
		if (!storedMessage) return;
		if (ignoredUsers.includes(storedMessage.author.id) || ignoredChannels.includes(storedMessage.channel_id)) return;
		let replacementPayload = {
			type: "MESSAGE_UPDATE",
			guildId: payload.guildId,
			message: {
				...storedMessage.toJS(),
				edited_timestamp: oldTimeStamp,
				flags: 64
			}
		};
		setTimeout(() => attachDismissListener(storedMessage.channel_id, storedMessage.id), 100);
		return replacementPayload;
	}
	if (payload.type === "MESSAGE_UPDATE") {
		const message = payload.message;
		if (!message || !message.id) return;
		if (ignoredChannels.includes(message.channel_id) || ignoredUsers.includes(message.author.id)) return;
		const messageStore = getMessageStore();
		const oldMessage = messageStore.getMessage(message.channel_id, message.id);
		if (oldMessage && oldMessage.content !== message.content) messageEditHistory[message.id] = oldMessage.content;
		setTimeout(() => {
			const messageDom = document.getElementById(`chat-messages-${message.channel_id}-${message.id}`);
			if (messageDom) displayBeforeEdit(message.id, message.channel_id, messageDom);
		}, 100);
	}
	return;
}
function displayBeforeEdit(messageId, channelId, messageDom) {
	if (!showEditHistory) {
		const existingBeforeEdit$1 = messageDom.querySelector(".nea-before-edit");
		if (existingBeforeEdit$1) existingBeforeEdit$1.remove();
		return;
	}
	const previousContent = messageEditHistory[messageId];
	if (!previousContent) return;
	let existingBeforeEdit = messageDom.querySelector(".nea-before-edit");
	if (existingBeforeEdit) existingBeforeEdit.remove();
	const messageContent = messageDom.querySelector(`[id^="message-content-"]`);
	if (!messageContent) return;
	const currentContent = messageContent.textContent || "";
	const oldWords = previousContent.split(/\s+/);
	const newWords = currentContent.split(/\s+/);
	let diffHtml = "";
	let oldIndex = 0;
	let newIndex = 0;
	while (oldIndex < oldWords.length || newIndex < newWords.length) if (oldWords[oldIndex] === newWords[newIndex]) {
		diffHtml += oldWords[oldIndex] + " ";
		oldIndex++;
		newIndex++;
	} else if (oldIndex < oldWords.length && (newIndex >= newWords.length || oldWords[oldIndex] !== newWords[newIndex + 1])) {
		diffHtml += `<span class="deleted-word">${oldWords[oldIndex]} </span>`;
		oldIndex++;
	} else {
		diffHtml += `<span class="added-word">${newWords[newIndex]} </span>`;
		newIndex++;
	}
	diffHtml = diffHtml.replace("(edited)", "");
	const beforeEditContainer = document.createElement("span");
	beforeEditContainer.classList.add("nea-before-edit");
	if (!showDiffs) beforeEditContainer.innerHTML = `\nBefore Edit: ${previousContent}`;
else beforeEditContainer.innerHTML = `\nBefore Edit: ${diffHtml}`;
	messageContent.appendChild(beforeEditContainer);
}
function onReRenderEvent(payload) {
	if (payload.type === "CHANNEL_SELECT" || payload.type === "UPDATE_CHANNEL_DIMENSIONS") updateMessageDisplay();
}
function onUnload() {
	unintercept();
	uninjectCss();
	for (const trigger of messageReRenderTriggers) flux.dispatcher.unsubscribe(trigger, onReRenderEvent);
}
function getSelectedChannel() {
	return shelter.flux.stores.SelectedChannelStore.getChannelId();
}
window.updateIgnoredUsers = updateIgnoredUsers;
window.updateIgnoredChannels = updateIgnoredChannels;
function setShowEditHistory(value) {
	showEditHistory = value;
	plugin.store.showEditHistory = value;
	updateMessageDisplay();
}
function setShowDiffs(value) {
	showDiffs = value;
	plugin.store.showDiffs = value;
	updateMessageDisplay();
}

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
exports.setShowDiffs = setShowDiffs
exports.setShowEditHistory = setShowEditHistory
exports.settings = settings
return exports;
})({});