let profileList = loadArray('profiles');
let blessedHats = ['clippy','peedy','whiteobama','qmark','yahu','sunglasses','spongebob','whiteobama','witch','silverfedora','pumpkin','illuminati','cigar','dank','cauldron','bathbomb'];

profileList = profileList == null ? [ {name:'Anonymous',color:'purple',hats:[],godmodePass:null,bonzicoinPass:null,uses:0} ] : profileList;
if(typeof profileList[0].bonzicoinPass == 'undefined')profileList[0].bonzicoinPass=null;
let disconnectHandle = () => {};
let notifyUserEvent_BONZICOIN = true;
let notifyUserEvent_ERROR = true;
var socket = io(location.href,{reconnection:false});
var first = true;
var userAmt = 0;
var userlist = [];
var bonzislist = [];
var mousex = 0;
var mousey = 0;
var myLevel = 1;
var myId = Math.random().toString();
var bonziZCounter = 100;
var replyTarget = null;
var worldActive = false;
var myWallet = {hasAccount:false, coins:0, hats:[], vehicles:[], equippedVehicle:null, company:null};

let listenerNames = ["msg","asshole","userlist","leave","newuser","room","userEvent","wallet","stocksUpdate","bonzicoinErr","coinGiftReceived","stockPosition","stockSold","userMoveTo","worldSync","userVehicle","vehicleDestroyed","vehiclePresets"];
function setCookie(cname,cvalue,exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function markupify(text,removeMarkupze=false){
	let keys = {
		'**':{pair:['<div class="md-bold">','</div>'],open:false},
		'~~':{pair:['<div class="md-italics">','</div>'],open:false},
		'$r$':{pair:['<div class="md-rainbow">','</div>'],open:false},
		'``':{pair:['<div class="md-code">','</div>'],open:false},
		'__':{pair:['<u>','</u>'],open:false},
		'--':{pair:['<del>','</del'],open:false},
		'%%':{pair:['<marquee>','</marquee>'],open:false},
	};
	let keyList = Object.keys(keys);
	while(keyList.some(r => text.includes(r))){
		keyList.forEach(keyName => {
			if(removeMarkupze){
				text = text.replaceAll(keyName,'')
			} else {
				if(keys[keyName].open){
					text = text.replace(keyName,keys[keyName].pair[1]);
				} else {
					text = text.replace(keyName,keys[keyName].pair[0]);
				}
				keys[keyName].open = !keys[keyName].open;
			}
		    
		});
	}

	return text;
}
function reversify(newArray){
	let result = [];

	for(let i=newArray.length-1;i>0;i--){
		result.push(newArray[i]);
	}
	return result;
}
class Notify {
    constructor(properties={title:"Alert",icon:"./img/desktop/infobubble.png",body:"Empty",parent:'info_icon'}){
        properties.title = properties.title || "Alert";
        properties.icon = properties.icon || "./img/desktop/infobubble.png";
        properties.body = properties.body || "Empty";
        properties.parent = properties.parent || 'info_icon';
        this.properties = properties;
        this.id = Id(5);
        let r = document.getElementById(properties.parent).getBoundingClientRect();
        let w = 350; let h = 100;
        let x = r.x-w;
        let y = r.y-h;
        document.getElementById('content').insertAdjacentHTML('beforeend',`
            <div class="bubble_chat" style="left:${x}px;top:${y}px;width:350px;height:100px;padding:0px 0px;max-width:400px;max-height:100px;z-index:9999;" id="${this.id}">
                <div style="padding:0px;height:10px;margin-top:-25px;"><img src="${properties.icon}" width="14" height="14"> &nbsp; <b>${properties.title}</b> <button style="width:20px;height:20px;float:right;" onclick="document.getElementById('${this.id}').remove();document.getElementById('icon_toggle_btn').style.visibility = 'visible';">X</button></div>
            <div style="height:max-content;font-family:'WinXP';font-size:16px;overflow:hidden;padding:3px;">${properties.body}</div>
        </div>
        `);
        let nopelie = () => {
           if(document.getElementById(this.id) !== null){
               r = document.getElementById(properties.parent).getBoundingClientRect();
               x = r.x-w;
               y = r.y-h;
               document.getElementById(this.id).style.left = x+"px";
               document.getElementById(this.id).style.top = y+"px";
           } 
        };
        window.onresize = () => {nopelie();};
        document.onresize = () => {nopelie();};
        document.getElementById('icon_toggle_btn').style.visibility = 'hidden';
        setTimeout(() => {if(document.getElementById(this.id) != null)document.getElementById('icon_toggle_btn').style.visibility = 'visible';},8000);
    }
};
function insertNuke(x,y,color){
    let localId = Id(5);
    document.body.insertAdjacentHTML('beforeend',`
    <div style="width:200px;height:200px;overflow:hidden;position:absolute;left:${x}px;top:${y}px;animation:flyaway 1s ease-in;z-index:999;" id="${localId}">
        <div style="overflow:hidden;width:200px;height:160px;">
            <img src="${color}" width="3300" height="auto">
        </div>
        <img src="./img/desktop/nuke.gif" width="200" height="auto" style="position:relative;top:-200px;">
        
    </div>
    `);
    setTimeout(() => {document.getElementById(localId).remove();},1000);
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}
let errs = {
	"applet_open":()=>{new Dialog({width:280,height:100,html:`That applet is already open!`,title:'Error'});}
};
function saveArray(name,toSave){
	let stringified = JSON.stringify(toSave);
	setCookie(name,stringified,365);
}
function loadArray(arrayName){
	let loaded = getCookie(arrayName);
	if(loaded === null) {
		return null;
	}
	try {
		let result = JSON.parse(loaded);
		return result;
	} catch(e) {
		console.error("Error parsing loadArray:", e);
		return null;
	}
}
var logtxt = `
	<i>Welcome to BonziWORLD XP</i>
	<hr>
`;

let hatList = {
  "wizard": "./img/bonzi/hats/wizard.png",
  "windows": "./img/bonzi/hats/windows.png",
  "truck": "./img/bonzi/hats/truck.png",
  "rainbow": "./img/bonzi/hats/rainbow.png",
  "premium": "./img/bonzi/hats/premium.png",
  "pirate": "./img/bonzi/hats/pirate.png",
  "peedy": "./img/bonzi/hats/peedy.png",
  "ninja": "./img/bonzi/hats/ninja.png",
  "joel": "./img/bonzi/hats/joel.png",
  "hat": "./img/bonzi/hats/hat.png",
  "crown": "./img/bonzi/hats/crown.png",
  "cowboy": "./img/bonzi/hats/cowboy.png",
  "clippy": "./img/bonzi/hats/clippy.png",
  "chef": "./img/bonzi/hats/chef.png",
  "blunt": "./img/bonzi/hats/blunt.png",
  "astronaut": "./img/bonzi/hats/astronaut.png",
  "a": "./img/bonzi/hats/a",
  "banana": "./img/bonzi/hats/banana.webp",
  "bart": "./img/bonzi/hats/bart.webp",
  "bathbomb": "./img/bonzi/hats/bathbomb.webp",
  "bear": "./img/bonzi/hats/bear.webp",
  "bfdi": "./img/bonzi/hats/bfdi.webp",
  "bfdisad": "./img/bonzi/hats/bfdisad.webp",
  "bieber": "./img/bonzi/hats/bieber.webp",
  "blackshirt": "./img/bonzi/hats/blackshirt.webp",
  "bluebowtie": "./img/bonzi/hats/bluebowtie.webp",
  "bluehat": "./img/bonzi/hats/bluehat.webp",
  "blueshirt": "./img/bonzi/hats/blueshirt.webp",
  "boots": "./img/bonzi/hats/boots.webp",
  "bowtie": "./img/bonzi/hats/bowtie.webp",
  "bucket": "./img/bonzi/hats/bucket.webp",
  "bush": "./img/bonzi/hats/bush.webp",
  "camel": "./img/bonzi/hats/camel.webp",
  "cat": "./img/bonzi/hats/cat.webp",
  "cauldron": "./img/bonzi/hats/cauldron.webp",
  "chain": "./img/bonzi/hats/chain.webp",
  "cigar": "./img/bonzi/hats/cigar.webp",
  "clown": "./img/bonzi/hats/clown.webp",
  "cone": "./img/bonzi/hats/cone.webp",
  "dank": "./img/bonzi/hats/dank.webp",
  "decorated": "./img/bonzi/hats/decorated.webp",
  "diamondhat": "./img/bonzi/hats/diamondhat.webp",
  "doge": "./img/bonzi/hats/doge.webp",
  "don": "./img/bonzi/hats/don.webp",
  "elf": "./img/bonzi/hats/elf.webp",
  "elon": "./img/bonzi/hats/elon.webp",
  "emeraldhat": "./img/bonzi/hats/emeraldhat.webp",
  "emoji": "./img/bonzi/hats/emoji.webp",
  "epic": "./img/bonzi/hats/epic.webp",
  "evil": "./img/bonzi/hats/evil.webp",
  "frankenstein": "./img/bonzi/hats/frankenstein.webp",
  "glitch": "./img/bonzi/hats/glitch.webp",
  "glue": "./img/bonzi/hats/glue.webp",
  "goldhat": "./img/bonzi/hats/goldhat.webp",
  "greenchefhat": "./img/bonzi/hats/greenchefhat.webp",
  "greenhat": "./img/bonzi/hats/greenhat.webp",
  "greenshirt": "./img/bonzi/hats/greenshirt.webp",
  "headphones": "./img/bonzi/hats/headphones.webp",
  "hockey": "./img/bonzi/hats/hockey.webp",
  "horse": "./img/bonzi/hats/horse.webp",
  "idiot": "./img/bonzi/hats/idiot.webp",
  "illuminati": "./img/bonzi/hats/illuminati.webp",
  "kamala": "./img/bonzi/hats/kamala.webp",
  "kim": "./img/bonzi/hats/kim.webp",
  "maga": "./img/bonzi/hats/maga.webp",
  "mao": "./img/bonzi/hats/mao.webp",
  "mario": "./img/bonzi/hats/mario.webp",
  "mustache": "./img/bonzi/hats/Mustache.webp",
  "nopupil": "./img/bonzi/hats/nopupil.webp",
  "obama": "./img/bonzi/hats/obama.webp",
  "orangeears": "./img/bonzi/hats/orangeears.webp",
  "orangepunchinggloves": "./img/bonzi/hats/orangepunchinggloves.webp",
  "orangetail": "./img/bonzi/hats/orangetail.webp",
  "paintbucket": "./img/bonzi/hats/paintbucket.webp",
  "party": "./img/bonzi/hats/party.webp",
  "patrick": "./img/bonzi/hats/patrick.webp",
  "pot": "./img/bonzi/hats/pot.webp",
  "propeller": "./img/bonzi/hats/propeller.webp",
  "pumpkin": "./img/bonzi/hats/pumpkin.webp",
  "purplehat": "./img/bonzi/hats/purplehat.webp",
  "purpleshirt": "./img/bonzi/hats/purpleshirt.webp",
  "qmark": "./img/bonzi/hats/qmark.webp",
  "rainbowglitch": "./img/bonzi/hats/rainbowglitch.webp",
  "rainbowhat": "./img/bonzi/hats/rainbowhat.webp",
  "redhat": "./img/bonzi/hats/redhat.webp",
  "redshirt": "./img/bonzi/hats/redshirt.webp",
  "rock": "./img/bonzi/hats/rock.webp",
  "ronald": "./img/bonzi/hats/ronald.webp",
  "ronaldo": "./img/bonzi/hats/ronaldo.webp",
  "rudolph": "./img/bonzi/hats/rudolph.webp",
  "santa": "./img/bonzi/hats/santa.webp",
  "scarf": "./img/bonzi/hats/scarf.webp",
  "seth": "./img/bonzi/hats/seth.webp",
  "shirt": "./img/bonzi/hats/shirt.webp",
  "shoes": "./img/bonzi/hats/shoes.webp",
  "silverfedora": "./img/bonzi/hats/silverfedora.webp",
  "spongebob": "./img/bonzi/hats/spongebob.webp",
  "sprout": "./img/bonzi/hats/sprout.webp",
  "sunglasses": "./img/bonzi/hats/sunglasses.webp",
  "swimring": "./img/bonzi/hats/swimring.webp",
  "tophat": "./img/bonzi/hats/tophat.webp",
  "troll": "./img/bonzi/hats/troll.webp",
  "trollsad": "./img/bonzi/hats/trollsad.webp",
  "truck_webp": "./img/bonzi/hats/truck.webp",
  "unicorn": "./img/bonzi/hats/unicorn.webp",
  "ushanka": "./img/bonzi/hats/ushanka.webp",
  "whitehat": "./img/bonzi/hats/whitehat.webp",
  "whiteobama": "./img/bonzi/hats/whiteobama.webp",
  "witch": "./img/bonzi/hats/witch.webp",
  "yahu": "./img/bonzi/hats/yahu.webp",
  "yellowhat": "./img/bonzi/hats/yellowhat.webp",
  "yellowshirt": "./img/bonzi/hats/yellowshirt.webp"
};

var vehicleOverlayImg = new Image();
vehicleOverlayImg.src = './img/bonzi/bord.png';

            var baseBgHex = "#6834a8";

            var hexToHue = (hex) => {
                let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(hex);
                if (!result) return 0;
                let r = parseInt(result[1], 16) / 255;
                let g = parseInt(result[2], 16) / 255;
                let b = parseInt(result[3], 16) / 255;
                let max = Math.max(r, g, b);
                let min = Math.min(r, g, b);
                let delta = max - min;
                let hue = 0;
                if (delta !== 0) {
                    if (max === r) hue = ((g - b) / delta) % 6;
                    else if (max === g) hue = (b - r) / delta + 2;
                    else hue = (r - g) / delta + 4;
                    hue = hue * 60;
                    if (hue < 0) hue += 360;
                }
                return hue;
            };

            var applyBgColor = (hexColor) => {
                let contentElem = document.getElementById("content");
                if (!contentElem) return;
                let rotation = hexToHue(hexColor) - hexToHue(baseBgHex);
                contentElem.style.setProperty("--bg-hue", rotation + "deg");
            };

async function solvePoW(challenge, difficulty) {
	let prefix = '0'.repeat(difficulty);
	let nonce = 0;
	let hash = '';
	while(true){
		let attempt = challenge + ':' + nonce;
		let msgBuffer = new TextEncoder().encode(attempt);
		let hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
		let hashArray = Array.from(new Uint8Array(hashBuffer));
		hash = hashArray.map(b => b.toString(16).padStart(2,'0')).join('');
		if(hash.startsWith(prefix)) break;
		nonce++;
	}
	return String(nonce);
}

function showPoWIndicator() {
	let existing = document.getElementById('pow_indicator');
	if(existing) return;
	document.getElementById('login_load').insertAdjacentHTML('beforeend',`
		<div id="pow_indicator" style="margin-top:10px;font-family:'WinXP',Tahoma,sans-serif;font-size:13px;color:#fff;text-align:center;background:rgba(0,0,0,0.35);border-radius:4px;padding:6px 10px;">
			<span id="pow_dots_anim">&#9632;</span> Verifying your browser&hellip; please wait
		</div>
	`);
	let dots = ['&#9632;','&#9633;','&#9632;&#9633;','&#9633;&#9632;'];
	let di = 0;
	window._powDotsInterval = setInterval(() => {
		let el = document.getElementById('pow_dots_anim');
		if(el){ el.innerHTML = dots[di % dots.length]; di++; }
		else { clearInterval(window._powDotsInterval); }
	}, 300);
}

function hidePoWIndicator() {
	clearInterval(window._powDotsInterval);
	let el = document.getElementById('pow_indicator');
	if(el) el.remove();
}

let applets = {
	"settings": { 
        buttonId: "my_bonzi", 
        open: false, 
        onpress: () => { 
            if (document.body.innerHTML.includes('<input type="text" placeholder="Username" id="usernameswap">')) {
                errs["applet_open"](); 
                return;
            } 

            new Dialog({
                title: "Settings",
                width: '400',
                height: '560',
                html: `
                <div style="display:flex; overflow: hidden !important;" bis_skin_checked="1">
                    <div style="width: 99px; height:497px; background: linear-gradient(rgb(188 160 230), rgb(130 102 169)); display:flex; flex-direction:column; align-items:center; padding:10px" bis_skin_checked="1">
                        <div style="width:95px; height:70px; background:white; border-radius: 4px; font-size:12px; text-align:center;" bis_skin_checked="1">
                            <div style="width: 89px; height: 18px; background: indigo; border-radius: 4px 4px 0px 0px; padding: 3px; font-size: 12px; color: white; font-weight: bold; text-shadow: 1px 1px black;" bis_skin_checked="1">
                                Menu
                            </div> 
                            <a href="#" id="tab_btn_mybonzi" style="display:block; margin: 4px 0; color: indigo; font-weight: bold;">My Bonzi</a>
                            <a href="#" id="tab_btn_css" style="display:block; color: gray;">CSS</a>
                        </div> 
                    </div> 

                    <div id="settings_panel_content" style="width: 386px;height: 517px;overflow-y: hidden;overflow-x:hidden;color: white;text-shadow: 1px 1px black;background: linear-gradient(315deg, #480c7a, #9f6dc6);padding: 10px;box-sizing: border-box;" bis_skin_checked="1">
                        
                        <div id="view_mybonzi" style="display: block; width: 100%; height: 100%;">
                            Color:<br> 
                            <div id="row_color1" style="display:flex; flex-direction:row; margin-bottom: 4px;" bis_skin_checked="1"></div> 
                            <div id="row_color2" style="display:flex; flex-direction:row; margin-bottom: 8px;" bis_skin_checked="1"></div> 
                            <input type="text" placeholder="crosscolor (optional, catbox.moe only)" id="ccurl" style="width: 160px;"> 
                            <button onclick="socket.emit('command',{type:'color',param:document.getElementById('ccurl').value});  profileList[0].color=document.getElementById('ccurl').value; saveArray('profiles', profileList); ">submit CC</button> 
                            &nbsp; &nbsp; &nbsp; <button onclick="window.open('https://catbox.moe');">Catbox</button> 
                            <hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.4); margin: 8px 0;"> 
                            Name:<br> 
                            <input type="text" placeholder="Username" id="usernameswap">
                            <button onclick="socket.emit('command',{type:'name',param:document.getElementById('usernameswap').value}); profileList[0].name=document.getElementById('usernameswap').value; saveArray('profiles', profileList); ">Set Name</button> 
                            <hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.4); margin: 8px 0;"> 
                            Hats:<br> 
                            <div id="hat_grid" style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;width:100%;height: 170px;overflow-y:scroll;background: linear-gradient(45deg, black, transparent,white);overflow-x:hidden;padding: 2px;" bis_skin_checked="1"></div> 
                            <button onclick="socket.emit('command',{type:'hat',param:''}); profileList[0].hats=[];" style="margin-top:6px;">Clear Hats</button> 
                        </div>

                        <div id="view_css" style="display: none; width: 100%; height: 100%;">
                            Custom CSS Editor:<br>
                            <textarea id="css_tab_textarea" style="width: 95%; height: 260px; background: #1a1525; color: #d4c5f0; border: 1px solid #5c3c80; font-family: monospace; font-size: 11px; resize: none; margin-top: 5px; padding: 4px; box-sizing: border-box;" placeholder="/* Enter custom CSS rules here */"></textarea>
                            <hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.4); margin: 12px 0;">
                            Background Color:<br>
                            <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
                                <input type="color" id="bg_color_ramp" style="width: 100px; height: 24px; border: 1px solid #5c3c80; cursor: pointer; background: transparent; padding: 0;">
                                <span style="font-size: 11px; opacity: 0.8;">Click here to change</span>
								<button id="bg_color_del">Reset</button>
                            </div>
                            <hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.4); margin: 12px 0;">
                            Marquee Background:<br>
                            <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
                                <input type="checkbox" id="hide_marquee_toggle">
                                <label for="hide_marquee_toggle" style="font-size: 11px; opacity: 0.8;">Hide floating background bonzis</label>
                            </div>
                        </div>

                    </div>
                </div> `, 
                onclose: () => { 
                    saveArray('profiles', profileList); 
                }
            });

            let styleTag = document.getElementById("bonzi-custom-css");
            if (!styleTag) {
                styleTag = document.createElement("style");
                styleTag.id = "bonzi-custom-css";
                document.head.appendChild(styleTag);
            }

            var btnMyBonzi = document.getElementById("tab_btn_mybonzi");
            var btnCss = document.getElementById("tab_btn_css");
            var viewMyBonzi = document.getElementById("view_mybonzi");
            var viewCss = document.getElementById("view_css");
            var cssTextarea = document.getElementById("css_tab_textarea");
            var colorRamp = document.getElementById("bg_color_ramp");

            btnMyBonzi.addEventListener("click", (e) => {
                e.preventDefault();
                viewMyBonzi.style.display = "block";
                viewCss.style.display = "none";
                btnMyBonzi.style.color = "indigo";
                btnMyBonzi.style.fontWeight = "bold";
                btnCss.style.color = "gray";
                btnCss.style.fontWeight = "normal";
            });

            btnCss.addEventListener("click", (e) => {
                e.preventDefault();
                viewMyBonzi.style.display = "none";
                viewCss.style.display = "block";
                btnCss.style.color = "indigo";
                btnCss.style.fontWeight = "bold";
                btnMyBonzi.style.color = "gray";
                btnMyBonzi.style.fontWeight = "normal";
            });

            var savedCSS = getCookie("custom_bonzi_css");
            if (savedCSS) {
                cssTextarea.value = savedCSS;
                styleTag.innerHTML = savedCSS;
            }

            var savedBgColor = getCookie("custom_bonzi_bg");
            if (savedBgColor) {
                colorRamp.value = savedBgColor;
                applyBgColor(savedBgColor);
            }

            var marqueeToggle = document.getElementById("hide_marquee_toggle");
            var savedHideMarquee = getCookie("hide_marquee_bg");
            marqueeToggle.checked = savedHideMarquee === "true";
            document.getElementById("content").classList.toggle("hide_marquee_bg", marqueeToggle.checked);

            marqueeToggle.addEventListener("change", () => {
                document.getElementById("content").classList.toggle("hide_marquee_bg", marqueeToggle.checked);
                setCookie("hide_marquee_bg", marqueeToggle.checked, 30);
            });

            cssTextarea.addEventListener("input", () => {
                styleTag.innerHTML = cssTextarea.value;
                setCookie("custom_bonzi_css", cssTextarea.value, 30);
            });

            colorRamp.addEventListener("input", () => {
                applyBgColor(colorRamp.value);
                setCookie("custom_bonzi_bg", colorRamp.value, 30);
            });

			document.getElementById('bg_color_del').addEventListener('click',(e)=>{
				colorRamp.value=baseBgHex;
				applyBgColor(colorRamp.value);
                setCookie("custom_bonzi_bg", colorRamp.value, 30);
		});

            let clrs = ['red', 'brown', 'green', 'blue', 'purple', 'pink', 'black']; 
            let currentRow = 1; 
for (let i = 0; i < clrs.length; i++) {if (i >= clrs.length / 2) currentRow = 2;document.getElementById('row_color' + currentRow).insertAdjacentHTML('beforeend',`
  <button onclick="socket.emit('command',{type:'color',param:'${clrs[i]}'}); profileList[0].color='${clrs[i]}';"> 
 <div style="width:35px;height:35px;background-image:linear-gradient(white,${clrs[i].replaceAll('pink', 'magenta').replaceAll('purple', 'indigo').replaceAll('brown', 'saddlebrown')});"></div>  </button> `);}let 
hatGrid = document.getElementById('hat_grid');

Object.keys(hatList).forEach(hatName => {let hatStat = blessedHats.includes(hatName) ? '🔒' : ''; let newTitle=hatName+hatStat; console.log(hatName+blessedHats.includes(hatName))
hatGrid.insertAdjacentHTML('beforeend',`
  <button title="${newTitle}" onclick="socket.emit('command',{type:'hat',param:'${hatName}'}); profileList[0].hats.push('${hatName}')" style="display:flex;flex-direction:column;align-items:center;width:40px;font-size:10px;padding:3px;">  <img src="${hatList[hatName]}" style="width:50px;height:40px;object-fit:contain;">  
${hatName} ${hatStat}</button> `);});
},
},
"bonzicoins":{
	buttonId:"bonzicoins_icon",
	open:false,
	onpress:()=>{ openBonziCoinsMenu(); }
},
"mediaupload":{
		buttonId:"media_upload",
		open:false,
		onpress:()=>{
			uploadPopup();
		},
	},
	"bonzilog":{
		buttonId:"bonzi_log",
		open:false,
		onpress:()=>{
			if(document.body.innerHTML.includes('id="log_contents">')){errs["applet_open"](); return;}
            new Dialog({title:"BonziLOG",width:'275',height:'500',html:`
			<div style="width:100%;height:100%;overflow-x:hidden;overflow-y:none;" id="log_contents">
				${logtxt}
			</div>
			`});
		}
	},
	"roomsview":{
		buttonId:"rooms_view",
		open:false,
		onpress:()=>{
			if(document.body.innerHTML.includes('<div id="roomdir"'))return;
			socket.off('roomslist');
let roomWindow = new Dialog({title:'Room List',width:300,height:300,html:`
    <div id="roomdir" style="width:98%;height:85%;overflow-x:hidden;overflow-y:scroll;">Loading...</div><br>
    <input type="text" placeholder="Type room ID (optional)" id="room_custom"><button id="room_create">Visit Room</button>
`});
socket.emit('command',{type:'getrooms',param:''});
socket.on('roomslist',d=>{
	document.getElementById('room_create').onclick = () => {myRoom = document.getElementById('room_custom').value;disconnectErr=false; socket.disconnect();};
    let roomdir = document.getElementById('roomdir');
    let initLoop = () => {
		
		roomdir.innerHTML='';
	    d.forEach(roomObject => {
    	    let roomElement = document.createElement('button');
  		      roomElement.innerHTML = `
       	 	<img src="./img/desktop/icons/room.png" width="32" height="32">
       	 	<hr>
       		 <p>
        	        Room ID: <span style="font-weight:bold;font-size:18px;">${roomObject.name}</span>
	            <br>
            <span style="color:green;font-size:16px;">${roomObject.users} Users</span>
	        </p>
	        `;
    	    roomdir.appendChild(roomElement);
	        roomElement.onclick = () => {
				myRoom = roomObject.name;
				disconnectErr=false;
				socket.disconnect();
				roomWindow.element.remove();
		 	};
	    });
		setTimeout(() => {
			if(document.body.innerHTML.includes('<div id="roomdir"'))socket.emit('command',{type:'getrooms',param:''});
		},5000);
	};
	initLoop();
});

		}
	}
};
let myRoom = 'default';
function clampBonziPosition(x, y) {
	var xmax = $(window).width() - 200;
	var ymax = $(window).height() - 160 - 30;
	var cx = Math.max(0, Math.min(x, xmax));
	var cy = Math.max(0, Math.min(y, ymax));
	return {x: cx, y: cy};
}

function clampAllBonzis() {
	if(worldActive)return;
	for (var i = 0; i < bonzislist.length; i++) {
		var b = bonzislist[i];
		var el = document.getElementById(b.id);
		if (el) {
			var cx = parseInt(el.style.left) || 0;
			var cy = parseInt(el.style.top) || 0;
			var clamped = clampBonziPosition(cx, cy);
			b.move({x: clamped.x + "px", y: clamped.y + "px"});
		}
	}
}

function raiseBonzi(localId) {
	bonziZCounter++;
	var zBase = bonziZCounter * 5;
	var canvas = document.getElementById(localId);
	var nameEl = document.getElementById("name_" + localId);
	var chatEl = document.getElementById("chat_" + localId);
	var pointEl = document.getElementById("point_" + localId);
	if (canvas) canvas.style.zIndex = zBase;
	if (nameEl) nameEl.style.zIndex = zBase + 1;
	if (chatEl) chatEl.style.zIndex = zBase + 2;
	if (pointEl) pointEl.style.zIndex = zBase + 3;
	for (var li = 1; li <= 5; li++) {
		var hatCanvas = document.getElementById("hat" + li + "_" + localId);
		if (hatCanvas) hatCanvas.style.zIndex = zBase;
	}

	var vehicleCanvas = document.getElementById("vehicle_" + localId);
	if (vehicleCanvas) vehicleCanvas.style.zIndex = zBase;
}

$(window).on("resize", function() {
	clampAllBonzis();
	var iconBar = document.querySelector(".icon_bar");
	if (iconBar) {
		if ($(window).width() < 600) {
			iconBar.style.display = "none";
		} else {
			iconBar.style.display = "flex";
		}
	}
	updateIconToggleButton();
});

function updateIconToggleButton() {
	var btn = document.getElementById("icon_toggle_btn");
	if (!btn) return;
	if ($(window).width() < 600) {
		btn.style.display = "block";
	} else {
		btn.style.display = "none";
		var iconBar = document.querySelector(".icon_bar");
		if (iconBar) iconBar.style.display = "flex";
	}
}

let oobe = false;
let interacted = false;

let smokeNmirrors=true;
$(window).load(function(){
  var toggleBtn = document.createElement("button");
  toggleBtn.id = "icon_toggle_btn";
  toggleBtn.innerHTML = "&#9776;";
  toggleBtn.style.cssText = "position:fixed;bottom:50px;right:8px;z-index:99999;font-size:18px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:5px;cursor:pointer;user-select:none;";
  document.body.appendChild(toggleBtn);
	
  if(profileList[0].uses < 1)oobe=true;
  else { oobeplaybg.style.display='none'; initSetup.style.display='none';}
  toggleBtn.onclick = function() {
    var iconBar = document.querySelector(".icon_bar");
    if (iconBar) {
      iconBar.style.display = (iconBar.style.display === "flex") ? "none" : "flex";
    }
  };
	  var savedBgColor = getCookie("custom_bonzi_bg");
  if (savedBgColor) {
    applyBgColor(savedBgColor);
  }
  var savedHideMarquee = getCookie("hide_marquee_bg");
  if (savedHideMarquee === "true") {
    document.getElementById("content").classList.add("hide_marquee_bg");
  }
  if(profileList[0].name != 'Anonymous')document.getElementById('login_name').value = profileList[0].name;
  updateIconToggleButton();

  document.addEventListener("touchstart", touchHandler, true);
  document.addEventListener("touchmove", touchHandler, true);
  document.addEventListener("touchend", touchHandler, true);
  document.addEventListener("touchcancel", touchHandler, true);    
  setTimeout(() => {if(profileList[0].name !== 'Anonymous')document.getElementById('login_name').value=profileList[0].name;},500);
  if(isMobile()){
    $("#room_info").hide();
  }
  $("#login_load").hide();
  $("#login_card").show();
  
  if(!typeof profileList[0].uses == 'number'){
	profileList[0].uses=0;
	saveArray('profiles',profileList);
  }
  if(profileList[0].uses < 1){
	 document.addEventListener('click',()=>{
	if(interacted)return;
	interacted=!interacted;
	$("#login_sectionOOBE").css({"display":"block"});
	let i = 0;
	 let init = () => {
		 i++;
		 let newHeight = window.innerHeight;
	 let newWidth = 500*(window.innerHeight/480);
	 
	 let newX = `calc(50% - ${(newWidth / 2)}px)`;
	 let newY = '0px';
	 
	 if(i < 2){$("#oobeplayback").css({"display":"block","left":newX,"width":newWidth.toString()+"px","height":newHeight.toString()+"px"});
	 const originalSrc = './img/misc/oobe.gif';
     oobeplayback.src=originalSrc + "?t=" + new Date().getTime();}//mozilla restores the last played gif frame before tab close????? blatantly fucking retarded
	 };
	 window.addEventListener('resize',()=>{if(smokeNmirrors)init();});
	 
	 init();
	 initSetup.style.display='none';
	 
	 setTimeout(() => {
		 login_sectionOOBE.style.background='rgba(0,0,0,0.1)';
		  $("#oobeplayback").css({"display":"none"});
		  oobeplaybg.style.display='none';
		  page_login.style.backgroundImage = ' url(), url("../img/logon/top.png"), url("../img/logon/bottom.png"), url("../img/logon/topleft.png"), url()';
		  setTimeout(() => {qmark_speak.style.display="block";
				setTimeout(() => {qmark_dialogue.innerText="I'm gonna go die now."; qmark.src='./img/desktop/icons/helpnigga.gif'+ "?t=" + new Date().getTime();
					setTimeout(() => {qmark_speak.style.display='none';},5000);
					setTimeout(() => {qmark_speak.style.display='none';qmark.style.display='none';},12000);
				},6000);
		   },2000)
		  smokeNmirrors=false;
		  
		  oobe_next.onclick = () => {
			 title_oobe.innerText='User Settings';
			 oobe_cont.innerHTML=`
<rowbox><p>Nickname:</p> <input type="text" id="exp_nnp" placeholder="Enter a nickname"></rowbox>

<br>

<rowbox>
	<p>Godword, kingword, radword:</p> <input type="password" id="exp_gwp" placeholder="Enter password">
	</rowbox>
<br>


<rowbox>
	<p>Bonzicoin password:</p> <input type="password" id="exp_bcp" placeholder="Auto-generated if left blank">
	</rowbox>
<br>
<p style="font-size:12px;">This password unlocks your BonziCOINS, hats and vehicles next time. If you don't save it (or clear cookies), that progress is lost.</p>
`;
			document.getElementById('exp_bcp').value = genBonziPassword();
			oobe_next.onclick = () => {
				let chosenName = document.getElementById('exp_nnp').value.trim();
				let chosenGodword = document.getElementById('exp_gwp').value;
				let chosenBcp = document.getElementById('exp_bcp').value.trim();

				if(chosenName.length > 0)profileList[0].name = chosenName.substring(0,30);
				if(chosenGodword.length > 0)profileList[0].godmodePass = chosenGodword;
				profileList[0].bonzicoinPass = chosenBcp.length >= 8 ? chosenBcp : genBonziPassword();

				profileList[0].uses = (typeof profileList[0].uses === 'number' ? profileList[0].uses : 0) + 1;
				saveArray('profiles', profileList);
				
				oobeplaybg.style.display='none'; initSetup.style.display='none';
				login_sectionOOBE.style.display='none'; 
				login_sectionUSER.style.display='block';
				page_login.style.backgroundImage='';};
		  };
	 },6000);
	 });
  } else {
	 $("#login_sectionUSER").css({"display":"block"});
  }
  $("#login_go").click(() => {
      setTimeout(() => {
        var audioe = new Audio("/sound/start.mp3");
        audioe.play();
        first = false;
		login();
      },300);
    
    $("#login_name, #login_room").keypress(function(e) {
      if(e.which == 13) {
		var audioe = new Audio("/sound/start.mp3");
        audioe.play();
        first = false;
        login();
      }
    });
  });
  socket.on("ban", (data) => {
	new Dialog({title:'BANNED!',html:`
		<h1>You were banned</h1>
		<br>
		<p>Reason:<span style="font-weight:bold;">${data.reason}</span></p><br>
		<h4>Duration: ${data.duration}</h4>
	`});
  })
});
function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
function Id(length) {
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';var result = '';
   for (let i = 0; i < length; i++){
      result += characters.charAt(Math.floor(Math.random() * characters.length));
   }
   return result;
}
function clearLog(){
	logtxt=`<i>Log reset.</i><hr>`;
	if(document.getElementById('log_contents') !== null)document.getElementById('log_contents').innerHTML = logtxt;
}
function setReplyTarget(name, msg) {
	replyTarget = {name: name, msg: msg};
	var indicator = document.getElementById('reply_indicator');
	if(!indicator){
		var cont = document.getElementById('chat_message_cont');
		var ind = document.createElement('div');
		ind.id = 'reply_indicator';
		ind.style.cssText = 'position:absolute;top:-22px;left:60px;background:rgba(0,0,60,0.75);color:#adf;font-family:WinXP,Tahoma,sans-serif;font-size:12px;padding:2px 6px;border-radius:3px 3px 0 0;white-space:nowrap;max-width:300px;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:6px;';
		ind.innerHTML = '&#x21A9; replying to <b>' + name + '</b><span onclick="clearReplyTarget();" style="cursor:pointer;margin-left:4px;color:#f88;">&#x2715;</span>';
		document.getElementById('chat_bar').appendChild(ind);
	} else {
		indicator.innerHTML = '&#x21A9; replying to <b>' + name + '</b><span onclick="clearReplyTarget();" style="cursor:pointer;margin-left:4px;color:#f88;">&#x2715;</span>';
	}
}
function clearReplyTarget() {
	replyTarget = null;
	var indicator = document.getElementById('reply_indicator');
	if(indicator) indicator.remove();
}
function newLog(options){
	var replyHtml = '';
	if(options.quote && options.quote.name && options.quote.msg){
		replyHtml = '<div style="border-left:3px solid #888;padding:2px 6px;margin-bottom:4px;background:rgba(0,0,0,0.07);font-size:12px;color:#555;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px;"><b>' + options.quote.name + ':</b> ' + options.quote.msg + '</div>';
	}
	var msgId = 'logmsg_' + Id(8);
	var escapedName = options.name.replace(/'/g,"&#39;").replace(/"/g,"&quot;");
	var escapedMsg = options.msg.replace(/'/g,"&#39;").replace(/"/g,"&quot;");
	logtxt += '<div style="position:relative;padding-right:28px;">' + replyHtml + '<b>' + options.name + ':</b>' + options.msg + '<button onclick="setReplyTarget(\'' + escapedName + '\',\'' + escapedMsg + '\');" style="position:absolute;top:0;right:0;width:22px;height:22px;padding:0;font-size:11px;line-height:1;" title="Reply">&#x21A9;</button></div><hr>';
	if(document.getElementById('log_contents') !== null)document.getElementById('log_contents').innerHTML = logtxt;
}
function touchHandler(event){
  var touches = event.changedTouches,first = touches[0],type = "";
  switch(event.type){
    case "touchstart": type = "mousedown"; break;
    case "touchmove":  type = "mousemove"; break;        
    case "touchend":   type = "mouseup";   break;
    default:           return;
  }
  var simulated = document.createEvent("MouseEvent");
  simulated.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null);
  first.target.dispatchEvent(simulated);
}
function sendMsg(msg = $("#chat_message").val()){

  if(msg.startsWith("/")){
    var cmdtype = msg.substring(1, msg.indexOf(" ") === -1 ? msg.length : msg.indexOf(" "));
    var param = msg.indexOf(" ") === -1 ? "" : msg.substring(msg.indexOf(" ") + 1, msg.length);


	if(cmdtype == "godmode"){
		profileList[0].godmodePass=param;
		saveArray('profiles',profileList);
	}
    if(cmdtype === "clear"){
      clearLog();
      $("#chat_message").val("");
      return;
    }

    socket.emit("command",{type: cmdtype, param: param});
  } else {
    if(replyTarget){
      socket.emit("msg",{msg: msg, quote: {msg: replyTarget.msg, name: replyTarget.name}});
      clearReplyTarget();
    } else {
      socket.emit("msg",{msg: msg});
    }
  }
  $("#chat_message").val("");
}

function uploadPopup(initialFile) {
    let blobUrl = null;
    let dialog = new Dialog({
        title: "Send Image Or Video",
        x: 20,
        y: 50,
        width: 300,
        height: 200,
        html: `
            <button class="upload_dropzone">+</button>
            <div style="height: 2px;"></div>
            <input type="file" accept="image/*, video/*" class="upload_input" hidden>
            <div class="upload_buttons">
                <button class="xp-button upload_button" disabled>Send</button>
            </div>
        `,
        onclose: () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        },
    });
    let element = dialog.element;
    let dropzone = element.querySelector(".upload_dropzone");
    let button = element.querySelector(".upload_button");
	console.log(button);
    let fileInput = element.querySelector(".upload_input");
    let blob = null;

    function loadFile(file) {
        if (!file) return;
        blob = file;
        if (blobUrl) URL.revokeObjectURL(blobUrl);
        blobUrl = URL.createObjectURL(blob);
        dropzone.style.background = `url("${blobUrl}") center center / contain no-repeat`;
        button.disabled = false;
    }

    if (initialFile) loadFile(initialFile);

    dropzone.onclick = () => fileInput.click();
    fileInput.onchange = () => loadFile(fileInput.files[0]);

    dropzone.ondragover = (e) => {
        e.preventDefault();
        dropzone.style.borderColor = "#003c74";
    };

    dropzone.ondragleave = () => {
        dropzone.style.borderColor = "";
    };

    dropzone.ondrop = (e) => {
        e.preventDefault();
        dropzone.style.borderColor = "";
        loadFile(e.dataTransfer.files[0]);
    };
    button.onclick = async () => {
		console.log(blobUrl);
        if (!blobUrl) return;
        let formData = new FormData();
        formData.append("reqtype", "fileupload");
        formData.append("fileToUpload", blob);
        formData.append("time", "1h");
        let response = await fetch("https://litterbox.catbox.moe/resources/internals/api.php", {
            method: "POST",
            body: formData,
        });
        let url = await response.text();
        socket.emit("command",{type:"media",param:url});
        dialog.element.remove();
    };
}
function openBanDialog(targetId){
	let banDialog = new Dialog({title:"Ban User",width:250,height:220,html:`
		<input type="text" placeholder="hours" id="ban_hours_input">
		<br>
		<input type="text" placeholder="minutes" id="ban_minutes_input">
		<br>
		<input type="text" placeholder="reason" id="ban_reason_input">
		<br>
		<button id="ban_confirm_button">Ban</button>
	`});
	document.getElementById('ban_confirm_button').onclick = () => {
		socket.emit('banUser',{
			id:targetId,
			hours:document.getElementById('ban_hours_input').value,
			minutes:document.getElementById('ban_minutes_input').value,
			reason:document.getElementById('ban_reason_input').value
		});
		banDialog.element.remove();
	};
}
let sanitize = (txt) => {return txt;};
let lastZ = 0;
let dragged = null;
let dragX = 0;
let dragY = 0;
let chatLogDragged = false;
window.onpointermove = (e) => {
    if (dragged) {
        dragged.move(e.pageX - dragX, e.pageY - dragY);
    }
    if (chatLogDragged) {
        window.onresize();
        chat_log.style.width = `${e.pageX - dragX}px`;
    }
};

window.onpointerup = () => {
    dragged = null;
    chatLogDragged = false;
};
class Dialog {
    constructor(opt = {}) {
        if (opt.title == null) opt.title = "Window";
        opt.width = opt.width || 400;
        opt.height = opt.height || 300;
        this.x = opt.x || 0;
        this.y = opt.y || 0;
        this.onclose = opt.onclose || (() => {});
        this.element = document.createElement("div");
        if (opt.class) this.element.className = opt.class;
        this.element.classList.add("window");
        this.element.innerHTML = `
        <div class="window_header">
        ${sanitize(opt.title)}
        <div class="window_close"></div>
        </div>
        <div class="window_body">
        <div class="window_content">
        </div>
        </div>
        `;
        this.move(this.x, this.y);
        this.element.style.position = "absolute";
        this.element.style.zIndex = lastZ++ + 9999;
        this.element.querySelector(".window_header").onpointerdown = (e) => {
            dragged = this;
            dragX = e.pageX - this.x;
            dragY = e.pageY - this.y;
			if(dragX < 0)dragX=0;
			if(dragX > window.innerWidth - parseInt(this.element.width))dragX=window.innerWidth - parseInt(this.element.width);
			if(dragY < 0)dragY=0;
			if(dragY > window.innerHeight - parseInt(this.element.height))dragX=window.innerHeight - parseInt(this.element.height);
        };
        this.element.querySelector(".window_close").onclick = () => {
            this.element.remove();
            this.onclose();
        };
        this.element.style.width = `${opt.width}px`;
        this.element.style.height = `${opt.height}px`;
        this.element.querySelector(".window_content").innerHTML = opt.html;
        content.appendChild(this.element);
    }

    move(x, y) {
        this.x = x;
        this.y = y;
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }
}
var colorCache = {
  "red":"/img/bonzi/red.png",
  "green":"/img/bonzi/green.png",
  "blue":"/img/bonzi/blue.png",
  "purple":"/img/bonzi/purple.png",
  "pink":"/img/bonzi/pink.png",
  "black":"/img/bonzi/black.png",
  "brown":"/img/bonzi/brown.png",
  "bcn":"/img/bonzi/bcn.png",
  "smile":"/img/bonzi/smile.png",
};
var animationList = {
	"praise":{"fwd":[
		[7,10],[8,10],[9,10],[10,10],[11,10],[12,10]
	],"back":reversify([[7,10],[8,10],[9,10],[10,10],[11,10],[12,10]])},
	"earth":{
		"fwd":[
		[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],[12,4],[13,4],[14,4],[15,4],[16,4],[17,4],
		[1,5],[2,5],[3,5]],
		"back":[
			[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],[12,5],[13,5],[15,5],[15,5],[16,5],[17,5],
		[1,6],[2,6]
		]
	},
};
function bonzi(colorurl,left,top,property){
	let urlNames = {};
	let urlArrays = Object.keys(colorCache).map(r => {urlNames[colorCache[r]] = r; return colorCache[r];});
  this.color = urlArrays.some(r => r == colorurl || r.includes(colorurl)) ? urlNames[colorurl] : colorurl;
  let thisColor = this.color;
  var width = 200;
  var height = 160;
  var rows = 21;
  var columns = 17;
  var localId = property.id;
  this.frameTick = 70;
  this.id = localId;
  this.mute = false;
  var isStaticImage = false;

  if(property.pitch == undefined){
    property.pitch = 80;
  }
  if(property.speed == undefined){
    property.speed = 150;
  }
  let tagHtml = `<div id='tag_${localId}' class='bonzi_tag'></div>`;
  if(typeof property.tag != 'string')tagHtml=``;
  else {
	  if(property.tag.length < 1)tagHtml=``;
  }
  content.insertAdjacentHTML('beforeend',`
  <div id='name_${localId}' style='position:absolute;z-index:500;' class='bonzi_name'>${tagHtml} ${markupify(property.name)}</div><canvas class='bonzi_canvas' width='200' height='160' style='position:absolute;top:${top};left:${left};z-index:500;' id='${localId}'></canvas><canvas class='bonzi_hat_layer' width='200' height='160' style='position:absolute;top:${top};left:${left};pointer-events:none;z-index:500;' id='hat1_${localId}'></canvas><canvas class='bonzi_hat_layer' width='200' height='160' style='position:absolute;top:${top};left:${left};pointer-events:none;z-index:500;' id='hat2_${localId}'></canvas><canvas class='bonzi_hat_layer' width='200' height='160' style='position:absolute;top:${top};left:${left};pointer-events:none;z-index:500;' id='hat3_${localId}'></canvas><canvas class='bonzi_hat_layer' width='200' height='160' style='position:absolute;top:${top};left:${left};pointer-events:none;z-index:500;' id='hat4_${localId}'></canvas><canvas class='bonzi_hat_layer' width='200' height='160' style='position:absolute;top:${top};left:${left};pointer-events:none;z-index:500;' id='hat5_${localId}'></canvas><canvas class='bonzi_vehicle_layer' width='200' height='160' style='position:absolute;top:${top};left:${left};pointer-events:none;z-index:500;' id='vehicle_${localId}'></canvas><div id='chat_${localId}' class='bubble_chat' style='z-index:502;display:none;'><div class='msg_cont'></div></div><div id='point_${localId}' class='bubble_point' style='z-index:503;display:none;'></div>
  `);
  
  $("#chat_"+localId).hide();
  $("#point_" + localId).hide();
  
  var currentHats = property.hats || [];
  var hatImgCache = {};

  var canvas = document.getElementById(localId);
  var ctx = canvas.getContext('2d');
  var img = new Image();
  var draw = (x,y) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(isStaticImage){
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, width, height);
    } else {
      ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
    }
  }

  var drawHatImg = (hatCtx, hatImg) => {
    hatCtx.clearRect(0, 0, 200, 160);
    hatCtx.drawImage(hatImg, 0, 0, hatImg.naturalWidth, hatImg.naturalHeight, 0, 0, 200, 160);
  };

  var drawHats = () => {
	let ticks = 0;
    for(let layerIdx = 0; layerIdx < 5; layerIdx++){
      let hatCanvas = document.getElementById('hat'+(layerIdx+1)+'_'+localId);
      if(!hatCanvas)continue;
	  ticks++;
      let hatCtx = hatCanvas.getContext('2d');
      hatCtx.clearRect(0, 0, 200, 160);
      if(layerIdx < currentHats.length){
        let hatName = currentHats[layerIdx];
        let hatSrc = hatList[hatName];
        if(!hatSrc)continue;
        if(hatImgCache[hatName]){
          drawHatImg(hatCtx, hatImgCache[hatName]);
        } else {
          let hatImg = new Image();
          hatImg.onload = () => {
            hatImgCache[hatName] = hatImg;
            drawHatImg(hatCtx, hatImg);
          };
          hatImg.src = hatSrc;
        }
      }
    }
	
	if(ticks > 0){
	  let hatCanvas = document.getElementById('hat'+(ticks)+'_'+localId);
     /* if(hatCanvas){
		let hatCtx = hatCanvas.getContext('2d');
		ctx.font = "25px Arial";
		ctx.fillText(property.coins,100,100);
		ctx.drawImage(sprite_bonzicoin, 150, 100, 32, 32);
	  }*/
	}
	else {
		/*ctx.font = "25px Arial";
		ctx.fillText(property.coins,100,100);
		ctx.drawImage(sprite_bonzicoin, 150, 100, 32, 32);*/
	}
  };

  var vehicleCanvas = document.getElementById('vehicle_'+localId);
  var vehicleCtx = vehicleCanvas ? vehicleCanvas.getContext('2d') : null;
  var vehicleOverlayDrawn = false;
  var drawVehicleOverlay = () => {
    if(!vehicleCtx)return;
    let hasVehicle = !!this.vehicle;
    if(!hasVehicle){
      if(vehicleOverlayDrawn){
        vehicleCtx.clearRect(0, 0, 200, 160);
        vehicleOverlayDrawn = false;
      }
      return;
    }
    if(vehicleOverlayImg.complete && vehicleOverlayImg.naturalWidth > 0){
      vehicleCtx.clearRect(0, 0, 200, 160);
      vehicleCtx.drawImage(vehicleOverlayImg, 0, 0, 200, 160);
      vehicleOverlayDrawn = true;
    } else if(!vehicleOverlayDrawn){
      vehicleOverlayImg.addEventListener('load', () => {
        if(!this.vehicle)return;
        vehicleCtx.clearRect(0, 0, 200, 160);
        vehicleCtx.drawImage(vehicleOverlayImg, 0, 0, 200, 160);
        vehicleOverlayDrawn = true;
      }, {once:true});
    }
  };

  var vehicleOverlayLoop = setInterval(drawVehicleOverlay, 200);
	var toFrame = (frameColumn,frameRow) => {
		let newX = (width*frameColumn)-width;
		let newY = (height*frameRow)-height;
		
		draw(newX,newY);
	};

