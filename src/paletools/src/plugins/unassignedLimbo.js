let plugin;

/// #if process.env.UNASSIGNED_LIMBO
plugin = {
    run: () => {
        window.MAX_NEW_ITEMS = Number.MAX_VALUE;
    }
};
/// #endif

export default plugin;