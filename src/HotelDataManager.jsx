import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Plus, Trash2, Download, Save, MapPin, Building, Car, Eye, Utensils, Star, Edit3, CheckCircle, Search, Filter, BarChart3, Hotel } from 'lucide-react';
import hotelsData from './Hotels.json';

const GestionnaireHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [hotelaFiltres, setHotelsFilltres] = useState([]);
  const [hotelSelectionne, setHotelSelectionne] = useState('');
  const [donneesActuelles, setDonneesActuelles] = useState({});
  const [champsPersonnalises, setChampsPersonnalises] = useState([]);
  const [nomNouveauChamp, setNomNouveauChamp] = useState('');
  const [afficherSaisieChampPersonnalise, setAfficherSaisieChampPersonnalise] = useState(false);
  const [messageSauvegarde, setMessageSauvegarde] = useState('');
  const [termeRecherche, setTermeRecherche] = useState('');
  const [afficherSeulementManquants, setAfficherSeulementManquants] = useState(true);
  const [champEnCoursEdition, setChampEnCoursEdition] = useState('');
  const [filtreEtoilesSelectionne, setFiltreEtoilesSelectionne] = useState('');

  // Catégories de champs avec style inspiré du logo
  const categoriesChamps = {
    'Distance et Localisation': {
      icon: <MapPin className="w-5 h-5" />,
      color: 'from-amber-500 to-yellow-600',
      fields: [
        'Distance au haram/Mesjed al Nabaoui (m)',
        'Distance aéroport (m)',
        'Distance mina/Rawdah Charifa (m)',
        'Distance gare de train (mètre)',
        'Distance gare de train (minutes)',
        'Distance mosquée le plus proche (m)',
        'Distance Abraj Al Bait (m)',
        'Distance Train - Al Haramain Train Station Madinah (mètres et Km)'
      ]
    },
    'Transport': {
      icon: <Car className="w-5 h-5" />,
      color: 'from-gray-700 to-gray-800',
      fields: [
        'Navette gratuite',
        'Navette 24h/24',
        'Navette payante',
        'Navette pendant les heures de prière',
        'Parking',
        'Parking payant',
        'Parking gratuit',
        'Parking accessible pendant les heures de prière',
        'Disponibilité d\'un parking pour le van et bus'
      ]
    },
    'Vues et Hébergement': {
      icon: <Eye className="w-5 h-5" />,
      color: 'from-amber-600 to-yellow-700',
      fields: [
        'Vue Kaaba disponible',
        'Vue partielle Kaaba',
        'Vue standard Kaaba',
        'Vue panoramique Kaaba',
        'Vue Haram',
        'Hôtel accessible à pied'
      ]
    },
    'Services à Proximité': {
      icon: <Building className="w-5 h-5" />,
      color: 'from-gray-600 to-gray-700',
      fields: [
        'Hôpital le plus proche',
        'Pharmacie la plus proche',
        'Centre commercial (mall) le plus proche',
        'Portes les plus proches du Haram(nom / distance)',
        'Mosquées à proximité(nom / distance)',
        'Salon de coiffure à 200 m'
      ]
    },
    'Restauration': {
      icon: <Utensils className="w-5 h-5" />,
      color: 'from-yellow-600 to-amber-700',
      fields: [
        'Restaurant (Nom / Type de cuisine)',
        'Restaurants et cafés(nom / distance)',
        'Souhour et Iftar inclus'
      ]
    },
    'Équipements de l\'Hôtel': {
      icon: <Star className="w-5 h-5" />,
      color: 'from-amber-500 to-yellow-500',
      fields: [
        'SPA',
        'Saunas',
        'Hammams',
        'Centre de fitness',
        'Piscine',
        'Fauteuil de massage',
        'Massage des pieds disponible',
        'Salon de coiffure/institut de beauté',
        'Centre d\'affaire',
        'Garderie d\'enfants disponible dans l\'hôtel'
      ]
    }
  };

  // Initialiser les hôtels depuis le fichier JSON
  useEffect(() => {
    setHotels(hotelsData.makkahHotels);
    setHotelsFilltres(hotelsData.makkahHotels);
    
    // Charger les champs personnalisés depuis la mémoire
    const champsPersonnalisesSauvegardes = JSON.parse(sessionStorage.getItem('champsPersonnalises') || '[]');
    setChampsPersonnalises(champsPersonnalisesSauvegardes);
  }, []);

  // Gérer la recherche et la fonctionnalité de filtrage
  useEffect(() => {
    let filtres = hotels;
    
    // Appliquer le filtre de recherche
    if (termeRecherche.trim() !== '') {
      filtres = filtres.filter(hotel => 
        hotel.name.toLowerCase().includes(termeRecherche.toLowerCase()) ||
        hotel.category.toLowerCase().includes(termeRecherche.toLowerCase()) ||
        hotel.district.toLowerCase().includes(termeRecherche.toLowerCase())
      );
    }
    
    // Appliquer le filtre d'étoiles
    if (filtreEtoilesSelectionne !== '') {
      filtres = filtres.filter(hotel => 
        hotel.category.toLowerCase().includes(filtreEtoilesSelectionne.toLowerCase())
      );
    }
    
    setHotelsFilltres(filtres);
  }, [termeRecherche, filtreEtoilesSelectionne, hotels]);

  // Sauvegarder les champs personnalisés en mémoire
  useEffect(() => {
    sessionStorage.setItem('champsPersonnalises', JSON.stringify(champsPersonnalises));
  }, [champsPersonnalises]);

  // Charger les données de l'hôtel quand sélectionné
  const gererSelectionHotel = (hotelId) => {
    setHotelSelectionne(hotelId);
    const donneesSauvegardees = JSON.parse(sessionStorage.getItem(`hotel_${hotelId}`) || '{}');
    setDonneesActuelles(donneesSauvegardees);
  };

  // Gérer les changements de champs avec gestion d'état appropriée
  const gererChangementChamp = (champ, valeur) => {
    setDonneesActuelles(prev => {
      const nouvellesDonnees = {
        ...prev,
        [champ]: valeur
      };
      // Sauvegarder immédiatement dans sessionStorage pour éviter la perte de données
      if (hotelSelectionne) {
        sessionStorage.setItem(`hotel_${hotelSelectionne}`, JSON.stringify(nouvellesDonnees));
      }
      return nouvellesDonnees;
    });
  };

  // Ajouter un champ personnalisé avec gestion d'état appropriée
  const ajouterChampPersonnalise = () => {
    if (nomNouveauChamp.trim() && !champsPersonnalises.includes(nomNouveauChamp.trim())) {
      const nouveauChamp = nomNouveauChamp.trim();
      //ok
      setChampsPersonnalises(prev => {
        const miseAJour = [...prev, nouveauChamp];
        sessionStorage.setItem('champsPersonnalises', JSON.stringify(miseAJour));
        return miseAJour;
      });
      setNomNouveauChamp('');
      setAfficherSaisieChampPersonnalise(false);
    }
  };

  // Supprimer un champ personnalisé
  const supprimerChampPersonnalise = (champASupprimer) => {
    setChampsPersonnalises(prev => {
      const miseAJour = prev.filter(champ => champ !== champASupprimer);
      sessionStorage.setItem('champsPersonnalises', JSON.stringify(miseAJour));
      return miseAJour;
    });
    
    // Supprimer les données du champ de tous les hôtels
    hotels.forEach(hotel => {
      const donneesHotel = JSON.parse(sessionStorage.getItem(`hotel_${hotel.id}`) || '{}');
      if (donneesHotel[champASupprimer]) {
        delete donneesHotel[champASupprimer];
        sessionStorage.setItem(`hotel_${hotel.id}`, JSON.stringify(donneesHotel));
      }
    });
    
    // Mettre à jour les données actuelles si cet hôtel a ce champ
    if (donneesActuelles[champASupprimer]) {
      setDonneesActuelles(prev => {
        const miseAJour = { ...prev };
        delete miseAJour[champASupprimer];
        if (hotelSelectionne) {
          sessionStorage.setItem(`hotel_${hotelSelectionne}`, JSON.stringify(miseAJour));
        }
        return miseAJour;
      });
    }
  };

  // Fonction de sauvegarde des données
  const sauvegarderDonnees = () => {
    if (hotelSelectionne) {
      sessionStorage.setItem(`hotel_${hotelSelectionne}`, JSON.stringify(donneesActuelles));
      setMessageSauvegarde('✅ Données sauvegardées avec succès !');
      setTimeout(() => setMessageSauvegarde(''), 3000);
    }
  };

  // Exporter les données d'un seul hôtel
  const exporterVersExcel = () => {
    if (!hotelSelectionne) {
      alert('Veuillez d\'abord sélectionner un hôtel !');
      return;
    }

    const donneesHotelSelectionne = hotels.find(h => h.id === hotelSelectionne);
    const tousLesChamps = [
      ...Object.values(categoriesChamps).flatMap(cat => cat.fields),
      ...champsPersonnalises
    ];

    const donneesExportation = tousLesChamps.map(champ => ({
      'Champ': champ,
      'Valeur': donneesActuelles[champ] || ''
    }));

    donneesExportation.unshift({
      'Champ': 'Nom de l\'Hôtel',
      'Valeur': donneesHotelSelectionne?.name || ''
    });

    donneesExportation.unshift({
      'Champ': 'Catégorie de l\'Hôtel',
      'Valeur': donneesHotelSelectionne?.category || ''
    });

    donneesExportation.unshift({
      'Champ': 'Quartier de l\'Hôtel',
      'Valeur': donneesHotelSelectionne?.district || ''
    });

    const ws = XLSX.utils.json_to_sheet(donneesExportation);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Données Hôtel');
    XLSX.writeFile(wb, `${donneesHotelSelectionne?.name.replace(/[^a-zA-Z0-9]/g, '_')}_donnees.xlsx`);
  };

  // Exporter toutes les données des hôtels
  const exporterTousLesHotels = () => {
    const tousLesChamps = [
      ...Object.values(categoriesChamps).flatMap(cat => cat.fields),
      ...champsPersonnalises
    ];

    const donneesExportation = [];
    
    hotels.forEach(hotel => {
      const donneesHotel = JSON.parse(sessionStorage.getItem(`hotel_${hotel.id}`) || '{}');
      
      donneesExportation.push({
        'Hôtel': hotel.name,
        'Champ': 'Nom de l\'Hôtel',
        'Valeur': hotel.name
      });
      
      donneesExportation.push({
        'Hôtel': hotel.name,
        'Champ': 'Catégorie de l\'Hôtel',
        'Valeur': hotel.category
      });

      donneesExportation.push({
        'Hôtel': hotel.name,
        'Champ': 'Quartier de l\'Hôtel',
        'Valeur': hotel.district
      });
      
      tousLesChamps.forEach(champ => {
        donneesExportation.push({
          'Hôtel': hotel.name,
          'Champ': champ,
          'Valeur': donneesHotel[champ] || ''
        });
      });
      
      donneesExportation.push({ 'Hôtel': '', 'Champ': '', 'Valeur': '' });
    });

    const ws = XLSX.utils.json_to_sheet(donneesExportation);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Données Tous Hôtels');
    XLSX.writeFile(wb, 'Donnees_Completes_Tous_Hotels.xlsx');
  };

  // Fonctions d'aide
  const obtenirChampsVides = () => {
    const tousLesChamps = [
      ...Object.values(categoriesChamps).flatMap(cat => cat.fields),
      ...champsPersonnalises
    ];
    return tousLesChamps.filter(champ => !donneesActuelles[champ]?.trim());
  };

  const obtenirChampsRemplis = () => {
    const tousLesChamps = [
      ...Object.values(categoriesChamps).flatMap(cat => cat.fields),
      ...champsPersonnalises
    ];
    return tousLesChamps.filter(champ => donneesActuelles[champ]?.trim());
  };

  const obtenirPourcentageCompletion = () => {
    const tousLesChamps = [
      ...Object.values(categoriesChamps).flatMap(cat => cat.fields),
      ...champsPersonnalises
    ];
    const champsRemplis = tousLesChamps.filter(champ => donneesActuelles[champ]?.trim()).length;
    return tousLesChamps.length > 0 ? Math.round((champsRemplis / tousLesChamps.length) * 100) : 0;
  };

  const obtenirChampsAAfficher = (champsCategorie) => {
    if (afficherSeulementManquants) {
      return champsCategorie.filter(champ => {
        const estVide = !donneesActuelles[champ]?.trim();
        const estEnCoursEdition = champEnCoursEdition === champ;
        return estVide || estEnCoursEdition;
      });
    }
    return champsCategorie;
  };

  const donneesHotelSelectionne = hotels.find(h => h.id === hotelSelectionne);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* En-tête */}
       <div className="text-center mb-8 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 rounded-3xl p-8 shadow-2xl">
  <div className="flex items-center justify-center gap-4 mb-4">
    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
      <img
        src="/OmraBooking.jpg" 
        alt="Logo Omra Booking"
        className="w-12 h-12 object-contain"
      />
    </div>
    <h1 className="text-5xl font-bold text-gray-800">
      Oomra Booking
    </h1>
  </div>
  <p className="text-gray-800 text-xl font-semibold">Système de Gestion des Données d'Hôtels</p>
  <p className="text-gray-700 text-lg">Gérant {hotels.length}+ Hôtels à La Mecque</p>
