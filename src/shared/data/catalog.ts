import heroBottles from "@/assets/hero-bottles.svg";
import bottleRed from "@/assets/bottle-red.svg";
import bottleWhite from "@/assets/bottle-white.svg";
import bottleChampagne from "@/assets/bottle-champagne.svg";
import spirits from "@/assets/spirits.svg";
import salmon from "@/assets/salmon.svg";
import charcuterie from "@/assets/charcuterie.svg";
import plateau from "@/assets/plateau.svg";
import type { Department, Product, Promotion } from "@/shared/types/product";
import { daysAgoIso } from "@/shared/lib/format";

export const IMAGES = {
  hero: heroBottles,
  bottleRed,
  bottleWhite,
  bottleChampagne,
  spirits,
  salmon,
  charcuterie,
  plateau,
} as const;

export function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function imageFor(department: Department, category: string): string {
  if (department === "vins") {
    if (category.toLowerCase().includes("champagne")) return bottleChampagne;
    if (category.toLowerCase().includes("blanc")) return bottleWhite;
    return bottleRed;
  }
  if (department === "spiritueux") return spirits;
  if (department === "saumon") return salmon;
  if (department === "charcuterie") return charcuterie;
  return plateau;
}

function makeProduct(p: Omit<Product, "slug" | "image" | "createdAt"> & { image?: string; createdDaysAgo?: number }): Product {
  const slug = slugify(`${p.brand}-${p.name}`);
  return {
    ...p,
    slug,
    image: p.image ?? imageFor(p.department, p.category),
    createdAt: daysAgoIso(p.createdDaysAgo ?? 0),
  } as Product;
}

