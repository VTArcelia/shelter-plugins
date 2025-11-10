const id = "flux-intercept-test";

let stopIntercept;

export function onLoad() {
  stopIntercept = shelter.flux.intercept((action) => {
    if (action.type?.includes("TYPING")) {
      console.log("[FluxInterceptTest] Blocked:", action.type);
      return false;
    }

    return action; 
  });
}

export function onUnload() {
  if (stopIntercept) stopIntercept();
}

