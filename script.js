const canvas = document.querySelector(".canvas");


const gridSize = 50;
const speed = 10;
let puntaje=0;
let contador=0;
let position = { x: gridSize*6, y: gridSize*11 };
let shots = [];
let enemies = [];
let vida=30;
let sangre=0
let nave={x: gridSize*6, y: gridSize*11 , element:document.createElement("div")}
nave.element.classList.add("nave");
canvas.appendChild(nave.element);
const contenedorPuntaje=document.createElement('p')
contenedorPuntaje.classList.add('puntaje')
canvas.appendChild(contenedorPuntaje)

const contenedorVida=document.createElement('div')
contenedorVida.classList.add('vida')
canvas.appendChild(contenedorVida)

const contenedorSangre=document.createElement('div')
contenedorSangre.classList.add('sangre')
canvas.appendChild(contenedorSangre)

// Evento de teclado
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowRight":
      nave.x += speed;
      break;
    case "ArrowLeft":
        nave.x -= speed;
      break;
    case "ArrowUp":
        nave.y -= speed;
      break;
    case "ArrowDown":
        nave.y += speed;
      break;
    case " ":
      shots.push({
        x: nave.x,
        y: nave.y,
        element: document.createElement("div"),
      });

      canvas.appendChild(shots[shots.length - 1].element);
      shots[shots.length - 1].element.classList.add("disparo");
      break;
  }
});

// Crea un enemigo en una posición aleatoria
function createEnemy(i) {
    if(contador%300===0){
  const enemy = document.createElement("div");
  enemy.classList.add("enemigo");
  canvas.appendChild(enemy);
  const x = Math.floor(Math.random() * 12) * gridSize;
  const y = Math.floor(Math.random() * 1) * gridSize;
  enemy.style.transform = `translate(${x}px, ${y}px)`;
  enemies.push({ x, y, element: enemy });
}
}
// Collision
function checkCollision(shot, enemy) {
    const shotRect = shot.element.getBoundingClientRect();
    const enemyRect = enemy.element.getBoundingClientRect();
  
    return !(
      shotRect.right < enemyRect.left ||
      shotRect.left > enemyRect.right ||
      shotRect.bottom < enemyRect.top ||
      shotRect.top > enemyRect.bottom
    );
  }

  
// Actualiza la posición de los disparos
function updateShots() {
  shots.forEach((shot, index) => {
    shot.y -= speed;
    
    enemies.forEach((enemy, enemyIndex) => {
      if (checkCollision(shot,enemy)) {
        puntaje+=300
    
        canvas.removeChild(shot.element);
        canvas.removeChild(enemy.element);
        shots.splice(index, 1);
        enemies.splice(enemyIndex, 1);
      }
    });
    if (shot.y < 0) {
      canvas.removeChild(shot.element);
      shots.splice(index, 1);
    } else {
      shot.element.style.transform = `translate(${shot.x}px, ${shot.y}px)`;
    }
  });
}


// Actualiza la posición de los enemigos
function updateEnemies() {
  enemies.forEach((enemy,index) => {
    enemy.y += speed / 5;
    enemy.element.style.transform = `translate(${enemy.x}px, ${enemy.y}px)`;
    if(enemy.y>500){
        puntaje-=300;
       
        canvas.removeChild(enemy.element)
        enemies.splice(index,1)
    }
  });
}
//choque

const choque = () => {
    enemies.forEach((enemigo, index) => {
      if (checkCollision(nave, enemigo)) {
        createExplosion(enemigo.x,enemigo.y)
        sangre += 5;
        enemies.splice(index, 1);
        canvas.removeChild(enemigo.element);
        contenedorSangre.style.width = `${sangre}%`;
      }
    });
  };

  // fire 
function createExplosion(x, y) {
    const explosion = document.createElement("div");
    explosion.classList.add("explosion");
    canvas.appendChild(explosion);
    explosion.style.transform = `translate(${x}px, ${y}px)`;
    setTimeout(() => {
      canvas.removeChild(explosion);
    }, 1500);
  }

// Bucle principal
function gameLoop() {
  contador++
  createEnemy(contador);
  updateShots();
  updateEnemies();
  nave.element.style.transform = `translate(${nave.x}px, ${nave.y}px)`;
  requestAnimationFrame(gameLoop);
  contenedorPuntaje.textContent=puntaje;
  choque()

  

}



gameLoop();
