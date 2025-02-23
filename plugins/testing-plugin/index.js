const {
    util: { awaitDispatch, log },
    flux: { awaitStore, dispatcher, stores },
    patcher
} = shelter;

function modifyFlags(flags, isStaff) {
    return isStaff ? flags | 1 : flags & ~1;
}

let pluginEnabled = true;
let unpatches = [];

function patchActionHandlers() {
    try {
        const nodes = Object.values(
            dispatcher._actionHandlers._dependencyGraph.nodes
        );
        const experimentStore = nodes.find(
            (n) => n?.name === "ExperimentStore"
        );
        const devExperimentStore = nodes.find(
            (n) => n?.name === "DeveloperExperimentStore"
        );

        unpatches.push(
            patcher.before(
                "CONNECTION_OPEN",
                experimentStore.actionHandler,
                ([dispatch]) => {
                    if (dispatch?.user?.flags === undefined) return;

                    const userProxy = new Proxy(dispatch.user, {
                        get(target, prop) {
                            if (prop === "flags") {
                                return modifyFlags(target.flags, pluginEnabled);
                            }
                            return Reflect.get(...arguments);
                        }
                    });

                    const dispatchProxy = new Proxy(dispatch, {
                        get(target, prop) {
                            if (prop === "user") {
                                return userProxy;
                            }
                            return Reflect.get(...arguments);
                        }
                    });
                    return [dispatchProxy];
                }
            )
        );

        unpatches.push(
            patcher.instead(
                "CONNECTION_OPEN",
                devExperimentStore.actionHandler,
                function (args, orig) {
                    const user = stores.UserStore.getCurrentUser();
                    const origFlags = user.flags;
                    user.flags = modifyFlags(user.flags, pluginEnabled);
                    orig.apply(this, args);
                    user.flags = origFlags;
                }
            )
        );
    } catch (e) {
        log(
            `[Developer-Options] Error while trying to patch action handlers: ${e}`,
            "error"
        );
    }
}

async function triggerDevOptions() {
    await awaitStore("DeveloperExperimentStore");

    const actions = Object.values(
        dispatcher._actionHandlers._dependencyGraph.nodes
    );

    actions
        .find((n) => n.name === "DeveloperExperimentStore")
        .actionHandler.CONNECTION_OPEN();
}

export function onLoad() {
    patchActionHandlers();
    triggerDevOptions();
}

export function onUnload() {
    pluginEnabled = false;
    triggerDevOptions().then(() => {
        unpatches.forEach((u) => u());
    });
}