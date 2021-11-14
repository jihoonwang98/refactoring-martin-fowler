const plays = require("./static/plays.json");

module.exports = createStatementData;
function createStatementData(invoice) {
    const data = {};
    data.customer = invoice.customer;
    data.performances = invoice.performances.map(enrichPerformance);
    data.totalAmount = totalAmount(data);
    data.totalVolumeCredits = totalVolumeCredits(data);

    function enrichPerformance(performance) {
        const result = Object.assign({}, performance);
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    function totalVolumeCredits(data) {
        return data.performances
            .reduce((total, p) => total + p.volumeCredits, 0);
    }

    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount, 0);
    }

    function playFor(performance) {
        return plays[performance.playID];
    }

    function amountFor(performance) {
        let result = 0;
        const play = playFor(performance);
        switch (play.type) {
            case "tragedy":
                result = 40000;
                if (performance.audience > 30) {
                    result += 1000 * (performance.audience - 30);
                }
                break;

            case "comedy":
                result = 30000;
                if (performance.audience > 20) {
                    result += 10000 + 500 * (performance.audience - 20);
                }
                result += 300 * performance.audience;
                break;

            default:
                throw new Error(`알 수 없는 장르: ${play.type}`);
        }
        return result;
    }

    function volumeCreditsFor(performance) {
        let result = 0;

        result += Math.max(performance.audience - 30, 0);
        if ("comedy" === playFor(performance).type) {
            result += Math.floor(performance.audience / 5);
        }

        return result;
    }

    return data;
}
