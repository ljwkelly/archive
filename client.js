const canvas = document.getElementById('starry-night');
const context = canvas.getContext('2d');
const textInput = document.getElementById('textInput');
const socket = io();

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Listen for updates from the server
socket.on('updateCircles', (data) => {
  drawStars();
  drawWhiteCircles(data);
});

function createWhiteCircle() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const radius = 8;
  const text = textInput.value || 'Default Text';

  context.fillStyle = '#ffffff';
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = '#ffffff';
  context.font = '12px Baskerville';
  context.fillText(text, x + radius + 5, y + 5);

  // Send the new circle to the server
  socket.emit('createWhiteCircle', { x, y, radius, text });
  textInput.value = '';
}

function handleKeyDown(event) {
  if (event.key === 'Enter') {
    createWhiteCircle();
  }
}

function drawStars() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#ffffff';

  for (let i = 0; i < 200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 2;

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
}

function drawWhiteCircles(circles) {
  context.fillStyle = '#ffffff';
  context.font = '12px Baskerville';

  for (const circle of circles) {
    context.beginPath();
    context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = '#ffffff';
    context.fillText(circle.text, circle.x + circle.radius + 5, circle.y + 5);
  }
}

function animate() {
  drawStars();
  // No need to draw white circles here; they will be drawn on updates from the server

  requestAnimationFrame(animate);
}

// Start the animation loop
animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

