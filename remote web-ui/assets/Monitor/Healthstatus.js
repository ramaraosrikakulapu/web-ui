import React from "react";

export default class Healthstatus extends React.Component {
  /* istanbul ignore next */
  constructor(props) {
    super(props);
    this.state = {
      gateway: "",
      selectedGateway: "",
      gateways: [],
      healthLink: "",
      session: {
        sessionId: "",
        id: "",
        bindId: "",
        targetId: "",
        groupId: "",
      },
      superConnection: {
        serverId: "",
        id: "",
        targetId: "",
        groupId: "",
        timeCreated: "",
        ip: "",
        lastPong: "",
      },
      connection: {
        bindId: "",
        clientConfiguration: "",
        id: "",
        bindId2: "",
        targetId: "",
        groupId: "",
        timeCreated: "",
        allocations: "",
        totalAllocations: "",
        frees: "",
        heapAlloc: "",
        heapInUse: "",
        heapReleased: "",
        heapObjects: "",
        report: "",
        lastUsage: "",
        lastReport: "",
      },
      gatewayDetails: {
        mode: "",
        environment: "",
        gatewayPort: "",
        zone: "",
        serviceUrl: "",
        token: "",
        host: "",
        os: "",
      },
      showSession: false,
      showConnection: false,
      showSuperConnection: false,
    };
  }

  /* istanbul ignore next */
  componentDidMount() {
    // get gateway list start
    fetch("https://jsonplaceholder.typicode.com/todos/1", {
      // Get gateways
      method: "GET",
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((gateways) => {
          gateways = [
            {
              gatewayId: "Gateway-10afc420-d8ad-41ec-8be6-6f723e6fb18a",
              serviceUrl:
                "https://b3a2e606-eaa8-4d3c-aadc-c27f12260a1b.run.aws-usw02-dev.ice.predix.io",
            },
            {
              gatewayId: "Gateway-d4b7844c-f9b2-4ab3-bab3-592b8ca1629d",
              serviceUrl:
                "https://b3a2e606-eaa8-4d3c-aadc-c27f12260a1b.run.aws-usw02-dev.ice.predix.io",
            },
          ];
          this.setState({
            gateways: gateways,
          });
        });
      }
    });

    //get session, connection, super connection

