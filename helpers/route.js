module.exports = (route) => {
                    switch(route) {
                    case "oral":
                    return "Jangan lupa minum ";
                    case "otic":
                    return "Jangan lupa di tetes yaaa telinganya pakai ";
                    case "intramuscular":
                    return "Jangan lupa suntik ";
                    default:
                    return "Jangan lupa obat";
                    }
                }