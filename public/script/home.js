// linie w main carousel
function drawEdgeToEdgeLines() {
    const column = document.querySelector('.numbers_column');
    const circles = column.querySelectorAll('.circle');
    const svg = document.getElementById('lines');
    const containerRect = column.getBoundingClientRect();

    let lines = '';

    for (let i = 0; i < circles.length - 1; i++) {
        const rect1 = circles[i].getBoundingClientRect();
        const rect2 = circles[i + 1].getBoundingClientRect();

        const x1 = rect1.left + rect1.width / 2 - containerRect.left;
        const y1 = rect1.bottom - containerRect.top;

        const x2 = rect2.left + rect2.width / 2 - containerRect.left;
        const y2 = rect2.top - containerRect.top;

        lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="white" stroke-width="3"/>`;
        }

    svg.innerHTML = lines;
}

window.addEventListener('load', drawEdgeToEdgeLines);
window.addEventListener('resize', drawEdgeToEdgeLines);