</div>

        {/* Sélection d'Hôtel */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-xl border-2 border-yellow-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-gray-800 text-sm font-semibold mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Rechercher et Sélectionner un Hôtel ({hotelaFiltres.length} sur {hotels.length} Hôtels)
              </label>
              
              {/* Champ de Recherche */}
              <input
                type="text"
                placeholder="Rechercher les hôtels par nom, catégorie ou quartier..."
                value={termeRecherche}
                onChange={(e) => setTermeRecherche(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-50 border-2 border-yellow-400 text-gray-800 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-yellow-200 transition-all mb-4"
              />
              
              {/* Boutons de Filtre d'Étoiles */}
             {/* Boutons de Filtre d'Étoiles - SECTION MISE À JOUR */}
             <div className="flex flex-wrap gap-2 mb-4">
  <button
    onClick={() => setFiltreEtoilesSelectionne('')}
    className={`px-4 py-2 rounded-lg font-medium transition-all ${
      filtreEtoilesSelectionne === '' 
        ? 'bg-yellow-500 text-white shadow-lg hover:bg-yellow-600' 
        : 'bg-gray-200 text-gray-700 hover:bg-yellow-300 hover:text-gray-800'
    }`}
  >
    Toutes Étoiles
  </button>
  <button
    onClick={() => setFiltreEtoilesSelectionne('5-Star')}
    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
      filtreEtoilesSelectionne === '5-Star' 
        ? 'bg-yellow-500 text-white shadow-lg hover:bg-yellow-600' 
        : 'bg-gray-200 text-gray-700 hover:bg-yellow-300 hover:text-gray-800'
    }`}
  >
    <Star className="w-4 h-4" />
    5 Étoiles
  </button>
  <button
    onClick={() => setFiltreEtoilesSelectionne('4-Star')}
    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
      filtreEtoilesSelectionne === '4-Star' 
        ? 'bg-yellow-500 text-white shadow-lg hover:bg-yellow-600' 
        : 'bg-gray-200 text-gray-700 hover:bg-yellow-300 hover:text-gray-800'
    }`}
  >
    <Star className="w-4 h-4" />
    4 Étoiles
  </button>
  <button
    onClick={() => setFiltreEtoilesSelectionne('3-Star')}
    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
      filtreEtoilesSelectionne === '3-Star' 
        ? 'bg-yellow-500 text-white shadow-lg hover:bg-yellow-600' 
        : 'bg-gray-200 text-gray-700 hover:bg-yellow-300 hover:text-gray-800'
    }`}
  >
    <Star className="w-4 h-4" />
    3 Étoiles
  </button>
  <button
    onClick={() => setFiltreEtoilesSelectionne('2-Star')}
    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
      filtreEtoilesSelectionne === '2-Star' 
        ? 'bg-yellow-500 text-white shadow-lg hover:bg-yellow-600' 
        : 'bg-gray-200 text-gray-700 hover:bg-yellow-300 hover:text-gray-800'
    }`}
  >
    <Star className="w-4 h-4" />
    2 Étoiles
  </button>
  <button
    onClick={() => setFiltreEtoilesSelectionne('1-Star')}
    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
      filtreEtoilesSelectionne === '1-Star' 
        ? 'bg-yellow-500 text-white shadow-lg hover:bg-yellow-600' 
        : 'bg-gray-200 text-gray-700 hover:bg-yellow-300 hover:text-gray-800'
    }`}
  >
    <Star className="w-4 h-4" />
    1 Étoile
  </button>
  <button
    onClick={() => setFiltreEtoilesSelectionne('0-Star')}
    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
      filtreEtoilesSelectionne === '0-Star' 
        ? 'bg-yellow-500 text-white shadow-lg hover:bg-yellow-600' 
        : 'bg-gray-200 text-gray-700 hover:bg-yellow-300 hover:text-gray-800'
    }`}
  >
    <Star className="w-4 h-4" />
    0 Étoile
  </button>
