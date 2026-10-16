(async function(){
  try{
    var s="";
    for(var i=0;i<6;i++){
      s+=await fetch("j"+i+".part?v=2").then(function(r){if(!r.ok)throw new Error("part "+i);return r.text()});
    }
    var el=document.createElement("script");
    el.text=s;
    document.head.appendChild(el);
  }catch(e){
    document.body.innerHTML="<pre style=\"color:#fff;padding:20px\">Failed to load Drift core: "+e+"\nRedeploy or check public/j*.part files.</pre>";
  }
})();
