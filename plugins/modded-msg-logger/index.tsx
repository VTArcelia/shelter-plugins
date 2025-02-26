import { AnyDispatchPayload, getMessageStore, messageReRenderTriggers } from './types';
import css from './index.css';
const { flux, ui, plugin } = shelter;

const unintercept = flux.intercept(block);
const uninjectCss = ui.injectCss(css);

let ignoredUsers: string[] = [];
let ignoredChannels: string[] = [];
const messageEditHistory: Record<string, string> = {};

let showEditHistory: boolean = plugin.store.showEditHistory !== false;

function updateIgnoredUsers() {
    const ignoredUsersString = plugin.store.ignoredUsers || '';
    ignoredUsers = ignoredUsersString.split(',').map(id => id.trim()).filter(id => id);
}

function updateIgnoredChannels() {
    const ignoredChannelsString = plugin.store.ignoredChannels || '';
    ignoredChannels = ignoredChannelsString.split(',').map(id => id.trim()).filter(id => id);
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

export function onLoad() {
    for (const trigger of messageReRenderTriggers) {
        flux.dispatcher.subscribe(trigger, onReRenderEvent);
    }
    updateIgnoredUsers();
    updateIgnoredChannels();
    showEditHistory = plugin.store.showEditHistory !== false;
    updateMessageDisplay();
}

const oldTimeStamp = '2001-09-11T12:46:30.000Z';

function attachDismissListener(channelId: string, messageId: string) {
    const messageDom = document.getElementById(`chat-messages-${channelId}-${messageId}`);
    if (!messageDom) return;

    const dismissButton = messageDom.querySelector(`[class*="ephemeralMessage"] a[role="button"][tabindex="0"]`);
    if (!dismissButton) return;

    if (dismissButton.dataset.dismissListenerAdded === 'true') {
        return;
    }

    dismissButton.onclick = () => {
        flux.dispatcher.dispatch({
            type: 'MESSAGE_DELETE',
            channelId: channelId,
            id: messageId,
            dismissed: true,
        });
    };

    dismissButton.dataset.dismissListenerAdded = 'true';
}

function block(payload: AnyDispatchPayload) {
    if (payload.type === 'MESSAGE_DELETE') {
        if (payload.dismissed) return;
        let messageStore = getMessageStore();
        if (!messageStore) return;
        let storedMessage = messageStore.getMessage(payload.channelId, payload.id);
        if (!storedMessage) return;

        if (ignoredUsers.includes(storedMessage.author.id) || ignoredChannels.includes(storedMessage.channel_id)) {
            return;
        }

        let replacementPayload: AnyDispatchPayload = {
            type: 'MESSAGE_UPDATE',
            guildId: payload.guildId,
            message: { ...storedMessage.toJS(), edited_timestamp: oldTimeStamp, flags: 64 }, // Set the flag here
        };
        setTimeout(() => attachDismissListener(storedMessage.channel_id, storedMessage.id), 100);
        return replacementPayload;
    }

    if (payload.type === 'MESSAGE_UPDATE') {
        const message = payload.message;
        if (!message || !message.id) return;

        if (ignoredChannels.includes(message.channel_id) || ignoredUsers.includes(message.author.id)) {
            return;
        }

        const messageStore = getMessageStore();
        const oldMessage = messageStore.getMessage(message.channel_id, message.id);

        if (oldMessage && oldMessage.content !== message.content) {
            messageEditHistory[message.id] = oldMessage.content;
        }

        setTimeout(() => {
            const messageDom = document.getElementById(`chat-messages-${message.channel_id}-${message.id}`);
            if (messageDom) {
                displayBeforeEdit(message.id, message.channel_id, messageDom);
            }
        }, 100);
    }

    return;
}

function displayBeforeEdit(messageId: string, channelId: string, messageDom: HTMLElement) {
    if (!showEditHistory) {
        const existingBeforeEdit = messageDom.querySelector('.nea-before-edit');
        if (existingBeforeEdit) {
            existingBeforeEdit.remove();
        }
        return;
    }

    const previousContent = messageEditHistory[messageId];
    if (!previousContent) return;

    let existingBeforeEdit = messageDom.querySelector('.nea-before-edit');
    if (existingBeforeEdit) {
        existingBeforeEdit.remove();
    }

    const messageContent = messageDom.querySelector(`[id^="message-content-"]`);
    if (!messageContent) return;

    const beforeEditContainer = document.createElement('span');
    beforeEditContainer.classList.add('nea-before-edit');
    beforeEditContainer.textContent = `\nBefore Edit: ${previousContent}`;

    messageContent.appendChild(beforeEditContainer);
}


function onReRenderEvent(payload: AnyDispatchPayload) {
    if (payload.type === 'CHANNEL_SELECT' || payload.type === 'UPDATE_CHANNEL_DIMENSIONS') {
        updateMessageDisplay();
    }
}

export function onUnload() {
    unintercept();
    uninjectCss();
    for (const trigger of messageReRenderTriggers) {
        flux.dispatcher.unsubscribe(trigger, onReRenderEvent);
    }
}

function getSelectedChannel() {
    return shelter.flux.stores.SelectedChannelStore.getChannelId();
}

(window as any).updateIgnoredUsers = updateIgnoredUsers;
(window as any).updateIgnoredChannels = updateIgnoredChannels;

export { settings } from './settings';

export function setShowEditHistory(value: boolean) {
    showEditHistory = value;
    plugin.store.showEditHistory = value;
    updateMessageDisplay();
}