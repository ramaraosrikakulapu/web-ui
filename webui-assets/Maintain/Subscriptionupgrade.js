import React from "react";

import Subscriptionedit from './Subscriptionedit.js';

export default class Subscriptionupgrade extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            newTableData: [],
            viewTable: true,
            editItemData: {},
            searchString: '',
            showTableInit: false
        };
    }

    /* istanbul ignore next */
    componentDidMount() {
        this.handleDataTable(false);
    }

    /* istanbul ignore next */
    handleDataTable(preserveState) {
           let technicalTableData = [];
            if (sessionStorage.getItem("snapshotData") !== null) {
                    let respData =  JSON.parse(sessionStorage.getItem("snapshotData"))
                    let allData =[]
                      Object.keys(respData).forEach((key)=> {
                          allData.push(respData[key])
                      });
                      for(let individualData of allData){
                          if(individualData.parent){
                              if(individualData.parent ==="ab2a2691-a563-486c-9883-5111ff36ba9b"){
                                technicalTableData.push(individualData);
                              }
                          }
                      }
                    this.generateTableStructure(technicalTableData, preserveState);
                    this.setState({
                        tableData: technicalTableData
                    });
               
            }
            else {
                this.props.showGlobalMessage(true, true, 'Please try after sometime', 'custom-danger');
                setTimeout(()=> {
                    this.props.hideGlobalMessage();
                }, 2000);
            }
    }

    /* istanbul ignore next */
    generateTableStructure(technicalTableData, preserveState) {
        let tableData = technicalTableData;
        let newTableData = [];
        for (let dataObj of tableData) {
            let newDataObj = {};
            newDataObj.licenseId = dataObj.licenseId;
            newDataObj.emailAddress = dataObj.emailAddress;
            newDataObj.date = dataObj.date;
            newDataObj.sso = dataObj.sso;
            newDataObj.desc = dataObj.desc;
            newDataObj.username = dataObj.username;
            newDataObj.key = dataObj.key;
            newDataObj.parent = dataObj.parent;
            newDataObj.name = dataObj.name;
            newTableData.push(newDataObj);
        }

        this.setState({
            newTableData: newTableData,
            showTableInit: true
        });

        if (preserveState === true) {
            setTimeout(function () {
                window.initTable('subscriptionupgradeTable', true);
            }, 100);
        }
        else {
            setTimeout(function () {
                window.initTable('subscriptionupgradeTable', false);
            }, 100);
        }
    }

    /* istanbul ignore next */
    showHideTableTdData(objectIndex, fieldName) {
        let newTableData = [...this.state.newTableData];
        let copiedObjectToChange = Object.assign({}, newTableData[objectIndex]);
        if (fieldName === 'subscriptionId') {
            let tempValue = copiedObjectToChange.subscriptionId;
            copiedObjectToChange.subscriptionId = copiedObjectToChange.subscriptionIdHidden;
            copiedObjectToChange.subscriptionIdHidden = tempValue;
            copiedObjectToChange.subscriptionIdHiddenFlag = !copiedObjectToChange.subscriptionIdHiddenFlag;
            newTableData[objectIndex] = copiedObjectToChange;
        }
        else if (fieldName === 'serviceUri') {
            let tempValue = copiedObjectToChange.serviceUri;
            copiedObjectToChange.serviceUri = copiedObjectToChange.serviceUriHidden;
            copiedObjectToChange.serviceUriHidden = tempValue;
            copiedObjectToChange.serviceUriHiddenFlag = !copiedObjectToChange.serviceUriHiddenFlag;
            newTableData[objectIndex] = copiedObjectToChange;
        }

        else if (fieldName === 'subscriptionName') {
            let tempValue = copiedObjectToChange.subscriptionName;
            copiedObjectToChange.subscriptionName = copiedObjectToChange.subscriptionNameHidden;
            copiedObjectToChange.subscriptionNameHidden = tempValue;
            copiedObjectToChange.subscriptionNameHiddenFlag = !copiedObjectToChange.subscriptionNameHiddenFlag;
            newTableData[objectIndex] = copiedObjectToChange;
        }

        else if (fieldName === 'uaaUrl') {
            let tempValue = copiedObjectToChange.uaaUrl;
            copiedObjectToChange.uaaUrl = copiedObjectToChange.uaaUrlHidden;
            copiedObjectToChange.uaaUrlHidden = tempValue;
            copiedObjectToChange.uaaUrlHiddenFlag = !copiedObjectToChange.uaaUrlHiddenFlag;
            newTableData[objectIndex] = copiedObjectToChange;
        }

        this.setState({
            newTableData: newTableData
        });
    }

    /* istanbul ignore next */
    /*filterByValue(array, string) {
        return array.filter(o =>
            Object.keys(o).some((k) => {
                if(typeof o[k] != 'boolean'){
                    return o[k].toLowerCase().includes(string.toLowerCase());
                }
            }));
    }*/

    /* istanbul ignore next */
    filterByValue(myArray, string){
        let retArr = [];
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].licenseId.toLowerCase().includes(string.toLowerCase()) || myArray[i].emailAddress.toLowerCase().includes(string.toLowerCase()) || myArray[i].date.includes(string) || myArray[i].sso.includes(string) || myArray[i].username.includes(string) ) {
                retArr.push(myArray[i]);
            }
        }
        return retArr;
    }

    /* istanbul ignore next */
    filterData(e) {
        window.destroyDataTable('subscriptionupgradeTable');
        let searchStr = e.target.value.trim();
        let searchStrWithSp = e.target.value;
        let wholeData = [...this.state.tableData];
        let filteredData = [];
        let newTableData = [];
        if (searchStr != '') {
            filteredData = this.filterByValue(wholeData, searchStr);
            //console.log(filteredData);
        }
        else {
            filteredData = wholeData;
        }

        for (let dataObj of filteredData) {
            let newDataObj = {};
            newDataObj.licenseId = dataObj.licenseId;
            newDataObj.emailAddress = dataObj.emailAddress;
            newDataObj.date = dataObj.date;
            newDataObj.sso = dataObj.sso;
            newDataObj.desc = dataObj.desc;
            newDataObj.username = dataObj.username;

            newTableData.push(newDataObj);
        }

        this.setState({
            newTableData: newTableData,
            searchString: searchStrWithSp
        });

        setTimeout(function () {
            window.initTable('subscriptionupgradeTable', false);
        }, 0);
    }

    /* istanbul ignore next */
    edit(item) {
        let editItem = Object.assign({}, item);
       /*  if(editItem.subscriptionIdHiddenFlag){
            editItem.subscriptionId = editItem.subscriptionIdHidden;
        }
        if(editItem.serviceUriHiddenFlag){
            editItem.serviceUri = editItem.serviceUriHidden;
        }
        if(editItem.subscriptionNameHiddenFlag){
            editItem.subscriptionName = editItem.subscriptionNameHidden;
        }
        if(editItem.uaaUrlHiddenFlag){
            editItem.uaaUrl = editItem.uaaUrlHidden;
        } */
        window.destroyDataTable('subscriptionupgradeTable');
        this.setState({
            editItemData: editItem,
            viewTable: false
        });
    }

    /* istanbul ignore next */
    deleteData(tbodyVal, rowIndex) {
        let cnf = window.confirm('Are you sure you want to delete');
        if (cnf) {
            let subscripnId = tbodyVal.subscriptionId;
            if(tbodyVal.subscriptionIdHiddenFlag){
                subscripnId = tbodyVal.subscriptionIdHidden;
            }
            this.props.showGlobalMessage(true, true, 'Please Wait....', 'custom-success');
            fetch(this.props.baseUrl + tbodyVal.key, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.props.authToken
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((respData) => {
                     /*    if (respData.errorStatus.status === 'ok') { */
                            this.props.showGlobalMessage(false, true, 'Record deleted successfuly', 'custom-success');
                            window.removeDataTableRow('subscriptionupgradeTable', rowIndex);
                            let that = this;
                            setTimeout(function () {
                                that.props.hideGlobalMessage();
                            }, 2000);
                           that.snapshotUpdate();
                     /*    }
                        else{
                            this.props.showGlobalMessage(true, true, respData.errorStatus.statusMsg, 'custom-danger');
                            setTimeout(()=> {
                                this.props.hideGlobalMessage();
                            }, 2000);
                        }*/
                    });
                }
                else {
                    this.props.showGlobalMessage(true, true, 'Please try after sometime', 'custom-danger');
                    let that = this;
                    setTimeout(function () {
                        that.props.hideGlobalMessage();
                    }, 2000);
                }
            })
            .catch((err) => {
                console.log(err);
                this.props.showGlobalMessage(true, true, 'Please try after sometime', 'custom-danger');
                setTimeout(()=> {
                    this.props.hideGlobalMessage();
                }, 2000);
            });
        }
    }
    
    /* istanbul ignore next */ 
    snapshotUpdate(){
        fetch(this.props.baseUrl + "snapshot", {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + this.props.authToken,
            }
          })
        .then((response) => {
            if (response.status === 200) {
              response.json().then((respData) => {
                sessionStorage.setItem("snapshotData", JSON.stringify(respData))
        })
        }})
    }

    /* istanbul ignore next */
    changeView() {
        this.handleDataTable(false);
        this.setState({
            viewTable: true
        });
        setTimeout(function () {
            window.initTable('subscriptionupgradeTable', true);
        }, 0);
    } // jshint ignore:line
    
    
    render(){
        /* jshint ignore:start */
        /* istanbul ignore next */
        return (
            <div>
                {this.state.viewTable ?
                    <div className="row Subscriptionupgrade">
                        <div className="col-md-12">
                            <div className="row mt-2">
                                <div className="col-sm-6 text-left">
                                    <div className="d-inline">
                                        <button type="button" className="btn btn-sm btn-outline-secondary disabled">
                                            <i className="fa fa-filter"></i>
                                            FILTER
                                </button>
                                    </div>
                                    <div className="d-inline p-2">
                                        <input
                                            type="text"
                                            value={this.state.searchString}
                                            className="d-inline form-control form-control-sm search-field"
                                            onChange={(event) => { this.filterData(event) }} />
                                    </div>
                                </div>
                            </div>
                            <div className="centered-div">
                                <div id="subscriptionupgradeTableDiv">
                                    { this.state.showTableInit ? 
                                        this.state.newTableData.length > 0 ?
                                            <table id="subscriptionupgradeTable" className="table">
                                                <thead>
                                                    <tr>
                                                    <th>License ID</th>
                                                    <th>Email Address</th>
                                                    <th>Expiry Date</th>
                                                    <th>SSO</th>
                                                    <th>Actions</th>
                                                        {/* <th>Subscription ID</th>
                                                        <th>Service Uri</th>
                                                        <th>Subscription Name</th>
                                                        <th>OAuth Provider</th>
                                                        <th>Owner</th>
                                                        <th>Application Role</th>
                                                        <th>Actions</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                    this.state.newTableData.map((tbodyVal, tbodyIndex) => {
                                                            return (
                                                                <tr id={'subscriptionupgradeTableTbodyTr_' + tbodyIndex} key={'subscriptionupgradeTableTbodyTr_' + tbodyIndex}>
                                                                  {/*   <td>
                                                                        {tbodyVal.subscriptionId}&nbsp;&nbsp;
                                                                        {tbodyVal.subscriptionIdHiddenFlag ?
                                                                            <img onClick={this.showHideTableTdData.bind(this, tbodyIndex, 'subscriptionId')} className="icon-arrowmore" alt="td-detail" src="assets/static/images/icon_arrowmore.svg" /> :
                                                                            null
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {tbodyVal.serviceUri}&nbsp;&nbsp;
                                                                        {tbodyVal.serviceUriHiddenFlag ?
                                                                            <img onClick={this.showHideTableTdData.bind(this, tbodyIndex, 'serviceUri')} className="icon-arrowmore" alt="td-detail" src="assets/static/images/icon_arrowmore.svg" /> :
                                                                            null
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {tbodyVal.subscriptionName}&nbsp;&nbsp;
                                                                        {tbodyVal.subscriptionNameHiddenFlag ?
                                                                            <img onClick={this.showHideTableTdData.bind(this, tbodyIndex, 'subscriptionName')} className="icon-arrowmore" alt="td-detail" src="assets/static/images/icon_arrowmore.svg" /> :
                                                                            null
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {tbodyVal.uaaUrl}&nbsp;&nbsp;
                                                                        {tbodyVal.uaaUrlHiddenFlag ?
                                                                            <img onClick={this.showHideTableTdData.bind(this, tbodyIndex, 'uaaUrl')} className="icon-arrowmore" alt="td-detail" src="assets/static/images/icon_arrowmore.svg" /> :
                                                                            null
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {tbodyVal.owner}
                                                                    </td>
                                                                    <td>
                                                                        {tbodyVal.role}
                                                                    </td> */}
                                                                    <td>{tbodyVal.licenseId}</td>
                                                                    <td>{tbodyVal.emailAddress}</td>
                                                                    <td>{tbodyVal.date}</td>
                                                                    <td>{tbodyVal.sso}</td>
                                                                    <td>
                                                                        <span className="action-img">
                                                                            { this.props.permissions.accesses.maintain.subMenus.subscriptions.edit ?
                                                                                <img onClick={this.edit.bind(this, tbodyVal)} alt="edit-icon" title="Edit" src="assets/static/images/iconedit_tablemaintainmonitor.svg" />
                                                                                :
                                                                                null
                                                                            }
                                                                            { this.props.permissions.accesses.maintain.subMenus.subscriptions.delete ?
                                                                                <img alt="delete-icon" onClick={this.deleteData.bind(this, tbodyVal, tbodyIndex)} title="Delete" src="assets/static/images/icondelete_tablemaintainmonitor.svg" />
                                                                                :
                                                                                null
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table> :
                                            <div className="row mt-2">
                                                <div className="col-md-12">
                                                    <div className="alert alert-success" role="alert">
                                                        No record found!
                                                    </div>
                                                </div>
                                            </div>
                                        :
                                        <p className="text-center loader-icon">
                                            <img alt="loading" src="assets/static/images/rolling.svg" />
                                        </p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <Subscriptionedit
                        authToken={this.props.authToken}
                        helpText={this.props.helpText}
                        handleDataTable={this.handleDataTable.bind(this)}
                        baseUrl={this.props.baseUrl}
                        userId={this.props.userId}
                        showGlobalMessage={this.props.showGlobalMessage.bind(this)}
                        hideGlobalMessage={this.props.hideGlobalMessage.bind(this)}
                        changeView={this.changeView.bind(this)}
                        editItemData={this.state.editItemData}
                        isViewOnly={false}
                    ></Subscriptionedit>
                }
            </div>
        )
        /* jshint ignore:end */
    }
}
