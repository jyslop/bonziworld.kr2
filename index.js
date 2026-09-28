var express = require('express');
var copypastas = require('./copypastas.js');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors');
var fs = require('fs');
var crypto = require('crypto');
var bans = require('./bans.js');

let proxiesIPV4 = fs.readFileSync('./badip/ipsum.txt','utf-8') + "\n" + fs.readFileSync('./badip/data.txt','utf-8') + "\n" + fs.readFileSync('./badip/data2.txt','utf-8') + "\n" + fs.readFileSync('./badip/ipsum2.txt','utf-8');

function isFucked(ip) {
	let result = false;
	if(ip.includes(',')){
		ip = ip.split(',');
		ip.forEach(ipv4value => {
			if(proxiesIPV4.includes(ipv4value))result=true;
		});
	} else {
		if(proxiesIPV4.includes(ip))result=true;
	}
    return result;
}

app.use(cors());
const blacklist = [
  "<script>",
  "<a href='javascript:",
  '<a href="javascript:',
  "<a",
  "<video",
  "<img",
  "<img",
  "<audio",
  " onclick='",
  " onmouseover='",
  " onload=",
  " onerror=",
  " src=",
  "();",
  ".emit",
  "function()",
  "function ()",
  "() =>",
];

function Idgen(length) {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';let result = '';
   for (let i = 0; i < length; i++){
      result += characters.charAt(Math.floor(Math.random() * characters.length));
   }
   return result;
}
 
