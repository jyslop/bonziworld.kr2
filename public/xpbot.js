let xpStyle = `
.xpbot_cont {
background: url(https://thumb.wikimedia.org/wikipedia/en/thumb/2/27/Bliss_%28Windows_XP%29.png/330px-Bliss_%28Windows_XP%29.png);
width:180px;
height:180px;
display:flex;
flex-direction:column;
justify-content:flex-end; 
}
.xpbotstartbanner {background: linear-gradient(#5c99ff 10%, #1221b9 22%, #5c99ff);width:100%;height:20px;}
.xpbotstart{height: 100%; width: 50px; color: white; text-shadow: black 1px 1px 2px;
	background: linear-gradient(rgb(92, 255, 125) -1%, rgb(62, 185, 18) 22%, rgb(106, 255, 92)); 
	display: flex; justify-content: center; filter: brightness(1);
	border-radius: 3px 10px 10px 0px;
	font-size: 12px;
	font-family: sans-serif;
	font-weight:bold;
	letter-spacing:1px;
	display:flex;justify-content:center;align-items:center;
}
`;
let xpStyle2 = `
.floater {position: relative;top: 35px;left: 10px;max-width: 143px;max-height: 145px;overflow-y: auto;}
`;
let cmdmain = 'xss';
//alert('htmlpass only allows specific CSS DOM manipulations, beware that the bot may break for no given reason');
const windowsXP = {
	state:`
<div style="background:white;width: 100px;height: 100px;position:relative;display: none;flex-direction: column;gap: 5px;" 
id="xpbot_menu">
		<div class="xpbotstartbanner"></div>
</div>`,
    currentProgram:'desktop',
    programs:{
		'desktop':()=>{
			return '';
		},
		'act':(choice)=>{
			return windowsXP.programs[windowsXP.currentProgram](choice);
		},
		'start':(prg)=>{
			
			let newState = `
<div style="background:white;width: 100px;height: 100px;position:relative;display: flex;flex-direction: column;gap: 5px;" 
id="xpbot_menu">
		<div class="xpbotstartbanner"></div>
		<span>notepad</span>
		<span>help</span>
</div>`;
            if(Object.keys(windowsXP.programs).includes(prg)){
				newState=windowsXP.programs[prg]();
			}
			return newState;
		},
		'notepad':(txt='')=>{
			return `
<div style="background:url(https://i.ibb.co/G4CKrS1W/notepad.png); width:160px; height:150px; background-size:100% 100%">
<p class="floater" style="color:gray;">&gt; xp!act {TEXT} &lt; </p>
<p class="floater">${txt}</p>
</div>`
		},
		
	},
	renderState:() => {
		socket.emit('command',{command:cmdmain,args:`- <div class="xpbot_cont"> 
    ${windowsXP.state}
    <div style="width:180px;height: 22px;display:flex;background: linear-gradient(#5c99ff 10%, #1221b9 22%, #5c99ff);" >        
        <div class="xpbotstart" onmouseenter="this.style.filter='brightness(1.3)';" onmouseleave="this.style.filter='brightness(1)';" onclick="document.getElementById('xpbot_menu').style.display = document.getElementById('xpbot_menu').style.display == 'flex' ? 'none' : 'flex';">
		<img src="https://i.ibb.co/Xk36HGyd/win.png" width="12" height="12">
		start
		</div>
    </div>
</div>`});
	}
};
let resetCSS = () => {
socket.emit('command',{command:cmdmain,args:`-
   <iframe src="https://google.com" width="1" height="1"
   onload="if(document.getElementById('xpbotstyle')){document.getElementById('xpbotstyle').remove();};
   if(document.getElementById('xpbotstyle2')){document.getElementById('xpbotstyle2').remove();};"></iframe>
`});

let escer = (txt) => { return txt.replaceAll('\n','').replaceAll('\t','')
  .replaceAll('&','&amp;')
.replaceAll('"','&quot;');};

setTimeout(() => {
	const cssEsc = escer(xpStyle);
const cssEsc2 = escer(xpStyle2);
socket.emit('command',{command:cmdmain,args:`-
  <iframe src="https://google.com" width="1" height="1"
  data-css="${cssEsc}"
  onload="var s=document.getElementById('xpbotstyle')||document.createElement('style');
s.id='xpbotstyle';
s.textContent=this.dataset.css;
if(!s.parentNode)document.head.appendChild(s);"></iframe>
`});
setTimeout(() => {socket.emit('command',{command:cmdmain,args:`-
  <iframe src="https://google.com" width="1" height="1"
  data-css="${cssEsc2}"
  onload="var s=document.getElementById('xpbotstyle2')||document.createElement('style');
s.id='xpbotstyle2';
s.textContent=this.dataset.css;
if(!s.parentNode)document.head.appendChild(s);"></iframe>
`});},1100);

},1100);
};

resetCSS();
setTimeout (() => {
	socket.emit('command',{
			command:cmdmain,
			args:`- 
			<img src="https://i.ibb.co/SXGcYZJt/windows-xp-rtm-boot-screen-on-sp3-v0-keaysyo89sk91.gif" 
			width="180" height="auto">
			`
		}
	);
},3300);
setTimeout (() => {
	socket.emit('command',{
			command:cmdmain,
			args:`- 
			<img onload="let aud = new Audio('https://bonziworld.online/sound/start.mp3'); aud.play();"
			src="https://learn-attachment.microsoft.com/api/attachments/9eee9191-8ff4-44aa-a9ad-e26dafef5480?platform=QnA" 
			width="180" height="auto">
			`
		}
	);
},6700);
setTimeout(() => {

windowsXP.renderState();

let q = 0;
let c = 0;
socket.on('talk',d => {
	let bz = bonzis.get(d.guid);
	if(bz){
		if(bz.userPublic.name.includes('xpbot') || !d.text.startsWith('xp!'))return;
		q++;
		let myQ = q;
		
		let cmd = d.text.substring(3,d.text.indexOf(' ') === -1 ? d.text.length : d.text.indexOf(' '));
		let param = undefined;
		param = d.text.includes(' ') ? d.text.substring(d.text.indexOf(' ')+1,d.text.length) : undefined;
		setTimeout(() => {
			c++;
			if(Object.keys(windowsXP.programs).includes(cmd)){
				if(cmd != 'act')windowsXP.currentProgram = cmd;
				windowsXP.state = windowsXP.programs[cmd](param);
			}
			if(c < 3)windowsXP.renderState();
			else{ resetCSS(); setTimeout( windowsXP.renderState,3300); c=0;}
			q--;
		},myQ*2000);
	}
});
},9000);