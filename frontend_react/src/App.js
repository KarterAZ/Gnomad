//################################################################
//
// Authors: Bryce Schultz
// Date: 12/19/2022
// 
// Purpose: Acts as the router for the application, renders
// various pages based on the one requested.
//
//################################################################

// external imports.
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// internal imports.
import HomePage from './pages/home/HomePage';
import RoutesPage from './pages/routes/RoutesPage';

render() {
    let h3idx = this.getH3Index()
    let apiKey = 'AIzaSyAT8jfo6wpzXcgHbis_GlC87rNDz5aIzQU'
    let mapUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`

    function return (
        <div style={{ height: `100%` }}>
            <nav className="navbar navbar-light" style={{ backgroundColor: '#563F7A', height: '5%' }}>
                <div className="mx-auto order-0">
                    <a className="navbar-brand mx-auto" href="https://github.com/tak2siva/uber-h3-gmaps-ui" style={{ color: 'white' }}>Uber's H3 Playground</a>
                </div>
            </nav>

            <div style={{ height: `95%` }} className='d-flex'>
                <div style={{ height: `100%`, width: `100%` }} className='p-2'>
                    <MyMapComponent
                        isMarkerShown
                        googleMapURL={mapUrl}
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `100%`, width: `100%` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        hexagons={h3KRing(h3idx, this.state.kringSize)}
                        onClickMap={this.handleOnClickMap}
                        markerPosition={{ lat: this.state.lat, lng: this.state.lng }}
                        cabPositions={this.state.cabPositions}
                    />
                </div>
                <div style={{ paddingRight: '20px' }} className='p-2'>
                    <form>
                        <div className='form-group'>
                            <label>
                                Resolution:
                            </label>
                            <NumericInput className="res_input form-control" min={0} max={30} value={this.state.resolution} onChange={this.handleInputChangeResolution} />
                        </div>
                        <div className='form-group'>
                            <label>
                                Ring:
                            </label>
                            <NumericInput className="num_input form-control" min={0} max={100} value={this.state.kringSize} onChange={this.handleInputChangekRing} />
                        </div>
                    </form>
                    <hr />
                    <div className="custom-control custom-radio">
                        <input type="radio" id="customRadio1"
                            name="customRadio"
                            checked={this.state.plantingMode === 'RIDER'}
                            onChange={this.handleOnClickPlantRider}
                            className="custom-control-input" />
                        <label className="custom-control-label" htmlFor="customRadio1">Plant Rider</label>
                    </div>
                    <div className="custom-control custom-radio">
                        <input type="radio" id="customRadio2"
                            checked={this.state.plantingMode === 'CABS'}
                            onChange={this.handleOnClickPlantCabs}
                            name="customRadio" className="custom-control-input" />
                        <label className="custom-control-label" htmlFor="customRadio2">Plant Cabs</label>
                    </div>
                    <button style={{ marginTop: `10px` }} onClick={this.handleOnClickRemoveCabs}>
                        Remove all cabs
                    </button>
                    <hr />
                    <button className='btn btn-success' style={{ marginTop: `10px`, width: `100%` }} onClick={this.handleOnClickFindCabs}>
                        Find Cabs
                    </button>
                </div>
            </div>
        </div>
    );
}

// This function returns the main app content.
export default function App() 
{
  return(
    <Router>
      <Routes>
        <Route exact path='/' element={<HomePage/>} />
        <Route path='routes' element={<RoutesPage/>}/>
      </Routes>
    </Router>
  );
}
