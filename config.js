let blankify;
let getUsers;
let updateUser;
let eventRoom;
let publicrooms;
let copypastas;

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
let blessedHats = ['clippy','peedy','whiteobama','qmark','yahu','sunglasses','spongebob','whiteobama','witch','silverfedora','pumpkin','illuminati','cigar','dank','cauldron','bathbomb'];
function Idgen(length) {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';let result = '';
   for (let i = 0; i < length; i++){
      result += characters.charAt(Math.floor(Math.random() * characters.length));
   }
   return result;
}
 
let colorNames = Object.keys(colorList);
let config =  {
	colorList,hatShop,hatList,colorNames,Idgen,blessedHats,
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
	return ["userEvent",{id:thisSocket.user.id,events:eventConstruct},thisSocket.user,true];
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
	return ["userEvent",{id:thisSocket.user.id,events:eventConstruct},thisSocket.user,true];
},
"linux":(thisSocket,eventData)=>{
	if(typeof eventData != "string")return;
	return ["userEvent",{id:thisSocket.user.id,events:copypastas['extra']['linux']},thisSocket.user,true];
},
"joel":(thisSocket,eventData)=>{
	if(typeof eventData != "string")return;
	return ["userEvent",{id:thisSocket.user.id,events:copypastas['extra']['joel']},thisSocket.user,true];
},
	"youtube":(thisSocket,eventData)=>{
			let validIdChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_".split("");
			
			if(typeof eventData != "string")return;
			eventData=blankify(eventData);
			if(eventData.startsWith("https://youtube.com") || eventData.startsWith("https://youtu.be")){
				if(eventData.startsWith("https://youtu.be") && eventData.includes(".be/")){
					eventData = eventData.includes('?') ? eventData.substring(eventData.indexOf('.be/')+4,eventData.indexOf('?')) : eventData.substring(eventData.indexOf('.be/')+4);
				} else if(eventData.startsWith("https://youtube.com") && eventData.includes('watch?v=')){
					eventData = eventData.substring(eventData.indexOf('?v=')+3,(eventData.indexOf('?v=')+3)+11);
				} else {
					console.error("Invalid: "+eventData);
					thisSocket.emit("err","Incomplete or invalid URL!");
					return;
				}
			} else if(eventData.length < 12 && eventData.toUpperCase().split("").every(r => validIdChars.includes(r))) {
				eventData = eventData;
			} else {
				console.error("Invalid: "+eventData);
				thisSocket.emit("err","Incomplete or invalid video ID!");
				return;
			}
			eventData = {by:thisSocket.user.id,videoCode:eventData};
			return ["youtube",eventData,thisSocket.user,true];
			
		},
		"asshole":(thisSocket,eventData)=>{
	eventData = {to:eventData};
	if(typeof eventData == "object"){
		return ["asshole",{by:thisSocket.user.id,to:blankify(eventData.to)},thisSocket.user,true];
	}
},
"bass":(thisSocket,eventData)=>{
	eventData = {to:eventData};
	if(typeof eventData == "object"){
		return ["bass",{by:thisSocket.user.id,to:blankify(eventData.to)},thisSocket.user,true];
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
                return ['nuke',{id:targetUser.id},targetUser,true];
                setTimeout(() => {targetSocket.disconnect(true);},3000);
            }
        }
    }
},
		"godmode":(thisSocket,param)=>{
			if(config.godword.includes(param)){
				thisSocket.user.level=4;
				return thisSocket.user;
			}
			if(config.kingword.includes(param)){
				thisSocket.user.level=3;
				return thisSocket.user;
			}
		},
		"pgodmode":(thisSocket,param)=>{
			return config.commands["godmode"](thisSocket,param);
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
				thisSocket.user = updateUser(thisSocket.user,{color:"./img/bonzi/glow.png",tag:"<img src='/img/desktop/icons/wrench_antenna.png' class='tagicon'>"},true);
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
			if(thisSocket.user.level > 3){
				thisSocket.user = updateUser(thisSocket.user,{color:"./img/bonzi/pope.png",tag:"<img src='/img/desktop/icons/wrench_antenna.png' class='tagicon'>"},true);
				return thisSocket.user;
			}
		},
		"hat":(thisSocket,eventData)=>{
			if(typeof eventData == "string"){
				let hatName = eventData.trim().toLowerCase();
				let maxHats = thisSocket.user.level >= 2 ? 10 : 2;
				if(hatName.length < 1){
					thisSocket.user = updateUser(thisSocket.user,{hats:[]},true);
					return thisSocket.user;
				}
				if(!Object.keys(hatList).includes(hatName))return;

				if(blessedHats.includes(hatName) && thisSocket.user.level < 2){
					thisSocket.emit("err","You must be blessed or staff to use this hat!");
					return;
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
			return ['msg',{msg:'- <video class="user_vid" controls><source src="'+videoSend+'" type="video/mp4"></video>',id:thisSocket.user.id},thisSocket.user,true];
		}
		if(config.imageFormats.some(r => eventData.endsWith(r))){
			let imgSend = blankify(eventData);
			return ['msg',{msg:'- <img class="user_img" src="'+imgSend+'">',id:thisSocket.user.id},thisSocket.user,true];
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

config.init = (d) => { blankify = d.blankify; getUsers = d.getUsers; updateUser = d.updateUser; eventRoom=d.eventRoom; publicrooms=d.publicrooms; copypastas=d.copypastas;};


module.exports = config;