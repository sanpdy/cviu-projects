const $ = id => document.getElementById(id);
const metrics = {
  final: 'Final AP50', mft: 'MFT', maa: 'MAA', bwt: 'BWT',
  graphite: 'Graphite', wse: 'WSe₂', ws: 'WS₂', mos: 'MoS₂', wte: 'WTe₂',
  damage: 'Damage F1', major: 'Major-damage F1', localization: 'Localization F1',
};
const studies = {
  material: {
    title: 'Material-incremental characterization', note: 'DiPACT achieves the highest mean final AP50 across all five materials (39.2 vs. 34.0 for SEFE).',
    keys: ['final','mft','maa','bwt','graphite','wse','ws','mos','wte'],
    rows: [['SFT',24,26.3,31.8,-2.9,17.4,0,75.2,11.5,15.8],['EWC',22.3,30.6,33.1,-10.4,17.9,0,42.2,29.8,21.5],['O-LoRA',20.8,20,29.2,1.1,20.2,37.9,28.7,15.2,2.3],['SEFE',34,27.7,35.4,7.8,19.1,33.7,62.9,35.4,18.8],['LwF',13.5,21.9,25.4,-10.4,6.1,0,21.1,25.6,14.7],['DPO',21.8,34.7,33.8,-16.1,22.3,0,50.5,17.8,18.5],['φ-DPO',22.4,36.3,30,-17.3,22.3,0,56.4,11.5,21.9],['DiPACT',39.2,36.6,39.1,3.3,24.6,50.5,75.2,32.1,13.7]],
  },
  layer: {
    title: 'Adding new graphite layers', note: 'Bilayer and trilayer graphite are introduced on fresh chips. DiPACT leads on final AP50 and backward transfer.', keys: ['final','mft','maa','bwt'],
    rows: [['SFT',23.1,20.7,18.5,3.7],['LwF',13.7,12.6,15.9,1.7],['DPO',19.5,21.1,18.7,-2.4],['φ-DPO',16.1,19,18.8,-4.3],['DiPACT',24.5,21.2,17.7,4.8]],
  },
  xbd: {
    title: 'Adding major damage in xBD', note: '300 test tiles with 1,759 annotated buildings in the three evaluated classes.', keys: ['damage','major','localization'],
    rows: [['SFT',82.5,72.7,38.2],['DPO',78.5,60.6,30.9],['φ-DPO',87.7,80,36.4],['DiPACT',90,84,32.5]],
  },
};
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const format = (n, key) => `${key === 'bwt' && n > 0 ? '+' : ''}${n.toFixed(1).replace('-', '−')}`;

