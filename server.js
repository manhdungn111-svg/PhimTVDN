// Server đồng bộ XemPhim: node server.js  (mặc định cổng 8787)
const http=require('http'),fs=require('fs'),F='sync-data.json';
let DB={};try{DB=JSON.parse(fs.readFileSync(F))}catch{}
const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Content-Type':'application/json'};
http.createServer((q,s)=>{
  const done=(c,o)=>{s.writeHead(c,H);s.end(JSON.stringify(o||{}))};
  if(q.method==='OPTIONS')return done(204);
  const u=new URL(q.url,'http://x');if(u.pathname!=='/sync')return done(404);
  if(q.method==='GET'){const r=DB[u.searchParams.get('user')];if(!r)return done(404);return r.token===u.searchParams.get('token')?done(200,{data:r.data}):done(401)}
  let b='';q.on('data',c=>{b+=c;if(b.length>5e6)q.destroy()});
  q.on('end',()=>{try{const {user,token,data}=JSON.parse(b);if(!user||!token)return done(400);const r=DB[user];if(r&&r.token!==token)return done(401);
    DB[user]={token,data};fs.writeFileSync(F,JSON.stringify(DB));done(200,{ok:1})}catch{done(400)}});
}).listen(process.env.PORT||8787,()=>console.log('Sync server chạy tại cổng',process.env.PORT||8787));
