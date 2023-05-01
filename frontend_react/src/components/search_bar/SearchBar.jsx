import { useState } from "react";

import { Icon } from '@iconify/react';
import baselineSearch from '@iconify/icons-ic/baseline-search';

import './search_bar.css'

export default function SearchBar({ onSubmit })
{
    const [searchText, setSearchText] = useState('');

    const handleKeyPress = (event) => 
    {
        if(event.key === 'Enter')
        {
          submit();
        }
    }

    const submit = () =>
    {
        if (onSubmit instanceof Function)
        {
            onSubmit(searchText);
        }
    }

    return (
        <div className='search-bar-wrapper'>
            <input className='search-bar-input' type='text' onChange={(event) => setSearchText(event.target.value)} onKeyDown={handleKeyPress}></input>
            <button onClick={submit} className='search-bar-button'><Icon icon={baselineSearch} width="20" height="20"/></button>
        </div>
    );
}