 const updateLines = () => {
    const container = document.getElementById("aboutCircles");
    const columns = Array.from(container.querySelectorAll(".circle_column"));
    const lineWrappers = container.querySelectorAll(".line_wrapper");
    const containerRect = container.getBoundingClientRect();

    const isMobile = window.innerWidth <= 550;

    lineWrappers.forEach((lineWrapper, i) => {
        const circle1 = columns[i].querySelector(".circle_inside");
        const circle2 = columns[i + 1].querySelector(".circle_inside");

        const rect1 = circle1.getBoundingClientRect();
        const rect2 = circle2.getBoundingClientRect();

        if (isMobile) {
            // 📱 MOBILE: pionowa linia od dołu 1. koła do góry 2. koła
            const x = rect1.left + rect1.width / 2 - containerRect.left;
            const yStart = rect1.bottom - containerRect.top - 13;
            const yEnd = rect2.top - containerRect.top;
            const height = Math.max(0, yEnd - yStart)+4;

            lineWrapper.style.left = `${x}px`;
            lineWrapper.style.top = `${yStart}px`;
            lineWrapper.style.width = `5px`;
            lineWrapper.style.height = `${height}px`;
            lineWrapper.style.transform = `translateX(-50%)`;

            lineWrapper.style.backgroundImage = `url(/img/about/line_desktop_${i + 1}.svg)`;
            lineWrapper.style.backgroundSize = "cover";
            lineWrapper.style.backgroundRepeat = "no-repeat";
        } else {
            // 💻 DESKTOP: pozioma linia między środkami
            const xStart = rect1.right - containerRect.left - 6;
            const xEnd = rect2.left - containerRect.left;
            const width = xEnd - xStart + 6;

            const y1 = rect1.top + rect1.height / 2 - containerRect.top;
            const y2 = rect2.top + rect2.height / 2 - containerRect.top;
            const yCenter = (y1 + y2) / 2;

            lineWrapper.style.left = `${xStart}px`;
            lineWrapper.style.top = `${yCenter}px`;
            lineWrapper.style.width = `${width}px`;
            lineWrapper.style.height = `5px`;
            lineWrapper.style.transform = `translateY(-50%)`;

            lineWrapper.style.backgroundImage = `url(/img/about/line_desktop_${i + 1}.svg)`;
            lineWrapper.style.backgroundSize = "cover";
            lineWrapper.style.backgroundRepeat = "no-repeat";
        }

        // 🔁 Uniwersalne style
        lineWrapper.style.zIndex = "0";
    });
};





window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("aboutCircles");
    const columns = container.querySelectorAll(".circle_column");

    for (let i = 0; i < columns.length - 1; i++) {
        const lineWrapper = document.createElement("div");
        lineWrapper.classList.add("line_wrapper");

        container.appendChild(lineWrapper);
    }

    updateLines(); // załaduj linie
    window.addEventListener("resize", updateLines);
});
