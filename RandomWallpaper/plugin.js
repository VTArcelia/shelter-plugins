(function(exports, shelter) {

"use strict";
//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
shelter = __toESM(shelter);

//#region plugins/RandomWallpaper/index.tsx
let uninject = null;
let intervalId = null;
const defaultWallpapers = [
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
function getWallpapers() {
	const stored = shelter.plugin.store.wallpapers || "";
	const userList = stored.split(",").map((url) => url.trim()).filter((url) => url);
	return userList.length > 0 ? userList : defaultWallpapers;
}
function pickRandom() {
	const wallpapers = getWallpapers();
	return wallpapers[Math.floor(Math.random() * wallpapers.length)];
}
function applyWallpaper(url) {
	if (uninject) uninject();
	uninject = shelter.ui.injectCss(`:root { --cv-random-wallpaper: url("${url}"); }`);
}
function onLoad() {
	applyWallpaper(pickRandom());
	if (shelter.plugin.store.rotationEnabled) {
		const intervalMinutes = Number(shelter.plugin.store.rotationInterval) || 5;
		intervalId = setInterval(() => {
			applyWallpaper(pickRandom());
		}, intervalMinutes * 60 * 1e3);
	}
}
function onUnload() {
	if (uninject) uninject();
	uninject = null;
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	}
}
const settings = () => {
	const [urls, setUrls] = shelter.solid.createSignal(shelter.plugin.store.wallpapers || "");
	const [rotationEnabled, setRotationEnabled] = shelter.solid.createSignal(shelter.plugin.store.rotationEnabled || false);
	const [rotationInterval, setRotationInterval] = shelter.solid.createSignal(shelter.plugin.store.rotationInterval || 5);
	function save() {
		shelter.plugin.store.wallpapers = urls();
		shelter.plugin.store.rotationEnabled = rotationEnabled();
		shelter.plugin.store.rotationInterval = rotationInterval();
		shelter.ui.showToast("Settings saved!", { type: "success" });
	}
	return [
		shelter.solid.createComponent(shelter.ui.Header, {
			tag: shelter.ui.HeaderTags.H3,
			children: "Wallpaper URLs (comma-separated)"
		}),
		shelter.solid.createComponent(shelter.ui.TextBox, {
			get value() {
				return urls();
			},
			onInput: (v) => setUrls(v),
			placeholder: "Enter wallpaper URLs separated by commas",
			multiline: true,
			style: {
				width: "100%",
				minHeight: "100px",
				resize: "vertical"
			}
		}),
		shelter.solid.createComponent(shelter.ui.SwitchItem, {
			get value() {
				return rotationEnabled();
			},
			onChange: (v) => setRotationEnabled(v),
			children: "Enable rotation",
			note: "Pick a new wallpaper every X minutes"
		}),
		shelter.solid.createComponent(shelter.ui.TextBox, {
			get value() {
				return String(rotationInterval());
			},
			onInput: (v) => setRotationInterval(Number(v)),
			placeholder: "Rotation interval in minutes",
			type: "number",
			style: {
				width: "100px",
				marginTop: "5px"
			}
		}),
		shelter.solid.createComponent(shelter.ui.Button, {
			onClick: save,
			children: "Save"
		})
	];
};

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
exports.settings = settings
return exports;
})({}, shelter);