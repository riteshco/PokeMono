export class Utils{

    showLoadingScreen() {
        document.getElementById("loading-screen").style.display = "flex";
    }
    
    
    hideLoadingScreen() {
        document.getElementById("loading-screen").style.display = "none";
    }

    calculateDamage(level, power, attack, defense) {
        const base = (((2 * level) / 10 + 2) * power * (attack / defense)) / 50 + 2;
        return Math.floor(base * (0.85 + Math.random() * 0.15));
    }

    async fetchPokemonStat(data) {
        return {
            name: data.name,
            stats: data.stats,
            moves: data.moves,
            sprite: data.sprites.front_default
        };
    }

    getStat(statsArray, statName) {
        return statsArray.find(s => s.stat.name === statName).base_stat;
    }

    async fetchMove(moveUrl) {
        const res = await fetch(moveUrl);
        const moveData = await res.json();
        return {
            name: moveData.name,
            power: moveData.power,
            accuracy: moveData.accuracy,
            type: moveData.type.name
        };
    }

    async dataGet(name) {
        this.showLoadingScreen();
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

            if (!response.ok) {
                throw new Error("Couldn't fetch resource")
            }

            const data = await response.json();
            this.hideLoadingScreen();

            return data;
        } catch (error) {
            console.error(error);
            this.hideLoadingScreen();
        }
    }


    async GetRandomPokemon(){
        const MaxID = 1010
        const randomID = Math.floor(Math.random() * 1010) + 1;

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomID}`)
        const data = await response.json()

        return data.name
    }

}