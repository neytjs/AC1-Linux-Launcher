class AppData {
  static defaultAppData() {
    return {
      filepath: "",
      accounts: [],
      servers: [
        {server: "Coldeve", ruleset: "PVE", discord: "https://discord.gg/nUR4PHe", url: "play.coldeve.online", port: "9000", type: "ACE"},
        {server: "PotatoAC", ruleset: "PK", discord: "https://discord.gg/uhUhurK", url: "potatoac.webhop.me", port: "9000", type: "ACE"},
        {server: "Hightide", ruleset: "PK", discord: "https://discord.gg/hUeAJWn", url: "hightide.connect-to-server.online", port: "9000", type: "GDLE"},
        {server: "Reefcull", ruleset: "PVE", discord: "https://discord.gg/jd3dEJf", url: "reefcull.connect-to-server.online", port: "9000", type: "GDLE"},
        {server: "Harvestbud", ruleset: "PVE", discord: "https://discord.gg/jd3dEJf", url: "harvestbud.connect-to-server.online", port: "9000", type: "GDLE"},
        {server: "Gloomfell", ruleset: "PVE", discord: "", url: "3.133.77.151", port: "9000", type: "ACE"},
        {server: "RIPtide", ruleset: "PK", discord: "https://discord.gg/JR3hXyd", url: "riptide.servegame.com", port: "9000", type: "ACE"},
        {server: "Seedsow", ruleset: "PVE", discord: "https://goo.gl/mUEu6g", url: "serafino.ddns.net", port: "9060", type: "GDLE"},
        {server: "Snowreap", ruleset: "PK", discord: "https://goo.gl/mUEu6g", url: "serafino.ddns.net", port: "9070", type: "GDLE"}                
      ]
    }
  }
}

export default AppData;
