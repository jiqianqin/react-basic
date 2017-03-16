import React from 'react';
import ReactDom, {render} from 'react-dom';
import {
  Router,
  Route,
  browserHistory,
  IndexRoute,
  Redirect
} from 'react-router';
import SampleRoute from './modules/sample';

class Main extends React.Component {
  componentWillMount() {
    //let token = Cookies.get( 'token' );
    //if ( !token ) {
    //  onfire.fire( Consts.EVENT_KEY.NET_COMMUNICATION.BUSINESS_ERROR.ERROR_401 );
    //}
  }

  render() {
    return (
      <Router history={browserHistory}>
        {SampleRoute}
      </Router>
    )
  }
}
render(
  <Main/>,
  document.getElementById('application')
)
