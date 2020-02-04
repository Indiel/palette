const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function getData() {
  const localData = JSON.parse(localStorage.getItem('userData'));
  if (localData) {
    if (localData.canvas) {
      const img = new Image();
      img.src = localData.canvas;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }

    return localData;
  }
  return {
    canvas: false,
    currColor: 'rgb(0, 0, 0)',
    prevColor: '#31f863',
    pixelSize: 1,
    tool: 'pencil',
  };
}
const userData = getData();

function setCanvasData() {
  userData.canvas = canvas.toDataURL();
  localStorage.setItem('userData', JSON.stringify(userData));
}


const colorBtnCurrent = document.querySelector('.color__btn--current .color__btn-color');
const colorBtnPrev = document.querySelector('.color__btn--prev .color__btn-color');
colorBtnCurrent.style.backgroundColor = userData.currColor;
colorBtnPrev.style.backgroundColor = userData.prevColor;

function setColorData() {
  userData.prevColor = colorBtnPrev.style.backgroundColor;
  localStorage.setItem('userData', JSON.stringify(userData));
}

document.querySelector('.color').addEventListener('click', (evt) => {
  if (evt.target.closest('.color__btn--prev')) {
    userData.currColor = colorBtnPrev.style.backgroundColor;
    colorBtnPrev.style.backgroundColor = colorBtnCurrent.style.backgroundColor;
  } else {
    colorBtnPrev.style.backgroundColor = colorBtnCurrent.style.backgroundColor;
    userData.currColor = window.getComputedStyle(evt.target.closest('.color__btn').children[0]).backgroundColor;
  }
  colorBtnCurrent.style.backgroundColor = userData.currColor;

  setColorData();
});

const colorInput = document.querySelector('.tools__color-input');
colorInput.addEventListener('change', (evt) => {
  colorBtnPrev.style.backgroundColor = colorBtnCurrent.style.backgroundColor;
  colorBtnCurrent.style.backgroundColor = evt.target.value;
  userData.currColor = evt.target.value;

  setColorData();
});


let userIsDrawing = false;

let mouseStartX = 0;
let mouseStartY = 0;

function drawLine(evt) {
  if (!userIsDrawing) return;

  // Bresenham`s Algorithm
  const dx = Math.abs(evt.offsetX - mouseStartX);
  let x = mouseStartX;
  const sx = mouseStartX < evt.offsetX ? 1 : -1;

  const dy = Math.abs(evt.offsetY - mouseStartY);
  let y = mouseStartY;
  const sy = mouseStartY < evt.offsetY ? 1 : -1;

  let err = (dx > dy ? dx : -dy) / 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    ctx.fillRect(userData.pixelSize * Math.floor(x / userData.pixelSize),
      userData.pixelSize * Math.floor(y / userData.pixelSize),
      userData.pixelSize, userData.pixelSize);
    if (x === evt.offsetX && y === evt.offsetY) break;
    const e2 = err;
    if (e2 > -dx) { err -= dy; x += sx; }
    if (e2 < dy) { err += dx; y += sy; }
  }

  mouseStartX = evt.offsetX;
  mouseStartY = evt.offsetY;
}

function canvasMouseDownHandler(evt) {
  userIsDrawing = true;

  mouseStartX = evt.offsetX;
  mouseStartY = evt.offsetY;

  ctx.fillStyle = userData.currColor;
  ctx.fillRect(userData.pixelSize * Math.floor(mouseStartX / userData.pixelSize),
    userData.pixelSize * Math.floor(mouseStartY / userData.pixelSize),
    userData.pixelSize, userData.pixelSize);

  canvas.addEventListener('mousemove', drawLine);
  canvas.addEventListener('mouseup', () => {
    userIsDrawing = false;

    setCanvasData();
  });
  canvas.addEventListener('mouseout', () => {
    userIsDrawing = false;

    setCanvasData();
  });
}
canvas.addEventListener('mousedown', canvasMouseDownHandler);


const btnFill = document.querySelector('.tools__btn--fill');
const btnPencil = document.querySelector('.tools__btn--pencil');

function setToolData(str) {
  userData.tool = str;
  localStorage.setItem('userData', JSON.stringify(userData));
}

// function fillBucket() {
//   ctx.fillStyle = currentColor;
//   ctx.fillRect(0, 0, 512, 512);

//   canvasData = canvas.toDataURL();
//   localStorage.setItem('canvasData', canvasData);
// }

function fillBucket() {
  ctx.fillStyle = userData.currColor;
  ctx.fillRect(0, 0, 512, 512);

  setCanvasData();
}

function drawWithPencil() {
  btnPencil.classList.toggle('active');
  btnFill.classList.remove('active');
  canvas.removeEventListener('click', fillBucket);

  if (btnPencil.classList.length > 2) {
    canvas.addEventListener('mousedown', canvasMouseDownHandler);
  } else {
    canvas.removeEventListener('mousedown', canvasMouseDownHandler);
  }

  setToolData('pencil');
}
btnPencil.addEventListener('click', drawWithPencil);

function paintOverCanvas() {
  btnFill.classList.toggle('active');
  btnPencil.classList.remove('active');
  canvas.removeEventListener('mousedown', canvasMouseDownHandler);

  if (btnFill.classList.length > 2) {
    canvas.addEventListener('click', fillBucket);
  } else {
    canvas.removeEventListener('click', fillBucket);
  }

  setToolData('bucket');
}
btnFill.addEventListener('click', paintOverCanvas);

function activateTool() {
  if (userData.tool === 'pencil') {
    drawWithPencil();
  } else {
    paintOverCanvas();
  }
}
activateTool();


const sizeSwitcher = document.querySelector('.switcher');
// let currentSize = document.getElementById('btn-512');

function findOutCanvasSize() {
  const element = Array.from(sizeSwitcher.children).filter(
    (elem) => Number(elem.dataset.pixelSize) === userData.pixelSize,
  );
  element[0].classList.add('active');

  return element[0];
}
let currentSizeButton = findOutCanvasSize();

sizeSwitcher.addEventListener('click', (evt) => {
  const target = evt.target.closest('.switcher__btn');

  if (target) {
    userData.pixelSize = Number(target.dataset.pixelSize);
    currentSizeButton.classList.remove('active');
    target.classList.add('active');
    currentSizeButton = target;

    localStorage.setItem('userData', JSON.stringify(userData));
  }
});


function keyDown(evt) {
  if (evt.code === 'KeyB') {
    paintOverCanvas();
  } else if (evt.code === 'KeyP') {
    drawWithPencil();
  }
}
document.addEventListener('keydown', keyDown);
