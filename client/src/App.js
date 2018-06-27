import React from "react";
import moment from "moment";
import "./App.css";
import Chart from "./Chart";
import COLORS from './colors'


async function getData() {
  const res = await fetch("api/data", {
    accept: "application/json"
  });

  return res.json();
}

function charRange(charA, charZ) {
  const a = [];
  let i = charA.charCodeAt(0);
  const j = charZ.charCodeAt(0);

  for (; i <= j; ++i) {
    a.push(String.fromCharCode(i));
  }

  return a;
}

function transform(cells) {
  const DATA_START_ROW = 8;
  const HEADERS_ROW = 7;
  const DEFAULT_OPTS = {
    fill: false,
    lineTension: 0.1,
    backgroundColor: "rgba(75,192,192,0.4)",
    //borderColor: "rgba(75,192,192,1)",
    borderCapStyle: "butt",
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: "miter",
    pointBorderColor: "rgba(75,192,192,1)",
    pointBackgroundColor: "#fff",
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgba(255,0,0,1)",
    pointHoverBorderColor: "rgba(220,220,220,1)",
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10
  };

  const dates = [];
  const datasets = {};
  charRange("B", "T").forEach((colIndex, index) => {
    const header = cells[`${colIndex}${HEADERS_ROW}`].v;

    datasets[colIndex] = {
      ...DEFAULT_OPTS,
      label: header,
      data: [],
      backgroundColor: COLORS[index],
      pointBorderColor: COLORS[index],
    };
  });

  for (let rowIndex = DATA_START_ROW; ; rowIndex++) {
    const dateCell = cells[`A${rowIndex}`];
    if (!dateCell) {
      break;
    }

    const date = moment(dateCell.w, "D-MMM-YY").toISOString();
    dates.push(date);

    charRange("B", "T").forEach(colIndex => {
      // TODO we might need data transformations in here
      const cellValue = (cells[`${colIndex}${rowIndex}`] || {}).v || undefined;
      datasets[colIndex].data.push({
        x: date,
        y: cellValue,
      });
    });
  }

  console.log(dates);
  console.log(datasets);

  return {
    labels: dates,
    datasets: Object.values(datasets)
  };
}

export default class App extends React.Component {
  state = {
    data: {},
    loading: true
  };

  async componentDidMount() {
    const res = await getData();
    const xls = res.xls;
    const cells = xls.Sheets.Cuotaspartes;
    this.setState({
      rawData: xls,
      data: transform(cells),
      loading: false
    });
  }

  render() {
    if (this.state.loading) {
      return <p>Loading ...</p>;
    }

    //const generateColor = () => '#'+Math.floor(Math.random()*16777215).toString(16);
    //const colors = headers.map(generateColor)

    return (
      <div>
        <Chart data={this.state.data} />
      </div>
    );
  }
}
