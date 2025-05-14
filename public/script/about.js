const updateLines = () => {
    const container = document.getElementById("aboutCircles");
    const columns = container.querySelectorAll(".circle_column");
    const lineWrappers = container.querySelectorAll(".line_wrapper");

    const containerRect = container.getBoundingClientRect();

    lineWrappers.forEach((lineWrapper, i) => {
        const circle1 = columns[i].querySelector(".circle_inside");
        const circle2 = columns[i + 1].querySelector(".circle_inside");

        const rect1 = circle1.getBoundingClientRect();
        const rect2 = circle2.getBoundingClientRect();

        const startX = rect1.right - containerRect.left - 6;
        const centerY1 = rect1.top + rect1.height / 2 - containerRect.top;

        const endX = rect2.left - containerRect.left;
        const centerY2 = rect2.top + rect2.height / 2 - containerRect.top;

        const width = endX - startX + 6;

        lineWrapper.style.left = `${startX}px`;
        lineWrapper.style.top = `${(centerY1 + centerY2) / 2}px`;
        lineWrapper.style.width = `${width}px`;
        lineWrapper.style.height = "5px";
        lineWrapper.style.transform = `translateY(-50%)`;
        lineWrapper.style.zIndex = "-1";
    });
};

window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("aboutCircles");
    const columns = container.querySelectorAll(".circle_column");

    for (let i = 0; i < columns.length - 1; i++) {
        const lineWrapper = document.createElement("div");
        lineWrapper.classList.add("line_wrapper");

        const lineImg = document.createElement("img");
        lineImg.src = `/img/about/line${i + 1}.svg`;

        lineWrapper.appendChild(lineImg);
        container.appendChild(lineWrapper);
    }

    updateLines();
    window.addEventListener("resize", updateLines);
});