#!/usr/bin/zsh

# Evie Development Script
# Based off of /favna's docker script

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Display a message, wrapping lines at the terminal width.
message() {
    printf "$1 \n"
}

help() {
    message "\n${BLUE}Evie development script${NC}

    ${GREEN}Usage:${NC}\n
        ./evie.sh [COMMAND] [ARGS...]
        ./evie.sh -h | --help

    ${YELLOW}Commands:${NC}\n
        build           Builds a service.
        clean           Delete all builds.
        dev             Start tsc-watching a service.
        add             Run yarn add <package> in the service directory.
        remove          Run yarn remove <package> in the service directory.
        pushdb          Push the database schema to the configured database.
        generatedb      Compile the database schema to JavaScript/TypeScript typings."
}

case $1 in
build) cd ./services/$2 && yarn build;;
clean) cd ./services/$2 && yarn clean;;
dev) cd ./services/$2 && yarn dev;;
add) cd ./services/$2 && yarn add $3;;
remove) cd ./services/$2 && yarn remove $3;;
pushdb) cd ./services/backend && yarn pushdb $3;;
generatedb) cd ./services/backend && yarn generatedb;;
*) help ;;
esac