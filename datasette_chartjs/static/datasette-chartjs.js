const datasetChartJsPlugin = {
  colors: [
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
  ],
  state: {
    chart: null,
    chartType: 'line',
    container: null,
    data: null,
    formColumnSelector: null,
    shown: true,
    xColumnName: null,
  },
  createChart() {
    Chart.platform.disableCSSInjection = true;
    let el = document.createElement('canvas');
    this.state.chart = new Chart(el, {
      type: this.chartType,
      options: { maintainAspectRatio: false },
    });
    el.style.width = '100%';
    el.style.height = '250px';
    this.state.container.appendChild(el);
  },
  createContainer() {
    let container = document.createElement('div');
    this.state.container = container;
    this.toggleShown();
    // container.style.display = 'none';
    let table = document.querySelector('table.rows-and-columns');
    table.parentNode.insertBefore(container, table);
  },
  createForm() {
    let that = this;
    let div = document.createElement('div');
    let table = document.createElement('table');
    const createRow = (label, input) => {
      let tr = document.createElement('tr');
      let td = document.createElement('td');
      td.innerText = label;
      tr.appendChild(td);
      td = document.createElement('td');
      td.appendChild(input);
      tr.appendChild(td);
      return tr;
    };

    let xAxis = document.createElement('select');
    xAxis.setAttribute('name', 'xaxis');
    xAxis.onchange = (e) => {
      that.setXColumnName(e.target.value);
    };
    this.state.formColumnSelector = xAxis;
    table.appendChild(createRow('X axis column', xAxis));

    let style = document.createElement('select');
    style.setAttribute('name', 'style');
    style.onchange = (e) => {
      that.setChartType(e.target.value);
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
    table.appendChild(createRow('Style', style));

    div.appendChild(table);
    this.state.container.appendChild(div);
  },
  createToggleButton() {
    let that = this;
    let el = document.createElement('button');
    el.innerText = 'Show chart';
    el.onclick = () => {
      let newState = that.toggleShown();
      if (newState === false) {
        el.innerText = 'Show chart';
      } else {
        el.innerText = 'Hide chart';
      }
    };
    this.state.container.parentNode.insertBefore(el, this.state.container);
  },
  init() {
    if (document.querySelector('body.table,body.row,body.query')) {
      this.createContainer();
      this.createForm();
      this.createChart();
      this.createToggleButton();
      this.loadData();
    }
  },
  loadData() {
    let that = this;
    let path = location.pathname + '.json' + location.search;
    fetch(path)
      .then((r) => r.json())
      .then((data) => that.setData(data));
  },
  refreshChart() {
    let xColumnIndex;
    if (this.state.xColumnName === null) {
      xColumnIndex = 0;
    } else {
      xColumnIndex = this.state.data.columns.indexOf(this.state.xColumnName);
    }
    let labels = new Array();
    let datasets = new Array();
    let dsIdx = 0;
    this.state.data.columns.forEach((column, index) => {
      if (index !== xColumnIndex) {
        let ctx = {
          borderColor: this.colors[dsIdx % this.colors.length],
          fill: false,
          label: column,
          data: new Array(),
        };
        if (this.state.chartType === 'bar') {
          ctx.backgroundColor = this.colors[dsIdx % this.colors.length];
        }
        datasets.push(ctx);
        dsIdx++;
      }
    });
    this.state.data.rows.forEach((row) => {
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
    this.state.chart.data = {
      labels: labels,
      datasets: datasets,
    };
    if (this.state.chartType !== this.state.chart.config.type) {
      this.state.chart.config.type = this.state.chartType;
      this.state.chart.render();
    }
    this.state.chart.update();
  },
  refreshForm() {
    let select = this.state.formColumnSelector;
    while (select.firstChild) {
      select.removeChild(select.lastChild);
    }
    this.state.data.columns.forEach((element) => {
      let option = document.createElement('option');
      option.setAttribute('value', element);
      option.innerText = element;
      select.appendChild(option);
    });
  },
  setChartType(type) {
    this.state.chartType = type;
    this.refreshChart();
  },
  setData(data) {
    this.state.data = data;
    this.refreshChart();
    this.refreshForm();
  },
  setXColumnName(name) {
    this.state.xColumnName = name;
    this.refreshChart();
  },
  toggleShown() {
    this.state.shown = !this.state.shown;
    if (this.state.shown === true) {
      this.state.container.style.display = 'block';
    } else {
      this.state.container.style.display = 'none';
    }
    return this.state.shown;
  },
};
document.addEventListener('DOMContentLoaded', () => {
  datasetChartJsPlugin.init();
});
