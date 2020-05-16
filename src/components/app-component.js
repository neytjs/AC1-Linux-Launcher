import React, {Component} from 'react';
import styled from 'styled-components';
import cloneDeep from 'lodash.clonedeep';
const {exec} = window.require("child_process");

const remote = window.require('electron').remote;
var app_path = remote.app.getAppPath('');
var DataStore = window.require('nedb');
var app_data = new DataStore({ filename: app_path+'/data/app_data.db', autoload: true });

import AppData from './app_data.js';
const defaultAppData = AppData.defaultAppData();

var css_template = {};
const Wrapper = styled.div`
  button {
    border-radius: 5px;
    font-size: 15px;
    background-color: #9E9F65;
    color: #232303;
    border: 1px solid #232303;
    margin: 5px 5px;
    padding: 0 15px;
    line-height: 1.45;
    width: auto;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  }

  button:hover {
    background-color: #C0C09A;
    color: #676741;
    border: 1px solid #676741;
  }

  button:active {
    background-color: #676741;
    color: #232303;
    border: 1px solid #232303;
  }

  input {
    border: 1px solid #232303;
    border-radius: 3px;
    background: #EAEADA;
    padding: 3px;
  }

  input:hover {
    background: #DFDFD3
  }

  a {
    text-decoration: underline;
    font-size: 18;
    color: #676741;
  }

  a:link {
    text-decoration: yes;
  }

  a:hover {
    color: #232303;
    cursor: pointer;
  }

  select {
    border: 1px solid #232303;
    border-radius: 3px;
    background-color: #EAEADA;
    padding: 3px;
  }

  select:hover {
    border: 1px solid #232303;
    background-color: #DFDFD3;
    cursor: pointer;
  }

  hr {
    border: 1px solid #232303;
  }

  .topui {
    padding: 3px;
    border: 2px solid #232303;
    background: #D2D2BE;
    border-radius: 5px;
    margin: 3px;
    width: 92%;
  }

  .midui {
    padding: 3px;
    border: 2px solid #232303;
    background: #D2D2BE;
    border-radius: 5px;
    margin: 3px;
    display: inline-block;
    vertical-align: top;
    width: 45%;
  }

  .multis {
    height: 400px;
    overflow: auto;
    border-top: 2px solid #232303;
    border-bottom: 2px solid #232303;
  }
`;

class App extends Component {
  constructor() {
    super();
    this.running = false;
    this.serverList = React.createRef();
    this.server_types = ["", "ACE", "GDLE"];
    this.server_rulesets = ["", "PVE", "PK"];

    this.state = {
      editing_filepath: false,
      editing_server: -1,
      editing_account: -1,
      edit_servers: [],
      edit_accounts: [],
      edit_servers_temp: [],
      edit_accounts_temp: [],
      filepath_temp: "",
      filepath: "",
      add_account_server: "",
      add_account_username: "",
      add_account_password: "",
      add_server: "",
      add_ruleset: "",
      add_discord: "",
      add_url: "",
      add_port: "",
      add_type: "",
      accounts: [],
      servers: [],
      loaded: false
    }
  }

  async componentDidMount() {
    let app_data = await this.getAppData();
    css_template = app_data.sel_temp_data;
    this.setState({ filepath: app_data.filepath, accounts: app_data.accounts, servers: app_data.servers }, function() {
      document.body.style.backgroundColor = "#EAEADA";
      document.body.style.color = "#232303";
      this.setState({loaded: true});
    });
  }

  getAppData() {
    return new Promise(resolve => {
      app_data.findOne({}, function(err, dat) {
        if (dat) {
          resolve(dat);
        } else {
          app_data.insert(defaultAppData, function(err, docs) {
            resolve(docs);
          });
        }
      });
    });
  }

  genOpts(opts) {
    return opts.map((type, i) => {
      return (
        <option key={"stkey" + i} value={type}>{type}</option>
      )
    });
  }

