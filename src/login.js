import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'terra-button/lib/Button';
import Card from 'terra-card/lib/Card';
import Fieldset from 'terra-form-fieldset/lib/Fieldset';
import Input from 'terra-form-input';
import ApplicationMenuName from 'terra-application-name/lib/ApplicationMenuName';
import Image from 'terra-image';
import Layout from 'terra-layout/lib/Layout';
import App from './App';
import img from './cerner.png';
import Index from './index';
import Query from './query';
import { ApplicationMenuUtility, UtilityUtils } from 'terra-application-utility/lib/ApplicationUtility';
//import Alert from 'terra-alert';

import ItemView from 'terra-clinical-item-view/lib/ItemView';
import IconPerson from 'terra-icon/lib/icon/IconPerson';
import IconProvider from 'terra-icon/lib/icon/IconProvider';
import IconHospital from 'terra-icon/lib/icon/IconHospital';
import IconBriefcase from 'terra-icon/lib/icon/IconBriefcase';
import IconBedRequested from 'terra-icon/lib/icon/IconBedRequested';
import IconAlert from 'terra-icon/lib/icon/IconAlert'
import IconSuccess from 'terra-icon/lib/icon/IconSuccess'
import IconPersonHospital from 'terra-icon/lib/icon/IconPersonHospital';
import LabelValueView from 'terra-clinical-label-value-view/lib/LabelValueView';
import ItemDisplay from 'terra-clinical-item-display';
import Alert from 'terra-alert';
import Badge from 'terra-badge';
import Select from 'terra-form-select/lib/Select';