export const PRODUCTS: Product[] = [
  // VINS — rouges
  makeProduct({ id: "T3-001", name: "Médoc Excellence", brand: "Château Bellevue", department: "vins", category: "Vin rouge", country: "France", region: "Bordeaux", grape: "Cabernet Sauvignon, Merlot", year: 2020, volume: "75cl", price: 189, compareAtPrice: 220, stock: 24, sku: "T3-001", description: "Un Bordeaux structuré aux tanins soyeux, idéal pour les grandes tablées. Notes de cassis et de graphite sur une finale boisée.", tasting: "Cassis, graphite, vanille.", serving: "16-18°C.", pairing: "Entrecôte grillée, fromage affiné.", isFeatured: true, isAlcohol: true, createdDaysAgo: 2 }),
  makeProduct({ id: "T3-002", name: "Napa Valley Cabernet", brand: "Silver Oak", department: "vins", category: "Vin rouge", country: "États-Unis", region: "Napa Valley", grape: "Cabernet Sauvignon", year: 2019, volume: "75cl", price: 420, stock: 8, sku: "T3-002", description: "Opulence californienne mêlant mûre, chocolat et chêne français. Une bouteille de collection.", tasting: "Mûre, chocolat noir, épices douces.", serving: "16-18°C.", pairing: "Gibier, bœuf braisé.", isPremium: true, isAlcohol: true, createdDaysAgo: 5 }),
  makeProduct({ id: "T3-003", name: "Châteauneuf Vieilles Vignes", brand: "Domaine du Vieux Télégraphe", department: "vins", category: "Vin rouge", country: "France", region: "Rhône", grape: "Grenache, Syrah, Mourvèdre", year: 2018, volume: "75cl", price: 310, stock: 12, sku: "T3-003", description: "Un sud puissant et velouté, avec des arômes de garrigue et de fruits confits.", tasting: "Garrigue, cerise noire, tabac.", serving: "16-18°C.", pairing: "Agneau rôti, daube.", isPremium: true, isAlcohol: true, createdDaysAgo: 8 }),
  makeProduct({ id: "T3-004", name: "Barolo Riserva", brand: "Pio Cesare", department: "vins", category: "Vin rouge", country: "Italie", region: "Piemont", grape: "Nebbiolo", year: 2017, volume: "75cl", price: 395, stock: 6, sku: "T3-004", description: "Élégance piémontaise avec des tanins raffinés et une longueur impressionnante.", tasting: "Rose séchée, tartré, cerise griotte.", serving: "17-18°C.", pairing: "Truffe, bœuf en croûte.", isPremium: true, isAlcohol: true, createdDaysAgo: 12 }),
  makeProduct({ id: "T3-005", name: "Rioja Gran Reserva", brand: "Marqués de Riscal", department: "vins", category: "Vin rouge", country: "Espagne", region: "Rioja", grape: "Tempranillo", year: 2015, volume: "75cl", price: 165, stock: 18, sku: "T3-005", description: "Classique espagnol aux notes de vanille, de cuir et de fruits mûrs.", tasting: "Cerise, vanille, cuir.", serving: "16-18°C.", pairing: "Jambon ibérique, chorizo grillé.", isAlcohol: true, createdDaysAgo: 15 }),
  makeProduct({ id: "T3-006", name: "Côtes du Rhône Villages", brand: "Famille Perrin", department: "vins", category: "Vin rouge", country: "France", region: "Rhône", grape: "Grenache, Syrah", year: 2021, volume: "75cl", price: 89, stock: 36, sku: "T3-006", description: "Un rouge gourmand et accessible, parfait pour les dîners entre amis.", tasting: "Fruits rouges, poivre, romarin.", serving: "16°C.", pairing: "Pizza, grillades.", isAlcohol: true, createdDaysAgo: 20 }),
  makeProduct({ id: "T3-007", name: "Margaux Prestige", brand: "Château d'Issan", department: "vins", category: "Grands crus", country: "France", region: "Bordeaux", grape: "Cabernet Sauvignon, Merlot", year: 2016, volume: "75cl", price: 890, compareAtPrice: 1100, stock: 4, sku: "T3-007", description: "Un 3ème cru classé d'une finesse rare, alliant bouquet floral et structure aristocratique.", tasting: "Violette, fruits noirs, épices.", serving: "16-18°C.", pairing: "Carré d'agneau, fromage de chèvre.", isPremium: true, isFeatured: true, isAlcohol: true, createdDaysAgo: 3 }),
  makeProduct({ id: "T3-008", name: "Yarden Cabernet Sauvignon", brand: "Golan Heights Winery", department: "vins", category: "Vin israélien", country: "Israël", region: "Golan", grape: "Cabernet Sauvignon", year: 2020, volume: "75cl", price: 145, stock: 30, sku: "T3-008", description: "Un cabernet israélien affirmé, aux fruits noirs et à la finale réglissée.", tasting: "Cassis, réglisse, chêne américain.", serving: "16-18°C.", pairing: "Hamburger gourmet, grillades.", isAlcohol: true, createdDaysAgo: 1 }),
  makeProduct({ id: "T3-009", name: "Castel Grand Vin", brand: "Domaine du Castel", department: "vins", category: "Vin israélien", country: "Israël", region: "Judea", grape: "Cabernet Franc, Merlot", year: 2021, volume: "75cl", price: 175, stock: 22, sku: "T3-009", description: "Bordeaux-style israélien, charnu et équilibré, devenu une référence locale.", tasting: "Prune, chocolat, épices.", serving: "16-18°C.", pairing: "Côtes de bœuf, cigare.", isAlcohol: true, createdDaysAgo: 4 }),
  makeProduct({ id: "T3-010", name: "Recanati Reserve Syrah", brand: "Recanati Winery", department: "vins", category: "Vin israélien", country: "Israël", region: "Galilée", grape: "Syrah", year: 2022, volume: "75cl", price: 115, stock: 28, sku: "T3-010", description: "Syrah méditerranéenne aux notes de mûre et de poivre blanc.", tasting: "Mûre, poivre blanc, violette.", serving: "15-17°C.", pairing: "Couscous royal, merguez.", isAlcohol: true, createdDaysAgo: 6 }),

  // VINS — blancs
  makeProduct({ id: "T3-011", name: "Puligny-Montrachet", brand: "Domaine Leflaive", department: "vins", category: "Vin blanc", country: "France", region: "Bourgogne", grape: "Chardonnay", year: 2020, volume: "75cl", price: 650, stock: 5, sku: "T3-011", description: "Un grand Bourgogne blanc d'une minéralité et d'une complexité exceptionnelles.", tasting: "Agrumes confits, beurre noisette, pierre à fusil.", serving: "12-14°C.", pairing: "Homard, Saint-Jacques.", isPremium: true, isAlcohol: true, createdDaysAgo: 7 }),
  makeProduct({ id: "T3-012", name: "Sancerre Les Monts Damnés", brand: "Henri Bourgeois", department: "vins", category: "Vin blanc", country: "France", region: "Loire", grape: "Sauvignon Blanc", year: 2022, volume: "75cl", price: 135, stock: 20, sku: "T3-012", description: "Sauvignon franc et minéral, sur un terroir argilo-calcaire emblématique.", tasting: "Pamplemousse, buis, coquillage.", serving: "10-12°C.", pairing: "Huîtres, tartare de bar.", isAlcohol: true, createdDaysAgo: 9 }),
  makeProduct({ id: "T3-013", name: "Yarden Chardonnay", brand: "Golan Heights Winery", department: "vins", category: "Vin israélien", country: "Israël", region: "Golan", grape: "Chardonnay", year: 2022, volume: "75cl", price: 125, stock: 26, sku: "T3-013", description: "Chardonnay israélien à la fois crémeux et frais, élevé en fût.", tasting: "Pêche, noisette, vanille.", serving: "11-13°C.", pairing: "Poulet rôti, risotto aux champignons.", isAlcohol: true, createdDaysAgo: 11 }),
  makeProduct({ id: "T3-014", name: "Soave Classico", brand: "Pieropan", department: "vins", category: "Vin italien", country: "Italie", region: "Vénétie", grape: "Garganega", year: 2022, volume: "75cl", price: 95, stock: 32, sku: "T3-014", description: "Blanc italien floral et amande, parfait pour l'apéritif.", tasting: "Amande, fleur blanche, citron.", serving: "10-12°C.", pairing: "Carpaccio, antipasti.", isAlcohol: true, createdDaysAgo: 14 }),
  makeProduct({ id: "T3-015", name: "Albariño Rías Baixas", brand: "Pazo de Señorans", department: "vins", category: "Vin espagnol", country: "Espagne", region: "Galice", grape: "Albariño", year: 2022, volume: "75cl", price: 110, stock: 25, sku: "T3-015", description: "Blanc atlantique vif et iodé, idéal avec les fruits de mer.", tasting: "Citron vert, coquillage, pomme verte.", serving: "8-10°C.", pairing: "Ceviche, poulpe à la galicienne.", isAlcohol: true, createdDaysAgo: 18 }),

  // VINS — rosés & bulles
  makeProduct({ id: "T3-016", name: "Provence Rosé", brand: "Domaines Ott", department: "vins", category: "Rosé", country: "France", region: "Provence", grape: "Grenache, Cinsault", year: 2023, volume: "75cl", price: 155, stock: 28, sku: "T3-016", description: "Rosé emblématique aux arômes de pêche blanche et de fleur de romarin.", tasting: "Pêche blanche, pamplemousse, romarin.", serving: "8-10°C.", pairing: "Salade niçoise, grilled chicken.", isAlcohol: true, createdDaysAgo: 10 }),
  makeProduct({ id: "T3-017", name: "Champagne Brut Imperial", brand: "Moët & Chandon", department: "vins", category: "Champagne", country: "France", region: "Champagne", grape: "Pinot Noir, Chardonnay, Pinot Meunier", year: 2015, volume: "75cl", price: 395, compareAtPrice: 450, stock: 15, sku: "T3-017", description: "Champagne iconique, bulles fines et palette d'agrumes et de brioche.", tasting: "Pomme verte, brioche, agrumes.", serving: "8-10°C.", pairing: "Caviar, huîtres, soufflé au fromage.", isFeatured: true, isAlcohol: true, createdDaysAgo: 2 }),
  makeProduct({ id: "T3-018", name: "Dom Pérignon Vintage", brand: "Moët & Chandon", department: "vins", category: "Champagne", country: "France", region: "Champagne", grape: "Chardonnay, Pinot Noir", year: 2013, volume: "75cl", price: 1890, stock: 3, sku: "T3-018", description: "Prestige et légende en bouteille. Une vertical d'exception pour les grands moments.", tasting: "Amande grillée, fruits blancs, miel.", serving: "9-11°C.", pairing: "Homard breton, foie gras.", isPremium: true, isAlcohol: true, createdDaysAgo: 5 }),
  makeProduct({ id: "T3-019", name: "Prosecco Superiore DOCG", brand: "Bisol", department: "vins", category: "Prosecco", country: "Italie", region: "Veneto", grape: "Glera", year: 2023, volume: "75cl", price: 115, stock: 40, sku: "T3-019", description: "Bulles italiennes légères et florales, parfaites pour le brunch ou l'apéritif.", tasting: "Poire, acacia, citron.", serving: "6-8°C.", pairing: "Fruits de mer, antipasti.", isAlcohol: true, createdDaysAgo: 13 }),
  makeProduct({ id: "T3-020", name: "Crémant d'Alsace", brand: "Domaine Weinbach", department: "vins", category: "Vin premium", country: "France", region: "Alsace", grape: "Pinot Blanc, Riesling", year: 2021, volume: "75cl", price: 145, stock: 22, sku: "T3-020", description: "Bulles alsaciennes aériennes, alternatives raffinées au champagne.", tasting: "Pomme, citron, amande.", serving: "7-9°C.", pairing: "Quiche, fromage de chèvre.", isAlcohol: true, createdDaysAgo: 16 }),

  // VINS — premium / grands crus supplémentaires
  makeProduct({ id: "T3-021", name: "Pauillac", brand: "Château Lynch-Bages", department: "vins", category: "Grands crus", country: "France", region: "Bordeaux", grape: "Cabernet Sauvignon, Merlot", year: 2015, volume: "75cl", price: 780, stock: 5, sku: "T3-021", description: "Puissance et élégance bordelaise avec une capacité de garde remarquable.", tasting: "Cassis, graphite, cèdre.", serving: "17°C.", pairing: "Côte de bœuf, canard.", isPremium: true, isAlcohol: true, createdDaysAgo: 21 }),
  makeProduct({ id: "T3-022", name: "Brunello di Montalcino", brand: "Biondi-Santi", department: "vins", category: "Vin premium", country: "Italie", region: "Toscane", grape: "Sangiovese", year: 2016, volume: "75cl", price: 520, stock: 6, sku: "T3-022", description: "Un classique toscan, terreux et aux tanins soyeux, idéal pour la cave.", tasting: "Cerise, cuir, tabac.", serving: "17°C.", pairing: "Bistecca alla fiorentina, pâtes au ragù.", isPremium: true, isAlcohol: true, createdDaysAgo: 24 }),
  makeProduct({ id: "T3-023", name: "Côte-Rôtie La Mouline", brand: "E. Guigal", department: "vins", category: "Grands crus", country: "France", region: "Rhône", grape: "Syrah, Viognier", year: 2017, volume: "75cl", price: 650, stock: 4, sku: "T3-023", description: "Légende du nord Rhône, puissance aromatique et soyeuse à la fois.", tasting: "Violette, fruits noirs, moka.", serving: "17°C.", pairing: "Gibier, agneau.", isPremium: true, isAlcohol: true, createdDaysAgo: 27 }),
  makeProduct({ id: "T3-024", name: "Chianti Classico Gran Selezione", brand: "Fontodi", department: "vins", category: "Vin italien", country: "Italie", region: "Toscane", grape: "Sangiovese", year: 2019, volume: "75cl", price: 210, stock: 12, sku: "T3-024", description: "Toscane dans toute sa splendeur : cerise, herbes et épices.", tasting: "Cerise, herbes, cuir.", serving: "16°C.", pairing: "Pizza napolitaine, côtelettes.", isAlcohol: true, createdDaysAgo: 30 }),
  makeProduct({ id: "T3-025", name: "Priorat", brand: "Álvaro Palacios", department: "vins", category: "Vin espagnol", country: "Espagne", region: "Priorat", grape: "Garnacha, Cariñena", year: 2018, volume: "75cl", price: 285, stock: 9, sku: "T3-025", description: "Vin méditerranéen concentré, aux arômes de fruits confits et de schiste.", tasting: "Grenade, schiste, romarin.", serving: "16-18°C.", pairing: "Gigot, fromage fort.", isAlcohol: true, createdDaysAgo: 33 }),

  // SPIRITUEUX
  makeProduct({ id: "T3-026", name: "Single Malt 18 ans", brand: "Glenfiddich", department: "spiritueux", category: "Whisky", country: "Écosse", region: "Speyside", volume: "70cl", price: 520, compareAtPrice: 590, stock: 7, sku: "T3-026", description: "Whisky écossais riche et fruité, 18 ans d'élevage en fûts de chêne.", tasting: "Pomme cuite, chêne, épices.", serving: "Pur ou avec un peu d'eau.", pairing: "Cigare, chocolat noir.", isPremium: true, isFeatured: true, isAlcohol: true, createdDaysAgo: 3 }),
  makeProduct({ id: "T3-027", name: "Highland Park 12 ans", brand: "Highland Park", department: "spiritueux", category: "Whisky", country: "Écosse", region: "Orcades", volume: "70cl", price: 285, stock: 14, sku: "T3-027", description: "Whisky des Orcades, légèrement tourbé et fruité, avec une note de bruyère.", tasting: "Miel, tourbe douce, fruits secs.", serving: "Pur.", pairing: "Saumon fumé, fromage.", isAlcohol: true, createdDaysAgo: 6 }),
  makeProduct({ id: "T3-028", name: "Macallan Sherry Oak 12", brand: "The Macallan", department: "spiritueux", category: "Whisky", country: "Écosse", region: "Speyside", volume: "70cl", price: 410, stock: 9, sku: "T3-028", description: "Speyside classique, plein de fruits secs, de sherry et d'épices.", tasting: "Raisin sec, orange, cannelle.", serving: "Pur.", pairing: "Foie gras, dessert au chocolat.", isPremium: true, isAlcohol: true, createdDaysAgo: 9 }),
  makeProduct({ id: "T3-029", name: "Vodka Beluga Noble", brand: "Beluga", department: "spiritueux", category: "Vodka", country: "Russie", volume: "70cl", price: 175, stock: 20, sku: "T3-029", description: "Vodka ultra premium, douce et cristalline, idéale en martini.", tasting: "Céréale, vanille, note iodée.", serving: "Glacée.", pairing: "Caviar, saumon fumé.", isAlcohol: true, createdDaysAgo: 12 }),
  makeProduct({ id: "T3-030", name: "Vodka Grey Goose", brand: "Grey Goose", department: "spiritueux", category: "Vodka", country: "France", region: "Cognac", volume: "70cl", price: 195, stock: 24, sku: "T3-030", description: "Vodka française de référence, souple et épurée.", tasting: "Amande, agrumes, poivre blanc.", serving: "Glacée ou en cocktail.", pairing: "Fruits de mer, fromage frais.", isAlcohol: true, createdDaysAgo: 15 }),
  makeProduct({ id: "T3-031", name: "Gin Monkey 47", brand: "Monkey 47", department: "spiritueux", category: "Gin", country: "Allemagne", region: "Forêt Noire", volume: "50cl", price: 245, stock: 11, sku: "T3-031", description: "Gin artisanal aux 47 botaniques, complexe et aromatique.", tasting: "Genévrier, agrumes, poivre.", serving: "Avec tonic premium.", pairing: "Saumon gravlax, fromage.", isAlcohol: true, createdDaysAgo: 18 }),
  makeProduct({ id: "T3-032", name: "Gin Hendrick's", brand: "Hendrick's", department: "spiritueux", category: "Gin", country: "Écosse", volume: "70cl", price: 165, stock: 18, sku: "T3-032", description: "Gin écossais original parfumé au concombre et à la rose.", tasting: "Concombre, rose, genévrier.", serving: "Avec tonic et concombre.", pairing: "Fruits de mer, apéritif.", isAlcohol: true, createdDaysAgo: 21 }),
  makeProduct({ id: "T3-033", name: "Arak Elite", brand: "Elite", department: "spiritueux", category: "Arak", country: "Israël", volume: "70cl", price: 115, stock: 30, sku: "T3-033", description: "Arak israélien anisé, traditionnel et rafraîchissant.", tasting: "Anis, réglisse, fleur d'oranger.", serving: "Avec de l'eau et des glaçons.", pairing: "Mezzé, grillades.", isAlcohol: true, createdDaysAgo: 24 }),
  makeProduct({ id: "T3-034", name: "Cointreau", brand: "Cointreau", department: "spiritueux", category: "Liqueur", country: "France", volume: "70cl", price: 135, stock: 22, sku: "T3-034", description: "Triple sec français aux arômes d'orange douce et amère.", tasting: "Orange, zeste, fleur d'oranger.", serving: "En cocktail ou digestif.", pairing: "Desserts aux agrumes.", isAlcohol: true, createdDaysAgo: 27 }),
  makeProduct({ id: "T3-035", name: "Cognac VSOP", brand: "Rémy Martin", department: "spiritueux", category: "Cognac", country: "France", region: "Cognac", volume: "70cl", price: 380, stock: 10, sku: "T3-035", description: "Cognac riche et fruité, parfait pour la fin de repas.", tasting: "Prune, vanille, chêne.", serving: "A température ambiante.", pairing: "Cigare, chocolat.", isPremium: true, isAlcohol: true, createdDaysAgo: 30 }),
  makeProduct({ id: "T3-036", name: "Hennessy XO", brand: "Hennessy", department: "spiritueux", category: "Cognac", country: "France", region: "Cognac", volume: "70cl", price: 950, stock: 5, sku: "T3-036", description: "Cognac d'exception, profond et cuiré, pour les grands moments.", tasting: "Chocolat, cuir, fruits confits.", serving: "Tulipe à température ambiante.", pairing: "Cigare, foie gras.", isPremium: true, isAlcohol: true, createdDaysAgo: 33 }),
  makeProduct({ id: "T3-037", name: "Aperol", brand: "Aperol", department: "spiritueux", category: "Liqueur", country: "Italie", volume: "70cl", price: 95, stock: 28, sku: "T3-037", description: "Apéritif italien iconique, amer et rafraîchissant.", tasting: "Orange, rhubarbe, herbes.", serving: "Spritz avec Prosecco.", pairing: "Olives, bruschettas.", isAlcohol: true, createdDaysAgo: 36 }),

  // SAUMONS SARFATI
  makeProduct({ id: "T3-038", name: "Saumon fumé tranché main", brand: "Sarfati", department: "saumon", category: "Fumé à froid", country: "Israël", weight: "200g", price: 89, stock: 40, sku: "T3-038", description: "Tranches fondantes de saumon fumé à froid, tranchées à la main au moment de la commande.", serving: "Servir frais.", pairing: "Blinis, crème fraîche, câpres.", isFeatured: true, isAlcohol: false, createdDaysAgo: 1 }),
  makeProduct({ id: "T3-039", name: "Pavé de saumon fumé", brand: "Sarfati", department: "saumon", category: "Pavé", country: "Israël", weight: "300g", price: 125, compareAtPrice: 145, stock: 25, sku: "T3-039", description: "Pavé entier pour les amateurs de découpe fine et de texture soyeuse.", serving: "À trancher en biais.", pairing: "Pain de seigle, beurre demi-sel.", isAlcohol: false, createdDaysAgo: 4 }),
  makeProduct({ id: "T3-040", name: "Gravlax de saumon", brand: "Sarfati", department: "saumon", category: "Gravlax", country: "Israël", weight: "200g", price: 99, stock: 20, sku: "T3-040", description: "Saumon mariné à la scandinave, aneth et sucre léger.", serving: "Très frais, en fines tranches.", pairing: "Sauce moutarde-miel, pommes de terre.", isAlcohol: false, createdDaysAgo: 7 }),
  makeProduct({ id: "T3-041", name: "Coffret Découverte Sarfati", brand: "Sarfati", department: "saumon", category: "Coffret", country: "Israël", weight: "600g", price: 245, stock: 12, sku: "T3-041", description: "Assortiment fumé à froid, gravlax et pavé, prêt à offrir.", serving: "Sur un plateau frais.", pairing: "Champagne, blanc sec.", isPremium: true, isAlcohol: false, createdDaysAgo: 10 }),
  makeProduct({ id: "T3-042", name: "Saumon fumé en tranches épaisses", brand: "Sarfati", department: "saumon", category: "Fumé à froid", country: "Israël", weight: "500g", price: 195, stock: 18, sku: "T3-042", description: "Format familial pour les réceptions ou les fins de repas gourmandes.", serving: "Au réfrigérateur, servi frais.", pairing: "Blanc de Bourgogne, toasts.", isAlcohol: false, createdDaysAgo: 13 }),
  makeProduct({ id: "T3-043", name: "Mini pavés de saumon gravlax", brand: "Sarfati", department: "saumon", category: "Gravlax", country: "Israël", weight: "150g", price: 75, stock: 30, sku: "T3-043", description: "Petits pavés parfumés à l'aneth, idéaux pour un apéritif chic.", serving: "Frais, coupé en cubes.", pairing: "Vodka glacée, pain norvégien.", isAlcohol: false, createdDaysAgo: 16 }),
  makeProduct({ id: "T3-044", name: "Coffret Prestige Saumon & Caviar", brand: "Sarfati", department: "saumon", category: "Coffret", country: "Israël", weight: "250g saumon + 30g caviar", price: 590, stock: 6, sku: "T3-044", description: "Association luxueuse pour les grandes occasions.", serving: "Sur glace.", pairing: "Champagne millésimé, blinis.", isPremium: true, isAlcohol: false, createdDaysAgo: 19 }),

  // CHARCUTERIE
  makeProduct({ id: "T3-045", name: "Rosette de Lyon", brand: "Sibilia", department: "charcuterie", category: "Rosette", country: "France", region: "Rhône", weight: "250g", price: 95, stock: 30, sku: "T3-045", description: "Saucisson sec lyonnais, généreux en goût et à la texture ferme.", serving: "Trancher finement.", pairing: "Vin rouge du Rhône, cornichons.", isAlcohol: false, createdDaysAgo: 2 }),
  makeProduct({ id: "T3-046", name: "Saucisson sec au pistou", brand: "Maison Guyard", department: "charcuterie", category: "Saucisson", country: "France", region: "Ardèche", weight: "200g", price: 89, stock: 25, sku: "T3-046", description: "Saucisson parfumé au basilic et à l'ail, typique du sud-est.", serving: "Trancher en biais.", pairing: "Rosé de Provence, olives.", isAlcohol: false, createdDaysAgo: 5 }),
  makeProduct({ id: "T3-047", name: "Jambon sec de Bayonne", brand: "Maison Duochrome", department: "charcuterie", category: "Jambon sec", country: "France", region: "Pays basque", weight: "150g", price: 115, stock: 22, sku: "T3-047", description: "Jambon fondant et légèrement salé, affiné 12 moès.", serving: "Température ambiante.", pairing: "Irouléguy, pain paysan.", isAlcohol: false, createdDaysAgo: 8 }),
  makeProduct({ id: "T3-048", name: "Chorizo ibérique", brand: "Joselito", department: "charcuterie", category: "Chorizo", country: "Espagne", region: "Salamanca", weight: "200g", price: 135, stock: 18, sku: "T3-048", description: "Chorizo au pimentón d'exception, gras et parfumé.", serving: "Trancher fin.", pairing: "Rioja, manchego.", isPremium: true, isAlcohol: false, createdDaysAgo: 11 }),
  makeProduct({ id: "T3-049", name: "Coppa de Corse", brand: "Pierre Matra", department: "charcuterie", category: "Coppa", country: "France", region: "Corse", weight: "150g", price: 105, stock: 20, sku: "T3-049", description: "Charcuterie corse charnue et parfumée aux herbes du maquis.", serving: "En tranches fines.", pairing: "Vin rouge corse, figues.", isAlcohol: false, createdDaysAgo: 14 }),
  makeProduct({ id: "T3-050", name: "Terrine de campagne", brand: "Maison Vantore", department: "charcuterie", category: "Terrine", country: "France", region: "Sarthe", weight: "180g", price: 75, stock: 24, sku: "T3-050", description: "Terrine rustique aux morceaux de foie gras et épices douces.", serving: "Frais avec du pain grillé.", pairing: "Vin blanc sec, cornichons.", isAlcohol: false, createdDaysAgo: 17 }),
  makeProduct({ id: "T3-051", name: "Saucisson sec aux noisettes", brand: "Sibilia", department: "charcuterie", category: "Saucisson", country: "France", region: "Rhône", weight: "220g", price: 99, stock: 28, sku: "T3-051", description: "Alliance croquante du porc et de la noisette torréfiée.", serving: "En apéritif.", pairing: "Beaujolais, fruits secs.", isAlcohol: false, createdDaysAgo: 20 }),
  makeProduct({ id: "T3-052", name: "Jambon de Parme 24 mois", brand: "Ruliano", department: "charcuterie", category: "Jambon sec", country: "Italie", region: "Parme", weight: "150g", price: 125, stock: 16, sku: "T3-052", description: "Jambon italien doux et fondant, affiné 24 mois sur os.", serving: "Température ambiante.", pairing: "Prosecco, mozzarella.", isPremium: true, isAlcohol: false, createdDaysAgo: 23 }),
  makeProduct({ id: "T3-053", name: "Rillettes de canard", brand: "Maison Godard", department: "charcuterie", category: "Terrine", country: "France", region: "Périgord", weight: "180g", price: 85, stock: 20, sku: "T3-053", description: "Rillettes onctueuses au canard gras, parfaites pour un apéritif gourmand.", serving: "Frais sur pain toasté.", pairing: "Bordeaux blanc, cornichons.", isAlcohol: false, createdDaysAgo: 26 }),
  makeProduct({ id: "T3-054", name: "Rosette de Bourgogne", brand: "Morteau", department: "charcuterie", category: "Rosette", country: "France", region: "Bourgogne", weight: "250g", price: 92, stock: 26, sku: "T3-054", description: "Saucisson sec bourguignon, goût franc et couleur rubis.", serving: "Trancher finement.", pairing: "Bourgogne rouge, moutarde.", isAlcohol: false, createdDaysAgo: 29 }),

  // PLATEAUX
  makeProduct({ id: "T3-055", name: "Plateau Apéritif", brand: "Terminal 3", department: "plateaux", category: "Apéritif", country: "France / Israël", weight: "800g", price: 245, stock: 10, sku: "T3-055", description: "Assortiment de charcuteries fines, saumon fumé, olives et fromages.", serving: "Pour 3-4 personnes.", pairing: "Champagne, vin blanc.", isAlcohol: false, createdDaysAgo: 1 }),
  makeProduct({ id: "T3-056", name: "Plateau Mixte Prestige", brand: "Terminal 3", department: "plateaux", category: "Mixte", country: "France / Israël", weight: "1.2kg", price: 390, stock: 8, sku: "T3-056", description: "Saumon, charcuteries, terrines et accompanements pour un apéritif royal.", serving: "Pour 5-6 personnes.", pairing: "Champagne rosé, whisky.", isPremium: true, isAlcohol: false, createdDaysAgo: 3 }),
  makeProduct({ id: "T3-057", name: "Plateau Prestige Caviar & Champagne", brand: "Terminal 3", department: "plateaux", category: "Prestige", country: "France / Israël", weight: "500g", price: 890, stock: 4, sku: "T3-057", description: "Caviar, saumon fumé, blinis et crème fraîche, accompagné d'une bouteille de champagne.", serving: "Sur commande 24h.", pairing: "Champagne brut.", isPremium: true, isAlcohol: false, createdDaysAgo: 5 }),
  makeProduct({ id: "T3-058", name: "Plateau Dégustation Vins & Fromages", brand: "Terminal 3", department: "plateaux", category: "Dégustation", country: "France / Israël", weight: "900g", price: 295, stock: 6, sku: "T3-058", description: "Sélection de fromages affinés, fruits secs, miel et charcuteries fines.", serving: "Pour 4 personnes.", pairing: "Rouge de Bordeaux, blanc de Bourgogne.", isAlcohol: false, createdDaysAgo: 7 }),
  makeProduct({ id: "T3-059", name: "Coffret Gourmet Saumon & Charcuterie", brand: "Terminal 3", department: "plateaux", category: "Mixte", country: "France / Israël", weight: "700g", price: 325, stock: 9, sku: "T3-059", description: "Coffret cadeau réunissant le meilleur du saumon Sarfati et de la charcuterie française.", serving: "Prêt à offrir.", pairing: "Champagne, vin rouge.", isAlcohol: false, createdDaysAgo: 10 }),
  makeProduct({ id: "T3-060", name: "Plateau Sur Mesure", brand: "Terminal 3", department: "plateaux", category: "Prestige", country: "France / Israël", weight: "Sur devis", price: 450, stock: 99, sku: "T3-060", description: "Composez votre plateau avec notre équipe : saumon, charcuteries, fromages et accompaniments.", serving: "Sur commande.", pairing: "Selon votre sélection.", isPremium: true, isAlcohol: false, createdDaysAgo: 12 }),
].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const byDepartment = (department: Department) => PRODUCTS.filter((p) => p.department === department);
export const NEWEST = [...PRODUCTS];
export const PREMIUM = PRODUCTS.filter((p) => p.isPremium);
export const FEATURED = PRODUCTS.filter((p) => p.isFeatured);

