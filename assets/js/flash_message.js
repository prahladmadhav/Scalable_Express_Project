let customNotyFM = (status, message) => {
    new Noty({
        theme: "relax",
        text: message,
        type: status,
        layout: "topRight",
        timeout: 1500,
    }).show();
};
