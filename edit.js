let htmlEditor, cssEditor, jsEditor;

function initializeEditors() {
    htmlEditor = CodeMirror(document.getElementById("html-code"), {
        mode: "xml",
        theme: "dracula",
        lineNumbers: true,
        autoCloseTags: true
    });

    cssEditor = CodeMirror(document.getElementById("css-code"), {
        mode: "css",
        theme: "dracula",
        lineNumbers: true
    });

    jsEditor = CodeMirror(document.getElementById("js-code"), {
        mode: "javascript",
        theme: "dracula",
        lineNumbers: true
    });

    // Load saved content
    htmlEditor.setValue(localStorage.getItem('html_code') || '');
    cssEditor.setValue(localStorage.getItem('css_code') || '');
    jsEditor.setValue(localStorage.getItem('js_code') || '');

    // Set up change listeners
    htmlEditor.on("change", run);
    cssEditor.on("change", run);
    jsEditor.on("change", run);
}

function run() {
    // Storing data in Local Storage
    localStorage.setItem('html_code', htmlEditor.getValue());
    localStorage.setItem('css_code', cssEditor.getValue());
    localStorage.setItem('js_code', jsEditor.getValue());

    // Executing HTML, CSS & JS code
    let result = document.getElementById('result');
    result.contentDocument.body.innerHTML = `<style>${cssEditor.getValue()}</style>` + htmlEditor.getValue();
    result.contentWindow.eval(jsEditor.getValue());
}

// Initialize editors when the page loads
window.onload = initializeEditors;