var thisAnimation = {name:'idle',open:false};
var animationPlayback = (animationData,playType) => {
	if(typeof animationData['fwd'] != 'undefined'){
		if(playType == 'fwd')animationData = [...animationData['fwd']];
		else animationData = [...animationData['back'],null];
	}
	let newData = playType == 'fwd' ? animationData : [...animationData,null]; 
	let frameTick = this.frameTick;
	newData.forEach((frameInfo,i) => {
		setTimeout(() => {
			if(frameInfo != null){
				toFrame(...frameInfo);
			} else {
				draw(0,0);
			}
		},i*frameTick);
	});
};
  var animate = (properties) => {
    if(isStaticImage){
      draw(0,0);
      return;
    }
    if(properties.type == "idle"){
      draw(0,0);
    } 
    if(properties.type == "surf_right"){
      let x = 200;
      let y = 0;
      var col = columns * width - width - width;
      var row = 0;
      var anim = setInterval(() => {
        if(x > col){x = 0; y+=height;}
        if(y > row){y = 0;x = 0;}

        draw(x,y);
        x+=200;
      },80);
      setTimeout(()=>{
        clearInterval(anim);
        draw(0,0);
      },1000);
    }
    if(Object.keys(animationList).includes(properties.type)){
		
	}
  }
  var move = (properties) => {
    var yInt = parseInt(properties.y);
    var xInt = parseInt(properties.x);


    if(!worldActive){
      var clamped = clampBonziPosition(xInt, yInt);
      xInt = clamped.x;
      yInt = clamped.y;
    }

    var namey = yInt - 10;
    var namex = xInt - 10;
    var chaty = namey + 65;
    var chatx = namex + 180;
    var pointx = chatx - 19;
    var pointy = chaty;

    document.getElementById("name_"+localId).style.top = namey + "px";
    document.getElementById("name_"+localId).style.left = namex + "px";
    document.getElementById("chat_"+localId).style.left = chatx + "px";
    document.getElementById("chat_"+localId).style.top = chaty + "px";
    document.getElementById("point_"+localId).style.top = pointy + "px";
    document.getElementById("point_"+localId).style.left = pointx + "px";
    canvas.style.left = xInt + "px";
    canvas.style.top = yInt + "px";
    for(let layerIdx = 1; layerIdx <= 5; layerIdx++){
      let hatCanvas = document.getElementById('hat'+layerIdx+'_'+localId);
      if(hatCanvas){
        hatCanvas.style.left = xInt + "px";
        hatCanvas.style.top = yInt + "px";
      }
    }
    if(vehicleCanvas){
      vehicleCanvas.style.left = xInt + "px";
      vehicleCanvas.style.top = yInt + "px";
    }
    drawVehicleOverlay();
  }
	let thisName = property.name;
	this.name = thisName;
  
  var talk = (properties,onendCallback) => {
	 
    if(this.mute == true){
      return;
    }
    document.getElementById("chat_" + localId).style.display="block";
    document.getElementById("point_" + localId).style.display="block";

    var chatContent = '';
    if(properties.quote && properties.quote.name && properties.quote.msg){
      chatContent += '<div style="border-left:3px solid #888;padding:2px 5px;margin-bottom:4px;background:rgba(0,0,0,0.07);font-size:11px;color:#555;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px;"><b>' + properties.quote.name + ':</b> ' + properties.quote.msg + '</div>';
    }
	properties.text = properties.text.replaceAll('{NAME}',thisName)
		.replaceAll('{COLOR}',thisColor);
	let originalText = markupify(properties.text,true);
	properties.text = markupify(properties.text)
    chatContent += properties.text;
    $("#chat_" + localId).html(chatContent);

   if(!properties.text.startsWith('-')){speak.play(
	   									originalText.replaceAll('[[',''), { pitch: property.pitch, speed: property.sped },
										()=>{
											if(typeof onendCallback == 'function')onendCallback();  
											 document.getElementById("chat_" + localId).style.display="none";
    document.getElementById("point_" + localId).style.display="none";
										}
        
   );}

    $("#bworg").click(() => {
      window.open("https://bonziworld.org","_blank");
    });
  
  } 
  var update = (properties,reDraw=true) => {
    var tagEl = document.getElementById("tag_" + localId);
    if(tagEl){
      if(properties.tag && properties.tag.length > 0){
        tagEl.innerHTML = properties.tag;
        tagEl.style.display = "inline";
      } else {
        tagEl.innerHTML = "";
        tagEl.style.display = "none";
      }
    }
    $("#name_" + localId).html((properties.tag && properties.tag.length > 0 ? "<div class='bonzi_tag'>"+properties.tag+"</div>" : "") + markupify(properties.name));
    isStaticImage = false;
    if(typeof properties.firstJoin == "boolean"){
		property.firstJoin = properties.firstJoin;
		img.src = properties.color;
	}
	else {img.src = properties.color}
	if(reDraw){
    draw(0,0);
    animate({type: "idle"});}
    if(Array.isArray(properties.hats)){
      currentHats = properties.hats;
      drawHats();
    }
  }
  this.leave = (instant=false) => {
		let leaveFrames = [
			[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],[13,2],[14,2],[15,2],[16,2],[17,2],
			[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],null
		];
		leaveFrames.forEach((frameInfo,i) => {
			setTimeout(() => {
				if(frameInfo != null && !instant){
					toFrame(...frameInfo);
				} else {
					removeBonziElements(localId);
					clearInterval(vehicleOverlayLoop);
		
					bonzislist.splice(screenbonzis({id:localId}).queue,1);
					bonzislist.forEach((currentBonzi,i) => {bonzislist[i].queue=i;});
				}
			},i*this.frameTick);
		});
  };
  this.toFrame = toFrame;
  this.animate = animate;
  this.move = move;
  this.stopDrag = () => { mousestat = "up"; };
  this.draw = draw;
  this.talk = talk;
  this.update = update;
  this.parseEvents = (eventArray) => {
	  let presetFrames = {
		  "shrug":{
			  "fwd":[],
			  "back":[]
		  }
	  };
	  let lastMsgLength = 1;
	  let i = 0;
	  let processArray = () => {
		  let exitContinue = () => {i++; processArray();}
		  
		  let eventCall = eventArray[i];
		  if(eventCall[0] == 'msg'){
			  talk({text:eventCall[1].msg},()=>{setTimeout(exitContinue,1000);});
		  } else if(eventCall[0] == 'animation_preset')  {
			  let animationNames = Object.keys(animationList);
			  let animationRequest = eventCall[1].split('_');
			  if(animationRequest.length > 1 && animationNames.includes(animationRequest[0])){
 				  let currentAnimation = animationList[animationRequest[0]];
				  animationPlayback(currentAnimation,animationRequest[1])
				  
				  setTimeout(exitContinue,2200);
			  } else {exitContinue();}
			  
		  }
	  };
	  processArray();
  };

  var pos = {x: document.getElementById(localId).style.left, y: document.getElementById(localId).style.top};

  this.tag = property.tag || "";
  this.name = property.name;

  if(this.tag && this.tag.length > 0){
    var tagEl = document.getElementById("tag_" + localId);
    if(tagEl){tagEl.innerHTML = this.tag; tagEl.style.display = "inline";}
  }

  img.src = colorurl;
  img.onload = () => {
    if(img.naturalWidth === 3400 && img.naturalHeight === 3360){
      isStaticImage = false;
    } else {
      isStaticImage = true;
    }
    draw(0,0);
    drawHats();
    var yInt = parseInt(document.getElementById(localId).style.top);
    var xInt = parseInt(document.getElementById(localId).style.left);
    move({x: xInt, y: yInt});
	if(typeof property.firstJoin == "boolean" ){
		if(property.firstJoin){
			let joinFrames = [
				[6,17],[7,17],[8,17],[9,17],[10,17],[11,17],[12,17],[13,17],[14,17],[15,17],[16,17],[17,17],
				[1,18],[2,18],[3,18],[4,18],[5,18],[6,18],[7,18],[8,18],[9,18],[10,18],[11,18],[12,18],[13,18],[14,18],
				[1,1],null
			];
			let frameTick = this.frameTick;
			joinFrames.forEach((frameInfo,i) => {
				setTimeout(() => {
					if(frameInfo != null){
						toFrame(...frameInfo);
					} else {
						draw(0,0);
					}
				},i*frameTick);
			});
		} else {
			draw(0,0);
		}
	}
	
  }
  drawHats();

  var mousestat = "up";

  var touchDragActive = false;
  var touchStartX = 0;
  var touchStartY = 0;
  var bonziStartX = 0;
  var bonziStartY = 0;

  canvas.addEventListener("touchstart", function(e) {
    e.preventDefault();
    raiseBonzi(localId);
    touchDragActive = true;
    var t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    bonziStartX = parseInt(canvas.style.left) || 0;
    bonziStartY = parseInt(canvas.style.top) || 0;
    $("body").css({"user-select":"none"});
  }, {passive: false});

  canvas.addEventListener("touchmove", function(e) {
    e.preventDefault();
    if (!touchDragActive) return;
    var t = e.touches[0];
    var dx = t.clientX - touchStartX;
    var dy = t.clientY - touchStartY;
    var nx = bonziStartX + dx;
    var ny = bonziStartY + dy;
    move({x: nx + "px", y: ny + "px"});
  }, {passive: false});


  canvas.addEventListener("touchend", function(e) {
    touchDragActive = false;
    $("body").css({"user-select":"auto"});
  }, {passive: false});

  var mouseloop = setInterval(() => {
    var xmax = $(window).width() - 200;
    var ymax = $(window).height() - 160 - 30;
    var newx = mousex - 90;
    var newy = mousey - 90;
    var xqueue = newx > 0 && newx < xmax;
    var yqueue = newy > 0 && newy < ymax;
    if(mousestat == "down"){
      if(xqueue && yqueue){
        move({x: newx + "px", y: newy + "px"});
      }
    }
    if(document.getElementById(localId)){
      pos = {x: $("#" + localId).position().left, y: $("#" + localId).position().top};

      this.left = pos.x;
      this.top = pos.y;
    }
    
  },10);
  document.onmousemove = (e) => {
    e = window.event;
    mousex = e.clientX;
    mousey = e.clientY;
  }
  document.getElementById(localId).onmousedown = () => {
    raiseBonzi(localId);
    mousestat = "down";
    $("body").css({
      "user-select": "none"
    });
    $(".context_menu").css({
      "user-select": "auto"
    });
  }
  document.getElementById(localId).onmouseup = () => {
    mousestat = "up";
    $("body").css({
      "user-select": "auto"
    });
    $(".context_menu").css({
      "user-select": "auto"
    });
  }
  document.getElementById(localId).oncontextmenu = () => {
    var parsetop1 = parseInt(document.getElementById(localId).style.top);
    var hidectx = () => {$("#context_" + localId).hide();$("#context_" + localId).remove();}
    var parsetop = parsetop1 + 50;
    $(".bonzi_canvas").on("mousedown", hidectx);
    $(".icon").click(hidectx);
    $("#chat_message").click(hidectx);
	var foundBonzi = screenbonzis({id:localId});
	var rawName = (foundBonzi && foundBonzi.name) ? foundBonzi.name : "";
	var toName = rawName;
	if(toName.indexOf('<') !== -1){
		var tmp = document.createElement('div');
		tmp.innerHTML = toName;
		toName = tmp.textContent || tmp.innerText || toName;
	}
	toName = toName.trim();

	var isMuted = foundBonzi && foundBonzi.mute === true;
	var muteLabel = isMuted ? 'Unmute' : 'Mute';

	$("#content").append(`
		<div class='context_menu' id='context_${localId}' style='top:${parsetop}px; left: ${document.getElementById(localId).style.left}'>
			<p class="context_text" id="${localId}_asshole" onclick='socket.emit("command",{type:"asshole",param:"${toName}"});'>Call an asshole</p>
			<p class="context_text" id="${localId}_asshole" onclick='socket.emit("command",{type:"bass",param:"${toName}"});'>Call a bass</p>
			<p class="context_text" id="${localId}_mute" onclick='(function(){var b=screenbonzis({id:"${localId}"});if(b){b.mute=!b.mute;document.getElementById("${localId}_mute").innerText=b.mute?"Unmute":"Mute";}})();'>${muteLabel}</p>
			<div id="ctx_mod_${localId}"></div>
		</div>`);
	var modDiv = document.getElementById("ctx_mod_"+localId);
	if(myLevel > 1){
		modDiv.insertAdjacentHTML('beforeend','<hr style="margin:2px 0;">');
		modDiv.insertAdjacentHTML('beforeend','<p class="context_text" onclick=\'(function(){var t=prompt("New tag for '+toName+':");if(t!==null)socket.emit("command",{type:"modtag",param:"'+localId+' "+t});})()\'>Set tag</p>');
		modDiv.insertAdjacentHTML('beforeend','<p class="context_text" onclick=\'(function(){var n=prompt("New name for '+toName+':");if(n!==null)socket.emit("command",{type:"modname",param:"'+localId+' "+n});})()\'>Set name</p>');
		modDiv.insertAdjacentHTML('beforeend','<p class="context_text" style="color:red;" onclick=\'if(confirm("Nuke '+toName+'?"))socket.emit("command",{type:"nuke",param:"'+localId+'"})\'>Nuke</p>');
		modDiv.insertAdjacentHTML('beforeend','<p class="context_text" style="color:orange;" onclick=\'openBanDialog("'+localId+'")\'>Ban</p>');
		modDiv.insertAdjacentHTML('beforeend','<p class="context_text" style="color:green;" onclick=\'if(confirm("Bless '+toName+'?"))socket.emit("command",{type:"bless",param:"'+localId+'"})\'>Bless</p>');
	}
		 document.body.onmouseup = (e) => {
			if(e.target.id !== 'context_'+localId && document.getElementById('context_'+localId) != null)document.getElementById('context_'+localId).style.display='none';
		};
    return false;
  }
}
function updateUsers(){
  userAmt = bonzislist.length;
  $("#users_online").html(userAmt);
}
function urlify(text) {
	if(text.includes('<img class="user_img"') || text.includes('<video class="user_vid"'))return text;
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function(url) {
    return '<a href="'+url+'" target="_blank">'+url+'</a>';
  });
}
function txtDuration(txt){
	var wordsPerMinute = 80;
    var words = txt.split(' ').length;
    if(words < 2 && txt.length > 20){
      wordsPerMinute = 10;
    }
    if(words < 2 && txt.length > 70){
      wordsPerMinute = 4;
    }
    var approximateDuration = (words / wordsPerMinute) * 60 * 1000; 
	
	return approximateDuration;
}
function screenbonzis(properties){
  var bonziselect = "";
  for(i=0;i<bonzislist.length;i++){
    if(bonzislist[i].id == properties.id){
      bonziselect = bonzislist[i];
    }
  }
  return bonziselect;
}
 var randompos = (type) => {
      var maxh = $(window).height() - 180 - 30;
      var maxw = $(window).width() - 180;
      
      var newx1 = Math.floor(Math.random() * maxw);
      var newy1 = Math.floor(Math.random() * maxh);
      if(type == "x"){
        return newx1 + "px";
      }
      if(type == "y"){
        return newy1 + "px";
      }
    };
