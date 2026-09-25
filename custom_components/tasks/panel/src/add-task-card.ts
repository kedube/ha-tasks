/**
 * Entry point of the Add Task card bundle, which Home Assistant loads on
 * every dashboard (add_extra_js_url). HA imports extra modules alongside its
 * own frontend, and the frontend replaces window.customElements with a scoped
 * registry early in its startup. Served from the browser cache, this bundle
 * can run before that swap — and elements defined in the registry being
 * replaced are never found again ("Custom element doesn't exist"). So the
 * card and the elements inside it are only defined once the frontend has
 * defined <home-assistant>, which it does in the registry it keeps.
 */
const whenFrontendReady = (): Promise<void> => new Promise((resolve) => {
    const check = () => {
        if (customElements.get("home-assistant")) resolve();
        else setTimeout(check, 50);
    };
    check();
});

whenFrontendReady().then(() => import("./add-task-card-element"));
