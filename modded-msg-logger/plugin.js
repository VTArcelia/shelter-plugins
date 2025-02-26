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
var modded_msg_logger_default = `.nea-ephemeral-indicator {
  align-items: center;
  display: flex;
}

.nea-only-you {
  color: gray;
  margin-left: 10px;
  font-size: .8em;
}

.nea-dismiss-text {
  color: #0ff0fa;
  cursor: pointer;
  transform-origin: 0 0;
  align-self: flex-start;
  margin-left: 3px;
  transform: scale(.75);
}

.nea-before-edit {
  color: gray;
  margin-top: 8px;
  margin-left: 10px;
  font-size: .85em;
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
	function saveSettings() {
		plugin$1.store.ignoredUsers = ignoredUsersString();
		plugin$1.store.ignoredChannels = ignoredChannelsString();
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
	updateMessageDisplay();
}
const oldTimeStamp = "2001-09-11T12:46:30.000Z";
function addEphemeralIndicator(channelId, messageId) {
	const messageDom = document.getElementById(`chat-messages-${channelId}-${messageId}`);
	if (!messageDom) return;
	messageDom.classList.add("ephemeral__5126c");
	if (messageDom.dataset.ephemeralIndicatorAdded === "true") return;
	const ephemeralIndicator = document.createElement("div");
	ephemeralIndicator.id = `message-accessories-${messageId}`;
	ephemeralIndicator.className = "nea-ephemeral-indicator";
	ephemeralIndicator.innerHTML = `
        <span class="nea-only-you">Only you can see this message • </span>
        <span class="nea-dismiss-text">Dismiss Message</span>
    `;
	messageDom.appendChild(ephemeralIndicator);
	const dismissButton = ephemeralIndicator.querySelector(".nea-dismiss-text");
	if (dismissButton) dismissButton.addEventListener("click", () => {
		flux.dispatcher.dispatch({
			type: "MESSAGE_DELETE",
			channelId,
			id: messageId,
			dismissed: true
		});
	});
	messageDom.dataset.ephemeralIndicatorAdded = "true";
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
				edited_timestamp: oldTimeStamp
			}
		};
		addEphemeralIndicator(storedMessage.channel_id, storedMessage.id);
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
	const beforeEditContainer = document.createElement("div");
	beforeEditContainer.classList.add("nea-before-edit");
	beforeEditContainer.textContent = `Before Edit: ${previousContent}`;
	const messageContent = messageDom.querySelector("[data-message-content]");
	if (messageContent) messageContent.parentNode?.insertBefore(beforeEditContainer, messageContent);
else messageDom.appendChild(beforeEditContainer);
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

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
exports.setShowEditHistory = setShowEditHistory
exports.settings = settings
return exports;
})({});