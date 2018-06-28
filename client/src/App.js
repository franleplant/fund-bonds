import React from "react";
import "./App.css";
import Chart from "./Chart";
import { getData } from "./providers.js";
import { transform } from "./dataTransformations";

//TODOS
//- add date selectors and filters
//- line chart selectors

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
      return (
        <div className="container">
          <p>Loading ...</p>
        </div>
      );
    }

    return (
      <div className="container">
        <Chart data={this.state.data} />
      </div>
    );
  }
}