app.use(express.static('public'));
app.use('/img', express.static(__dirname + '/public/img'));
http.listen(process.env.PORT || 3000, function() {
  var host = http.address().address
  var port = http.address().port
  console.log('BonziWORLD XP is listening at port %s' + '!', port)
});
let config = {
	rateLimit:800,
	godword:['jybbcwielder696969','radkat!12379','ziggyniggy391'],
	kingword:['bluetesticles489','explosivediahrrea39'],
	powDifficulty: 4,
	powChallengeExpiry: 60000,
	rooms:{
		idLength:50,
		nameLength:30
	},
    mediaWhitelist:['https://files.catbox.moe','https://litter.catbox.moe','https://wikipedia.org','https://i.ibb.co','https://upload.wikimedia.org'],
	videoFormats:['.mp4','.mov'],
	imageFormats:['.webp','.png','.jpeg','.jpg','.gif','.bmp','.ico'],
	commands:{
		"color":(thisSocket,eventData)=>{
			if(typeof eventData == "string"){ 
				if(!config.mediaWhitelist.some(r => eventData.startsWith(r)) && !colorNames.includes(eventData))return;
				if(colorNames.includes(eventData) && eventData !== "pope")eventData=colorList[eventData];
				let roomUsers = getUsers(thisSocket.user.roomId);
				let publicUser = getUsers(thisSocket.user.roomId)[thisSocket.user.roomIndex];
				
				thisSocket.user = updateUser(thisSocket.user,{color:eventData},true);
				return thisSocket.user;
			}
		},
		"name":(thisSocket,eventData)=>{
			if(typeof eventData == "string"){
				eventData = blankify(eventData,config.rooms.nameLength);
				
				let roomUsers = getUsers(thisSocket.user.roomId);
				let publicUser = getUsers(thisSocket.user.roomId)[thisSocket.user.roomIndex];
				
				thisSocket.user = updateUser(thisSocket.user,{name:eventData},true);
				return thisSocket.user;
			}
		},
		"joke":(thisSocket,eventData)=>{
			if(typeof eventData != 'string')return;
			let i = copypastas['jokes'].intros;
			let m = copypastas['jokes'].middle;
			let e = copypastas['jokes'].ending;
			let eventConstruct = [
				...i[Math.floor(Math.random()*i.length)],
			 	['animation_preset','shrug_fwd'],
				...m[Math.floor(Math.random()*m.length)],
				['animation_preset','shrug_back'],
				...e[Math.floor(Math.random()*e.length)],
			];
			eventRoom("userEvent",{id:thisSocket.user.id,events:eventConstruct},thisSocket.user,true);
		},
		"fact":(thisSocket,eventData)=>{
			if(typeof eventData != 'string')return;
			let i = copypastas['facts'].intros;
			let m = copypastas['facts'].middle;
			let e = copypastas['facts'].ending;
			let eventConstruct = [
				...i[Math.floor(Math.random()*i.length)],
				...m[Math.floor(Math.random()*m.length)],
				...e[Math.floor(Math.random()*e.length)],
			];
			eventRoom("userEvent",{id:thisSocket.user.id,events:eventConstruct},thisSocket.user,true);
		},
		"linux":(thisSocket,eventData)=>{
			if(typeof eventData != "string")return;
			eventRoom("userEvent",{id:thisSocket.user.id,events:copypastas['extra']['linux'] },thisSocket.user,true);
		},
		"joel":(thisSocket,eventData)=>{
			if(typeof eventData != "string")return;
			eventRoom("userEvent",{id:thisSocket.user.id,events:copypastas['extra']['joel'] },thisSocket.user,true);
		},
		"asshole":(thisSocket,eventData)=>{
			eventData = {to:eventData};
			if(typeof eventData == "object"){
				eventRoom("asshole",{by:thisSocket.user.id,to:blankify(eventData.to)},thisSocket.user,true);
			}
		},
		"bass":(thisSocket,eventData)=>{
			eventData = {to:eventData};
			if(typeof eventData == "object"){
				eventRoom("bass",{by:thisSocket.user.id,to:blankify(eventData.to)},thisSocket.user,true);
			}
		},
		"tag":(thisSocket,eventData)=>{
			if(thisSocket.user.level > 1 && typeof eventData == "string"){
				eventData = blankify(eventData,32);
				thisSocket.user = updateUser(thisSocket.user,{tag:eventData},true);
				return thisSocket.user;
			}
		},
		"modtag":(thisSocket,eventData)=>{
			if(thisSocket.user.level > 1 && typeof eventData == "string"){
				let parts = eventData.split(" ");
				let targetId = parts[0];
				let newTag = blankify(parts.slice(1).join(" "),32);
				let targetRoom = publicrooms[thisSocket.user.roomId];
				if(targetRoom){
					let targetUser = targetRoom.users.find(u => u.id == targetId);
					if(targetUser){
						updateUser(targetUser,{tag:newTag},true);
					}
				}
			}
		},
		"roompublic":(thisSocket,eventData)=>{
			if(typeof eventData != 'string')return;
			let currentRoom = publicrooms[thisSocket.user.roomId];
			if(currentRoom.owner == thisSocket.user.id){
				if(eventData == 'on')publicrooms[thisSocket.user.roomId].isPublic=true;
				if(eventData == 'off')publicrooms[thisSocket.user.roomId].isPublic=false;
			}
		},
		"modname":(thisSocket,eventData)=>{
			if(thisSocket.user.level > 1 && typeof eventData == "string"){
				let parts = eventData.split(" ");
				let targetId = parts[0];
				let newName = blankify(parts.slice(1).join(" "),30);
				let targetRoom = publicrooms[thisSocket.user.roomId];
				if(targetRoom){
					let targetUser = targetRoom.users.find(u => u.id == targetId);
					if(targetUser){
						updateUser(targetUser,{name:newName},true);
					}
				}
			}
		},
		"nuke":(thisSocket,eventData)=>{
    if(thisSocket.user.level > 1 && typeof eventData == "string"){
        let targetRoom = publicrooms[thisSocket.user.roomId];
        if(targetRoom){
            let targetUser = targetRoom.users.find(u => u.id == eventData);
            if(targetUser){
                let targetSocket = targetUser.socket; 
                eventRoom('nuke',{id:targetUser.id},targetUser,true);
                setTimeout(() => {targetSocket.disconnect(true);},3000);
            }
        }
    }
},
		"godmode":(thisSocket,param)=>{
			if(config.godword.includes(param)){
				thisSocket.user.level=3;
				return thisSocket.user;
			}
			if(config.kingword.includes(param)){
				thisSocket.user.level=2;
				return thisSocket.user;
			}
		},
		
		"bless":(thisSocket,param)=>{
			if(thisSocket.user.level > 2){
				let currentRoom = publicrooms[thisSocket.user.roomId];
				currentRoom.users.forEach(userObject => {
					if(userObject.id == param){
						userObject.level = 2;
						userObject = updateUser(userObject,{color:'./img/bonzi/blessed.png',tag:'Blessed'},true);
					}
				});
			}
		},
		"glow":(thisSocket,param)=>{
			if(thisSocket.user.level > 1){
				thisSocket.user = updateUser(thisSocket.user,{color:"./img/bonzi/glow.webp",tag:"<img src='/img/desktop/icons/wrench_antenna.png' class='tagicon'>"},true);
				return thisSocket.user;
			}
		},
		"noob":(thisSocket,param)=>{
			if(thisSocket.user.level > 1){
				thisSocket.user = updateUser(thisSocket.user,{color:"./img/bonzi/noob.webp",tag:"<img src='/img/desktop/icons/wrench_antenna.png' class='tagicon'>"},true);
				return thisSocket.user;
			}
		},
		"pope":(thisSocket,param)=>{
			if(thisSocket.user.level > 1){
				thisSocket.user = updateUser(thisSocket.user,{color:"./img/bonzi/pope.png",tag:"<img src='/img/desktop/icons/wrench_antenna.png' class='tagicon'>"},true);
				return thisSocket.user;
			}
		},
		"hat":(thisSocket,eventData)=>{
			if(typeof eventData == "string"){
				let hatName = eventData.trim().toLowerCase();
				let maxHats = thisSocket.user.level >= 3 ? 5 : 2;
				if(hatName.length < 1){
					thisSocket.user = updateUser(thisSocket.user,{hats:[]},true);
					return thisSocket.user;
				}
				if(!Object.keys(hatList).includes(hatName))return;

				if(blessedHats.includes(hatName) && thisSocket.user.level < 2){
					thisSocket.emit("err","You must be blessed or staff to use this hat!");
				}
				if(!thisSocket.user.account.hats.includes(hatName) && Object.keys(hatShop).includes(hatName)){
					thisSocket.emit("err","You must buy this hat first!");
					return;
				} else {
					let currentHats = thisSocket.user.hats || [];
					let hatIdx = currentHats.indexOf(hatName);
					if(hatIdx !== -1){
						currentHats = currentHats.filter(h => h !== hatName);
					} else {
						if(currentHats.length >= maxHats){
							currentHats = currentHats.slice(1);
						}
						currentHats = currentHats.concat([hatName]);
					}
					thisSocket.user = updateUser(thisSocket.user,{hats:currentHats},true);
					return thisSocket.user;
				}
			}
		},
		"media":(thisSocket,eventData)=>{
			if(typeof eventData == "string"){
				if(!config.mediaWhitelist.some(r => eventData.startsWith(r)))return;
				if(config.videoFormats.some(r => eventData.endsWith(r))){
					let videoSend = blankify(eventData);
					eventRoom('msg',{msg:'- <video class="user_vid" controls><source src="'+videoSend+'" type="video/mp4"></video>',id:thisSocket.user.id},thisSocket.user,true);
				}
				if(config.imageFormats.some(r => eventData.endsWith(r))){
					let imgSend = blankify(eventData);
					eventRoom('msg',{msg:'- <img class="user_img" src="'+imgSend+'">',id:thisSocket.user.id},thisSocket.user,true);
				}
			}
		},
		"image":(thisSocket,eventData)=>{
			if(typeof eventData != "string")return;
			return config.commands["media"](thisSocket,eventData);
		},
		"video":(thisSocket,eventData)=>{
			if(typeof eventData != "string")return;
			return config.commands["media"](thisSocket,eventData);
		},
		"getrooms":(thisSocket,eventData)=>{
			if(typeof eventData != "string")return;
			let roomlist = [];

			Object.keys(publicrooms).forEach(roomName => {
				let roomObject = publicrooms[roomName];
				if(roomObject.isPublic)roomlist.push({name:roomName,users:roomObject.users.length});
			});
			thisSocket.emit('roomslist',roomlist);
		}
	}
};
var colorList = {
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
let hatShop = {
	wizard:150, windows:200, truck:120, rainbow:300, premium:500, pirate:180,
	peedy:220, ninja:160, joel:400, hat:80, crown:600, cowboy:140, clippy:250,
	chef:130, blunt:170, astronaut:350
};
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
let colorNames = Object.keys(colorList);
let blessedHats = ['clippy','peedy','whiteobama','qmark','yahu','sunglasses','spongebob','whiteobama','witch','silverfedora','pumpkin','illuminati','cigar','dank','cauldron','bathbomb'];
var botmsg = [
"- hi",'- bundasworld revive HD deluxe ++'];

var publicrooms = { "default":{
   isPublic:true,
	owner:'none',
   users: [
    {
      name: "BonziBUDDY",
      color: "/img/bonzi/purple.png",
      id: "bonzibuddy",
      tag:"<img src='/img/desktop/icons/server.png' class='tagicon'>",
      pitch: 80,
      speed: 150,
      messages: [],
      socketId:"bonziBuddy",
      hats:[],
      // world position (center of the 10,000 x 10,000 world) so it renders
      // immediately instead of waiting for ensureWorldPos()/a move to set it
      posX: 5000,
      posY: 5000,
      velX: 0,
      velY: 0,
      vehicle: null,
      moving: false,
      moveStartTime: 0,
      moveOriginX: 5000,
      moveOriginY: 5000,
      moveTargetX: 5000,
      moveTargetY: 5000
    }
  ]
}};
let skiddieWatch = {};

setInterval(() => {
  var tosend = botmsg[Math.floor(Math.random() * botmsg.length)];
  io.emit("msg", {
    msg: tosend,
    id: "bonzibuddy"
  });
}, 120000);
setInterval(() => {
	Object.keys(skiddieWatch).forEach(ipAddress => {
		let currentUser = skiddieWatch[ipAddress];
		if(currentUser.lastLogged < 90000)currentUser.lastLogged+=100;
	});
},100);
function blankify(input, maxLength = 2500) {
  if (typeof input !== 'string') return '';

  return input
    //normalize unicode (prevents lookalike/homoglyph tricks)
    .normalize('NFKC')
    //strip control characters & zero-width chars (invisible payloads + RTL override tricks)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028\u2029\uFEFF]/g, '')
    //rape whitespace
    .trim()
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    //commands and events already limit string length but whatever
    .slice(0, maxLength)
    //no html keed
    .replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c]));
}
function getUsers(roomId){
	let result = [];
	publicrooms[roomId].users.forEach(fullUser => {
		let obfuscatedUser = {name:fullUser.name,color:fullUser.color,id:fullUser.id,pitch:fullUser.pitch,speed:fullUser.speed,hats:fullUser.hats||[],tag:fullUser.tag||"",typing:fullUser.typing,posX:fullUser.posX,posY:fullUser.posY,vehicle:fullUser.vehicle||null};
		result.push(obfuscatedUser);
	});
	return result;
}
function findUser(roomId,guid){
	let result = -1;
	publicrooms[roomId].users.forEach(r => {if(r.id == guid){result = r;}});
	return result;
}
function hasUser(roomId,guid){
	let result = false;
	result = publicrooms[roomId].users.some(r => guid == r.id);
	return result;
}
function eventRoom(eventName,messageData,originalUser,displayLocal=false){
	let currentRoom = publicrooms[originalUser.roomId];
	if(typeof currentRoom != 'object')return;
	if(currentRoom.users.some(r => r.id == originalUser.id)){
		currentRoom.users.forEach(fullUser => {
			if(fullUser.socketId == originalUser.socketId){
				if(displayLocal){
					io.to(fullUser.socketId).emit(eventName,messageData);
				}
			} else {
				io.to(fullUser.socketId).emit(eventName,messageData);
			}
		});
	}
}
function updateUser(originalUser,socketData,localDisplay=false){
	let result = Object.assign(originalUser,socketData);
	let currentRoom = publicrooms[originalUser.roomId];
	if(typeof currentRoom != 'object'){
		publicrooms[originalUser.roomId]={isPublic:false,owner:originalUser.id,users:[]};
		currentRoom = publicrooms[result.roomId];
		result.roomIndex = currentRoom.users.length;
	}
	if(currentRoom.users.some(r => r.id == originalUser.id)){
		publicrooms[result.roomId].users[result.roomIndex] = result;
		
		let roomUsers = getUsers(result.roomId);
		let publicUser = getUsers(result.roomId)[result.roomIndex];
		
		eventRoom("updateUser",publicUser,originalUser);
		if(localDisplay)io.to(originalUser.socketId).emit("updateUser",Object.assign({},publicUser,{level:originalUser.level}));		
	} else {
		result.roomIndex = currentRoom.users.length;
		
		publicrooms[result.roomId].users.push(result);
	}
	
	return result;
}

