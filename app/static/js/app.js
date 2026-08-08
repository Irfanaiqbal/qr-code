const state={type:"website",logo:null,logoName:"",style:"rounded",logoSize:18,qrColor:"#ff6759",bgColor:"#fffaf1",size:1000};

const brands=[
["Instagram","instagram"],["Facebook","facebook"],["WhatsApp","whatsapp"],["YouTube","youtube"],["GitHub","github"],["LinkedIn","linkedin"],["X","x"],["Telegram","telegram"],["TikTok","tiktok"],["Discord","discord"],
["Spotify","spotify"],["Google","google"],["Apple","apple"],["Android","android"],["Microsoft","microsoft"],["Windows","windows"],["Amazon","amazon"],["Reddit","reddit"],["Pinterest","pinterest"],["Snapchat","snapchat"],
["Twitch","twitch"],["Steam","steam"],["PlayStation","playstation"],["Xbox","xbox"],["Nintendo","nintendo"],["Netflix","netflix"],["Prime Video","primevideo"],["Google Drive","googledrive"],["Dropbox","dropbox"],["OneDrive","onedrive"],
["Gmail","gmail"],["Google Maps","googlemaps"],["Google Meet","googlemeet"],["Google Calendar","googlecalendar"],["Chrome","googlechrome"],["Firefox","firefox"],["Brave","brave"],["Opera","opera"],["Safari","safari"],["Slack","slack"],
["Zoom","zoom"],["Notion","notion"],["Figma","figma"],["Canva","canva"],["Trello","trello"],["Asana","asana"],["Jira","jira"],["Atlassian","atlassian"],["GitLab","gitlab"],["Bitbucket","bitbucket"],
["Vercel","vercel"],["Netlify","netlify"],["Cloudflare","cloudflare"],["Render","render"],["Docker","docker"],["Kubernetes","kubernetes"],["Python","python"],["JavaScript","javascript"],["Node.js","nodedotjs"],["React","react"],
["Vue.js","vuedotjs"],["Angular","angular"],["Next.js","nextdotjs"],["Tailwind","tailwindcss"],["Stack Overflow","stackoverflow"],["Medium","medium"],["WordPress","wordpress"],["Shopify","shopify"],["Wix","wix"],["Squarespace","squarespace"],
["PayPal","paypal"],["Stripe","stripe"],["Visa","visa"],["Mastercard","mastercard"],["Razorpay","razorpay"],["PhonePe","phonepe"],["Google Pay","googlepay"],["Paytm","paytm"],["UPI","upi"],["Airbnb","airbnb"],
["Uber","uber"],["Uber Eats","ubereats"],["Booking.com","bookingdotcom"],["Tripadvisor","tripadvisor"],["DHL","dhl"],["FedEx","fedex"],["Nike","nike"],["Adidas","adidas"],["Puma","puma"],["Coca-Cola","cocacola"],
["Pepsi","pepsi"],["McDonald's","mcdonalds"],["KFC","kfc"],["Starbucks","starbucks"],["Red Bull","redbull"],["Tesla","tesla"],["BMW","bmw"],["Mercedes-Benz","mercedes"],["Toyota","toyota"],["Honda","honda"]
];

