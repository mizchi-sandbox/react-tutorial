import React from "react";
import ReactDOM from "react-dom";
import weaponMasterData from "./weapons";
import {EventEmitter} from "events";

class MyContainer extends React.Component {
  static get childContextTypes() {return {emitter: React.PropTypes.any };}
  getChildContext() {
    this.emitter = new EventEmitter;
    return {
      emitter: this.emitter
    };
  }
}

class MyComponent extends React.Component {
  static get contextTypes() {return {emitter: React.PropTypes.any };}
  dispatch(...args) {
    return this.context.emitter.emit(...args);
  }
}


class WeaponListContainer extends MyContainer {
  constructor(props) {
    super(props);
    this.state = {
      weapons: weaponMasterData,
      filterQuery: ""
    };
    debugger
    this.emitter.on("change-filter-query", (newQuery) => {
      this.setState({
        filterQuery: newQuery,
        weapons: weaponMasterData
          .filter(w => w.name.indexOf(newQuery) > -1)
      })
    });
  }

  render() {
    return <WeaponList
      weapons={this.state.weapons}
      dispatch={this.emitter.emit.bind(this.emitter)}
    />;
  }
}

function WeaponItem({weapon}) {
  return <li>{weapon.name}:{weapon.sub}</li>
}

class WeaponList extends MyComponent {
  render() {
    return (
      <div className="weaponList">
        <h1>WeaponList</h1>
        <input onChange={ev =>
          this.dispatch("change-filter-query", ev.target.value)
        }/>
        <ul>
          {
            this.props.weapons.map(w => <WeaponItem key={w.name} weapon={w}/>)
          }
        </ul>
      </div>
    );
  }
}

const emitter = new EventEmitter;

ReactDOM.render(
  <WeaponListContainer emitter={emitter}/>,
  document.querySelector(".mainContainer")
);

emitter.on("change-filter-query", (update, newQuery) => {
  update({
    filterQuery: newQuery,
    weapons: weaponMasterData
      .filter(w => w.name.indexOf(newQuery) > -1)
  });
});
