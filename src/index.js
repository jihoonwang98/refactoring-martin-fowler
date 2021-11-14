const invoices = require('./static/invoices.json');
const createStatementData = require("./createStatementData");


function usd(aNumber) {
    return new Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format(aNumber / 100);
}

function statement(invoice) {
    return renderPlainText(createStatementData(invoice));
}

function renderPlainText(data) {
    let result = `청구 내역 (고객명: ${data.customer})\n`;

    for (let performance of data.performances) {
        // 청구 내역을 출력한다.
        result += `  ${performance.play.name}: ${usd(performance.amount)} (${performance.audience}석)\n`;
    }

    result += `총액: ${usd(data.totalAmount)}\n`;
    result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
    return result;
}

function htmlStatement(invoice) {
    return renderHtml(createStatementData(invoice));
}

function renderHtml(data) {
    let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`;

    result += `<table>
                <tr>
                  <th>연극</th>
                  <th>좌석 수</th>
                  <th>금액</th>
                </tr>`;

    for (let performance of data.performances) {
        result += `  <tr><td>${performance.play.name}</td><td>${usd(performance.amount)}</td><td>(${performance.audience}석)</td></tr>\n`;
    }

    result += `<p>총액: ${usd(data.totalAmount)}</p>\n`;
    result += `<p>적립 포인트: ${data.totalVolumeCredits}점</p>\n`;
    return result;
}


console.log(statement(invoices[0]));
