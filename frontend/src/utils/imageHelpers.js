import canvaImg from "../assets/cover/canva.png";
import chatgptImg from "../assets/cover/chatgpt-plus.jpg";
import expressImg from "../assets/cover/express.jpeg";
import midjourneyImg from "../assets/cover/midjourney.png";
import netflixImg from "../assets/cover/netflix.jpg";
import nordvpnImg from "../assets/cover/nordvpn.jpg";
import officeImg from "../assets/cover/office-365.png";
import spotifyImg from "../assets/cover/spotify.jpg";
import steamImg from "../assets/cover/steam.jpg";
import win10Img from "../assets/cover/window-10.jpg";
import win11Img from "../assets/cover/windows-11.jpg";
import youtubeImg from "../assets/cover/youtube.jpg";
import randomImg from "../assets/cover/random-product-package.jpg";
import eldenRingImg from "../assets/cover/Elden-Ring-Shadow-of-The-Erdtree_00-1.jpg";
import cyberpunkImg from "../assets/cover/Cyberpunk-2077-Phantom-Liberty.png";
import gowImg from "../assets/cover/gow-ragnarok.jpg";
import baldurImg from "../assets/cover/baldur gate.jpg";
import courseraImg from "../assets/cover/coursera-plus-logo.png";
import duolingoImg from "../assets/cover/duolingo.jpg";
import copilotImg from "../assets/cover/github-copilot.jpg";
import psPlusImg from "../assets/cover/playstation-plus.jpg";
import adobeImg from "../assets/cover/adobe-crreative-cloud-8.jpg";

/**
 * Helper function to map product title to its corresponding cover image
 * @param {string} title - Product title
 * @param {string} category - Optional category name
 * @returns {string} - Imported image object or fallback URL
 */
export const getProductCover = (title) => {
  if (!title) return "https://via.placeholder.com/300?text=NeoShop";

  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("canva")) return canvaImg;
  if (lowerTitle.includes("chatgpt")) return chatgptImg;
  if (lowerTitle.includes("expressvpn")) return expressImg;
  if (lowerTitle.includes("midjourney")) return midjourneyImg;
  if (lowerTitle.includes("netflix")) return netflixImg;
  if (lowerTitle.includes("nordvpn")) return nordvpnImg;
  if (lowerTitle.includes("microsoft 365") || lowerTitle.includes("office"))
    return officeImg;
  if (lowerTitle.includes("spotify")) return spotifyImg;
  if (lowerTitle.includes("steam")) return steamImg;
  if (lowerTitle.includes("windows 10")) return win10Img;
  if (lowerTitle.includes("windows 11")) return win11Img;
  if (lowerTitle.includes("youtube")) return youtubeImg;
  if (lowerTitle.includes("elden ring")) return eldenRingImg;
  if (lowerTitle.includes("cyberpunk")) return cyberpunkImg;
  if (lowerTitle.includes("god of war") || lowerTitle.includes("gow"))
    return gowImg;
  if (lowerTitle.includes("baldur")) return baldurImg;
  if (lowerTitle.includes("coursera")) return courseraImg;
  if (lowerTitle.includes("duolingo")) return duolingoImg;
  if (lowerTitle.includes("github") || lowerTitle.includes("copilot"))
    return copilotImg;
  if (lowerTitle.includes("playstation") || lowerTitle.includes("ps plus"))
    return psPlusImg;
  if (lowerTitle.includes("adobe") || lowerTitle.includes("creative cloud"))
    return adobeImg;
  if (lowerTitle.includes("random")) return randomImg;

  // Default fallback images for random packages or unknown products
  return randomImg;
};
