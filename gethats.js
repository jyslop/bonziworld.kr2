const fs = require('fs');
const path = require('path');
const http = require('https');

// JSON data containing hat lists
const hatData = {
  "hats": [
    "tophat", "spongebob", "cone", "doge", "windows", "shirt", "blueshirt",
    "greenshirt", "purpleshirt", "yellowshirt", "blackshirt", "redshirt",
    "boots", "swimring", "shoes", "patrick", "yahu", "bieber", "bluebowtie",
    "troll", "kamala", "banana", "rock", "mario", "ronald", "ronaldo", "bart",
    "elon", "bucket", "kim", "scarf", "obama", "bfdi", "maga", "evil", "glue",
    "emoji", "seth", "orangepunchinggloves", "orangeears", "orangetail",
    "greenchefhat", "bathbomb", "mao", "wizard", "paintbucket", "cat", "idiot",
    "witch", "qmark", "horse", "bowtie", "pot", "chain", "chef", "ushanka",
    "party", "epic", "bush", "clown", "camel", "sunglasses"
  ],
  "blessedHats": [
    "dank", "cigar", "illuminati", "bear", "truck", "propeller", "nopupil",
    "pumpkin", "cauldron", "frankenstein", "hockey", "don", "decorated",
    "santa", "elf", "rudolph", "silverfedora"
  ],
  "hatCrafterHats": [
    "bfdisad", "trollsad"
  ],
  "vaultHats": [
    "rainbowglitch", "unicorn", "headphones", "sprout", "mustache", "glitch",
    "greenhat", "purplehat", "redhat", "yellowhat", "whitehat", "bluehat",
    "goldhat", "rainbowhat", "emeraldhat", "diamondhat", "whiteobama"
  ]
};

const BASE_URL = 'https://bonziworld.kr/img/bonzi/';
const OUTPUT_DIR = path.join(__dirname, 'hats');

// Ensure destination directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Combine all hat names into a single list without duplicates
const allHats = Array.from(new Set([
  ...hatData.hats,
  ...hatData.blessedHats,
  ...hatData.hatCrafterHats,
  ...hatData.vaultHats
]));

/**
 * Downloads a single file if the URL returns an HTTP 200 response.
 */
function downloadHat(hatName) {
  return new Promise((resolve) => {
    const fileUrl = `${BASE_URL}${hatName}.webp`;
    const filePath = path.join(OUTPUT_DIR, `${hatName}.webp`);

    http.get(fileUrl, (response) => {
      // Check if HTTP status is OK (200)
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`[✓] Downloaded: ${hatName}.webp`);
          resolve(true);
        });

        fileStream.on('error', (err) => {
          fs.unlink(filePath, () => {}); // Clean up partial file
          console.error(`[X] File error for ${hatName}:`, err.message);
          resolve(false);
        });
      } else {
        // Discard response body if not 200 (e.g. 404 Not Found)
        response.resume();
        console.warn(`[!] Skipped (HTTP ${response.statusCode}): ${hatName}.webp`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error(`[X] Request error for ${hatName}:`, err.message);
      resolve(false);
    });
  });
}

/**
 * Iterates through all hats sequentially.
 */
async function processDownloads() {
  console.log(`Starting download for ${allHats.length} hats...\n`);
  let successCount = 0;

  for (const hat of allHats) {
    const success = await downloadHat(hat);
    if (success) successCount++;
  }

  console.log(`\nFinished! Successfully downloaded ${successCount}/${allHats.length} hats to "${OUTPUT_DIR}".`);
}

processDownloads();