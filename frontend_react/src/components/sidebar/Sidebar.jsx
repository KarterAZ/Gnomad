import './sidebar.css';

export default function Sidebar()
{
    return (
        <div id="container">
            <div id="handle">
            </div>

            <div id="content">
                <section className="section" id="header-section">
                    <div id="user-section">
                        <a href="#">Register</a> <a href="#">Login</a>
                    </div>

                    <div id="settings-button-wrapper">
                        <button id="settings-button">*</button>
                    </div>
                </section>

                <section className="section" id="search-section">
                    <label>Search:</label>
                    <input type="text"></input>
                    <button>Submit</button>
                </section>

                <section className="section" id="pins-section">
                    <select></select>
                    <button>Create</button>
                    <div id="pins-list">

                    </div>
                </section>
            </div>
        </div>
    );
}