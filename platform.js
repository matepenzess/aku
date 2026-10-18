// Böngészős (telefonos) futtatás: ha nincs Electron-híd (window.aku), ez adja a szerverhívást és a helyi tárolást.
// Az Electron appban a preload.js már létrehozta a window.aku-t, ilyenkor ez a fájl nem csinál semmit.
(function () {
  if (window.aku) return;
  window.AKU_WEB = true;
  var LS = null; try { LS = window.localStorage; } catch (e) {}
  function get(k) { try { return LS.getItem(k) || ''; } catch (e) { return ''; } }
  function set(k, v) { try { LS.setItem(k, v); } catch (e) {} }
  function conf() { return { url: get('aku_url'), key: get('aku_key') }; }

  window.aku = {
    call: function (fn, args) {
      var c = conf();
      if (!c.url || !c.key) { setup(); return Promise.resolve({ ok: false, error: 'Nincs beállítva a kapcsolat.' }); }
      var a = Array.isArray(args) ? args.slice() : [];
      a[0] = c.key;
      return fetch(c.url, { method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ k: c.key, fn: fn, args: a }) })
        .then(function (r) { return r.text(); })
        .then(function (t) { try { return JSON.parse(t); } catch (e) { return { ok: false, error: 'A szerver válasza nem értelmezhető.' }; } })
        .catch(function () { return { ok: false, error: 'Nem érhető el a szerver (nincs kapcsolat).' }; });
    },
    board: {
      load: function () { try { return Promise.resolve(JSON.parse(get('aku_teendok') || 'null')); } catch (e) { return Promise.resolve(null); } },
      save: function (d) { set('aku_teendok', JSON.stringify(d)); return Promise.resolve(true); }
    },
    onMenu: function () {}, settings: {}
  };

  // Első indítás / kapcsolat módosítása
  function setup() {
    if (document.getElementById('aku-setup')) return;
    var c = conf(), d = document.createElement('div');
    d.id = 'aku-setup';
    d.innerHTML = '<style>#aku-setup{position:fixed;inset:0;z-index:99;background:var(--bg,#fff);color:var(--tx,#1d1d1f);display:flex;align-items:center;justify-content:center;padding:24px;font:16px/1.4 -apple-system,BlinkMacSystemFont,sans-serif}' +
      '#aku-setup form{width:100%;max-width:420px}#aku-setup h1{font-size:28px;margin:0 0 6px}#aku-setup p{color:var(--mu,#6e6e73);margin:0 0 20px}' +
      '#aku-setup label{display:block;font-size:13px;font-weight:600;margin:14px 0 6px}#aku-setup input{width:100%;box-sizing:border-box;height:44px;border:0;border-radius:10px;background:var(--field,#ececf0);color:inherit;padding:0 12px;font:inherit;font-size:16px}' +
      '#aku-setup button{width:100%;height:48px;border:0;border-radius:12px;background:var(--acc,#0a60d0);color:var(--accTx,#fff);font:inherit;font-weight:600;margin-top:22px}#aku-setup .m{color:var(--r,#c42b2b);font-size:14px;min-height:20px;margin-top:10px}</style>' +
      '<form><h1>AKU</h1><p>Add meg a szerver címét és a telefonkulcsot. Egyszer kell, utána megjegyzi.</p>' +
      '<label for="as-u">Szerver címe</label><input id="as-u" inputmode="url" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="https://script.google.com/macros/s/…/exec">' +
      '<label for="as-k">Telefonkulcs</label><input id="as-k" type="password" autocapitalize="off" autocorrect="off" spellcheck="false">' +
      '<div class="m" id="as-m" role="status"></div><button type="submit">Belépés</button></form>';
    document.body.appendChild(d);
    document.getElementById('as-u').value = c.url;
    d.querySelector('form').onsubmit = function (e) {
      e.preventDefault();
      var u = document.getElementById('as-u').value.trim(), k = document.getElementById('as-k').value || c.key;
      var m = document.getElementById('as-m');
      if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(u)) { m.textContent = 'A cím így kezdődjön: https://script.google.com/macros/s/…/exec'; return; }
      if (!k) { m.textContent = 'Add meg a kulcsot.'; return; }
      m.textContent = 'Ellenőrzés…';
      fetch(u, { method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ k: k, fn: 'appInfo', args: [k] }) })
        .then(function (r) { return r.json(); })
        .then(function (j) { if (j && j.ok) { set('aku_url', u); set('aku_key', k); location.reload(); } else m.textContent = (j && j.error) || 'Nem sikerült.'; })
        .catch(function () { m.textContent = 'Nem érhető el a szerver. Ellenőrizd a címet és a kapcsolatot.'; });
    };
    document.getElementById('as-u').focus();
  }
  window.AKU_KAPCSOLAT = setup;
  window.AKU_KILEP = function () { set('aku_key', ''); location.reload(); };
  document.addEventListener('DOMContentLoaded', function () { var c = conf(); if (!c.url || !c.key) setup(); });
  if ('serviceWorker' in navigator && /^https:|^http:\/\/localhost/.test(location.href)) {
    // Új verzió esetén egyszer magától újratölt, hogy ne maradjon a régi kód a memóriában
    var volt = !!navigator.serviceWorker.controller, ujra = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () { if (volt && !ujra) { ujra = true; location.reload(); } });
    navigator.serviceWorker.register('sw.js').then(function (r) { try { r.update(); } catch (e) {} }).catch(function () {});
  }
})();
