require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const db = require("./database");

const ADMIN_ID = "808300444262334514";

const drivers = [
"Norris","Piastri","Russell","Antonelli",
"Verstappen","Hadjar","Leclerc","Hamilton",
"Albon","Sainz","Lawson","Lindblad",
"Gasly","Colapinto","Alonso","Stroll",
"Ocon","Bearman","Hülkenberg","Bortoleto",
"Pérez","Bottas"
];

const teams = [
"McLaren","Mercedes","Red Bull","Ferrari",
"Williams","Racing Bulls","Alpine","Aston Martin",
"Haas","Audi","Cadillac"
];

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`Zalogowano jako ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "joker") {
    const sub = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    let user = db.prepare("SELECT * FROM jokers WHERE user_id=?").get(userId);

    if (!user) {
      db.prepare("INSERT INTO jokers (user_id,count) VALUES (?,2)").run(userId);
      user = { count: 2 };
    }

    if (sub === "uzyj") {
      if (user.count <= 0)
        return interaction.reply("Skończyły Ci się jokery.");

      db.prepare("UPDATE jokers SET count=count-1 WHERE user_id=?").run(userId);

      return interaction.reply(
        `Joker został użyty ${interaction.user} ma teraz podwójne punkty za swój typ`
      );
    }

    if (sub === "dodaj") {
      if (userId !== ADMIN_ID)
        return interaction.reply({ content: "Brak uprawnień.", ephemeral: true });

      const target = interaction.options.getUser("user");
      const amount = interaction.options.getInteger("ilosc");

      db.prepare(`
      INSERT INTO jokers (user_id,count)
      VALUES (?,?)
      ON CONFLICT(user_id)
      DO UPDATE SET count = count + ?
      `).run(target.id, amount, amount);

      return interaction.reply(`Dodano ${amount} jokerów dla ${target.username}`);
    }

    if (sub === "sprawdz") {
      if (userId !== ADMIN_ID)
        return interaction.reply({ content: "Brak uprawnień.", ephemeral: true });

      const target = interaction.options.getUser("user") || interaction.user;
      const data = db.prepare("SELECT count FROM jokers WHERE user_id=?").get(target.id);

      return interaction.reply(`${target.username} ma ${data ? data.count : 2} jokerów.`);
    }
  }

  if (interaction.commandName === "kolo") {
    return interaction.reply("Możesz zmienić swój typ podczas wyścigu.");
  }

  if (interaction.commandName === "typuj") {
    const embed = new EmbedBuilder()
      .setTitle("Typowanie wyścigu 2026")
      .setDescription(`
Pole Position: ${drivers.join(", ")}
Zwycięzca: ${drivers.join(", ")}
Podium: ${drivers.join(", ")}
DNF: ${drivers.join(", ")}
Zwycięski zespół: ${teams.join(", ")}
Neutralizacje >2? TAK/NIE
`);
    return interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === "sprint") {
    const embed = new EmbedBuilder()
      .setTitle("Typowanie sprintu 2026")
      .setDescription(`
Pole Position: ${drivers.join(", ")}
Zwycięzca: ${drivers.join(", ")}
Podium: ${drivers.join(", ")}
`);
    return interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);