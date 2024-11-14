
# Mome CLI

With the CLI, you can conveniently and quickly conduct transactions on the MOME Launchpad without accessing the MOME web interface.

## Setup

### Prerequisites

- Node.js >= 18.x
- Solana

### Installation

```zsh
$ npm i -g @dexlab-project/mome-cli
```

## Config

Use the `config` command to view the current user settings. If it’s the first time running the CLI, you will be prompted to enter information to set up the RPC and wallet. Once completed, the current configuration details will be displayed.

If this setup step is skipped, a prompt will appear for the configuration details when executing the buy/sell commands.

```zsh
$ mome config
✔ Enter wallet path:
? Enter RPC URL:
{
  "walletPath": "<YOUR SOLANA CLI WALLET PATH>",
  "rpcUrl": "<YOUR RPC URL>",
  "slippage": 1500,
  "waitForConfirmation": true
}
```

## Usage

### buy / sell

#### Interactive Mode

Entering only the `mome` command launches interactive mode, allowing you to select either the buy or sell command. After selecting a command, enter the token and quantity to proceed with the transaction.

```zsh
$ mome
? Choose a command: (Use arrow keys)
> buy
  sell
  list
  exit
```

#### Command Line Mode

You can initiate a transaction directly with the `buy` or `sell` command. If any required transaction details are missing, you will be prompted to enter them.

```zsh
$ mome buy <token-address> <amount> <options>
```

#### Arguments

- **token address**: The address of the token you want to trade.
- **amount**: The quantity of tokens to trade.
    - When using the sell command, you can enter the exact amount or a percentage (%) of your holdings.
    - For example, entering `10000` will sell 10,000 tokens, while `10%` will sell 10% of your tokens. If you hold 10,000 tokens, 1,000 will be sold.
    - Percentage-based sales support up to two decimal places, with the third decimal truncated.

#### Options

| Parameter                        | Default | Description                                                                                       |
|----------------------------------|---------|---------------------------------------------------------------------------------------------------|
| `-y`, `--yes`                    | false   | Skips the final confirmation before proceeding with the transaction. If not set, a summary will display, and confirmation will be required. |
| `-s <bps>`, `--slippage <bps>`   | 1500    | Sets the slippage tolerance in basis points. For example, `1500` represents a 1.5% slippage.      |
| `--use-compute-unit [preset]`    | N/A     | Specifies the compute unit for transaction processing, using predefined presets.                  |
| `--use-jito-boost [lamports]`    | false   | Enables Jito Boost with a default of 0.001 SOL if no lamport amount is specified.                 |

##### Compute Unit Preset

The `--use-compute-unit` option allows you to specify the compute unit for transaction processing. Available presets are:

| Preset   | computeUnitPrice | computeUnitLimit |
|----------|------------------|------------------|
| `default` | 0                | 200,000          |
| `low`     | 1000             | 500,000          |
| `medium`  | 2000             | 1,000,000        |
| `high`    | 3000             | 1,500,000        |
| `ultra`   | 4000             | 2,000,000        |

### Config

Use the `config` command to view or change the current settings.

#### View Settings

Use `mome config` or `mome config get`.

```zsh
$ mome config get
{
  "walletPath": "<path>/.config/solana/id.json",
  "rpcUrl": "https://<RPC_URL>",
  "slippage": 1500,
  "waitForConfirmation": true
}
```

#### Modify Settings

To change a setting, use `mome config set <key> <value>`.

```zsh
$ mome config set <key> <value>
```

Available settings:

| Parameter              | Type      | Default | Description                                                                                           |
|------------------------|-----------|---------|-------------------------------------------------------------------------------------------------------|
| `walletPath`           | `string`  | null    | Path to the wallet used for transactions. Enter the location of the JSON file created by solana-keygen or another method. |
| `rpcUrl`               | `string`  | null    | RPC URL to use for transactions.                                                                     |
| `slippage`             | `number`  | 1500    | Slippage tolerance in basis points. For example, `1500` represents a 1.5% slippage. Range is 0–10000.|
| `waitForConfirmation`  | `boolean` | true    | Waits until the transaction reaches confirmed status. Set to false to exit the program after sending. |

### List

Use `mome list <option>` to view the list of available tokens for purchase.

```zsh
$ mome list
? Choose a token to trade:
  MOME    CrMCv6oAr2HbTTiUQ3of8eCBgBMUdaS34JSyaYkvD3wz 2024-10-28 11:27:49 🟢Active
  $olPEPE HQSK7jGo5J4UwTyQa4qfvxTvkZXFEfpJNDqan5uYAp82 2024-10-28 11:26:18 🚀Migrated
  test4   AnhMP8ndNRZE6T64UGubCJBX5QAokvdCoKVAWK7bU8g3 2024-11-01 09:50:42 🟢Active
  test3   4R1XngXUGUxzHNBLxXuA5EKn7yubvAB5vGfLfHJdd1qg 2024-11-01 09:46:11 🟢Active
❯ Next >>
```

Selecting a token launches the purchase prompt, where you can immediately enter the price to buy. Use `Next >>` to navigate between pages. Adjust sorting by `--sort <sortOption>`, with available options `createdAt` (default), `lastCommentedAt`, and `marketCap`, sorted in descending order.

### Help

Use the `mome help` command to view help information. For specific command details, use `mome help <command>`.
