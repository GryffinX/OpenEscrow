# Inco Integration

OpenEscrow integrates Inco as a privacy layer for sensitive milestone
and dispute-related data.

## Why Inco?

Escrow settlement must be transparent, but milestone evidence
and dispute context should remain private.

## How It Works

1. Users submit milestone or dispute evidence privately.
2. Evidence is processed using Inco confidential compute.
3. Inco returns a public approval signal.
4. The escrow contract executes based on that signal.

The escrow smart contract itself remains unchanged and auditable.
