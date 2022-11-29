import './sidebar.css';

export default function Sidebar()
{
    return (
        <div id="sidebar-container">
            <div id="handle">
            </div>

            <div id="sidebar-content">
                <section className="section" id="header-section">
                    <div id="user-section">
                        <a href="#">Register</a> <a href="#">Login</a>
                    </div>

                    <div id="settings-button-wrapper">
                        <button className="button" id="settings-button"></button>
                    </div>
                </section>

                <section className="section" id="search-section">
                    <label>Search:</label>
                    <input id="search-bar" type="text"></input>
                    <button className="button" id="search-button">Submit</button>
                </section>

                <section className="section" id="pins-section">
                    <div id="pin-group">
                        <select id="pin-select"></select>
                        <button className="button" id="pin-button">Create</button>
                    </div>

                    <div id="pins-list">

                    </div>
                </section>
            </div>
        </div>
    );
}