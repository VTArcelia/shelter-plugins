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
var import_web$4 = __toESM(require_web(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web.template)(`<div><!#><!/><!#><!/><!#><!/><!#><!/><!#><!/><div><!#><!/><!#><!/></div><!#><!/><!#><!/><div><!#><!/><!#><!/></div><!#><!/><div></div></div>`, 32), _tmpl$2 = /*#__PURE__*/ (0, import_web.template)(`<div><span></span><!#><!/></div>`, 6);
const { plugin: plugin$1, solid, ui: ui$1 } = shelter;
const settings = () => {
	const initialUsers = (plugin$1.store.ignoredUsers || "").split(",").map((s) => s.trim()).filter(Boolean);
	const initialChannels = (plugin$1.store.ignoredChannels || "").split(",").map((s) => s.trim()).filter(Boolean);
	const [ignoredUsers$1, setIgnoredUsers] = solid.createSignal(initialUsers);
	const [newUser, setNewUser] = solid.createSignal("");
	const [ignoredChannels$1, setIgnoredChannels] = solid.createSignal(initialChannels);
	const [newChannel, setNewChannel] = solid.createSignal("");
	const [showDiffsValue, setShowDiffsValue] = solid.createSignal(plugin$1.store.showDiffs !== false);
	const [useWhitelistValue, setUseWhitelistValue] = solid.createSignal(plugin$1.store.useWhitelist === true);
	const [ignoreSelfValue, setIgnoreSelfValue] = solid.createSignal(plugin$1.store.ignoreSelf === true);
	function save(users, channels) {
		const u = users ?? ignoredUsers$1();
		const c = channels ?? ignoredChannels$1();
		plugin$1.store.ignoredUsers = u.join(",");
		plugin$1.store.ignoredChannels = c.join(",");
		plugin$1.store.showDiffs = showDiffsValue();
		plugin$1.store.useWhitelist = useWhitelistValue();
		plugin$1.store.ignoreSelf = ignoreSelfValue();
		ui$1.showToast("Settings saved!", { type: "success" });
		updateIgnoredUsers$1();
		updateIgnoredChannels$1();
	}
	function addUser() {
		const id = newUser().trim();
		if (!id) return;
		const updated = [...ignoredUsers$1(), id];
		setIgnoredUsers(updated);
		setNewUser("");
		save(updated, ignoredChannels$1());
	}
	function removeUser(index) {
		const updated = [...ignoredUsers$1()];
		updated.splice(index, 1);
		setIgnoredUsers(updated);
		save(updated, ignoredChannels$1());
	}
	function addChannel() {
		const id = newChannel().trim();
		if (!id) return;
		const updated = [...ignoredChannels$1(), id];
		setIgnoredChannels(updated);
		setNewChannel("");
		save(ignoredUsers$1(), updated);
	}
	function removeChannel(index) {
		const updated = [...ignoredChannels$1()];
		updated.splice(index, 1);
		setIgnoredChannels(updated);
		save(ignoredUsers$1(), updated);
	}
	let updateIgnoredUsers$1;
	let updateIgnoredChannels$1;
	solid.onMount(() => {
		updateIgnoredUsers$1 = window.updateIgnoredUsers;
		updateIgnoredChannels$1 = window.updateIgnoredChannels;
	});
	return (() => {
		const _el$ = (0, import_web$1.getNextElement)(_tmpl$), _el$11 = _el$.firstChild, [_el$12, _co$5] = (0, import_web$2.getNextMarker)(_el$11.nextSibling), _el$13 = _el$12.nextSibling, [_el$14, _co$6] = (0, import_web$2.getNextMarker)(_el$13.nextSibling), _el$15 = _el$14.nextSibling, [_el$16, _co$7] = (0, import_web$2.getNextMarker)(_el$15.nextSibling), _el$17 = _el$16.nextSibling, [_el$18, _co$8] = (0, import_web$2.getNextMarker)(_el$17.nextSibling), _el$19 = _el$18.nextSibling, [_el$20, _co$9] = (0, import_web$2.getNextMarker)(_el$19.nextSibling), _el$2 = _el$20.nextSibling, _el$3 = _el$2.firstChild, [_el$4, _co$] = (0, import_web$2.getNextMarker)(_el$3.nextSibling), _el$5 = _el$4.nextSibling, [_el$6, _co$2] = (0, import_web$2.getNextMarker)(_el$5.nextSibling), _el$21 = _el$2.nextSibling, [_el$22, _co$0] = (0, import_web$2.getNextMarker)(_el$21.nextSibling), _el$23 = _el$22.nextSibling, [_el$24, _co$1] = (0, import_web$2.getNextMarker)(_el$23.nextSibling), _el$7 = _el$24.nextSibling, _el$8 = _el$7.firstChild, [_el$9, _co$3] = (0, import_web$2.getNextMarker)(_el$8.nextSibling), _el$0 = _el$9.nextSibling, [_el$1, _co$4] = (0, import_web$2.getNextMarker)(_el$0.nextSibling), _el$25 = _el$7.nextSibling, [_el$26, _co$10] = (0, import_web$2.getNextMarker)(_el$25.nextSibling), _el$10 = _el$26.nextSibling;
		_el$.style.setProperty("display", "flex");
		_el$.style.setProperty("flex-direction", "column");
		_el$.style.setProperty("gap", "12px");
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(ui$1.SwitchItem, {
			get value() {
				return plugin$1.store.showEditHistory !== false;
			},
			onChange: (value) => {
				plugin$1.store.showEditHistory = value;
				setShowEditHistory(value);
			},
			note: "Show message content before edits",
			children: "Show Edit History"
		}), _el$12, _co$5);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(ui$1.SwitchItem, {
			get value() {
				return showDiffsValue();
			},
			onChange: (value) => {
				setShowDiffsValue(value);
				setShowDiffs(value);
			},
			note: "Highlight added and deleted words in the before edit text",
			children: "Show Diffs"
		}), _el$14, _co$6);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(ui$1.SwitchItem, {
			get value() {
				return ignoreSelfValue();
			},
			onChange: (value) => {
				setIgnoreSelfValue(value);
				setIgnoreSelf(value);
			},
			note: "Ignore your own messages",
			children: "Ignore Self"
		}), _el$16, _co$7);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(ui$1.SwitchItem, {
			get value() {
				return useWhitelistValue();
			},
			onChange: (value) => {
				setUseWhitelistValue(value);
				setUseWhitelist(value);
			},
			note: "Only log messages from the specified users and channels",
			children: "Use as Whitelist"
		}), _el$18, _co$8);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(ui$1.Header, {
			get tag() {
				return ui$1.HeaderTags.H3;
			},
			children: "Users"
		}), _el$20, _co$9);
		_el$2.style.setProperty("display", "flex");
		_el$2.style.setProperty("gap", "5px");
		(0, import_web$3.insert)(_el$2, (0, import_web$4.createComponent)(ui$1.TextBox, {
			get value() {
				return newUser();
			},
			onInput: (v) => setNewUser(v),
			placeholder: "Enter a user ID",
			style: { flex: 1 }
		}), _el$4, _co$);
		(0, import_web$3.insert)(_el$2, (0, import_web$4.createComponent)(ui$1.Button, {
			onClick: addUser,
			children: "Add"
		}), _el$6, _co$2);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(solid.For, {
			get each() {
				return ignoredUsers$1();
			},
			children: (id, index) => (() => {
				const _el$27 = (0, import_web$1.getNextElement)(_tmpl$2), _el$28 = _el$27.firstChild, _el$29 = _el$28.nextSibling, [_el$30, _co$11] = (0, import_web$2.getNextMarker)(_el$29.nextSibling);
				_el$27.style.setProperty("display", "flex");
				_el$27.style.setProperty("gap", "5px");
				_el$27.style.setProperty("align-items", "center");
				_el$28.style.setProperty("flex", "1");
				_el$28.style.setProperty("word-break", "break-all");
				(0, import_web$3.insert)(_el$28, id);
				(0, import_web$3.insert)(_el$27, (0, import_web$4.createComponent)(ui$1.Button, {
					color: "red",
					onClick: () => removeUser(index()),
					children: "Remove"
				}), _el$30, _co$11);
				return _el$27;
			})()
		}), _el$22, _co$0);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(ui$1.Header, {
			get tag() {
				return ui$1.HeaderTags.H3;
			},
			children: "Channels"
		}), _el$24, _co$1);
		_el$7.style.setProperty("display", "flex");
		_el$7.style.setProperty("gap", "5px");
		(0, import_web$3.insert)(_el$7, (0, import_web$4.createComponent)(ui$1.TextBox, {
			get value() {
				return newChannel();
			},
			onInput: (v) => setNewChannel(v),
			placeholder: "Enter a channel ID",
			style: { flex: 1 }
		}), _el$9, _co$3);
		(0, import_web$3.insert)(_el$7, (0, import_web$4.createComponent)(ui$1.Button, {
			onClick: addChannel,
			children: "Add"
		}), _el$1, _co$4);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(solid.For, {
			get each() {
				return ignoredChannels$1();
			},
			children: (id, index) => (() => {
				const _el$31 = (0, import_web$1.getNextElement)(_tmpl$2), _el$32 = _el$31.firstChild, _el$33 = _el$32.nextSibling, [_el$34, _co$12] = (0, import_web$2.getNextMarker)(_el$33.nextSibling);
				_el$31.style.setProperty("display", "flex");
				_el$31.style.setProperty("gap", "5px");
				_el$31.style.setProperty("align-items", "center");
				_el$32.style.setProperty("flex", "1");
				_el$32.style.setProperty("word-break", "break-all");
				(0, import_web$3.insert)(_el$32, id);
				(0, import_web$3.insert)(_el$31, (0, import_web$4.createComponent)(ui$1.Button, {
					color: "red",
					onClick: () => removeChannel(index()),
					children: "Remove"
				}), _el$34, _co$12);
				return _el$31;
			})()
		}), _el$26, _co$10);
		_el$10.style.setProperty("display", "flex");
		_el$10.style.setProperty("justify-content", "center");
		_el$10.style.setProperty("margin-top", "10px");
		(0, import_web$3.insert)(_el$10, (0, import_web$4.createComponent)(ui$1.Button, {
			onClick: () => save(),
			children: "Save"
		}));
		return _el$;
	})();
};

