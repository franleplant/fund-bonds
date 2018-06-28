// @flow
import simplify from "simplify-js";
import moment from "moment";

import COLORS from "./colors";

interface ICell {
  // parsed value of the cell
  v: number;
  // raw value
  w: string;
}

interface ICells {
  [string]: ICell;
}

interface IPoint {
  x: string | number;
  y: number;
}

interface IDataset {
  label: any;
  data: Array<IPoint>;
}

interface IChartData {
  labels: Array<string>;
  datasets: Array<IDataset>;
}

type IKeyedDatasets = {
  [colIndex: string]: IDataset
};

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

export function charRange(charA: string, charZ: string): Array<string> {
  const range = [];
  let i = charA.charCodeAt(0);
  const j = charZ.charCodeAt(0);

  for (; i <= j; ++i) {
    range.push(String.fromCharCode(i));
  }

  return range;
}

export function transform(cells: ICells): IChartData {
  const dates = [];
  const datasets: IKeyedDatasets = {};

  charRange("B", "T").forEach((colIndex, index) => {
    const header = cells[`${colIndex}${HEADERS_ROW}`].v;

    datasets[colIndex] = {
      ...DEFAULT_OPTS,
      label: header,
      data: [],
      backgroundColor: COLORS[index],
      borderColor: COLORS[index],
      pointBorderColor: COLORS[index]
    };
  });

  for (let rowIndex = DATA_START_ROW; ; rowIndex++) {
    const dateCell = cells[`A${rowIndex}`];
    if (!dateCell) {
      break;
    }

    dates.push(moment(dateCell.w, "D-MMM-YY").format("YYYY-MM-DD"));

    const date = moment(dateCell.w, "D-MMM-YY").valueOf();

    charRange("B", "T").forEach(colIndex => {
      const cellValue = (cells[`${colIndex}${rowIndex}`] || {}).v || 0;
      datasets[colIndex].data.push({
        x: date,
        y: cellValue
      });
    });
  }

  // Reduce the amount of numbers
  Object.values(datasets).forEach((dataset: any) => {
    (dataset: IDataset).data = simplify(dataset.data, 0.1).map(point => {
      return {
        ...point,
        x: moment(point.x).format("YYYY-MM-DD")
      };
    });
  });

  return {
    labels: dates,
    datasets: ((Object.values(datasets): any): Array<IDataset>)
  };
}
