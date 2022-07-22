#!/bin/bash
nice -50 geth --datadir ~/.ethereum/net2020 --networkid 2020 console --http --http.port 8545 --http.addr "0.0.0.0" --http.corsdomain "*" --http.api "eth,net,personal,debug" --allow-insecure-unlock --nousb console
