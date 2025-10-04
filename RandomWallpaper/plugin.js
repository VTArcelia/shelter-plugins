(function(exports, shelter) {

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
shelter = __toESM(shelter);

//#region solid-js/web
var require_web = __commonJS({ "solid-js/web"(exports, module) {
	module.exports = shelter.solidWeb;
} });

//#endregion
//#region plugins/RandomWallpaper/index.tsx
var import_web = __toESM(require_web(), 1);
var import_web$1 = __toESM(require_web(), 1);
var import_web$2 = __toESM(require_web(), 1);
var import_web$3 = __toESM(require_web(), 1);
var import_web$4 = __toESM(require_web(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web.template)(`<div><!#><!/><div><!#><!/><!#><!/></div><!#><!/><!#><!/><!#><!/></div>`, 16), _tmpl$2 = /*#__PURE__*/ (0, import_web.template)(`<div><span></span><!#><!/></div>`, 6);
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
	const stored = shelter.plugin.store.wallpapers;
	if (Array.isArray(stored)) return stored.length > 0 ? stored : defaultWallpapers;
	if (typeof stored === "string") {
		const userList = stored.split(",").map((url) => url.trim()).filter((url) => url);
		return userList.length > 0 ? userList : defaultWallpapers;
	}
	return defaultWallpapers;
}
function pickRandom() {
	const wallpapers = getWallpapers();
	return wallpapers[Math.floor(Math.random() * wallpapers.length)];
}
function applyWallpaper(url) {
	if (uninject) uninject();
	uninject = shelter.ui.injectCss(`  
    :root {         --cv-random-wallpaper: url("${url}");         --background-image: var(--cv-random-wallpaper) !important;  
    }  
  `);
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
	const initialUrls = Array.isArray(shelter.plugin.store.wallpapers) ? shelter.plugin.store.wallpapers : (shelter.plugin.store.wallpapers || "").split(",").map((url) => url.trim()).filter((url) => url);
	const [urls, setUrls] = shelter.solid.createSignal(initialUrls);
	const [newUrl, setNewUrl] = shelter.solid.createSignal("");
	const [rotationEnabled, setRotationEnabled] = shelter.solid.createSignal(shelter.plugin.store.rotationEnabled || false);
	const [rotationInterval, setRotationInterval] = shelter.solid.createSignal(shelter.plugin.store.rotationInterval || 5);
	function save(updatedUrls) {
		const urlsToSave = updatedUrls ?? urls();
		shelter.plugin.store.wallpapers = urlsToSave;
		shelter.plugin.store.rotationEnabled = rotationEnabled();
		shelter.plugin.store.rotationInterval = rotationInterval();
		shelter.ui.showToast("Settings saved!", { type: "success" });
	}
	function addUrl() {
		const url = newUrl().trim();
		if (!url) return;
		const updated = [...urls(), url];
		setUrls(updated);
		setNewUrl("");
		save(updated);
	}
	function removeUrl(index) {
		const updated = [...urls()];
		updated.splice(index, 1);
		setUrls(updated);
		save(updated);
	}
	return (() => {
		const _el$ = (0, import_web$1.getNextElement)(_tmpl$), _el$7 = _el$.firstChild, [_el$8, _co$3] = (0, import_web$2.getNextMarker)(_el$7.nextSibling), _el$2 = _el$8.nextSibling, _el$3 = _el$2.firstChild, [_el$4, _co$] = (0, import_web$2.getNextMarker)(_el$3.nextSibling), _el$5 = _el$4.nextSibling, [_el$6, _co$2] = (0, import_web$2.getNextMarker)(_el$5.nextSibling), _el$9 = _el$2.nextSibling, [_el$0, _co$4] = (0, import_web$2.getNextMarker)(_el$9.nextSibling), _el$1 = _el$0.nextSibling, [_el$10, _co$5] = (0, import_web$2.getNextMarker)(_el$1.nextSibling), _el$11 = _el$10.nextSibling, [_el$12, _co$6] = (0, import_web$2.getNextMarker)(_el$11.nextSibling);
		_el$.style.setProperty("display", "flex");
		_el$.style.setProperty("flex-direction", "column");
		_el$.style.setProperty("gap", "10px");
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(shelter.ui.Header, {
			get tag() {
				return shelter.ui.HeaderTags.H3;
			},
			children: "Wallpaper URLs"
		}), _el$8, _co$3);
		_el$2.style.setProperty("display", "flex");
		_el$2.style.setProperty("gap", "5px");
		(0, import_web$3.insert)(_el$2, (0, import_web$4.createComponent)(shelter.ui.TextBox, {
			get value() {
				return newUrl();
			},
			onInput: (v) => setNewUrl(v),
			placeholder: "Enter wallpaper URL",
			style: { flex: 1 }
		}), _el$4, _co$);
		(0, import_web$3.insert)(_el$2, (0, import_web$4.createComponent)(shelter.ui.Button, {
			onClick: addUrl,
			children: "Add"
		}), _el$6, _co$2);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(shelter.solid.For, {
			get each() {
				return urls();
			},
			children: (url, index) => (() => {
				const _el$13 = (0, import_web$1.getNextElement)(_tmpl$2), _el$14 = _el$13.firstChild, _el$15 = _el$14.nextSibling, [_el$16, _co$7] = (0, import_web$2.getNextMarker)(_el$15.nextSibling);
				_el$13.style.setProperty("display", "flex");
				_el$13.style.setProperty("gap", "5px");
				_el$13.style.setProperty("align-items", "center");
				_el$14.style.setProperty("flex", "1");
				_el$14.style.setProperty("word-break", "break-all");
				(0, import_web$3.insert)(_el$14, url);
				(0, import_web$3.insert)(_el$13, (0, import_web$4.createComponent)(shelter.ui.Button, {
					color: "red",
					onClick: () => removeUrl(index()),
					children: "Remove"
				}), _el$16, _co$7);
				return _el$13;
			})()
		}), _el$0, _co$4);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(shelter.ui.SwitchItem, {
			get value() {
				return rotationEnabled();
			},
			onChange: (v) => {
				setRotationEnabled(v);
				save();
			},
			note: "Pick a new wallpaper every X minutes",
			children: "Enable rotation"
		}), _el$10, _co$5);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(shelter.ui.TextBox, {
			get value() {
				return String(rotationInterval());
			},
			onInput: (v) => {
				setRotationInterval(Number(v));
				save();
			},
			placeholder: "Rotation interval in minutes",
			type: "number",
			style: { width: "100px" }
		}), _el$12, _co$6);
		return _el$;
	})();
};

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
exports.settings = settings
return exports;
})({}, shelter);