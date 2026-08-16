export default defineBackground(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: unknown) => {
      console.error(
        "FormatClip could not enable action-click behavior.",
        error,
      );
    });
});