export const PROMOTIONS: Promotion[] = [
  {
    id: "PROMO-1",
    name: "Lancement nouveautés",
    subtitle: "-15 % sur les arrivées de la semaine",
    type: "percent",
    value: 15,
    productSlugs: PRODUCTS.filter((p) => p.createdDaysAgo && p.createdDaysAgo <= 7).map((p) => p.slug),
    startsAt: daysAgoIso(7),
    endsAt: daysAgoIso(-14),
    active: true,
  },
  {
    id: "PROMO-2",
    name: "Foire aux Bordeaux",
    subtitle: "-20 % sur les vins rouges de Bordeaux",
    type: "percent",
    value: 20,
    category: "Vin rouge",
    startsAt: daysAgoIso(14),
    endsAt: daysAgoIso(-14),
    active: true,
  },
  {
    id: "PROMO-3",
    name: "Pack Champagne",
    subtitle: "2 bouteilles à 700 ₪",
    type: "x_for_y",
    value: 700,
    quantity: 2,
    category: "Champagne",
    startsAt: daysAgoIso(3),
    endsAt: daysAgoIso(-10),
    active: true,
  },
  {
    id: "PROMO-4",
    name: "Apéritif Sarfati",
    subtitle: "-30 ₪ dès 200 ₪ d'achat",
    type: "fixed",
    value: 30,
    department: "saumon",
    startsAt: daysAgoIso(5),
    endsAt: daysAgoIso(-7),
    active: true,
  },
  {
    id: "PROMO-5",
    name: "Coffrets Prestige",
    subtitle: "Prix spécial sélection coffrets",
    type: "special_price",
    value: 199,
    productSlugs: ["sarfati-coffret-decouverte-sarfati", "terminal-3-coffret-gourmet-saumon-charcuterie"],
    startsAt: daysAgoIso(2),
    endsAt: daysAgoIso(-5),
    active: true,
  },
];

export const ACTIVE_PROMOTIONS = PROMOTIONS.filter(
  (p) =>
    p.active &&
    new Date(p.startsAt).getTime() <= Date.now() &&
    new Date(p.endsAt).getTime() >= Date.now() &&
    !p.membersOnly
);