function removeAllById(id){
	document.querySelectorAll('[id="'+id+'"]').forEach(el => el.remove());
}
function removeBonziElements(id){
	removeAllById(id);
	removeAllById('name_'+id);
	removeAllById('chat_'+id);
	removeAllById('point_'+id);
	for(let layerIdx = 1; layerIdx <= 5; layerIdx++){
		removeAllById('hat'+layerIdx+'_'+id);
	}
	removeAllById('vehicle_'+id);
}
function resetUsers(userlist) {
    bonzislist.forEach(bonziData => removeBonziElements(bonziData.id));
    bonzislist = [];

    let seen = new Set();
    let deduped = userlist.filter(u => !seen.has(u.id) && seen.add(u.id));

    userAmt = deduped.length;
    deduped.forEach(u => {
        var newuser = new bonzi(u.color, randompos("x"), randompos("y"), {name:u.name, id:u.id, tag:u.tag||"", hats:u.hats||[], firstJoin:true});
        newuser.queue = bonzislist.length;
        bonzislist.push(newuser);
    });
    updateUsers();
}
let disconnectErr = true;
function unfuck(){
	let destruction = [];
	for(let i=0;i<document.querySelectorAll('*').length;i++){
		let c = document.querySelectorAll('*')[i];
		bonzislist.forEach(b => {
			if(c.id.includes(b.id) || c.id == b.id){
				if(c.style.left.length < 1 && !c.id.includes('tag'))destruction.push(c);
			}
		});
	}
	destruction.forEach(fuckedElement => {fuckedElement.remove();});
}

