const canvas = document.getElementById('starry-night');
const context = canvas.getContext('2d');
const textInput = document.getElementById('textInput');
const socket = io();

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Array to store stars and white circles
const stars = [];
const whiteCircles = [];

// Listen for updates from the server
socket.on('updateCircles', (data) => {
  stars.length = 0; // Clear stars array
  stars.push(...data.stars); // Update stars array with data from the server
  drawStars();
  drawWhiteCircles(data.whiteCircles);
});

function createWhiteCircle() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const radius = 3;
  const text = textInput.value || 'Default Text';

  whiteCircles.push({ x, y, radius, text });

  // Send the new white circle to the server
  socket.emit('createWhiteCircle', { x, y, radius, text });

  // Clear the input field
  textInput.value = '';

  // Redraw the stars and white circles
  drawStars();
  drawWhiteCircles();
}

function drawStars() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#ffffff';

  for (const star of stars) {
    context.beginPath();
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    context.fill();
  }
}

function drawWhiteCircles() {
  context.fillStyle = '#ffffff';
  context.font = '12px Baskerville';

  for (const circle of whiteCircles) {
    context.beginPath();
    context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = '#ffffff';
    context.fillText(circle.text, circle.x + circle.radius + 5, circle.y + 5);
  }
}

function animate() {
  drawStars();
  drawWhiteCircles();

  updateStars(); // This function is responsible for updating the star positions

  requestAnimationFrame(animate);
}

function updateStars() {
  for (const star of stars) {
    star.x += (Math.random() - 0.5) * 0.5; // Adjust the multiplier to control the speed
    star.y += (Math.random() - 0.5) * 0.5;
  }
}

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function handleKeyDown(event) {
  if (event.key === 'Enter') {
    createWhiteCircle();
  }
}




