require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [

new SlashCommandBuilder()
.setName("joker")
.setDescription("System jokerów")
.addSubcommand(sub =>
  sub.setName("uzyj")
  .setDescription("Użyj jokera"))
.addSubcommand(sub =>
  sub.setName("dodaj")
  .setDescription("Dodaj joker (admin)")
  .addUserOption(opt => opt.setName("user").setDescription("Użytkownik").setRequired(true))
  .addIntegerOption(opt => opt.setName("ilosc").setDescription("Ilość").setRequired(true)))
.addSubcommand(sub =>
  sub.setName("sprawdz")
  .setDescription("Sprawdź ilość jokerów")
  .addUserOption(opt => opt.setName("user").setDescription("Użytkownik").setRequired(false))
),

new SlashCommandBuilder()
.setName("kolo")
.setDescription("Zmiana typu podczas wyścigu"),

new SlashCommandBuilder()
.setName("typuj")
.setDescription("Typowanie wyścigu"),

new SlashCommandBuilder()
.setName("sprint")
.setDescription("Typowanie sprintu")

].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands }
  );
  console.log("Komendy wdrożone.");
})();