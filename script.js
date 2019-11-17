const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const URL4 = 'data/4x4.json';
let json4 = [];

const xhr4 = new XMLHttpRequest();
xhr4.responseType = 'json';
xhr4.addEventListener('load', () => {
  json4 = xhr4.response;
});
xhr4.open('GET', URL4);
xhr4.send();

const URL32 = 'data/32x32.json';
let json32 = [];

const xhr32 = new XMLHttpRequest();
xhr32.responseType = 'json';
xhr32.addEventListener('load', () => {
  json32 = xhr32.response;
});
xhr32.open('GET', URL32);
xhr32.send();

// function resize(data, type) {
//   const pixel = canvas.width / data.length;
//   for (let i = 0; i < data.length; i += 1) {
//     for (let j = 0; j < data.length; j += 1) {
//       if (type === 'hex') {
//         ctx.fillStyle = `#${data[i][j]}`;
//       } else if (type === 'rgba') {
//         ctx.fillStyle = `rgba(${data[i][j][0]}, ${data[i][j][1]}, ${data[i][j][2]}, ${data[i][j][3]})`;
//       }
//       ctx.fillRect(i * pixel, j * pixel, pixel, pixel);
//     }
//   }
// }

// function resize(size) {
//   const pixel = canvas.width / size;
//   for (let i = 0; i < size; i += 1) {
//     for (let j = 0; j < size; j += 1) {
//       ctx.fillStyle = currentColor;
//       ctx.fillRect(i * pixel, j * pixel, pixel, pixel);
//     }
//   }
// }

// const button4 = document.getElementById('btn-4');
// const button32 = document.getElementById('btn-32');
// const image = document.getElementById('btn-image');

// button4.addEventListener('click', () => {
//   // resize(json4, 'hex');
//   resize(4);
// });

// button32.addEventListener('click', () => {
//   // resize(json32, 'rgba');
//   resize(32);
// });

// const img = new Image();
// img.src = 'data/image.png';
// image.addEventListener('click', () => {
//   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
// });


let currentColor = 'rgb(0, 0, 0)';
document.querySelector('.color').addEventListener('click', (evt) => {
  currentColor = window.getComputedStyle(evt.target.closest('.color__btn').children[0]).backgroundColor;
});


const colorBtnCurrent = document.querySelector('.color__btn--current .color__btn-color');
const colorBtnPrev = document.querySelector('.color__btn--prev .color__btn-color');
document.querySelector('.tools__color-input').addEventListener('change', (evt) => {
  colorBtnPrev.style.backgroundColor = colorBtnCurrent.style.backgroundColor;
  colorBtnCurrent.style.backgroundColor = evt.target.value;
  currentColor = evt.target.value;
});


let size = 1;


let isDrawing = false;

let startX = 0;
let startY = 0;

// function draw(x, y) {
//   if (!isDrawing) return;
//   ctx.fillRect(size * Math.floor(x / size), size * Math.floor(y / size), size, size);
// }

function BresenhamsAlgorithm(x0, x1, y0, y1) {
  const deltaX = Math.abs(x1 - x0);
  const deltaY = Math.abs(y1 - y0);

  let error = 0;
  let deltaerr = deltaY;
  let y = y0;
  let diry = y1 - y0;
  if (diry > 0) {
    diry = 1;
  } else if (diry < 0) {
    diry = -1;
  }
  // for (let i = x0; i <= x1; i += 1) {
  //   // draw(i, y);
  //   ctx.fillRect(size * Math.floor(i / size), size * Math.floor(y / size), size, size);
  //   error += deltaerr;
  //   if (2 * error >= deltaX) {
  //     y += diry;
  //     error -= deltaX;
  //   }
  // }

  let x = x0;
  let deltaerrX = deltaX;
  let diryX = x1 - x0;
  if (diryX > 0) {
    diryX = 1;
  } else if (diryX < 0) {
    diryX = -1;
  }
  if (deltaX >= deltaY) {
    if (x0 <= x1) {
      for (let i = x0; i <= x1; i += 1) {
        ctx.fillRect(size * Math.floor(i / size), size * Math.floor(y / size), size, size);
        error += deltaerr;
        if (2 * error >= deltaX) {
          y += diry;
          error -= deltaX;
        }
      }
    } else {
      for (let i = x0; i >= x1; i -= 1) {
        ctx.fillRect(size * Math.floor(i / size), size * Math.floor(y / size), size, size);
        error += deltaerr;
        if (2 * error >= deltaX) {
          x += diry;
          error -= deltaX;
        }
      }
    }
  } else if (deltaX < deltaY) {
    if (y0 <= y1) {
      for (let i = y0; i <= y1; i += 1) {
        ctx.fillRect(size * Math.floor(x / size), size * Math.floor(i / size), size, size);
        error += deltaerr;
        if (2 * error >= deltaX) {
          y += diry;
          error -= deltaX;
        }
      }
    } else {
      for (let i = y0; i >= y1; i -= 1) {
        ctx.fillRect(size * Math.floor(x / size), size * Math.floor(i / size), size, size);
        error += deltaerr;
        if (2 * error >= deltaX) {
          y += diry;
          error -= deltaX;
        }
      }
    }
  }
}

