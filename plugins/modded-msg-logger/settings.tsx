import { Component } from 'solid-js';
const { plugin, solid, ui } = shelter;

export const settings: Component = () => {
    const [ignoredUsersString, setIgnoredUsersString] = solid.createSignal(plugin.store.ignoredUsers || '');
    const [ignoredChannelsString, setIgnoredChannelsString] = solid.createSignal(plugin.store.ignoredChannels || ''); 

    function saveSettings() {
        plugin.store.ignoredUsers = ignoredUsersString();
        plugin.store.ignoredChannels = ignoredChannelsString();
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
            <ui.Header tag={ui.HeaderTags.H3}>Ignored User IDs</ui.Header>
            <ui.TextBox
                placeholder="Enter user IDs (comma-separated)"
                value={ignoredUsersString()}
                onInput={(value) => setIgnoredUsersString(value)}
                style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
                multiline
            />

            <ui.Header tag={ui.HeaderTags.H3}>Ignored Channel IDs</ui.Header> 
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