  connectionAttempt(server, username, password) {
    let filepath = this.state.filepath;
    if (filepath === "") {
      alert("Can not connect. You MUST enter the correct path to your game files.");
    } else {
      if (this.running === true) {
        return false;
      }
      let innerFunction = () => {
        this.running = true;
        setTimeout(function() {
          let type = "";
          let url = "";
          let port = "";
          for (var i = 0, length = this.state.servers.length; i < length; i++) {
            if (this.state.servers[i].server.toLowerCase() === server.toLowerCase()) {
              type = this.state.servers[i].type;
              url = this.state.servers[i].url;
              port = this.state.servers[i].port;
            }
          }
          let command = "";
          if (type === "ACE") {
            command = "wine acclient.exe -a " + username + " -v " + password + " -h " + url + ":" + port;
          } else if (type === "GDLE") {
            command = "wine acclient.exe -h " + url + " -p " + port + " -a " + username + ":" + password + " -rodat off";
          }
          exec(command, {cwd: filepath});
          this.running = false;
        }.bind(this), 1500);
      }
      innerFunction();
    }
  }

  handleFilepathChange(event) {
    this.setState({filepath: event.target.value});
  }

  editFilepath() {
    let new_filepath = this.state.filepath;
    new_filepath = new_filepath.trim();
    app_data.update({}, {$set:{filepath: new_filepath}}, function(err, docs) {
      this.setState({filepath: new_filepath, editing_filepath: false});
    }.bind(this));
  }

  displayAccounts() {
    let accounts = this.state.accounts;
    accounts.sort(function(a, b) {
      if (a.username.toLowerCase() > b.username.toLowerCase()) {
        return 1;
      }
      if (b.username.toLowerCase() > a.username.toLowerCase()) {
        return -1;
      }
      return 0;
    });
    return accounts.map((account, i) => {
      return (
        <div key={"account" + i} id={"account" + i}>
          { this.state.editing_account === i ?
          <div>
            <b>Edit Username:</b> <input defaultValue={account.username} onBlur={this.handleAccountUsernameEditChange.bind(this)}/> <br/>
            <b>Edit Password:</b> <input defaultValue={account.password} onBlur={this.handleAccountPasswordEditChange.bind(this)}/> <br/>
            <b>Edit Server:</b> <select onBlur={this.handleAccountServerEditChange.bind(this)} defaultValue={account.server}>
                {this.genServerOpts()}
              </select> <br/>
            <button onClick={this.saveEditAccount.bind(this, i)}>Save</button> <button onClick={this.cancelEditAccount.bind(this)}>Cancel</button> <button onClick={this.deleteAccount.bind(this, i)}>Delete</button>
          </div>
          :
          <div>
            <b>Username:</b> {account.username}<br/>
            <b>Server:</b> {account.server} ({account.ruleset})<br/>
            <button onClick={this.connectionAttempt.bind(this, account.server, account.username, account.password)}>Connect</button> <button onClick={this.editAccount.bind(this, i)}>Edit</button>
          </div>
          }
          <hr/>
        </div>
      )
    });
  }

  addAccount() {
    let server = this.state.add_account_server;
    let username = this.state.add_account_username;
    let password = this.state.add_account_password;
    if (server !== "" && username !== "" && password !== "") {
      server = server.trim();
      username = username.trim();
      password = password.trim();
      let match = false;
      for (var i = 0, length = this.state.accounts.length; i < length; i++) {
        if (this.state.accounts[i].username.toLowerCase() === username.toLowerCase() && this.state.accounts[i].server.toLowerCase() === server.toLowerCase()) {
          match = true;
        }
      }
      if (match) {
        alert("You already have an account named " + this.state.add_account_username + " for the " + this.state.add_account_server + " server.");
      } else {
        let ruleset = "";
        for (var i = 0, length = this.state.servers.length; i < length; i++) {
          if (server === this.state.servers[i].server) {
            ruleset = this.state.servers[i].ruleset;
          }
        }
        this.state.accounts.push({server: server, username: username, password: password, ruleset: ruleset});
        app_data.update({}, {$set:{accounts: this.state.accounts}}, function(err, docs) {
          this.setState({add_account_server: "", add_account_username: "", add_account_password: ""}, function() {
            let new_id = 0;
            for (var i = 0, length = this.state.accounts.length; i < length; i++) {
              if (this.state.accounts[i].username.toLowerCase() === username.toLowerCase()) {
                new_id = i;
              }
            }
            let element = document.getElementById("account" + new_id);
            element.scrollIntoView();
          });
        }.bind(this));
      }
    } else {
      alert("You must complete all three fields.");
    }
  }