function draw(evt) {
  if (!isDrawing) return;

  console.log(evt);

  // ctx.beginPath();
  // ctx.strokeStyle = currentColor;
  // // ctx.lineWidth = size;
  // // ctx.lineHeight = size;
  // // ctx.lineCap = "square"; 
  // // ctx.lineCap = "round"; 
  // ctx.moveTo(startX, startY);
  // ctx.lineTo(evt.offsetX, evt.offsetY);
  // ctx.stroke();

  // ctx.fillRect(size * Math.floor(startX / size), size * Math.floor(startY / size), size, size);
  BresenhamsAlgorithm(startX, evt.offsetX, startY, evt.offsetY);


  // if(evt.offsetX >= startX + size || evt.offsetY >= startY + size) {
  startX = evt.offsetX;
  startY = evt.offsetY;
  // }
}

function mouseDown(evt) {
  isDrawing = true;

  startX = evt.offsetX;
  startY = evt.offsetY;

  ctx.fillStyle = currentColor;
  ctx.fillRect(size * Math.floor(startX / size), size * Math.floor(startY / size), size, size);

  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', () => {
    isDrawing = false;
  });
  canvas.addEventListener('mouseout', () => {
    isDrawing = false;
  });
}

canvas.addEventListener('mousedown', mouseDown);

const btnPaint = document.querySelector('.tools__btn--paint');
const btnPencil = document.querySelector('.tools__btn--pencil');

btnPencil.addEventListener('click', () => {
  btnPencil.classList.toggle('active');
  btnPaint.classList.remove('active');
  canvas.removeEventListener('click', paintBucket);

  if (btnPencil.classList.length > 2) {
    canvas.addEventListener('mousedown', mouseDown);
  } else {
    canvas.removeEventListener('mousedown', mouseDown);
  }
});


function paintBucket() {
  ctx.fillStyle = currentColor;
  ctx.fillRect(0, 0, 512, 512);
}

btnPaint.addEventListener('click', () => {
  btnPaint.classList.toggle('active');
  btnPencil.classList.remove('active');
  canvas.removeEventListener('mousedown', mouseDown);

  if (btnPaint.classList.length > 2) {
    canvas.addEventListener('click', paintBucket);
  } else {
    canvas.removeEventListener('click', paintBucket);
  }
});

// function resize(size) {
//   const pixel = canvas.width / size;
//   for (let i = 0; i < 512; i += pixel) {
//     for (let j = 0; j < 512; j += pixel) {
//       ctx.fillStyle = currentColor;
//       ctx.fillRect(i * pixel, j * pixel, pixel, pixel);
//     }
//   }
// //   canvas.style.width = `${size} px`;
// //   canvas.style.height = `${size} px`;
// }


const sizeSwitcher = document.querySelector('.switcher');
let currentSize = document.getElementById('btn-512');

sizeSwitcher.addEventListener('click', (evt) => {
  const target = evt.target.closest('.switcher__btn');
  if (target) {
    if (target.dataset.size === 'image') {
      const img = new Image();
      img.src = 'data/image.png';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    size = canvas.width / target.dataset.size;
    currentSize.classList.remove('active');
    target.classList.add('active');
    currentSize = target;
  }
});
