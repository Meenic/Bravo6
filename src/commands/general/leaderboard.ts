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

		// Define score and level ranges for user generation
		const minScore = 1000;
		const maxScore = 100000;
		const minLevel = 10;
		const maxLevel = 60;

		// Helper function to generate a random integer within a range
		const randomInt = (min: number, max: number) => {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};

		// Helper function to generate a score based on the user's level
		const generateScore = (level: number) => {
			const scoreRange = maxScore - minScore;
			const levelRange = maxLevel - minLevel;
			const baseScore = Math.round(
				((level - minLevel) / levelRange) * scoreRange + minScore
			);

			const score = Math.floor(baseScore / 10) * 10;

			return Math.min(maxScore, score);
		};

		// Helper function to generate a random level within the specified range
		const generateLevel = () => {
			return randomInt(minLevel, maxLevel);
		};

		// Array to store leaderboard user information
		const users: LeaderboardUser[] = [];

		// Fetch all members from the guild
		const members = await interaction.guild?.members.fetch();

		// Loop through each member and generate random leaderboard data
		members?.forEach((member) => {
			const name = member.user.username;
			const level = generateLevel();
			const score = generateScore(level);

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
