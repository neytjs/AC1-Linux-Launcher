class AppData {
  static defaultAppData() {
    return {
      filepath: "",
      accounts: [],
      servers: [
        {server: "Coldeve", ruleset: "PvE", discord: "https://discord.gg/nUR4PHe", url: "play.coldeve.online", port: "9000", type: "ACE", description: ""},
        {server: "PotatoAC", ruleset: "PK", discord: "https://discord.gg/uhUhurK", url: "potatoac.webhop.me", port: "9000", type: "ACE", description: ""},
        {server: "Hightide", ruleset: "PK", discord: "https://discord.gg/hUeAJWn", url: "hightide.connect-to-server.online", port: "9000", type: "GDLE", description: ""},
        {server: "Reefcull", ruleset: "PvE", discord: "https://discord.gg/jd3dEJf", url: "reefcull.connect-to-server.online", port: "9000", type: "GDLE", description: ""},
        {server: "Harvestbud", ruleset: "PvE", discord: "https://discord.gg/jd3dEJf", url: "harvestbud.connect-to-server.online", port: "9000", type: "GDLE", description: ""},
        {server: "Gloomfell", ruleset: "PvE", discord: "", url: "3.133.77.151", port: "9000", type: "ACE", description: ""},
        {server: "RIPtide", ruleset: "PK", discord: "https://discord.gg/JR3hXyd", url: "riptide.servegame.com", port: "9000", type: "ACE", description: ""},
        {server: "Seedsow", ruleset: "PvE", discord: "https://goo.gl/mUEu6g", url: "serafino.ddns.net", port: "9060", type: "GDLE", description: ""},
        {server: "Snowreap", ruleset: "PK", discord: "https://goo.gl/mUEu6g", url: "serafino.ddns.net", port: "9070", type: "GDLE", description: ""}
      ]
    }
  }
}

export default AppData;
