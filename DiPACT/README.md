# DiPACT project site

Open `index.html` directly, or run `python3 -m http.server 8765` from this folder and visit `http://localhost:8765`. There is no build step. For GitHub Pages, copy the contents of this folder into a dedicated project directory such as `projects/DiPACT/`.

This is a local review draft. Before publishing, confirm release links and rights to redistribute the xBD image chip. The byline and team use the supplied DiPACT author list. QuPAINT and OpenQlaw supply existing headshots. The three updated portraits come from the author websites supplied for this draft. The baseline code and patent applications are related resources, not DiPACT deliverables or IP claims. Remove the `noindex` directive when the page is ready to be indexed.

The layout and base styles come from the [original Nerfies site](https://nerfies.github.io/), licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The original analytics and media were removed.

## Sources

- The four microscopy figures are web renders from the clean v5 submission source: `teaser_v10.pdf`, `fisher_method.pdf`, `comat_preference.pdf`, and `qualitative_dipact.pdf`.
- The experiment explorer follows the paper's material, layer, and xBD results. xBD localization F1 is supplementary and comes from `output/audits/results_scoring_2026-11-15/xbd_audit.json`.
- The selected [xBD](https://arxiv.org/abs/1911.09296) tiles are `hurricane-harvey_00000120_post_disaster_01` (target box `[47.05,28.15,7.09,10.57]`, major damage) and `hurricane-matthew_00000112_post_disaster_10` (target box `[0.67,74.36,4.01,4.49]`, destroyed). Coordinates are tile percentages. Overlays use the round-1 `full.jsonl` outputs from `xbd_benchmark_2026-11-02` (SFT) and `xbd_onpolicy_2026-11-09` (DPO, φ-DPO, DiPACT). In each example, only DiPACT predicts the annotated class with IoU ≥ 0.5. These are selected illustrations. Aggregate results are in the tables.
- The smooth minimum widget uses synthetic margins and the normalized formula in the manuscript.

- The Google Scholar icon comes from [Academicons](https://github.com/jpswalsh/academicons).
