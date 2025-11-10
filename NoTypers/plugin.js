(function(exports) {

"use strict";

//#region plugins/NoTypers/index.js
let stopIntercept;
function onLoad() {
	stopIntercept = shelter.flux.intercept((action) => {
		if (action.type?.includes("TYPING")) {
			console.log("[FluxInterceptTest] Blocked:", action.type);
			return false;
		}
		return action;
	});
}
function onUnload() {
	if (stopIntercept) stopIntercept();
}

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
return exports;
})({});