  editAccount(id) {
    this.setState({editing_account: id, edit_accounts: cloneDeep(this.state.accounts), edit_accounts_temp: cloneDeep(this.state.accounts)}, function() {
      let element = document.getElementById("account" + id);
      element.scrollIntoView();
    });
  }

  saveEditAccount(id) {
    let accounts = this.state.edit_accounts;
    if (accounts[id].server !== "" && accounts[id].username !== "" && accounts[id].password !== "") {
      let new_username = accounts[id].username;
      accounts[id].server = accounts[id].server.trim();
      accounts[id].username = accounts[id].username.trim();
      accounts[id].password = accounts[id].password.trim();
      let counter = 0;
      for (var i = 0, length = accounts.length; i < length; i++) {
        if (this.state.accounts[i].username.toLowerCase() === accounts[id].username.toLowerCase() && this.state.accounts[i].server.toLowerCase() === accounts[id].server.toLowerCase()) {
          counter = counter + 1;
        }
      }
      if (counter > 1) {
        alert("You already have a account named " + this.state.add_account_username + " for the " + this.state.add_account_server + " server.");
      } else {
        for (var i = 0, length = this.state.servers.length; i < length; i++) {
          if (accounts[id].server === this.state.servers[i].server) {
            accounts[id].ruleset = this.state.servers[i].ruleset;
          }
        }
        app_data.update({}, {$set:{accounts: accounts}}, function(err, docs) {
          this.setState({accounts: accounts, editing_account: -1}, function() {
            let new_id = 0;
            for (var i = 0, length = this.state.accounts.length; i < length; i++) {
              if (this.state.accounts[i].username.toLowerCase() === new_username.toLowerCase()) {
                new_id = i;
              }
            }
            let element = document.getElementById("account" + new_id);
            element.scrollIntoView();
          });
        }.bind(this));
      }
    } else {
      alert("You must complete all three fields.");
    }
  }

  deleteAccount(id) {
    let result = confirm("Warning, this will permanently delete this account from your list. Are you sure that you want to delete it?")
    if (result === true) {
      let state = Object.assign({}, this.state);
      state.accounts.splice(id, 1);
      state.editing_account = -1;
      app_data.update({}, {$set:{accounts: state.accounts}}, function(err, doc) {
        this.setState(state);
      }.bind(this));
    }
  }

  resetAccountAdd() {
    this.setState({add_account_server: "", add_account_username: "", add_account_password: ""});
  }

  cancelEditAccount() {
    this.setState({editing_account: -1, accounts: this.state.edit_accounts_temp});
  }

  genServerOpts() {
    let servers = [];
    for (var i = -1, length = this.state.servers.length; i < length; i++) {
      if (i === -1) {
        servers.push("");
      } else {
        servers.push(this.state.servers[i].server)
      }
    }
    return servers.map((server, i) => {
      return (
        <option key={"skey" + i} value={server}>{server}</option>
      )
    });
  }

  handleAccountServerEditChange(event) {
    let state = Object.assign({}, this.state);
    state.edit_accounts[state.editing_account].server = event.target.value;
    this.setState(state);
  }

  handleAccountUsernameEditChange(event) {
    let state = Object.assign({}, this.state);
    state.edit_accounts[state.editing_account].username = event.target.value;
    this.setState(state);
  }

  handleAccountPasswordEditChange(event) {
    let state = Object.assign({}, this.state);
    state.edit_accounts[state.editing_account].password = event.target.value;
    this.setState(state);
  }

