import { AnyDispatchPayload, getMessageStore, messageReRenderTriggers } from './types';
import css from './index.css';
const { flux, ui, plugin } = shelter;

const unintercept = flux.intercept(block);
const uninjectCss = ui.injectCss(css);

let ignoredUsers: string[] = [];
let ignoredChannels: string[] = [];

function updateIgnoredUsers() {
    const ignoredUsersString = plugin.store.ignoredUsers || '';
    ignoredUsers = ignoredUsersString.split(',').map(id => id.trim()).filter(id => id);
    updateMessageDisplay();
}

function updateIgnoredChannels() {
    const ignoredChannelsString = plugin.store.ignoredChannels || '';
    ignoredChannels = ignoredChannelsString.split(',').map(id => id.trim()).filter(id => id);
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

        if (message.editedTimestamp?.toISOString() === oldTimeStamp) {
            if (ignoredUsers.includes(message.author.id) || ignoredChannels.includes(message.channel_id)) {
                messageDom.style.display = 'none';
            } else {
                messageDom.style.display = '';
            }
        }
    }
}

export function onLoad() {
    for (const trigger of messageReRenderTriggers) {
        flux.dispatcher.subscribe(trigger, onReRenderEvent);
    }
    updateIgnoredUsers();
    updateIgnoredChannels();
}

const oldTimeStamp = '2001-09-11T12:46:30.000Z';

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
            message: { ...storedMessage.toJS(), edited_timestamp: oldTimeStamp },
        };
        paintRed(storedMessage.channel_id, storedMessage.id);
        return replacementPayload;
    }
    return;
}

function paintRed(channelId: string, messageId: string) {
    let dom = document.getElementById(`chat-messages-${channelId}-${messageId}`);
    if (!dom) return;
    dom.classList.add('nea-deleted-message');
    addDismissText(dom, channelId, messageId);
}

function addDismissText(messageDom: HTMLElement, channelId: string, messageId: string) {
    if (messageDom.querySelector('.nea-dismiss-text')) return;
    const dismissText = document.createElement('span');
    dismissText.textContent = 'Dismiss';
    dismissText.classList.add('nea-dismiss-text');
    dismissText.addEventListener('click', () => dismissMessage(channelId, messageId));
    messageDom.appendChild(dismissText);
}

function dismissMessage(channelId: string, messageId: string) {
    flux.dispatcher.dispatch({
        type: 'MESSAGE_DELETE',
        channelId: channelId,
        id: messageId,
        dismissed: true,
    });
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