function reconnect(newRoom) {
	let loginLoop = () => {
		disconnectErr=false;
		socket.off('disconnect');
		listenerNames.forEach(listenName => {socket.off(listenName);});
		resetUsers([]); 
		worldActive = false;
		targetMode = false;
		myVehicle = null;
		wasdKeys = {up:false,down:false,left:false,right:false};
		let tc = document.getElementById('target_cursor');
		let ov = document.getElementById('world_click_overlay');
		if(tc)tc.style.display='none';
		if(ov)ov.style.display='none';
		setTimeout(() => {  login(newRoom); setTimeout(() => { if(!socket.connected)loginLoop(); },1000); },1000);
		disconnectErr=true;
	};
	loginLoop();
}

let mainAudio = new Audio();
let mainSrc = "";


let musicList = [];
					let loadedMusic = loadArray('objectsmusic');
					musicList = (typeof loadedMusic == 'object' && loadedMusic !== null) ? loadedMusic : [];
					if(musicList == null)musicList=[];
					if(typeof musicList.length == 'undefined')musicList=[];
					let lastId='';
					let currentId='';
					let playSong = (songSrc,songId) => {
						if(currentId == ''){currentId=songId;}
						else {
							lastId=currentId;
							currentId=songId;
						}
						
						if(lastId.length > 0)document.getElementById(lastId).style.background='initial';document.getElementById(lastId).style.color='white';
						if(currentId.length > 0){
							currentId=songId;document.getElementById(currentId).style.color='lime';
							document.getElementById(currentId).style.background='black';
							mainAudio.src = songSrc;
						}
						
					};
					function updateList() {
						saveArray('objectsmusic',musicList);
						document.getElementById('musicplaylist').innerHTML='';
						if(typeof musicList != 'object' || musicList == null)return;
						musicList.forEach((musicObject,i) => {
							document.getElementById('musicplaylist').insertAdjacentHTML('beforeend','<p class="optionmusic" id="'+musicObject.name.substring(0,3)+'" onclick="playSong(musicList['+i.toString()+'].src,this.id);">'+musicObject.name+'&nbsp;&nbsp;&nbsp; || <span onclick="musicList.splice('+i.toString()+',1); updateList();">???</span></p>');
						});
						
					};