//#endregion
//#region plugins/modded-msg-logger/index.tsx
const { flux, ui, plugin } = shelter;
const unintercept = flux.intercept(block);
const uninjectCss = ui.injectCss(modded_msg_logger_default);
let ignoredUsers = [];
let ignoredChannels = [];
let useWhitelist = plugin.store.useWhitelist === true;
let ignoreSelf = plugin.store.ignoreSelf !== false;
const messageEditHistory = {};
let showEditHistory = plugin.store.showEditHistory !== false;
let showDiffs = plugin.store.showDiffs !== false;
function getSelfId() {
	try {
		const a = shelter.auth;
		if (a) {
			if (typeof a.userId !== "undefined" && a.userId) return a.userId;
			if (a.user && a.user.id) return a.user.id;
			if (typeof a.getUserId === "function") {
				const id = a.getUserId();
				if (id) return id;
			}
		}
	} catch {}
	try {
		const userStore = shelter.flux?.stores?.UserStore;
		if (userStore) {
			if (typeof userStore.getCurrentUserId === "function") {
				const id = userStore.getCurrentUserId();
				if (id) return id;
			}
			if (typeof userStore.getCurrentUser === "function") {
				const u = userStore.getCurrentUser();
				if (u && u.id) return u.id;
			}
		}
	} catch {}
	return null;
}
function updateIgnoredUsers() {
	const ignoredUsersString = plugin.store.ignoredUsers || "";
	ignoredUsers = ignoredUsersString.split(",").map((id) => id.trim()).filter(Boolean);
	const self = getSelfId();
	if (ignoreSelf && self && !ignoredUsers.includes(self)) ignoredUsers.push(self);
}
function updateIgnoredChannels() {
	const ignoredChannelsString = plugin.store.ignoredChannels || "";
	ignoredChannels = ignoredChannelsString.split(",").map((id) => id.trim()).filter(Boolean);
}
window.updateIgnoredUsers = updateIgnoredUsers;
window.updateIgnoredChannels = updateIgnoredChannels;
function attachDismissListener(channelId, messageId) {
	const messageDom = document.getElementById("chat-messages-" + channelId + "-" + messageId);
	if (!messageDom) return;
	const ephemeralContainer = messageDom.querySelector("[class*=\"ephemeralMessage\"]") || messageDom.querySelector("[class*=\"ephemeral\"]") || null;
	if (!ephemeralContainer) return;
	const candidates = Array.from(ephemeralContainer.querySelectorAll("[role=\"button\"], button, a"));
	const dismissButton = candidates.find((el) => {
		const aria = (el.getAttribute("aria-label") || "").toLowerCase();
		const txt = (el.textContent || "").trim().toLowerCase();
		const cls = (el.className || "").toLowerCase();
		return aria.includes("dismiss") || txt === "dismiss" || txt.includes("dismiss") || cls.includes("dismiss");
	}) || null;
	if (!dismissButton) return;
	if (dismissButton.dataset.dismissListenerAdded === "true") return;
	dismissButton.addEventListener("click", (e) => {
		try {
			e.stopPropagation();
			e.preventDefault();
		} catch {}
		flux.dispatcher.dispatch({
			type: "MESSAGE_DELETE",
			channelId,
			id: messageId,
			dismissed: true
		});
	});
	dismissButton.dataset.dismissListenerAdded = "true";
}
function updateMessageDisplay() {
	const messageStore = getMessageStore();
	if (!messageStore) return;
	const messages = messageStore.getMessages(getSelectedChannel())?._array;
	if (!messages) return;
	for (const message of messages) {
		const messageDom = document.getElementById("chat-messages-" + message.channel_id + "-" + message.id);
		if (!messageDom) continue;
		displayBeforeEdit(message.id, message.channel_id, messageDom);
		const hasEphemeral = !!messageDom.querySelector("[class*=\"ephemeralMessage\"]") || !!messageDom.querySelector("[class*=\"ephemeral\"]");
		if (hasEphemeral) attachDismissListener(message.channel_id, message.id);
	}
}
function onLoad() {
	for (const trigger of messageReRenderTriggers) flux.dispatcher.subscribe(trigger, onReRenderEvent);
	updateIgnoredUsers();
	updateIgnoredChannels();
	showEditHistory = plugin.store.showEditHistory !== false;
	showDiffs = plugin.store.showDiffs !== false;
	useWhitelist = plugin.store.useWhitelist === true;
	ignoreSelf = plugin.store.ignoreSelf !== false;
	updateMessageDisplay();
}
const oldTimeStamp = "2001-09-11T12:46:30.000Z";
function block(payload) {
	if (payload.type === "MESSAGE_DELETE") {
		if (payload.dismissed) return;
		let messageStore = getMessageStore();
		if (!messageStore) return;
		let storedMessage = messageStore.getMessage(payload.channelId, payload.id);
		if (!storedMessage) return;
		const self = getSelfId();
		if (ignoreSelf && self && storedMessage.author && storedMessage.author.id === self) return;
		const isIgnoredUser = ignoredUsers.includes(storedMessage.author.id);
		const isIgnoredChannel = ignoredChannels.includes(storedMessage.channel_id);
		let shouldBlock = false;
		if (useWhitelist) shouldBlock = !(isIgnoredUser || isIgnoredChannel);
else shouldBlock = isIgnoredUser || isIgnoredChannel;
		if (shouldBlock) return;
		let replacementPayload = {
			type: "MESSAGE_UPDATE",
			guildId: payload.guildId,
			message: {
				...storedMessage.toJS(),
				edited_timestamp: oldTimeStamp,
				flags: 64
			}
		};
		setTimeout(() => {
			attachDismissListener(storedMessage.channel_id, storedMessage.id);
		}, 120);
		return replacementPayload;
	}
	if (payload.type === "MESSAGE_UPDATE") {
		const message = payload.message;
		if (!message || !message.id) return;
		const messageStore = getMessageStore();
		const oldMessage = messageStore.getMessage(message.channel_id, message.id);
		if (!oldMessage) return;
		const self = getSelfId();
		if (ignoreSelf && self && message.author && message.author.id === self) return;
		const isIgnoredUser = ignoredUsers.includes(message.author.id);
		const isIgnoredChannel = ignoredChannels.includes(message.channel_id);
		let shouldBlock = false;
		if (useWhitelist) shouldBlock = !(isIgnoredUser || isIgnoredChannel);
else shouldBlock = isIgnoredUser || isIgnoredChannel;
		if (shouldBlock) return;
		if (oldMessage.content !== message.content) messageEditHistory[message.id] = oldMessage.content;
		setTimeout(() => {
			const messageDom = document.getElementById("chat-messages-" + message.channel_id + "-" + message.id);
			if (messageDom) {
				displayBeforeEdit(message.id, message.channel_id, messageDom);
				const hasEphemeral = !!messageDom.querySelector("[class*=\"ephemeralMessage\"]") || !!messageDom.querySelector("[class*=\"ephemeral\"]");
				if (hasEphemeral) attachDismissListener(message.channel_id, message.id);
			}
		}, 120);
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
	const messageContent = messageDom.querySelector("[id^=\"message-content-\"]");
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
		diffHtml += "<span class=\"deleted-word\">" + oldWords[oldIndex] + " </span>";
		oldIndex++;
	} else {
		diffHtml += "<span class=\"added-word\">" + newWords[newIndex] + " </span>";
		newIndex++;
	}
	diffHtml = diffHtml.replace("(edited)", "");
	const beforeEditContainer = document.createElement("span");
	beforeEditContainer.classList.add("nea-before-edit");
	if (!showDiffs) beforeEditContainer.innerHTML = "\nPrev: " + previousContent;
else beforeEditContainer.innerHTML = "\nDif: " + diffHtml;
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
function setUseWhitelist(value) {
	useWhitelist = value;
	plugin.store.useWhitelist = value;
	updateMessageDisplay();
}
function setIgnoreSelf(value) {
	ignoreSelf = value;
	plugin.store.ignoreSelf = value;
	updateIgnoredUsers();
	updateMessageDisplay();
}

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
exports.setIgnoreSelf = setIgnoreSelf
exports.setShowDiffs = setShowDiffs
exports.setShowEditHistory = setShowEditHistory
exports.setUseWhitelist = setUseWhitelist
exports.settings = settings
return exports;
})({});