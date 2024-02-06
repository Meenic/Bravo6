import { ChatInputCommandInteraction } from 'discord.js';
import { MyClient } from '../../client';
import { Command, CommandContext } from '../../command';
import { CommandCategory, CommandName, LeaderboardUser } from '../../types';

export default class LeaderboardCommand extends Command {
	public constructor(client: MyClient) {
		super(client, {
			name: CommandName.Leaderboard,
			description: 'Display the server leaderboard.',
			category: CommandCategory.General,
		});

		this.data.addIntegerOption((option) =>
			option
				.setName('page')
				.setDescription(
					'The page number of the leaderboard you want to view.'
				)
		);
	}

	public async execute(
		interaction: ChatInputCommandInteraction,
		ctx: CommandContext
	): Promise<void> {
		// Get the page number from user input or default to page 1
		const page = interaction.options.getInteger('page') ?? 1;

		const MAX_SCORE = 100000000;

		function getRandomScoreInRange(): number {
			return Math.floor(Math.random() * MAX_SCORE);
		}

		function getLevelFromScore(score: number): number {
			const BASE_LEVEL = 1;
			const SCORE_PER_LEVEL = 10000;

			const level = Math.floor(score / SCORE_PER_LEVEL) + BASE_LEVEL;

			return level;
		}

		// Array to store leaderboard user information
		const users: LeaderboardUser[] = [];

		// Fetch all members from the guild
		const members = await ctx.guild.members.fetch();

		// Loop through each member and generate random leaderboard data
		members?.forEach((member) => {
			const name = member.user.username;
			const score = getRandomScoreInRange();
			const level = getLevelFromScore(score);

			// Create a leaderboard user object and add it to the array
			const user: LeaderboardUser = { name, score, level };
			users.push(user);
		});

		// Create and display a paginated message with the generated leaderboard data
		await ctx.messaging.createPagination(
			interaction,
			ctx.messaging.showLeaderboard(interaction, users),
			10000, // Timeout for the pagination (in milliseconds)
			page
		);
	}
}
