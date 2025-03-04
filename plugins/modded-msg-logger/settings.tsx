import { Component } from 'solid-js';
const { plugin, solid, ui } = shelter;
import { setShowEditHistory, setShowDiffs, setUseWhitelist } from './index';

export const settings: Component = () => {
    const [ignoredUsersString, setIgnoredUsersString] = solid.createSignal(plugin.store.ignoredUsers || '');
    const [ignoredChannelsString, setIgnoredChannelsString] = solid.createSignal(plugin.store.ignoredChannels || '');
    const [showDiffsValue, setShowDiffsValue] = solid.createSignal(plugin.store.showDiffs !== false);
    const [useWhitelistValue, setUseWhitelistValue] = solid.createSignal(plugin.store.useWhitelist === true);

    function saveSettings() {
        plugin.store.ignoredUsers = ignoredUsersString();
        plugin.store.ignoredChannels = ignoredChannelsString();
        plugin.store.showDiffs = showDiffsValue();
        plugin.store.useWhitelist = useWhitelistValue();
        ui.showToast("Settings saved!", { type: "success" });
        updateIgnoredUsers();
        updateIgnoredChannels();
    }

    let updateIgnoredUsers: () => void;
    let updateIgnoredChannels: () => void;

    solid.onMount(() => {
        updateIgnoredUsers = (window as any).updateIgnoredUsers;
        updateIgnoredChannels = (window as any).updateIgnoredChannels;
    });

    return (
        <>
            <ui.SwitchItem
                value={plugin.store.showEditHistory !== false}
                onChange={(value) => {
                    plugin.store.showEditHistory = value;
                    setShowEditHistory(value);
                }}
                note="Show message content before edits"
            >
                Show Edit History
            </ui.SwitchItem>

            <ui.SwitchItem
                value={showDiffsValue()}
                onChange={(value) => {
                    setShowDiffsValue(value);
                    setShowDiffs(value);
                }}
                note="Highlight added and deleted words in the before edit text"
            >
                Show Diffs
            </ui.SwitchItem>

            <ui.SwitchItem
                value={useWhitelistValue()}
                onChange={(value) => {
                    setUseWhitelistValue(value);
                    setUseWhitelist(value);
                }}
                note="Only log messages from the specified users and channels"
            >
                Use as Whitelist
            </ui.SwitchItem>

            <ui.Header tag={ui.HeaderTags.H3}>Users</ui.Header>
            <ui.TextBox
                placeholder="Enter user IDs (comma-separated)"
                value={ignoredUsersString()}
                onInput={(value) => setIgnoredUsersString(value)}
                style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
                multiline
            />

            <ui.Header tag={ui.HeaderTags.H3}>Channels</ui.Header>
            <ui.TextBox
                placeholder="Enter channel IDs (comma-separated)"
                value={ignoredChannelsString()}
                onInput={(value) => setIgnoredChannelsString(value)}
                style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
                multiline
            />

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <ui.Button onClick={saveSettings}>
                    Save
                </ui.Button>
            </div>
        </>
    );
};