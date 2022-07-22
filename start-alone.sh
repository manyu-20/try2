#!/bin/bash
nice -50 geth --datadir ~/.ethereum/net2020 --nodiscover --networkid 2020 --netrestrict 127.0.0.1/8 console --maxpeers 0 --http --http.port 8545 --http.addr "0.0.0.0" --http.corsdomain "*" --http.api "eth,net,personal,debug" --allow-insecure-unlock  console