  handleAccountServerAddChange(event) {
    this.setState({add_account_server: event.target.value});
  }

  handleAccountUsernameAddChange(event) {
    this.setState({add_account_username: event.target.value});
  }

  handleAccountPasswordAddChange(event) {
    this.setState({add_account_password: event.target.value});
  }

  displayServers() {
    let servers = this.state.servers;
    servers.sort(function(a, b) {
      if (a.server.toLowerCase() > b.server.toLowerCase()) {
        return 1;
      }
      if (b.server.toLowerCase() > a.server.toLowerCase()) {
        return -1;
      }
      return 0;
    });
    return servers.map((server, i) => {
      return (
        <div key={"server" + i} id={"server" + i}>
          { this.state.editing_server === i ?
          <div>
            <b>Edit Server Name:</b> <input defaultValue={server.server} onBlur={this.handleServerNameEditChange.bind(this)}/> <br/>
            <b>Edit Ruleset:</b> <select defaultValue={server.ruleset} onBlur={this.handleRulesetEditChange.bind(this)}>
              {this.genOpts(this.server_rulesets)}
            </select><br/>
            <b>Edit Discord:</b> <input defaultValue={server.discord} onBlur={this.handleDiscordEditChange.bind(this)} size="25"/> <br/>
            <b>Edit URL:</b> <input defaultValue={server.url} onBlur={this.handleURLEditChange.bind(this)} size="25"/> <br/>
            <b>Edit Port:</b> <input defaultValue={server.port} onBlur={this.handlePortEditChange.bind(this)} size="3"/> <br/>
            <b>Edit Type:</b> <select defaultValue={server.type} onBlur={this.handleTypeEditChange.bind(this)}>
              {this.genOpts(this.server_types)}
            </select><br/>
            <button onClick={this.saveEditServer.bind(this, i)}>Save</button> <button onClick={this.cancelEditServer.bind(this)}>Cancel</button> <button onClick={this.deleteServer.bind(this, i)}>Delete</button>
          </div>
          :
          <div>
            <b>Server:</b> {server.server} ({server.ruleset}) <br/>
            <b>Discord:</b> {server.discord === "" ? "none" : <a href={server.discord} target="_blank">{server.discord}</a>} <br/>
            <b>URL:</b> {server.url} <br/>
            <b>Port:</b> {server.port} <br/>
            <b>Type:</b> {server.type} <br/>
            <button onClick={this.editServer.bind(this, i)}>Edit</button>
          </div>
          }
          <hr/>
        </div>
      )
    });
  }

  addServer() {
    let server = this.state.add_server;
    let ruleset = this.state.add_ruleset;
    let discord = this.state.add_discord;
    let url = this.state.add_url;
    let port = this.state.add_port;
    let type = this.state.add_type;
    if (server !== "" && ruleset !== "" && url !== "" && port !== "" && type !== "") {
      server = server.trim();
      ruleset = ruleset.trim();
      discord = discord.trim();
      url = url.trim();
      port = port.trim();
      type = type.trim();
      let match = false;
      for (var i = 0, length = this.state.servers.length; i < length; i++) {
        if (this.state.servers[i].server.toLowerCase() === server.toLowerCase()) {
          match = true;
        }
      }
      if (match) {
        alert("You already have a server named " + this.state.add_server + " in your server list.");
      } else {
        this.state.servers.push({server: server, ruleset: ruleset, discord: discord, url: url, port: port, type: type});
        app_data.update({}, {$set:{servers: this.state.servers}}, function(err, docs) {
          this.setState({add_server: "", add_ruleset: "", add_discord: "", add_url: "", add_port: "", add_type: ""}, function() {
            let new_id = 0;
            for (var i = 0, length = this.state.servers.length; i < length; i++) {
              if (this.state.servers[i].server.toLowerCase() === server.toLowerCase()) {
                new_id = i;
              }
            }
            let element = document.getElementById("server" + new_id);
            element.scrollIntoView();
          });
        }.bind(this));
      }
    } else {
      alert("You must complete all five required fields.");
    }
  }

