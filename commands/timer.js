const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const spacetime = require("spacetime");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timer")
        .setDescription("Affiche les timers des events courants.")
        .addStringOption(option =>
            option.setName("serveur")
                .setDescription("Le serveur FGO des events à afficher")
                .setRequired(true)
                .addChoices({name: "NA", value: "NA"}, {name: "JP", value: "JP"})),

    async execute(interaction) {
        const server = interaction.options.getString("serveur");
        const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

        const now = spacetime.now();
        console.log(`[${new Date().toLocaleTimeString()}] "${interaction.user.tag}" vient de demander les timers de la ${server}.`)

        fetch(`https://api.atlasacademy.io/export/${server}/basic_event.json`)
            .then(data => {
                return data.json()
            })
            .then(events => {
                const currentEvents = events.filter(event => spacetime(event.endedAt * 1000).isAfter(now) && spacetime(event.endedAt * 1000).isBefore(spacetime([2029, 1, 1])) && event.type === "eventQuest")

                const embed = new MessageEmbed()
                embed.setTitle("Comptes à rebours FGO " + server);
                embed.setURL("https://fgo.mitsunee.com/")

                currentEvents.forEach(event => {
                    let diff = now.diff(spacetime(event.endedAt * 1000))

                    let value = ""
                    if (diff.days > 0)
                        value += diff.days + "j "
                    if (diff.hours > 0)
                        value += (diff.hours - (diff.days * 24)) + "h "
                    if (diff.minutes > 0)
                        value += (diff.minutes - (diff.hours * 60)) + "m "
                    if (diff.seconds > 0)
                        value += (diff.seconds - (diff.minutes * 60)) + "s "

                    embed.addField(event.name, value);
                })

                interaction.reply({embeds: [embed]})
            })
    }
}