setInterval(() => {
	Object.keys(bans).forEach(banIp => {
		let banCurrent = bans[banIp];
		
		if(!isNaN(parseFloat(banCurrent.duration))){
			bans[banIp].duration = (parseFloat(bans[banIp].duration)-1).toString();
			if(parseFloat(banCurrent.duration) < 1){
				delete bans[banIp];
			}
		}
	});
	fs.writeFileSync('./bans.js',`
							module.exports = ${JSON.stringify(bans,null,2)};
						`,'utf-8')
},60000);

function verifyPoW(challenge, nonce, difficulty) {
	let attempt = challenge + ':' + nonce;
	let hash = crypto.createHash('sha256').update(attempt).digest('hex');
	let prefix = '0'.repeat(difficulty);
	return hash.startsWith(prefix);
}


let overallValue = 0;

// ---- persistent stock market data (keyed by ticker) ----
let coinstocksFile = './stocks.js';
let coinstocks;
try {
	coinstocks = require(coinstocksFile);
} catch(e){
	coinstocks = {
		'BIA':{
			currentAmt:11134.95,
			values:[0,10,20,50,80,100,300,600,800,11298.32,10816.5,11134.95, 14278.28 ],
			owner:'server',
			ownerIp:'server',
			profit: 1142.2624,
			profitCutPercent:0.08,
			investors:{}
		}
	};
	saveStocks();
}

function saveStocks(){
	try {
		fs.writeFileSync(coinstocksFile, `
module.exports = ${JSON.stringify(coinstocks, null, 2)};
`, 'utf-8');
	} catch(e){ /* non-fatal: in-memory state still holds */ }
}

// tracks how many changes (creation counts as one) each ticker has accrued
// since it was last written to disk; once a ticker hits 5 changes, persist
// the whole stock table and reset that ticker's counter back to 0
let stockChangeCounts = {};
function trackStockChange(ticker){
	stockChangeCounts[ticker] = (stockChangeCounts[ticker]||0) + 1;
	if(stockChangeCounts[ticker] >= 5){
		saveStocks();
		stockChangeCounts[ticker] = 0;
	}
}

/* =====================================================================
   BONZICOINS SYSTEM: accounts, stock market, gifting, movement, vehicles
   ===================================================================== */

// ---- persistent accounts (keyed by the user's BonziCOIN password) ----
let bonziAccountsFile = './bonziaccounts.js';
let bonziAccounts = {};
try { bonziAccounts = require(bonziAccountsFile); } catch(e){ bonziAccounts = {}; }

