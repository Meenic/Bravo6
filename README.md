# Bravo6

Bravo6 is a simple and fun Discord bot that can do various tasks.

## Features

-  `/assign_role` - The bot will assign a specified role to a group of members who meet certain conditions. You can use subcommands and options to customize the role assignment process. The bot will show a progress bar and a summary of the results in an embed message.

   -  Subcommands:
      -  `all` - The bot will assign the role to all members who do not have the role already.
      -  `role` - The bot will assign the role to members who have another specified role and do not have the role already.
   -  Options:

      -  `role` - The role that you want to assign to the members. This is a required option for both subcommands.
      -  `include_bots` - A boolean value that determines whether to include or exclude bot members in the role assignment. This is an optional option for both subcommands.
      -  `reason` - A string that specifies the reason for the role assignment. This is an optional option for both subcommands.
      -  `target_role` - The role that the members must have in order to be eligible for the role assignment. This is a required option for the `role` subcommand.

## Installation

To install Bravo6, you need to have Node.js and npm installed on your machine. You also need to create a Discord bot and get a token.

1. Clone this repository or download the zip file
2. Run `npm install` to install the dependencies
3. Rename the `.env.example` file to `.env` and fill out everything
4. Run `npm run build` to compile the typescript files
5. Run `npm start` to start the bot

## License

This project is licensed under the MIT License.

## Contributors

Bravo6 is developed by [@Meenic](https://github.com/Meenic) (Discord: rainbowistaken). If you want to contribute to this project, feel free to fork this repository and make a pull request.