socket.on("err",(errorTxt)=>{if(document.body.innerHTML.includes(errorTxt))return; 
new Dialog({title:'Error',width:300,height:180,html:`<div style="display:flex;gap:20px;width:100%;height:100%;justify-content:center;align-items:center;"><img src="./img/error/logo.png" width="64" height="auto"><span>${errorTxt}</span></div>`});});
  let typingStatus = {
	  focused:false,
	  t:0,
	  last:0
  };
let roomModify = {
	public:false	
};

function login(newRoom){
	socket.connect();
	if(typeof newRoom == 'undefined')newRoom=$("#login_room").val();
	listenerNames.forEach(listenerName => {socket.off(listenerName);});
	socket.off('pow_challenge');
	socket.off('pow_solution');
	Object.keys(applets).forEach(appletName => {
		let currentApplet = applets[appletName];
		document.getElementById(currentApplet.buttonId).onclick = () => {
			if(!currentApplet.open){
				currentApplet.onpress();
			}
		};
	});
	document.getElementById('chat_start').onclick = () => {
		if(document.getElementById('startmenu').style.display == 'none')document.getElementById('startmenu').style.display = 'flex';
		document.getElementById('content').onmouseup = (e) => {
			if (!document.getElementById('startmenu').contains(e.target)) {
				document.getElementById('startmenu').style.display = 'none';
			}
		};
	};
  $("#login_card").hide();
  $("#login_load").show();
  let nn = String($("#login_name").val()).substring(0, 64);
  if(nn.length < 1)nn=profileList[0].name;
 socket.emit("login", { 
    name: nn, 
    room: typeof newRoom === 'string' ? newRoom.substring(0, 64) : "",
    bonzicoinPass: typeof profileList[0].bonzicoinPass === 'string' ? profileList[0].bonzicoinPass : undefined
});
  worldActive = true;

  socket.once('pow_challenge', async (data) => {
	showPoWIndicator();
	let nonce = await solvePoW(data.challenge, data.difficulty);
	hidePoWIndicator();
	socket.emit('pow_solution', {nonce: nonce});
  });

  setTimeout(() => {socket.emit('command',{type:'color',param:profileList[0].color});  },1000);
  setInterval(() => {typingStatus.t+=100; if(typingStatus.t>2000){typingStatus.t=2000;}},100);
  document.getElementById("chat_message").onfocus = () => {typingStatus.focused=true;};
  document.getElementById("chat_message").onblur = () => {typingStatus.focused=false;};
  document.getElementById("chat_message").onkeydown = (e) => {
	if(typingStatus.focused){
		socket.emit('typing',1);
		typingStatus.t=0;
	}
  };
  document.getElementById("chat_message").onkeyup = (e) => {
	setTimeout(() => {if(typingStatus.t > 1500){socket.emit('typing',0);}},3500);
    if(e.key == 'Enter') sendMsg();
  };
  
  var clickhandlers = [
    {id: "#chat_send", func: () => {
      sendMsg();
    }},
	{id: "#bonzivm_start", func: () => {
      window.bonziVMsrc="none";
		if(document.body.innerHTML.includes('id="bonzivmcontainer">')){errs["applet_open"](); return;}
			let newWidth = 800;
			let newHeight = 600;
			if(isMobile()){newWidth=300; newHeight=650;};
            new Dialog({title:"BonziVM",width:newWidth,height:newHeight,html:`
			<style>.server {
    background: #7d4eba;
    background: linear-gradient(0deg, rgba(125, 78, 186, 1) 24%, rgba(158, 84, 255, 1) 76%, rgba(199, 156, 255, 1) 92%, rgba(177, 130, 237, 1) 98%);
    border: 1px solid purple;
    border-radius: 3px;
    padding: 3px;
    color: white;
    text-shadow: 2px 2px 2px rgba(0,0,0,0.5);
    filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.65));
}</style>
			<div style="width:100%;height:100%;overflow-x:scroll;overflow-y:scroll;display:none;" id="bonzivmcontainer">
			<iframe id="bonzivm_output" width="${newWidth}" height="${newHeight}" style="display:none;"></iframe></div>
<div id="mainmenu_vm" onclick="serverstatus.innerHTML='Selected server: '+window.bonziVMsrc;" style="background: #d3b5f7;
background: radial-gradient(circle, rgba(211, 181, 247, 1) 0%, rgba(174, 113, 252, 1) 39%, rgba(158, 84, 255, 1) 86%);width:100%;height:100%;">
    <p id="serverstatus">Selected server: none</p>
    <button class="server" onclick="
        mainmenu_vm.style.display='none';
        bonzivm_output.style.display='block';
		document.getElementById('bonzivmcontainer').style.display='block';
        if(!window.bonziVMsrc.includes('bonzi.gay')){bonzivm_output.src = window.bonziVMsrc;}
        else{
        bonzivm_output.srcdoc='<h2>This server has an exception to open in a seperate window, due to chrome security policy.</h2>';
        window.open(window.bonziVMsrc,'BonziVM','width=600, height=480');
        }">Run VM</button>
    <hr>
    <button class="server" onclick="window.bonziVMsrc='';">
    <h2>mickai.me</h2>
    <hr>
    A modded version of bonzi.gay with necessary features
    </button>
     <button class="server" onclick="window.bonziVMsrc='';
    <h2>BonziWORLD 2</h2>
    <hr>
    This server (just in case you didn't know)
    </button>
	<button  class="server" onclick="window.bonziVMsrc='https://bonzi.gay';">
    <h2>Bonzi.Gay</h2>
    <hr>
    Erik's standard BonziWORLD. Opens in a chrome tab due to his WASM addiction.
    </button>
	    <button  class="server" onclick="window.bonziVMsrc='https://bonzi.gay';">
    <h2>Bonzi.Gay</h2>
    <hr>
    Erik's standard BonziWORLD. Opens in a chrome tab due to his WASM addiction.
    </button>
    <hr>
	
    <input type="text" placeholder="Custom BonziWORLD URL" id="customurl"><button onclick="window.bonziVMsrc=customurl.value;">Submit</button>
    <br>
    <p>Optionally, input a BonziWORLD server URL and BonziVM will attempt to run it</p>
</div>
`});
    }},
    {
		id:'#notepad_start',
		func:()=>{
			if(document.body.innerHTML.includes('id="notepad"')){errs["applet_open"](); return;}
			new Dialog({title:"Notepad",width:'400',height:'300px',html:`
        		<textarea id="notepad" style="width:100%;height:300px;"></textarea>
				<button onclick="eval(document.getElementById('notepad').value)">Run</button>
      		`});
			
		}
	},
	{id: '#info_icon',func:()=>{
		new Notify({
			title:'Welcome',
			body:'This is a beta/prototype of BonziWORLD XP, the next generation of BonziWORLD. Please note there may be glaring bugs or issues as this server was made from scratch in like 2 nights.',
			parent:'info_icon'});
	}},
	{
		id:'#musicplayer_start',
		func:()=>{
			if(document.body.innerHTML.includes('id="musicname">')){errs["applet_open"](); return;}
			new Dialog({title:"Music Player",width:'360',height:'380',html:`
			    <div style="width:100%;height:100%;overflow:hidden;padding:0;background: rgb(31 65 98);color: white;">
				
				
				
				<div style="border:1px solid gray;width:300px;height:200px;overflow-y:scroll;overflow-x:hidden;" id="musicplaylist">
				
				</div>
				<div style="background-image: linear-gradient(rgb(105, 163, 212) 0%, white 7%, rgb(163 190 239) 49%, rgb(146, 170, 221) 50%, rgb(66, 100, 190) 100%);
    height: 140px;
    padding: 8px;">
				
				<button class="mediacontrol" onclick="mainAudio.play();" style="
					width: 40px;
					height: 40px;
				">▶</button>
				<button class="mediacontrol" onclick="mainAudio.load();">⏸</button>
				<hr>
				<input type="text" id="musicname" placeholder="Music name"><input type="text" id="musicurl" placeholder=".mp3 or .wav URL"><br>
				<button id="musicadd">+ Music</button>
				
				</div>
				
				</div>
			`});
			
					updateList();
					document.getElementById('musicadd').onclick = () => {
						musicList.push({
							name:document.getElementById('musicname').value.length < 1 ? "Untitled" : document.getElementById('musicname').value,
							src:document.getElementById('musicurl').value
						});
						document.getElementById('musicname').value = '';
						document.getElementById('musicurl').value = '';
						updateList();
					};
		}
	}
  ];
  for(i = 0; i < clickhandlers.length; i++){
	  let functions = clickhandlers[i].func;
    document.getElementById(clickhandlers[i].id.substring(1)).onclick = () => {functions();};
  }
	
  socket.off('msg');
  socket.off('typing');
  socket.off('command');

  socket.on("room", (data) => {
    if(typeof data.selfId === 'string')myId = data.selfId;
    $("#page_login").hide();
    $("#room_public").hide();
    $("#room_private").hide();
    $("#room_owner").hide();
	$("#room_id").text(data.room);
    if(data.isPublic){
      $("#room_public").show();
      $("#room_id").text(data.room);
    } else {
      $("#room_private").show();
      $("#room_id").text(data.room);
    }
    if(data.isOwner){
      $("#room_owner").show();
	  $('#room_toggle').css({'display':'block'});
	  $('#room_toggle').click(() => {
		  roomModify.public=!roomModify.public;

		  let s = 'off';
		  if(roomModify.public)s='on';

		  socket.emit('command',{type:'roompublic',param:s});
	});
    }
setTimeout(unfuck,3000);
setInterval(unfuck,5000);
  });
  socket.on("userlist", (data) => {
	document.getElementById('users_online').innerText = data.list.length;
	resetUsers(data.list);
  });
  socket.on("newuser", (data) => {
	document.getElementById('users_online').innerText = parseInt(document.getElementById('users_online').innerText)+1;
	var existingBonzi = screenbonzis({id:data.id});
	if(existingBonzi){
		removeBonziElements(data.id);
		var existingIndex = bonzislist.indexOf(existingBonzi);
		if(existingIndex !== -1)bonzislist.splice(existingIndex,1);
		bonzislist.forEach((currentBonzi,i) => {bonzislist[i].queue=i;});
	}
    var newuser = new bonzi(data.color,randompos("x"),randompos("y"),{name: data.name, id: data.id, tag: data.tag||"", hats: data.hats||[],firstJoin: true});
	newuser.queue = bonzislist.length;
    bonzislist.push(newuser);
  });
  socket.on("leave", (data) => {
	  console.log(data);
	if(typeof screenbonzis({id:data.id}).leave == "function")screenbonzis({id:data.id}).leave();
	setTimeout(() => {updateUsers();},3000);
  });
  socket.on("msg", (data) => {
	
    let thisbonzi = screenbonzis({id: data.id});

	let newMsg = urlify(data.msg.replaceAll('{NAME}',thisbonzi.name).replaceAll('{COLOR}',thisbonzi.color));
	
    if(!thisbonzi.mute)newLog({name:thisbonzi.name, msg:newMsg, quote: data.quote || null});
    thisbonzi.talk({text: newMsg, quote: data.quote || null});
  });
  socket.on("userEvent", (data) => {
	  let thisbonzi = screenbonzis({id:data.id});
	  let eventList = data.events;
	  thisbonzi.parseEvents(eventList);
  });
  socket.on("asshole", (data) => {
    let thisbonzi = screenbonzis({id: data.by});
	let queue = ["Hey, " + data.to + "!","You're a fucking asshole!"];
    queue.forEach((queueText,i) => { setTimeout(() => { thisbonzi.talk({text:queueText});},(i-0.2)*txtDuration(queueText)); });
  });
  socket.on("bass", (data) => {
    let thisbonzi = screenbonzis({id: data.by});
	let queue = ["Hey, " + data.to + "!","You're a fucking bass!"];
    queue.forEach((queueText,i) => { setTimeout(() => { thisbonzi.talk({text:queueText});},(i-0.2)*txtDuration(queueText)); });
  });
  socket.on("updateUser", (data) => {
    let n = data.name;
	let oldBonzi = screenbonzis({id: data.id});
    if(data.name !== ""){data.name = n}
    if(typeof data.level == "number")myLevel = data.level;

	let indicator = data.typing == true ? ' (...)' : '';
    screenbonzis({id: data.id}).update({name: data.name+indicator,typing:data.typing,coins:data.coins, color: data.color, id: data.id, tag: data.tag||"", hats: data.hats||[],firstJoin:false},false);
  });

  socket.on("wallet",(data) => {
    myWallet = data;
    if(data && typeof data.equippedVehicle !== 'undefined')myVehicle = data.equippedVehicle || null;
    refreshBonziCoinsUI();
  });
  socket.on("stocksUpdate",(data) => {
    latestStocks = data;
    refreshStocksUI();
  });
  socket.on("bonzicoinErr",(msg) => {
    notifyBonziCoin(msg);
  });
  socket.on("coinGiftReceived",(data) => {
    notifyBonziCoin(data.from + ' gifted you ' + data.amount + ' BonziCOINS!');
  });
  socket.on("stockPosition",(data) => {
    notifyBonziCoin('Invested in ' + data.ticker + '.');
  });
  socket.on("stockSold",(data) => {
    notifyBonziCoin('Sold ' + data.ticker + ' for ' + data.payout + ' BonziCOINS.');
  });
  socket.on("userMoveTo",(data) => {
    handleRemoteMove(data);
  });
  socket.on("worldSync",(data) => {
    if(!data)return;
	//put skiddies back in line
    if(data.self && !myWorldPos.moving && !myVehicle){
      myWorldPos.x = data.self.x;
      myWorldPos.y = data.self.y;
    }
    if(Array.isArray(data.players)){
      data.players.forEach(p => {
        if(p.id === myId)return;
        let b = screenbonzis({id:p.id});
        if(!b)return;
        b.vehicle = p.vehicle || null;
        if(!b.moving){ b.worldX = p.x; b.worldY = p.y; }
      });
    }
  });
  socket.on("userVehicle",(data) => {
    let b = screenbonzis({id:data.id});
    if(b)b.vehicle = data.vehicle;
    if(data.id === myId)myVehicle = data.vehicle;
  });
  socket.on("vehicleDestroyed",(data) => {
    let b = screenbonzis({id:data.id});
    if(b)b.vehicle = null;
    if(data.id === myId){
      myVehicle = null;
      wasdKeys = {up:false,down:false,left:false,right:false};
      notifyBonziCoin('Your vehicle was destroyed!');
      refreshBonziCoinsUI();
    }
  });

  socket.on("nuke",(data)=>{
    let nuketarget = screenbonzis({id:data.id});
	let positioning = document.getElementById(data.id).getBoundingClientRect();
	insertNuke(positioning.x,positioning.y,nuketarget.color);
	setTimeout(() => {nuketarget.leave(true);},1);
  });
  disconnectHandle =  () => {
	setTimeout(() => {reconnect(myRoom); },2000);
	if(document.body.innerHTML.includes('<h4>BonziWORLD.exe has encountered an error') || !disconnectErr)return;
    new Dialog({title:'Error',html:`
		<img src="./img/error/logo.png"><br>
		<h4>BonziWORLD.exe has encountered an error and needs to close.</h4>
		<br>
        Nah, but seriously there was an error and you got disconnected from the server. 
		Chances are, your internet just died out for a brief moment or your device went to sleep. 
		Otherwise the server just screwed up.<br>
        <br>
        Try and reload the page. If that doesn't work and your internet is okay, then panic. 
		We'll probably be back up Soon™ though.<br>
        <br>
        <a href="#" onclick="window.location.reload()">Reload?</a><br>
	`})
  };
  socket.on("disconnect",disconnectHandle);
   
  if(profileList[0].godmodePass !== null)socket.emit('command',{type:'godmode',param:profileList[0].godmodePass});
  
}