</div>
              {/* Menu Déroulant des Hôtels */}
              <select
                value={hotelSelectionne}
                onChange={(e) => gererSelectionHotel(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-50 border-2 border-yellow-400 text-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-yellow-200 transition-all"
              >
                <option value="">Sélectionner un hôtel...</option>
                {hotelaFiltres.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name} ({hotel.category}) - {hotel.district}
                  </option>
                ))}
              </select>
              
              {hotelaFiltres.length === 0 && (termeRecherche || filtreEtoilesSelectionne) && (
                <p className="text-gray-600 text-sm mt-2">Aucun hôtel trouvé correspondant à vos critères.</p>
              )}
            </div>
            
            {hotelSelectionne && (
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border-2 border-yellow-300">
                <h3 className="text-gray-800 font-bold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  État de Completion
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-300 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-amber-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${obtenirPourcentageCompletion()}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-800 font-bold">{obtenirPourcentageCompletion()}%</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    <div>✅ Remplis : {obtenirChampsRemplis().length} champs</div>
                    <div>❌ Manquants : {obtenirChampsVides().length} champs</div>
                  </div>
                  {donneesHotelSelectionne && (
                    <div className="text-sm text-gray-700 border-t border-gray-300 pt-2">
                      <div><strong>Hôtel :</strong> {donneesHotelSelectionne.name}</div>
                      <div><strong>Catégorie :</strong> {donneesHotelSelectionne.category}</div>
                      <div><strong>Quartier :</strong> {donneesHotelSelectionne.district}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {hotelSelectionne && (
          <>
            {/* Contrôles */}
            <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={sauvegarderDonnees}
                  className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  Sauvegarder
                </button>
                <button
                  onClick={exporterVersExcel}
                  className="bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Exporter Hôtel
                </button>
                <button
                  onClick={exporterTousLesHotels}
                  className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Exporter Tous les Hôtels
                </button>
              </div>
              
              <div className="flex items-center gap-3 bg-white/90 rounded-xl p-3 border-2 border-yellow-300">
                <Filter className="w-5 h-5 text-gray-600" />
                <label className="flex items-center gap-2 text-gray-800 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={afficherSeulementManquants}
                    onChange={(e) => setAfficherSeulementManquants(e.target.checked)}
                    className="w-4 h-4 text-yellow-500 rounded"
                  />
                  Afficher seulement les champs manquants
                </label>
              </div>
            </div>

            {messageSauvegarde && (
              <div className="bg-green-100 border-2 border-green-400 text-green-800 px-6 py-4 rounded-xl mb-6 font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {messageSauvegarde}
              </div>
            )}

           {/* Champs de Saisie de Données */}
            <div className="space-y-6">
              {Object.entries(categoriesChamps).map(([nomCategorie, donneesCategorie]) => {
                const champsAAfficher = obtenirChampsAAfficher(donneesCategorie.fields);
                
                if (champsAAfficher.length === 0 && afficherSeulementManquants) {
                  return (
                    <div key={nomCategorie} className="bg-green-50 backdrop-blur-lg rounded-2xl p-6 border-2 border-green-400">
                      <div className={`bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl mb-4`}>
                        <h3 className="text-white text-xl font-bold flex items-center gap-3">
                          <CheckCircle className="w-6 h-6" />
                          {nomCategorie} - Tous Complets ✅
                        </h3>
                      </div>
                      <p className="text-green-700 font-semibold text-center py-4">
                        Tous les champs de cette catégorie ont été complétés !
                      </p>
                    </div>
                  );
                }
                
                return (
                  <div key={nomCategorie} className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 border-yellow-300">
                    <div className={`bg-gradient-to-r ${donneesCategorie.color} p-4 rounded-xl mb-6`}>
                      <h3 className="text-white text-xl font-bold flex items-center gap-3">
                        {donneesCategorie.icon}
                        {nomCategorie}
                        {afficherSeulementManquants && champsAAfficher.length > 0 && (
                          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                            {champsAAfficher.length} manquants
                          </span>
                        )}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {champsAAfficher.map((champ) => (
                        <div key={champ} className="space-y-2">
                          <label className="block text-gray-800 text-sm font-semibold">
                            {champ}
                            {!donneesActuelles[champ]?.trim() && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <input
                            type="text"
                            value={donneesActuelles[champ] || ''}
                            onChange={(e) => gererChangementChamp(champ, e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-50 border-2 border-yellow-400 text-gray-800 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                            placeholder={`Saisir ${champ.toLowerCase()}...`}
                            data-field={champ}
                            onFocus={() => setChampEnCoursEdition(champ)}
                            onBlur={() => setChampEnCoursEdition('')}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Champs Personnalisés */}
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 border-yellow-300">
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 rounded-xl mb-6">
                  <h3 className="text-white text-xl font-bold flex items-center gap-3">
                    <Edit3 className="w-5 h-5" />
                    Champs Personnalisés ({champsPersonnalises.length})
                    {afficherSeulementManquants && champsPersonnalises.filter(champ => !donneesActuelles[champ]?.trim()).length > 0 && (
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        {champsPersonnalises.filter(champ => !donneesActuelles[champ]?.trim()).length} manquants
                      </span>
                    )}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {obtenirChampsAAfficher(champsPersonnalises).map((champ) => (
                    <div key={champ} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-gray-800 text-sm font-semibold">
                          {champ}
                          {!donneesActuelles[champ]?.trim() && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <button
                          onClick={() => supprimerChampPersonnalise(champ)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          title="Supprimer le champ personnalisé"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={donneesActuelles[champ] || ''}
                        onChange={(e) => gererChangementChamp(champ, e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-50 border-2 border-yellow-400 text-gray-800 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                        placeholder={`Saisir ${champ.toLowerCase()}...`}
                        onFocus={() => setChampEnCoursEdition(champ)}
                        onBlur={() => setChampEnCoursEdition('')}
                        data-field={champ}
                      />
                    </div>
                  ))}
                </div>

                {champsPersonnalises.length === 0 && (
                  <p className="text-gray-500 text-center py-4 italic">Aucun champ personnalisé ajouté pour le moment</p>
                )}

                {afficherSaisieChampPersonnalise ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nomNouveauChamp}
                      onChange={(e) => setNomNouveauChamp(e.target.value)}
                      placeholder="Saisir le nom du nouveau champ..."
                      className="flex-1 p-3 rounded-lg bg-gray-50 border-2 border-yellow-400 text-gray-800 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                      onKeyPress={(e) => e.key === 'Enter' && ajouterChampPersonnalise()}
                    />
                    <button
                      onClick={ajouterChampPersonnalise}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Ajouter
                    </button>
                    <button
                      onClick={() => {
                        setAfficherSaisieChampPersonnalise(false);
                        setNomNouveauChamp('');
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAfficherSaisieChampPersonnalise(true)}
                    className="bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    Ajouter un Champ Personnalisé
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        
        {/* Pied de page */}
        <div className="text-center mt-12 bg-gradient-to-r from-gray-700 to-slate-800 rounded-2xl p-6 border-2 border-orange-300">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Hotel className="w-6 h-6 text-orange-400" />
            <p className="text-white font-semibold">© 2025 Omra Booking - Système de Gestion des Données Hôtelières</p>
          </div>
          <p className="text-gray-300">Gestion de {hotels.length}+ Hôtels à La Mecque avec Excellence Professionnelle</p>
        </div>
      </div>
    </div>
  );
}

export default GestionnaireHotels;
