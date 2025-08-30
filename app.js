
const GAME_CONFIG = {
    canvasWidth: 1000,
    canvasHeight: 700,
    gridSize: 40,
    initialResources: {
        wood: 200,
        stone: 100,
        gold: 75,
        population: 0,
        maxPopulation: 15
    },
    resourceGeneration: {
        wood: 3,
        stone: 2,
        gold: 1
    }
};

const STRUCTURES = {
    house: {
        name: "Casa",
        cost: {wood: 40},
        effect: {maxPopulation: 5},
        color: "#D2691E",
        upgradeCostMultiplier: 2.0,
        upgradable: true
    },
    woodCollector: {
        name: "Coletor Madeira", 
        cost: {wood: 25},
        effect: {woodRate: 2},
        color: "#32CD32",
        upgradeCostMultiplier: 2.0,
        upgradable: true
    },
    stoneQuarry: {
        name: "Pedreira",
        cost: {wood: 80, stone: 40},
        effect: {stoneRate: 2},
        color: "#708090",
        upgradeCostMultiplier: 2.0,
        upgradable: true
    },
    goldMine: {
        name: "Mina Ouro",
        cost: {wood: 120, stone: 80},
        effect: {goldRate: 1},
        color: "#FFD700",
        upgradeCostMultiplier: 2.0,
        upgradable: true
    },
    archerTower: {
        name: "Torre Arqueiro",
        cost: {wood: 60, stone: 20},
        effect: {damage: 30, range: 100, attackSpeed: 1},
        populationCost: 1,
        color: "#4169E1",
        upgradeCostMultiplier: 2.0,
        upgradable: true,
        isTower: true
    },
    mageTower: {
        name: "Torre Mago", 
        cost: {stone: 80, gold: 40},
        effect: {damage: 60, range: 140, attackSpeed: 1},
        populationCost: 1,
        color: "#9370DB",
        upgradeCostMultiplier: 2.0,
        upgradable: true,
        isTower: true
    },
    wall: {
        name: "Muro",
        cost: {wood: 20, stone: 8},
        effect: {blocking: true},
        color: "#696969",
        upgradable: false,
        isWall: true
    },
    defensePortal: {
        name: "Portal Defesa",
        cost: {wood: 150, stone: 100, gold: 75},
        effect: {damage: 120, range: 180, attackSpeed: 1},
        populationCost: 2,
        color: "#FF1493",
        upgradeCostMultiplier: 2.0,
        upgradable: true,
        isTower: true
    }
};

const ENEMY_TYPES = {
    basic: {
        name: "Básico",
        baseHp: 80,
        speed: 1,
        color: "#FF4500",
        reward: {wood: 2, stone: 1, gold: 1}
    },
    tank: {
        name: "Tanque",
        baseHp: 200,
        speed: 0.4,
        color: "#8B0000",
        unlockWave: 4,
        armor: 0.3, // 30% damage reduction
        reward: {wood: 4, stone: 3, gold: 2}
    },
    fast: {
        name: "Rápido", 
        baseHp: 50,
        speed: 2.5,
        color: "#FF69B4",
        unlockWave: 6,
        dodge: 0.2, // 20% chance to dodge
        reward: {wood: 3, stone: 2, gold: 3}
    },
    flying: {
        name: "Voador",
        baseHp: 70,
        speed: 1.5,
        color: "#87CEEB",
        unlockWave: 8,
        flying: true, // can't be hit by some towers
        reward: {wood: 3, stone: 2, gold: 4}
    },
    regenerating: {
        name: "Regenerador",
        baseHp: 100,
        speed: 0.8,
        color: "#32CD32",
        unlockWave: 10,
        regen: 2, // HP per second
        reward: {wood: 5, stone: 4, gold: 3}
    },
    splitter: {
        name: "Divisor",
        baseHp: 120,
        speed: 0.9,
        color: "#9370DB",
        unlockWave: 12,
        splits: true, // splits into smaller enemies
        reward: {wood: 6, stone: 5, gold: 4}
    },
    boss: {
        name: "Chefe",
        baseHp: 500,
        speed: 0.6,
        color: "#FF0000",
        unlockWave: 15,
        armor: 0.5,
        size: 2, // larger enemy
        reward: {wood: 20, stone: 15, gold: 25}
    }
};

const TUTORIAL_STEPS = [
    {
        title: "Bem-vindo ao Defesa da Base!",
        text: "Seu objetivo é construir e defender sua base contra ondas de inimigos. Use recursos para construir estruturas e sobreviver o máximo possível!",
        highlight: null
    },
    {
        title: "Recursos",
        text: "Você tem 3 recursos: Madeira (🪵), Pedra (🪨) e Ouro (🪙). Eles são gerados automaticamente e usados para construir estruturas. População limita suas defesas.",
        highlight: "resource-bar"
    },
    {
        title: "Primeira Construção",
        text: "Clique em um espaço vazio no campo para abrir o menu de construção. Construa uma Casa primeiro para aumentar sua população máxima!",
        highlight: "gameCanvas"
    },
    {
        title: "Coletores de Recursos", 
        text: "Construa Coletores de Madeira para gerar mais recursos. Quanto mais recursos você tiver, mais rápido poderá expandir sua base!",
        highlight: "build-menu"
    },
    {
        title: "Torres de Defesa",
        text: "Antes da primeira onda chegar, construa algumas Torres de Arqueiros para defender sua base. Elas atacam inimigos automaticamente!",
        highlight: "build-menu"
    },
    {
        title: "Sistema de Upgrades",
        text: "Clique em estruturas já construídas para melhorá-las! Upgrades aumentam a eficiência - torres ficam mais fortes, coletores produzem mais.",
        highlight: "gameCanvas"
    },
    {
        title: "Estratégia Final",
        text: "Equilibre recursos e defesas. Construa coletores para crescer economicamente, mas não esqueça das defesas! Boa sorte, comandante!"
    }
];

const ACHIEVEMENTS = [
    {id: "first_base", name: "Primeira Base", description: "Construir 5 estruturas", target: 5, unlocked: false},
    {id: "defender", name: "Defensor", description: "Sobreviver 10 ondas", target: 10, unlocked: false},
    {id: "architect", name: "Arquiteto", description: "Fazer 20 upgrades", target: 20, unlocked: false}, 
    {id: "survivor", name: "Sobrevivente", description: "Chegar à onda 20", target: 20, unlocked: false}
];


