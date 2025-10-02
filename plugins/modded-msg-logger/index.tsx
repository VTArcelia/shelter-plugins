import { AnyDispatchPayload, getMessageStore, messageReRenderTriggers } from './types';
import css from './index.css';

const { flux, ui, plugin } = shelter;
const unintercept = flux.intercept(block);
const uninjectCss = ui.injectCss(css);

let ignoredUsers: string[] = [];
let ignoredChannels: string[] = [];
let useWhitelist: boolean = plugin.store.useWhitelist === true;
const messageEditHistory: Record<string, string> = {};
let showEditHistory: boolean = plugin.store.showEditHistory !== false;
let showDiffs: boolean = plugin.store.showDiffs !== false;

function updateIgnoredUsers() {
  const ignoredUsersString = plugin.store.ignoredUsers || '';
  ignoredUsers = ignoredUsersString.split(',').map(id => id.trim()).filter(id => id);
}

function updateIgnoredChannels() {
  const ignoredChannelsString = plugin.store.ignoredChannels || '';
  ignoredChannels = ignoredChannelsString.split(',').map(id => id.trim()).filter(id => id);
}

function attachDismissListener(channelId: string, messageId: string) {
  const messageDom = document.getElementById(`chat-messages-${channelId}-${messageId}`);
  if (!messageDom) return;

  const ephemeralContainer =
    messageDom.querySelector(`[class*="ephemeralMessage"]`) ||
    messageDom.querySelector(`[class*="ephemeral"]`) ||
    null;
  if (!ephemeralContainer) return; // nothing ephemeral here — don't attach

  const candidates = Array.from(
    ephemeralContainer.querySelectorAll<HTMLElement>('[role="button"], button, a')
  );

  const dismissButton = candidates.find((el) => {
    const aria = (el.getAttribute('aria-label') || '').toLowerCase();
    const txt = (el.textContent || '').trim().toLowerCase();
    const cls = (el.className || '').toLowerCase();
    return aria.includes('dismiss') || txt === 'dismiss' || txt.includes('dismiss') || cls.includes('dismiss');
  }) || null;

  if (!dismissButton) return;

  if (dismissButton.dataset.dismissListenerAdded === 'true') return;

  dismissButton.addEventListener('click', (e: Event) => {
    try {
      e.stopPropagation();
      e.preventDefault();
    } catch (err) {
    }

    flux.dispatcher.dispatch({
      type: 'MESSAGE_DELETE',
      channelId,
      id: messageId,
      dismissed: true
    });
  });

  dismissButton.dataset.dismissListenerAdded = 'true';
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

    const hasEphemeral =
      !!messageDom.querySelector(`[class*="ephemeralMessage"]`) || !!messageDom.querySelector(`[class*="ephemeral"]`);
    if (hasEphemeral) {
      attachDismissListener(message.channel_id, message.id);
    }
  }
}

export function onLoad() {
  for (const trigger of messageReRenderTriggers) {
    flux.dispatcher.subscribe(trigger, onReRenderEvent);
  }
  updateIgnoredUsers();
  updateIgnoredChannels();
  showEditHistory = plugin.store.showEditHistory !== false;
  showDiffs = plugin.store.showDiffs !== false;
  useWhitelist = plugin.store.useWhitelist === true;

  updateMessageDisplay();
}

const oldTimeStamp = '2001-09-11T12:46:30.000Z';

