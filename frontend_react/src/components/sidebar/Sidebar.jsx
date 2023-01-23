//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Creates the sidebar react component.
//
//################################################################

// external imports.
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

// intenral imports.
import { sget } from '../../utilities/session_storage';
import { LoginButton } from '../login_button/LoginButton';

import './sidebar.css';


// this class renders the Sidebar component.
export default function Sidebar()
{
  const navigate = useNavigate();
  let open = true;
  // show / hide the Sidebar
  const handleClick = () => 
  {
    if (open) 
    {
      document.getElementById('sidebar-container').style.width = '0%';
    } 
    else 
    {
      document.getElementById('sidebar-container').style.width = '100%';
    }

    open = !open;
  }

  // this function is called when the search button is clicked.
  const search = async () =>
  {
    const query = document.getElementById('search-bar').value;
  }

  const create = () =>
  {

    let select = document.getElementById('pin-select');

    if (select.value === '4')
    { 
      navigate('routes');
    }
  }

  // render the actual component.
  return (
    <div id='sidebar-container'>
      <div id='sidebar-content'>
        <section className='section' id='header-section'>
          <div id='user-section'>
            <LoginButton/>
          </div>

          <div id='settings-button-wrapper'>
            <Icon id='settings-button' icon='ph:gear-six-duotone'/>
          </div>
        </section>

        <section className='section' id='search-section'>
          <label>Search:</label>
          <input id='search-bar' type='text'></input>
          <button className='button' id='search-button' onClick={search}>
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
              <option value='4'>Routes</option>
            </select>
            <button className='button' id='pin-button' onClick={create}>
              Create
            </button>
          </div>

          <div id='pins-list'></div>
        </section>
      </div>
      <div onClick={handleClick} id='handle'>
        <Icon icon='charm:menu-hamburger'/>
      </div>
    </div>
  );
}
