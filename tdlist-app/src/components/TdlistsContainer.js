import React, { Component } from "react";
import axios from "axios";
import update from "immutability-helper";

class TdlistsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tdlists: [],
    };
  }

  loadTdlists() {
    axios
      .get("/api/version1/tdlists")
      .then((res) => {
        this.setState({ tdlists: res.data });
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    this.loadTdlists();
  }

  newTdlist = (e) => {
    if (e.key === "Enter" && !(e.target.value === "")) {
      axios
        .post("/api/version1/tdlists", { tdlist: { title: e.target.value } })
        .then((res) => {
          const tdlists = update(this.state.tdlists, {
            $splice: [[0, 0, res.data]],
          });

          this.setState({
            tdlists: tdlists,
            inputValue: "",
          });
        })
        .catch((error) => console.log(error));
    }
  };

  handleChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  render() {
    return (
      <div>
        <div className="taskContainer">
          <input
            className="newTask"
            type="text"
            placeholder="Input a New Task and Press Enter"
            maxLength="75"
            onKeyPress={this.newTdlist}
            value={this.state.inputValue}
            onChange={this.handleChange}
          />
        </div>
        <div className="wrapItems">
          <ul className="listItems">
            {this.state.tdlists.map((tdlist) => {
              return (
                <li className="item" tdlist={tdlist} key={tdlist.id}>
                  <input className="itemCheckbox" type="checkbox" />
                  <label className="itemDisplay">{tdlist.title}</label>
                  <span className="removeItemButton">x</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default TdlistsContainer;