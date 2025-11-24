// Data -------------------------
const data = {
  eat: {
    title: "What to eat?",
    steps: [
      { label: "Pick: In or Out?", options: [
        { key: "in", label: "In (cook/order-in)" },
        { key: "out", label: "Out (restaurants)" },
        { key: "auto", label: "Decide In/Out For Me" },
      ]},
    ],
    lists: {
      in: ["Chicken Sandwich","Burrito","Crunchwrap","Chicken & Rice","Pizza","Dante’s Choice","Alexander’s Choice"],
      out:["Subway","McDonalds","Burger King","Wendy’s","Arby’s","Taco Bell","Chipotle","Dante’s Choice","Alexander’s Choice"]
    }
  },
  play: {
    title: "What to play?",
    steps: [
      { label:"Pick a type", options:[
        { key: "video", label:"Video Game" },
        { key: "board", label:"Board Game" },
        { key: "auto", label:"Decide For Me" },
      ]}
    ],
    lists: {
      video: ["Roblox","Minecraft","Outlast Trials","Smite/2","Deceit 2","Stardew","Amanda The Adventurer","The Walking Dead","Dante’s Choice","Alexander’s Choice"],
      board: ["Yahtzee","Monopoly","Cards","Dante’s Choice","Alexander’s Choice"]
    }
  },
  watch: {
    title: "What to watch?",
    steps: [],
    lists: {
      single: ["Smosh","C&C","Jenn","The 100","Dante’s Choice","Alexander’s Choice"]
    }
  },
  do: {
    title: "What to do?",
    steps: [
      { label:"Pick: Inside or Out?", options:[
        { key:"in", label:"Inside" },
        { key:"out", label:"Out" },
        { key:"auto", label:"Decide For Me" },
      ]}
    ],
    lists: {
      in:["Nap","Shower","Lay Down","Bake something","Paint","Watch a movie"],
      out:["Play a board game","Go for a drive","Jim Thorpe","LV Mall","King of Prussia Mall","See a movie","Dante’s Choice","Alexander’s Choice"]
    }
  }
};

// Elements ---------------------
const categories = document.getElementById('categories');
const subpanel = document.getElementById('subpanel');
const subButtons = document.getElementById('subButtons');
const subTitle = document.getElementById('subTitle');
const machine = document.getElementById('machine');
const reel = document.getElementById('reel');
const spinBtn = document.getElementById('spinBtn');
const reshuffleBtn = document.getElementById('reshuffleBtn');
const resultEl = document.getElementById('result');
const backBtn = document.getElementById('backBtn');

let currentCategory = null;
let currentList = [];
let spinning = false;
let lastPick = null;

// Helpers ----------------------
function pickRandom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function smoothHide(el){ el.classList.add('fadeout'); setTimeout(()=> el.classList.add('hidden'), 340); }
function show(el){ el.classList.remove('hidden','fadeout'); }

// Confetti (tiny, inline) -----
function confettiBurst(){
  // Simple text confetti
  const chars = ['★','✦','✧','❖','✺','✹','✶'];
  for(let i=0;i<16;i++){
    const s = document.createElement('span');
    s.textContent = pickRandom(chars);
    s.style.position='fixed';
    s.style.left = (Math.random()*100)+'vw';
    s.style.top = '-4vh';
    s.style.fontSize = (16+Math.random()*24)+'px';
    s.style.opacity = '.9';
    s.style.transition = 'transform 1.6s cubic-bezier(.2,.7,0,1), opacity 1.6s ease';
    s.style.transform = `translateY(${80+Math.random()*24}vh) rotate(${(Math.random()*720-360)}deg)`;
    s.style.color = i%2? 'var(--accent)' : '#fff';
    document.body.appendChild(s);
    requestAnimationFrame(()=>{
      s.style.transform = `translateY(${90+Math.random()*10}vh) rotate(${(Math.random()*720-360)}deg)`;
      s.style.opacity = '0';
    });
    setTimeout(()=> s.remove(), 1800);
  }
}

