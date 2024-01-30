import type { CommandsService } from './services/commands';
import type { MessagingService } from './services/messaging';
import type { Service } from './services/service';

export enum CommandName {
	// General
	Hello = 'hello',
	Help = 'help',

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
