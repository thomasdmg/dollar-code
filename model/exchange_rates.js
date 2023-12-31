
// Taux de change en date du 27/11/2023
var exchange_rate = {
    "EUR":1,
    "AED":4.0169,
    "AFN":77.5121,
    "ALL":103.9194,
    "AMD":439.5622,
    "ANG":1.9579,
    "AOA":915.1414,
    "ARS":391.0570,
    "AUD":1.6619,
    "AWG":1.9579,
    "AZN":1.8373,
    "BAM":1.9558,
    "BBD":2.1875,
    "BDT":120.4452,
    "BGN":1.9558,
    "BHD":0.4113,
    "BIF":3115.8826,
    "BMD":1.0938,
    "BND":1.4658,
    "BOB":7.4495,
    "BRL":5.3416,
    "BSD":1.0938,
    "BTN":91.1509,
    "BWP":14.9029,
    "BYN":3.4774,
    "BZD":2.1875,
    "CAD":1.4916,
    "CDF":2718.4839,
    "CHF":0.9652,
    "CLP":961.7372,
    "CNY":7.8112,
    "COP":4433.7938,
    "CRC":573.1854,
    "CUP":26.2506,
    "CVE":110.2650,
    "CZK":24.3934,
    "DJF":194.3866,
    "DKK":7.4583,
    "DOP":61.2409,
    "DZD":145.7718,
    "EGP":33.6650,
    "ERN":16.4066,
    "ETB":61.4366,
    "FJD":2.4373,
    "FKP":0.8687,
    "FOK":7.4586,
    "GBP":0.8687,
    "GEL":2.9569,
    "GGP":0.8687,
    "GHS":13.1557,
    "GIP":0.8687,
    "GMD":72.6488,
    "GNF":9366.6814,
    "GTQ":8.4290,
    "GYD":229.0027,
    "HKD":8.5232,
    "HNL":26.5776,
    "HRK":7.5345,
    "HTG":144.9858,
    "HUF":380.4264,
    "IDR":17016.8632,
    "ILS":4.0908,
    "IMP":0.8687,
    "INR":91.1422,
    "IQD":1434.4340,
    "IRR":47519.6886,
    "ISK":150.4723,
    "JEP":0.8687,
    "JMD":167.2797,
    "JOD":0.7755,
    "JPY":163.5014,
    "KES":167.4229,
    "KGS":96.9778,
    "KHR":4494.5600,
    "KID":1.6619,
    "KMF":491.9678,
    "KRW":1426.0159,
    "KWD":0.3340,
    "KYD":0.9115,
    "KZT":503.9130,
    "LAK":22183.1114,
    "LBP":16406.6096,
    "LKR":357.2295,
    "LRD":205.2012,
    "LSL":20.5751,
    "LYD":5.2712,
    "MAD":10.9653,
    "MDL":19.3417,
    "MGA":4875.6380,
    "MKD":61.4950,
    "MMK":2680.9339,
    "MNT":3760.8179,
    "MOP":8.7792,
    "MRU":43.3280,
    "MUR":47.5073,
    "MVR":16.6158,
    "MWK":1844.2680,
    "MXN":18.7231,
    "MYR":5.1220,
    "MZN":69.8300,
    "NAD":20.5751,
    "NGN":873.3381,
    "NIO":39.6003,
    "NOK":11.7197,
    "NPR":145.8414,
    "NZD":1.7992,
    "OMR":0.4206,
    "PAB":1.0938,
    "PEN":4.0885,
    "PGK":4.0308,
    "PHP":60.5571,
    "PKR":309.8713,
    "PLN":4.3669,
    "PYG":8044.1217,
    "QAR":3.9813,
    "RON":4.9705,
    "RSD":117.3773,
    "RUB":97.7619,
    "RWF":1364.1838,
    "SAR":4.1017,
    "SBD":9.2227,
    "SCR":15.1459,
    "SDG":489.2482,
    "SEK":11.4392,
    "SGD":1.4659,
    "SHP":0.8687,
    "SLE":24.4031,
    "SLL":24406.3619,
    "SOS":625.4026,
    "SRD":41.5650,
    "SSP":1174.3911,
    "STN":24.5000,
    "SYP":13894.4651,
    "SZL":20.5751,
    "THB":38.7034,
    "TJS":11.9453,
    "TMT":3.8247,
    "TND":3.3769,
    "TOP":2.5438,
    "TRY":31.5931,
    "TTD":7.2444,
    "TVD":1.6619,
    "TWD":34.6322,
    "TZS":2742.0090,
    "UAH":39.3866,
    "UGX":4158.6890,
    "USD":1.0937,
    "UYU":42.6094,
    "UZS":13448.8111,
    "VES":38.8304,
    "VND":26380.4019,
    "VUV":131.2805,
    "WST":2.9507,
    "XAF":655.9570,
    "XCD":2.9532,
    "XDR":0.8198,
    "XOF":655.9570,
    "XPF":119.3320,
    "YER":269.3438,
    "ZAR":20.5735,
    "ZMW":25.8746,
    "ZWL":6301.0166
}

function convert(item_amount, item_currency){
    let currency = item_currency.substring(0, 3);
    let res = parseInt(item_amount) * exchange_rate[currency];
    return res;
}