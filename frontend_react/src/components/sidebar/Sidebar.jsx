import React, { Component } from 'react';
import { Icon } from '@iconify/react';
import { LoginButton, LogoutButton } from '../login_button/LoginButton';

import './sidebar.css';


class Sidebar extends Component
{
    constructor(props)
    {
        super(props)

        this.handleClick = this.handleClick.bind(this);
        this.open = true;
        
    }

    handleClick()
    {
        if (this.open)
        {
            
            document.getElementById("sidebar-container").style.width = "0px";
        }
        else
        {
            document.getElementById("sidebar-container").style.width = "35%";
        }

        this.open = !this.open;
    }

    render() 
    {
        return (
            <div id="sidebar-wrapper">
                <div id="sidebar-container">
                    <div id="sidebar-content">
                        <section className="section" id="header-section">
                            <div id="user-section">
                                <LoginButton/>
                                <LogoutButton/>
                            </div>

                            <div id="settings-button-wrapper">
                                <Icon id="settings-button" icon="ph:gear-six-duotone"/>
                            </div>
                        </section>

                        <section className="section" id="search-section">
                            <label>Search:</label>
                            <input id="search-bar" type="text"></input>
                            <button className="button" id="search-button">Submit</button>
                        </section>

                        <section className="section" id="pins-section">
                            <div id="pin-group">
                                <select defaultValue={0} id="pin-select">
                                    <option value="0" disabled>Select a Pin Type</option>
                                    <option value="1">All</option>
                                    <option value="2">Bathrooms</option>
                                    <option value="3">Wi-Fi</option>
                                </select>
                                <button className="button" id="pin-button">Create</button>
                            </div>

                            <div id="pins-list">

                            </div>
                        </section>
                    </div>
                </div>
                <div onClick={this.handleClick} id="handle">
                    <Icon icon="charm:menu-hamburger"/>
                </div>
            </div>
        );
    }
}

export default Sidebar;