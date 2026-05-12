const specs = {
  base: {
    name: "Base FE",
    note: "Baseline residuals from a model with zone and year-month fixed effects."
  },
  bt: {
    name: "Unit trend",
    note: "Residuals after adding unit-specific linear time trends."
  },
  bym: {
    name: "Borough-time FE",
    note: "Residuals after adding borough-by-time fixed effects on top of unit trends."
  },
  btp: {
    name: "Post trend",
    note: "Residuals after allowing unit-specific post-treatment linear trends."
  }
};

const measures = {
  dis: {
    name: "Network distance",
    slug: "network-distance",
    description: "Distance from each zone to the congestion pricing boundary."
  },
  cook: {
    name: "Cook co-occurrence",
    slug: "cook-cooccurrence",
    description: "Road-segment co-occurrence exposure mapped to zones."
  },
  trip: {
    name: "Trip pass-through",
    slug: "trip-pass-through",
    description: "Routed taxi-trip pass-through exposure."
  },
  ditr: {
    name: "Dist x trips",
    slug: "dist-x-trips",
    description: "Distance-anchored exposure adjusted by CBD-linked taxi share."
  }
};

const plotData = Object.keys(measures).flatMap((measure) =>
  Object.keys(specs).map((spec) => {
    const file = `residuals_${measure}_${spec}`;
  return {
      measure,
      spec,
      id: `plot-${measure}-${spec}`,
      title: `${measures[measure].name} - ${specs[spec].name}`,
      img: `assets/residuals/png/${file}.png`,
      alt: `${measures[measure].name} residual plot, ${specs[spec].name} specification`
    };
  })
);

const state = {
  measure: "dis",
  spec: "base"
};

function getPlot(measure, spec) {
  return plotData.find((plot) => plot.measure === measure && plot.spec === spec);
}

function updateFeatured() {
  const plot = getPlot(state.measure, state.spec);
  const image = document.getElementById("featured-img");
  const title = document.getElementById("featured-title");
  const note = document.getElementById("featured-note");

  title.textContent = plot.title;
  image.src = plot.img;
  image.alt = plot.alt;
  note.textContent = specs[state.spec].note;
}

function wireControls() {
  document.querySelectorAll("[data-control]").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-value]");
      if (!button) return;

      const key = group.dataset.control;
      state[key] = button.dataset.value;

      group.querySelectorAll("button").forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      updateFeatured();
    });
  });
}

function renderGrids() {
  Object.keys(measures).forEach((measure) => {
    const container = document.querySelector(`[data-measure-grid="${measure}"]`);
    if (!container) return;

    container.innerHTML = Object.keys(specs)
      .map((spec) => {
        const plot = getPlot(measure, spec);
        return `
          <figure class="plot-card" id="${plot.id}">
            <figcaption>
              <span>${specs[spec].name}</span>
            </figcaption>
            <img src="${plot.img}" alt="${plot.alt}" loading="lazy">
            <p>${specs[spec].note}</p>
          </figure>
        `;
      })
      .join("");
  });
}

renderGrids();
wireControls();
updateFeatured();
