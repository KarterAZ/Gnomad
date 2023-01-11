//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Creates the sidebar react component.
//
//################################################################

// external imports.
import React, { Component } from 'react';
import { Icon } from '@iconify/react';

// intenral imports.
import { sget } from '../../utilities/session_storage';
import { LoginButton } from '../login_button/LoginButton';

import './sidebar.css';


// this class renders the Sidebar component.
export default class Sidebar extends Component 
{
  constructor(props) 
  {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.open = true;

    this.state = 
    {
      user_id: -1,
      user: ''
    };
  }

  // show / hide the Sidebar
  handleClick = () => 
  {
    if (this.open) 
    {
      document.getElementById('sidebar-container').style.width = '0%';
    } 
    else 
    {
      document.getElementById('sidebar-container').style.width = '100%';
    }

    this.open = !this.open;
  }

  // this function is called when the search button is clicked.
  search = async () =>
  {
    const query = document.getElementById('search-bar').value;
  }

  // display a welcome message to the user when they login.
  WelcomeMessage = () =>
  {
    let user = sget('user');
    if (user !== null || user === undefined)
    return (
      <div>
        Welcome, { user.firstName }
      </div>
    );
  }

  // render the actual component.
  render() 
  {
    return (
      <div id='sidebar-container'>
        <div id='sidebar-content'>
          <section className='section' id='header-section'>
            <div id='user-section'>
              <LoginButton/>
              <this.WelcomeMessage/>
            </div>

            <div id='settings-button-wrapper'>
              <Icon id='settings-button' icon='ph:gear-six-duotone'/>
            </div>
          </section>

          <section className='section' id='search-section'>
            <label>Search:</label>
            <input id='search-bar' type='text'></input>
            <button className='button' id='search-button' onClick={this.search}>
              Submit
            </button>
          </section>

          <section className='section' id='pins-section'>
            <div id='pin-group'>
              <select defaultValue={0} id='pin-select'>
                <option value='0' disabled>
                  Select a Pin Type
                </option>
                <option value='1'>All</option>
                <option value='2'>Bathrooms</option>
                <option value='3'>Wi-Fi</option>
              </select>
              <button className='button' id='pin-button'>
                Create
              </button>
            </div>

            <div id='pins-list'></div>
          </section>
        </div>
        <div onClick={this.handleClick} id='handle'>
          <Icon icon='charm:menu-hamburger'/>
        </div>
      </div>
    );
  }
}
