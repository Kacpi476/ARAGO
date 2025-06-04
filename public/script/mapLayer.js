document.addEventListener("DOMContentLoaded", () => {
    const pointers = document.querySelectorAll(".map_pointer");
    const mapLayer = document.querySelector(".map_layer");
    const mapLayerTextColumn = mapLayer.querySelector(".map_layer_text_column");
    const provinceImg = mapLayer.querySelector("#map_layer_province");
    const closeButton = mapLayer.querySelector(".map_layer_close");
    const mapImg = document.querySelector(".map_img");
    const provinceCountContainer = document.querySelector(".dys_liczba_inner");

    let mapData = {};

    fetch("/data/mapData.json")
        .then(response => response.json())
        .then(data => {
            mapData = data;

            pointers.forEach(pointer => {
                const pointerId = pointer.id;
                const entry = mapData[pointerId];
                if (entry && Array.isArray(entry.rows)) {
                    const count = entry.rows.length;
                    const label = pointer.querySelector("p");
                    if (label) {
                        label.textContent = `+${count}`;
                    }
                }
            });

            const provinceCounts = {};

            Object.values(mapData).forEach(entry => {
                const province = entry.province;
                const count = Array.isArray(entry.rows) ? entry.rows.length : 0;

                if (provinceCounts[province]) {
                    provinceCounts[province] += count;
                } else {
                    provinceCounts[province] = count;
                }
            });

            provinceCountContainer.innerHTML = "";
            for (const [province, count] of Object.entries(provinceCounts)) {
                const p = document.createElement("p");
                p.setAttribute("id", "dys_liczba");
                p.textContent = `${province}: +${count}`;
                provinceCountContainer.appendChild(p);
            }
        });

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const handleInteraction = (pointer) => {
        const pointerId = pointer.id;
        const entry = mapData[pointerId];
        if (!entry) return;

        mapLayerTextColumn.innerHTML = "";

        entry.rows.forEach(rowData => {
            const row = document.createElement("div");
            row.classList.add("map_layer_text_row");

            const h1 = document.createElement("h1");
            h1.textContent = rowData.address;

            const p = document.createElement("p");
            p.textContent = rowData.details;

            row.appendChild(h1);
            row.appendChild(p);
            mapLayerTextColumn.appendChild(row);
        });

        provinceImg.src = entry.provinceImg;

        mapLayer.style.display = "flex";
        mapImg.style.filter = "blur(8px) opacity(50%)";
        provinceCountContainer.parentElement.style.filter = "blur(8px) opacity(50%)";
    };

    pointers.forEach(pointer => {
        if (isTouchDevice) {
            pointer.addEventListener("click", () => handleInteraction(pointer));
        } else {
            pointer.addEventListener("mouseenter", () => handleInteraction(pointer));
        }
    });

    mapLayer.addEventListener("click", () => {
        mapLayer.style.display = "none";
        mapImg.style.filter = "none";
        provinceCountContainer.parentElement.style.filter = "none";
    });
});