const fields=document.getElementById("fields");
const specs={
website:`<div class="field-grid"><div class="field full"><label>Website URL</label><input id="url" type="url" placeholder="https://example.com" value="https://example.com"></div></div>`,
text:`<div class="field-grid"><div class="field full"><label>Your text</label><textarea id="text" placeholder="Type anything you want to share…">Hello from GGL QR Studio!</textarea></div></div>`,
email:`<div class="field-grid"><div class="field"><label>Email address</label><input id="email" type="email" placeholder="hello@example.com"></div><div class="field"><label>Subject</label><input id="subject" placeholder="Hello"></div><div class="field full"><label>Message</label><textarea id="body" placeholder="Write your message…"></textarea></div></div>`,
phone:`<div class="field-grid"><div class="field full"><label>Phone number</label><input id="phone" type="tel" placeholder="+91 98765 43210"></div></div>`,
sms:`<div class="field-grid"><div class="field"><label>Phone number</label><input id="smsPhone" type="tel" placeholder="+91 98765 43210"></div><div class="field"><label>Message</label><input id="smsMessage" placeholder="Hello!"></div></div>`,
wifi:`<div class="field-grid"><div class="field"><label>Network name (SSID)</label><input id="ssid" placeholder="My Wi‑Fi"></div><div class="field"><label>Password</label><input id="wifiPass" type="password" placeholder="Password"></div><div class="field"><label>Security</label><select id="security"><option>WPA</option><option>WEP</option><option value="">None</option></select></div><div class="field"><label>Hidden network</label><select id="hidden"><option value="false">No</option><option value="true">Yes</option></select></div></div>`,
contact:`<div class="field-grid"><div class="field"><label>Full name</label><input id="name" placeholder="Alex Johnson"></div><div class="field"><label>Organization</label><input id="org" placeholder="GGL Studio"></div><div class="field"><label>Phone</label><input id="cphone" placeholder="+91…"></div><div class="field"><label>Email</label><input id="cemail" placeholder="hello@example.com"></div><div class="field"><label>Website</label><input id="cweb" placeholder="https://example.com"></div><div class="field"><label>Address</label><input id="address" placeholder="City, Country"></div></div>`,
whatsapp:`<div class="field-grid"><div class="field"><label>WhatsApp number</label><input id="waPhone" placeholder="+91 98765 43210"></div><div class="field"><label>Pre-filled message</label><input id="waMessage" placeholder="Hi! I found you via your QR."></div></div>`
};

function setType(t){
 state.type=t;
 document.querySelectorAll(".type").forEach(b=>b.classList.toggle("active",b.dataset.type===t));
 fields.innerHTML=specs[t]; update();
}
document.querySelectorAll(".type").forEach(b=>b.onclick=()=>setType(b.dataset.type));