class GameState {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.resources = {...GAME_CONFIG.initialResources};
        this.structures = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.currentWave = 1;
        this.waveTimer = 45;
        this.enemiesRemaining = 0;
        this.enemiesKilled = 0;
        this.structuresBuilt = 0;
        this.upgradesMade = 0;
        this.livesLost = 0;
        this.maxLives = 5;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameSpeed = 1;
        this.selectedCell = null;
        this.selectedStructure = null;
        this.showBuildMenu = false;
        this.showUpgradeMenu = false;
        this.lastResourceUpdate = 0;
        this.lastWaveSpawn = 0;
        this.waveActive = false;
        this.gameStartTime = Date.now();
        this.totalResourcesCollected = 0;
        this.tutorialActive = false;
        this.tutorialStep = 0;
        this.achievements = [...ACHIEVEMENTS];
        this.resourceRates = {...GAME_CONFIG.resourceGeneration};
        this.specialAbilities = {
            airStrike: {cooldown: 60000, lastUsed: 0},
            repair: {cooldown: 45000, lastUsed: 0},
            freeze: {cooldown: 30000, lastUsed: 0}
        };
        this.research = {
            damage: {level: 0, maxLevel: 5, cost: 100},
            range: {level: 0, maxLevel: 5, cost: 120},
            economy: {level: 0, maxLevel: 5, cost: 80}
        };
        this.globalBonuses = {
            damageMultiplier: 1,
            rangeMultiplier: 1,
            resourceMultiplier: 1
        };
    }
}


let game;
let canvas;
let ctx;
let tutorialSystem;
let soundManager;


class SoundManager {
    constructor() {
        this.enabled = true;
        this.context = null;
        this.sounds = {};
        this.masterVolume = 0.3;
        

        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (e) {
            console.log('Web Audio API not supported');
            this.enabled = false;
        }
    }
    
    createSounds() {

        this.sounds.build = this.createTone(800, 0.1, 'square');
        this.sounds.upgrade = this.createTone([600, 800, 1000], 0.15, 'sine');
        this.sounds.shoot = this.createTone(400, 0.05, 'sawtooth');
        this.sounds.hit = this.createTone(200, 0.08, 'square');
        this.sounds.enemyDeath = this.createTone([300, 200, 100], 0.2, 'sawtooth');
        this.sounds.waveStart = this.createTone([440, 554, 659], 0.3, 'sine');
        this.sounds.abilityUse = this.createTone([800, 1200, 1600], 0.2, 'sine');
    }
    
    createTone(frequency, duration, type = 'sine') {
        return () => {
            if (!this.enabled || !this.context) return;
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.type = type;
            
            if (Array.isArray(frequency)) {
    
                frequency.forEach((freq, index) => {
                    setTimeout(() => {
                        if (oscillator.frequency) {
                            oscillator.frequency.setValueAtTime(freq, this.context.currentTime);
                        }
                    }, index * 50);
                });
                oscillator.frequency.setValueAtTime(frequency[0], this.context.currentTime);
            } else {
                oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
            }
            
            gainNode.gain.setValueAtTime(this.masterVolume, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + duration);
        };
    }
    
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }
    
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}


class Particle {
    constructor(x, y, color = '#FFD700', size = 3, vx = 0, vy = 0, life = 30, type = 'normal') {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.maxLife = life;
        this.type = type;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.alpha = 1;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        

        if (this.type === 'normal') {
            this.vy += 0.1;
        }
        

        this.alpha = this.life / this.maxLife;
        

        this.rotation += this.rotationSpeed;
        

        if (this.type === 'spark') {
            this.size = Math.max(0, this.size * 0.95);
        }
    }
    
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.type === 'star') {

            ctx.fillStyle = this.color;
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * Math.PI * 2) / 5;
                const x = Math.cos(angle) * this.size;
                const y = Math.sin(angle) * this.size;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        } else {

            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}


class TutorialSystem {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = document.getElementById('tutorialOverlay');
        this.title = document.getElementById('tutorialTitle');
        this.text = document.getElementById('tutorialText');
        this.stepSpan = document.getElementById('tutorialStep');
        this.totalSpan = document.getElementById('tutorialTotal');
        this.nextBtn = document.getElementById('tutorialNext');
        this.skipBtn = document.getElementById('tutorialSkip');
        this.highlight = document.getElementById('tutorialHighlight');
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.nextBtn.addEventListener('click', () => this.nextStep());
        this.skipBtn.addEventListener('click', () => this.skip());
    }
    
    start() {
        this.currentStep = 0;
        this.isActive = true;
        game.tutorialActive = true;
        this.showStep();
        this.overlay.classList.remove('hidden');
    }
    
    showStep() {
        const step = TUTORIAL_STEPS[this.currentStep];
        this.title.textContent = step.title;
        this.text.textContent = step.text;
        this.stepSpan.textContent = this.currentStep + 1;
        this.totalSpan.textContent = TUTORIAL_STEPS.length;
        
        this.nextBtn.textContent = this.currentStep === TUTORIAL_STEPS.length - 1 ? '✅ Finalizar' : '➡️ Próximo';
        
        this.highlightElement(step.highlight);
    }
    
    highlightElement(elementId) {
        this.highlight.style.display = 'none';
        
        if (!elementId) return;
        
        const element = document.getElementById(elementId);
        if (element) {
            const rect = element.getBoundingClientRect();
            this.highlight.style.display = 'block';
            this.highlight.style.left = rect.left + 'px';
            this.highlight.style.top = rect.top + 'px';
            this.highlight.style.width = rect.width + 'px';
            this.highlight.style.height = rect.height + 'px';
        }
    }
    
    nextStep() {
        if (this.currentStep < TUTORIAL_STEPS.length - 1) {
            this.currentStep++;
            this.showStep();
        } else {
            this.complete();
        }
    }
    
    skip() {
        this.complete();
    }
    
    complete() {
        this.isActive = false;
        game.tutorialActive = false;
        this.overlay.classList.add('hidden');
        this.highlight.style.display = 'none';
        
        if (!game.gameRunning) {
            startGame();
        }
    }
}


function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    game = new GameState();
    tutorialSystem = new TutorialSystem();
    soundManager = new SoundManager();
    
    setupEventListeners();
    updateUI();
    updateAchievements();
}

function setupEventListeners() {
    canvas.addEventListener('click', handleCanvasClick);
    document.addEventListener('keydown', handleKeyDown);
    

    document.getElementById('startTutorialBtn').addEventListener('click', () => {
        document.getElementById('mainMenu').classList.add('hidden');
        tutorialSystem.start();
    });
    
    document.getElementById('skipTutorialBtn').addEventListener('click', () => {
        document.getElementById('mainMenu').classList.add('hidden');
        startGame();
    });
    

    document.querySelectorAll('.build-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const structureType = e.target.closest('.build-btn').dataset.structure;
            buildStructure(structureType);
        });
    });
    

    document.getElementById('cancelBuildBtn').addEventListener('click', closeBuildMenu);
    

    document.getElementById('upgradeBtn').addEventListener('click', upgradeSelectedStructure);
    document.getElementById('cancelUpgradeBtn').addEventListener('click', closeUpgradeMenu);
    

    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.getElementById('speedBtn').addEventListener('click', toggleSpeed);
    document.getElementById('soundBtn').addEventListener('click', toggleSound);
    document.getElementById('tutorialBtn').addEventListener('click', () => tutorialSystem.start());
    

    document.getElementById('airStrikeBtn').addEventListener('click', () => useSpecialAbility('airStrike'));
    document.getElementById('repairBtn').addEventListener('click', () => useSpecialAbility('repair'));
    document.getElementById('freezeBtn').addEventListener('click', () => useSpecialAbility('freeze'));
    

    document.getElementById('research-damage').addEventListener('click', () => purchaseResearch('damage'));
    document.getElementById('research-range').addEventListener('click', () => purchaseResearch('range'));
    document.getElementById('research-economy').addEventListener('click', () => purchaseResearch('economy'));
    

    document.getElementById('resumeBtn').addEventListener('click', resumeGame);
    document.getElementById('pauseTutorialBtn').addEventListener('click', () => tutorialSystem.start());
    document.getElementById('restartBtn').addEventListener('click', restartGame);
    

    document.getElementById('gameOverRestartBtn').addEventListener('click', restartGame);
}