  editServer(id) {
    this.setState({editing_server: id, edit_servers: cloneDeep(this.state.servers), edit_servers_temp: cloneDeep(this.state.servers)}, function() {
      let element = document.getElementById("server" + id);
      element.scrollIntoView();
    });
  }

  saveEditServer(id) {
    let servers = this.state.edit_servers;
    if (servers[id].server !== "" && servers[id].ruleset !== "" && servers[id].url !== "" && servers[id].port !== "" && servers[id].type !== "") {
      servers[id].server = servers[id].server.trim();
      servers[id].ruleset = servers[id].ruleset.trim();
      servers[id].discord = servers[id].discord.trim();
      servers[id].url = servers[id].url.trim();
      servers[id].port = servers[id].port.trim();
      servers[id].type = servers[id].type.trim();
      let counter = 0;
      for (var i = 0, length = servers.length; i < length; i++) {
        if (servers[i].server.toLowerCase() === servers[id].server.toLowerCase()) {
          counter = counter + 1;
        }
      }
      if (counter > 1) {
        alert("You already have a server named " + servers[id].server + " in your server list.");
      } else {
        let serv_name = servers[id].server;
        let prev_ruleset = this.state.edit_servers_temp[id].ruleset;
        let prev_server = this.state.edit_servers_temp[id].server;
        let accounts = this.state.accounts;
        if (servers[id].server !== prev_server || servers[id].ruleset !== prev_ruleset) {
          for (var i = 0, length = accounts.length; i < length; i++) {
            if (prev_server === accounts[i].server) {
              accounts[i].server = servers[id].server;
            }
            if (accounts[i].server === servers[id].server) {
              accounts[i].ruleset = servers[id].ruleset;
            }
          }
        }
        app_data.update({}, {$set:{servers: servers}}, function(err, docs) {
          app_data.update({}, {$set:{accounts: accounts}}, function() {
            this.setState({editing_server: -1, servers: servers}, function() {
              let new_id = 0;
              for (var i = 0, length = this.state.servers.length; i < length; i++) {
                if (this.state.servers[i].server.toLowerCase() === serv_name.toLowerCase()) {
                  new_id = i;
                }
              }
              let element = document.getElementById("server" + new_id);
              element.scrollIntoView();
            });
          }.bind(this));
        }.bind(this));
      }
    } else {
      alert("You must complete all five required fields.");
    }
  }

  deleteServer(id) {
    let result = confirm("Warning, this will permanently delete this server from your list. It will no longer be an option when adding new accounts. Are you sure that you want to delete it?")
    if (result === true) {
      let state = Object.assign({}, this.state);
      state.servers.splice(id, 1);
      state.editing_server = -1;
      app_data.update({}, {$set:{servers: state.servers}}, function(err, doc) {
        this.setState(state);
      }.bind(this));
    }
  }

  resetServerAdd() {
    this.setState({add_server: "", add_ruleset: "", add_discord: "", add_url: "", add_port: "", add_type: ""});
  }

  cancelEditServer() {
    this.setState({editing_server: -1, servers: this.state.edit_servers_temp});
  }

  handleServerNameEditChange(event) {
    let state = Object.assign({}, this.state);
    state.edit_servers[state.editing_server].server = event.target.value;
    this.setState(state);
  }

  handleRulesetEditChange(event) {
    let state = Object.assign({}, this.state);
    state.edit_servers[state.editing_server].ruleset = event.target.value;
    this.setState(state);
  }

  handleDiscordEditChange(event) {
    let state = Object.assign({}, this.state);
    state.edit_servers[state.editing_server].discord = event.target.value;
    this.setState(state);
  }

  handleURLEditChange(event) {
    let state = Object.assign({}, this.state);
    state.edit_servers[state.editing_server].url = event.target.value;
    this.setState(state);
  }

  handlePortEditChange(event) {
    let state = Object.assign({}, this.state);
    state.edit_servers[state.editing_server].port = event.target.value;
    this.setState(state);
  }