function saveBonziAccounts(){
	try {
		fs.writeFileSync(bonziAccountsFile, `
module.exports = ${JSON.stringify(bonziAccounts, null, 2)};
`, 'utf-8');
	} catch(e){ /* non-fatal: in-memory state still holds */ }
}

function defaultAccount(ip){
	return { coins:0, hats:[], vehicles:[], equippedVehicle:null, company:null, createdIp:ip||'unknown' };
}

// simple brute-force throttle: N password lookups per IP per minute
let acctLookupWatch = {};
function accountLookupsAllowed(ip){
	let now = Date.now();
	if(!acctLookupWatch[ip])acctLookupWatch[ip]={count:0,reset:now+60000};
	if(now > acctLookupWatch[ip].reset){acctLookupWatch[ip]={count:0,reset:now+60000};}
	acctLookupWatch[ip].count++;
	return acctLookupWatch[ip].count <= 20;
}

function getOrCreateAccount(pass, ip){
	if(typeof pass !== 'string')return null;
	if(!/^[A-Za-z0-9\-_]{8,64}$/.test(pass))return null;
	if(!accountLookupsAllowed(ip))return null;
	if(!bonziAccounts[pass]){
		bonziAccounts[pass] = defaultAccount(ip);
		saveBonziAccounts();
	}
	return bonziAccounts[pass];
}

// ---- hats shop (server-authoritative prices; hatList itself lives above) ----


// ---- vehicles ----
// VEHICLE IMAGE DEFINITION: this is the single, easily-editable place that
// points at the (not yet created) 200x160 cherry-picked bonzi+vehicle spritesheet.
// Swap this string once the art exists; nothing else needs to change.
let VEHICLE_IMAGE_CAR = './img/bonzi/bord.png';

let vehiclePresets = {
	car:{ name:'BORD', cost:800, maxSpeed:6.5, img: VEHICLE_IMAGE_CAR }
};

// client-safe view of vehiclePresets (name/cost/maxSpeed/img) — this is what
// actually needs to reach the browser so it knows which sprite to draw for
// an owned/equipped vehicle; the client must never be trusted to invent it.
function getPublicVehiclePresets(){
	let out = {};
	Object.keys(vehiclePresets).forEach(k => {
		let p = vehiclePresets[k];
		out[k] = { name:p.name, cost:p.cost, maxSpeed:p.maxSpeed, img:p.img };
	});
	return out;
}

// ---- world / movement ----
const WORLD_SIZE = 10000;
const MAX_MOVE_DIST = 1200; // farthest a single on-foot move request may travel from the player's last position
const MOVE_DURATION_MS = 1000; // an on-foot move ALWAYS takes exactly 1s to complete, synced to the 1s surf anim
const ON_FOOT_COOLDOWN_MIN_MS = 4000; // on foot, a player may start a new move roughly every 4-5s
const ON_FOOT_COOLDOWN_MAX_MS = 5000;
const WASD_TICK_MS = 100;
const WORLD_SYNC_INTERVAL_MS = 5000; // full authoritative resync sent to each player every N seconds
const SYNC_EVERY_TICKS = Math.round(WORLD_SYNC_INTERVAL_MS / WASD_TICK_MS);
const CRASH_SPEED_THRESHOLD = 4; // combined speed needed to total both vehicles
let moveCooldowns = {}; // userId -> timestamp when their next on-foot move is allowed
let wasdState = {}; // userId -> {up,down,left,right}
let tickCount = 0;

// NOTE: on-foot position is interpolated from an absolute start time + fixed
// duration (posX = origin + (target-origin) * elapsed/duration), NEVER by
// accumulating a per-tick step. Stepping drifts/lags under any tick jitter;
// time-based interpolation is always exactly where it should be for "now".
function ensureWorldPos(user){
	if(typeof user.posX !== 'number')user.posX = WORLD_SIZE/2;
	if(typeof user.posY !== 'number')user.posY = WORLD_SIZE/2;
	if(typeof user.velX !== 'number')user.velX = 0;
	if(typeof user.velY !== 'number')user.velY = 0;
	if(typeof user.moving !== 'boolean')user.moving = false;
	if(typeof user.moveStartTime !== 'number')user.moveStartTime = 0;
	if(typeof user.moveOriginX !== 'number')user.moveOriginX = user.posX;
	if(typeof user.moveOriginY !== 'number')user.moveOriginY = user.posY;
	if(typeof user.moveTargetX !== 'number')user.moveTargetX = user.posX;
	if(typeof user.moveTargetY !== 'number')user.moveTargetY = user.posY;
}

function destroyVehicle(user){
	if(!user.account)return;
	if(user.vehicle){
		user.account.vehicles = (user.account.vehicles||[]).filter(v => v !== user.vehicle);
		user.vehicle = null;
	}
	saveBonziAccounts();
	eventRoom('vehicleDestroyed',{id:user.id},user,true);
}

