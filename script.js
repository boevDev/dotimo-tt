const playground = document.getElementById('playground');
const cubes = document.querySelectorAll('.cube');
let selectedCube = null;
let isDragging = false;
let stuckTogether = false;
let offsetX, offsetY;

// Initialize cubes
cubes.forEach((cube) => {
  cube.addEventListener('mousedown', startDragging);
  cube.addEventListener('click', selectCube);
});

document.addEventListener('mousemove', dragCube);
document.addEventListener('mouseup', stopDragging);

function startDragging(e) {
  isDragging = true;
  selectedCube = e.target;
  selectCube({ target: selectedCube });

  const rect = selectedCube.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  selectedCube.style.cursor = 'grabbing';
  selectedCube.style.zIndex = '1000';
}

function dragCube(e) {
  if (!isDragging || !selectedCube) return;

  const playgroundRect = playground.getBoundingClientRect();
  let newX = e.clientX - playgroundRect.left - offsetX;
  let newY = e.clientY - playgroundRect.top - offsetY;

  // Movement boundaries
  newX = Math.max(0, Math.min(newX, 750));
  newY = Math.max(0, Math.min(newY, 750));

  selectedCube.style.left = newX + 'px';
  selectedCube.style.top = newY + 'px';

  // Move stuck cube together
  if (stuckTogether) {
    const otherCube =
      selectedCube.id === 'cube1'
        ? document.getElementById('cube2')
        : document.getElementById('cube1');

    const dx =
      parseInt(otherCube.style.left) - parseInt(selectedCube.style.left);
    const dy = parseInt(otherCube.style.top) - parseInt(selectedCube.style.top);

    if (Math.abs(dx) > Math.abs(dy)) {
      // Горизонтальное слипание
      if (dx > 0) {
        // otherCube справа
        otherCube.style.left = newX + 50 + 'px';
        otherCube.style.top = newY + 'px';
      } else {
        // otherCube слева
        otherCube.style.left = newX - 50 + 'px';
        otherCube.style.top = newY + 'px';
      }
    } else {
      // Вертикальное слипание
      if (dy > 0) {
        // otherCube снизу
        otherCube.style.left = newX + 'px';
        otherCube.style.top = newY + 50 + 'px';
      } else {
        // otherCube сверху
        otherCube.style.left = newX + 'px';
        otherCube.style.top = newY - 50 + 'px';
      }
    }
  } else {
    checkStickiness();
  }
}

function stopDragging() {
  if (isDragging) {
    isDragging = false;
    if (selectedCube) {
      selectedCube.style.cursor = 'move';
      selectedCube.style.zIndex = 'auto';
      selectCube({ target: selectedCube });
    }
  }
}

function selectCube(e) {
  cubes.forEach((cube) => cube.classList.remove('selected'));
  selectedCube = e.target;
  selectedCube.classList.add('selected');
}

function changeColor(color) {
  if (selectedCube) {
    if (color === 'red') {
      selectedCube.style.background =
        'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)';
    } else if (color === 'green') {
      selectedCube.style.background =
        'linear-gradient(135deg, #00b894 0%, #00cec9 100%)';
    } else if (color === 'blue') {
      selectedCube.style.background =
        'linear-gradient(135deg, #4834d4 0%, #686de0 100%)';
    }
  }
}

function checkStickiness() {
  if (stuckTogether) return;

  const cube1 = document.getElementById('cube1');
  const cube2 = document.getElementById('cube2');

  const pos1 = {
    x: parseInt(cube1.style.left) || 100,
    y: parseInt(cube1.style.top) || 100,
  };
  const pos2 = {
    x: parseInt(cube2.style.left) || 200,
    y: parseInt(cube2.style.top) || 200,
  };

  const distance = Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
  );

  if (distance < 60) {
    // Sticking distance
    stuckTogether = true;

    // Определяем направление сближения
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;

    // Определяем, с какой стороны кубики приближаются друг к другу
    const isHorizontalApproach = Math.abs(dx) > Math.abs(dy);

    if (isHorizontalApproach) {
      // Горизонтальное сближение
      if (dx > 0) {
        // cube2 приближается справа
        cube2.style.left = pos1.x + 50 + 'px';
        cube2.style.top = pos1.y + 'px';
      } else {
        // cube2 приближается слева
        cube2.style.left = pos1.x - 50 + 'px';
        cube2.style.top = pos1.y + 'px';
      }
    } else {
      // Вертикальное сближение
      if (dy > 0) {
        // cube2 приближается снизу
        cube2.style.left = pos1.x + 'px';
        cube2.style.top = pos1.y + 50 + 'px';
      } else {
        // cube2 приближается сверху
        cube2.style.left = pos1.x + 'px';
        cube2.style.top = pos1.y - 50 + 'px';
      }
    }
  }
}

function separateCubes() {
  if (!stuckTogether) return;

  stuckTogether = false;
  const cube1 = document.getElementById('cube1');
  const cube2 = document.getElementById('cube2');

  // Random scattering
  cube1.style.left = Math.random() * 700 + 'px';
  cube1.style.top = Math.random() * 700 + 'px';
  cube2.style.left = Math.random() * 700 + 'px';
  cube2.style.top = Math.random() * 700 + 'px';
}
