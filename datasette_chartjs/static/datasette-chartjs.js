const DATASETTE_CHARTJS_COLORS = [
  'blue',
  'green',
  'red',
  'orange',

  'teal',
  'lime',
  'coral',
  'gold',

  'navy',
  'darkgreen',
  'maroon',
  'yellow',
];

const DATASETTE_CHARTJS_LOADED = new Event('DatasetteChartJSLoaded');
const DATASETTE_CHARTJS_UPDATED = new Event('DatasetteChartJSUpdated');

document.addEventListener('DOMContentLoaded', () => {
  let context = {
    chart: null,
    data: null,
    xColumnName: null,
    chartType: 'line',
  };
  // Only execute on table, query and row pages
  if (document.querySelector('body.table,body.row,body.query')) {
    let container = document.createElement('div');
    let table = document.querySelector('table.rows-and-columns');
    table.parentNode.insertBefore(container, table);
    document.addEventListener('DatasetteChartJSUpdated', () => {
      renderChart(context);
    });
    document.addEventListener('DatasetteChartJSLoaded', () => {
      addForm(context, container);
      addChart(context, container);
      document.dispatchEvent(DATASETTE_CHARTJS_UPDATED);
    });
    loadData(context);
  }
});

const loadData = (context) => {
  let path = location.pathname + '.json' + location.search;
  fetch(path)
    .then((r) => r.json())
    .then((data) => (context.data = data))
    .then(() => document.dispatchEvent(DATASETTE_CHARTJS_LOADED));
};

const renderChart = (context) => {
  let data = context.data;
  let xColumnIndex;
  if (context.xColumnName === null) {
    xColumnIndex = 0;
  } else {
    xColumnIndex = data.columns.indexOf(context.xColumnName);
  }
  let labels = new Array();
  let datasets = new Array();
  let dsIdx = 0;
  data.columns.forEach((column, index) => {
    if (index !== xColumnIndex) {
      let ctx = {
        borderColor:
          DATASETTE_CHARTJS_COLORS[dsIdx % DATASETTE_CHARTJS_COLORS.length],
        fill: false,
        label: column,
        data: new Array(),
      };
      if (context.chartType === 'bar') {
        ctx.backgroundColor =
          DATASETTE_CHARTJS_COLORS[dsIdx % DATASETTE_CHARTJS_COLORS.length];
      }
      datasets.push(ctx);
      dsIdx++;
    }
  });
  data.rows.forEach((row) => {
    let dsIdx = 0;
    row.forEach((datapoint, index) => {
      if (index === xColumnIndex) {
        labels.push(datapoint);
      } else {
        datasets[dsIdx].data.push(datapoint);
        dsIdx++;
      }
    });
  });
  context.chart.data = {
    labels: labels,
    datasets: datasets,
  };
  if (context.chartType !== context.chart.config.type) {
    context.chart.config.type = context.chartType;
    context.chart.render();
  }
  context.chart.update();
};

const createFormRow = (label, input) => {
  let tr = document.createElement('tr');
  let td = document.createElement('td');
  td.innerText = label;
  tr.appendChild(td);
  td = document.createElement('td');
  td.appendChild(input);
  tr.appendChild(td);
  return tr;
};

const addForm = (context, container) => {
  let div = document.createElement('div');
  let table = document.createElement('table');

  let xAxis = document.createElement('select');
  xAxis.setAttribute('name', 'xaxis');
  xAxis.onchange = (e) => {
    context.xColumnName = e.target.value;
    document.dispatchEvent(DATASETTE_CHARTJS_UPDATED);
  };
  context.data.columns.forEach((element) => {
    let option = document.createElement('option');
    option.setAttribute('value', element);
    option.innerText = element;
    xAxis.appendChild(option);
  });
  table.appendChild(createFormRow('X axis column', xAxis));

  let style = document.createElement('select');
  style.setAttribute('name', 'style');
  style.onchange = (e) => {
    context.chartType = e.target.value;
    document.dispatchEvent(DATASETTE_CHARTJS_UPDATED);
  };
  [
    ['line', 'Line chart'],
    ['bar', 'Bar chart'],
  ].forEach((element) => {
    let option = document.createElement('option');
    option.setAttribute('value', element[0]);
    option.innerText = element[1];
    style.appendChild(option);
  });
  table.appendChild(createFormRow('Style', style));

  div.appendChild(table);
  container.appendChild(div);
};

const addChart = (context, container) => {
  Chart.platform.disableCSSInjection = true;
  let el = document.createElement('canvas');
  el.style.width = '100%';
  el.style.height = '250px';
  context.chart = new Chart(el, { type: context.chartType });
  container.appendChild(el);
};
