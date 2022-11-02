#!/bin/bash
set -euo

#RETRIES=${RETRIES:-20}
#JSON='{"jsonrpc":"2.0","id":0,"method":"net_version","params":[]}'

if [ -z "$L1_CHAIN_HTTP" ]; then
    echo "Must specify \$L1_CHAIN_HTTP."
    exit 1
fi
if [ -z "$FUEL_CHAIN_HTTP" ]; then
    echo "Must specify \$FUEL_CHAIN_HTTP."
    exit 1
fi
if [ -z "$EXECUTOR_KEY" ]; then
    echo "Must specify \$EXECUTOR_KEY."
    exit 1
fi

# wait for the base layer to be up
#echo "Waiting for L1."
#curl \
#    --fail \
#    --show-error \
#    --silent \
#    -H "Content-Type: application/json" \
#    --retry-connrefused \
#    --retry $RETRIES \
#    --retry-delay 1 \
#    -d $JSON \
#    $CONTRACTS_RPC_URL > /dev/null

# wait for fuel client to be up
#TODO

# run the executor program
exec bridge-message-executor
