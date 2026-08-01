// Purpose: maps the numeric ISO 3166-1 country codes used by the bundled
// world-atlas country outlines (see PmosGlobe.tsx) to a simplified 6-continent
// grouping, since the globe interaction is per-country but the displayed
// stat is per-continent. A few transcontinental countries are assigned by
// common convention (e.g. Russia -> Europe, Turkey -> Asia) rather than any
// precise geographic split — reasonable for this display, not a scientific
// claim. A handful of disputed territories with no stable ISO numeric code
// in the source data (Kosovo, N. Cyprus, Somaliland) are left unmapped.
export type Continent =
  | "Africa"
  | "Asia"
  | "Europe"
  | "North America"
  | "South America"
  | "Oceania";

export const COUNTRY_ID_TO_CONTINENT: Record<string, Continent> = {
  // Africa
  "012": "Africa", // Algeria
  "024": "Africa", // Angola
  "204": "Africa", // Benin
  "072": "Africa", // Botswana
  "854": "Africa", // Burkina Faso
  "108": "Africa", // Burundi
  "120": "Africa", // Cameroon
  "140": "Africa", // Central African Rep.
  "148": "Africa", // Chad
  "178": "Africa", // Congo
  "180": "Africa", // Dem. Rep. Congo
  "384": "Africa", // Côte d'Ivoire
  "262": "Africa", // Djibouti
  "818": "Africa", // Egypt
  "226": "Africa", // Eq. Guinea
  "232": "Africa", // Eritrea
  "748": "Africa", // eSwatini
  "231": "Africa", // Ethiopia
  "266": "Africa", // Gabon
  "270": "Africa", // Gambia
  "288": "Africa", // Ghana
  "324": "Africa", // Guinea
  "624": "Africa", // Guinea-Bissau
  "404": "Africa", // Kenya
  "426": "Africa", // Lesotho
  "430": "Africa", // Liberia
  "434": "Africa", // Libya
  "450": "Africa", // Madagascar
  "454": "Africa", // Malawi
  "466": "Africa", // Mali
  "478": "Africa", // Mauritania
  "504": "Africa", // Morocco
  "508": "Africa", // Mozambique
  "516": "Africa", // Namibia
  "562": "Africa", // Niger
  "566": "Africa", // Nigeria
  "646": "Africa", // Rwanda
  "728": "Africa", // S. Sudan
  "686": "Africa", // Senegal
  "694": "Africa", // Sierra Leone
  "706": "Africa", // Somalia
  "710": "Africa", // South Africa
  "729": "Africa", // Sudan
  "834": "Africa", // Tanzania
  "768": "Africa", // Togo
  "788": "Africa", // Tunisia
  "800": "Africa", // Uganda
  "732": "Africa", // W. Sahara
  "894": "Africa", // Zambia
  "716": "Africa", // Zimbabwe

  // Asia
  "004": "Asia", // Afghanistan
  "051": "Asia", // Armenia
  "031": "Asia", // Azerbaijan
  "050": "Asia", // Bangladesh
  "064": "Asia", // Bhutan
  "096": "Asia", // Brunei
  "116": "Asia", // Cambodia
  "156": "Asia", // China
  "268": "Asia", // Georgia
  "356": "Asia", // India
  "360": "Asia", // Indonesia
  "364": "Asia", // Iran
  "368": "Asia", // Iraq
  "376": "Asia", // Israel
  "392": "Asia", // Japan
  "400": "Asia", // Jordan
  "398": "Asia", // Kazakhstan
  "414": "Asia", // Kuwait
  "417": "Asia", // Kyrgyzstan
  "418": "Asia", // Laos
  "422": "Asia", // Lebanon
  "458": "Asia", // Malaysia
  "496": "Asia", // Mongolia
  "104": "Asia", // Myanmar
  "524": "Asia", // Nepal
  "408": "Asia", // North Korea
  "512": "Asia", // Oman
  "586": "Asia", // Pakistan
  "275": "Asia", // Palestine
  "608": "Asia", // Philippines
  "634": "Asia", // Qatar
  "682": "Asia", // Saudi Arabia
  "410": "Asia", // South Korea
  "144": "Asia", // Sri Lanka
  "760": "Asia", // Syria
  "158": "Asia", // Taiwan
  "762": "Asia", // Tajikistan
  "764": "Asia", // Thailand
  "626": "Asia", // Timor-Leste
  "792": "Asia", // Turkey
  "795": "Asia", // Turkmenistan
  "784": "Asia", // United Arab Emirates
  "860": "Asia", // Uzbekistan
  "704": "Asia", // Vietnam
  "887": "Asia", // Yemen

  // Europe
  "008": "Europe", // Albania
  "040": "Europe", // Austria
  "112": "Europe", // Belarus
  "056": "Europe", // Belgium
  "070": "Europe", // Bosnia and Herz.
  "100": "Europe", // Bulgaria
  "191": "Europe", // Croatia
  "196": "Europe", // Cyprus
  "203": "Europe", // Czechia
  "208": "Europe", // Denmark
  "233": "Europe", // Estonia
  "246": "Europe", // Finland
  "250": "Europe", // France
  "276": "Europe", // Germany
  "300": "Europe", // Greece
  "348": "Europe", // Hungary
  "352": "Europe", // Iceland
  "372": "Europe", // Ireland
  "380": "Europe", // Italy
  "428": "Europe", // Latvia
  "440": "Europe", // Lithuania
  "442": "Europe", // Luxembourg
  "807": "Europe", // Macedonia
  "498": "Europe", // Moldova
  "499": "Europe", // Montenegro
  "528": "Europe", // Netherlands
  "578": "Europe", // Norway
  "616": "Europe", // Poland
  "620": "Europe", // Portugal
  "642": "Europe", // Romania
  "643": "Europe", // Russia
  "688": "Europe", // Serbia
  "703": "Europe", // Slovakia
  "705": "Europe", // Slovenia
  "724": "Europe", // Spain
  "752": "Europe", // Sweden
  "756": "Europe", // Switzerland
  "804": "Europe", // Ukraine
  "826": "Europe", // United Kingdom

  // North America
  "044": "North America", // Bahamas
  "084": "North America", // Belize
  "124": "North America", // Canada
  "188": "North America", // Costa Rica
  "192": "North America", // Cuba
  "214": "North America", // Dominican Rep.
  "222": "North America", // El Salvador
  "304": "North America", // Greenland
  "320": "North America", // Guatemala
  "332": "North America", // Haiti
  "340": "North America", // Honduras
  "388": "North America", // Jamaica
  "484": "North America", // Mexico
  "558": "North America", // Nicaragua
  "591": "North America", // Panama
  "630": "North America", // Puerto Rico
  "780": "North America", // Trinidad and Tobago
  "840": "North America", // United States of America

  // South America
  "032": "South America", // Argentina
  "068": "South America", // Bolivia
  "076": "South America", // Brazil
  "152": "South America", // Chile
  "170": "South America", // Colombia
  "218": "South America", // Ecuador
  "328": "South America", // Guyana
  "600": "South America", // Paraguay
  "604": "South America", // Peru
  "740": "South America", // Suriname
  "858": "South America", // Uruguay
  "862": "South America", // Venezuela

  // Oceania
  "036": "Oceania", // Australia
  "242": "Oceania", // Fiji
  "540": "Oceania", // New Caledonia
  "554": "Oceania", // New Zealand
  "598": "Oceania", // Papua New Guinea
  "090": "Oceania", // Solomon Is.
  "548": "Oceania", // Vanuatu
};