function selectStudy(key) {
  const study = studies[key];
  $('xbd-example').hidden = key !== 'xbd';
  $('microscopy-example').hidden = key === 'xbd';
  for (const tab of tabs) {
    const selected = tab.dataset.key === key;
    tab.setAttribute('aria-selected', selected);
    tab.tabIndex = selected ? 0 : -1;
  }
  $('result-panel').setAttribute('aria-labelledby', `tab-${key}`);
  $('result-title').textContent = study.title;
  $('result-note').textContent = study.note;
  $('xbd-credit').hidden = key !== 'xbd';
  $('result-footnote').textContent = key === 'xbd'
    ? ''
    : (key === 'material' ? '' : '');
  const best = study.keys.map((_,j) => Math.max(...study.rows.map(row => row[j+1])));
  const groups = key === 'material' ? '<tr class="metric-groups"><th></th><th colspan="4" scope="colgroup">Continual performance</th><th colspan="5" scope="colgroup">Final AP50 by material</th></tr>' : '';
  $('result-table').innerHTML = `<table class="table is-fullwidth" aria-labelledby="result-title"><thead>${groups}<tr><th scope="col">Method</th>${study.keys.map(k => `<th scope="col">${metrics[k]}</th>`).join('')}</tr></thead><tbody>${study.rows.map(row => `<tr${row[0] === 'DiPACT' ? ' class="ours"' : ''}><th scope="row">${row[0]}</th>${study.keys.map((k,j) => `<td>${row[j+1] === best[j] ? `<strong>${format(row[j+1],k)}</strong>` : format(row[j+1],k)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

}

tabs.forEach((tab,i) => {
  tab.addEventListener('click', () => selectStudy(tab.dataset.key));
  tab.addEventListener('keydown', event => {
    const target = {ArrowLeft:(i+tabs.length-1)%tabs.length,ArrowRight:(i+1)%tabs.length,Home:0,End:tabs.length-1}[event.key];
    if (target === undefined) return;
    event.preventDefault();
    selectStudy(tabs[target].dataset.key);
    tabs[target].focus();
  });
});
selectStudy('material');

function drawWeights() {
  const tau = Number($('tau').value), margins = [1.8,0.25,1.35];
  const min = Math.min(...margins);
  const factors = margins.map(n => Math.exp(-(n-min)/tau));
  const sum = factors.reduce((a,b) => a+b,0);
  $('tau-value').value = tau.toFixed(1);
  $('aggregate').value = (min-tau*Math.log(sum/margins.length)).toFixed(3);
  $('weights').innerHTML = margins.map((n,i) => {
    const weight = 100*factors[i]/sum;
    return `<div class="weight-row${n === min ? ' weak' : ''}"><span>Pair ${i+1}</span><span>${n.toFixed(2)}</span><span class="weight-value"><span class="track" aria-hidden="true"><i style="width:${weight}%"></i></span>${weight.toFixed(1)}%</span></div>`;
  }).join('');
}
$('tau').addEventListener('input', drawWeights);
drawWeights();

const examples = [
  {
    key: 'harvey', crop: '38 20 26 26', rows: [
      ['Annotation','Major damage','truth',[[47.05,28.15,7.09,10.57]]],
      ['SFT','No matching box','incorrect',[]],
      ['DPO','No matching box','incorrect',[]],
      ['φ-DPO','No matching box','incorrect',[]],
      ['DiPACT','Major damage','correct',[[47.97,26.96,7.56,13.3]]],
    ],
  },
  {
    key: 'matthew', crop: '0 69 13 13', rows: [
      ['Annotation','Destroyed','truth',[[0.67,74.36,4.01,4.49]]],
      ['SFT','No matching box','incorrect',[]],
      ['DPO','No matching box','incorrect',[]],
      ['φ-DPO','No damage','incorrect',[[0.01,73.82,4.59,4.68]]],
      ['DiPACT','Destroyed','correct',[[0,74.27,4.51,4.61]]],
    ],
  },
];
for (const {key,crop,rows} of examples) {
  $(`case-${key}`).innerHTML = rows.map(([method,label,type,boxes]) => `<figure class="${type}"><svg viewBox="${crop}" role="img" aria-label="${method}: ${label}"><image href="assets/xbd-${key}.webp" width="100" height="100"/>${boxes.map(([x,y,w,h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke"/>`).join('')}</svg><figcaption><strong>${method}</strong><span>${label}</span></figcaption></figure>`).join('');
}

const menu = document.querySelector('.navbar-burger');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', open);
  menu.classList.toggle('is-active', open);
  $('research-menu').classList.toggle('is-active', open);
});

const materialSelect = $('material-select');
materialSelect.addEventListener('change', () => {
  const sample = $('material-sample');
  const image = sample.querySelector('img');
  const round = materialSelect.selectedIndex;
  const source = round < 3 ? 'In-house microscopy' : 'Public microscopy';
  sample.href = `assets/materials/${materialSelect.value}.webp`;
  image.src = sample.href;
  image.alt = `${materialSelect.selectedOptions[0].text} micrograph`;
  $('material-meta').textContent = `Round ${round} - ${source}`;
});