setInterval(() => {
	tickCount++;
	Object.keys(publicrooms).forEach(roomId => {
		let room = publicrooms[roomId];

		// ---- on-foot: advance each walking player's authoritative position
		// along the invisible line between where they started and where
		// they're headed, purely as a function of elapsed wall-clock time ----
		let now = Date.now();
		room.users.forEach(u => {
			if(u.vehicle)return; // driving overrides any pending on-foot transition
			ensureWorldPos(u);
			if(!u.moving)return;
			let elapsed = now - u.moveStartTime;
			if(elapsed >= MOVE_DURATION_MS){
				u.posX = u.moveTargetX;
				u.posY = u.moveTargetY;
				u.moving = false;
			} else {
				let t = elapsed / MOVE_DURATION_MS;
				u.posX = u.moveOriginX + (u.moveTargetX - u.moveOriginX) * t;
				u.posY = u.moveOriginY + (u.moveTargetY - u.moveOriginY) * t;
			}
		});

		// ---- vehicles: WASD-driven physics ----
		let drivers = room.users.filter(u => u.vehicle && wasdState[u.id]);
		drivers.forEach(u => {
			ensureWorldPos(u);
			u.moving = false;
			let preset = vehiclePresets[u.vehicle];
			if(!preset)return;
			let keys = wasdState[u.id] || {};
			let dx = (keys.right?1:0) - (keys.left?1:0);
			let dy = (keys.down?1:0) - (keys.up?1:0);
			let mag = Math.sqrt(dx*dx+dy*dy) || 1;
			u.velX = (dx/mag) * preset.maxSpeed;
			u.velY = (dy/mag) * preset.maxSpeed;

			let nextX = u.posX + u.velX*10;
			let nextY = u.posY + u.velY*10;

			let speed = Math.sqrt(u.velX*u.velX+u.velY*u.velY);
			let hitBorder = nextX <= 0 || nextX >= WORLD_SIZE || nextY <= 0 || nextY >= WORLD_SIZE;

			u.posX = Math.max(0, Math.min(WORLD_SIZE, nextX));
			u.posY = Math.max(0, Math.min(WORLD_SIZE, nextY));

			if(hitBorder && speed >= CRASH_SPEED_THRESHOLD){
				destroyVehicle(u);
				delete wasdState[u.id];
			}
		});

		// pairwise vehicle-vehicle collision
		for(let i=0;i<drivers.length;i++){
			for(let j=i+1;j<drivers.length;j++){
				let a = drivers[i], b = drivers[j];
				if(!a.vehicle || !b.vehicle)continue;
				let dist = Math.hypot(a.posX-b.posX, a.posY-b.posY);
				if(dist < 90){
					let combinedSpeed = Math.hypot(a.velX,a.velY) + Math.hypot(b.velX,b.velY);
					if(combinedSpeed >= CRASH_SPEED_THRESHOLD){
						destroyVehicle(a);
						destroyVehicle(b);
						delete wasdState[a.id];
						delete wasdState[b.id];
					}
				}
			}
		}

		// vehicle drivers push their new authoritative position to everyone else
		// every tick; their own client is already driving itself locally (see setWasd)
		if(drivers.length){
			drivers.forEach(u => {
				eventRoom('userMoveTo',{id:u.id,x:u.posX,y:u.posY,vehicle:u.vehicle||null},u,false);
			});
		}

		// ---- full authoritative resync: every player's position, plus each
		// player's own position specifically, sent to every player every N seconds ----
		if(tickCount % SYNC_EVERY_TICKS === 0){
			let players = room.users.map(u => {
				ensureWorldPos(u);
				return { id:u.id, x:u.posX, y:u.posY, vehicle:u.vehicle||null };
			});
			room.users.forEach(u => {
				io.to(u.socketId).emit('worldSync', { self:{x:u.posX,y:u.posY}, players:players });
			});
		}
	});
}, WASD_TICK_MS);

function moveTo(thisSocket, data){
	if(typeof data !== 'object' || data === null)return;
	let x = Number(data.x), y = Number(data.y);
	if(!Number.isFinite(x) || !Number.isFinite(y))return;
	let u = thisSocket.user;
	if(u.vehicle)return; // vehicle travel uses WASD, not click-to-move
	ensureWorldPos(u);

	let now = Date.now();
	let cooldownUntil = moveCooldowns[u.id] || 0;
	if(now < cooldownUntil)return; // on foot, a new move can only start every ~4-5s

	x = Math.max(0, Math.min(WORLD_SIZE, x));
	y = Math.max(0, Math.min(WORLD_SIZE, y));

	let dx = x - u.posX, dy = y - u.posY;
	let dist = Math.hypot(dx, dy);
	if(dist < 1)return; // not actually going anywhere
	if(dist > MAX_MOVE_DIST)return; // too far from the player's last position, reject

	// server becomes authoritative on the destination instantly, then travels
	// that same invisible line over the next MOVE_DURATION_MS (see tick loop above)
	u.moveOriginX = u.posX;
	u.moveOriginY = u.posY;
	u.moveTargetX = x;
	u.moveTargetY = y;
	u.moveStartTime = now;
	u.moving = true;

	moveCooldowns[u.id] = now + (ON_FOOT_COOLDOWN_MIN_MS + Math.random()*(ON_FOOT_COOLDOWN_MAX_MS - ON_FOOT_COOLDOWN_MIN_MS));

	// broadcast the destination instantly so every other client can transition
	// its copy of this bonzi along the same line the mover already predicted locally
	eventRoom('userMoveTo', { id:u.id, x:x, y:y, vehicle:null }, u, false);
}

function setWasd(thisSocket, data){
	if(typeof data !== 'object' || data === null)return;
	if(!thisSocket.user.vehicle)return;
	wasdState[thisSocket.user.id] = {
		up: data.up === true,
		down: data.down === true,
		left: data.left === true,
		right: data.right === true
	};
}

// ---- stock market ----
function getPublicStocks(){
	let result = {};
	Object.keys(coinstocks).forEach(ticker => {
		let c = coinstocks[ticker];
		result[ticker] = { ticker, currentAmt: c.currentAmt, values: c.values, profit: c.profit, ownerIp: c.ownerIp === 'server' ? 'server' : undefined };
	});
	return result;
}
function emitWallet(thisSocket){
	let u = thisSocket.user;
	let acct = u.account;
	thisSocket.emit('wallet', acct ? {
		hasAccount:true, coins:Math.round(acct.coins*100)/100, hats:acct.hats, vehicles:acct.vehicles,
		equippedVehicle:acct.equippedVehicle, company:acct.company
	} : {hasAccount:false});
}

let companyOwnersByIp = {};
Object.keys(coinstocks).forEach(t => { if(coinstocks[t].ownerIp && coinstocks[t].ownerIp !== 'server')companyOwnersByIp[coinstocks[t].ownerIp]=t; });

function createCompany(thisSocket, data){
	if(typeof data !== 'object' || data === null)return;
	let ip = thisSocket.user.ip;
	if(!thisSocket.user.account){thisSocket.emit('bonzicoinErr','You need an active BonziCOIN account first.'); return;}
	if(companyOwnersByIp[ip]){thisSocket.emit('bonzicoinErr','Only one company exchange can be created per IP.'); return;}
	if(typeof data.name !== 'string'){thisSocket.emit('bonzicoinErr','Invalid name.'); return;}
	let ticker = blankify(data.name,10).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,5);
	if(ticker.length < 2){thisSocket.emit('bonzicoinErr','Name needs at least 2 letters/numbers.'); return;}
	if(coinstocks[ticker]){thisSocket.emit('bonzicoinErr','That ticker is taken.'); return;}
	coinstocks[ticker] = {
		currentAmt: 10 + Math.random()*20,
		values:[10],
		owner: thisSocket.user.id,
		ownerIp: ip,
		profit: 0,
		profitCutPercent: 0.08,
		investors: {}
	};
	thisSocket.user.account.company = ticker;
	saveBonziAccounts();
	trackStockChange(ticker);
	io.emit('stocksUpdate', getPublicStocks());
	emitWallet(thisSocket);
}

