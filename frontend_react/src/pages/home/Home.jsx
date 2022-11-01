import Topbar from "../../components/topbar/Topbar";
import Map from "../../components/map/Map";
import "./home.css"

const location = {
  address: '1600 Amphitheatre Parkway, Mountain View, california.',
  lat: 37.42216,
  lng: -122.08427,
}

export default function Home() {
  return (
      <div className="container">
        <Topbar/>
        <Map location={location} zoomLevel={17}/>
      </div>
  )
}
