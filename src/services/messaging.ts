import { ColorResolvable, EmbedBuilder } from 'discord.js';
import { Service } from './service';

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
}
