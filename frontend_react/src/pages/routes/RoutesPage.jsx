// external imports.
import { Icon } from '@iconify/react';
import roundKeyboardArrowUp from '@iconify/icons-ic/round-keyboard-arrow-up';
import roundKeyboardArrowDown from '@iconify/icons-ic/round-keyboard-arrow-down';
import baselineSearch from '@iconify/icons-ic/baseline-search';
import { useEffect, useState } from 'react';

// internal imports.
import './routes.css';
import PinsList from '../../components/pins_list/PinsList';
import Pin from '../../data/pin';
import searchPins from '../../utilities/api/search_pins';

// this function renders the routes page.
export default function RoutesPage()
{
    // state variables for the routes page.
    const [globalPins, setGlobalPins] = useState([]);
    const [routePins, setRoutePins] = useState([]);
    const [activePin, setActivePin] = useState(null);
    const [pinCount, setPinCount] = useState(0);
    const [globalSearchTerm, setGlobalSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const addPin = () =>
    {
        console.log(activePin);
        if (activePin != null)
        {
            activePin.position = pinCount;
            setRoutePins([...routePins, activePin]);
            setPinCount(pinCount + 1);
        }
    }

    const removePin = () =>
    {
        setPinCount(pinCount - 1);
    }

    const globalPinClick = (pin, active) =>
    {
        if (active)
            setActivePin(pin);
        else
            setActivePin(null);
    }

    const routePinClick = (pin) =>
    {
    }

    const searchGlobal = async () =>
    {
        console.log(globalSearchTerm);
        if (globalSearchTerm !== '')
        {
            let result = await searchPins(globalSearchTerm);
            let pins_list = result.map((pin) => 
            {
                return new Pin(pin.id, pin.userId, pin.longitude, pin.latitude, pin.title, pin.street, pin.tags);
            });
            //console.log(pins_list);
            //console.log(globalPins);
            setGlobalPins(pins_list);
        }
    }
    useEffect(()=>
    {
        let pin = new Pin(0, 0, 10, 20, 'Pin Title', 'Street', []);
        setGlobalPins([...globalPins, pin]);
    }, []);

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
                                <input className='text-input' type='text' onChange={(event) => { setGlobalSearchTerm(event.target.value)}}></input>
                                <button className='search-button'><Icon icon={baselineSearch} width="20" height="20" onClick={searchGlobal}/></button>
                            </div>
                        </div>
                        <PinsList pins={globalPins} onClick={globalPinClick}></PinsList>

                        <div className='input-section-wrapper'>
                            <div id='add-remove-buttons'>
                                <button className='small-button'><Icon icon={roundKeyboardArrowDown} width="30" height="30" onClick={addPin}/></button>
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

                        <PinsList pins={routePins} onClick={routePinClick}></PinsList>
                    </div>
                </div>
            </div>
        </div>
    );
}