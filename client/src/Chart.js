import React from "react";
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
          scales: {
            xAxes: {
              type: "time",
              //: data are spread at the same distance from each other
              distribution: "series",
              //TODO this does not work
              time: {
                tooltipFormat: "YYYY-MM-DD",

                displayFormats: {
                  millisecond: "MMM DD",
                  second: "MMM DD",
                  minute: "MMM DD",
                  hour: "MMM DD",
                  day: "MMM DD",
                  week: "MMM DD",
                  month: "MMM DD",
                  quarter: "MMM DD",
                  year: "MMM DD"
                }
              }
            }
          },
          animation: {
            duration: 0 // general animation time
          },
          hover: {
            animationDuration: 0 // duration of animations when hovering an item
          },
          responsiveAnimationDuration: 0, // animation duration after a resize
          //showLines: false,
          elements: {
            line: {
              //tension: 0 // disables bezier curves
            }
          }
        }}
      />
    );
  }
}
