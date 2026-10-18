// google.script.run kompatibilis réteg: a felület régi hívásai (withSuccessHandler / withFailureHandler / függvénynév)
// változatlanul működnek, de a kérés az app főfolyamatán át megy a 2.0 szerverre (preload.js › window.aku.call).
(function () {
  function futtat(ok, hiba) {
    return new Proxy({}, {
      get: function (_, nev) {
        if (nev === 'withSuccessHandler') return function (f) { return futtat(f, hiba); };
        if (nev === 'withFailureHandler') return function (f) { return futtat(ok, f); };
        if (typeof nev !== 'string' || nev === 'then') return undefined;
        return function () {
          var args = Array.prototype.slice.call(arguments);
          window.aku.call(nev, args).then(function (r) {
            if (r && r.ok) { if (ok) ok(r.value); }
            else if (hiba) hiba({ message: (r && r.error) || 'Ismeretlen hiba' });
            else console.error(nev, r && r.error);
          }, function (e) { if (hiba) hiba({ message: String(e && e.message || e) }); });
        };
      }
    });
  }
  window.google = { script: { run: futtat(null, null) } };
})();