    /*let currentSession = Object.assign({}, this.state.session);
        let currentSuperConnection = Object.assign({},this.state.superConnection);
        let currentConnection = Object.assign({},this.state.connection)
        fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then((response) => {
            if (response.status === 200) {
                response.json().then((sessions) => {
                    this.props.showGlobalMessage(true, true, 'Please wait', 'custom-success');
                    sessions=[{
                        "sessionId" : "OfxhwZxbW61",
                        "id" : "OGhEuE1",
                        "bindId" : 'CejeRnKYuO1',
                        "targetId": 'value1',
                        "groupId" : 'smartshop-prod1',
                    }
                    ];
                    if(sessions.length > 0){
                        for(let session of sessions){
                            currentSession.sessionId = session.sessionId;
                            currentSession.id = session.id;
                            currentSession.bindId = session.bindId;
                            currentSession.targetId = session.targetId;
                            currentSession.groupId = session.groupId;
                        }
                        this.setState({
                            session : currentSession
                        })
                    }

                    fetch('https://jsonplaceholder.typicode.com/todos/1')
                    .then((response) => {
                    if (response.status === 200) {
                    response.json().then((superConnections) => {
                        superConnections=[{
                            "serverId" : "OGhEuE1",
                            "id" : "OGhEuE1",
                            "targetId" : "value1",
                            "groupId" : "smartshop-prod1",
                            "timeCreated" : "2019-11-13T22:05:38.101993815Z1",
                            "ip" : "10.72.1.16:613681",
                            "lastPong" : "0001-01-01T00:00:00Z1"
                        }
                        ];
                    if(superConnections.length > 0){
                        for(let superConnection of superConnections){
                            currentSuperConnection.serverId = superConnection.serverId;
                            currentSuperConnection.id = superConnection.id;
                            currentSuperConnection.targetId = superConnection.targetId;
                            currentSuperConnection.groupId = superConnection.groupId;
                            currentSuperConnection.timeCreated = superConnection.timeCreated;
                            currentSuperConnection.ip = superConnection.ip;
                            currentSuperConnection.lastPong = superConnection.lastPong;
                        }
                        this.setState({
                            superConnection : currentSuperConnection
                        })
                    }

                    fetch('https://jsonplaceholder.typicode.com/todos/1')
                    .then((response) => {
                        if (response.status === 200) {
                            response.json().then((connections) => {
                                connections=[{
                            "bindId" : "DstAet1",
                            "clientConfiguration" : "value1",
                            "id" : "087ADA1",
                            "bindId2" : "0074C51",
                            "targetId" : "OGhEuE1",
                            "groupId" : "smartshop-prod1",
                            "timeCreated" : "2019-11-13T22:05:38.101993815Z1",
                            "allocations" : "29037761",
                            "totalAllocations" : "250076241",
                            "frees" : "3943151",
                            "heapAlloc" : "29037761",
                            "heapInUse" : "51855361",
                            "heapReleased" : "602030081",
                            "heapObjects" : "202241",
                            "report" : "value1",
                            "lastUsage" : "9871",
                            "lastReport" : "0001-01-01T00:00:00Z1",
                        }
                        ];
                        if(connections.length > 0){
                            for(let connection of connections){
                                currentConnection.bindId = connection.bindId;
                                currentConnection.clientConfiguration = connection.clientConfiguration;
                                currentConnection.id = connection.id;
                                currentConnection.bindId2 = connection.bindId2;
                                currentConnection.targetId = connection.targetId;
                                currentConnection.groupId = connection.groupId;
                                currentConnection.timeCreated = connection.timeCreated;
                                currentConnection.allocations = connection.allocations;
                                currentConnection.totalAllocations = connection.totalAllocations;
                                currentConnection.frees = connection.frees;
                                currentConnection.heapAlloc = connection.heapAlloc;
                                currentConnection.heapInUse = connection.heapInUse;
                                currentConnection.heapReleased = connection.heapReleased;
                                currentConnection.heapObjects = connection.heapObjects;
                                currentConnection.report = connection.report;
                                currentConnection.lastUsage = connection.lastUsage;
                                currentConnection.lastReport = connection.lastReport;
                            }
                            this.setState({
                                connection : currentConnection
                            })
                            let that= this;
                            that.props.hideGlobalMessage();
                            }});
                        }})  
                    });}
                })     
            });}
        })
        .catch((err) => {
            console.log(err);
            this.props.showGlobalMessage(true, true, 'Error', 'custom-danger');
                            let that= this;
                            setTimeout(function () {
                                that.props.hideGlobalMessage();
                            }, 2000);
        });*/
  }

  /* istanbul ignore next */
  handleChange(e) {
    let id = e.target.id;

    if (id === "session") {
      let currentShowSession = this.state.showSession;
      this.setState({
        showSession: !currentShowSession,
      });
    }
    if (id === "superConnection") {
      let currentSuperConnection = this.state.showSuperConnection;
      this.setState({
        showSuperConnection: !currentSuperConnection,
      });
    }
    if (id === "connections") {
      let currentConnection = this.state.showConnection;
      this.setState({
        showConnection: !currentConnection,
      });
    }
  }

  /* istanbul ignore next */
  fetchHealthStatus() {
    let selectedGatewayId = this.state.selectedGateway;
    let gateways = this.state.gateways;
    console.log(gateways);
    let selectedGateway = gateways.find(
      (x) => x.gatewayId === selectedGatewayId
    );
    let serviceUrl = selectedGateway.serviceUrl;
    let healthLink = "";
    if (serviceUrl !== "") {
      let indexFromCut = serviceUrl.indexOf(".") + 1;
      let cutString = serviceUrl.slice(indexFromCut);
      healthLink = "https://" + cutString + "/health";
    }

    let currentSession = Object.assign({}, this.state.session);
    let currentSuperConnection = Object.assign({}, this.state.superConnection);
    let currentConnection = Object.assign({}, this.state.connection);
    let currentDetails = Object.assign({}, this.state.gatewayDetails);
    fetch("https://jsonplaceholder.typicode.com/todos/1") // healthLink
      .then((response) => {
        if (response.status === 200) {
          response.json().then((currentSession) => {
            this.props.showGlobalMessage(
              true,
              true,
              "Please wait",
              "custom-success"
            );

            currentSession = [
              {
                sessionId: "0idLmsMk8e",
                id: "Q7rfHI",
                bindId: "db6Wt2ReXF",
                targetId: "Q7rfHI",
                groupId: "wabtec-gecars-qadasdsa",
              },
            ];
            if (currentSession.length > 0) {
              for (let session of currentSession) {
                currentSession.sessionId = session.sessionId;
                currentSession.id = session.id;
                currentSession.bindId = session.bindId;
                currentSession.targetId = session.targetId;
                currentSession.groupId = session.groupId;
              }
              this.setState({
                session: currentSession,
              });
            }

            fetch("https://jsonplaceholder.typicode.com/todos/1").then(
              (response) => {
                if (response.status === 200) {
                  response.json().then((superConnections) => {
                    superConnections = [
                      {
                        serverId: "OGhEuE",
                        id: "OGhEuE",
                        targetId: "value",
                        groupId: "smartshop-prod",
                        timeCreated: "2019-11-13T22:05:38.101993815Z",
                        ip: "10.72.1.16:61368",
                        lastPong: "0001-01-01T00:00:00Z",
                      },
                    ];
                    if (superConnections.length > 0) {
                      for (let superConnection of superConnections) {
                        currentSuperConnection.serverId =
                          superConnection.serverId;
                        currentSuperConnection.id = superConnection.id;
                        currentSuperConnection.targetId =
                          superConnection.targetId;
                        currentSuperConnection.groupId =
                          superConnection.groupId;
                        currentSuperConnection.timeCreated =
                          superConnection.timeCreated;
                        currentSuperConnection.ip = superConnection.ip;
                        currentSuperConnection.lastPong =
                          superConnection.lastPong;
                      }
                      this.setState({
                        superConnection: currentSuperConnection,
                      });
                    }

                    fetch("https://jsonplaceholder.typicode.com/todos/1").then(
                      (response) => {
                        if (response.status === 200) {
                          response.json().then((connections) => {
                            connections = [
                              {
                                bindId: "DstAet",
                                clientConfiguration: "value",
                                id: "087ADA",
                                bindId2: "0074C5",
                                targetId: "OGhEuE",
                                groupId: "smartshop-prod",
                                timeCreated: "2019-11-13T22:05:38.101993815Z",
                                allocations: "2903776",
                                totalAllocations: "25007624",
                                frees: "394315",
                                heapAlloc: "2903776",
                                heapInUse: "5185536",
                                heapReleased: "60203008",
                                heapObjects: "20224",
                                report: "value",
                                lastUsage: "987",
                                lastReport: "0001-01-01T00:00:00Z",
                              },
                            ];
                            if (connections.length > 0) {
                              for (let connection of connections) {
                                currentConnection.bindId = connection.bindId;
                                currentConnection.clientConfiguration =
                                  connection.clientConfiguration;
                                currentConnection.id = connection.id;
                                currentConnection.bindId2 = connection.bindId2;
                                currentConnection.targetId =
                                  connection.targetId;
                                currentConnection.groupId = connection.groupId;
                                currentConnection.timeCreated =
                                  connection.timeCreated;
                                currentConnection.allocations =
                                  connection.allocations;
                                currentConnection.totalAllocations =
                                  connection.totalAllocations;
                                currentConnection.frees = connection.frees;
                                currentConnection.heapAlloc =
                                  connection.heapAlloc;
                                currentConnection.heapInUse =
                                  connection.heapInUse;
                                currentConnection.heapReleased =
                                  connection.heapReleased;
                                currentConnection.heapObjects =
                                  connection.heapObjects;
                                currentConnection.report = connection.report;
                                currentConnection.lastUsage =
                                  connection.lastUsage;
                                currentConnection.lastReport =
                                  connection.lastReport;
                              }
                              this.setState({
                                connection: currentConnection,
                              });
                              /*  let that = this;
                              that.props.hideGlobalMessage(); */
                            }
                          });
                          fetch(
                            "https://jsonplaceholder.typicode.com/todos/1"
                          ).then((response) => {
                            if (response.status === 200) {
                              response.json().then((details) => {
                                details = [
                                  {
                                    mode: "GATEWAY",
                                    environment: "dev",
                                    gatewayPort: "8080",
                                    zone: "",
                                    serviceUrl:
                                      "https://ec-agent-portal-1x.com",
                                    token: "none",
                                    host: "ws://asda/agent",
                                    os: "linux",
                                  },
                                ];
                                if (details.length > 0) {
                                  for (let detail of details) {
                                    currentDetails.mode = detail.mode;
                                    currentDetails.environment =
                                      detail.environment;
                                    currentDetails.gatewayPort =
                                      detail.gatewayPort;
                                    currentDetails.zone = detail.zone;
                                    currentDetails.serviceUrl =
                                      detail.serviceUrl;
                                    currentDetails.token = detail.token;
                                    currentDetails.host = detail.host;
                                    currentDetails.os = detail.os;
                                  }
                                  this.setState({
                                    gatewayDetails: currentDetails,
                                  });
                                  let that = this;
                                  that.props.hideGlobalMessage();
                                }
                              });
                            }
                          });
                        }
                      }
                    );
                  });
                }
              }
            );
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.props.showGlobalMessage(true, true, "Error", "custom-danger");
        let that = this;
        setTimeout(function () {
          that.props.hideGlobalMessage();
        }, 2000);
      });
  }

  /* istanbul ignore next */
  handleGatewayselection(e) {
    let selectedGateway = e.target.value;
    this.setState({
      selectedGateway: selectedGateway,
    });
  }

  /* istanbul ignore next */
  render() {
    /* jshint ignore:start */
    return (
      <div className="Monitorhealthstatus">
        <div className="card mt-2">
          <div className="row insidedata">
            <form>
              <div className="form-row">
                <div className="col-sm-12 text-left">
                  <label>GATEWAY</label>
                  <div className="row">
                    <div className="col-sm-6">
                      <select
                        className="form-control form-control-sm"
                        id="selectedGateway"
                        name="selectedGateway"
                        value={this.state.selectedGateway}
                        onChange={(event) => {
                          this.handleGatewayselection(event);
                        }}
                      >
                        <option value="">Select Organization</option>
                        {this.state.gateways.map((gateway, gatewayIndex) => {
                          return (
                            <option
                              className="float-left"
                              key={"gatewayOption" + gatewayIndex}
                              value={gateway.gatewayId}
                            >
                              {gateway.gatewayId}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="col-sm-4">
                      <button
                        type="button"
                        id="fetch-health-status-btn"
                        disabled={
                          this.state.selectedGateway === "" ? true : false
                        }
                        className="btn customize-view-btn btn-sm"
                        onClick={() => {
                          this.fetchHealthStatus();
                        }}
                      >
                        FETCH HEALTH STATUS
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="row insidedata">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  id="sessions-tab"
                  data-toggle="tab"
                  href="#sessions"
                  role="tab"
                  aria-controls="sessions"
                  aria-selected="true"
                >
                  SESSIONS
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  id="superconnections-tab"
                  data-toggle="tab"
                  href="#superconnections"
                  role="tab"
                  aria-controls="superconnections"
                  aria-selected="false"
                >
                  SUPER CONNECTIONS
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  id="contact-tab"
                  data-toggle="tab"
                  href="#contact"
                  role="tab"
                  aria-controls="contact"
                  aria-selected="false"
                >
                  Client Pool
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  id="details-tab"
                  data-toggle="tab"
                  href="#details"
                  role="tab"
                  aria-controls="details"
                  aria-selected="false"
                >
                  GATEWAY DETAILS
                </a>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="sessions"
                role="tabpanel"
                aria-labelledby="sessions-tab"
              >
                <div className="row" style={{ textAlign: "center" }}>
                  <div className="col-sm-6">
                    <small className="font-weight-bold">Session ID:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.session.sessionId}
                    </small>
                  </div>
                  <div className="col-sm-6">
                    <small className="font-weight-bold">
                      Server config ID:
                    </small>
                    <small className="font-weight-normal theme-color">
                      {this.state.session.id}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <small className="font-weight-bold">Bind ID:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.session.bindId}
                    </small>
                  </div>
                  <div className="col-sm-6">
                    <small className="font-weight-bold">Target ID:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.session.targetId}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <small className="font-weight-bold">Group ID:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.session.groupId}
                    </small>
                  </div>
                </div>
              </div>

              <div
                className="tab-pane fade"
                id="superconnections"
                role="tabpanel"
                aria-labelledby="superconnections-tab"
              >
                <div className="row">
                  <div className="col-sm-6">
                    <small className="font-weight-bold">Server ID:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.superConnection.serverId}
                    </small>
                  </div>
                  <div className="col-sm-6">
                    <small className="font-weight-bold">ID:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.superConnection.id}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <small className="font-weight-bold">Target ID:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.superConnection.targetId}
                    </small>
                  </div>
                  <div className="col-sm-6">
                    <small className="font-weight-bold">Group ID:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.superConnection.groupId}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <small className="font-weight-bold">Time created:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.superConnection.timeCreated}
                    </small>
                  </div>
                  <div className="col-sm-6">
                    <small className="font-weight-bold">IP:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.superConnection.ip}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <small className="font-weight-bold">Last Pong:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.superConnection.lastPong}
                    </small>
                  </div>
                </div>
              </div>

              <div
                className="tab-pane fade"
                id="contact"
                role="tabpanel"
                aria-labelledby="contact-tab"
              >
                <div className="row">
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Bind ID:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.connection.bindId}
                    </small>
                  </div>
                  <div className="col-sm-4">
                    <small className="font-weight-bold">
                      Client configuration:
                    </small>
                    <small className="font-weight-normal theme-color">
                      {this.state.connection.clientConfiguration}
                    </small>
                  </div>
                  <div className="col-sm-4">
                    <small className="font-weight-bold">ID:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.connection.id}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Bind ID:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.connection.bindId2}
                    </small>
                  </div>
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Target ID:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.connection.targetId}
                    </small>
                  </div>
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Group ID:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.connection.groupId}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Time created:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.connection.timeCreated}
                    </small>
                  </div>
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Allocations:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.connection.allocations}
                    </small>
                  </div>
                  <div className="col-sm-4">
                    <small className="font-weight-bold">
                      Total Allocations:
                    </small>
                    <small className="font-weight-normal theme-color">
                      {this.state.connection.totalAllocations}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Frees:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.connection.frees}
                    </small>
                  </div>
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Heap Alloc:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.connection.heapAlloc}
                    </small>
                  </div>
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Heap in use:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.connection.heapInUse}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Heap released:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.connection.heapReleased}
                    </small>
                  </div>
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Heap Objects:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.connection.heapObjects}
                    </small>
                  </div>
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Report:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.connection.report}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Last usage:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.connection.lastUsage}
                    </small>
                  </div>
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Last report:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.connection.lastReport}
                    </small>
                  </div>
                </div>
              </div>

              <div
                className="tab-pane fade show"
                id="details"
                role="tabpanel"
                aria-labelledby="details-tab"
              >
                <br />
                <div className="row">
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Mode:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.gatewayDetails.mode}
                    </small>
                  </div>
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Environment:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.gatewayDetails.environment}
                    </small>
                  </div>
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Gateway Port:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.gatewayDetails.gatewayPort}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Zone:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.gatewayDetails.zone}
                    </small>
                  </div>
                  <div className="col-sm-4">
                    <small className="font-weight-bold">serviceUrl:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.gatewayDetails.serviceUrl}
                    </small>
                  </div>
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Host:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.gatewayDetails.host}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <small className="font-weight-bold">Token:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.gatewayDetails.token}
                    </small>
                  </div>

                  <div className="col-sm-4">
                    <small className="font-weight-bold">OS:</small>
                    <small className="font-weight-normal theme-color">
                      {this.state.gatewayDetails.os}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      /*<div className = "Monitorhealthstatus scroll">
                    <div className = 'row mt-2'>
                        <div className = 'col col-6'>
                            <select className="form-control form-control-sm">
                                <option className="float-left" value="fa-search" > &#xf002;  Search by gateway</option>
                                    {this.state.gateways.map((gateway, gatewayIndex) => {
                                        return(
                                            <option
                                                key={"gatewayOption"+gatewayIndex}
                                                value={ gateway.gatewayId }>{ gateway.gatewayId }</option>
                                            )})}
                            </select>
                        </div>
                    </div>
                    <div className='row mt-2'>
                        <div className="card">
                            <form>
                                <div className="row">
                                    <div className="col-sm-4">
                                    <label htmlFor="formGroupExampleInput" className="health-label float-left">Gateway</label>
                                    <select className="form-control" id="">
                                        <option className="float-left">AVIPOCSUBDOMAIN Gateway</option>
                                        {this.state.gateways.map((gateway, gatewayIndex) => {
                                            return(
                                                <option className="float-left"
                                                    key={"gatewayOption"+gatewayIndex}
                                                    value={ gateway.gatewayId }>{ gateway.gatewayId }</option>
                                        )})}
                                    </select>
                                    </div>
                                    <div className="col-sm-8">
                                    <label htmlFor="formGroupExampleInput">&nbsp;</label>
                                        <input type="text" className="form-control border-primary theme-color" defaultValue={this.state.healthLink}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <button type="button" className="btn customize-view-btn btn-sm mt-2 float-right" 
                                        onClick={()=>{this.fetchHealthStatus()}}>
                                            FETCH HEALTH STATUS
                                    </button>
                                    </div>
                                </div>
                            </form>
                            <div className = 'row mt-2 executeModal'>
                                <div className = 'col-4 mr-n3 d-flex'>
                                    <div className="card card-body p-4 flex-fill">
                                            <label className ="control-label ml-3">SESSIONS <img alt="down-arrow" src="assets/static/images/icon_greensortingdown.svg" /></label>
                                        {this.state.showSession === true?
                                            <div className ="container text-left">
                                                <small className="font-weight-bold">Session ID:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.session.sessionId}</small><br/>
                                                <small className="font-weight-bold">Server config</small><br/>
                                                <small className="font-weight-bold">ID:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.session.id}</small><br/>
                                                <small className="font-weight-bold">Bind ID:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.session.bindId}</small><br/>
                                                <small className="font-weight-bold">Target ID:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.session.targetId}</small><br/>
                                                <small className="font-weight-bold">Group ID:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.session.groupId}</small><br/>     
                                            </div>:null    
                                        }
                                    </div>
                                </div>
                                <div className = 'col-4 mx-n3 d-flex'>
                                    <div className="card p-4 card-body flex-fill">
                                        <label className ="control-label ml-3">SUPER CONNECTIONS <img alt="down-arrow" src="assets/static/images/icon_greensortingdown.svg" /></label>
                                        {this.state.showSuperConnection === true?
                                            <div className ="container text-left">
                                                <small className="font-weight-bold">Server ID:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.superConnection.serverId}</small><br/>
                                                <small className="font-weight-bold">ID:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.superConnection.id}</small><br/>
                                                <small className="font-weight-bold">Target ID:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.superConnection.targetId}</small><br/>
                                                <small className="font-weight-bold">Group ID:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.superConnection.groupId}</small><br/>
                                                <small className="font-weight-bold">Time created:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.superConnection.timeCreated}</small><br/>
                                                <small className="font-weight-bold">IP:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.superConnection.ip}</small><br/>
                                                <small className="font-weight-bold">Last Pong:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.superConnection.lastPong}</small><br/>
                                            </div>:null    
                                        }
                                    </div>
                          
                                </div>
                                <div className = 'col-4 ml-n3 d-flex'>
                                    <div className="card p-4 card-body flex-fill">
                                        <label className ="control-label ml-3">CONNECTIONS <img alt="down-arrow" src="assets/static/images/icon_greensortingdown.svg" /></label>
                                        {this.state.showConnection === true?
                                            <div className ="container text-left">
                                                <small className="font-weight-bold">Bind ID:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.connection.bindId}</small><br/>
                                                <small className="font-weight-bold">Client configuration:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.connection.clientConfiguration}</small><br/>
                                                <small className="font-weight-bold">ID:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.connection.id}</small><br/>
                                                <small className="font-weight-bold">Bind ID:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.connection.bindId2}</small><br/>
                                                <small className="font-weight-bold">Target ID:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.connection.targetId}</small><br/>
                                                <small className="font-weight-bold">Group ID:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.connection.groupId}</small><br/>
                                                <small className="font-weight-bold">Time created:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.connection.timeCreated}</small><br/>
                                                <small className="font-weight-bold">Allocations:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.connection.allocations}</small><br/>
                                                <small className="font-weight-bold">Total Allocations:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.connection.totalAllocations}</small><br/>
                                                <small className="font-weight-bold">Frees:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.connection.frees}</small><br/>
                                                <small className="font-weight-bold">Heap Alloc:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.connection.heapAlloc}</small><br/>
                                                <small className="font-weight-bold">Heap in use:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.connection.heapInUse}</small><br/>
                                                <small className="font-weight-bold">Heap released:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.connection.heapReleased}</small><br/>
                                                <small className="font-weight-bold">Heap Objects:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.connection.heapObjects}</small><br/>
                                                <small className="font-weight-bold">Report:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.connection.report}</small><br/>
                                                <small className="font-weight-bold">Last usage:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.connection.lastUsage}</small><br/>
                                                <small className="font-weight-bold">Last report:</small><br/>
                                                <small className="font-weight-normal theme-color">{this.state.connection.lastReport}</small><br/>
                                            </div>:null    
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='row my-5'>
                                <div className = 'col'>
                                    <button type="button" className="btn btn-sm customize-view-btn mr-2 mb-2"
                                     onClick={(event)=>{this.handleChange(event)}}
                                     id= "superConnection">SUPER CONECTIONS</button>
                                    <button type="button" className="btn btn-sm customize-view-btn mr-2 mb-2"
                                        onClick={(event)=>{this.handleChange(event)}}
                                        id= "connections">NO. OF CONNECTIONS</button>
                                    <button type="button" className="btn btn-sm customize-view-btn mb-2"
                                     onClick={(event)=>{this.handleChange(event)}}
                                     id= "session">NO. OF SESSION ID</button>
                                </div>
                                <div className = 'col'>
                                    <button type="button" className="btn btn-sm customize-view-btn float-right mb-2">REFRESH</button>
                                </div>
                            </div>
                        </div>
                    </div>
                
                                    </div> */
    );
    /* jshint ignore:end */
  }
}