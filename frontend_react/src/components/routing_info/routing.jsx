import React, { Component } from 'react';
import { Icon } from '@iconify/react';

import './routing.css';

class routing extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.open = true;
  }

  handleClick() {
    if (this.open) {
      document.getElementById('routing-container').style.width = '0px';
    } else {
      document.getElementById('routing-container').style.width = '15%';
    }

    this.open = !this.open;
  }

  render() {
    return (
      <div id='routing-wrapper'>
            <section className='section' id='general-next-stop-info'>
                <div id='next-stop'>
                    <div id='next-stop-text'>Next Stop:</div>
                    <div id='stop'>Your heart</div>
                </div>
                <div id='next-stop-arrival-time'>
                    <div id='next-stop-arrival-time-text'>Arrival Time:</div>
                    <div id='next-stop-arrival-time'>2:48</div>
                </div>
            </section>
            <section className='section' id='general-destination-info'>
                <div id='destination'>
                    <div id='destination-text'>Destination:</div>
                    <div id='dest'>Passing JP</div>
                </div>
                <div id='distance'>
                    <div id='distance-text'>Distance:</div>
                    <div id='dist'>2 many miles</div>
                </div>
                <div id='final-arrival-time'>
                    <div id='final-arrival-time-text'>Arrival Time:</div>
                    <div id='final-arrival-time'>2:48</div>
                </div>
            </section>
      </div>
    );
  }
}

export default routing;
