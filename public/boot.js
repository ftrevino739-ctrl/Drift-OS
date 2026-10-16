(async function(){
  async function loadGZ(urls){
    var b64='';
    for(var i=0;i<urls.length;i++) b64+=await fetch(urls[i]+'?v=4').then(function(r){if(!r.ok)throw new Error(urls[i]);return r.text()});
    var bin=Uint8Array.from(atob(b64.replace(/\s/g,'')),function(c){return c.charCodeAt(0)});
    var ds=new DecompressionStream('gzip');
    var stream=new Response(bin).body.pipeThrough(ds);
    return await new Response(stream).text();
  }
  try{
    var css=await loadGZ(['c0.b64','c1.b64']);
    var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
    var js=await loadGZ(['g00.b64','g01.b64','g02.b64','g03.b64','g10.b64','g11.b64','g12.b64','g13.b64','g20.b64','g21.b64','g22.b64','g23.b64']);
    var el=document.createElement('script'); el.text=js; document.head.appendChild(el);
  }catch(e){
    document.body.insertAdjacentHTML('beforeend','<pre style="color:#f66;padding:16px;position:relative;z-index:9">Load error: '+e+'</pre>');
  }
})();
