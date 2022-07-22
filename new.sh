#!/bin/bash
rm -rf ~/.ethereum/net2020
rm -rf ~/.ethash
geth --datadir ~/.ethereum/net2020 --networkid 2020 init genesis.json