function handleCanvasClick(e) {
    if (game.tutorialActive) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const gridX = Math.floor(x / GAME_CONFIG.gridSize);
    const gridY = Math.floor(y / GAME_CONFIG.gridSize);
    
    if (gridX < 0 || gridX >= 25 || gridY < 0 || gridY >= 17) return;
    

    closeBuildMenu();
    closeUpgradeMenu();
    

    const existingStructure = game.structures.find(s => s.gridX === gridX && s.gridY === gridY);
    
    if (existingStructure && STRUCTURES[existingStructure.type].upgradable) {
        showUpgradeMenu(existingStructure);
        return;
    }
    

    if (!existingStructure) {
        game.selectedCell = {x: gridX, y: gridY};
        showBuildMenu();
    }
}

function handleKeyDown(e) {
    if (e.code === 'Escape') {
        closeBuildMenu();
        closeUpgradeMenu();
        if (game.tutorialActive) {
            tutorialSystem.skip();
        }
    } else if (e.code === 'Space') {
        e.preventDefault();
        if (!game.tutorialActive) {
            togglePause();
        }
    }
}

function showBuildMenu() {
    const menu = document.getElementById('buildMenu');
    menu.classList.remove('hidden');
    game.showBuildMenu = true;
    

    document.querySelectorAll('.build-btn').forEach(btn => {
        const structureType = btn.dataset.structure;
        const structure = STRUCTURES[structureType];
        const canAfford = canAffordStructure(structure);
        const hasPopulation = !structure.populationCost || 
            (game.resources.population + structure.populationCost <= game.resources.maxPopulation);
        
        btn.disabled = !canAfford || !hasPopulation;
        
        if (!canAfford) {
            btn.style.opacity = '0.5';
        } else if (!hasPopulation) {
            btn.style.opacity = '0.7';
            btn.style.borderColor = 'orange';
        } else {
            btn.style.opacity = '1';
            btn.style.borderColor = '';
        }
    });
}

function closeBuildMenu() {
    document.getElementById('buildMenu').classList.add('hidden');
    game.showBuildMenu = false;
    game.selectedCell = null;
}

function showUpgradeMenu(structure) {
    game.selectedStructure = structure;
    const menu = document.getElementById('upgradeMenu');
    const structureData = STRUCTURES[structure.type];
    
    document.getElementById('upgradeTitle').textContent = `🔧 ${structureData.name}`;
    document.getElementById('upgradeInfo').textContent = `Nível atual: ${structure.level}`;
    

    const statsDiv = document.getElementById('upgradeStats');
    let statsText = '';
    if (structure.damage) statsText += `⚔️ Dano: ${Math.floor(structure.damage)} `;
    if (structure.range) statsText += `🎯 Alcance: ${Math.floor(structure.range)} `;
    if (structure.woodRate) statsText += `🪵 +${structure.woodRate}/s `;
    if (structure.stoneRate) statsText += `🪨 +${structure.stoneRate}/s `;
    if (structure.goldRate) statsText += `🪙 +${structure.goldRate}/s `;
    if (structure.maxPopulation) statsText += `👥 +${structure.maxPopulation} `;
    
    statsDiv.textContent = statsText;
    
    if (structure.level < 5) {
        const upgradeCost = calculateUpgradeCost(structure);
        const costText = Object.entries(upgradeCost)
            .map(([resource, amount]) => {
                const icon = resource === 'wood' ? '🪵' : resource === 'stone' ? '🪨' : '🪙';
                return `${icon} ${amount}`;
            })
            .join(' ');
            
        document.getElementById('upgradeBtn').textContent = `⬆️ Melhorar - ${costText}`;
        document.getElementById('upgradeBtn').disabled = !canAffordUpgrade(structure);
        document.getElementById('upgradeBtn').style.display = 'block';
    } else {
        document.getElementById('upgradeBtn').style.display = 'none';
        statsDiv.innerHTML += '<br><strong>🌟 Nível Máximo!</strong>';
    }
    
    menu.classList.remove('hidden');
    game.showUpgradeMenu = true;
}

function closeUpgradeMenu() {
    document.getElementById('upgradeMenu').classList.add('hidden');
    game.showUpgradeMenu = false;
    game.selectedStructure = null;
}

function canAffordStructure(structure) {
    return Object.entries(structure.cost).every(([resource, amount]) => 
        game.resources[resource] >= amount
    );
}

function canAffordUpgrade(structure) {
    if (structure.level >= 5) return false;
    const upgradeCost = calculateUpgradeCost(structure);
    return Object.entries(upgradeCost).every(([resource, amount]) => 
        game.resources[resource] >= amount
    );
}

function calculateUpgradeCost(structure) {
    const baseCost = STRUCTURES[structure.type].cost;
    const multiplier = Math.pow(STRUCTURES[structure.type].upgradeCostMultiplier, structure.level);
    const upgradeCost = {};
    
    Object.entries(baseCost).forEach(([resource, amount]) => {
        upgradeCost[resource] = Math.floor(amount * multiplier);
    });
    
    return upgradeCost;
}

function buildStructure(structureType) {
    const structure = STRUCTURES[structureType];
    const cell = game.selectedCell;
    
    if (!canAffordStructure(structure)) return;
    

    if (structure.populationCost && 
        game.resources.population + structure.populationCost > game.resources.maxPopulation) {
        return;
    }
    

    const occupied = game.structures.some(s => s.gridX === cell.x && s.gridY === cell.y);
    if (occupied) return;
    
    Object.entries(structure.cost).forEach(([resource, amount]) => {
        game.resources[resource] -= amount;
    });
    

    if (structure.populationCost) {
        game.resources.population += structure.populationCost;
    }
    

    const newStructure = {
        type: structureType,
        gridX: cell.x,
        gridY: cell.y,
        x: cell.x * GAME_CONFIG.gridSize + GAME_CONFIG.gridSize / 2,
        y: cell.y * GAME_CONFIG.gridSize + GAME_CONFIG.gridSize / 2,
        level: 1,
        lastAttack: 0
    };
    

    Object.entries(structure.effect).forEach(([key, value]) => {
        if (typeof value === 'number') {
            newStructure[key] = value;

            if (STRUCTURES[structureType].isTower) {
                if (key === 'damage') {
                    newStructure[key] = value * game.globalBonuses.damageMultiplier;
                } else if (key === 'range') {
                    newStructure[key] = value * game.globalBonuses.rangeMultiplier;
                }
            }
        } else {
            newStructure[key] = value;
        }
    });
    
    game.structures.push(newStructure);
    game.structuresBuilt++;
    

    soundManager.play('build');
    

    createBuildParticles(newStructure.x, newStructure.y);
    

    applyStructureEffects();
    updateResourceRates();
    
    closeBuildMenu();
    updateUI();
    checkAchievements();
}

