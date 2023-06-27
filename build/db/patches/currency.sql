do $body$
  declare
    doc jsonb default
      $$[
        {
          "currency_id": 1,
          "currency_code": "AED",
          "currency_name": "United Arab Emirates dirham",
          "currency_symbol": "د.إ"
        },
        {
          "currency_id": 2,
          "currency_code": "AFN",
          "currency_name": "Afghan afghani",
          "currency_symbol": "؋"
        },
        {
          "currency_id": 3,
          "currency_code": "ALL",
          "currency_name": "Albanian lek",
          "currency_symbol": "L"
        },
        {
          "currency_id": 4,
          "currency_code": "AMD",
          "currency_name": "Armenian dram",
          "currency_symbol": null
        },
        {
          "currency_id": 5,
          "currency_code": "ANG",
          "currency_name": "Netherlands Antillean guilder",
          "currency_symbol": "ƒ"
        },
        {
          "currency_id": 6,
          "currency_code": "AOA",
          "currency_name": "Angolan kwanza",
          "currency_symbol": "Kz"
        },
        {
          "currency_id": 7,
          "currency_code": "ARS",
          "currency_name": "Argentine peso",
          "currency_symbol": "$"
        },
        {
          "currency_id": 8,
          "currency_code": "AUD",
          "currency_name": "Australian dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 9,
          "currency_code": "AWG",
          "currency_name": "Aruban florin",
          "currency_symbol": "ƒ"
        },
        {
          "currency_id": 10,
          "currency_code": "AZN",
          "currency_name": "Azerbaijani manat",
          "currency_symbol": null
        },
        {
          "currency_id": 11,
          "currency_code": "BAM",
          "currency_name": "Bosnia and Herzegovina convertible mark",
          "currency_symbol": null
        },
        {
          "currency_id": 12,
          "currency_code": "BBD",
          "currency_name": "Barbadian dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 13,
          "currency_code": "BDT",
          "currency_name": "Bangladeshi taka",
          "currency_symbol": "৳"
        },
        {
          "currency_id": 14,
          "currency_code": "BGN",
          "currency_name": "Bulgarian lev",
          "currency_symbol": "лв"
        },
        {
          "currency_id": 15,
          "currency_code": "BHD",
          "currency_name": "Bahraini dinar",
          "currency_symbol": ".د.ب"
        },
        {
          "currency_id": 16,
          "currency_code": "BIF",
          "currency_name": "Burundian franc",
          "currency_symbol": "Fr"
        },
        {
          "currency_id": 17,
          "currency_code": "BMD",
          "currency_name": "Bermudian dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 18,
          "currency_code": "BND",
          "currency_name": "Brunei dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 19,
          "currency_code": "BOB",
          "currency_name": "Bolivian boliviano",
          "currency_symbol": "Bs."
        },
        {
          "currency_id": 20,
          "currency_code": "BRL",
          "currency_name": "Brazilian real",
          "currency_symbol": "R$"
        },
        {
          "currency_id": 21,
          "currency_code": "BSD",
          "currency_name": "Bahamian dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 22,
          "currency_code": "BTN",
          "currency_name": "Bhutanese ngultrum",
          "currency_symbol": "Nu."
        },
        {
          "currency_id": 23,
          "currency_code": "BWP",
          "currency_name": "Botswana pula",
          "currency_symbol": "P"
        },
        {
          "currency_id": 24,
          "currency_code": "BYN",
          "currency_name": "New Belarusian ruble",
          "currency_symbol": "Br"
        },
        {
          "currency_id": 25,
          "currency_code": "BYR",
          "currency_name": "Old Belarusian ruble",
          "currency_symbol": "Br"
        },
        {
          "currency_id": 26,
          "currency_code": "BZD",
          "currency_name": "Belize dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 27,
          "currency_code": "CAD",
          "currency_name": "Canadian dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 28,
          "currency_code": "CDF",
          "currency_name": "Congolese franc",
          "currency_symbol": "Fr"
        },
        {
          "currency_id": 29,
          "currency_code": "CHF",
          "currency_name": "Swiss franc",
          "currency_symbol": "Fr"
        },
        {
          "currency_id": 30,
          "currency_code": "CKD",
          "currency_name": "Cook Islands dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 31,
          "currency_code": "CLP",
          "currency_name": "Chilean peso",
          "currency_symbol": "$"
        },
        {
          "currency_id": 32,
          "currency_code": "CNY",
          "currency_name": "Chinese yuan",
          "currency_symbol": "¥"
        },
        {
          "currency_id": 33,
          "currency_code": "COP",
          "currency_name": "Colombian peso",
          "currency_symbol": "$"
        },
        {
          "currency_id": 34,
          "currency_code": "CRC",
          "currency_name": "Costa Rican colón",
          "currency_symbol": "₡"
        },
        {
          "currency_id": 35,
          "currency_code": "CUC",
          "currency_name": "Cuban convertible peso",
          "currency_symbol": "$"
        },
        {
          "currency_id": 36,
          "currency_code": "CUP",
          "currency_name": "Cuban peso",
          "currency_symbol": "$"
        },
        {
          "currency_id": 37,
          "currency_code": "CVE",
          "currency_name": "Cape Verdean escudo",
          "currency_symbol": "Esc"
        },
        {
          "currency_id": 38,
          "currency_code": "CZK",
          "currency_name": "Czech koruna",
          "currency_symbol": "Kč"
        },
        {
          "currency_id": 39,
          "currency_code": "DJF",
          "currency_name": "Djiboutian franc",
          "currency_symbol": "Fr"
        },
        {
          "currency_id": 40,
          "currency_code": "DKK",
          "currency_name": "Danish krone",
          "currency_symbol": "kr"
        },
        {
          "currency_id": 41,
          "currency_code": "DOP",
          "currency_name": "Dominican peso",
          "currency_symbol": "$"
        },
        {
          "currency_id": 42,
          "currency_code": "DZD",
          "currency_name": "Algerian dinar",
          "currency_symbol": "د.ج"
        },
        {
          "currency_id": 43,
          "currency_code": "EGP",
          "currency_name": "Egyptian pound",
          "currency_symbol": "£"
        },
        {
          "currency_id": 44,
          "currency_code": "ERN",
          "currency_name": "Eritrean nakfa",
          "currency_symbol": "Nfk"
        },
        {
          "currency_id": 45,
          "currency_code": "ETB",
          "currency_name": "Ethiopian birr",
          "currency_symbol": "Br"
        },
        {
          "currency_id": 46,
          "currency_code": "EUR",
          "currency_name": "Euro",
          "currency_symbol": "€"
        },
        {
          "currency_id": 47,
          "currency_code": "FJD",
          "currency_name": "Fijian dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 48,
          "currency_code": "FKP",
          "currency_name": "Falkland Islands pound",
          "currency_symbol": "£"
        },
        {
          "currency_id": 49,
          "currency_code": "GBP",
          "currency_name": "British pound",
          "currency_symbol": "£"
        },
        {
          "currency_id": 50,
          "currency_code": "GEL",
          "currency_name": "Georgian Lari",
          "currency_symbol": "ლ"
        },
        {
          "currency_id": 51,
          "currency_code": "GHS",
          "currency_name": "Ghanaian cedi",
          "currency_symbol": "₵"
        },
        {
          "currency_id": 52,
          "currency_code": "GIP",
          "currency_name": "Gibraltar pound",
          "currency_symbol": "£"
        },
        {
          "currency_id": 53,
          "currency_code": "GMD",
          "currency_name": "Gambian dalasi",
          "currency_symbol": "D"
        },
        {
          "currency_id": 54,
          "currency_code": "GNF",
          "currency_name": "Guinean franc",
          "currency_symbol": "Fr"
        },
        {
          "currency_id": 55,
          "currency_code": "GTQ",
          "currency_name": "Guatemalan quetzal",
          "currency_symbol": "Q"
        },
        {
          "currency_id": 56,
          "currency_code": "GYD",
          "currency_name": "Guyanese dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 57,
          "currency_code": "HKD",
          "currency_name": "Hong Kong dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 58,
          "currency_code": "HNL",
          "currency_name": "Honduran lempira",
          "currency_symbol": "L"
        },
        {
          "currency_id": 59,
          "currency_code": "HRK",
          "currency_name": "Croatian kuna",
          "currency_symbol": "kn"
        },
        {
          "currency_id": 60,
          "currency_code": "HTG",
          "currency_name": "Haitian gourde",
          "currency_symbol": "G"
        },
        {
          "currency_id": 61,
          "currency_code": "HUF",
          "currency_name": "Hungarian forint",
          "currency_symbol": "Ft"
        },
        {
          "currency_id": 62,
          "currency_code": "IDR",
          "currency_name": "Indonesian rupiah",
          "currency_symbol": "Rp"
        },
        {
          "currency_id": 63,
          "currency_code": "ILS",
          "currency_name": "Israeli new shekel",
          "currency_symbol": "₪"
        },
        {
          "currency_id": 64,
          "currency_code": "ILS",
          "currency_name": "Israeli new sheqel",
          "currency_symbol": "₪"
        },
        {
          "currency_id": 65,
          "currency_code": "IMP[G]",
          "currency_name": "Manx pound",
          "currency_symbol": "£"
        },
        {
          "currency_id": 66,
          "currency_code": "INR",
          "currency_name": "Indian rupee",
          "currency_symbol": "₹"
        },
        {
          "currency_id": 67,
          "currency_code": "IQD",
          "currency_name": "Iraqi dinar",
          "currency_symbol": "ع.د"
        },
        {
          "currency_id": 68,
          "currency_code": "IRR",
          "currency_name": "Iranian rial",
          "currency_symbol": "﷼"
        },
        {
          "currency_id": 69,
          "currency_code": "ISK",
          "currency_name": "Icelandic króna",
          "currency_symbol": "kr"
        },
        {
          "currency_id": 70,
          "currency_code": "JEP[G]",
          "currency_name": "Jersey pound",
          "currency_symbol": "£"
        },
        {
          "currency_id": 71,
          "currency_code": "JMD",
          "currency_name": "Jamaican dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 72,
          "currency_code": "JOD",
          "currency_name": "Jordanian dinar",
          "currency_symbol": "د.ا"
        },
        {
          "currency_id": 73,
          "currency_code": "JPY",
          "currency_name": "Japanese yen",
          "currency_symbol": "¥"
        },
        {
          "currency_id": 74,
          "currency_code": "KES",
          "currency_name": "Kenyan shilling",
          "currency_symbol": "Sh"
        },
        {
          "currency_id": 75,
          "currency_code": "KGS",
          "currency_name": "Kyrgyzstani som",
          "currency_symbol": "с"
        },
        {
          "currency_id": 76,
          "currency_code": "KHR",
          "currency_name": "Cambodian riel",
          "currency_symbol": "៛"
        },
        {
          "currency_id": 77,
          "currency_code": "KMF",
          "currency_name": "Comorian franc",
          "currency_symbol": "Fr"
        },
        {
          "currency_id": 78,
          "currency_code": "KPW",
          "currency_name": "North Korean won",
          "currency_symbol": "₩"
        },
        {
          "currency_id": 79,
          "currency_code": "KRW",
          "currency_name": "South Korean won",
          "currency_symbol": "₩"
        },
        {
          "currency_id": 80,
          "currency_code": "KWD",
          "currency_name": "Kuwaiti dinar",
          "currency_symbol": "د.ك"
        },
        {
          "currency_id": 81,
          "currency_code": "KYD",
          "currency_name": "Cayman Islands dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 82,
          "currency_code": "KZT",
          "currency_name": "Kazakhstani tenge",
          "currency_symbol": null
        },
        {
          "currency_id": 83,
          "currency_code": "LAK",
          "currency_name": "Lao kip",
          "currency_symbol": "₭"
        },
        {
          "currency_id": 84,
          "currency_code": "LBP",
          "currency_name": "Lebanese pound",
          "currency_symbol": "ل.ل"
        },
        {
          "currency_id": 85,
          "currency_code": "LKR",
          "currency_name": "Sri Lankan rupee",
          "currency_symbol": "Rs"
        },
        {
          "currency_id": 86,
          "currency_code": "LRD",
          "currency_name": "Liberian dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 87,
          "currency_code": "LSL",
          "currency_name": "Lesotho loti",
          "currency_symbol": "L"
        },
        {
          "currency_id": 88,
          "currency_code": "LYD",
          "currency_name": "Libyan dinar",
          "currency_symbol": "ل.د"
        },
        {
          "currency_id": 89,
          "currency_code": "MAD",
          "currency_name": "Moroccan dirham",
          "currency_symbol": "د.م."
        },
        {
          "currency_id": 90,
          "currency_code": "MDL",
          "currency_name": "Moldovan leu",
          "currency_symbol": "L"
        },
        {
          "currency_id": 91,
          "currency_code": "MGA",
          "currency_name": "Malagasy ariary",
          "currency_symbol": "Ar"
        },
        {
          "currency_id": 92,
          "currency_code": "MKD",
          "currency_name": "Macedonian denar",
          "currency_symbol": "ден"
        },
        {
          "currency_id": 93,
          "currency_code": "MMK",
          "currency_name": "Burmese kyat",
          "currency_symbol": "Ks"
        },
        {
          "currency_id": 94,
          "currency_code": "MNT",
          "currency_name": "Mongolian tögrög",
          "currency_symbol": "₮"
        },
        {
          "currency_id": 95,
          "currency_code": "MOP",
          "currency_name": "Macanese pataca",
          "currency_symbol": "P"
        },
        {
          "currency_id": 96,
          "currency_code": "MRO",
          "currency_name": "Mauritanian ouguiya",
          "currency_symbol": "UM"
        },
        {
          "currency_id": 97,
          "currency_code": "MUR",
          "currency_name": "Mauritian rupee",
          "currency_symbol": "₨"
        },
        {
          "currency_id": 98,
          "currency_code": "MVR",
          "currency_name": "Maldivian rufiyaa",
          "currency_symbol": ".ރ"
        },
        {
          "currency_id": 99,
          "currency_code": "MWK",
          "currency_name": "Malawian kwacha",
          "currency_symbol": "MK"
        },
        {
          "currency_id": 100,
          "currency_code": "MXN",
          "currency_name": "Mexican peso",
          "currency_symbol": "$"
        },
        {
          "currency_id": 101,
          "currency_code": "MYR",
          "currency_name": "Malaysian ringgit",
          "currency_symbol": "RM"
        },
        {
          "currency_id": 102,
          "currency_code": "MZN",
          "currency_name": "Mozambican metical",
          "currency_symbol": "MT"
        },
        {
          "currency_id": 103,
          "currency_code": "NAD",
          "currency_name": "Namibian dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 104,
          "currency_code": "NGN",
          "currency_name": "Nigerian naira",
          "currency_symbol": "₦"
        },
        {
          "currency_id": 105,
          "currency_code": "NIO",
          "currency_name": "Nicaraguan córdoba",
          "currency_symbol": "C$"
        },
        {
          "currency_id": 106,
          "currency_code": "NOK",
          "currency_name": "Norwegian krone",
          "currency_symbol": "kr"
        },
        {
          "currency_id": 107,
          "currency_code": "(none)",
          "currency_name": "[E]",
          "currency_symbol": "$"
        },
        {
          "currency_id": 108,
          "currency_code": "(none)",
          "currency_name": "Faroese króna",
          "currency_symbol": "kr"
        },
        {
          "currency_id": 109,
          "currency_code": "(none)",
          "currency_name": "Guernsey pound",
          "currency_symbol": "£"
        },
        {
          "currency_id": 110,
          "currency_code": "(none)",
          "currency_name": "Kiribati dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 111,
          "currency_code": "(none)",
          "currency_name": "Niue dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 112,
          "currency_code": "(none)",
          "currency_name": null,
          "currency_symbol": "$"
        },
        {
          "currency_id": 113,
          "currency_code": "(none)",
          "currency_name": null,
          "currency_symbol": "£"
        },
        {
          "currency_id": 114,
          "currency_code": "(none)",
          "currency_name": null,
          "currency_symbol": null
        },
        {
          "currency_id": 115,
          "currency_code": "NPR",
          "currency_name": "Nepalese rupee",
          "currency_symbol": "₨"
        },
        {
          "currency_id": 116,
          "currency_code": "NZD",
          "currency_name": "New Zealand dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 117,
          "currency_code": "OMR",
          "currency_name": "Omani rial",
          "currency_symbol": "ر.ع."
        },
        {
          "currency_id": 118,
          "currency_code": "PAB",
          "currency_name": "Panamanian balboa",
          "currency_symbol": "B/."
        },
        {
          "currency_id": 119,
          "currency_code": "PEN",
          "currency_name": "Peruvian sol",
          "currency_symbol": "S/."
        },
        {
          "currency_id": 120,
          "currency_code": "PGK",
          "currency_name": "Papua New Guinean kina",
          "currency_symbol": "K"
        },
        {
          "currency_id": 121,
          "currency_code": "PHP",
          "currency_name": "Philippine peso",
          "currency_symbol": "₱"
        },
        {
          "currency_id": 122,
          "currency_code": "PKR",
          "currency_name": "Pakistani rupee",
          "currency_symbol": "₨"
        },
        {
          "currency_id": 123,
          "currency_code": "PLN",
          "currency_name": "Polish złoty",
          "currency_symbol": "zł"
        },
        {
          "currency_id": 124,
          "currency_code": "PYG",
          "currency_name": "Paraguayan guaraní",
          "currency_symbol": "₲"
        },
        {
          "currency_id": 125,
          "currency_code": "QAR",
          "currency_name": "Qatari riyal",
          "currency_symbol": "ر.ق"
        },
        {
          "currency_id": 126,
          "currency_code": "RON",
          "currency_name": "Romanian leu",
          "currency_symbol": "lei"
        },
        {
          "currency_id": 127,
          "currency_code": "RSD",
          "currency_name": "Serbian dinar",
          "currency_symbol": "дин."
        },
        {
          "currency_id": 128,
          "currency_code": "RUB",
          "currency_name": "Russian ruble",
          "currency_symbol": "₽"
        },
        {
          "currency_id": 129,
          "currency_code": "RWF",
          "currency_name": "Rwandan franc",
          "currency_symbol": "Fr"
        },
        {
          "currency_id": 130,
          "currency_code": "SAR",
          "currency_name": "Saudi riyal",
          "currency_symbol": "ر.س"
        },
        {
          "currency_id": 131,
          "currency_code": "SBD",
          "currency_name": "Solomon Islands dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 132,
          "currency_code": "SCR",
          "currency_name": "Seychellois rupee",
          "currency_symbol": "₨"
        },
        {
          "currency_id": 133,
          "currency_code": "SDG",
          "currency_name": "Sudanese pound",
          "currency_symbol": "ج.س."
        },
        {
          "currency_id": 134,
          "currency_code": "SEK",
          "currency_name": "Swedish krona",
          "currency_symbol": "kr"
        },
        {
          "currency_id": 135,
          "currency_code": "SGD",
          "currency_name": "Singapore dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 136,
          "currency_code": "SHP",
          "currency_name": "Saint Helena pound",
          "currency_symbol": "£"
        },
        {
          "currency_id": 137,
          "currency_code": "SLL",
          "currency_name": "Sierra Leonean leone",
          "currency_symbol": "Le"
        },
        {
          "currency_id": 138,
          "currency_code": "SOS",
          "currency_name": "Somali shilling",
          "currency_symbol": "Sh"
        },
        {
          "currency_id": 139,
          "currency_code": "SRD",
          "currency_name": "Surinamese dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 140,
          "currency_code": "SSP",
          "currency_name": "South Sudanese pound",
          "currency_symbol": "£"
        },
        {
          "currency_id": 142,
          "currency_code": "SYP",
          "currency_name": "Syrian pound",
          "currency_symbol": "£"
        },
        {
          "currency_id": 143,
          "currency_code": "SZL",
          "currency_name": "Swazi lilangeni",
          "currency_symbol": "L"
        },
        {
          "currency_id": 144,
          "currency_code": "THB",
          "currency_name": "Thai baht",
          "currency_symbol": "฿"
        },
        {
          "currency_id": 145,
          "currency_code": "TJS",
          "currency_name": "Tajikistani somoni",
          "currency_symbol": "ЅМ"
        },
        {
          "currency_id": 146,
          "currency_code": "TMT",
          "currency_name": "Turkmenistan manat",
          "currency_symbol": "m"
        },
        {
          "currency_id": 147,
          "currency_code": "TND",
          "currency_name": "Tunisian dinar",
          "currency_symbol": "د.ت"
        },
        {
          "currency_id": 148,
          "currency_code": "TOP",
          "currency_name": "Tongan paʻanga",
          "currency_symbol": "T$"
        },
        {
          "currency_id": 149,
          "currency_code": "TRY",
          "currency_name": "Turkish lira",
          "currency_symbol": null
        },
        {
          "currency_id": 150,
          "currency_code": "TTD",
          "currency_name": "Trinidad and Tobago dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 151,
          "currency_code": "TVD[G]",
          "currency_name": "Tuvaluan dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 152,
          "currency_code": "TWD",
          "currency_name": "New Taiwan dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 153,
          "currency_code": "TZS",
          "currency_name": "Tanzanian shilling",
          "currency_symbol": "Sh"
        },
        {
          "currency_id": 154,
          "currency_code": "UAH",
          "currency_name": "Ukrainian hryvnia",
          "currency_symbol": "₴"
        },
        {
          "currency_id": 155,
          "currency_code": "UGX",
          "currency_name": "Ugandan shilling",
          "currency_symbol": "Sh"
        },
        {
          "currency_id": 156,
          "currency_code": "USD",
          "currency_name": "United State Dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 157,
          "currency_code": "USD",
          "currency_name": "United States dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 158,
          "currency_code": "USD",
          "currency_name": "United States Dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 159,
          "currency_code": "UYU",
          "currency_name": "Uruguayan peso",
          "currency_symbol": "$"
        },
        {
          "currency_id": 160,
          "currency_code": "UZS",
          "currency_name": "Uzbekistani so'm",
          "currency_symbol": null
        },
        {
          "currency_id": 161,
          "currency_code": "VEF",
          "currency_name": "Venezuelan bolívar",
          "currency_symbol": "Bs F"
        },
        {
          "currency_id": 162,
          "currency_code": "VND",
          "currency_name": "Vietnamese đồng",
          "currency_symbol": "₫"
        },
        {
          "currency_id": 163,
          "currency_code": "VUV",
          "currency_name": "Vanuatu vatu",
          "currency_symbol": "Vt"
        },
        {
          "currency_id": 164,
          "currency_code": "WST",
          "currency_name": "Samoan tālā",
          "currency_symbol": "T"
        },
        {
          "currency_id": 165,
          "currency_code": "XAF",
          "currency_name": "Central African CFA franc",
          "currency_symbol": "Fr"
        },
        {
          "currency_id": 166,
          "currency_code": "XCD",
          "currency_name": "East Caribbean dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 167,
          "currency_code": "XOF",
          "currency_name": "West African CFA franc",
          "currency_symbol": "Fr"
        },
        {
          "currency_id": 168,
          "currency_code": "XPF",
          "currency_name": "CFP franc",
          "currency_symbol": "Fr"
        },
        {
          "currency_id": 169,
          "currency_code": "YER",
          "currency_name": "Yemeni rial",
          "currency_symbol": "﷼"
        },
        {
          "currency_id": 170,
          "currency_code": "ZAR",
          "currency_name": "South African rand",
          "currency_symbol": "R"
        },
        {
          "currency_id": 171,
          "currency_code": "ZAR",
          "currency_name": "South African rand",
          "currency_symbol": "Rs"
        },
        {
          "currency_id": 172,
          "currency_code": "ZMW",
          "currency_name": "Zambian kwacha",
          "currency_symbol": "ZK"
        },
        {
          "currency_id": 173,
          "currency_code": null,
          "currency_name": "[D]",
          "currency_symbol": "$"
        },
        {
          "currency_id": 174,
          "currency_code": null,
          "currency_name": "Pitcairn Islands dollar",
          "currency_symbol": "$"
        },
        {
          "currency_id": 141,
          "currency_code": "STN",
          "currency_name": "São Tomé and Príncipe dobra",
          "currency_symbol": "Db"
        }
      ]$$::jsonb;
  begin
    with __missing as (
      select _c.*
      from jsonb_array_elements( doc ) e( element )
             inner join jsonb_populate_record( null::geoinfo.currency, e.element ) _c on true
             left join geoinfo.currency cu on cu.currency_id = _c.currency_id
      where cu.currency_id is null
    ) insert into geoinfo.currency
    select * from __missing;
  end;
$body$;