// Slot machine -----------------
let spinTimer = null;
function startSpin(){
  if(spinning || !currentList.length) return;
  spinning = true;
  resultEl.textContent = '';
  reel.classList.add('spin');

  // Shuffle preview cycling text
  let idx = 0;
  spinTimer = setInterval(()=>{
    idx = (idx+1)%currentList.length;
    reel.textContent = currentList[idx] + "  •  " + pickRandom(currentList) + "  •  " + pickRandom(currentList);
  }, 90);

  // Ease-out timing
  const duration = 1800 + Math.random()*1200; // 1.8-3.0s
  setTimeout(stopSpin, duration);
}

function stopSpin(){
  clearInterval(spinTimer);
  reel.classList.remove('spin');

  // Weighted 'press your luck' decel + final
  let t = 0; const steps = 9;
  const stepper = () => {
    reel.textContent = pickRandom(currentList);
    t++;
    if(t<steps){ setTimeout(stepper, 80 + t*40); }
    else {
      const final = pickRandom(currentList);
      lastPick = final;
      reel.textContent = final;
      resultEl.textContent = `→ ${final}`;
      spinning = false;
      confettiBurst();
    }
  };
  stepper();
}

function setSubButtons(cfg){
  subButtons.innerHTML = '';
  cfg.options.forEach(o=>{
    const b = document.createElement('button');
    b.textContent = o.label;
    b.dataset.key = o.key;
    b.addEventListener('click', ()=>{
      document.querySelectorAll('#subButtons button').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      handleSubChoice(o.key);
    });
    subButtons.appendChild(b);
  });
}

function handleSubChoice(key){
  const cat = data[currentCategory];
  if(currentCategory === 'eat'){
    const mode = key === 'auto' ? (Math.random()<.5?'in':'out') : key;
    currentList = cat.lists[mode];
    show(machine);
    reel.textContent = `Choosing ${mode.toUpperCase()}...`;
    resultEl.textContent = '';
  } else if(currentCategory === 'play'){
    const mode = key === 'auto' ? (Math.random()<.5?'video':'board') : key;
    currentList = cat.lists[mode];
    show(machine);
    reel.textContent = `Choosing ${mode === 'video' ? 'Video Game' : 'Board Game'}...`;
    resultEl.textContent = '';
  } else if(currentCategory === 'do'){
    const mode = key === 'auto' ? (Math.random()<.5?'in':'out') : key;
    currentList = cat.lists[mode];
    show(machine);
    reel.textContent = `Choosing ${mode.toUpperCase()}...`;
    resultEl.textContent = '';
  }
}

function goCategory(catKey){
  currentCategory = catKey;
  // hide category grid with flourish
  smoothHide(categories);
  // show subpanel UI
  show(subpanel);
  document.getElementById('backBtn').classList.remove('hidden');
  machine.classList.add('hidden');
  resultEl.textContent='';
  reel.textContent = '';

  const cat = data[catKey];
  subTitle.textContent = cat.title;

  if(catKey === 'watch'){
    // Direct spin with single list
    subButtons.innerHTML = '';
    show(machine);
    currentList = cat.lists.single;
    reel.textContent = 'Ready to spin...';
  } else {
    // Show options row for category step 0
    setSubButtons(cat.steps[0]);
  }
}

function goHome(){
  currentCategory = null;
  lastPick = null;
  // reset UI
  subpanel.classList.add('hidden');
  categories.classList.remove('hidden','fadeout');
  categories.classList.add('enter');
  backBtn.classList.add('hidden');
  reel.textContent = '';
  resultEl.textContent = '';
}

// Wire up ----------------------
categories.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    goCategory(card.dataset.category);
  });
});

backBtn.addEventListener('click', goHome);
spinBtn.addEventListener('click', startSpin);
reshuffleBtn.addEventListener('click', ()=>{
  if(!currentList.length) return;
  reel.textContent = pickRandom(currentList);
  resultEl.textContent = '';
});

// Accessibility: key shortcuts
document.addEventListener('keydown', (e)=>{
  if(e.key.toLowerCase()==='s') startSpin();
  if(e.key==='Escape' && !categories.classList.contains('hidden')) return;
  if(e.key==='Escape') goHome();
});

// Initial content
reel.textContent = '';
