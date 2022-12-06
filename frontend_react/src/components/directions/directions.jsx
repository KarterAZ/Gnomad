import React, { Component } from 'react';

import './directions.css';

class directions extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.open = true;
  }

  handleClick() {
    if (this.open) {
      document.getElementById('directions-container').style.width = '0px';
    } else {
      document.getElementById('directions-container').style.width = '15%';
    }

    this.open = !this.open;
  }

  render() {
    return (
      <div id='directions-wrapper'>
        <div id='next-turn'>Take the next right</div>
      </div>
    );
  }
}

export default directions;
