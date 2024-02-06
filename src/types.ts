import type { CommandsService } from './services/commands';
import type { MessagingService } from './services/messaging';
import type { Service } from './services/service';

export enum CommandName {
	// General
	Help = 'help',
	Leaderboard = 'leaderboard',

	// Moderation
	AssignRole = 'assign_role',
}

export enum CommandCategory {
	General = 'General',
	Moderation = 'Moderation',
}

export interface Services {
	[key: string]: Service;

	messaging: MessagingService;
	commands: CommandsService;
}

export interface LeaderboardUser {
	name: string;
	score: number;
	level: number;
}
