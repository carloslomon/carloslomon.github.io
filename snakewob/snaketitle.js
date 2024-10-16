const header = document.getElementById('snake-header');

// Colors to apply to each letter (snake-like pattern)
const snakeColors = ['#006400', '#32CD32', '#ADFF2F', '#32CD32', '#006400'];

header.innerHTML = header.textContent.split('').map((letter, index) => {
    const color = snakeColors[index % snakeColors.length];  // Cycle through colors
    return `<span style="color: ${color}">${letter}</span>`;
}).join('');

// Add hover effect
header.addEventListener('mouseover', () => {
    header.classList.add('hovered');
});

// Remove hover effect when mouse leaves
header.addEventListener('mouseout', () => {
    header.classList.remove('hovered');
});