function upgradeSelectedStructure() {
    const structure = game.selectedStructure;
    if (!structure || structure.level >= 5) return;
    
    const upgradeCost = calculateUpgradeCost(structure);
    if (!canAffordUpgrade(structure)) return;
    
    Object.entries(upgradeCost).forEach(([resource, amount]) => {
        game.resources[resource] -= amount;
    });
    

    structure.level++;
    game.upgradesMade++;
    

    soundManager.play('upgrade');
    

    const baseStructure = STRUCTURES[structure.type];
    Object.entries(baseStructure.effect).forEach(([effect, value]) => {
        if (typeof value === 'number') {
            if (effect === 'damage' || effect === 'range' || effect === 'attackSpeed') {

                structure[effect] = value * (1 + (structure.level - 1) * 0.5);
                if (effect === 'range') structure[effect] = value * (1 + (structure.level - 1) * 0.25);
                if (effect === 'attackSpeed') structure[effect] = value * (1 + (structure.level - 1) * 0.25);
            } else if (effect.includes('Rate')) {

                structure[effect] = value * Math.pow(2, structure.level - 1);
            } else {
                structure[effect] = value * structure.level;
            }
        }
    });
    

    createUpgradeParticles(structure.x, structure.y);
    
    applyStructureEffects();
    updateResourceRates();
    closeUpgradeMenu();
    updateUI();
    checkAchievements();
}

function createBuildParticles(x, y) {
    for (let i = 0; i < 20; i++) {
        const particle = new Particle(
            x + (Math.random() - 0.5) * 40,
            y + (Math.random() - 0.5) * 40,
            i % 3 === 0 ? '#32CD32' : '#90EE90',
            Math.random() * 4 + 2,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            30 + Math.random() * 20,
            i % 4 === 0 ? 'star' : 'normal'
        );
        game.particles.push(particle);
    }
}

function createUpgradeParticles(x, y) {
    for (let i = 0; i < 25; i++) {
        const particle = new Particle(
            x + (Math.random() - 0.5) * 50,
            y + (Math.random() - 0.5) * 50,
            i % 2 === 0 ? '#FFD700' : '#FFA500',
            Math.random() * 5 + 3,
            (Math.random() - 0.5) * 8,
            -Math.random() * 4,
            40 + Math.random() * 20,
            'star'
        );
        game.particles.push(particle);
    }
}

function applyStructureEffects() {

    game.resources.maxPopulation = GAME_CONFIG.initialResources.maxPopulation;
    

    game.structures.forEach(structure => {
        if (structure.maxPopulation) {
            game.resources.maxPopulation += structure.maxPopulation;
        }
    });
}

function updateResourceRates() {

    game.resourceRates = {...GAME_CONFIG.resourceGeneration};
    

    game.structures.forEach(structure => {
        if (structure.woodRate) game.resourceRates.wood += structure.woodRate;
        if (structure.stoneRate) game.resourceRates.stone += structure.stoneRate;
        if (structure.goldRate) game.resourceRates.gold += structure.goldRate;
    });
    

    game.resourceRates.wood = Math.floor(game.resourceRates.wood * game.globalBonuses.resourceMultiplier);
    game.resourceRates.stone = Math.floor(game.resourceRates.stone * game.globalBonuses.resourceMultiplier);
    game.resourceRates.gold = Math.floor(game.resourceRates.gold * game.globalBonuses.resourceMultiplier);
}

function updateResources(deltaTime) {
    if (game.tutorialActive) return;
    
    const dt = deltaTime / 1000; // Convert to seconds
    

    const woodGain = game.resourceRates.wood * dt * game.gameSpeed;
    const stoneGain = game.resourceRates.stone * dt * game.gameSpeed;
    const goldGain = game.resourceRates.gold * dt * game.gameSpeed;
    
    game.resources.wood += woodGain;
    game.resources.stone += stoneGain;
    game.resources.gold += goldGain;
    
    game.totalResourcesCollected += woodGain + stoneGain + goldGain;
    

    game.resources.wood = Math.floor(game.resources.wood);
    game.resources.stone = Math.floor(game.resources.stone);
    game.resources.gold = Math.floor(game.resources.gold);
}

function updateWaves(deltaTime) {
    if (!game.gameRunning || game.gamePaused || game.tutorialActive) return;
    
    const dt = deltaTime / 1000 * game.gameSpeed;
    
    if (!game.waveActive && game.enemies.length === 0) {
        game.waveTimer -= dt;
        
        if (game.waveTimer <= 0) {
            startWave();
        }
    }
    

    if (game.waveActive && game.enemies.length === 0 && game.enemiesRemaining <= 0) {
        endWave();
    }
}

function startWave() {
    game.waveActive = true;
    game.waveTimer = 45; // Increased time between waves
    

    soundManager.play('waveStart');
    

    const baseEnemies = 5;
    const enemyCount = Math.floor(baseEnemies * Math.pow(1.4, game.currentWave - 1));
    game.enemiesRemaining = enemyCount;
    

    let spawnedCount = 0;
    const spawnDelay = 1000; // milliseconds between spawns
    
    function spawnNext() {
        if (spawnedCount >= enemyCount || !game.gameRunning) {
            return;
        }
        
        spawnEnemy();
        spawnedCount++;
        
        if (spawnedCount < enemyCount) {
            setTimeout(spawnNext, spawnDelay / game.gameSpeed);
        }
    }
    
    spawnNext();
}

function spawnEnemy() {
    let enemyType = 'basic';
    const rand = Math.random();
    

    if (game.currentWave >= 15 && rand < 0.15) {
        enemyType = 'boss';
    } else if (game.currentWave >= 12 && rand < 0.2) {
        enemyType = 'splitter';
    } else if (game.currentWave >= 10 && rand < 0.25) {
        enemyType = 'regenerating';
    } else if (game.currentWave >= 8 && rand < 0.3) {
        enemyType = 'flying';
    } else if (game.currentWave >= 6 && rand < 0.35) {
        enemyType = 'fast';
    } else if (game.currentWave >= 4 && rand < 0.4) {
        enemyType = 'tank';
    }
    
    const enemyData = ENEMY_TYPES[enemyType];
    const hp = Math.floor(enemyData.baseHp * Math.pow(1.15, game.currentWave - 1));
    
    const enemy = {
        id: Date.now() + Math.random(),
        type: enemyType,
        x: -30,
        y: Math.random() * (canvas.height - 200) + 100,
        hp: hp,
        maxHp: hp,
        speed: enemyData.speed,
        color: enemyData.color,
        lastDamageTime: 0,
        frozen: false,
        frozenTime: 0,
        size: enemyData.size || 1,
        lastRegenTime: 0
    };
    

    if (enemyData.armor) enemy.armor = enemyData.armor;
    if (enemyData.dodge) enemy.dodge = enemyData.dodge;
    if (enemyData.flying) enemy.flying = enemyData.flying;
    if (enemyData.regen) enemy.regen = enemyData.regen;
    if (enemyData.splits) enemy.splits = enemyData.splits;
    
    game.enemies.push(enemy);
}