function val(id){return document.getElementById(id)?.value||""}
function esc(s){return String(s).replace(/([\\;,:"])/g,"\\$1")}
function qrData(){
 switch(state.type){
 case"website":return val("url").trim();
 case"text":return val("text");
 case"email":return`MATMSG:TO:${val("email")};SUB:${val("subject")};BODY:${val("body")};;`;
 case"phone":return`tel:${val("phone").trim()}`;
 case"sms":return`SMSTO:${val("smsPhone").trim()}:${val("smsMessage")}`;
 case"wifi":return`WIFI:T:${val("security")};S:${esc(val("ssid"))};P:${esc(val("wifiPass"))};H:${val("hidden")};`;
 case"contact":return`BEGIN:VCARD\nVERSION:3.0\nFN:${val("name")}\nORG:${val("org")}\nTEL:${val("cphone")}\nEMAIL:${val("cemail")}\nURL:${val("cweb")}\nADR:${val("address")}\nEND:VCARD`;
 case"whatsapp":return`https://wa.me/${val("waPhone").replace(/\D/g,"")}?text=${encodeURIComponent(val("waMessage"))}`;
 }
}

const brandGrid=document.getElementById("brandGrid");
function iconUrl(slug){return`https://cdn.simpleicons.org/${slug}`}
function renderBrands(filter=""){
 const f=filter.trim().toLowerCase();brandGrid.innerHTML="";
 brands.filter(([n])=>n.toLowerCase().includes(f)).forEach(([name,slug])=>{
  const b=document.createElement("button");b.className="brand-item";
  b.innerHTML=`<img loading="lazy" src="${iconUrl(slug)}" alt=""><span>${name}</span>`;
  b.onclick=()=>{state.logo=iconUrl(slug);state.logoName=name;document.querySelectorAll(".brand-item").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.getElementById("fileStatus").textContent=`✓ ${name} logo selected`;update()};
  brandGrid.appendChild(b);
 });
}
renderBrands();
document.getElementById("brandSearch").addEventListener("input",e=>renderBrands(e.target.value));

let qr=new QRCodeStyling({
 width:1000,height:1000,type:"canvas",data:"https://example.com",margin:22,
 qrOptions:{errorCorrectionLevel:"H"},
 dotsOptions:{color:"#ff6759",type:"rounded"},
 cornersSquareOptions:{color:"#ff6759",type:"extra-rounded"},
 cornersDotOptions:{color:"#ff6759",type:"dot"},
 backgroundOptions:{color:"#fffaf1"},
 imageOptions:{crossOrigin:"anonymous",margin:7,hideBackgroundDots:true,imageSize:.18}
});
qr.append(document.getElementById("qrPreview"));

const styleMap={
rounded:{dots:"rounded",cornersSquare:"extra-rounded",cornersDot:"dot"},
dots:{dots:"dots",cornersSquare:"dot",cornersDot:"dot"},
classy:{dots:"classy",cornersSquare:"extra-rounded",cornersDot:"square"},
square:{dots:"square",cornersSquare:"square",cornersDot:"square"}
};

function contrastOK(fg,bg){
 const lum=h=>{let c=h.slice(1).match(/../g).map(x=>parseInt(x,16)/255);c=c.map(x=>x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4));return.2126*c[0]+.7152*c[1]+.0722*c[2]};
 const a=lum(fg),b=lum(bg);return(Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=3;
}
function update(){
 state.qrColor=document.getElementById("qrColor").value;state.bgColor=document.getElementById("bgColor").value;state.size=+document.getElementById("size").value;
 const st=styleMap[state.style];
 qr.update({
  width:state.size,height:state.size,data:qrData()||"https://example.com",
  dotsOptions:{color:state.qrColor,type:st.dots},
  cornersSquareOptions:{color:state.qrColor,type:st.cornersSquare},
  cornersDotOptions:{color:state.qrColor,type:st.cornersDot},
  backgroundOptions:{color:state.bgColor},
  image:state.logo||undefined,
  imageOptions:{crossOrigin:"anonymous",margin:8,hideBackgroundDots:true,imageSize:state.logoSize/100}
 });
 document.getElementById("qrHex").textContent=state.qrColor.toUpperCase();
 document.getElementById("bgHex").textContent=state.bgColor.toUpperCase();
 document.getElementById("logoSizeLabel").textContent=state.logoSize+"%";
 document.getElementById("sizeLabel").textContent=`${state.size} × ${state.size} px`;
 document.getElementById("previewSize").textContent=`${state.size} × ${state.size} px`;
 document.getElementById("previewType").textContent=state.type[0].toUpperCase()+state.type.slice(1)+" QR";
 const badge=document.getElementById("scanBadge");badge.textContent=contrastOK(state.qrColor,state.bgColor)?"✓ Scan-friendly":"⚠ Low contrast";
 badge.className="scan-badge "+(contrastOK(state.qrColor,state.bgColor)?"":"warning");
}

document.querySelectorAll(".type").forEach(b=>b.onclick=()=>setType(b.dataset.type));
document.getElementById("qrColor").oninput=update;
document.getElementById("bgColor").oninput=update;
document.getElementById("size").onchange=update;
document.getElementById("logoSize").oninput=e=>{state.logoSize=+e.target.value;update()};
document.querySelectorAll(".style-choice").forEach(b=>b.onclick=()=>{state.style=b.dataset.style;document.querySelectorAll(".style-choice").forEach(x=>x.classList.toggle("active",x===b));update()});

document.querySelectorAll(".tab[data-tab]").forEach(b=>b.onclick=()=>{
 document.getElementById("uploadPanel").classList.toggle("hidden",b.dataset.tab!=="upload");
 document.getElementById("brandsPanel").classList.toggle("hidden",b.dataset.tab!=="brands");
 document.querySelectorAll(".tab[data-tab]").forEach(x=>x.classList.toggle("active",x===b));
});

document.getElementById("clearLogo").onclick=()=>{
 state.logo=null;state.logoName="";
 document.getElementById("logoFile").value="";
 document.getElementById("fileStatus").textContent="Logo removed.";
 document.querySelectorAll(".brand-item").forEach(x=>x.classList.remove("active"));
 update();
};

document.getElementById("logoFile").onchange=e=>{
 const file=e.target.files[0];if(!file)return;
 if(!["image/png","image/jpeg"].includes(file.type)||file.size>2*1024*1024){
  e.target.value="";document.getElementById("fileStatus").textContent="❌ Please choose a PNG/JPG/JPEG under 2 MB.";return;
 }
 const reader=new FileReader();
 reader.onload=()=>{
  state.logo=reader.result;state.logoName=file.name;
  document.getElementById("fileStatus").textContent=`✓ ${file.name} selected • ${Math.round(file.size/1024)} KB`;
  update();
 };
 reader.readAsDataURL(file);
};

document.querySelectorAll(".download").forEach(btn=>btn.onclick=()=>{
 qr.download({name:"ggl-qr",extension:btn.dataset.ext});
 fetch("/api/log-generation",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({kind:state.type,size_px:state.size})}).catch(()=>{});
});

let timer;
fields.addEventListener("input",()=>{clearTimeout(timer);timer=setTimeout(update,120)});
setType("website");
