(function(){
  function nap(n){return ymd(new Date(Date.now()-n*864e5));}
  var ma=nap(0),zz=0;
  function sz(){zz++;return '2026'+String(1000000+zz*7919).padStart(8,'0')+'0000'+String(1000+zz)}
  function sor(no,fel,nev,varos,uv,kod,kez,forras){return [sz(),no,fel,nev,varos,'1111',uv,kod,fel,kez,1,forras||'Pannon','','','','','','','','','PABU',true,''];}
  var cs=[
    sor('#10412',nap(5),'Szabó Építő Kft.','Győr',312000,80,'','Pannon'),
    sor('#10388',nap(10),'Tóth Anna','Pécs',0,50,'','Pannon'),
    sor('#10435',nap(1),'Varga Stúdió Kft.','Budapest',275000,80,'','Pannon'),
    sor('#10443',nap(1),'Kiss Péter','Szeged',64900,50,'','myPXP'),
    sor('#10399',nap(2),'Horváth Iroda','Debrecen',420000,90,ma+' 09:40','Pannon'),
    sor('#10473',nap(4),'Kovács Béla','Miskolc',38400,30,'','Pannon'),
    sor('#10476',nap(4),'Oláh Sándor','Nyíregyháza',12900,30,'','Pannon'),
    sor('#10481',nap(4),'Simon Réka','Szolnok',45900,30,'','Pannon'),
    sor('#10482',nap(4),'Hegedűs Tamás','Győr',27500,30,'','Pannon')
  ];
  var id=function(no){return cs.filter(function(r){return r[1]===no})[0][0]};
  var rend=function(n,no,nev,varos,osszeg,fiz,lanc,jelek,mj){return {id:String(n),no:no,datum:new Date(Date.now()-3600e3*(2+n)).toISOString(),nev:nev,ceg:'',varos:varos,irsz:'1111',cim:'Fő utca '+n+'.',tel:'+36 20 111 22'+(10+n),email:'vevo'+n+'@pelda.hu',tetelek:[{szin:'Pecan',db:6,kicsi:false,nev:'Pecan'}],panel:6,kicsi:0,ragaszto:6,egyeb:[],szinDb:1,suly:30,osszeg:osszeg,fizetes:fiz,fizStatusz:fiz==='Kártya'?'PAID':'PENDING',jelek:jelek||[],levelek:[],kuponok:[],csomagok:[],lanc:lanc||{},megjegyzes:mj||'',attr:[]}};
  D={lapok:[{ido:new Date(Date.now()-3600e3*3).toISOString(),tip:'cimke',fiok:'PABU',sz:[id('#10473'),id('#10476')]}],
    rendelesek:[
      rend(1,'#10520','Fekete Építőház Kft.','Budapest',186000,'Kártya',{pxp:'1234567',export:'x'}),
      rend(2,'#10523','Orosz Vendéglő','Eger',92000,'Utánvét',{export:'x'}),
      rend(3,'#10526','Sima Rendelés','Pécs',24500,'Utánvét',{},[],'Kérem hívjon előtte'),
      rend(4,'#10529','Kártyás Katalin','Szeged',31900,'Kártya',{}),
      rend(5,'#10531','Dupla Dénes','Győr',58000,'Utánvét',{},[{t:'DUPLA FELADÁS?',s:'piros',gy:1}])],
    hibak:[],frissitve:new Date().toISOString(),
    pxp:{lista:[{sz:id('#10412'),levelek:[{id:'x',nev:'Szabó',targy:'Hol tart a csomagom?',datum:ma+'T07:48',gond:true,biztos:true}],jelek:[]}],cs:{sor:cs,tol:nap(30),unnep:[],api:{}},naplo:true,hibak:[]},
    specialis:{kert:{'#10412':{nap:nap(1),fu:'csak 8-12 között'},'#10435':{nap:nap(-3),fu:''}},kezi:{'#10520':{f:1,b:null}},hatar:200000},
    beall:{elakadt:3,autoKg:1400,sok:70},mai:null,ido:{ossz:1,reszek:{}}};
  var ido=new Date(Date.now()-3600e3).toISOString();
  TB={v:1,torolt:[],kartyak:[
    {id:'a1',cim:'Ragasztót küldeni #10388',jegyzet:'Tóth Anna kérte, kimaradt a csomagból',oszlop:'teendo',sz:0,modositva:ido,ert:true,rendeles:'',kihez:'Tóth Anna',rend:null,lista:[]},
    {id:'a2',cim:'Visszahívni Szabó Építőt',oszlop:'teendo',sz:1,modositva:ido,ert:false,kihez:'Szabó úr',lista:[]},
    {id:'a3',cim:'Visszaküldés intézése #10412',oszlop:'folyamat',sz:0,modositva:ido,lista:[{t:'Futár megrendelve',k:true},{t:'Visszaérkezett',k:false}]},
    {id:'a5',cim:'Elintézett csere',oszlop:'kesz',sz:0,modositva:ido,lista:[]}]};
  // értesítés-bemutató (valódi push csak az éles változatban)
  var PUSH_BE=false;
  pushRajz=function(){var el=document.getElementById('push-doboz');if(!el)return;
    el.innerHTML=PUSH_BE?'<div class="sub" style="margin-bottom:8px">Bekapcsolva ezen az eszközön (bemutató).</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" onclick="pushTesztGomb()">Teszt értesítés</button><button class="btn" onclick="pushKi()">Kikapcsolás</button></div>':'<button class="btn fo" onclick="pushBe()">Értesítések bekapcsolása</button>';};
  pushBe=function(){PUSH_BE=true;toast('BEMUTATÓ: itt kérne engedélyt az iPhone','ok',5);pushRajz();};
  pushKi=function(){PUSH_BE=false;pushRajz();};
  pushTesztGomb=function(){toast('BEMUTATÓ: az éles változatban itt érkezne a valódi értesítés','ok',6);};
  // jelző sáv
  var b=document.createElement('div');b.textContent='BEMUTATÓ · kitalált adatok · nem ér hozzá a valódinak';b.style.cssText='position:fixed;top:0;left:0;right:0;z-index:99;background:#b45309;color:#fff;font:600 11.5px -apple-system,sans-serif;text-align:center;padding:3px 6px;padding-top:calc(3px + env(safe-area-inset-top));pointer-events:none';document.body.appendChild(b);
  try{rajz()}catch(e){}
  ful('bent');
  document.getElementById('upd').textContent='Bemutató';
})();