function endWave() {
    game.waveActive = false;
    game.currentWave++;
    game.waveTimer = 45;
    
    checkAchievements();
}

function updateEnemies(deltaTime) {
    if (game.tutorialActive) return;
    
    const dt = deltaTime / 1000 * game.gameSpeed;
    
    for (let i = game.enemies.length - 1; i >= 0; i--) {
        const enemy = game.enemies[i];
        

        if (enemy.frozen) {
            enemy.frozenTime -= dt;
            if (enemy.frozenTime <= 0) {
                enemy.frozen = false;
            } else {

            }
        }
        

        if (enemy.regen && Date.now() - enemy.lastRegenTime > 1000) {
            enemy.hp = Math.min(enemy.hp + enemy.regen, enemy.maxHp);
            enemy.lastRegenTime = Date.now();
            

            const particle = new Particle(
                enemy.x + (Math.random() - 0.5) * 20,
                enemy.y - Math.random() * 20,
                '#32CD32',
                2,
                0,
                -1,
                20
            );
            game.particles.push(particle);
        }
        

        if (enemy.hp <= 0) {

            if (enemy.splits && enemy.type === 'splitter') {
        
                for (let j = 0; j < 2; j++) {
                    const smallEnemy = {
                        id: Date.now() + Math.random() + j,
                        type: 'basic',
                        x: enemy.x + (j === 0 ? -20 : 20),
                        y: enemy.y + (Math.random() - 0.5) * 40,
                        hp: Math.floor(enemy.maxHp * 0.3),
                        maxHp: Math.floor(enemy.maxHp * 0.3),
                        speed: ENEMY_TYPES.basic.speed * 1.2,
                        color: '#FFA500',
                        lastDamageTime: 0,
                        size: 0.7
                    };
                    game.enemies.push(smallEnemy);
                    game.enemiesRemaining++;
                }
            }
            

            const reward = ENEMY_TYPES[enemy.type]?.reward;
            if (reward) {
                Object.entries(reward).forEach(([resource, amount]) => {
                    game.resources[resource] += amount;

                    const particle = new Particle(
                        enemy.x,
                        enemy.y - 10,
                        resource === 'wood' ? '#8B4513' : resource === 'stone' ? '#708090' : '#FFD700',
                        3,
                        (Math.random() - 0.5) * 2,
                        -2,
                        30
                    );
                    game.particles.push(particle);
                });
                game.totalResourcesCollected += Object.values(reward).reduce((sum, val) => sum + val, 0);
            }
            
            createDeathParticles(enemy.x, enemy.y);
            game.enemies.splice(i, 1);
            game.enemiesKilled++;
            game.enemiesRemaining--;
            

            soundManager.play('enemyDeath');
            continue;
        }
        

        const baseSpeed = enemy.speed * 60 * dt;
        let moveX = baseSpeed;
        let moveY = 0;
        
        const futureX = enemy.x + moveX;
        const futureY = enemy.y + moveY;
        

        const wallInPath = game.structures.find(structure => 
            STRUCTURES[structure.type].isWall &&
            Math.abs(structure.x - futureX) < 30 &&
            Math.abs(structure.y - futureY) < 30
        );
        
        if (wallInPath) {

            const avoidY = (enemy.y < wallInPath.y) ? -baseSpeed * 0.5 : baseSpeed * 0.5;
            moveY = avoidY;
            moveX = baseSpeed * 0.7; // Slow down when avoiding
        }
        
        enemy.x += moveX;
        enemy.y += moveY;
        

        enemy.y = Math.max(50, Math.min(canvas.height - 50, enemy.y));
        

        if (enemy.x > canvas.width + 30) {
            game.enemies.splice(i, 1);
            game.livesLost++;
            game.enemiesRemaining--;
            
            if (game.livesLost >= game.maxLives) {
                gameOver();
                return;
            }
        }
    }
}

function createDeathParticles(x, y) {
    for (let i = 0; i < 15; i++) {
        const colors = ['#FF4500', '#FF6347', '#FFD700', '#FF8C00'];
        const particle = new Particle(
            x + (Math.random() - 0.5) * 30,
            y + (Math.random() - 0.5) * 30,
            colors[Math.floor(Math.random() * colors.length)],
            Math.random() * 4 + 2,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            25 + Math.random() * 15,
            i % 3 === 0 ? 'spark' : 'normal'
        );
        game.particles.push(particle);
    }
}

function updateTowers(deltaTime) {
    if (game.tutorialActive) return;
    
    const dt = deltaTime / 1000 * game.gameSpeed;
    
    game.structures.forEach(structure => {
        if (!STRUCTURES[structure.type].isTower) return;
        

        let nearestEnemy = null;
        let nearestDistance = Infinity;
        
        game.enemies.forEach(enemy => {

            if (enemy.frozen) return;
            

            if (enemy.flying && structure.type === 'archerTower') return;
            
            const distance = Math.sqrt(
                Math.pow(enemy.x - structure.x, 2) + 
                Math.pow(enemy.y - structure.y, 2)
            );
            
            if (distance < (structure.range || 100) && distance < nearestDistance) {
                nearestEnemy = enemy;
                nearestDistance = distance;
            }
        });
        

        const attackCooldown = 1000 / (structure.attackSpeed || 1);
        if (nearestEnemy && Date.now() - structure.lastAttack > attackCooldown) {
            structure.lastAttack = Date.now();
            

            soundManager.play('shoot');
            

            let projectileType = 'normal';
            if (structure.type === 'mageTower') {
                projectileType = 'magic';
            } else if (structure.type === 'defensePortal') {
                projectileType = 'energy';
            }
            

            const projectile = {
                x: structure.x,
                y: structure.y,
                targetX: nearestEnemy.x,
                targetY: nearestEnemy.y,
                damage: structure.damage || 30,
                speed: 600,
                targetId: nearestEnemy.id,
                trail: [],
                type: projectileType
            };
            
            game.projectiles.push(projectile);
        }
    });
}

