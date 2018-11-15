import React, { Component } from 'react';
import ReactDOM, {render}from 'react-dom';
import { BrowserRouter, Switch, Route, Router } from 'react-router-dom';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Login from './login';
import Query from './query';
import Invoke from './invoke';

//ReactDOM.render(<App />, document.getElementById('root'));

class Index extends Component{

    render() {
        var Child;

        switch(this.props.route) {
            case 'login': Child = Login; break;
            case 'query': 
                Child = Query; break;
            case 'invoke' :Child = Invoke; break;
            
            default: Child = Login;
        }

        return (
            <div>
                <App/>
                <Child/>
            </div>
        );
    }
}
export default Index;

var route =window.location.hash.substr(1);
ReactDOM.render( <Index route={route} /> , document.getElementById('root'));
/*render(  <Router>
     <Route path="/login" component={Login} />
  <Route path="/" component={Login} />
  <Route path="/Query" component={Query} />
</Router> , document.getElementById('app'));
*/
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
