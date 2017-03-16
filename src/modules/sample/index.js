import React from 'react';
import ReactDom, {render} from 'react-dom';
import {
  Router,
  Route,
  hashHistory,
  IndexRoute,
  Redirect
} from 'react-router';
import {Layout1} from '../../components/layout';
import Sample from './Sample';

class Main extends React.Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={Layout1}>
          <Route path="/sample" component={Sample}/>
        </Route>
      </Router>
    )
  }
}
render(
  <Main/>,
  document.getElementById('application')
)
