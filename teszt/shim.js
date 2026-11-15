// BEMUTATÓ: nincs szerverkapcsolat, minden válasz kitalált. A valódi adatokhoz nem ér hozzá.
(function(){
  function futtat(ok,hiba){return new Proxy({},{get:function(_,nev){
    if(nev==='withSuccessHandler')return function(f){return futtat(f,hiba)};
    if(nev==='withFailureHandler')return function(f){return futtat(ok,f)};
    if(typeof nev!=='string'||nev==='then')return undefined;
    return function(){var a=[].slice.call(arguments);
      if(nev==='getData')return;
      if(nev==='specialisBeallit'){var m=a[2],x=a[3];setTimeout(function(){var r={f:null,b:null};r[m]=x;ok&&ok(r)},150);return;}
      if(nev==='getSpecialisErtek'){setTimeout(function(){ok&&ok({})},100);return;}
      if(nev==='teendokSync'){setTimeout(function(){ok&&ok(a[1])},100);return;}
      if(nev==='rendelesKeres'){setTimeout(function(){ok&&ok([])},200);return;}
      if(nev==='pannonEmailPiszkozat'){setTimeout(function(){alert('BEMUTATÓ: itt készülne a Gmail piszkozat\n\nCímzett: info@pannonxp.hu\nTárgy: '+a[1].map(function(x){return String(x).slice(5,12)}).join(', '));ok&&ok({url:'about:blank',targy:a[1].map(function(x){return String(x).slice(5,12)}).join(', '),db:a[1].length})},300);return;}
      if(nev==='cimkeNyomtat'){setTimeout(function(){alert('BEMUTATÓ: itt készülne a címke PDF ('+a[1].length+' csomag).');ok&&ok({url:'about:blank',cimke:a[1].length,oldal:1})},300);return;}
    };}});}
  window.google={script:{run:futtat(null,null)}};
})();
