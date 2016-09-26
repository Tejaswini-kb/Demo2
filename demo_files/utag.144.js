//tealium universal tag - utag.144 ut4.0.201609090606, Copyright 2016 Tealium.com Inc. All Rights Reserved.
try{(function(id,loader,u){try{u=utag.o[loader].sender[id]={}}catch(e){u=utag.sender[id]};u.ev={'view':1};u.t='@@',u.i=[],u.p=["//idsync.rlcdn.com/401786.gif?partner_uid=@@lr_cookie_id@@","","","","","","",""];u.cachebust="enabled";u.cachevar=""||"_rnd";u.map={};u.extend=[function(a,b){liveRampOmnitureId=function(){var x=document.cookie;var s_vi_value="";if(x.indexOf("s_vi=")>-1){var y=x.indexOf("s_vi=");var z=x.indexOf("[CE]")
s_vi_value=x.substring(y+12,z);}
else if(x.indexOf("AMCV_A7FC606253FC752B0A4C98A2%40AdobeOrg")>-1){var x_id=decodeURI(document.cookie.replace(/(?:(?:^|.*;\s*)AMCV_A7FC606253FC752B0A4C98A2%40AdobeOrg\s*\=\s*([^;]*).*$)|^.*$/,"$1"));if(x_id.indexOf("|MCMID|"))
{var z=x_id.indexOf("|MCMID|");s_vi_value=x_id.substring(z+7,z+45);}}
return s_vi_value;}},function(a,b){try{if(1){try{b['lr_cookie_id']=liveRampOmnitureId()}catch(e){}}}catch(e){utag.DB(e)}}];u.send=function(a,b,c,d,e,f){if(u.ev[a]){for(c=0;c<u.extend.length;c++){try{d=u.extend[c](a,b);if(d==false)return}catch(e){if(typeof utag_err!='undefined'){utag_err.push({e:'extension error:'+e,s:utag.cfg.path+'utag.'+id+'.js',l:c,t:'ex'})}}};for(c=0;c<u.p.length;c++){if(u.p[c]!=""){var x=u.rp(u.p[c],b);if(x!=""){if(u.cachebust=="enabled"&&x.indexOf("_rnd")<0){x+="&"+u.cachevar+"="+Math.random();}
var img=new Image();img.src=x;u.i.push(img);}}}}}
u.rp=function(a,b){if(typeof a!="undefined"&&a.indexOf(u.t)>0){a=a.replace(/@@([^@]+)@@/g,function(m,d){if(b[d]){return encodeURIComponent(b[d]);}else{return'';}});}
return a;}
try{utag.o[loader].loader.LOAD(id)}catch(e){utag.loader.LOAD(id)}})('144','timeinc.myrecipes.com');}catch(error){utag.DB(error);}
