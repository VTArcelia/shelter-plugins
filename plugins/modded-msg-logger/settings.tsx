import { Component } from "solid-js";
const { plugin, solid, ui } = shelter;
import {
  setShowEditHistory,
  setShowDiffs,
  setUseWhitelist,
  setIgnoreSelf,
} from "./index";

export const settings: Component = () => {
  const initialUsers = (plugin.store.ignoredUsers || "")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);
  const initialChannels = (plugin.store.ignoredChannels || "")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  const [ignoredUsers, setIgnoredUsers] =
    solid.createSignal<string[]>(initialUsers);
  const [newUser, setNewUser] = solid.createSignal("");

  const [ignoredChannels, setIgnoredChannels] =
    solid.createSignal<string[]>(initialChannels);
  const [newChannel, setNewChannel] = solid.createSignal("");

  const [showDiffsValue, setShowDiffsValue] = solid.createSignal(
    plugin.store.showDiffs !== false,
  );
  const [useWhitelistValue, setUseWhitelistValue] = solid.createSignal(
    plugin.store.useWhitelist === true,
  );
  const [ignoreSelfValue, setIgnoreSelfValue] = solid.createSignal(
    plugin.store.ignoreSelf === true,
  );

  function save(users?: string[], channels?: string[]) {
    const u = users ?? ignoredUsers();
    const c = channels ?? ignoredChannels();
    plugin.store.ignoredUsers = u.join(",");
    plugin.store.ignoredChannels = c.join(",");
    plugin.store.showDiffs = showDiffsValue();
    plugin.store.useWhitelist = useWhitelistValue();
    plugin.store.ignoreSelf = ignoreSelfValue();
    ui.showToast("Settings saved!", { type: "success" });
    updateIgnoredUsers();
    updateIgnoredChannels();
  }

  function addUser() {
    const id = newUser().trim();
    if (!id) return;
    const updated = [...ignoredUsers(), id];
    setIgnoredUsers(updated);
    setNewUser("");
    save(updated, ignoredChannels());
  }

  function removeUser(index: number) {
    const updated = [...ignoredUsers()];
    updated.splice(index, 1);
    setIgnoredUsers(updated);
    save(updated, ignoredChannels());
  }

  function addChannel() {
    const id = newChannel().trim();
    if (!id) return;
    const updated = [...ignoredChannels(), id];
    setIgnoredChannels(updated);
    setNewChannel("");
    save(ignoredUsers(), updated);
  }

  function removeChannel(index: number) {
    const updated = [...ignoredChannels()];
    updated.splice(index, 1);
    setIgnoredChannels(updated);
    save(ignoredUsers(), updated);
  }

  let updateIgnoredUsers: () => void;
  let updateIgnoredChannels: () => void;

  solid.onMount(() => {
    updateIgnoredUsers = (window as any).updateIgnoredUsers;
    updateIgnoredChannels = (window as any).updateIgnoredChannels;
  });

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
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
        value={ignoreSelfValue()}
        onChange={(value) => {
          setIgnoreSelfValue(value);
          setIgnoreSelf(value);
        }}
        note="Ignore your own messages"
      >
        Ignore Self
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
      <div style={{ display: "flex", gap: "5px" }}>
        <ui.TextBox
          value={newUser()}
          onInput={(v: string) => setNewUser(v)}
          placeholder="Enter a user ID"
          style={{ flex: 1 }}
        />
        <ui.Button onClick={addUser}>Add</ui.Button>
      </div>
      <solid.For each={ignoredUsers()}>
        {(id, index) => (
          <div style={{ display: "flex", gap: "5px", "align-items": "center" }}>
            <span style={{ flex: 1, "word-break": "break-all" }}>{id}</span>
            <ui.Button color="red" onClick={() => removeUser(index())}>
              Remove
            </ui.Button>
          </div>
        )}
      </solid.For>

      <ui.Header tag={ui.HeaderTags.H3}>Channels</ui.Header>
      <div style={{ display: "flex", gap: "5px" }}>
        <ui.TextBox
          value={newChannel()}
          onInput={(v: string) => setNewChannel(v)}
          placeholder="Enter a channel ID"
          style={{ flex: 1 }}
        />
        <ui.Button onClick={addChannel}>Add</ui.Button>
      </div>
      <solid.For each={ignoredChannels()}>
        {(id, index) => (
          <div style={{ display: "flex", gap: "5px", "align-items": "center" }}>
            <span style={{ flex: 1, "word-break": "break-all" }}>{id}</span>
            <ui.Button color="red" onClick={() => removeChannel(index())}>
              Remove
            </ui.Button>
          </div>
        )}
      </solid.For>

      <div
        style={{
          display: "flex",
          "justify-content": "center",
          "margin-top": "10px",
        }}
      >
        <ui.Button onClick={() => save()}>Save</ui.Button>
      </div>
    </div>
  );
};
