// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(btn.dataset.tab).style.display = 'block';
  });
});

// Dark Mode
document.getElementById('darkMode').addEventListener('change', e => {
  document.body.classList.toggle('dark', e.target.checked);
});

// Currency
const rates = { USD: 1, EUR: 0.92, NGN: 780, GBP: 0.8 };
let currentCurrency = 'USD';
document.getElementById('currency').addEventListener('change', e => {
  currentCurrency = e.target.value;
  calculateCost();
});

// Auto-update cost on input
['materialCost','laborHours','hourlyRate','fees','profit'].forEach(id => {
  document.getElementById(id).addEventListener('input', calculateCost);
});

// Yarn Calculator
function calculateYarn() {
  let type = document.getElementById('projectType').value;
  let width = parseFloat(document.getElementById('width').value) || 0;
  let height = parseFloat(document.getElementById('height').value) || 0;
  let yarnWeight = parseFloat(document.getElementById('yarnWeight').value) || 50;
  let gauge = parseFloat(document.getElementById('gauge').value) || 20;
  let skill = document.getElementById('skillLevel').value;

  const density = { scarf:1, cap:0.5, blanket:3, sweater:2.5, dress:2.5, skirt:1.8,
                    shirt:2, decor:2.2, bottleHolder:0.7, custom:1 };
  const skillFactor = { beginner:1.2, intermediate:1, expert:0.8 };

  let totalStitches = width * height * gauge * density[type];
  let estTime = totalStitches / (50 * skillFactor[skill]); 
  let skeinsNeeded = Math.ceil((width * height * density[type]) / yarnWeight);

  document.getElementById('yarnOutput').innerText =
    `Total Yarn Needed: ${totalStitches.toFixed(0)} m | Skeins Needed: ${skeinsNeeded} | Est. Time: ${Math.floor(estTime)}h ${Math.round((estTime % 1)*60)}m`;
}

// Cost Calculator
function calculateCost() {
  let material = parseFloat(document.getElementById('materialCost').value) || 0;
  let hours = parseFloat(document.getElementById('laborHours').value) || 0;
  let rate = parseFloat(document.getElementById('hourlyRate').value) || 0;
  let fees = parseFloat(document.getElementById('fees').value) || 0;
  let profit = parseFloat(document.getElementById('profit').value) || 0;

  material *= rates[currentCurrency];
  rate *= rates[currentCurrency];

  let laborCost = hours * rate;
  let totalCost = material + laborCost;
  let suggestedPrice = totalCost / (1 - ((fees+profit)/100));

  document.getElementById('costOutput').innerText =
    `Total Cost: ${currentCurrency} ${totalCost.toFixed(2)} | Suggested Price: ${currentCurrency} ${suggestedPrice.toFixed(2)}`;
}

// Projects
let projects = [];
function saveProject() {
  calculateYarn();
  calculateCost();
  const projectName = document.getElementById('customProjectName').value || document.getElementById('projectType').value;
  const yarnText = document.getElementById('yarnOutput').innerText;
  const costText = document.getElementById('costOutput').innerText;

  projects.push({ name: projectName, yarn: yarnText, cost: costText });
  renderProjects();
  confettiBurst();
}

function renderProjects() {
  const list = document.getElementById('projectList');
  list.innerHTML = '';
  if(projects.length===0){
    list.innerHTML = 'No projects saved yet.';
    return;
  }
  projects.forEach((p,i) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `<h3>🎯 ${p.name}</h3>
                      <p>${p.yarn}</p>
                      <p>${p.cost}</p>
                      <button onclick="deleteProject(${i})">❌ Delete</button>`;
    list.appendChild(card);
  });
}

function deleteProject(index){
  projects.splice(index,1);
  renderProjects();
}

// Confetti
function confettiBurst(){
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  for(let i=0;i<100;i++){
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height-200,
      r: Math.random()*6+4,
      d: Math.random()*50+2,
      color: `hsl(${Math.random()*360},100%,50%)`,
      tilt: Math.random()*10-10
    });
  }

  let angle = 0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      ctx.beginPath();
      ctx.moveTo(p.x + p.tilt + p.r/2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.r);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.r/2;
      ctx.stroke();
    });
    update();
  }

  function update(){
    angle += 0.01;
    particles.forEach(p=>{
      p.y += (Math.cos(angle+p.d)+1+p.r/2)/2;
      p.x += Math.sin(angle);
      if(p.y>canvas.height){
        p.y=-10;
        p.x=Math.random()*canvas.width;
      }
    });
  }

  let confettiInterval = setInterval(draw,15);
  setTimeout(()=> clearInterval(confettiInterval),1500);
}