let latestStocks = {};
let myVehicle = null;
//this can never drift from what the server actually offers/owns
let vehicleClientPresets = {};
socket.on('vehiclePresets', (data) => {
	if(typeof data !== 'object' || data === null)return;
	vehicleClientPresets = data;
	if(activeBonziTab === 'shop' || activeBonziTab === 'inventory')refreshBonziCoinsUI();
});
let hatShopClient = {
	wizard:150, windows:200, truck:120, rainbow:300, premium:500, pirate:180,
	peedy:220, ninja:160, joel:400, hat:80, crown:600, cowboy:140, clippy:250,
	chef:130, blunt:170, astronaut:350
};

function genBonziPassword(){
	let chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
	let out='';
	for(let i=0;i<20;i++)out+=chars.charAt(Math.floor(Math.random()*chars.length));
	return out;
}

function notifyBonziCoin(text){
	if(!notifyUserEvent_BONZICOIN)return;
	new Dialog({title:'BonziCOINS', width:400,height:300,html:`<img src='./img/desktop/icons/bonzicoin.gif' width='32' height='32'> <br> ${text}`});
}

// 12 gauge shotgun to the foot
let bonziCoinsTabs = {
	wallet:   { label:'Wallet',    render:function(){
		if(!myWallet.hasAccount){
			return `<p>You don't have an active BonziCOIN account loaded.</p>
			<p>Go to the <b>Password</b> tab to create or load one — without it, any coins you earn this session will be lost when you disconnect.</p>`;
		}
		return `
		    <button onclick="notifyUserEvent_BONZICOIN=!notifyUserEvent_BONZICOIN;">Toggle Notifications</button>
			<h3 style="margin:4px 0;">Balance: ${myWallet.coins} BonziCOINS</h3>
			<p>Company: ${myWallet.company ? myWallet.company : 'none'}</p>
			<hr>
			<div style="display:flex;">
			<div id="bonzicoin_console">
			Awaiting mining queue initiation
			</div>
			<button class="radio_large" id="minecoin" onclick="socket.emit('mine');">Mine <img src="./img/desktop/icons/pickaxe.png" width="45" height="45"></button><hr><br>
			<p><b>Gift coins</b></p>
			<div style="max-height:50px;">
				<input type="text" id="gift_to" placeholder="Player name or ID"><br><br>
				<input type="number" id="gift_amount" min="1" step="1" placeholder="Amount" max="${myWallet.coins}"><br><br>
				<button id="gift_send_btn">Send Gift</button>
				<p style="font-size:11px;opacity:0.7;">You can never gift more than your current balance.</p>
			</div>
			`;
	}},
	stocks:   { label:'Stocks',    render: renderStocksTab },
	shop:     { label:'Shop',      render: renderShopTab },
	hats:     { label:'Hats',      render: renderHatsTab },
	inventory:{ label:'Inventory', render: renderInventoryTab },
	password: { label:'Password',  render: renderPasswordTab }
};
let activeBonziTab = 'wallet';

