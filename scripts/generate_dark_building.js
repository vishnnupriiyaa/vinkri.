const fs = require('fs');
const { execSync } = require('child_process');

// 1. Convert source image to PPM (raw RGB bytes)
const srcPath = '/app/applet/public/assets/aistudio/light_building.jpg';
const ppmPath = '/tmp/light_building.ppm';
const outPpmPath = '/tmp/dark_building.ppm';
const outJpgPath = '/app/applet/public/assets/aistudio/dark_building.jpg';
const outJpgPathPublicImages = '/app/applet/public/assets/images/dark_building.jpg';

console.log('Converting to PPM...');
execSync(`convert "${srcPath}" "${ppmPath}"`);

const buffer = fs.readFileSync(ppmPath);

// Parse PPM header (P6, width, height, maxVal)
let headerEnd = 0;
let newlines = 0;
while (newlines < 3 && headerEnd < buffer.length) {
  if (buffer[headerEnd] === 0x0a) newlines++;
  headerEnd++;
}

const headerStr = buffer.slice(0, headerEnd).toString('ascii');
const [magic, dims, maxVal] = headerStr.trim().split(/\s+/);
const [width, height] = dims ? [parseInt(dims), parseInt(maxVal)] : headerStr.trim().split(/\s+/).slice(1, 3).map(Number);
const W = 1376;
const H = 768;
const pixelsOffset = headerEnd;

console.log(`PPM parsed: W=${W}, H=${H}, data offset=${pixelsOffset}`);

// Output pixel buffer
const outBuf = Buffer.from(buffer);

// Coordinates of building
const bx1 = 404;
const bx2 = 972;
const by1 = 38;
const by2 = 715;

// Horizontal beams (Y ranges)
const hBeams = [
  [38, 68],   // Roof beam
  [195, 216], // 5 to 4
  [337, 359], // 4 to 3
  [480, 502], // 3 to 2
  [622, 644], // 2 to 1
  [740, 780]  // Ground header
];

// Vertical columns (X ranges)
const vColumns = [
  [404, 432], // Left outer pillar
  [579, 599], // Col 1
  [777, 797], // Col 2
  [945, 972]  // Right outer pillar
];

function isBeam(x, y) {
  if (x < bx1 || x > bx2 || y < by1 || y > by2) return false;
  for (const [yMin, yMax] of hBeams) {
    if (y >= yMin && y <= yMax) return true;
  }
  for (const [xMin, xMax] of vColumns) {
    if (x >= xMin && x <= xMax) return true;
  }
  return false;
}