function investStock(thisSocket, data){
	if(typeof data !== 'object' || data === null)return;
	if(!thisSocket.user.account){thisSocket.emit('bonzicoinErr','You need an active BonziCOIN account first.'); return;}
	let ticker = typeof data.ticker === 'string' ? blankify(data.ticker,10).toUpperCase() : '';
	let amount = Number(data.amount);
	if(!coinstocks[ticker]){thisSocket.emit('bonzicoinErr','No such company.'); return;}
	if(!Number.isFinite(amount) || amount <= 0){thisSocket.emit('bonzicoinErr','Invalid amount.'); return;}
	amount = Math.floor(amount*100)/100;
	let account = thisSocket.user.account;
	if(amount > account.coins){thisSocket.emit('bonzicoinErr','Amount exceeds your balance.'); return;}
	let c = coinstocks[ticker];
	let vlen = c.values.length;
	let latest = vlen ? c.values[vlen-1] : c.currentAmt;
	let previous = vlen > 1 ? c.values[vlen-2] : latest;
	let bonus = Math.max(0,(latest-previous)) * 0.10;
	account.coins = Math.round((account.coins-amount)*100)/100;
	let key = thisSocket.user.accountPass;
	if(!c.investors[key])c.investors[key]={amount:0,bonus:0};
	c.investors[key].amount = Math.round((c.investors[key].amount+amount)*100)/100;
	c.investors[key].bonus = Math.round((c.investors[key].bonus+bonus)*100)/100;
	saveBonziAccounts();
	trackStockChange(ticker);
	emitWallet(thisSocket);
	thisSocket.emit('stockPosition',{ticker,position:c.investors[key]});
}

function sellStock(thisSocket, data){
	if(typeof data !== 'object' || data === null)return;
	if(!thisSocket.user.account){thisSocket.emit('bonzicoinErr','You need an active BonziCOIN account first.'); return;}
	let ticker = typeof data.ticker === 'string' ? blankify(data.ticker,10).toUpperCase() : '';
	if(!coinstocks[ticker]){thisSocket.emit('bonzicoinErr','No such company.'); return;}
	let c = coinstocks[ticker];
	let key = thisSocket.user.accountPass;
	let stake = c.investors[key];
	if(!stake || stake.amount <= 0){thisSocket.emit('bonzicoinErr','You have no investment in that company.'); return;}
	let payout = stake.amount + stake.bonus;
	let cut = payout * (c.profitCutPercent||0.08);
	payout = payout - cut;
	c.profit = Math.round((c.profit+cut)*100)/100;
	thisSocket.user.account.coins = Math.round((thisSocket.user.account.coins+payout)*100)/100;
	delete c.investors[key];
	saveBonziAccounts();
	trackStockChange(ticker);
	emitWallet(thisSocket);
	thisSocket.emit('stockSold',{ticker,payout:Math.round(payout*100)/100});
}

setInterval(() => {
	Object.keys(coinstocks).forEach(ticker => {
		let c = coinstocks[ticker];
		let drift = (Math.random()-0.45) * (Math.max(1,c.currentAmt)*0.15);
		c.currentAmt = Math.max(1, Math.round((c.currentAmt+drift)*100)/100);
		c.values.push(c.currentAmt);
		if(c.values.length > 500)c.values.shift();
		trackStockChange(ticker);
	});
	io.emit('stocksUpdate', getPublicStocks());
}, (10*1000));

// ---- gifting ----
let giftCooldowns = {};
function giftCoins(thisSocket, data){
	if(typeof data !== 'object' || data === null)return;
	if(!thisSocket.user.account){thisSocket.emit('bonzicoinErr','You need an active BonziCOIN account first.'); return;}
	if(typeof data.to !== 'string'){thisSocket.emit('bonzicoinErr','Invalid target.'); return;}
	let amount = Number(data.amount);
	if(!Number.isFinite(amount) || amount <= 0){thisSocket.emit('bonzicoinErr','Invalid amount.'); return;}
	amount = Math.floor(amount*100)/100;
	let now = Date.now();
	let last = giftCooldowns[thisSocket.user.id] || 0;
	if(now - last < 3000){thisSocket.emit('bonzicoinErr','You are gifting too fast.'); return;}
	let account = thisSocket.user.account;
	if(amount > account.coins){thisSocket.emit('bonzicoinErr','Amount exceeds your balance.'); return;}
	let targetUser = findUser(thisSocket.user.roomId, data.to);
	if(typeof targetUser === 'number'){thisSocket.emit('bonzicoinErr','User not found.'); return;}
	if(!targetUser.account){thisSocket.emit('bonzicoinErr','Recipient has no active BonziCOIN account.'); return;}
	if(targetUser.id === thisSocket.user.id){thisSocket.emit('bonzicoinErr','You cannot gift yourself.'); return;}
	giftCooldowns[thisSocket.user.id] = now;
	account.coins = Math.round((account.coins-amount)*100)/100;
	targetUser.account.coins = Math.round((targetUser.account.coins+amount)*100)/100;
	saveBonziAccounts();
	emitWallet(thisSocket);
	let targetSocket = targetUser.socket;
	if(targetSocket)emitWallet(targetSocket);
	io.to(targetUser.socketId).emit('coinGiftReceived',{from:thisSocket.user.name,amount});
}

// ---- hats & vehicles purchases ----
function buyHat(thisSocket, data){
	if(typeof data !== 'object' || data === null)return;
	if(!thisSocket.user.account){thisSocket.emit('bonzicoinErr','You need an active BonziCOIN account first.'); return;}
	let hatName = typeof data.hat === 'string' ? data.hat.trim().toLowerCase() : '';
	if(!Object.keys(hatShop).includes(hatName)){thisSocket.emit('bonzicoinErr','No such hat.'); return;}
	let account = thisSocket.user.account;
	if(account.hats.includes(hatName)){thisSocket.emit('bonzicoinErr','You already own that hat.'); return;}
	let price = hatShop[hatName];
	if(account.coins < price){thisSocket.emit('bonzicoinErr','Not enough BonziCOINS.'); return;}
	account.coins = Math.round((account.coins-price)*100)/100;
	account.hats.push(hatName);
	saveBonziAccounts();
	emitWallet(thisSocket);
}
function buyVehicle(thisSocket, data){
	if(typeof data !== 'object' || data === null)return;
	if(!thisSocket.user.account){thisSocket.emit('bonzicoinErr','You need an active BonziCOIN account first.'); return;}
	let vName = typeof data.vehicle === 'string' ? data.vehicle.trim().toLowerCase() : '';
	if(!Object.keys(vehiclePresets).includes(vName)){thisSocket.emit('bonzicoinErr','No such vehicle.'); return;}
	let account = thisSocket.user.account;
	if(account.vehicles.includes(vName)){thisSocket.emit('bonzicoinErr','You already own that vehicle.'); return;}
	let price = vehiclePresets[vName].cost;
	if(account.coins < price){thisSocket.emit('bonzicoinErr','Not enough BonziCOINS.'); return;}
	account.coins = Math.round((account.coins-price)*100)/100;
	account.vehicles.push(vName);
	saveBonziAccounts();
	emitWallet(thisSocket);
}
function equipVehicle(thisSocket, data){
	if(typeof data !== 'object' || data === null)return;
	if(!thisSocket.user.account){thisSocket.emit('bonzicoinErr','You need an active BonziCOIN account first.'); return;}
	let account = thisSocket.user.account;
	let vName = data.vehicle === null ? null : (typeof data.vehicle === 'string' ? data.vehicle.trim().toLowerCase() : undefined);
	if(vName === undefined){thisSocket.emit('bonzicoinErr','Invalid vehicle.'); return;}
	if(vName !== null && !account.vehicles.includes(vName)){thisSocket.emit('bonzicoinErr','You do not own that vehicle.'); return;}
	account.equippedVehicle = vName;
	thisSocket.user.vehicle = vName;
	if(vName === null)delete wasdState[thisSocket.user.id];
	saveBonziAccounts();
	emitWallet(thisSocket);
	eventRoom('userVehicle',{id:thisSocket.user.id,vehicle:vName},thisSocket.user,true);
}

