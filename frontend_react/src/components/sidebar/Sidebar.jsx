//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Creates the sidebar react component
//
//################################################################

import React, { Component } from 'react';
import { Icon } from '@iconify/react';
import { sget } from '../../utilities/session_storage';
import { lget } from '../../utilities/local_storage';
import { LoginButton } from '../login_button/LoginButton';

import './sidebar.css';



class Sidebar extends Component 
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

  search = async () =>
  {
    let user = sget('user');
    console.log(user);
  }

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

export default Sidebar;
