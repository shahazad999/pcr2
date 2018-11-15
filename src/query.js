import React, { Component } from 'react';
import Button from 'terra-button/lib/Button';
import Card from 'terra-card/lib/Card';
import Fieldset from 'terra-form-fieldset/lib/Fieldset';
import Input from 'terra-form-input';
import ApplicationMenuName from 'terra-application-name/lib/ApplicationMenuName';
import Image from 'terra-image';
import ItemView from 'terra-clinical-item-view/lib/ItemView';
import IconPerson from 'terra-icon/lib/icon/IconPerson';
import IconProvider from 'terra-icon/lib/icon/IconProvider';
import IconHospital from 'terra-icon/lib/icon/IconHospital';
import IconBriefcase from 'terra-icon/lib/icon/IconBriefcase';
import IconBedRequested from 'terra-icon/lib/icon/IconBedRequested';
import Layout from 'terra-layout/lib/Layout';
import img from './cerner.png';

class Query extends Component {
    constructor(){
        super();
        this.state ={
          'items': [], 'token' : '',  'id': '', 'filter': '',
          'auth' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDA0OTQyNzgsInVzZXJuYW1lIjoiUGF5ZXIiLCJvcmdOYW1lIjoiT3JnMiIsImlhdCI6MTU0MDQ1ODI3OH0.omc87LubpU4oV2xDdF3sGm3nQMM7iyzmQ-7zh5WhfO8', 
        
        }
        this.handleChange= this.handleChange.bind(this)
       
        this.handleSubmit = this.handleSubmit.bind(this)
      }
    
    
    
      fetchData() 
      {
        
        let config = {
          method: 'GET',
          headers: {
            'authorization': 'Bearer '+this.state.auth,
            'content-Type': 'application/json'
            
          },
          
        }
       
    
        fetch('http://localhost:4000' + '/channels/mychannel/chaincodes/medrecord?peer=peer0.org1.example.com&fcn=queryMedicalRecord&args=%5B%22'+this.state.token+'%22%5D', config)
          .then(response =>  response.json() )
          .then((response) => this.setState({ 'items' : response }));
          
    
      }

      handleChange(e) {
        this.setState({token: e.target.value});
      }

      handleChangeFilter(e) {
        this.setState({filter: e.target.value});
      }
    
      handleSubmit() {
        this.fetchData();
        //alert("Payer is not Authorized to get the data")
    
      }
    render() {
        const buttonStyle = { margin: '20px' };
        const feildStyle = { margin: '50px' };
        const inputStyle ={ height: '35px', margin: 'auto', width: '100%'};
        const display1 = <ItemView.Display icon={<IconPerson />} text={this.state.items.name} />;
        const display20 = <ItemView.Display text="Patient ID: " />;
        const display2 = <ItemView.Display text={this.state.items.id} />;
        const display21 =[display20, display2]
        const display30 = <ItemView.Display text="Name: " />;
        const display3 = <ItemView.Display text={this.state.items.name} />;
        const display31 =[display30, display3]
        const display40 = <ItemView.Display text="Weight:" />;
        const display4 = <ItemView.Display text={this.state.items.weight} />;
        const display41 =[display40, display4]
        const display50 = <ItemView.Display text="Age: " />;
        const display5 = <ItemView.Display text={this.state.items.age} />;
        const display51 =[display50, display5]
        const displays = [display1, display21, display31, display51];

        const display01 = <ItemView.Display icon={<IconBriefcase />} text="Clinical Data:"/>;
        const display011 = <ItemView.Display text="Weight: "/>;
        const display012 = <ItemView.Display text={this.state.items.weight}/>;
        const display00= [display011,display012]
        const display02 = <ItemView.Display icon={<IconHospital />} text="Hospital:"/>;
        const display03 = <ItemView.Display icon={<IconProvider />} text="Provideer ID:"/>;
        const display04 = <ItemView.Display icon={<IconBedRequested/>} text="Stay:"/>;
        const display0 =[display01,display00, display02, display03, display04];
        return (
        <div  style={{ margin: 'auto', height: '500px', width: '100%'}}> 
           
        <Fieldset legend="Query the Additional Clinical Information" legendAttrs={{ className: 'healtheintent-application' }} help="Enter a Valid Hash along with the required clinical information and Click Submit" isInline style={feildStyle} >
            
            <ul>
            <Input type="text" placeholder ="Hash" value={this.state.token} onChange={this.handleChange}  style={inputStyle}/>
                    
            </ul>
            <ul>
            <Input type="select" placeholder ="Filter" value={this.state.filter} onChange={this.handleChangeFilter}  style={inputStyle}/>
            </ul> 
                <Button color="success" size="lg" onClick={this.handleSubmit} text="Submit" variant="action" style={buttonStyle} />
        </Fieldset>
        <Layout style={{ margin: '50px', height: '400px', width: '400px' }} >
        <Card>
            <Card.Body isContentCentered>
            <ItemView displays={displays}/>
            <hr style={{ border: '0 none', borderTop: '1px solid #c8cacb', boxSizing: 'border-box', height: '1px', margin: '0', }}/>
            <ItemView displays={display0}/>
            </Card.Body>
        </Card>
        </Layout>


            
    
            

            </div>
                );
            }
}
export default Query;

/*<ul>
            <Input disabled value="payer0" name="disabled input" style={inputStyle}/>
            </ul> */