io.on("connection", function(socket){
	var userid = Idgen(10);
	var newcolor = colorList[colorNames[Math.floor(Math.random()*colorNames.length)]];
	socket.user = {
		name: "Anonymous", 
		color: newcolor, 
		id: userid, 
		hats:[],
		messages: ["Welcome to BonziWORLD XP"],
		ip: socket.handshake.headers["x-forwarded-for"] || "127.0.0.1",
		loggedIn:false,
		roomId:"default",
		typing:false,
		roomIndex:0,
		canMsg:true,
		pitch:80,
		speed:60,
		socketId:socket.id,
		msgAttempts:0,
		level:1,
		tag:"",
		socket:socket,
		coins:0,
		account:{coins:0}
	};

	socket._powChallenge = null;
	socket._powExpiry = null;
	socket._pendingLoginData = null;

	// send shop presets (incl. vehicle sprite paths) once up front so the
	// client can render owned/equipped vehicles without hardcoding a
	// (previously image-less) copy of this data itself
	socket.emit('vehiclePresets', getPublicVehiclePresets());

	if(Object.keys(bans).includes(socket.user.ip)){
		let entry = bans[socket.user.ip];
		let MINUTES = parseFloat(entry.duration);
		
		let result = {duration:'',reason:entry.reason};
		if(MINUTES > 59){
			result.duration+=(Math.floor(MINUTES/60)).toString()+' hours and ';
			result.duration+=Math.round((MINUTES/60)-Math.floor(MINUTES/60)).toString()+' minutes';
		}
		else {result.duration+=MINUTES.toString()+' minutes';}
		socket.emit("ban",result);
	} else {
		socket.on("login", (data) => {
		    socket.removeAllListeners('msg');
		socket.removeAllListeners('typing');
		socket.removeAllListeners('command');
		if(isFucked(socket.user.ip)){
			socket.emit("err","No proxies allowed right now");
			return;
		}
		else {
		
		if(typeof data == "object"){
			if(typeof data.name !== "string")return;
			if(typeof data.room !== "string")return;
			data.name = blankify(data.name,config.rooms.nameLength); data.room = blankify(data.room,config.rooms.idLength);
			
			if(data.room == "")data.room = "default";
			if(data.name == "")data.name = "Anonymous";

			socket._pendingLoginData = data;

			let challenge = crypto.randomBytes(16).toString('hex');
			socket._powChallenge = challenge;
			socket._powExpiry = Date.now() + config.powChallengeExpiry;

			socket.emit('pow_challenge', {challenge: challenge, difficulty: config.powDifficulty});
		}
		}
	});
	
	socket.on("mine",(data)=>{
		let returnAmt=0;
		let range = 1000;
		let c = Math.random()*range;
		if(c > range/2+(Math.random()*(range/2))){
			if(c > range/2)returnAmt+=Math.floor(Math.random()*2);
			if(c > (range/3)*2)returnAmt+=Math.floor(Math.random()*2);
			if(c > (range/100)*99)returnAmt+=Math.floor(Math.random()*10);
		}
		
		let appendMsg = `(Session #MQ_${Idgen(5)}) Mined ${returnAmt} coins`;
		socket.user.coins+=returnAmt;
		socket.user.account.coins+=returnAmt;
		emitWallet(socket);
		
		socket.emit('bma_res',{console:appendMsg,returnAmount:returnAmt});
	});
	socket.on("pow_solution", (data) => {
		if(typeof data != "object")return;
		if(typeof data.nonce != "string" && typeof data.nonce != "number")return;
		if(!socket._powChallenge || !socket._pendingLoginData)return;
		if(Date.now() > socket._powExpiry){
			socket.emit("err","PoW challenge expired. Please try again.");
			socket._powChallenge = null;
			socket._pendingLoginData = null;
			return;
		}

		let nonce = String(data.nonce);
		if(!verifyPoW(socket._powChallenge, nonce, config.powDifficulty)){
			socket.emit("err","Invalid proof of work. Please try again.");
			socket._powChallenge = null;
			socket._pendingLoginData = null;
			return;
		}

		socket._powChallenge = null;
		let loginData = socket._pendingLoginData;
		socket._pendingLoginData = null;

			let over9000 = false;
			if(typeof skiddieWatch[socket.user.ip] == "object"){
			    if(typeof skiddieWatch[socket.user.ip].lastLogged == "number"){
					over9000 = skiddieWatch[socket.user.ip].lastLogged < config.rateLimit*5 || skiddieWatch[socket.user.ip].instances > 2;
				}
			}
			if(!over9000){
				if(typeof skiddieWatch[socket.user.ip] !== "object"){
					skiddieWatch[socket.user.ip] = {instances:1,lastLogged:0};
				} else {
					skiddieWatch[socket.user.ip].instances++;
					skiddieWatch[socket.user.ip].lastLogged=0;
				}
			
			
				socket.user = updateUser(
					socket.user,
					{name:loginData.name,roomId:loginData.room},
					false
				);
			
				let roomUsers = getUsers(loginData.room);
				let publicUser = getUsers(loginData.room)[socket.user.roomIndex];
				eventRoom("newuser",publicUser,socket.user,false);

				let matchingIds = publicrooms[loginData.room].owner == socket.user.id;
				socket.emit("room",{
					isPublic:publicrooms[loginData.room].isPublic,
					isOwner:matchingIds,
					id:socket.user.roomId,
					room:loginData.room,
					selfId:socket.user.id
				});
				setTimeout(() => {socket.emit("userlist",{list:roomUsers})},100);
				
				socket.user.loggedIn=true;
				ensureWorldPos(socket.user);

				// ---- BonziCOINS account load/create ----
				// loginData.bonzicoinPass is optional; if absent, the player plays
				// this session without persistent coin/hat/vehicle progress.
				if(typeof loginData.bonzicoinPass === 'string'){
					let acct = getOrCreateAccount(loginData.bonzicoinPass, socket.user.ip);
					if(acct){
						socket.user.account = acct;
						socket.user.accountPass = loginData.bonzicoinPass;
						socket.user.vehicle = acct.equippedVehicle || null;
					}
				}
				emitWallet(socket);
				socket.emit('stocksUpdate', getPublicStocks());

				socket.on("bonzicoin_auth",(data) => {
					if(typeof data != "object" || data === null)return;
					if(typeof data.pass != "string"){
						socket.user.account = null;
						socket.user.accountPass = null;
						socket.user.vehicle = null;
						emitWallet(socket);
						return;
					}
					let acct = getOrCreateAccount(data.pass, socket.user.ip);
					if(!acct){socket.emit('bonzicoinErr','Invalid or unavailable BonziCOIN password.'); return;}
					socket.user.account = acct;
					socket.user.accountPass = data.pass;
					socket.user.vehicle = acct.equippedVehicle || null;
					emitWallet(socket);
				});
				socket.on("gift",(data) => giftCoins(socket,data));
				socket.on("stock_create",(data) => createCompany(socket,data));
				socket.on("stock_invest",(data) => investStock(socket,data));
				socket.on("stock_sell",(data) => sellStock(socket,data));
				socket.on("stock_list",() => socket.emit('stocksUpdate', getPublicStocks()));
				socket.on("buy_hat",(data) => buyHat(socket,data));
				socket.on("buy_vehicle",(data) => buyVehicle(socket,data));
				socket.on("equip_vehicle",(data) => equipVehicle(socket,data));
				socket.on("move_to",(data) => moveTo(socket,data));
				socket.on("wasd",(data) => setWasd(socket,data));

				socket.on("banUser",(data) => {
					if(typeof data == "object" && socket.user.level > 2){
						if(typeof data.id !== 'string' || typeof data.hours !== 'string' || typeof data.minutes !== 'string' || typeof data.reason !== 'string')return;
						if(data.reason.length < 1)data.reason='Unknown';
						
						
						let targetUser = findUser(socket.user.roomId,data.id);
						if(typeof targetUser == 'number')return;
						
						let result = {duration:0,reason:''};
						
						let sleeperAgent = ['forever','infinite'];
						if(sleeperAgent.includes(data.hours.toLowerCase()) || 
						sleeperAgent.includes(data.minutes.toLowerCase())
						){
							result.duration=null;
						}else {result.duration=parseFloat(data.minutes)+(parseFloat(data.hours)*60);}
						result.reason=data.reason;
						result.duration=result.duration.toString();
				
bans[targetUser.ip] = result;
fs.writeFileSync('./bans.js', `
    module.exports = ${JSON.stringify(bans, null, 2)};
`, 'utf-8');

let targetSocket = targetUser.socket;
eventRoom('leave', { id: targetUser.id }, targetUser, true);
let room = publicrooms[targetUser.roomId];
if (room) {
    room.users = room.users.filter(u => u.id !== targetUser.id);
    if (room.users.length < 1) {
        delete publicrooms[targetUser.roomId];
    }
}
if (targetSocket) {
    targetSocket.emit('ban', { duration: result.duration, reason: result.reason });
    setTimeout(() => { targetSocket.disconnect(true); }, 3000);
}
					}
				});
				socket.on("msg", (data) => {
					
					if(typeof data == "object"){
						if(typeof data.msg !== "string")return;
						data.msg = blankify(data.msg);
						if(data.msg.length < 1)return;
						if(typeof data.quote == "object"){
							if(typeof data.quote.msg == "string" && typeof data.quote.name == "string"){
								data = {
									msg:data.msg,
									quote:{msg:blankify(data.quote.msg),name:blankify(data.quote.name)},
									id:socket.user.id
								};
							}
						} else {
							data = {msg:data.msg,id:socket.user.id};
						}
						socket.user.msgAttempts++;
						setTimeout(() => {
							eventRoom("msg",data,socket.user);
							socket.emit("msg",data);
							socket.user.msgAttempts--;
						},(socket.user.msgAttempts)*config.rateLimit);
					}
				});
				socket.on("typing",(data) => {
					if(typeof data != "string" && typeof data != "number")return;
					let status = false;
					if(data === 0)status=false;
					if(data === 1)status=true;
						
					updateUser(
							socket.user,
							{typing:status},
							true
						);
				});
				socket.on("command", (data) => {
					if(typeof data == "object"){
						if(typeof data.type !== "string" || typeof data.param !== "string")return;
						if(Object.keys(config.commands).includes(data.type)){
							socket.user.msgAttempts++;
							setTimeout(() => {
								let cmdresult = config.commands[blankify(data.type)](socket,blankify(data.param));
								if(typeof cmdresult == "object")socket.user = cmdresult;
								socket.user.msgAttempts--;
							},socket.user.msgAttempts*config.rateLimit);
							
						}
					}
				});

				socket.on("disconnect", () => {
    let room = publicrooms[socket.user.roomId];
    if (!room) return;

    eventRoom('leave', { id: socket.user.id }, socket.user, true);

    room.users = room.users.filter(
        user => user.id !== socket.user.id
    );

    if (room.users.length < 1) {
        delete publicrooms[socket.user.roomId];
    }
if(typeof skiddieWatch[socket.user.ip] == "object"){
						if(skiddieWatch[socket.user.ip].instances > 0 && socket.user.loggedIn){skiddieWatch[socket.user.ip].instances--; skiddieWatch[socket.user.ip].lastLogged=0;}
						
						if(skiddieWatch[socket.user.ip].instances < 1)delete skiddieWatch[socket.user.ip];
					}
	delete moveCooldowns[socket.user.id];
	delete wasdState[socket.user.id];
	delete giftCooldowns[socket.user.id];
});
		} else {
			socket.emit("err","COMPUTER (SENTIENT) SAYS: dont log in too fast or too many times it hurts my feelings");
			
		}
	});

	}
});