function updateProjectiles(deltaTime) {
    if (game.tutorialActive) return;
    
    const dt = deltaTime / 1000 * game.gameSpeed;
    
    for (let i = game.projectiles.length - 1; i >= 0; i--) {
        const projectile = game.projectiles[i];
        

        projectile.trail.push({x: projectile.x, y: projectile.y});
        if (projectile.trail.length > 5) projectile.trail.shift();
        

        const dx = projectile.targetX - projectile.x;
        const dy = projectile.targetY - projectile.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 20) {
            const targetEnemy = game.enemies.find(enemy => enemy.id === projectile.targetId);
            if (targetEnemy && targetEnemy.hp > 0) {
                let actualDamage = projectile.damage;
                
                if (targetEnemy.armor) {
                    actualDamage = actualDamage * (1 - targetEnemy.armor);
                }
                
                if (targetEnemy.dodge && Math.random() < targetEnemy.dodge) {
                    createDodgeParticles(projectile.x, projectile.y);
                } else {
                    targetEnemy.hp -= actualDamage;
                    targetEnemy.lastDamageTime = Date.now();
                    if (targetEnemy.hp < 0) targetEnemy.hp = 0;
                    
                    soundManager.play('hit');
                    
                    if (projectile.type === 'magic') {
                        if (Math.random() < 0.3) {
                            targetEnemy.frozen = true;
                            targetEnemy.frozenTime = 2;
                        }
                    }
                    
                    createHitParticles(projectile.x, projectile.y, projectile.type);
                }
            }
            game.projectiles.splice(i, 1);
        } else if (distance > 1000) {
            game.projectiles.splice(i, 1);
        } else {
            const moveDistance = projectile.speed * dt;
            const normalizedDx = dx / distance;
            const normalizedDy = dy / distance;
            projectile.x += normalizedDx * moveDistance;
            projectile.y += normalizedDy * moveDistance;
        }
    }
}

function createHitParticles(x, y, type = 'normal') {
    const particleCount = type === 'energy' ? 8 : 5;
    const colors = {
        'normal': '#FFFF00',
        'magic': '#9370DB',
        'energy': '#FF1493'
    };
    
    for (let i = 0; i < particleCount; i++) {
        const particle = new Particle(
            x + (Math.random() - 0.5) * 10,
            y + (Math.random() - 0.5) * 10,
            colors[type] || colors.normal,
            Math.random() * 2 + 1,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            10 + Math.random() * 10
        );
        game.particles.push(particle);
    }
}

function createDodgeParticles(x, y) {
    for (let i = 0; i < 3; i++) {
        const particle = new Particle(
            x + (Math.random() - 0.5) * 20,
            y + (Math.random() - 0.5) * 20,
            '#87CEEB',
            Math.random() * 3 + 2,
            (Math.random() - 0.5) * 6,
            -Math.random() * 3,
            15 + Math.random() * 10
        );
        game.particles.push(particle);
    }
}

function updateParticles(deltaTime) {
    for (let i = game.particles.length - 1; i >= 0; i--) {
        const particle = game.particles[i];
        particle.update();
        
        if (particle.life <= 0) {
            game.particles.splice(i, 1);
        }
    }
}

