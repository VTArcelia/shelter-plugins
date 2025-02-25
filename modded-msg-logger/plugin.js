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
var modded_msg_logger_default = `.nea-deleted-message {
  background: #f299bf40;
  flex-direction: column;
  display: flex;
  position: relative;
}

.nea-dismiss-text {
  color: #0ff0fa;
  cursor: pointer;
  border-radius: 3px;
  align-self: flex-start;
  margin-top: 3px;
  margin-left: 60px;
  padding: 2px 4px;
}

.nea-dismiss-text:hover {
  background-color: #7289ff33;
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
function updateIgnoredUsers() {
	const ignoredUsersString = plugin.store.ignoredUsers || "";
	ignoredUsers = ignoredUsersString.split(",").map((id) => id.trim()).filter((id) => id);
	updateMessageDisplay();
}
function updateIgnoredChannels() {
	const ignoredChannelsString = plugin.store.ignoredChannels || "";
	ignoredChannels = ignoredChannelsString.split(",").map((id) => id.trim()).filter((id) => id);
	updateMessageDisplay();
}
function updateMessageDisplay() {
	const messageStore = getMessageStore();
	if (!messageStore) return;
	const messages = messageStore.getMessages(getSelectedChannel())?._array;
	if (!messages) return;
	for (const message of messages) {
		const messageDom = document.getElementById(`chat-messages-${message.channel_id}-${message.id}`);
		if (!messageDom) continue;
		if (message.editedTimestamp?.toISOString() === oldTimeStamp) if (ignoredUsers.includes(message.author.id) || ignoredChannels.includes(message.channel_id)) messageDom.style.display = "none";
else messageDom.style.display = "";
	}
}
function onLoad() {
	for (const trigger of messageReRenderTriggers) flux.dispatcher.subscribe(trigger, onReRenderEvent);
	updateIgnoredUsers();
	updateIgnoredChannels();
}
const oldTimeStamp = "2001-09-11T12:46:30.000Z";
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
		paintRed(storedMessage.channel_id, storedMessage.id);
		return replacementPayload;
	}
	return;
}
function paintRed(channelId, messageId) {
	let dom = document.getElementById(`chat-messages-${channelId}-${messageId}`);
	if (!dom) return;
	dom.classList.add("nea-deleted-message");
	addDismissText(dom, channelId, messageId);
}
function addDismissText(messageDom, channelId, messageId) {
	if (messageDom.querySelector(".nea-dismiss-text")) return;
	const dismissText = document.createElement("span");
	dismissText.textContent = "Dismiss";
	dismissText.classList.add("nea-dismiss-text");
	dismissText.addEventListener("click", () => dismissMessage(channelId, messageId));
	messageDom.appendChild(dismissText);
}
function dismissMessage(channelId, messageId) {
	flux.dispatcher.dispatch({
		type: "MESSAGE_DELETE",
		channelId,
		id: messageId,
		dismissed: true
	});
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

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
exports.settings = settings
return exports;
})({});