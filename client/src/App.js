import React from "react";
import "./App.css";

async function getData() {
  const res = await fetch("api/data", {
    accept: "application/json"
  });

  return res.json();
}

class App extends React.Component {
  state = {
    data: {},
    loading: true
  };

  async componentDidMount() {
    const res = await getData();
    this.setState({ data: res, loading: false });
  }

  render() {
    if (this.state.loading) {
      return <p>Loading ...</p>;
    }
    return (
      <div>
        <code>
          <pre>{JSON.stringify(this.state.data, null, 2)}</pre>
        </code>
      </div>
    );
  }
}

export default App;