function render() {

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#2D5A27');
    gradient.addColorStop(1, '#1B4A1F');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += GAME_CONFIG.gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += GAME_CONFIG.gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    

    if (game.selectedCell) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.fillRect(
            game.selectedCell.x * GAME_CONFIG.gridSize,
            game.selectedCell.y * GAME_CONFIG.gridSize,
            GAME_CONFIG.gridSize,
            GAME_CONFIG.gridSize
        );
        ctx.strokeRect(
            game.selectedCell.x * GAME_CONFIG.gridSize,
            game.selectedCell.y * GAME_CONFIG.gridSize,
            GAME_CONFIG.gridSize,
            GAME_CONFIG.gridSize
        );
    }
    

    game.structures.forEach(structure => {
        const structureData = STRUCTURES[structure.type];
        

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        const size = GAME_CONFIG.gridSize - 4;
        ctx.fillRect(
            structure.gridX * GAME_CONFIG.gridSize + 4,
            structure.gridY * GAME_CONFIG.gridSize + 4,
            size,
            size
        );
        

        ctx.fillStyle = structureData.color;
        ctx.fillRect(
            structure.gridX * GAME_CONFIG.gridSize + 2,
            structure.gridY * GAME_CONFIG.gridSize + 2,
            size,
            size
        );
        

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            structure.gridX * GAME_CONFIG.gridSize + 2,
            structure.gridY * GAME_CONFIG.gridSize + 2,
            size,
            size
        );
        

        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            structureData.name.split(' ')[0],
            structure.x,
            structure.y + 3
        );
        

        if (structure.level > 1) {
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 12px Arial';
            ctx.fillText(
                `L${structure.level}`,
                structure.x,
                structure.y - 15
            );
        }
        

        if (structureData.isTower && game.selectedStructure === structure) {
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(structure.x, structure.y, structure.range || 100, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    });
    

    game.enemies.forEach(enemy => {
        const enemyData = ENEMY_TYPES[enemy.type];
        const radius = 15 * (enemy.size || 1);
        

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(enemy.x + 2, enemy.y + 2, radius - 2, (radius - 2) * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        

        if (enemy.frozen) {
            ctx.fillStyle = 'rgba(173, 216, 230, 0.7)';
            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y, radius + 5, 0, Math.PI * 2);
            ctx.fill();
        }
        

        const isDamaged = Date.now() - enemy.lastDamageTime < 200;
        ctx.fillStyle = isDamaged ? '#FFFFFF' : enemyData.color;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        

        if (enemy.flying) {

            ctx.fillStyle = 'rgba(135, 206, 235, 0.5)';
            ctx.beginPath();
            ctx.ellipse(enemy.x - 8, enemy.y - 5, 6, 3, -0.3, 0, Math.PI * 2);
            ctx.ellipse(enemy.x + 8, enemy.y - 5, 6, 3, 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
        

        ctx.fillStyle = isDamaged ? '#FFFFFF' : enemyData.color;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        

        if (enemy.armor) {

            ctx.fillStyle = '#C0C0C0';
            ctx.beginPath();
            ctx.arc(enemy.x - radius/2, enemy.y - radius/2, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        if (enemy.regen) {

            ctx.fillStyle = '#32CD32';
            ctx.fillText('♥', enemy.x + radius/2, enemy.y - radius/2 + 3);
        }
        

        const barWidth = 30 * (enemy.size || 1);
        const barHeight = 6;
        const healthPercent = enemy.hp / enemy.maxHp;
        

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(enemy.x - barWidth/2, enemy.y - (radius + 15), barWidth, barHeight);
        

        const healthColor = healthPercent > 0.6 ? '#4CAF50' : 
                           healthPercent > 0.3 ? '#FF9800' : '#F44336';
        ctx.fillStyle = healthColor;
        ctx.fillRect(enemy.x - barWidth/2, enemy.y - (radius + 15), barWidth * healthPercent, barHeight);
        

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.strokeRect(enemy.x - barWidth/2, enemy.y - (radius + 15), barWidth, barHeight);
    });
    

    game.projectiles.forEach(projectile => {

        if (projectile.trail && projectile.trail.length > 1) {
            const trailColors = {
                'normal': 'rgba(255, 215, 0, 0.5)',
                'magic': 'rgba(147, 112, 219, 0.5)',
                'energy': 'rgba(255, 20, 147, 0.5)'
            };
            
            ctx.strokeStyle = trailColors[projectile.type] || trailColors.normal;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(projectile.trail[0].x, projectile.trail[0].y);
            for (let i = 1; i < projectile.trail.length; i++) {
                ctx.lineTo(projectile.trail[i].x, projectile.trail[i].y);
            }
            ctx.stroke();
        }
        

        const projectileColors = {
            'normal': {fill: '#FFD700', stroke: '#FFA500'},
            'magic': {fill: '#9370DB', stroke: '#8A2BE2'},
            'energy': {fill: '#FF1493', stroke: '#DC143C'}
        };
        
        const colors = projectileColors[projectile.type] || projectileColors.normal;
        
        ctx.fillStyle = colors.fill;
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        if (projectile.type === 'energy') {

            const size = 6;
            ctx.moveTo(projectile.x, projectile.y - size);
            ctx.lineTo(projectile.x + size, projectile.y);
            ctx.lineTo(projectile.x, projectile.y + size);
            ctx.lineTo(projectile.x - size, projectile.y);
            ctx.closePath();
        } else {

            ctx.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2);
        }
        
        ctx.fill();
        ctx.stroke();
    });
    

    game.particles.forEach(particle => {
        particle.render(ctx);
    });
}

function updateUI() {

    updateResourceDisplay('wood-count', game.resources.wood);
    updateResourceDisplay('stone-count', game.resources.stone);
    updateResourceDisplay('gold-count', game.resources.gold);
    
    document.getElementById('population-count').textContent = game.resources.population;
    document.getElementById('max-population-count').textContent = game.resources.maxPopulation;
    

    document.getElementById('wood-rate').textContent = `+${game.resourceRates.wood}/s`;
    document.getElementById('stone-rate').textContent = `+${game.resourceRates.stone}/s`;
    document.getElementById('gold-rate').textContent = `+${game.resourceRates.gold}/s`;
    

    document.getElementById('current-wave').textContent = game.currentWave;
    document.getElementById('timer-seconds').textContent = Math.ceil(Math.max(0, game.waveTimer));
    document.getElementById('enemies-remaining').textContent = Math.max(0, game.enemiesRemaining);
    document.getElementById('lives-remaining').textContent = game.maxLives - game.livesLost;
    

    const progressPercent = game.waveActive ? 
        ((game.enemiesRemaining > 0 ? (game.enemies.length / game.enemiesRemaining) * 100 : 100)) :
        ((45 - game.waveTimer) / 45) * 100;
    document.getElementById('wave-progress-fill').style.width = `${Math.max(0, progressPercent)}%`;
    

    const difficultyElement = document.getElementById('wave-difficulty');
    if (game.currentWave <= 5) {
        difficultyElement.textContent = 'Fácil';
        difficultyElement.className = 'wave-difficulty easy';
    } else if (game.currentWave <= 15) {
        difficultyElement.textContent = 'Médio';
        difficultyElement.className = 'wave-difficulty medium';
    } else {
        difficultyElement.textContent = 'Difícil';
        difficultyElement.className = 'wave-difficulty hard';
    }
    

    document.getElementById('enemies-killed').textContent = game.enemiesKilled;
    document.getElementById('structures-built').textContent = game.structuresBuilt;
    document.getElementById('upgrades-made').textContent = game.upgradesMade;
    

    document.getElementById('pauseBtn').innerHTML = game.gamePaused ? '▶️ Continuar' : '⏸️ Pausar';
    document.getElementById('speedBtn').innerHTML = `⚡ ${game.gameSpeed}x`;
    

    updateSpecialAbilityUI();
    updateResearchUI();
}

function updateResourceDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    const currentValue = parseInt(element.textContent);
    
    if (value !== currentValue) {
        element.textContent = Math.floor(value);
        element.parentElement.parentElement.classList.add('resource-update');
        setTimeout(() => {
            element.parentElement.parentElement.classList.remove('resource-update');
        }, 300);
    }
}

function checkAchievements() {
    game.achievements.forEach(achievement => {
        if (achievement.unlocked) return;
        
        let current = 0;
        switch (achievement.id) {
            case 'first_base':
                current = game.structuresBuilt;
                break;
            case 'defender':
                current = game.currentWave - 1;
                break;
            case 'architect':
                current = game.upgradesMade;
                break;
            case 'survivor':
                current = game.currentWave - 1;
                break;
        }
        
        if (current >= achievement.target) {
            achievement.unlocked = true;
            showAchievementNotification(achievement);
        }
    });
    
    updateAchievements();
}

function updateAchievements() {
    const list = document.getElementById('achievements-list');
    list.innerHTML = '';
    
    game.achievements.forEach(achievement => {
        const item = document.createElement('div');
        item.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;
        
        item.innerHTML = `
            <div class="achievement-icon">${achievement.unlocked ? '🏆' : '🔒'}</div>
            <div class="achievement-text">
                <div style="font-weight: bold; font-size: 11px;">${achievement.name}</div>
                <div style="font-size: 10px; opacity: 0.8;">${achievement.description}</div>
            </div>
        `;
        
        list.appendChild(item);
    });
}

function showAchievementNotification(achievement) {
    const notification = document.getElementById('achievementNotification');
    notification.querySelector('.achievement-title').textContent = 'Conquista Desbloqueada!';
    notification.querySelector('.achievement-description').textContent = achievement.name;
    
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

function togglePause() {
    if (game.tutorialActive) return;
    
    if (game.gamePaused) {
        resumeGame();
    } else {
        game.gamePaused = true;
        document.getElementById('pauseMenu').classList.remove('hidden');
        updatePauseStats();
    }
    updateUI();
}

function resumeGame() {
    game.gamePaused = false;
    document.getElementById('pauseMenu').classList.add('hidden');
    updateUI();
}

function updatePauseStats() {
    const playTime = Math.floor((Date.now() - game.gameStartTime) / 1000);
    const minutes = Math.floor(playTime / 60);
    const seconds = playTime % 60;
    
    document.getElementById('pause-wave').textContent = game.currentWave;
    document.getElementById('pause-time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('pause-resources').textContent = Math.floor(game.totalResourcesCollected);
    document.getElementById('pause-defenses').textContent = game.structures.filter(s => STRUCTURES[s.type].isTower).length;
}

function toggleSpeed() {
    if (game.tutorialActive) return;
    game.gameSpeed = game.gameSpeed === 1 ? 2 : game.gameSpeed === 2 ? 3 : 1;
    updateUI();
}

function toggleSound() {
    const enabled = soundManager.toggle();
    document.getElementById('soundBtn').innerHTML = enabled ? '🔊 Som' : '🔇 Som';
}

function startGame() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('pauseMenu').classList.add('hidden');
    game.gameRunning = true;
    game.gameStartTime = Date.now();
    gameLoop();
}

function gameOver() {
    game.gameRunning = false;
    
    document.getElementById('final-wave').textContent = game.currentWave;
    document.getElementById('final-enemies-killed').textContent = game.enemiesKilled;
    document.getElementById('final-structures-built').textContent = game.structuresBuilt;
    document.getElementById('final-upgrades').textContent = game.upgradesMade;
    

    const message = game.currentWave >= 20 ? 'Incrível! Você é um verdadeiro estrategista!' :
                   game.currentWave >= 15 ? 'Excelente defesa! Você dominou o jogo!' :
                   game.currentWave >= 10 ? 'Boa tentativa! Você está melhorando!' :
                   'Continue praticando para melhorar suas defesas!';
    
    document.getElementById('final-message').textContent = message;
    
    document.getElementById('gameOverMenu').classList.remove('hidden');
}

function restartGame() {
    document.getElementById('gameOverMenu').classList.add('hidden');
    document.getElementById('pauseMenu').classList.add('hidden');
    game.reset();
    updateUI();
    updateAchievements();
    

    document.getElementById('mainMenu').classList.remove('hidden');
}


function useSpecialAbility(abilityName) {
    if (game.tutorialActive || game.gamePaused) return;
    
    const ability = game.specialAbilities[abilityName];
    const now = Date.now();
    

    if (now - ability.lastUsed < ability.cooldown) {

    }
    

    ability.lastUsed = now;
    

    soundManager.play('abilityUse');
    
    switch (abilityName) {
        case 'airStrike':
            executeAirStrike();
            break;
        case 'repair':
            executeRepairAll();
            break;
        case 'freeze':
            executeFreezeEnemies();
            break;
    }
    
    updateSpecialAbilityUI();
}

function executeAirStrike() {

    const damage = 80;
    let hitCount = 0;
    
    game.enemies.forEach(enemy => {
        enemy.hp -= damage;
        enemy.lastDamageTime = Date.now();
        if (enemy.hp < 0) enemy.hp = 0;
        hitCount++;
        

        for (let i = 0; i < 8; i++) {
            const particle = new Particle(
                enemy.x + (Math.random() - 0.5) * 40,
                enemy.y + (Math.random() - 0.5) * 40,
                '#FF4500',
                Math.random() * 4 + 3,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                25 + Math.random() * 15
            );
            game.particles.push(particle);
        }
    });
    

    canvas.style.transform = 'translateX(0px)';
    let shakeAmount = 5;
    const shakeInterval = setInterval(() => {
        canvas.style.transform = `translateX(${(Math.random() - 0.5) * shakeAmount}px)`;
        shakeAmount *= 0.8;
        if (shakeAmount < 0.1) {
            clearInterval(shakeInterval);
            canvas.style.transform = 'translateX(0px)';
        }
    }, 50);
}

function executeRepairAll() {


    game.resources.wood += 50;
    game.resources.stone += 30;
    game.resources.gold += 20;
    

    game.structures.forEach(structure => {
        for (let i = 0; i < 5; i++) {
            const particle = new Particle(
                structure.x + (Math.random() - 0.5) * 30,
                structure.y + (Math.random() - 0.5) * 30,
                '#32CD32',
                Math.random() * 3 + 2,
                (Math.random() - 0.5) * 3,
                -Math.random() * 2,
                20 + Math.random() * 15
            );
            game.particles.push(particle);
        }
    });
}

function executeFreezeEnemies() {

    game.enemies.forEach(enemy => {
        if (!enemy.frozen) {
            enemy.frozen = true;
            enemy.frozenTime = 3;
            

            for (let i = 0; i < 6; i++) {
                const particle = new Particle(
                    enemy.x + (Math.random() - 0.5) * 30,
                    enemy.y + (Math.random() - 0.5) * 30,
                    '#87CEEB',
                    Math.random() * 3 + 2,
                    (Math.random() - 0.5) * 4,
                    -Math.random() * 3,
                    30 + Math.random() * 20
                );
                game.particles.push(particle);
            }
        }
    });
}

function updateSpecialAbilityUI() {
    Object.keys(game.specialAbilities).forEach(abilityName => {
        const ability = game.specialAbilities[abilityName];
        const button = document.querySelector(`[data-ability="${abilityName}"]`);
        const cooldownDisplay = document.getElementById(`${abilityName}-cooldown`);
        
        if (!button || !cooldownDisplay) return;
        
        const now = Date.now();
        const timeLeft = Math.max(0, ability.cooldown - (now - ability.lastUsed));
        
        if (timeLeft > 0) {
            button.disabled = true;
            button.classList.add('cooling-down');
            const secondsLeft = Math.ceil(timeLeft / 1000);
            cooldownDisplay.textContent = `${secondsLeft}s`;
        } else {
            button.disabled = false;
            button.classList.remove('cooling-down');
            const maxCooldown = Math.ceil(ability.cooldown / 1000);
            cooldownDisplay.textContent = `${maxCooldown}s`;
        }
    });
}


function purchaseResearch(researchType) {
    if (game.tutorialActive) return;
    
    const research = game.research[researchType];
    if (!research || research.level >= research.maxLevel) return;
    
    const cost = Math.floor(research.cost * Math.pow(1.5, research.level));
    
    if (game.resources.gold < cost) return;
    

    game.resources.gold -= cost;
    research.level++;
    

    applyResearchBonuses();
    

    game.structures.forEach(structure => {
        if (STRUCTURES[structure.type].isTower) {
            const baseStructure = STRUCTURES[structure.type];
            if (researchType === 'damage' && structure.damage) {
                structure.damage = (baseStructure.effect.damage * (1 + (structure.level - 1) * 0.5)) * game.globalBonuses.damageMultiplier;
            }
            if (researchType === 'range' && structure.range) {
                structure.range = (baseStructure.effect.range * (1 + (structure.level - 1) * 0.25)) * game.globalBonuses.rangeMultiplier;
            }
        }
    });
    
    updateResourceRates();
    updateResearchUI();
    updateUI();
}

function applyResearchBonuses() {

    game.globalBonuses.damageMultiplier = 1 + (game.research.damage.level * 0.15);
    

    game.globalBonuses.rangeMultiplier = 1 + (game.research.range.level * 0.10);
    

    game.globalBonuses.resourceMultiplier = 1 + (game.research.economy.level * 0.20);
}

function updateResearchUI() {
    Object.keys(game.research).forEach(researchType => {
        const research = game.research[researchType];
        const button = document.getElementById(`research-${researchType}`);
        
        if (!button) return;
        
        const cost = Math.floor(research.cost * Math.pow(1.5, research.level));
        const costElement = button.querySelector('.research-cost');
        
        if (research.level >= research.maxLevel) {
            button.disabled = true;
            button.classList.add('researched');
            costElement.textContent = 'MAX';
        } else {
            button.disabled = game.resources.gold < cost;
            costElement.textContent = `${cost}🪙`;
            
            if (research.level > 0) {
                button.classList.add('researched');
            }
        }
    });
}

let lastTime = 0;
function gameLoop(currentTime = 0) {
    if (!game.gameRunning) return;
    
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    if (!game.gamePaused) {
        updateResources(deltaTime);
        updateWaves(deltaTime);
        updateEnemies(deltaTime);
        updateTowers(deltaTime);
        updateProjectiles(deltaTime);
        updateParticles(deltaTime);
    }
    
    render();
    updateUI();
    
    requestAnimationFrame(gameLoop);
}


window.addEventListener('load', initGame);