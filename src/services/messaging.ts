import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	ColorResolvable,
	EmbedBuilder,
} from 'discord.js';
import { Service } from './service';
import { LeaderboardUser } from '../types';

export class MessagingService extends Service {
	public async init(): Promise<true | Error> {
		return new Promise((resolve) => {
			setTimeout(() => {
				this.client.logger.info(`Messaging service done`);
				resolve(true);
			}, 0);
		});
	}

	private createEmbed(
		color: ColorResolvable,
		message: string,
		title?: string
	): EmbedBuilder {
		return new EmbedBuilder()
			.setColor(color)
			.setDescription(message)
			.setTitle(title ?? null);
	}

	public infoEmbed(message: string, title?: string): EmbedBuilder {
		return this.createEmbed('Blue', message, title);
	}

	public warnEmbed(message: string, title?: string): EmbedBuilder {
		return this.createEmbed('Yellow', message, title);
	}

	public errorEmbed(message: string, title?: string): EmbedBuilder {
		return this.createEmbed('Red', message, title);
	}

	public progressBar(percent: number) {
		const left = '🟩';
		const middle = '🟩';
		const right = '🟩';
		const empty = '⬜';

		const total = 10;
		const filled = Math.round((percent / 100) * total);
		const remaining = total - filled;

		let progressBar = '';

		if (filled > 0) {
			progressBar += left;
		}

		for (let i = 1; i < filled - 1; i += 1) {
			progressBar += middle;
		}

		if (filled > 1) {
			progressBar += right;
		}

		for (let i = 0; i < remaining; i += 1) {
			progressBar += empty;
		}

		return progressBar;
	}

	public async createPagination(
		interaction: ChatInputCommandInteraction,
		pages: EmbedBuilder[],
		time: number,
		page: number
	): Promise<void> {
		if (pages.length < 2 || page < 1 || page > pages.length) {
			await interaction.reply({
				content: `Please enter a number between 1 and ${pages.length}.`,
				ephemeral: true,
			});
			return;
		}

		// Create the buttons with emojis
		const firstButton = new ButtonBuilder()
			.setStyle(ButtonStyle.Primary)
			.setEmoji('⏮️')
			.setCustomId('first');
		const previousButton = new ButtonBuilder()
			.setStyle(ButtonStyle.Primary)
			.setEmoji('◀️')
			.setCustomId('previous');
		const nextButton = new ButtonBuilder()
			.setStyle(ButtonStyle.Primary)
			.setEmoji('▶️')
			.setCustomId('next');
		const lastButton = new ButtonBuilder()
			.setStyle(ButtonStyle.Primary)
			.setEmoji('⏭️')
			.setCustomId('last');

		// Create the action row
		const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
			firstButton,
			previousButton,
			nextButton,
			lastButton,
		]);

		// Send the initial embed with the buttons
		await interaction.reply({
			embeds: [pages[page - 1]],
			components: [actionRow],
		});

		// Get the message object
		const message = await interaction.fetchReply();

		// Create a collector to listen for button clicks
		const collector = message.createMessageComponentCollector({
			filter: (i) => i.user.id === interaction.user.id, // Only collect clicks from the original user
			time, // Set the time limit
		});

		// Define a variable to store the current page index
		let currentPage = page - 1;

		// Handle the collect event
		collector.on('collect', async (i) => {
			collector.resetTimer();

			// Check which button was clicked
			switch (i.customId) {
				case 'first':
					// Go to the first page
					currentPage = 0;
					break;
				case 'previous':
					// Go to the previous page
					currentPage =
						currentPage > 0 ? currentPage - 1 : pages.length - 1;
					break;
				case 'next':
					// Go to the next page
					currentPage =
						currentPage < pages.length - 1 ? currentPage + 1 : 0;
					break;
				case 'last':
					// Go to the last page
					currentPage = pages.length - 1;
					break;
				default:
					// Invalid button
					return;
			}

			// Update the embed with the new page
			await i.update({
				embeds: [pages[currentPage]],
				components: [actionRow],
			});
		});

		// Handle the end event
		collector.on('end', async () => {
			// Disable the buttons
			const disabledRow =
				new ActionRowBuilder<ButtonBuilder>().addComponents([
					firstButton.setDisabled(true),
					previousButton.setDisabled(true),
					nextButton.setDisabled(true),
					lastButton.setDisabled(true),
				]);

			// Edit the message with the disabled buttons
			await message.edit({
				components: [disabledRow],
			});
		});
	}

	public showLeaderboard(
		interaction: ChatInputCommandInteraction,
		users: LeaderboardUser[]
	) {
		const leaderboardPages: EmbedBuilder[] = [];

		// Sort users in descending order based on scores
		const sortedUsers = users.slice().sort((a, b) => b.score - a.score);
		const userPosition = this.getUserRank(
			interaction.user.username,
			sortedUsers
		);

		const pageSize = 10;
		const totalPages = Math.ceil(sortedUsers.length / pageSize);

		for (let page = 0; page < totalPages; page += 1) {
			const startIdx = page * pageSize;
			const endIdx = Math.min(startIdx + pageSize, sortedUsers.length);
			const pageUsers = sortedUsers.slice(startIdx, endIdx);

			const embed = new EmbedBuilder()
				.setTitle('Leaderboard')
				.setDescription(
					`${
						userPosition > 0
							? `You are ranked ${userPosition} out of ${sortedUsers.length} members.\n\n`
							: ''
					}${pageUsers
						.map((user, index) => {
							const rank = startIdx + index + 1;
							const rankEmoji = this.getRankEmoji(rank);
							const isCommandUser =
								user.name === interaction.user.username;
							const userEntry = `${rankEmoji || `**${rank}.**`} **${user.name}** - Score: **${user.score.toLocaleString()}** (Level **${user.level}**) ${isCommandUser ? '🔸' : ''}`;
							return userEntry;
						})
						.join('\n')}`
				)
				.setFooter({ text: `Page ${page + 1}/${totalPages}` });

			leaderboardPages.push(embed);
		}

		return leaderboardPages;
	}

	private getRankEmoji(rank: number): string {
		switch (rank) {
			case 1:
				return '🥇';
			case 2:
				return '🥈';
			case 3:
				return '🥉';
			default:
				return '';
		}
	}

	private getUserRank(
		userName: string,
		sortedUsers: LeaderboardUser[]
	): number {
		const userIndex = sortedUsers.findIndex((user) => user.name === userName);
		return userIndex !== -1 ? userIndex + 1 : 0; // Return 0 if user not found
	}
}