function block(payload: AnyDispatchPayload) {
  if (payload.type === 'MESSAGE_DELETE') {
    if ((payload as any).dismissed) return;
    let messageStore = getMessageStore();
    if (!messageStore) return;
    let storedMessage = messageStore.getMessage(payload.channelId, payload.id);
    if (!storedMessage) return;

    const isIgnoredUser = ignoredUsers.includes(storedMessage.author.id);
    const isIgnoredChannel = ignoredChannels.includes(storedMessage.channel_id);

    let shouldBlock = false;
    if (useWhitelist) {
      shouldBlock = !(isIgnoredUser || isIgnoredChannel);
    } else {
      shouldBlock = isIgnoredUser || isIgnoredChannel;
    }
    if (shouldBlock) return;

    let replacementPayload: AnyDispatchPayload = {
      type: 'MESSAGE_UPDATE',
      guildId: (payload as any).guildId,
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

  if (payload.type === 'MESSAGE_UPDATE') {
    const message = (payload as any).message;
    if (!message || !message.id) return;
    const messageStore = getMessageStore();
    const oldMessage = messageStore.getMessage(message.channel_id, message.id);
    if (!oldMessage) return;

    const isIgnoredUser = ignoredUsers.includes(message.author.id);
    const isIgnoredChannel = ignoredChannels.includes(message.channel_id);

    let shouldBlock = false;
    if (useWhitelist) {
      shouldBlock = !(isIgnoredUser || isIgnoredChannel);
    } else {
      shouldBlock = isIgnoredUser || isIgnoredChannel;
    }
    if (shouldBlock) return;

    if (oldMessage.content !== message.content) {
      messageEditHistory[message.id] = oldMessage.content;
    }

    setTimeout(() => {
      const messageDom = document.getElementById(`chat-messages-${message.channel_id}-${message.id}`);
      if (messageDom) {
        displayBeforeEdit(message.id, message.channel_id, messageDom);

        // re-attach dismiss listener only if ephemeral container present
        const hasEphemeral =
          !!messageDom.querySelector(`[class*="ephemeralMessage"]`) || !!messageDom.querySelector(`[class*="ephemeral"]`);
        if (hasEphemeral) attachDismissListener(message.channel_id, message.id);
      }
    }, 120);
  }
  return;
}

function displayBeforeEdit(messageId: string, channelId: string, messageDom: HTMLElement) {
  if (!showEditHistory) {
    const existingBeforeEdit = messageDom.querySelector('.nea-before-edit');
    if (existingBeforeEdit) existingBeforeEdit.remove();
    return;
  }

  const previousContent = messageEditHistory[messageId];
  if (!previousContent) return;

  let existingBeforeEdit = messageDom.querySelector('.nea-before-edit');
  if (existingBeforeEdit) existingBeforeEdit.remove();

  const messageContent = messageDom.querySelector(`[id^="message-content-"]`);
  if (!messageContent) return;

  const currentContent = messageContent.textContent || '';
  const oldWords = previousContent.split(/\s+/);
  const newWords = currentContent.split(/\s+/);

  let diffHtml = '';
  let oldIndex = 0;
  let newIndex = 0;
  while (oldIndex < oldWords.length || newIndex < newWords.length) {
    if (oldWords[oldIndex] === newWords[newIndex]) {
      diffHtml += oldWords[oldIndex] + ' ';
      oldIndex++;
      newIndex++;
    } else if (oldIndex < oldWords.length && (newIndex >= newWords.length || oldWords[oldIndex] !== newWords[newIndex + 1])) {
      diffHtml += `<span class="deleted-word">${oldWords[oldIndex]} </span>`;
      oldIndex++;
    } else {
      diffHtml += `<span class="added-word">${newWords[newIndex]} </span>`;
      newIndex++;
    }
  }

  diffHtml = diffHtml.replace('(edited)', '');

  const beforeEditContainer = document.createElement('span');
  beforeEditContainer.classList.add('nea-before-edit');
  if (!showDiffs) {
    beforeEditContainer.innerHTML = `\nPrev: ${previousContent}`;
  } else {
    beforeEditContainer.innerHTML = `\nDif: ${diffHtml}`;
  }

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

export function setShowDiffs(value: boolean) {
  showDiffs = value;
  plugin.store.showDiffs = value;
  updateMessageDisplay();
}

export function setUseWhitelist(value: boolean) {
  useWhitelist = value;
  plugin.store.useWhitelist = value;
  updateMessageDisplay();
}