function openBonziCoinsMenu(){
	if(document.body.innerHTML.includes('id="bonzicoins_tabbar"')){errs["applet_open"](); return;}
	let tabBtns = Object.keys(bonziCoinsTabs).map(key =>
		`<button class="bcn_tab_btn" data-tab="${key}" id="bcn_tabbtn_${key}">${bonziCoinsTabs[key].label}</button>`
	).join('');
	new Dialog({
		title:'BonziCOINS',
		width:420, height:480,
		html:`
		<div id="bonzicoins_tabbar" style="display:flex;flex-wrap:wrap;gap:2px;margin-bottom:6px;">${tabBtns}</div>
		<div id="bonzicoins_content" style="background: #9b66e9;width:100%;height:400px;color: white;text-shadow: 2px 2px rgba(0,0,0,0.4);overflow-y:auto;overflow-x:hidden;"></div>
		`
	});
	Object.keys(bonziCoinsTabs).forEach(key => {
		document.getElementById('bcn_tabbtn_'+key).onclick = () => { activeBonziTab = key; refreshBonziCoinsUI(); };
	});
	socket.emit('stock_list');
	refreshBonziCoinsUI();
}

function refreshBonziCoinsUI(){
	let content = document.getElementById('bonzicoins_content');
	if(!content)return;
	Object.keys(bonziCoinsTabs).forEach(key => {
		let btn = document.getElementById('bcn_tabbtn_'+key);
		if(btn)btn.style.fontWeight = (key===activeBonziTab) ? 'bold' : 'normal';
	});
	content.innerHTML = bonziCoinsTabs[activeBonziTab].render();
	wireBonziTabEvents(activeBonziTab, content);
}
function refreshStocksUI(){
	if(activeBonziTab === 'stocks')refreshBonziCoinsUI();
}



function renderStocksTab(){
	let tickers = Object.keys(latestStocks);
	let rows = tickers.map(t => {
		let c = latestStocks[t];
		let last = c.values[c.values.length-1];
		let prev = c.values.length>1 ? c.values[c.values.length-2] : last;
		let diff = (last-prev).toFixed(2);
		return `<div style="border:1px solid #8866b5;border-radius:4px;padding:6px;margin-bottom:6px;">
			<b>${t}</b> — ${last} (${diff>=0?'+':''}${diff})
			<canvas class="stock_graph" id="graph_${t}" width="360" height="80" style="display:block;width:100%;height:80px;margin:4px 0;background:rgba(0,0,0,0.2);"></canvas>
			<input type="number" id="invest_amt_${t}" min="1" step="1" placeholder="Invest amount" style="width:110px;">
			<button class="stock_invest_btn" data-ticker="${t}">Invest</button>
			<button class="stock_sell_btn" data-ticker="${t}">Sell my position</button>
		</div>`;
	}).join('');
	return `
	${rows || '<p>No companies yet.</p>'}
	<hr>
	<p><b>Start a company</b> (one exchange per IP)</p>
	<input type="text" id="new_company_name" placeholder="Company/ticker name" maxlength="10">
	<button id="create_company_btn">Create</button>
	`;
}

function renderShopTab(){
	let vehicleRows = Object.keys(vehicleClientPresets).map(v => {
		let p = vehicleClientPresets[v];
		let owned = myWallet.vehicles && myWallet.vehicles.includes(v);
		return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
			<span style="flex:1;">${p.name} — ${p.cost} coins (max speed ${p.maxSpeed})</span>
			<button class="buy_vehicle_btn" data-vehicle="${v}" ${owned?'disabled':''}>${owned?'Owned':'Buy'}</button>
		</div>`;
	}).join('');
	return `<p><b>Vehicles</b></p>${vehicleRows}
	<p style="font-size:11px;opacity:0.7;">Equip a purchased vehicle from the Inventory tab, then drive with WASD.</p>`;
}

function renderHatsTab(){
	let rows = Object.keys(hatShopClient).map(h => {
		let owned = myWallet.hats && myWallet.hats.includes(h);
		return `<div style="display:flex;flex-direction:column;align-items:center;width:70px;display:inline-flex;margin:3px;">
			<img src="${hatList[h]||''}" style="width:50px;height:40px;object-fit:contain;">
			<span style="font-size:10px;">${h}</span>
			<span style="font-size:10px;">${hatShopClient[h]}c</span>
			<button class="buy_hat_btn" data-hat="${h}" ${owned?'disabled':''} style="font-size:10px;">${owned?'Owned':'Buy'}</button>
		</div>`;
	}).join('');
	return `<p><b>Hat Shop</b></p><div style="display:flex;flex-wrap:wrap;">${rows}</div>`;
}

function renderInventoryTab(){
	let hats = (myWallet.hats||[]).map(h=>`<span style="display:inline-block;margin:2px;padding:2px 6px;background:rgba(255,255,255,0.15);border-radius:3px;">${h}</span>`).join('') || '<i>none</i>';
	let vehicles = (myWallet.vehicles||[]).map(v => {
		let equipped = myWallet.equippedVehicle === v;
		return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
			<span style="flex:1;">${vehicleClientPresets[v] ? vehicleClientPresets[v].name : v}</span>
			<button class="toggle_vehicle_btn" data-vehicle="${v}">${equipped ? 'Unequip' : 'Equip'}</button>
		</div>`;
	}).join('') || '<i>none</i>';
	return `<p><b>Hats owned</b></p><div>${hats}</div><hr><p><b>Vehicles owned</b></p>${vehicles}
	<p style="font-size:11px;opacity:0.7;">Only one vehicle can be equipped at a time. Enable it here, then drive with WASD in-world.</p>`;
}

function renderPasswordTab(){
	let has = typeof profileList[0].bonzicoinPass === 'string' && profileList[0].bonzicoinPass.length > 0;
	return `
	<p>Your BonziCOIN password is the key to your coins, hats, and vehicles. If you don't save it, all progress is lost when you leave.</p>
	<div id="bcn_pass_display" style="font-family:monospace;background:rgba(0,0,0,0.3);padding:6px;border-radius:4px;word-break:break-all;">
		${has ? '••••••••••••••••••••' : '<i>none set</i>'}
	</div>
	<button id="bcn_pass_show_btn">${has?'Show password':'—'}</button>
	<hr>
	<input type="text" id="bcn_pass_input" placeholder="Choose your own password (8-64 chars)" maxlength="64">
	<button id="bcn_pass_generate_btn">Generate random</button><br><br>
	<button id="bcn_pass_save_btn">Save &amp; use this password</button>
	<p style="font-size:11px;opacity:0.7;">Saving stores the password in a cookie on this device.</p>
	`;
}

