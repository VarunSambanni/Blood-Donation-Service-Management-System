import './index.css';
import { BrowserRouter as Router, Switch, Route, } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';
import MainDonor from './pages/MainDonor';
import MainOrganisation from './pages/MainOrganisation';
import MainAdmin from './pages/MainAdmin';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <div className='backgroundContainer'>
        <Router>
          <Switch>
            <Route exact path='/'>
              <Login />
            </Route>
            <Route exact path='/signup'>
              <Signup />
            </Route>
            <Route path='/mainDonor'>
              <MainDonor />
            </Route>
            <Route path='/mainOrganisation'>
              <MainOrganisation />
            </Route>
            <Route path='/mainAdmin'>
              <MainAdmin />
            </Route>
          </Switch>
        </Router>
      </div>
      <Footer />
    </div>
  );
}

export default App;
