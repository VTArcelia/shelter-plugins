(function(exports) {

"use strict";

//#region plugins/SilentTyping/index.tsx
const { flux: { intercept } } = shelter;
const unintercept = intercept((dispatch) => {
	if (dispatch.type === "TYPING_START_LOCAL") return false;
});
const onUnload = () => {
	unintercept();
};

//#endregion
exports.onUnload = onUnload
return exports;
})({});