function wireBonziTabEvents(tab, content){
	if(tab === 'wallet'){
		let btn = document.getElementById('gift_send_btn');
		if(btn)btn.onclick = () => {
			let to = document.getElementById('gift_to').value;
			let amt = Number(document.getElementById('gift_amount').value);
			if(!to || !Number.isFinite(amt) || amt <= 0){notifyBonziCoin('Enter a valid recipient and amount.'); return;}
			if(amt > myWallet.coins){notifyBonziCoin('You cannot gift more than your balance.'); return;}
			socket.emit('gift',{to:to, amount:amt});
		};
	}
	if(tab === 'stocks'){
		document.querySelectorAll('.stock_invest_btn').forEach(b => {
			b.onclick = () => {
				let ticker = b.getAttribute('data-ticker');
				let amt = Number(document.getElementById('invest_amt_'+ticker).value);
				if(!Number.isFinite(amt) || amt <= 0){notifyBonziCoin('Enter a valid amount.'); return;}
				socket.emit('stock_invest',{ticker:ticker, amount:amt});
			};
		});
		document.querySelectorAll('.stock_sell_btn').forEach(b => {
			b.onclick = () => socket.emit('stock_sell',{ticker:b.getAttribute('data-ticker')});
		});
		let createBtn = document.getElementById('create_company_btn');
		if(createBtn)createBtn.onclick = () => {
			let name = document.getElementById('new_company_name').value;
			if(!name){notifyBonziCoin('Enter a company name.'); return;}
			socket.emit('stock_create',{name:name});
		};
		Object.keys(latestStocks).forEach(t => drawStockGraph(t));
	}
	if(tab === 'shop'){
		document.querySelectorAll('.buy_vehicle_btn').forEach(b => {
			b.onclick = () => socket.emit('buy_vehicle',{vehicle:b.getAttribute('data-vehicle')});
		});
	}
	if(tab === 'hats'){
		document.querySelectorAll('.buy_hat_btn').forEach(b => {
			b.onclick = () => socket.emit('buy_hat',{hat:b.getAttribute('data-hat')});
		});
	}
	if(tab === 'inventory'){
		document.querySelectorAll('.toggle_vehicle_btn').forEach(b => {
			b.onclick = () => {
				let v = b.getAttribute('data-vehicle');
				let equipping = myWallet.equippedVehicle !== v;
				socket.emit('equip_vehicle',{vehicle: equipping ? v : null});
			};
		});
	}
	if(tab === 'password'){
		document.getElementById('bcn_pass_show_btn').onclick = () => {
			let disp = document.getElementById('bcn_pass_display');
			if(typeof profileList[0].bonzicoinPass === 'string')disp.innerText = profileList[0].bonzicoinPass;
		};
		document.getElementById('bcn_pass_generate_btn').onclick = () => {
			document.getElementById('bcn_pass_input').value = genBonziPassword();
		};
		document.getElementById('bcn_pass_save_btn').onclick = () => {
			let val = document.getElementById('bcn_pass_input').value.trim();
			if(val.length < 8){notifyBonziCoin('Password must be at least 8 characters.'); return;}
			profileList[0].bonzicoinPass = val;
			saveArray('profiles', profileList);
			socket.emit('bonzicoin_auth',{pass: val});
			notifyBonziCoin('BonziCOIN password saved.');
		};
	}
}

function drawStockGraph(ticker){
	let canvas = document.getElementById('graph_'+ticker);
	if(!canvas)return;
	let ctx = canvas.getContext('2d');
	let values = latestStocks[ticker].values;
	if(!values || values.length < 2)return;
	let w = canvas.width, h = canvas.height;
	ctx.clearRect(0,0,w,h);
	let min = Math.min(...values), max = Math.max(...values);
	let range = (max-min) || 1;
	ctx.beginPath();
	ctx.strokeStyle = '#c39cec';
	ctx.lineWidth = 2;
	values.forEach((v,i) => {
		let x = (i/(values.length-1)) * (w-4) + 2;
		let y = h - 2 - ((v-min)/range) * (h-4);
		if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);
	});
	ctx.stroke();
}


const WORLD_SIZE = 10000;
const MAX_MOVE_DIST = 1200;     
const MOVE_DURATION_MS = 1000;  
const ON_FOOT_COOLDOWN_MIN_MS = 4000;
const ON_FOOT_COOLDOWN_MAX_MS = 5000;
let camera = {x: WORLD_SIZE/2, y: WORLD_SIZE/2};

let myWorldPos = {x: WORLD_SIZE/2, y: WORLD_SIZE/2, moving:false, moveOriginX:WORLD_SIZE/2, moveOriginY:WORLD_SIZE/2, moveTargetX: WORLD_SIZE/2, moveTargetY: WORLD_SIZE/2, moveStartTime:0};
let targetMode = false;
let nextMoveAllowedAt = 0;
let wasdKeys = {up:false,down:false,left:false,right:false};


function travelPosition(originX, originY, targetX, targetY, startTime, now){
	let elapsed = now - startTime;
	if(elapsed >= MOVE_DURATION_MS)return {x:targetX, y:targetY, done:true};
	let t = elapsed / MOVE_DURATION_MS;
	return {x: originX + (targetX-originX)*t, y: originY + (targetY-originY)*t, done:false};
}


function advanceLocalVehicle(dtSec){
	if(!myVehicle)return;
	let preset = vehicleClientPresets[myVehicle];
	if(!preset)return;
	let dx = (wasdKeys.right?1:0) - (wasdKeys.left?1:0);
	let dy = (wasdKeys.down?1:0) - (wasdKeys.up?1:0);
	let mag = Math.sqrt(dx*dx+dy*dy) || 1;
	let speed = preset.maxSpeed * 100;
	let nx = myWorldPos.x + (dx/mag)*speed*dtSec;
	let ny = myWorldPos.y + (dy/mag)*speed*dtSec;
	myWorldPos.x = Math.max(0, Math.min(WORLD_SIZE, nx));
	myWorldPos.y = Math.max(0, Math.min(WORLD_SIZE, ny));
	myWorldPos.moving = false; 
}

function ensureWorldOverlay(){
	if(document.getElementById('world_click_overlay'))return;
	document.body.insertAdjacentHTML('beforeend', `
		<div id="world_click_overlay" style="position:fixed;inset:0;z-index:9000;display:none;cursor:crosshair;"></div>
		<div id="target_cursor" style="position:fixed;width:26px;height:26px;margin-left:-13px;margin-top:-13px;border:2px solid rgba(255,255,255,0.85);background:rgba(255,255,255,0.25);border-radius:50%;pointer-events:none;z-index:99999;display:none;"></div>
		<div id="world_border_n" class="world_border_line"></div>
		<div id="world_border_s" class="world_border_line"></div>
		<div id="world_border_e" class="world_border_line world_border_vert"></div>
		<div id="world_border_w" class="world_border_line world_border_vert"></div>
	`);
	document.getElementById('world_click_overlay').addEventListener('click',(e) => {
		if(!targetMode || myVehicle)return;
		let now = Date.now();
		if(now < nextMoveAllowedAt)return;
		let cx = window.innerWidth/2, cy = window.innerHeight/2;
		let worldX = camera.x + (e.clientX - cx);
		let worldY = camera.y + (e.clientY - cy);
		worldX = Math.max(0, Math.min(WORLD_SIZE, worldX));
		worldY = Math.max(0, Math.min(WORLD_SIZE, worldY));

		let dx = worldX - myWorldPos.x, dy = worldY - myWorldPos.y;
		let dist = Math.hypot(dx,dy);
		if(dist > MAX_MOVE_DIST){

			let capAngle = Math.atan2(dy,dx);
			worldX = myWorldPos.x + Math.cos(capAngle)*MAX_MOVE_DIST;
			worldY = myWorldPos.y + Math.sin(capAngle)*MAX_MOVE_DIST;
		}

		nextMoveAllowedAt = now + ON_FOOT_COOLDOWN_MIN_MS + Math.random()*(ON_FOOT_COOLDOWN_MAX_MS-ON_FOOT_COOLDOWN_MIN_MS);
		socket.emit('move_to',{x: worldX, y: worldY});


		myWorldPos.moveOriginX = myWorldPos.x;
		myWorldPos.moveOriginY = myWorldPos.y;
		myWorldPos.moveTargetX = worldX;
		myWorldPos.moveTargetY = worldY;
		myWorldPos.moveStartTime = performance.now();
		myWorldPos.moving = true;
		let mine = screenbonzis({id:myId});
		if(mine)mine.animate({type:'surf_right'});

		targetMode = false;
		document.getElementById('target_cursor').style.display = 'none';
		document.getElementById('world_click_overlay').style.display = 'none';
	});
}

document.addEventListener('keydown', (e) => {
	if(e.key === 'Shift' && !e.repeat){
		if(myVehicle)return; 
		ensureWorldOverlay();
		targetMode = !targetMode;
		if(targetMode){

			let mine = screenbonzis({id:myId});
			if(mine){
				let cx = window.innerWidth/2, cy = window.innerHeight/2;
				mine.move({x: (cx-100)+'px', y: (cy-80)+'px'});
				mine.stopDrag();
			}
		}
		document.getElementById('target_cursor').style.display = targetMode ? 'block' : 'none';
		document.getElementById('world_click_overlay').style.display = targetMode ? 'block' : 'none';
	}
	if(myVehicle){
		let key = e.key.toLowerCase();
		let changed = false;
		if(key==='w'&&!wasdKeys.up){wasdKeys.up=true;changed=true;}
		if(key==='s'&&!wasdKeys.down){wasdKeys.down=true;changed=true;}
		if(key==='a'&&!wasdKeys.left){wasdKeys.left=true;changed=true;}
		if(key==='d'&&!wasdKeys.right){wasdKeys.right=true;changed=true;}
		if(changed)socket.emit('wasd',wasdKeys);
	}
});
document.addEventListener('keyup', (e) => {
	if(!myVehicle)return;
	let key = e.key.toLowerCase();
	let changed = false;
	if(key==='w'&&wasdKeys.up){wasdKeys.up=false;changed=true;}
	if(key==='s'&&wasdKeys.down){wasdKeys.down=false;changed=true;}
	if(key==='a'&&wasdKeys.left){wasdKeys.left=false;changed=true;}
	if(key==='d'&&wasdKeys.right){wasdKeys.right=false;changed=true;}
	if(changed)socket.emit('wasd',wasdKeys);
});
document.addEventListener('mousemove',(e) => {
	let tc = document.getElementById('target_cursor');
	if(tc && targetMode){ tc.style.left = e.clientX+'px'; tc.style.top = e.clientY+'px'; }
});

function handleRemoteMove(data){
	if(!data || typeof data.id !== 'string' || data.id === myId)return;
	let b = screenbonzis({id:data.id});
	if(!b)return;

	if(data.vehicle){

		b.vehicle = data.vehicle;
		b.worldX = data.x; b.worldY = data.y;
		b.moving = false;
		return;
	}


	let originX = (typeof b.worldX === 'number') ? b.worldX : data.x;
	let originY = (typeof b.worldY === 'number') ? b.worldY : data.y;
	if(typeof b.worldX !== 'number'){ b.worldX = originX; b.worldY = originY; }
	b.moveOriginX = originX;
	b.moveOriginY = originY;
	b.moveTargetX = data.x;
	b.moveTargetY = data.y;
	b.moveStartTime = performance.now();
	b.moving = true;
	b.animate({type:'surf_right'});
}

const WORLD_RENDER_TICK_MS = 33;
setInterval(() => {
	//if(!worldActive)return;
	ensureWorldOverlay();
	let now = performance.now();

	if(myVehicle){
		advanceLocalVehicle(WORLD_RENDER_TICK_MS/1000);
	} else if(myWorldPos.moving){
		let r = travelPosition(myWorldPos.moveOriginX, myWorldPos.moveOriginY, myWorldPos.moveTargetX, myWorldPos.moveTargetY, myWorldPos.moveStartTime, now);
		myWorldPos.x = r.x; myWorldPos.y = r.y;
		if(r.done)myWorldPos.moving = false;
	}
	camera.x = myWorldPos.x;
	camera.y = myWorldPos.y;
	let cx = window.innerWidth/2, cy = window.innerHeight/2;

	bonzislist.forEach(b => {
		if(typeof b.worldX !== 'number')return;
		if(b.moving){
			let r = travelPosition(b.moveOriginX, b.moveOriginY, b.moveTargetX, b.moveTargetY, b.moveStartTime, now);
			b.worldX = r.x; b.worldY = r.y;
			if(r.done)b.moving = false;
		}
		let screenX = (b.worldX - camera.x) + cx - 100;
		let screenY = (b.worldY - camera.y) + cy - 80;
		b.move({x: screenX+'px', y: screenY+'px'});
	});

	let nx = (0 - camera.x) + cx, sy = (WORLD_SIZE - camera.y) + cy;
	let wx = (0 - camera.x) + cx, ex = (WORLD_SIZE - camera.x) + cx;
	let nyTop = (0 - camera.y) + cy;
	let nB = document.getElementById('world_border_n');
	let sB = document.getElementById('world_border_s');
	let eB = document.getElementById('world_border_e');
	let wB = document.getElementById('world_border_w');
	if(nB){nB.style.left=wx+'px'; nB.style.top=nyTop+'px'; nB.style.width=WORLD_SIZE+'px';}
	if(sB){sB.style.left=wx+'px'; sB.style.top=sy+'px'; sB.style.width=WORLD_SIZE+'px';}
	if(wB){wB.style.top=nyTop+'px'; wB.style.left=wx+'px'; wB.style.height=WORLD_SIZE+'px';}
	if(eB){eB.style.top=nyTop+'px'; eB.style.left=ex+'px'; eB.style.height=WORLD_SIZE+'px';}
}, WORLD_RENDER_TICK_MS);