// Pseudo-random star generator
function hash(x, y) {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
}

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = pixelsOffset + (y * W + x) * 3;
    let r = buffer[idx];
    let g = buffer[idx + 1];
    let b = buffer[idx + 2];

    const inBuilding = (x >= bx1 && x <= bx2 && y >= by1 && y <= by2);

    if (inBuilding) {
      if (isBeam(x, y)) {
        // Transform exterior limestone frame to dark luxury espresso charred timber / bronze
        // Original is light cream (r~180-220, g~170-200, b~150-180)
        // Target: rich dark espresso #201711 to #2c2018 with subtle warm timber grain
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        // Dark metallic/timber tone
        r = Math.min(255, Math.floor(lum * 68 + 18));
        g = Math.min(255, Math.floor(lum * 52 + 13));
        b = Math.min(255, Math.floor(lum * 40 + 9));
      } else {
        // Inside glass display chambers:
        // Enhance warm golden glow, deepen room shadow depths for dramatic nighttime contrast
        // Boost warmth and contrast
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Deepen shadows, keep highlights brilliant (curve adjustment)
        const contrastFactor = Math.pow(lum, 1.12);
        
        // Golden amber warmth tint
        r = Math.min(255, Math.floor(r * 1.04 * (contrastFactor / (lum + 0.001))));
        g = Math.min(255, Math.floor(g * 0.98 * (contrastFactor / (lum + 0.001))));
        b = Math.min(255, Math.floor(b * 0.82 * (contrastFactor / (lum + 0.001))));
        
        // Ensure no crushed pure black inside rooms
        r = Math.max(16, r);
        g = Math.max(12, g);
        b = Math.max(8, b);
      }
    } else {
      // Outside building: Sky and surrounding street
      const isSky = (y < 510);
      
      if (isSky) {
        // Sky: Deep nighttime gradient matching website (#080504 to #160f0a)
        const skyT = y / 510; // 0 at top, 1 near horizon
        // Night sky base
        let skyR = Math.floor(7 + skyT * 14);
        let skyG = Math.floor(5 + skyT * 10);
        let skyB = Math.floor(4 + skyT * 8);

        // Subtle starry night effect in upper sky
        if (y < 350) {
          const starVal = hash(x, y);
          if (starVal > 0.9982) {
            const intensity = Math.floor((starVal - 0.9982) * 550 * 255);
            skyR = Math.min(255, skyR + intensity);
            skyG = Math.min(255, skyG + intensity);
            skyB = Math.min(255, skyB + Math.floor(intensity * 1.15));
          }
        }

        // Ambient twilight glow around building edges
        const distToBuildingX = (x < bx1) ? (bx1 - x) : (x - bx2);
        const distToBuildingY = (y < by1) ? (by1 - y) : 0;
        const dist = Math.sqrt(distToBuildingX * distToBuildingX + distToBuildingY * distToBuildingY);
        if (dist < 180) {
          const halo = Math.pow(1 - dist / 180, 2) * 0.45;
          skyR = Math.min(255, skyR + Math.floor(halo * 45));
          skyG = Math.min(255, skyG + Math.floor(halo * 32));
          skyB = Math.min(255, skyB + Math.floor(halo * 18));
        }

        r = skyR;
        g = skyG;
        b = skyB;
      } else {
        // Ground / Street at night
        // In original, it's light pavement. We transform to dark wet night asphalt with warm golden light spill
        const streetT = (y - 510) / (H - 510); // 0 near horizon, 1 at bottom
        const origLum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Base dark street asphalt
        let streetR = Math.floor(14 + streetT * 10 + origLum * 18);
        let streetG = Math.floor(10 + streetT * 8 + origLum * 14);
        let streetB = Math.floor(8 + streetT * 6 + origLum * 10);

        // Golden warm light pool in front of the storefront entrance (x ~ 450 to 920, y > 715)
        if (x >= 420 && x <= 950 && y >= 700) {
          const centerDist = Math.abs(x - 688) / 265;
          const vertDist = (y - 700) / (H - 700);
          const pool = Math.max(0, 1 - centerDist) * (1 - vertDist * 0.7);
          streetR = Math.min(255, streetR + Math.floor(pool * 65));
          streetG = Math.min(255, streetG + Math.floor(pool * 48));
          streetB = Math.min(255, streetB + Math.floor(pool * 20));
        }

        // Tree on the left (x: 80 to 220, y: 510 to 740): Keep silhouettes with warm rim
        if (x >= 60 && x <= 240 && y >= 500 && y <= 745) {
          const isFoliage = (origLum < 0.75 && origLum > 0.15);
          if (isFoliage) {
            // Dark silhouette with warm backlighting
            streetR = Math.min(255, Math.floor(origLum * 32 + 10));
            streetG = Math.min(255, Math.floor(origLum * 26 + 12));
            streetB = Math.min(255, Math.floor(origLum * 18 + 6));
          }
        }

        r = streetR;
        g = streetG;
        b = streetB;
      }
    }

    outBuf[idx] = r;
    outBuf[idx + 1] = g;
    outBuf[idx + 2] = b;
  }
}

fs.writeFileSync(outPpmPath, outBuf);
console.log('Writing final JPEG...');
execSync(`convert "${outPpmPath}" -quality 95 "${outJpgPath}"`);
execSync(`cp "${outJpgPath}" "${outJpgPathPublicImages}"`);
console.log('Successfully created dark_building.jpg in both locations!');
