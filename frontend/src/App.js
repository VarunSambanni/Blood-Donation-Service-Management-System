import './index.css';
import { BrowserRouter as Router, Switch, Route, } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';
import MainDonor from './pages/MainDonor';

function App() {
  return (
    <div className="App">
      <Header></Header>
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
        </Switch>
      </Router>
    </div>
  );
}

export default App;
