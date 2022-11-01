import "./topbar.css"
import SearchIcon from '@mui/icons-material/Search';

export default function Topbar() {
  return (
    <div className="topbarContainer">
        <div className="topbarLeft">
          <span className="logo">Travel Nome</span>
        </div>
        <div className="topbarCenter">
          <div className="searchbar">
            <SearchIcon className="searchIcon"/>
            <input placeholder="Looking for something?" className="searchInput" />
          </div>
        </div>
        <div className="topbarRight">
          <img src="/assets/none.png" alt="" className="topbarImage"></img>
        </div>
    </div>
  )
}
