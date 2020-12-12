const datasetChartJsPlugin = {
  colors: [
    Color('blue'),
    Color('green'),
    Color('red'),
    Color('orange'),
    Color('teal'),
    Color('lime'),
    Color('coral'),
    Color('gold'),
    Color('navy'),
    Color('darkgreen'),
    Color('maroon'),
    Color('yellow'),
  ],
  state: {
    canvas: null,
    chart: null,
    chartType: 'line',
    container: null,
    data: null,
    formColumnSelector: null,
    shown: true,
    xColumnName: null,
  },
  createCanvas() {
    this.state.canvas = document.createElement('canvas');
    this.state.canvas.style.width = '100%';
    this.state.canvas.style.height = '250px';
    this.state.container.appendChild(this.state.canvas);
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
      ['horizontalBar', 'Horizontal bar chart'],
      ['polarArea', 'Polar area chart'],
      ['pie', 'Pie chart'],
      ['doughnut', 'Doughnut chart'],
      ['radar', 'Radar chart'],
    ].forEach((element) => {
      let option = document.createElement('option');
      option.setAttribute('value', element[0]);
      if (element[0] === that.state.chartType) {
        option.setAttribute('selected', 'selected');
      }
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
  formatBarLineRadarChartContext(xColumnIndex) {
    let that = this;
    let labels = new Array();
    let datasets = new Array();
    let dsIdx = 0;
    this.state.data.columns.forEach((column, index) => {
      if (index !== xColumnIndex) {
        datasets.push({
          backgroundColor: that.colors[dsIdx % that.colors.length]
            .alpha(this.state.chartType === 'radar' ? 0.1 : 0.5)
            .rgbaString(),
          borderColor: that.colors[dsIdx % that.colors.length].rgbString(),
          data: new Array(),
          fill: this.state.chartType === 'line' ? false : true,
          label: column,
        });
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
    return {
      type: this.state.chartType,
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {},
    };
  },
  formatDoughnutPiePolarChartContext() {
    if (this.state.data.rows.length !== 1) {
      console.error('Expected a single data row.');
      return {};
    }
    let backgroundColors = [];
    let borderColors = [];
    for (let i = 0; i < this.state.data.columns.length; ++i) {
      backgroundColors.push(
        this.colors[i % this.colors.length].alpha(0.5).rgbaString()
      );
      borderColors.push(this.colors[i % this.colors.length].rgbString());
    }
    return {
      type: this.state.chartType,
      data: {
        labels: this.state.data.columns,
        datasets: [
          {
            backgroundColor: backgroundColors,
            borderAlign: 'inner',
            borderColor: borderColors,
            borderWidth: 1,
            data: this.state.data.rows[0],
          },
        ],
      },
      options: {},
    };
  },
  init() {
    if (document.querySelector('body.table,body.row,body.query')) {
      Chart.platform.disableCSSInjection = true;
      this.createContainer();
      this.createForm();
      this.createCanvas();
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
  renderChart() {
    let that = this;
    if (this.state.chart !== null) {
      this.state.chart.destroy();
    }
    this.state.canvas.getContext('2d').clear();

    let xColumnIndex;
    if (this.state.xColumnName === null) {
      xColumnIndex = 0;
    } else {
      xColumnIndex = this.state.data.columns.indexOf(this.state.xColumnName);
    }
    let labels = new Array();
    let datasets = new Array();
    let dsIdx = 0;
    let context;
    switch (this.state.chartType) {
      case 'bar':
      case 'horizontalBar':
      case 'line':
        context = this.formatBarLineRadarChartContext(xColumnIndex);
        break;
      case 'doughnut':
      case 'pie':
      case 'polarArea':
        context = this.formatDoughnutPiePolarChartContext(xColumnIndex);
        break;
      case 'radar':
        context = this.formatBarLineRadarChartContext(xColumnIndex);
        break;
    }
    this.state.chart = new Chart(this.state.canvas, context);
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
    this.renderChart();
  },
  setData(data) {
    this.state.data = data;
    this.renderChart();
    this.refreshForm();
  },
  setXColumnName(name) {
    this.state.xColumnName = name;
    this.renderChart();
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
CanvasRenderingContext2D.prototype.clear =
  CanvasRenderingContext2D.prototype.clear ||
  function (preserveTransform) {
    if (preserveTransform) {
      this.save();
      this.setTransform(1, 0, 0, 1, 0, 0);
    }
    this.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (preserveTransform) {
      this.restore();
    }
  };
