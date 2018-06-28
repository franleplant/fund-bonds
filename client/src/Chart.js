import React from "react";
import moment from "moment";
import { Line } from "react-chartjs-2";

//use decimation to reduce the amount of points
//this lib might work http://mourner.github.io/simplify-js/
// Docs for charts http://www.chartjs.org/docs/latest/charts/line.html
export default class Chart extends React.Component {
  render() {
    return (
      <Line
        data={this.props.data}
        options={{
          cubicInterpolationMode: "monotone",
          tooltips: {
            callbacks: {
              title(tooltipItem, data) {
                const { xLabel } = tooltipItem;
                return moment(xLabel).format("YYYY-MM-DD");
              }
            }
          },
          scales: {
            xAxes: {
              type: "time",
              distribution: "series"
            }
          },
          animation: {
            duration: 0 // general animation time
          },
          hover: {
            animationDuration: 0 // duration of animations when hovering an item
          },
          responsiveAnimationDuration: 0 // animation duration after a resize
        }}
      />
    );
  }
}
