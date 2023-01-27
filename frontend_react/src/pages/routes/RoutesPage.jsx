// external imports.
import { Icon } from '@iconify/react';
import roundKeyboardArrowUp from '@iconify/icons-ic/round-keyboard-arrow-up';
import roundKeyboardArrowDown from '@iconify/icons-ic/round-keyboard-arrow-down';
import baselineSearch from '@iconify/icons-ic/baseline-search';

// internal imports.
import './routes.css';

// this function renders the routes page.
export default function RoutesPage()
{
    return(
        <div id='centered-content'>
            <div id='form'>
                <div id='form-header'>
                    <h1>Create a Route</h1>
                </div>
                <div id='form-body'>
                    <div id='padded-wrapper'>
                        <div className='input-section-wrapper'>
                            <label>Route Name:</label>
                            <input className='text-input' type='text'></input>
                        </div>
                        <div className='input-section-wrapper'>
                            <label>Search for Pins:</label>
                            <div className='search-wrapper'>
                                <input className='text-input' type='text'></input>
                                <button className='search-button'><Icon icon={baselineSearch} width="20" height="20"/></button>
                            </div>
                        </div>
                        <div className='input-section-wrapper max-height'>
                            <div className='multi-select'>

                            </div>
                        </div>

                        <div className='input-section-wrapper'>
                            <div id='add-remove-buttons'>
                                <button className='small-button'><Icon icon={roundKeyboardArrowDown} width="30" height="30" /></button>
                                <div id='small-button-spacer'></div>
                                <button className='small-button'><Icon icon={roundKeyboardArrowUp} width="30" height="30" /></button>
                            </div>
                        </div>

                        <div className='input-section-wrapper'>
                            <label>Search for Pins:</label>
                            <div className='search-wrapper'>
                                <input className='text-input' type='text'></input>
                                <button className='search-button'><Icon icon={baselineSearch} width="20" height="20"/></button>
                            </div>
                        </div>

                        <div className='input-section-wrapper max-height'>
                            <div className='multi-select'>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}