  handleTypeEditChange(event) {
    let state = Object.assign({}, this.state);
    state.edit_servers[state.editing_server].type = event.target.value;
    this.setState(state);
  }

  handleServerNameAddChange(event) {
    this.setState({add_server: event.target.value});
  }

  handleRulesetAddChange(event) {
    this.setState({add_ruleset: event.target.value});
  }

  handleDiscordAddChange(event) {
    this.setState({add_discord: event.target.value});
  }

  handleURLAddChange(event) {
    this.setState({add_url: event.target.value});
  }

  handlePortAddChange(event) {
    this.setState({add_port: event.target.value});
  }

  handleTypeAddChange(event) {
    this.setState({add_type: event.target.value});
  }

  render() {
    const {editing_filepath, filepath, filepath_temp, add_server, add_ruleset, add_url, add_port, add_type, add_discord,
      add_account_server, add_account_username, add_account_password, loaded} = this.state;
    if (loaded === false) {
      return (
        <div>Loading...</div>
      )
    } else {
      return (
        <Wrapper>
          <div className="topui">
            <h3>Full path to your AC1 directory:</h3>
            {
              editing_filepath === true ?
              <div>
                <input value={filepath} onChange={this.handleFilepathChange.bind(this)} size="80" />
                <button onClick={this.editFilepath.bind(this)}>Save</button> <button onClick={() => {this.setState({editing_filepath: false, filepath: filepath_temp})}}>Cancel</button>
              </div> :
              <div>
                { filepath === "" ?
                  <button onClick={() => {this.setState({editing_filepath: true, filepath_temp: filepath})}}>Add</button> :
                  <div>{filepath} <button onClick={() => {this.setState({editing_filepath: true, filepath_temp: filepath})}}>Edit</button></div>
                }
              </div>
            }
            Note, some servers (e.g. Seedsow and Snowreap) require the use of special .dat files in order to play. Some servers also require you to register accounts at their websites before you can sign in. Research each server before attempting to connect.
          </div>
          <div className="midui">
            <h3>Servers ({this.state.servers.length}):</h3>
            <div className="multis" ref={this.serverList}>
                {this.displayServers()}
            </div>
            <div>
              <h3>Add new server:</h3>
              Server: <input value={add_server} onChange={this.handleServerNameAddChange.bind(this)}/><br/>
              Ruleset: <select value={add_ruleset} onChange={this.handleRulesetAddChange.bind(this)}>
                {this.genOpts(this.server_rulesets)}
              </select><br/>
              Discord (optional): <input value={add_discord} onChange={this.handleDiscordAddChange.bind(this)}/><br/>
              URL: <input value={add_url} onChange={this.handleURLAddChange.bind(this)} size="25"/><br/>
              Port: <input value={add_port} onChange={this.handlePortAddChange.bind(this)} size="3"/><br/>
              Type: <select value={add_type} onChange={this.handleTypeAddChange.bind(this)}>
                {this.genOpts(this.server_types)}
              </select><br/>
              <button onClick={this.addServer.bind(this)}>Add</button> <button onClick={this.resetServerAdd.bind(this)}>Reset</button>
            </div>
          </div>
          <div className="midui">
            <h3>Accounts ({this.state.accounts.length}):</h3>
            <div className="multis">
              {this.displayAccounts()}
            </div>
            <div>
              <h3>Add new account information:</h3>
              Server: <select onChange={this.handleAccountServerAddChange.bind(this)} value={add_account_server}>
                {this.genServerOpts()}
              </select><br/>
              Username: <input value={add_account_username} onChange={this.handleAccountUsernameAddChange.bind(this)} /><br/>
              Password: <input value={add_account_password} onChange={this.handleAccountPasswordAddChange.bind(this)} /><br/>
              <button onClick={this.addAccount.bind(this)}>Add</button> <button onClick={this.resetAccountAdd.bind(this)}>Reset</button>
            </div>
          </div>
        </Wrapper>
      )
    }
  }
}

export default App;
