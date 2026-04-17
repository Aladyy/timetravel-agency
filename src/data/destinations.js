const baseAssetPath = `${import.meta.env.BASE_URL}assets`

export const destinations = [
  {
    id: 'paris-1889',
    title: 'Paris 1889',
    era: 'Exposition universelle',
    description:
      "Assistez à l'inauguration de la Tour Eiffel, dînez sur les boulevards illuminés et rencontrez les artistes de la Belle Époque.",
    image: `${baseAssetPath}/paris-1889.png`,
    atmosphere: 'Élégance, art de vivre, innovation',
    riskLevel: 'Faible',
  },
  {
    id: 'cretace',
    title: 'Crétacé',
    era: "66 millions d'années avant notre ère",
    description:
      'Explorez une jungle préhistorique guidée par drone, observez les dinosaures en toute sécurité et vivez une aventure hors norme.',
    image: `${baseAssetPath}/cretace.png`,
    atmosphere: 'Aventure, adrénaline, nature brute',
    riskLevel: 'Moyen',
  },
  {
    id: 'florence-1504',
    title: 'Florence 1504',
    era: 'Renaissance italienne',
    description:
      "Participez aux salons des Médicis, contemplez le David de Michel-Ange à sa révélation et apprenez des maîtres de l'époque.",
    image: `${baseAssetPath}/florence-1504.png`,
    atmosphere: 'Culture, artisanat, raffinement',
    riskLevel: 'Faible',
  },
]
