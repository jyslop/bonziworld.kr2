var express = require('express');
var copypastas = require('./copypastas.js');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors');
var fs = require('fs');
var crypto = require('crypto');
var bans = require('./bans.js');

let config = require('./config');
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

let Idgen = config.Idgen;
app.use(express.static('public'));
app.use('/img', express.static(__dirname + '/public/img'));
http.listen(process.env.PORT || 3000, function() {
  var host = http.address().address
  var port = http.address().port
  console.log('BonziWORLD.kr is listening at port %s' + '!', port)
});

var colorList = config.colorList;
let hatShop = config.hatShop;
let hatList = config.hatList;
let colorNames = config.colorNames;
let blessedHats = config.blessedHats;
var botmsg = [
"- hi",'- bundasworld revive HD deluxe ++'];

var publicrooms = { "default":{
   isPublic:true,
	owner:'none',
	byoutube:'none',
   users: [
    {
      name: "BonziBUDDY",
      color: "/img/bonzi/purple.png",
      id: "bonzibuddy",
      tag:"<img src='/img/desktop/icons/server.png' class='tagicon'>",
	  tag2:'Bot',
      pitch: 80,
      speed: 150,
      messages: [],
      socketId:"bonziBuddy",
      hats:[],

      posX: 4500,
      posY: 4500,
      velX: 0,
      velY: 0,
      vehicle: null,
      moving: false,
      moveStartTime: 0,
      moveOriginX: 4500,
      moveOriginY: 4500,
      moveTargetX: 4500,
      moveTargetY: 4500
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
    //fuck whitespace
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
let POLL_LIMITS = {title:1000,option:50,minOptions:2,maxOptions:5,perRoom:20,maxPending:5,voteGapMs:250};
let POLL_ID_PATTERN = /^[a-f0-9]{16}$/;
let pollStore = {};
let pollSeq = 0;
function purgePolls(roomId){
	Object.keys(pollStore).forEach(pollId => {
		if(pollStore[pollId].roomId === roomId)delete pollStore[pollId];
	});
}
function trimRoomPolls(roomId){
	let ids = Object.keys(pollStore).filter(pollId => pollStore[pollId].roomId === roomId);
	ids.sort((a,b) => pollStore[a].seq - pollStore[b].seq);
	while(ids.length > POLL_LIMITS.perRoom){
		delete pollStore[ids.shift()];
	}
}
function cleanPollText(value,maxLength){
	if(typeof value !== 'string' || value.length > maxLength)return null;
	let cleaned = blankify(value,maxLength);
	return cleaned.length > 0 ? cleaned : null;
}
function isPlainObject(value){
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function getUsers(roomId){
	let result = [];
	publicrooms[roomId].users.forEach(fullUser => {
		let obfuscatedUser = {name:fullUser.name,color:fullUser.color,id:fullUser.id,pitch:fullUser.pitch,speed:fullUser.speed,hats:fullUser.hats||[],tag2:fullUser.tag2,tag:fullUser.tag||"",typing:fullUser.typing,posX:fullUser.posX,posY:fullUser.posY,vehicle:fullUser.vehicle||null,coins:fullUser.account ? Math.round(fullUser.account.coins*100)/100 : 0};
		result.push(obfuscatedUser);
	});
	return result;
}
function findUser(roomId,guid){
	let result = -1;
	publicrooms[roomId].users.forEach(r => {
		if(r.id == guid ){result = r;};
		if(typeof guid == 'string'){if(r.name.toLowerCase() == guid.toLowerCase() || r.name.includes(guid.substring(0,5))){result=r;}}
	});
	
	

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
		publicrooms[originalUser.roomId]={isPublic:false,owner:originalUser.id,users:[],props:generateProps()};
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


let stockChangeCounts = {};
function trackStockChange(ticker){
	stockChangeCounts[ticker] = (stockChangeCounts[ticker]||0) + 1;
	if(stockChangeCounts[ticker] >= 5){
		saveStocks();
		stockChangeCounts[ticker] = 0;
	}
}

let bonziAccountsFile = './bonziaccounts.js';
let bonziAccounts = {};
try { bonziAccounts = require(bonziAccountsFile); } catch(e){ bonziAccounts = {}; }

function saveBonziAccounts(){
	try {
		fs.writeFileSync(bonziAccountsFile, `
module.exports = ${JSON.stringify(bonziAccounts, null, 2)};
`, 'utf-8');
	} catch(e){  }
}

function defaultAccount(ip){
	return { coins:0, hats:[], vehicles:[], equippedVehicle:null, company:null, createdIp:ip||'unknown' };
}


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


let VEHICLE_IMAGE_CAR = './img/bonzi/bord.png';

let vehiclePresets = {
	car:{ name:'BORD', cost:800, maxSpeed:6.5, img: VEHICLE_IMAGE_CAR }
};

function getPublicVehiclePresets(){
	let out = {};
	Object.keys(vehiclePresets).forEach(k => {
		let p = vehiclePresets[k];
		out[k] = { name:p.name, cost:p.cost, maxSpeed:p.maxSpeed, img:p.img };
	});
	return out;
}

const WORLD_SIZE = 9000;
const MAX_MOVE_DIST = 1200; 
const MOVE_DURATION_MS = 1000; 
const ON_FOOT_COOLDOWN_MIN_MS = 4000; 
const ON_FOOT_COOLDOWN_MAX_MS = 5000;
const WASD_TICK_MS = 100;
const WORLD_SYNC_INTERVAL_MS = 2500; 
const SYNC_EVERY_TICKS = Math.round(WORLD_SYNC_INTERVAL_MS / WASD_TICK_MS);
const CRASH_SPEED_THRESHOLD = 4;
let BUSH_AMOUNT = 500; 
let moveCooldowns = {}; 
let wasdState = {}; 
let tickCount = 0;


function generateProps(){
	let props = [];
	for(let i = 0; i < BUSH_AMOUNT; i++){
		let x, y;
		do {
			x = Math.floor(Math.random()*WORLD_SIZE);
			y = Math.floor(Math.random()*WORLD_SIZE);
		} while(Math.hypot(x-WORLD_SIZE/2, y-WORLD_SIZE/2) < 500);
		props.push({img:'./img/desktop/bush.png', w:128, h:128, x:x, y:y, impassable:true, overlay:false});
	}
	return props;
}

publicrooms.default.props = generateProps();

function propBlocksPoint(roomId, x, y){
	let room = publicrooms[roomId];
	if(!room || !Array.isArray(room.props))return false;
	return room.props.some(p => p.impassable && Math.abs(x-p.x) < p.w/2 && Math.abs(y-p.y) < p.h/2);
}

function ensureWorldPos(user){
	let spr = 300;
	if(typeof user.posX !== 'number')user.posX = (WORLD_SIZE/2)+(0-spr)+Math.floor(Math.random()*spr);
	if(typeof user.posY !== 'number')user.posY = (WORLD_SIZE/2)+(0-spr)+Math.floor(Math.random()*spr);
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


		let now = Date.now();
		room.users.forEach(u => {
			if(u.mode3d && u.keys3d){
				ensureWorldPos(u);
				let k = u.keys3d, dt = Math.min((now - (u.tick3d || now))/1000, 0.25), fw = (k.w?1:0) - (k.s?1:0), st = (k.d?1:0) - (k.a?1:0);
				u.tick3d = now;
				if(fw || st){
					let preset = u.vehicle && vehiclePresets[u.vehicle], step = (preset ? preset.maxSpeed*100 : 250) * dt / Math.hypot(fw, st);
					let c = Math.cos(k.yaw), s = Math.sin(k.yaw);
					let nx = Math.max(0, Math.min(WORLD_SIZE, u.posX + (c*fw - s*st) * step));
					let ny = Math.max(0, Math.min(WORLD_SIZE, u.posY + (s*fw + c*st) * step));
					if(!propBlocksPoint(roomId, nx, u.posY))u.posX = nx;
					if(!propBlocksPoint(roomId, u.posX, ny))u.posY = ny;
					u.moveOriginX = u.moveTargetX = u.posX;
					u.moveOriginY = u.moveTargetY = u.posY;
					eventRoom('userMoveTo',{id:u.id,x:u.posX,y:u.posY,vehicle:u.vehicle||null,direct:true},u,false);
				}
				return;
			}
			if(u.vehicle)return; 
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


		let drivers = room.users.filter(u => u.vehicle && !u.mode3d && wasdState[u.id]);
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
			if(propBlocksPoint(roomId, nextX, nextY)){
				if(speed >= CRASH_SPEED_THRESHOLD){
					destroyVehicle(u);
					delete wasdState[u.id];
				}
				return;
			}
			let hitBorder = nextX <= 0 || nextX >= WORLD_SIZE || nextY <= 0 || nextY >= WORLD_SIZE;

			u.posX = Math.max(0, Math.min(WORLD_SIZE, nextX));
			u.posY = Math.max(0, Math.min(WORLD_SIZE, nextY));

			if(hitBorder && speed >= CRASH_SPEED_THRESHOLD){
				destroyVehicle(u);
				delete wasdState[u.id];
			}
		});


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


		if(drivers.length){
			drivers.forEach(u => {
				eventRoom('userMoveTo',{id:u.id,x:u.posX,y:u.posY,vehicle:u.vehicle||null},u,false);
			});
		}


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
	if(u.vehicle || u.mode3d)return; 
	ensureWorldPos(u);

	let now = Date.now();
	let cooldownUntil = moveCooldowns[u.id] || 0;
	if(now < cooldownUntil)return; 

	x = Math.max(0, Math.min(WORLD_SIZE, x));
	y = Math.max(0, Math.min(WORLD_SIZE, y));
	if(propBlocksPoint(u.roomId, x, y))return;

	let dx = x - u.posX, dy = y - u.posY;
	let dist = Math.hypot(dx, dy);
	if(dist < 1)return; 
	if(dist > MAX_MOVE_DIST)return;

	u.moveOriginX = u.posX;
	u.moveOriginY = u.posY;
	u.moveTargetX = x;
	u.moveTargetY = y;
	u.moveStartTime = now;
	u.moving = true;

	moveCooldowns[u.id] = now + (ON_FOOT_COOLDOWN_MIN_MS + Math.random()*(ON_FOOT_COOLDOWN_MAX_MS - ON_FOOT_COOLDOWN_MIN_MS));


	eventRoom('userMoveTo', { id:u.id, x:x, y:y, vehicle:null }, u, false);
}

function setMode3d(thisSocket, on){
	let u = thisSocket.user;
	ensureWorldPos(u);
	u.mode3d = on === true;
	u.keys3d = null;
	u.tick3d = 0;
	u.moving = false;
	u.moveOriginX = u.moveTargetX = u.posX;
	u.moveOriginY = u.moveTargetY = u.posY;
	delete wasdState[u.id];
}

function setWasd3d(thisSocket, data){
	let u = thisSocket.user;
	if(!u.mode3d || typeof data !== 'object' || data === null || !Number.isFinite(data.yaw))return;
	u.keys3d = {w:data.w === true, a:data.a === true, s:data.s === true, d:data.d === true, yaw:data.yaw};
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
	if(u.loggedIn)updateUser(u,{},true);
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
config.init({blankify, getUsers, updateUser, eventRoom, publicrooms, copypastas});
config.commands.byoutube = function(thisSocket, param){
	let room = publicrooms[thisSocket.user.roomId];
	if(typeof room != 'object')return;
	let target = blankify(param.trim());
	let src = 'none';
	if(target.toLowerCase() !== 'none'){
		let match = target.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([A-Za-z0-9_-]{11})/) || target.match(/^([A-Za-z0-9_-]{11})$/);
		if(!match)return;
		src = 'https://www.youtube.com/embed/' + match[1] + '?autoplay=1';
	}
	room.byoutube = src;
	return ['byoutube',{src:src,by:thisSocket.user.id},thisSocket.user,true];
};
io.on("connection", function(socket){
	var userid = Idgen(10);
	var newcolor = colorList[colorNames[Math.floor(Math.random()*colorNames.length)]];
	socket.user = {
		name: "Anonymous", 
		color: newcolor, 
		id: userid, 
		hats:[],
		messages: ["Welcome to BonziWORLD.kr"],
		ip: socket.handshake.headers["x-forwarded-for"] || "127.0.0.1",
		loggedIn:false,
		mode3d:false,
		keys3d:null,
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
		account:{coins:0},
		tag2:''
	};

	socket._powChallenge = null;
	socket._powExpiry = null;
	socket._pendingLoginData = null;

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
		socket.removeAllListeners('poll');
		socket.removeAllListeners('vote');
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
				socket.emit('props', publicrooms[loginData.room].props || []);
				setTimeout(() => {socket.emit("userlist",{list:getUsers(loginData.room)})},100);
				if(typeof publicrooms[loginData.room].byoutube == 'string' && publicrooms[loginData.room].byoutube !== 'none'){
					socket.emit('byoutube',{src:publicrooms[loginData.room].byoutube});
				}
				
				socket.user.loggedIn=true;
				ensureWorldPos(socket.user);


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
				socket.on("mode3d",(on) => setMode3d(socket,on));
				socket.on("wasd3d",(data) => setWasd3d(socket,data));

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
        purgePolls(targetUser.roomId);
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
				socket.on("poll", (data) => {
					if(!isPlainObject(data))return;
					if(!Array.isArray(data.options))return;
					if(data.options.length < POLL_LIMITS.minOptions || data.options.length > POLL_LIMITS.maxOptions)return;
					let title = cleanPollText(data.title,POLL_LIMITS.title);
					if(title === null)return;
					let options = [];
					for(let i = 0; i < data.options.length; i++){
						let option = cleanPollText(data.options[i],POLL_LIMITS.option);
						if(option === null)return;
						options.push(option);
					}
					if(typeof publicrooms[socket.user.roomId] !== 'object')return;
					if(socket.user.msgAttempts >= POLL_LIMITS.maxPending)return;
					socket.user.msgAttempts++;
					setTimeout(() => {
						let roomId = socket.user.roomId;
						if(typeof publicrooms[roomId] !== 'object' || !hasUser(roomId,socket.user.id)){
							socket.user.msgAttempts--;
							return;
						}
						let pollId = crypto.randomBytes(8).toString('hex');
						pollSeq++;
						pollStore[pollId] = {roomId:roomId,optionCount:options.length,votes:Object.create(null),seq:pollSeq};
						trimRoomPolls(roomId);
						let payload = {id:socket.user.id,poll:pollId,title:title,options:options};
						eventRoom("poll",payload,socket.user,true);
						socket.user.msgAttempts--;
					},socket.user.msgAttempts*config.rateLimit);
				});
				socket.on("vote", (data) => {
					if(!isPlainObject(data))return;
					if(typeof data.poll !== 'string' || !POLL_ID_PATTERN.test(data.poll))return;
					if(typeof data.vote !== 'number' || !Number.isInteger(data.vote))return;
					let poll = pollStore[data.poll];
					if(!poll || poll.roomId !== socket.user.roomId)return;
					if(data.vote < 0 || data.vote >= poll.optionCount)return;
					let now = Date.now();
					if(now - (socket.lastVoteAt || 0) < POLL_LIMITS.voteGapMs)return;
					socket.lastVoteAt = now;
					if(poll.votes[socket.user.id] === data.vote)return;
					poll.votes[socket.user.id] = data.vote;
					eventRoom("vote",{poll:data.poll,id:socket.user.id,vote:data.vote},socket.user,true);
				});
				socket.on("command", (data) => {
					if(typeof data == "object"){
						if(typeof data.type !== "string" || typeof data.param !== "string")return;
						if(Object.keys(config.commands).includes(data.type)){
							socket.user.msgAttempts++;
							setTimeout(() => {
								let cmdresult = config.commands[blankify(data.type)](socket,blankify(data.param));
								if(typeof cmdresult == "object"){
									if(Array.isArray(cmdresult))eventRoom(...cmdresult);
									else socket.user = cmdresult;
								}
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
        purgePolls(socket.user.roomId);
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
