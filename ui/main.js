const saveBtn = document.getElementById('save');
const openPage = document.getElementById('config');

openPage.addEventListener('click', () => {
    browser.tabs.create({ url: "./main.html" }).then(window.close());
})

saveBtn.addEventListener('click', () => {
    let url = document.getElementById('url').value.trim();
    let redurl = document.getElementById('redirecturl').value.trim();

    if (url && redurl) {
        // add validation if urls are correct formatted
        saveEntry(url, redurl);
    } else {
        alert('empty field');
    }
});

function saveEntry(url, redurl) {
    browser.storage.local.get('redirects').then((result) => {
        let redirects = result.redirects || {};
        redirects[url] = redurl;
        browser.storage.local.set({ 'redirects': redirects });
    });
}

// displaying the extension storage for redirects

function displayRules(redirects) {
    const tbody = document.getElementsByTagName('tbody');
    tbody.innerHTML = '';

    // get redirects
    for (let [url, redurl] of Object.entries(redirects)) {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${url}</td>
            <td>${redurl}</td>
            <td><button onclick="removeRow(this, '${url}')">remove</button></td>
        `;
        tbody.appendChild(row);
    }
}

function removeRule(button, url) {
    let row = button.parentNode;
    row.parentNode.removeChild(row);
    // remove from local storage as well
    browser.storage.local.get('redirects').then((result) => {
        let redirects = result.redirects || {};
        delete redirects[url];
        browser.storage.local.set({'redirects': redirects })
    });
}

browser.storage.local.get('redirects').then((result) => {
    let redirects = result.redirects || {};
    displayRules(redirects);
})