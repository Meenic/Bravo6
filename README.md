# Bravo6 Discord Bot

Bravo6 is a versatile Discord bot designed for various tasks.

## Features

### `/assign_role` Command

The bot assigns a specified role to a group of members based on specified conditions. It provides customization through subcommands and options, displaying a progress bar and result summary in an embed message.

#### Subcommands:

-  `all`: Assigns the role to all members.
-  `filter`: Assigns the role to members with a specified role.

#### Options:

-  `target_role` (Required): Specifies the role for assignment.
-  `include_bots` (Optional): Determines whether to include bot members.
-  `reason` (Optional): Specifies the reason for the role assignment.
-  `filter_role` (Required for `filter`): Specifies the role members must have to be eligible.

## Installation

### Prerequisites:

-  Node.js and npm installed
-  Discord bot created with a token

### Steps:

1. Clone or download the repository.
2. Run `npm install` to install dependencies.
3. Rename `.env.example` to `.env` and fill in the required information.
4. Run `npm run build` to compile TypeScript files.
5. Run `npm start` to start the bot.

## License

This project is licensed under the MIT License.

## Contributors

Bravo6 is developed by [@Meenic](https://github.com/Meenic) (Discord: rainbowistaken). Contributions are welcome; fork the repository and make a pull request.
