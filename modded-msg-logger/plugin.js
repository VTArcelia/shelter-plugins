(function(exports) {

"use strict";

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
//#region plugins/modded-msg-logger/index.tsx
const { flux, ui } = shelter;
const unintercept = flux.intercept(block);
const uninjectCss = ui.injectCss(modded_msg_logger_default);
function onLoad() {
	for (const trigger of messageReRenderTriggers) flux.dispatcher.subscribe(trigger, onReRenderEvent);
}
const oldTimeStamp = "2001-09-11T12:46:30.000Z";
function block(payload) {
	if (payload.type === "MESSAGE_DELETE") {
		if (payload.dismissed) return;
		let messageStore = getMessageStore();
		if (!messageStore) return;
		let storedMessage = messageStore.getMessage(payload.channelId, payload.id);
		if (!storedMessage) return;
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
	if (payload.type === "CHANNEL_SELECT" || payload.type === "UPDATE_CHANNEL_DIMENSIONS") {
		let channel = payload.channelId;
		let messages = getMessageStore()?.getMessages(channel);
		if (!messages) return;
		for (const message of messages._array) if (message.editedTimestamp?.toISOString() === oldTimeStamp) paintRed(message.channel_id, message.id);
	}
}
function onUnload() {
	unintercept();
	uninjectCss();
	for (const trigger of messageReRenderTriggers) flux.dispatcher.unsubscribe(trigger, onReRenderEvent);
}

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
return exports;
})({});