class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            'username': 'CI08128', 'password':'' , logInError : true, userError: Boolean,
            'items': [], 'token' : '',  'id': '',
            'auth' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDE1MTc3NzMsInVzZXJuYW1lIjoiUGF5ZXIiLCJvcmdOYW1lIjoiT3JnMiIsImlhdCI6MTU0MTQ4MTc3M30.3wFHR95SUXD1WVkaFYDqQLYkjjRa1BeLNFMD3hia284', 
            fetchError: 0, 'toutput': [] ,'foutput' : []
        }
        this.handleChangeUsername= this.handleChangeUsername.bind(this)
        this.handleChangePassword= this.handleChangePassword.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
        this.handleLogout= this.handleLogout.bind(this)
        this.handleChange= this.handleChange.bind(this) 
        this.handleSubmitQuery = this.handleSubmitQuery.bind(this)
    }
    componentDidCatch() {
        if(this.state.results == false){
            alert("Invalid or Bad Request")
        }
    } 
    handleChangeUsername(e) {
        this.setState({username: e.target.value});
    }
    handleChangePassword(e) {
        this.setState({password: e.target.value});
    }
    handleSubmit(){
        const { username, password } = this.state;     
        if (!(password === 'blockchain')) {
            this.setState({ logInError: false }) 
            alert("Invalid PayerID or Password")
        }
        if ((password === 'blockchain')) {
            this.setState({ logInError: true }) 
        }  
    }
    handleLogout() {
        this.setState({logInError : false, 'items': [], 'token': ''})
    }
    fetchData() {
      let config = {
        method: 'GET',
        headers: {
          'authorization': 'Bearer '+this.state.auth,
          'content-Type': 'application/json'
        },
      }
      //fetch('http://localhost:4000' + '/channels/mychannel/chaincodes/payerchart?peer=peer0.org1.example.com&fcn=queryCustom&args=%5B%22'+this.state.token+'%22%5D', config)
      //fetch('http://localhost:4000' + '/channels/mychannel/chaincodes/payerchart?peer=peer0.org1.example.com&fcn=queryCustom&args=%5B%22{\"selector\":{\"clientId\":\"'+this.state.token+'\",\"payerId\":\"'+this.state.username+'\"}}%22%5D', config)
      fetch('http://localhost:4000' + '/channels/mychannel/chaincodes/payerchart?peer=peer0.org1.example.com&fcn=queryCustom&args=%5B%22%7B%5C%22selector%5C%22:%7B%5C%22_rev%5C%22:%5C%22'+this.state.token+'%5C%22,%5C%22payerId%5C%22:%5C%22'+this.state.username+'%5C%22%7D%7D%22%5D', config)
        .then(response =>  response.json() )
        .then(response => {
            if (JSON.stringify(response) == '[]'){
               this.setState({ fetchError : 1})
               this.setState({ 'foutput' : 'failed'})
               this.setState({ 'items' : []})
                
            } else {
                //this.setState({ fetchError : 2})
                
                this.setState({ fetchError : 2 ,'items' : response})
            }
    } )
        //.then((response) => this.setState({ 'items' : response }));
    
    }
    //This fetches the user 
    fetchUser() {
        let config = {
          method: 'GET',
          headers: {
            'authorization': 'Bearer '+this.state.auth,
            'content-Type': 'application/json'
          },
        }
       fetch('http://localhost:4000' + '/channels/mychannel/chaincodes/payerchart?peer=peer0.org1.example.com&fcn=queryCustom&args=%5B%22%7B%5C%22selector%5C%22:%7B%5C%22payerId%5C%22:%5C%22'+this.state.username+'%5C%22%7D%7D%22%5D', config)
          .then(response =>  response.json() )
          .then(response => {
              if (JSON.stringify(response) == '[]'){
                 this.setState({ userError : false})
                 
                  
              } else {
                  this.setState({ userError : true})
                  
                 
              }
      } )
          //.then((response) => this.setState({ 'items' : response }));
      
      }

    fetchURL() {

    }  
    handleChange(e) {
      this.setState({token: e.target.value});
    }

    handleChangeFilter(e) {
      this.setState({filter: e.target.value});
    }
  
    handleSubmitQuery() {
      this.fetchData();
     
    }
    
    
    render() {   
        
        const inputStyle ={ height: '35px', margin: 'auto', width: '100%'};
        //const display1 = <ItemView.Display icon={<IconPerson />} text={this.state.items.PatDisplay} />;
        const display1 = <ItemView.Display icon={<IconPerson />} text={this.state.items.map(item => (<React.Fragment key={item.id}>{item.Record.patDisplay}</React.Fragment>))} />;

        const display20 = <ItemView.Display text="Patient Reference ID: " />;
        const display2 = <ItemView.Display text={this.state.items.map(item => (<React.Fragment key={item.id}>{item.Record.patReference}</React.Fragment>))} />;
        const display21 =[display20, display2]
        const display30 = <ItemView.Display text="Status: " />;
        const display3 = <ItemView.Display text={this.state.items.map(item => (<React.Fragment key={item.id}>{item.Record.status}</React.Fragment>))} />;
        const display31 =[display30, display3]
        const display40 = <ItemView.Display text="ClientId: " />;
        const display4 = <ItemView.Display text={this.state.items.map(item => (<React.Fragment key={item.id}>{item.Record.clientId}</React.Fragment>))} />;
        //const display4 = <ItemView.Display text={this.state.foutput.Record} />;
        const display41 =[display40, display4]
        //const display50 = <ItemView.Display text="Age: " />;
        //const display5 = <ItemView.Display text={this.state.items.age} />;
        //const display51 =[display50, display5]
        const displays = [display1,display41, display21, display31];

        const display01 = <ItemView.Display icon={<IconPersonHospital />} text="Encounter Info:"/>;
        //const display011 = <ItemView.Display text="Weight: "/>;
        //const display012 = <ItemView.Display text={this.state.items.weight}/>;
        //const display00= [display011,display012]
        const display021 = <ItemView.Display icon={<IconHospital />} text="Provider Name:  "/>;
        const display022 = <ItemView.Display text={this.state.items.map(item => (<React.Fragment key={item.id}>{item.Record.sourceDisplay}</React.Fragment>))}/>;
        const display02= [display021,display022]
        const display031 = <ItemView.Display icon={<IconProvider />} text="Provideer ID:  "/>;
        const display032 = <ItemView.Display text={this.state.items.map(item => (<React.Fragment key={item.id}>{item.Record.sourceReference}</React.Fragment>))}/>;
        const display03 =[display031,display032];
        const display041 = <ItemView.Display icon={<IconBedRequested/>} />;
        const display042 = <ItemView.Display text="Period Start:  "/>;
        const display043 = <ItemView.Display text={this.state.items.map(item => (<React.Fragment key={item.id}>{item.Record.periodStart}</React.Fragment>))}/>;
        const display0041 =[ display042, display043]
        const display044 = <ItemView.Display text="Period End:  "/>;
        const display045 = <ItemView.Display text={this.state.items.map(item => (<React.Fragment key={item.id}>{item.Record.dateAsserted}</React.Fragment>))}/>;
        const display0042 = [display044, display045]
        const display04 =[display041,display0041, display0042];
        const display0 =[display01, display02, display03, display041, display0041, display0042];
        const displayurh = <ItemView.Display text="FIRE URL to query additional clinical Information:  "/>;
        const displayur =<ItemView.Display text="http:xxx.xxx.xx.xx:xxxx/database "/>;
        const displayURL = [displayurh, displayur]
        //const inputStyle ={ height: '35px', width: '300px'};
        
        
        
        const buttonStyle = { margin: 'auto' };
        const buttonStyle2 = { float : 'right'  };
        const feildStyle = { width: '100%', textAlign: 'right'  };
        const logInError = this.state.logInError;
        const fetchError = this.state.fetchError
        const logoutStyle = { textAlign: 'left', paddingLeft: '1100px', float: 'right'}
        let result;
        const mainPage  = <div>  
            <div style = {feildStyle}> 
                <h3 >Welcome {this.state.username}</h3>
            </div>
            <div style = {buttonStyle2}> 
                <Button  onClick={this.handleLogout} text="Log Out" variant="action" style={buttonStyle2} />
            </div>
            <div  style={{ margin: 'auto', height: '200px', width: '500px', textAlign:'left', position:'relative'}}> 
                <div  style={{ margin: 'auto', height: '500px', width: '100%'}}> 
                    <Fieldset legend="Query the Additional Clinical Information" legendAttrs={{ className: 'healtheintent-application' }} help="Enter a Valid Hash along with the required clinical information and Click Submit" isInline style={feildStyle} >               
                        <ul>
                            <Input type="text" placeholder ="Hash" value={this.state.token} onChange={this.handleChange}  style={inputStyle}/>                      
                        </ul>
              
                        <Button color="success" size="lg" onClick={this.handleSubmitQuery} text="Submit" variant="action" style={buttonStyle} />
                    </Fieldset>   
                </div>
            </div>
        </div>
        const logInPage =  <div  style={{ margin: 'auto', height: '500px', width: '400px', textAlign:'left', position:'relative'}}> 
            <ul>  </ul>
            <div style={{ border: '1px solid lightGray', backgroundColor: '#2481ca', width: '100%', height: '50px', position: 'relative', }} >
                <ApplicationMenuName title="Cernchain Login" accessory={<Image src={img} height="80px" width="80px" isFluid />} />
            </div>
            <Card>
                <Card.Body>
                    <ul>
                        <label>
                        <Input type="text" placeholder ="PayerID" value={this.state.username} onChange={this.handleChangeUsername} required  style={inputStyle}/>
                        </label>
                    </ul>
                    <ul>
                        <label>
                        <Input type="password" placeholder ="Password" value={this.state.password} onChange={this.handleChangePassword} required  style={inputStyle}/>
                        </label>
                    </ul>
                
                    <div style={{ margin: 'auto', textAlign:'center'}}>
                        <Button  onClick={this.handleSubmit} text="Submit" variant="action" style={buttonStyle} />
                    </div>                    
                </Card.Body>
            </Card>
        </div>

    
        if (logInError) {
            result =   mainPage

        } else {
            result = logInPage
           
        }

        if (fetchError === 2 & logInError) {
            alert = <div style={{ margin: 'auto', height: '500px', width: '500px', textAlign:'left', position:'relative'}}>
                    <Layout style={{ margin: '50px', height: '500px', width: '500px' }} >
                        
                        <Card>
                            <Card.Body isContentCentered>
                                <ItemView displays={displays}/>
                                <hr style={{ border: '0 none', borderTop: '1px solid #c8cacb', boxSizing: 'border-box', height: '1px', margin: '0', }}/>
                                <ItemView displays={display0} />
                                <hr style={{ border: '0 none', borderTop: '1px solid #c8cacb', boxSizing: 'border-box', height: '1px', margin: '0', }}/>
                                <ItemView displays ={displayURL}/>
                            </Card.Body>
                        </Card>

                    </Layout>
               
           </div>
           
        } else if (fetchError === 1 & logInError) {
            alert = <div style={{paddingLeft: '300px'}}>
                <LabelValueView >
                    <ItemDisplay text="Failed to Fetch the data due to UnAuthorised request" textStyle="attention" icon={<IconAlert />} />
                </LabelValueView>
            </div>
        } else {
            alert = <div></div>
        }


      return (
         <div>
             {result}
          
             {alert}
         </div>

      );
    }
}

export default Login;

// <Badge  icon ={<IconAlert/>} size="large" text="Fetch failed due to unauthorized access" />