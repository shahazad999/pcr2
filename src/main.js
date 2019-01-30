import React, { Component } from 'react';
import Button from 'terra-button/lib/Button';
import Card from 'terra-card/lib/Card';
import Input from 'terra-form-input';
import img from './cerner.png';
import Image from 'terra-image';
import IconAlert from 'terra-icon/lib/icon/IconAlert'
import LabelValueView from 'terra-clinical-label-value-view/lib/LabelValueView';
import ItemDisplay from 'terra-clinical-item-display';
import Checkbox from 'terra-form-checkbox';
import Divider from 'terra-divider';
import DynamicGrid from 'terra-dynamic-grid/lib/DynamicGrid';
import config from './config';
import Select from 'react-select';
import Radio from 'terra-form-radio'

// dividng the regions in the webpage
const template = {
    'grid-template-columns': '1fr 1fr',
    'grid-template-rows': 'auto',
    'grid-gap': '1px',
};

const region1 = {
    'grid-column-start': 1,
    'grid-row-start': 2,
};

const region2 = {
    'grid-column-start': 2,
    'grid-row-start': 2,
};
const region3 = {
    'grid-column-start': 1,
    'grid-column-end': 3,
    'grid-row-start': 1,
};


class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'username': 'PM74543', 'password': '', isLoggedIn: false, isUserValid: false, isAdmin: false,
            'items': [], 'hash': '', 'id': '', hostIP: config.hostIP, port: config.port, channelName: config.channelName, chaincodeName: config.chaincodeName, peerName: config.peerName,
            'auth': config.authToken,
            'toutput': [], 'foutput': [], view: false, disableHashInput: false,disableFilterSelection: false,
            fhirUrl: '', Holder: 'Enter a valid Hash provided in the claim',
            fhirResponse: [{resource: { resourceType: '' , code: '', category:'' , name: [{}], medicationCodeableConcept: {}}}],
            totalFhirResponse: '', submitersFilters: [
                "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Patient?_id=1316024",
                "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Procedure?patient=1316024",
                "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Observation?patient=1316024",
                "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/DiagnosticReport?patient=1316024",
                "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/DocumentReference?patient=1316024",
                "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationOrder?patient=1316024"
              ], 
            selectedAnswers: [], isOpen: false, selectedClinicalInfoType: ''
        }
        
        this.handleChangeUsername = this.handleChangeUsername.bind(this)
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.handleChangeHash = this.handleChangeHash.bind(this)
        this.handleSubmitQuery = this.handleSubmitQuery.bind(this)
        this.reset = this.reset.bind(this)
    }

    componentDidUpdate() {
        var { hash, Holder } = this.state;
        var len = hash.length;
        //Fetch blockchain function triggered hash lenght is met
        if (len > 33) {
            this.fetchHashValid()
        }
        //When no Checkbox is selected  
     /*    const { selectedAnswers, view } = this.state;
        if (selectedAnswers.length === 0 && view) {
            this.setState({ view: false })
        } */
        //Restric Input to checkbox when the data extracted
        if (Holder.length === 34 && hash.length !== 0) {
            this.setState({ hash: '' })
        }
    }

    handleChangeUsername(e) {
        this.setState({ username: e.target.value });
    }
    handleChangePassword(e) {
        this.setState({ password: e.target.value });
    }
    handleSubmit() {
        //Check the password
        const { password} = this.state;

        //Check the USER in blockchain 
        if ((password === 'blockchain')) {
            this.fetchUser()
        } else {
            this.setState({ isLoggedIn: false })
            alert("Invalid Pasword")
        }

    }
    handleLogout() {
        this.setState({ isLoggedIn: false, isUserValid: false, fhirUrl: '', username: '', password: '', 'items': [], 'hash': '', fetchURL: '', fhirResponse: '', selectedAnswers: [], Holder: 'Enter a valid Hash provided in the claim', view: false })
    }
    handleChangeHash(e) {
        this.setState({ hash: e.target.value });
    }
    handleSubmitQuery() {
        this.fetchURL();
    }
    //A Reset Button that that Refreshes for new Search
    reset() {
        this.setState({ fhirUrl: '', disableHashInput: false, 'items': [], 'hash': '', fhirResponse: [{resource: { resourceType: '' , code: '', category:'' , name: [{}], medicationCodeableConcept: {}}}], selectedAnswers: [], Holder: 'Enter a valid Hash provided in the claim', view: false, submitersFilters: [], selectedClinicalInfoType: '' })
    }

    /**********************************
     * Fetch the data from blockchain
     **********************************/
    fetchData() {
        let config = {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + this.state.auth,
                'content-Type': 'application/json'
            },
        }
        // eslint-disable-next-line
        fetch('http://' + this.state.hostIP + ':' + this.state.port + '' + '/channels/' + this.state.channelName + '/chaincodes/' + this.state.chaincodeName + '?peer=' + this.state.peerName + '&fcn=queryCustom&args=%5B%22%7B%5C%22selector%5C%22:%7B%5C%22_rev%5C%22:%5C%22' + this.state.hash + '%5C%22,%5C%22payerId%5C%22:%5C%22' + this.state.username + '%5C%22%7D%7D%22%5D', config)
            .then(response => response.json())
            .then(response => {
                if (JSON.stringify(response) === '[]') {
                    this.setState({ 'items': [] })
                } else {
                    this.setState({ 'items': response, fhirUrl: response.Record.fhirUrl, 'submitersFilters': response.Record.fhirUrl, hash: '', Holder: this.state.hash, disableHashInput: true })
                }
            })

    }

    /*********************************************
     * Hash is validated before fetching the data
     *********************************************/
    fetchHashValid() {
        let config = {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + this.state.auth,
                'content-Type': 'application/json'
            },
        }
        // eslint-disable-next-line
        fetch('http://' + this.state.hostIP + ':' + this.state.port + '' + '/channels/' + this.state.channelName + '/chaincodes/' + this.state.chaincodeName + '?peer=' + this.state.peerName + '&fcn=isValid&args=%5B%22hash%22,%22' + this.state.hash + '%22%5D', config)
            .then(response => response.text())
            .then(response => {
                if (response.length === 0 && response[0] !== 'E') {
                    this.fetchData()
                }
            })
            .catch(err => console.log(err))
    }
    /***********************************************************************
     * This fetches the USER in Blockchain network to authenticate the LOGIN
     ***********************************************************************/
    fetchUser() {
        let config = {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + this.state.auth,
                'content-Type': 'application/json'
            },
        }
        // eslint-disable-next-line
        fetch(/* 'http://' + this.state.hostIP + ':' + this.state.port + '' */'/api' + '/channels/' + this.state.channelName + '/chaincodes/' + this.state.chaincodeName + '?peer=' + this.state.peerName + '&fcn=isValid&args=%5B%22payer%22,%22' + this.state.username + '%22%5D', config)
            .then(response => response.text())
            .then(response => {
                if (response.length === 0 && response[0] !== 'E') {
                    this.setState({ isUserValid: true, isLoggedIn: true })
                } else {
                    this.setState({ isUserValid: false })
                    alert("User did not registerd for Blockchain Service")
                }
            })
            .catch(err => console.log(err))
    }
    
    /******************************************************************
     * Fetches data from the FHIR URl that recived from the blockchain 
     *****************************************************************/
    fetchURL(event) {
        const fhirUrl = this.state.fhirUrl
        const prefix = "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/"
        const postfix = "?patient=1316020"
        let config = {
            method: 'GET',
            headers: {
                'Accept': 'application/json+fhir'
            },
        }
        fetch(event, config)
            .then(response => response.json())
            .then((response) => this.setState({ fhirResponse: response.entry, totalFhirResponse: response }));

    }

    /**
     * Fetch Submitters Allowed COmponenets
     */

    fetchSubmittersAllowedComponenets(){
        let config = {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + this.state.auth,
                'content-Type': 'application/json'
            },
        }
        // eslint-disable-next-line
        fetch('http://' + this.state.hostIP + ':' + this.state.port + '' + '/channels/' + this.state.channelName + '/chaincodes/' + this.state.chaincodeName + '?peer=' + this.state.peerName + '&fcn=isValid&args=%5B%22hash%22,%22' + this.state.hash + '%22%5D', config)
            .then(response => response.text())
            .then(response => {
               this.setState({ submitersFilters : response.fhir})
            })
            .catch(err => console.log(err))
    }
    



    render() {
        const buttonStyle = { margin: '5px' };
        var fhirResponse = this.state.fhirResponse;
        const { view, selectedAnswers } = this.state;
        const submitersFilters =this.state.submitersFilters;

        /**
         * Merge Duplicates
         */
        var seen = {};
        if (fhirResponse[0].resource.resourceType === "MedicationOrder") {
            fhirResponse = fhirResponse.filter(function (entry) {
                var previous;

                if (seen.hasOwnProperty(entry.resource.medicationCodeableConcept.text)) {

                    previous = seen[entry.resource.medicationCodeableConcept.text];
                    previous.resource.text.div.push(entry.resource.text.div);
                    return false;
                }

                if (!Array.isArray(entry.resource.text.div)) {
                    entry.resource.text.div = [entry.resource.text.div];
                }
                seen[entry.resource.medicationCodeableConcept.text] = entry;
                return true;
            });
        } else if ( fhirResponse[0].resource.resourceType === "DocumentReference") {
            fhirResponse = this.state.fhirResponse.filter(function (entry) {
                var previous;

                if (seen.hasOwnProperty(entry.resource.description)) {
                    previous = seen[entry.resource.description];
                    previous.resource.text.div.push(entry.resource.text.div);

                    return false;
                }

                if (!Array.isArray(entry.resource.text.div)) {
                    entry.resource.text.div = [entry.resource.text.div];
                }

                seen[entry.resource.description] = entry;

                return true;
            });
        } else if ( fhirResponse[0].resource.resourceType === "Procedure" || fhirResponse[0].resource.resourceType === "DiagnosticReport") {
            fhirResponse = fhirResponse.filter(function (entry) {
                var previous;

                if (seen.hasOwnProperty(entry.resource.code.text)) {

                    previous = seen[entry.resource.code.text];
                    previous.resource.text.div.push(entry.resource.text.div);
                    return false;
                }

                if (!Array.isArray(entry.resource.text.div)) {
                    entry.resource.text.div = [entry.resource.text.div];
                }

                seen[entry.resource.code.text] = entry;

                return true;
            });
        }else if ( fhirResponse[0].resource.resourceType === "Observation" ) {
            fhirResponse = fhirResponse.filter(function (entry) {
                var previous;

                if (seen.hasOwnProperty(entry.resource.category.text.substr())) {

                    previous = seen[entry.resource.category.text];
                    previous.resource.text.div.push(entry.resource.text.div);

                    return false;
                }

                if (!Array.isArray(entry.resource.text.div)) {
                    entry.resource.text.div = [entry.resource.text.div];
                }

                seen[entry.resource.category.text] = entry;
                 return true;
            });
        }

        /*********
         * Headers
         *********/

        const Header = <div style={{ border: '1px solid lightGray', backgroundColor: '#2481ca', width: '100%', height: '50px', position: 'relative' }} >
            <Image src={img} height="100px" width="100px" isFluid style={{ margin: '12px', float: 'left' }} />
            <h3 style={{ float: 'left', color: 'white', margin: '15px', position: 'relative' }}> Payer Chart Review</h3>
        </div>
        const loggedInHeader = <div style={{ border: '1px solid lightGray', backgroundColor: '#2481ca', width: '100%', height: '50px', position: 'relative' }} >
            <Image src={img} height="100px" width="100px" isFluid style={{ margin: '12px', float: 'left' }} />
            <h3 style={{ float: 'left', color: 'white', margin: '15px' }}> Payer Chart Review</h3>
            <Button onClick={this.handleLogout} text="Log Out" variant="emphasis" style={{ float: 'right', height: '45px', position: 'relative' }} />
        </div>


        /**
         * Selecting the Filtering Componencts
         */

      /*   const submiterfilterkeyname = ( Object.entries(submitersFilters).map(key => key[1].substr(79,  key[1].length-79-16)))
        if (submiterfilterkeyname === "Pat"){
            var DisplayKey = "Demographics"
        }else{
            var DisplayKey = submiterfilterkeyname
        } */
        const componenetSelection = Object.entries(submitersFilters).map(key =>{
            let DispalyKey;
            if (key[1].substr(79,  key[1].length-79-16) === "Pat"){
                 DispalyKey = "Demographics"
            }else if (key[1].substr(79,  key[1].length-79-16) === "DiagnosticReport"){
                DispalyKey = "Diagnostic Report"
            }else if (key[1].substr(79,  key[1].length-79-16) === "DocumentReference"){
                DispalyKey = "Document Reference"
            }else if (key[1].substr(79,  key[1].length-79-16) === "MedicationOrder"){
                DispalyKey = "Medication Order"
            }else {
                 DispalyKey = (key[1].substr(79,  key[1].length-79-16))
            }
            
            const outputing =  <div style={{ margin: 'auto', position: 'relative', paddingLeft: '20px' }}>
                <React.Fragment key={key}>
                    <div style={{ width: '500px', margin: 'auto', fontSize: '20px', float: "right" }}>
{/*                         <Checkbox id="Data" name="filter" checked={this.state.disableFilterSelection} disabled= {this.state.disableFilterSelection}  labelText= {key[1].substr(79,  key[1].length-79-16)} onChange={(e) => {
                            // eslint-disable-next-line
                            this.fetchURL(key[1]); this.setState({selectedClinicalInfoType: key[1].substr(79,  key[1].length-79-16) });
                            this.setState({disableFilterSelection: true})
                            if (key[1].substr(79,  key[1].length-79-16 ) === "Pat"){

                            }

                        }} /> */}
                        <Radio id="first-radio" labelText={DispalyKey} name="example"onChange={(e) => {
                            // eslint-disable-next-line
                            this.fetchURL(key[1]); this.setState({selectedClinicalInfoType: key[1].substr(79,  key[1].length-79-16) });
                            this.setState({disableFilterSelection: true, fhirResponse: [{resource: { resourceType: '' , code: '', category:'' , name: [{}], medicationCodeableConcept: {}}}]})
                            

                        }}  />
                    </div>
                </React.Fragment>
            </div>
            return outputing;
        }
         
        )
        let componenetSelections;
        if (submitersFilters.length >0) {
             componenetSelections = <div>
                 <p><b>Select the type of Clinical Info you want to view</b></p>
                 {componenetSelection}
             </div> 
        }else {
            
        }



        /********************************************************************************
         * Checkbox UI to select the key vlaues to be displayed and push selected elemets to array
         *********************************************************************************/



        let checkBoxSelections;
        const selectedClinicalInfoType = this.state.selectedClinicalInfoType;
        if (fhirResponse.length >0 && (selectedClinicalInfoType === 'Procedure'  || selectedClinicalInfoType === 'DiagnosticReport' ) ) {
            const checkBoxSelectionForProcedureorObservation = Object.entries(fhirResponse).map(key =>
                <div style={{ margin: 'auto', position: 'relative', paddingLeft: '20px' }}>
                
                    <React.Fragment key={key}>
                    
                        <div style={{ width: '500px', margin: 'auto', fontSize: '20px', float: "right" }}>
                            <Checkbox id="Data" name="filter"  /* disabled={this.state.view} */ labelText={key[1].resource.code.text} onChange={(e) => {
                                // eslint-disable-next-line
                                var jsonArg1 = new Object();
                                jsonArg1.name = key[1].resource.resourceType + key[1].resource.id;
                                jsonArg1.value = key[1].resource.text.div;
                                jsonArg1.info = key[1].resource.meta.lastUpdated;
                                jsonArg1.patientInfo = key[1].resource.subject;
                                const { selectedAnswers } = this.state;
                                if (e.currentTarget.checked) {
                                    selectedAnswers.push(jsonArg1);
                                } else if (!e.currentTarget.checked) {
                                    for(var i = selectedAnswers.length - 1; i >= 0; i--) {
                                        if(JSON.stringify(selectedAnswers[i]) === JSON.stringify(jsonArg1)) {
                                            selectedAnswers.splice(i, 1);
                                        }
                                    }
                                    //selectedAnswers.splice(index, 1);
                                    
                                }
                                this.setState({ selectedAnswers });
                            }} />
                        </div>
                    </React.Fragment>
                </div>
            )
            if (fhirResponse.length >0 && (selectedClinicalInfoType === 'Procedure' )){
                checkBoxSelections = <div >
                <p ><b>Select the Clinical Procedures you want to view</b></p>
                {checkBoxSelectionForProcedureorObservation}
            </div> 
            } else {
                checkBoxSelections = <div >
                <p ><b>Select the Clinical Diagnostic Report you want to view</b></p>
                {checkBoxSelectionForProcedureorObservation}
            </div> 
            }
           
        }else if (fhirResponse.length >0 && (selectedClinicalInfoType === 'MedicationOrder' ) ){
            const checkBoxSelectionForMedicationOrder = Object.entries(fhirResponse).map(key =>
                <div style={{ margin: 'auto', position: 'relative', paddingLeft: '20px' }}>
                
                    <React.Fragment key={key}>
                    
                        <div style={{ width: '500px', margin: 'auto', fontSize: '20px', float: "right" }}>
                            <Checkbox id="Data" name="filter" /* disabled={this.state.view} */ labelText={key[1].resource.medicationCodeableConcept.text} onChange={(e) => {
                                // eslint-disable-next-line
                                var jsonArg1 = new Object();
                                jsonArg1.name = key[1].resource.resourceType + key[1].resource.id;
                                jsonArg1.value = key[1].resource.text.div;
                                jsonArg1.info = key[1].resource.meta.lastUpdated;
                                jsonArg1.patientInfo = key[1].resource.subject;
                                const { selectedAnswers } = this.state;
                                if (e.currentTarget.checked) {
                                    selectedAnswers.push(jsonArg1);
                                } else if (!e.currentTarget.checked) {
                                    for(var i = selectedAnswers.length - 1; i >= 0; i--) {
                                        if(JSON.stringify(selectedAnswers[i]) === JSON.stringify(jsonArg1)) {
                                            selectedAnswers.splice(i, 1);
                                        }
                                    }
                                }
                                this.setState({ selectedAnswers });
                            }} />
                        </div>
                    </React.Fragment>
                </div>
            )
            checkBoxSelections = <div>
                 <p><b>Select the Medication Order Info you want to view</b></p>
                 {checkBoxSelectionForMedicationOrder}
             </div> 
        }else if (fhirResponse.length >0 && (selectedClinicalInfoType === 'DocumentReference' ) ){
            const checkBoxSelectionForDocumentReference = Object.entries(fhirResponse).map(key =>
                <div style={{ margin: 'auto', position: 'relative', paddingLeft: '20px' }}>
                
                    <React.Fragment key={key}>
                    
                        <div style={{ width: '500px', margin: 'auto', fontSize: '20px', float: "right" }}>
                            <Checkbox id="Data" name="filter" /* disabled={this.state.view} */ labelText={key[1].resource.description} onChange={(e) => {
                                // eslint-disable-next-line
                                var jsonArg1 = new Object();
                                jsonArg1.name = key[1].resource.resourceType + key[1].resource.id;
                                jsonArg1.value = key[1].resource.text.div;
                                jsonArg1.info = key[1].resource.meta.lastUpdated;
                                jsonArg1.patientInfo = key[1].resource.subject;
                                const { selectedAnswers } = this.state;
                                if (e.currentTarget.checked) {
                                    selectedAnswers.push(jsonArg1);
                                } else if (!e.currentTarget.checked) {
                                    for(var i = selectedAnswers.length - 1; i >= 0; i--) {
                                        if(JSON.stringify(selectedAnswers[i]) === JSON.stringify(jsonArg1)) {
                                            selectedAnswers.splice(i, 1);
                                        }
                                    }
                                }
                                this.setState({ selectedAnswers });
                            }} />
                        </div>
                    </React.Fragment>
                </div>
            )
            checkBoxSelections = <div>
                 <p><b>Select the Clinical Document Reference Info you want to view</b></p>
                 {checkBoxSelectionForDocumentReference}
             </div> 
        } else if (fhirResponse.length >0 && (selectedClinicalInfoType === 'Pat' ) ){

            const checkBoxSelectionForPatDemographics = Object.entries(fhirResponse).map(key =>
                <div style={{ margin: 'auto', position: 'relative', paddingLeft: '20px' }}>
                
                    <React.Fragment key={key}>
                    
                        <div style={{ width: '500px', margin: 'auto', fontSize: '20px', float: "right" }}>
                            <Checkbox id="Data" name="filter" /* disabled={this.state.view} */ labelText={key[1].resource.name[0].text} onChange={(e) => {
                                // eslint-disable-next-line
                                var jsonArg1 = new Object();
                                jsonArg1.name = key[1].resource.resourceType + key[1].resource.id;
                                jsonArg1.value = key[1].resource.text.div;
                                jsonArg1.info = key[1].resource.meta.lastUpdated;
                                
                                const { selectedAnswers } = this.state;
                                if (e.currentTarget.checked) {
                                    selectedAnswers.push(jsonArg1);
                                } else if (!e.currentTarget.checked) {
                                    for(var i = selectedAnswers.length - 1; i >= 0; i--) {
                                        if(JSON.stringify(selectedAnswers[i]) === JSON.stringify(jsonArg1)) {
                                            selectedAnswers.splice(i, 1);
                                        }
                                    }
                                }
                                this.setState({ selectedAnswers });
                            }} />
                        </div>
                    </React.Fragment>
                </div>
            )
            checkBoxSelections = <div>
                 <p><b>Demographic Details of Patient</b></p>
                 {checkBoxSelectionForPatDemographics}
             </div> 


        } else if (fhirResponse.length >0 && ( selectedClinicalInfoType === 'Observation'  ) ) {
            const checkBoxSelectionForProcedureorObservation = Object.entries(fhirResponse).map(key =>
                <div style={{ margin: 'auto', position: 'relative', paddingLeft: '20px' }}>
                
                    <React.Fragment key={key}>
                    
                        <div style={{ width: '500px', margin: 'auto', fontSize: '20px', float: "right" }}>
                            <Checkbox id="Data" name="filter" /* disabled={this.state.view} */ labelText={key[1].resource.category.text} onChange={(e) => {
                                // eslint-disable-next-line
                                var jsonArg1 = new Object();
                                jsonArg1.name = key[1].resource.resourceType + key[1].resource.id;
                                jsonArg1.value = key[1].resource.text.div;
                                jsonArg1.info = key[1].resource.meta.lastUpdated;
                                jsonArg1.patientInfo = key[1].resource.subject;
                                const { selectedAnswers } = this.state;
                                if (e.currentTarget.checked) {
                                    selectedAnswers.push(jsonArg1);
                                } else if (!e.currentTarget.checked) {
                                    for(var i = selectedAnswers.length - 1; i >= 0; i--) {
                                        if(JSON.stringify(selectedAnswers[i]) === JSON.stringify(jsonArg1)) {
                                            selectedAnswers.splice(i, 1);
                                        }
                                    }
                                }
                                this.setState({ selectedAnswers });
                            }} />
                        </div>
                    </React.Fragment>
                </div>
            )
            checkBoxSelections = <div>
                 <p><b>Select the Clinical Observation Info you want to view</b></p>
                 {checkBoxSelectionForProcedureorObservation}
             </div> 
        
                        }   



        /*******************************************************************************
         * Display the final output retrived from FHIR after checkbox filtering only Entry
         ********************************************************************************/
        let finalOutput;
        if (view && selectedAnswers.length > 0) {
            finalOutput =
                <div style={{ margin: '5px' }}>
                    <Card >
                        <Card.Body >
                            <p><b>Additional Clinical Info:</b> </p>
                            {this.state.selectedAnswers.map(item => (
                                <React.Fragment key={item.name}>
                                    <ul>
                                        <div dangerouslySetInnerHTML={{ __html: item.value }} />
                                        
                                        <p><b>Last Updated:</b> {item.info}</p>
                                        <Divider />
                                    </ul>
                                </React.Fragment>))}
                        </Card.Body>
                    </Card>
                </div>
        } else {
            finalOutput = <div>
            </div>
        }

        /**************************************************************************************************
         * Dispaly the Button that fetches the fhirURL on Succsessfull retrivel of Fhir Url from blockchain
         **************************************************************************************************/
        let errorDialog;
        const { fhirUrl, hash } = this.state;
        if (fhirUrl.length > 10) {
            errorDialog = <Button color="success" size="lg" onClick={this.handleSubmitQuery} text="Search" variant="action" style={{ margin: '5px' }} />
        }
        //If cant fetch blockchain error is displayed saying invalid hash
        else if (fhirUrl.length < 10 && hash.length > 33) {
            errorDialog = <div>
                <LabelValueView >
                    <ItemDisplay text="Invalid or UnAuthorised Hash" textStyle="attention" icon={<IconAlert />} />
                </LabelValueView>
            </div>
        }
        //After succsess full fetch  
        if (submitersFilters.length > 1) {
            errorDialog = <Button color="success" size="lg" onClick={this.reset} text="Reset" variant="action" style={{ margin: '5px' }} />

        }

        /********************************************************************
         * View Button displayed only after a minimum of one filter selected
         *******************************************************************/
        let viewButton;
        if (selectedAnswers.length > 0) {
            viewButton =
                <div style={{ position: 'relative' }}>
                    <Button color="success" size="lg" onClick={() => { const x = this.state.view; this.setState({ view: !x }) }} text="View" variant="action" style={buttonStyle} />
                </div>

        } else {
            viewButton = <div>

            </div>
        }
        let viewButton2;
        if (selectedClinicalInfoType.length > 0) {
            viewButton2 =
                <div style={{ position: 'relative' }}>
                    <Button color="success" size="lg" onClick={() => { const x = this.state.disableFilterSelection; this.setState({ disableFilterSelection: !x }); this.setState({selectedClinicalInfoType: '', selectedAnswers: [], fhirResponse: [{resource: { resourceType: '' , code: '', category:'' , name: [{}], medicationCodeableConcept: {}}}]}) }} text="Select Another" variant="action" style={buttonStyle} />
                </div>

        } else {
            viewButton = <div>

            </div>
        }

        /****************
         * Login Page UI
         ****************/
        const logInPage = <div>
             {Header}
       
        <div style={{ margin: 'auto', height: '500px', width: '500px', textAlign: 'center', position: 'relative' }}>

            <Card style={{ margin: '50px' }}>
                <Card.Body>
                    <h1>LOGIN</h1>

                    <Input type="text" placeholder="PayerID" value={this.state.username} onChange={this.handleChangeUsername} required style={{ height: '35px', margin: '5px', width: '350px' }} />

                    <Input type="password" placeholder="Password" value={this.state.password} onChange={this.handleChangePassword} required style={{ height: '35px', margin: '5px', width: '350px' }} />

                    <div style={{ margin: 'auto', textAlign: 'center' }}>
                        <Button onClick={this.handleSubmit} text="Submit" variant="action" style={buttonStyle} />
                    </div>
                </Card.Body>
            </Card>
        </div>
        </div>
        /***************
         * Main Page UI 
         ***************/
        const mainPage = 
            <DynamicGrid defaultTemplate={template}>
                <DynamicGrid.Region defaultPosition={region3}>
                   {loggedInHeader}
                </DynamicGrid.Region>

                <DynamicGrid.Region defaultPosition={region1}>
                    <div style={{ height: '200px', position: 'absolute', paddingInlineStart: '50px' }}>
                        <div style={{ margin: 'auto', height: '200px', width: '500px' }}>
                            <p><b>Query the Additional Clinical Information</b></p>
                            Hash : <Input required type="text" placeholder={this.state.Holder} value={this.state.hash} onChange={this.handleChangeHash} style={{ margin: 'auto', width: '320px', height: '35px' }} />
                            {errorDialog}
                        </div>
                        <div style={{margin: '10px'}}>
                        {componenetSelections}
                        </div>
                        {/* <div style={{ float: "right" }}>
                            {viewButton2}
                        </div> */}
                        
                        {checkBoxSelections}
                        <div style={{ float: "right" }}>
                            {viewButton}
                        </div>
                    </div>
                </DynamicGrid.Region>
                <DynamicGrid.Region defaultPosition={region2}>
                    {finalOutput}
                </DynamicGrid.Region>
            </DynamicGrid>
        


        /*******************
         * Login Validation
         ********************/
        let result;
        const { isUserValid } = this.state;
        if (isUserValid) {
            result = mainPage

        } else {
            result = logInPage

        }


        /***********************************
         * Returning the Rendered Elements
         *************************************/
        return (
            <div>
                

{result}

                
            </div>
        );
    }
}
export default Main;
