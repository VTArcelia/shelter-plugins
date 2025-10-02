import { ui, plugin } from "shelter";
import { solid } from "shelter";

let uninject: (() => void) | null = null;
let intervalId: NodeJS.Timeout | null = null;

const defaultWallpapers: string[] = [
  "https://i.postimg.cc/D0FNM1Kq/0074aa3e1434937e307545db8881065878c16ecc.jpg",
  "https://i.postimg.cc/4dpMPBjK/0d42f3f7504ff2eff4679d110b62137e0213ffae.jpg",
  "https://i.postimg.cc/DyxNxWpw/1cc54ce456ecec2d03fa63e32192ee524562edc0.jpg",
  "https://i.postimg.cc/Kv0W0Kpg/224390c925eb0d556d082f0c6d78a28f8ec27d51.jpg",
  "https://i.postimg.cc/HsYK002K/31862f2e2e1a7657bf17ade930a1fcc8406bc1ca.jpg",
  "https://i.postimg.cc/Gtrf5v1K/77ff256734a6445853508da6556689449d01ab44.jpg",
  "https://i.postimg.cc/d3BfPDqm/b2c3c6940fd1e567aeccfd909528578beeeb2bb1.jpg",
  "https://i.postimg.cc/BbszV2GL/bec63fcbb94103343d808a09c7e1f2e63b31e7a0.jpg",
  "https://i.postimg.cc/xCL75tBD/c29e6dac572e634949c8d90cfb9da7b03103f233.jpg"
];

function getWallpapers(): string[] {
  const stored = plugin.store.wallpapers || "";
  const userList = stored.split(",").map(url => url.trim()).filter(url => url);
  return userList.length > 0 ? userList : defaultWallpapers;
}

function pickRandom(): string {
  const wallpapers = getWallpapers();
  return wallpapers[Math.floor(Math.random() * wallpapers.length)];
}

function applyWallpaper(url: string): void {
  if (uninject) uninject();
  uninject = ui.injectCss(`
    :root {
      --cv-random-wallpaper: url("${url}");
      --background-image: var(--cv-random-wallpaper) !important;
    }
  `);
}

export function onLoad(): void {
  applyWallpaper(pickRandom());

  if (plugin.store.rotationEnabled) {
    const intervalMinutes = Number(plugin.store.rotationInterval) || 5;
    intervalId = setInterval(() => {
      applyWallpaper(pickRandom());
    }, intervalMinutes * 60 * 1000);
  }
}

export function onUnload(): void {
  if (uninject) uninject();
  uninject = null;

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export const settings = () => {
  const [urls, setUrls] = solid.createSignal(plugin.store.wallpapers || "");
  const [rotationEnabled, setRotationEnabled] = solid.createSignal(plugin.store.rotationEnabled || false);
  const [rotationInterval, setRotationInterval] = solid.createSignal(plugin.store.rotationInterval || 5);

  function save() {
    plugin.store.wallpapers = urls();
    plugin.store.rotationEnabled = rotationEnabled();
    plugin.store.rotationInterval = rotationInterval();
    ui.showToast("Settings saved!", { type: "success" });
  }

  return [
    solid.createComponent(ui.Header, { tag: ui.HeaderTags.H3, children: "Wallpaper URLs (comma-separated)" }),
    solid.createComponent(ui.TextBox, {
      get value() { return urls(); },
      onInput: (v: string) => setUrls(v),
      placeholder: "Enter wallpaper URLs separated by commas",
      multiline: true,
      style: { width: "100%", minHeight: "100px", resize: "vertical" }
    }),
    solid.createComponent(ui.SwitchItem, {
      get value() { return rotationEnabled(); },
      onChange: (v: boolean) => setRotationEnabled(v),
      children: "Enable rotation",
      note: "Pick a new wallpaper every X minutes"
    }),
    solid.createComponent(ui.TextBox, {
      get value() { return String(rotationInterval()); },
      onInput: (v: string) => setRotationInterval(Number(v)),
      placeholder: "Rotation interval in minutes",
      type: "number",
      style: { width: "100px", marginTop: "5px" }
    }),
    solid.createComponent(ui.Button, { onClick: save, children: "Save" })
  ];
};
