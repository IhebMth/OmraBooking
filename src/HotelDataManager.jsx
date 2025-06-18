import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Plus,
  Trash2,
  Download,
  Save,
  MapPin,
  Building,
  Car,
  Eye,
  Utensils,
  Star,
  Edit3,
  CheckCircle,
  Search,
  Filter,
  BarChart3,
  Hotel,
} from "lucide-react";
import hotelsData from "./Hotels.json";

const GestionnaireHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [hotelaFiltres, setHotelsFilltres] = useState([]);
  const [hotelSelectionne, setHotelSelectionne] = useState("");
  const [donneesActuelles, setDonneesActuelles] = useState({});
  const [champsPersonnalises, setChampsPersonnalises] = useState([]);
  const [nomNouveauChamp, setNomNouveauChamp] = useState("");
  const [afficherSaisieChampPersonnalise, setAfficherSaisieChampPersonnalise] =
    useState(false);
  const [messageSauvegarde, setMessageSauvegarde] = useState("");
  const [termeRecherche, setTermeRecherche] = useState("");
  const [afficherSeulementManquants, setAfficherSeulementManquants] =
    useState(true);
  const [champEnCoursEdition, setChampEnCoursEdition] = useState("");
  const [filtreEtoilesSelectionne, setFiltreEtoilesSelectionne] = useState("");
  const [nombreTypesChambres, setNombreTypesChambres] = useState(1);

  // Catégories de champs avec style inspiré du logo
  // Catégories de champs avec style inspiré du logo
  const categoriesChamps = {
    "معلومات الاتصال والفندق": {
      icon: <Hotel className="w-5 h-5" />,
      color: "from-blue-500 to-indigo-600",
      fields: [
        " عدد النجوم",
        "سلسلة الفنادق التابعة لها",
        "البريد الإلكتروني للفندق",
        "رقم الهاتف",
        "الموقع الإلكتروني",
        "عنوان الفندق",
        "الحي",
        "اللغات التي يتحدث بها طاقم العمل",
        "كم عدد الأبراج؟",
        "كم عدد الطوابق الفندق؟",
        "كم عدد المصاعد في الفندق؟",
      ],
    },
    "المسافة والموقع": {
      icon: <MapPin className="w-5 h-5" />,
      color: "from-amber-500 to-yellow-600",
      fields: [
        "المسافة إلى الحرم المكي (متر)",
        "المسافة إلى المطار (متر)",
        "المسافة إلى منى(متر)",
        "المسافة إلى محطة القطار (متر)",
        "المسافة إلى محطة القطار (دقائق)",
        "المسافة إلى أقرب مسجد (متر) / اسم ",
        "المسافة إلى أبراج البيت (متر)",
        "المسافة إلى الجمرات (بالمتر)",
        "اسم مكتب الصرافة / المسافة (م)",
        "  مول أبراج البيت – المسافة (بالمتر)",
      ],
    },
    "الخدمات القريبة": {
      icon: <Building className="w-5 h-5" />,
      color: "from-gray-600 to-gray-700",
      fields: [
        "اسم المستشفى",
        "المسافة إلى المستشفى",
        "اسم الصيدلية",
        "المسافة إلى الصيدلية",
        "أقرب مركز تجاري (مول)",
        "اسم المول",
        "المسافة إلى المول",
        "أقرب أبواب الحرم (الاسم / المسافة)",
        "المساجد القريبة (الاسم / المسافة)",
        "صالون حلاقة على بعد 200 متر",
      ],
    },
    "خدمات النقل ومواقف السيارات": {
      icon: <Car className="w-5 h-5" />,
      color: "from-gray-700 to-gray-800",
      fields: [
        "هل توجد حافلة مجانية؟",
        "هل توجد حافلة تعمل 24 ساعة؟",
        "هل الحافلة مدفوعة؟",
        "هل توجد حافلة أثناء أوقات الصلاة؟",
        " تتوقف الحافلات في غزة أو عند النفق",
        "هل يوجد موقف سيارات؟",
        "هل موقف السيارات مدفوع؟",
        "هل موقف السيارات مجاني؟",
        "هل موقف السيارات متاح أثناء أوقات الصلاة؟",
        "هل يتوفر موقف للحافلات والفانات؟",
        "هل يوجد خدمة نقل بين مكة/المدينة والمطار في الفندق؟",
      ],
    },

    "الإطلالات والإقامة": {
      icon: <Eye className="w-5 h-5" />,
      color: "from-amber-600 to-yellow-700",
      fields: [
        "إطلالة على الكعبة متوفرة",
        "إطلالة جزئية على الكعبة",
        "إطلالة عادية على الكعبة",
        "إطلالة بانورامية على الكعبة",
        "إطلالة على الحرم",
        "فندق يمكن الوصول إليه سيراً على الأقدام",
        "ما هي الإطلالات المتوفرة في الغرف؟",
      ],
    },
    "الصلاة والمساجد": {
      icon: <Building className="w-5 h-5" />,
      color: "from-green-500 to-emerald-600",
      fields: [
        "هل يوجد مصلى داخل الفندق؟",
        "هل المصلى متصل بالحرم؟",
        "هل للمصلى إطلالة بانورامية على الحرم؟",
        "هل يُذاع الأذان داخل الفندق؟",
        "هل يُذاع الأذان في الغرف؟",
        "هل يوجد مسجد آخر قريب من الفندق (أقل من 200 متر)؟",
        "هل يوجد سجادة صلاة في الغرفة؟",
        "هل يوجد مصحف في الغرفة؟",
      ],
    },

    "الطعام والشراب": {
      icon: <Utensils className="w-5 h-5" />,
      color: "from-yellow-600 to-amber-700",
      fields: [
        "مطعم (الاسم / نوع المأكولات)",
        "المطاعم والمقاهي (الاسم / المسافة)",
        "السحور والإفطار مشمولان",
        "اسم المطعم الأول",
        "نوع المأكولات في المطعم الأول",
        "اسم المطعم الثاني",
        "نوع المأكولات في المطعم الثاني",
        "اسم المطعم الثالث",
        "نوع المأكولات في المطعم الثالث",
        "هل يقدم الفندق السحور والإفطار في رمضان؟",
      ],
    },
    "مرافق الفندق": {
      icon: <Star className="w-5 h-5" />,
      color: "from-amber-500 to-yellow-500",
      fields: [
        "سبا",
        "ساونا",
        "حمام تركي",
        "مركز لياقة بدنية",
        "مسبح",
        "كرسي تدليك",
        "تدليك القدمين متوفر",
        "صالون حلاقة/معهد تجميل",
        "مركز أعمال",
        "حضانة أطفال متوفرة في الفندق",
        "هل يوجد روضة أطفال داخل الفندق؟",
        "هل يتوفر واي فاي مجاني داخل الفندق؟",
        "منطقة لتخزين الأمتعة",
        "صالة رياضية",
        "منطقة مخصصة للتدخين",
        "خدمة غسيل الملابس",
        "قاعة مؤتمرات",
        "خدمة الفاكس وتصوير المستندات",
        "مركز خدمات رجال الأعمال",
      ],
    },
    "الخدمات المتعلقة بالعمرة": {
      icon: <Star className="w-5 h-5" />,
      color: "from-purple-500 to-violet-600",
      fields: [
        "هل يوجد صالون حلاقة داخل الفندق؟",
        "هل يوجد صالون حلاقة قريب من الفندق (أقل من 200 متر)؟",
        "ما هو العمر الأدنى للأطفال للحصول على الإقامة المجانية؟",
      ],
    },
    "معلومات الغرف": {
      icon: <Building className="w-5 h-5" />,
      color: "from-teal-500 to-cyan-600",
      fields: [
        "اتجاه القبلة معروض في الغرفة",
        "هل يوجد غرف مناسبة للأشخاص ذوي الحركة المحدودة؟",
        "هل توجد أجنحة لـ 5 أشخاص في الفندق؟",
        "هل توجد غرف رباعية قياسية (4 أسرة) في الفندق؟",
        "هل توجد غرف متصلة في الفندق؟",
        "هل يوجد حوض غسيل منخفض مناسب للأشخاص ذوي الحركة المحدودة؟",
        "كم عدد الحمامات؟",
        "هل يوجد زاوية مطبخ في الغرف؟",
        "هل يوجد ثلاجة في الغرف؟",
        "كم عدد مآخذ الكهرباء في الغرف؟",
        "هل يتوفر مجفف شعر في الحمام؟",
        "هل يوجد خزنة داخل الغرف؟",
        "هل يوجد آلة صنع القهوة؟",
      ],
    },
    // Add this new category to your categoriesChamps object, place it after "معلومات الغرف"
    "أنواع الغرف والأجنحة": {
      icon: <Building className="w-5 h-5" />,
      color: "from-purple-500 to-violet-600",
      fields: [], // Keep this empty as we'll handle room types separately
    },
  };

  const generateRoomTypeCategories = () => {
    const roomTypeCategories = {};

    for (let i = 1; i <= nombreTypesChambres; i++) {
      roomTypeCategories[`النوع ${i} - معلومات الغرفة/الجناح`] = {
        icon: <Building className="w-5 h-5" />,
        color: `from-purple-${400 + (i % 3) * 100} to-violet-${
          500 + (i % 3) * 100
        }`,
        fields: [
          `النوع ${i} - ما نوع الغرفة؟ (غرفة أو جناح)`,
          `النوع ${i} - إذا كان جناحًا، كم عدد الغرف فيه؟`,
          `النوع ${i} - ما نوع الإطلالة؟`,
          `النوع ${i} - كم عدد الأشخاص الذين يمكن أن يشغلوا هذه الغرفة أو الجناح؟`,
          `النوع ${i} - ما مساحة الغرفة؟`,
          `النوع ${i} - ما اسم السرير؟ (كينغ سايز، سرير مزدوج، إلخ...)`,
          `النوع ${i} - ما عدد الأسرة في الغرفة؟`,
          `النوع ${i} - ما عرض السرير؟`,
          `النوع ${i} - هل توجد سجادة صلاة، قرآن كريم، واتجاه القبلة معروض في الغرفة؟`,
          `النوع ${i} - كم عدد الحمامات؟`,
        ],
      };
    }

    return roomTypeCategories;
  };

  // Initialiser les hôtels depuis le fichier JSON
  useEffect(() => {
    setHotels(hotelsData.makkahHotels);
    setHotelsFilltres(hotelsData.makkahHotels);

    // Charger les champs personnalisés depuis la mémoire
    const champsPersonnalisesSauvegardes = JSON.parse(
      sessionStorage.getItem("champsPersonnalises") || "[]"
    );
    setChampsPersonnalises(champsPersonnalisesSauvegardes);
  }, []);

  // Gérer la recherche et la fonctionnalité de filtrage
  useEffect(() => {
    let filtres = hotels;

    // Appliquer le filtre de recherche
    if (termeRecherche.trim() !== "") {
      filtres = filtres.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(termeRecherche.toLowerCase()) ||
          hotel.category.toLowerCase().includes(termeRecherche.toLowerCase()) ||
          hotel.district.toLowerCase().includes(termeRecherche.toLowerCase())
      );
    }

    // Appliquer le filtre d'étoiles
    if (filtreEtoilesSelectionne !== "") {
      filtres = filtres.filter((hotel) =>
        hotel.category
          .toLowerCase()
          .includes(filtreEtoilesSelectionne.toLowerCase())
      );
    }

    setHotelsFilltres(filtres);
  }, [termeRecherche, filtreEtoilesSelectionne, hotels]);

  // Sauvegarder les champs personnalisés en mémoire
  useEffect(() => {
    sessionStorage.setItem(
      "champsPersonnalises",
      JSON.stringify(champsPersonnalises)
    );
  }, [champsPersonnalises]);

  // Charger les données de l'hôtel quand sélectionné
  const gererSelectionHotel = (hotelId) => {
    setHotelSelectionne(hotelId);
    const donneesSauvegardees = JSON.parse(
      sessionStorage.getItem(`hotel_${hotelId}`) || "{}"
    );
    setDonneesActuelles(donneesSauvegardees);
  };

  // Gérer les changements de champs avec gestion d'état appropriée
  const gererChangementChamp = (champ, valeur) => {
    setDonneesActuelles((prev) => {
      const nouvellesDonnees = {
        ...prev,
        [champ]: valeur,
      };
      // Sauvegarder immédiatement dans sessionStorage pour éviter la perte de données
      if (hotelSelectionne) {
        sessionStorage.setItem(
          `hotel_${hotelSelectionne}`,
          JSON.stringify(nouvellesDonnees)
        );
      }
      return nouvellesDonnees;
    });
  };

  // Ajouter un champ personnalisé avec gestion d'état appropriée
  const ajouterChampPersonnalise = () => {
    if (
      nomNouveauChamp.trim() &&
      !champsPersonnalises.includes(nomNouveauChamp.trim())
    ) {
      const nouveauChamp = nomNouveauChamp.trim();
      setChampsPersonnalises((prev) => {
        const miseAJour = [...prev, nouveauChamp];
        sessionStorage.setItem(
          "champsPersonnalises",
          JSON.stringify(miseAJour)
        );
        return miseAJour;
      });
      setNomNouveauChamp("");
      setAfficherSaisieChampPersonnalise(false);
    }
  };

  // Supprimer un champ personnalisé
  const supprimerChampPersonnalise = (champASupprimer) => {
    setChampsPersonnalises((prev) => {
      const miseAJour = prev.filter((champ) => champ !== champASupprimer);
      sessionStorage.setItem("champsPersonnalises", JSON.stringify(miseAJour));
      return miseAJour;
    });

    // Supprimer les données du champ de tous les hôtels
    hotels.forEach((hotel) => {
      const donneesHotel = JSON.parse(
        sessionStorage.getItem(`hotel_${hotel.id}`) || "{}"
      );
      if (donneesHotel[champASupprimer]) {
        delete donneesHotel[champASupprimer];
        sessionStorage.setItem(
          `hotel_${hotel.id}`,
          JSON.stringify(donneesHotel)
        );
      }
    });

    // Mettre à jour les données actuelles si cet hôtel a ce champ
    if (donneesActuelles[champASupprimer]) {
      setDonneesActuelles((prev) => {
        const miseAJour = { ...prev };
        delete miseAJour[champASupprimer];
        if (hotelSelectionne) {
          sessionStorage.setItem(
            `hotel_${hotelSelectionne}`,
            JSON.stringify(miseAJour)
          );
        }
        return miseAJour;
      });
    }
  };

  // Fonction de sauvegarde des données
  const sauvegarderDonnees = () => {
    if (hotelSelectionne) {
      sessionStorage.setItem(
        `hotel_${hotelSelectionne}`,
        JSON.stringify(donneesActuelles)
      );
      setMessageSauvegarde("✅ تم حفظ البيانات بنجاح!");
      setTimeout(() => setMessageSauvegarde(""), 3000);
    }
  };

  // Exporter les données d'un seul hôtel
  const exporterVersExcel = () => {
  if (!hotelSelectionne) {
    alert("يرجى اختيار فندق أولاً!");
    return;
  }

  const donneesHotelSelectionne = hotels.find(h => h.id === hotelSelectionne);
  const wb = XLSX.utils.book_new();
  
  // Create worksheet
  const ws = {};
  let currentRow = 1;

  // Helper function to set cell value and style
  const setCellWithStyle = (ref, value, style = {}) => {
    ws[ref] = { v: value, t: 's', s: style };
  };

  // Define styles
  const headerStyle = {
    fill: { fgColor: { rgb: "FFD700" } }, // Gold background
    font: { bold: true, sz: 14, color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thick", color: { rgb: "000000" } },
      bottom: { style: "thick", color: { rgb: "000000" } },
      left: { style: "thick", color: { rgb: "000000" } },
      right: { style: "thick", color: { rgb: "000000" } }
    }
  };

  const categoryHeaderStyle = {
    fill: { fgColor: { rgb: "4F46E5" } }, // Indigo background
    font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "medium", color: { rgb: "000000" } },
      bottom: { style: "medium", color: { rgb: "000000" } },
      left: { style: "medium", color: { rgb: "000000" } },
      right: { style: "medium", color: { rgb: "000000" } }
    }
  };

  const fieldLabelStyle = {
    fill: { fgColor: { rgb: "F3F4F6" } }, // Light gray background
    font: { bold: true, sz: 10, color: { rgb: "374151" } },
    alignment: { horizontal: "right", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "D1D5DB" } },
      bottom: { style: "thin", color: { rgb: "D1D5DB" } },
      left: { style: "thin", color: { rgb: "D1D5DB" } },
      right: { style: "thin", color: { rgb: "D1D5DB" } }
    }
  };

  const fieldValueStyle = {
    fill: { fgColor: { rgb: "FFFFFF" } }, // White background
    font: { sz: 10, color: { rgb: "1F2937" } },
    alignment: { horizontal: "right", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "D1D5DB" } },
      bottom: { style: "thin", color: { rgb: "D1D5DB" } },
      left: { style: "thin", color: { rgb: "D1D5DB" } },
      right: { style: "thin", color: { rgb: "D1D5DB" } }
    }
  };

  const emptyValueStyle = {
    fill: { fgColor: { rgb: "FEF2F2" } }, // Light red background for empty values
    font: { sz: 10, color: { rgb: "DC2626" }, italic: true },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "D1D5DB" } },
      bottom: { style: "thin", color: { rgb: "D1D5DB" } },
      left: { style: "thin", color: { rgb: "D1D5DB" } },
      right: { style: "thin", color: { rgb: "D1D5DB" } }
    }
  };

  // Main header
  setCellWithStyle(`A${currentRow}`, "تفاصيل الفندق", headerStyle);
  setCellWithStyle(`B${currentRow}`, "", headerStyle);
  setCellWithStyle(`C${currentRow}`, "", headerStyle);
  ws['!merges'] = [{ s: { c: 0, r: currentRow - 1 }, e: { c: 2, r: currentRow - 1 } }];
  currentRow += 2;

  // Hotel basic info
  setCellWithStyle(`A${currentRow}`, "اسم الفندق", fieldLabelStyle);
  setCellWithStyle(`B${currentRow}`, donneesHotelSelectionne?.name || "", fieldValueStyle);
  setCellWithStyle(`C${currentRow}`, "", fieldValueStyle);
  currentRow++;


  // Process categories
  const allCategories = {
    ...categoriesChamps,
    ...generateRoomTypeCategories()
  };

  Object.entries(allCategories).forEach(([categoryName, categoryData]) => {
    if (categoryName === "أنواع الغرف والأجنحة") return;
    
    // Category header
    setCellWithStyle(`A${currentRow}`, categoryName, categoryHeaderStyle);
    setCellWithStyle(`B${currentRow}`, "", categoryHeaderStyle);
    setCellWithStyle(`C${currentRow}`, "", categoryHeaderStyle);
    ws['!merges'] = ws['!merges'] || [];
    ws['!merges'].push({ s: { c: 0, r: currentRow - 1 }, e: { c: 2, r: currentRow - 1 } });
    currentRow++;

    // Table headers
    setCellWithStyle(`A${currentRow}`, "الحقل", fieldLabelStyle);
    setCellWithStyle(`B${currentRow}`, "القيمة", fieldLabelStyle);
    setCellWithStyle(`C${currentRow}`, "الحالة", fieldLabelStyle);
    currentRow++;

    // Category fields
    categoryData.fields.forEach(field => {
      const value = donneesActuelles[field] || "";
      const isEmpty = !value.trim();
      
      setCellWithStyle(`A${currentRow}`, field, fieldLabelStyle);
      setCellWithStyle(`B${currentRow}`, value || "غير مكتمل", isEmpty ? emptyValueStyle : fieldValueStyle);
      setCellWithStyle(`C${currentRow}`, isEmpty ? "❌ ناقص" : "✅ مكتمل", isEmpty ? emptyValueStyle : fieldValueStyle);
      currentRow++;
    });

    currentRow++; // Empty row between categories
  });

  // Custom fields section
  if (champsPersonnalises.length > 0) {
    setCellWithStyle(`A${currentRow}`, "الحقول المخصصة", categoryHeaderStyle);
    setCellWithStyle(`B${currentRow}`, "", categoryHeaderStyle);
    setCellWithStyle(`C${currentRow}`, "", categoryHeaderStyle);
    ws['!merges'] = ws['!merges'] || [];
    ws['!merges'].push({ s: { c: 0, r: currentRow - 1 }, e: { c: 2, r: currentRow - 1 } });
    currentRow++;

    setCellWithStyle(`A${currentRow}`, "الحقل", fieldLabelStyle);
    setCellWithStyle(`B${currentRow}`, "القيمة", fieldLabelStyle);
    setCellWithStyle(`C${currentRow}`, "الحالة", fieldLabelStyle);
    currentRow++;

    champsPersonnalises.forEach(field => {
      const value = donneesActuelles[field] || "";
      const isEmpty = !value.trim();
      
      setCellWithStyle(`A${currentRow}`, field, fieldLabelStyle);
      setCellWithStyle(`B${currentRow}`, value || "غير مكتمل", isEmpty ? emptyValueStyle : fieldValueStyle);
      setCellWithStyle(`C${currentRow}`, isEmpty ? "❌ ناقص" : "✅ مكتمل", isEmpty ? emptyValueStyle : fieldValueStyle);
      currentRow++;
    });
  }

  // Set worksheet range
  ws['!ref'] = `A1:C${currentRow - 1}`;

  // Set column widths
  ws['!cols'] = [
    { width: 40 }, // Column A - Field names
    { width: 30 }, // Column B - Values
    { width: 15 }  // Column C - Status
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "بيانات الفندق");

  // Save file
  XLSX.writeFile(wb, `${donneesHotelSelectionne?.name.replace(/[^a-zA-Z0-9]/g, "_")}_بيانات_مفصلة.xlsx`);
};



  // Fonctions d'aide

  const obtenirChampsVides = () => {
    const tousLesChamps = [
      ...Object.values(categoriesChamps).flatMap((cat) => cat.fields),
      ...Object.values(generateRoomTypeCategories()).flatMap(
        (cat) => cat.fields
      ),
      ...champsPersonnalises,
    ];
    return tousLesChamps.filter((champ) => !donneesActuelles[champ]?.trim());
  };
  const obtenirChampsRemplis = () => {
    const tousLesChamps = [
      ...Object.values(categoriesChamps).flatMap((cat) => cat.fields),
      ...Object.values(generateRoomTypeCategories()).flatMap(
        (cat) => cat.fields
      ),
      ...champsPersonnalises,
    ];
    return tousLesChamps.filter((champ) => donneesActuelles[champ]?.trim());
  };

  const obtenirPourcentageCompletion = () => {
    const tousLesChamps = [
      ...Object.values(categoriesChamps).flatMap((cat) => cat.fields),
      ...Object.values(generateRoomTypeCategories()).flatMap(
        (cat) => cat.fields
      ),
      ...champsPersonnalises,
    ];
    const champsRemplis = tousLesChamps.filter((champ) =>
      donneesActuelles[champ]?.trim()
    ).length;
    return tousLesChamps.length > 0
      ? Math.round((champsRemplis / tousLesChamps.length) * 100)
      : 0;
  };

  const obtenirChampsAAfficher = (champsCategorie) => {
    if (afficherSeulementManquants) {
      return champsCategorie.filter((champ) => {
        const estVide = !donneesActuelles[champ]?.trim();
        const estEnCoursEdition = champEnCoursEdition === champ;
        return estVide || estEnCoursEdition;
      });
    }
    return champsCategorie;
  };

  const donneesHotelSelectionne = hotels.find((h) => h.id === hotelSelectionne);

  // Add this function to handle adding new room types
  const ajouterNouveauTypeGhambre = () => {
    if (nombreTypesChambres < 20) {
      setNombreTypesChambres((prev) => prev + 1);
    }
  };

  // Add this function to remove room types
  const supprimerTypeGhambre = () => {
    if (nombreTypesChambres > 1) {
      setNombreTypesChambres((prev) => prev - 1);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* En-tête */}
        <div className="text-center mb-8 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src="/OmraBooking.jpg"
                alt="شعار عمرة بوكينج"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h1 className="text-5xl font-bold text-gray-800">OmraBooking</h1>
          </div>
          <p className="text-gray-800 text-xl font-semibold">
            نظام إدارة بيانات الفنادق
          </p>
          <p className="text-gray-700 text-lg">
            إدارة أكثر من {hotels.length} فندق في مكة المكرمة
          </p>
        </div>

        {/* Sélection d'Hôtel */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-xl border-2 border-yellow-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-gray-800 text-sm font-semibold mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" />
                البحث واختيار الفندق ({hotelaFiltres.length} من {hotels.length}{" "}
                فندق)
              </label>

              {/* Champ de Recherche */}
              <input
                type="text"
                placeholder="البحث في الفنادق بالاسم أو الفئة أو المنطقة..."
                value={termeRecherche}
                onChange={(e) => setTermeRecherche(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-50 border-2 border-yellow-400 text-gray-800 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-yellow-200 transition-all mb-4"
              />

              {/* Boutons de Filtre d'Étoiles */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setFiltreEtoilesSelectionne("")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filtreEtoilesSelectionne === ""
                      ? "bg-yellow-500 text-white shadow-lg hover:bg-yellow-600"
                      : "bg-gray-200 text-gray-700 hover:bg-yellow-300 hover:text-gray-800"
                  }`}
                >
                  جميع النجوم
                </button>
                <button
                  onClick={() => setFiltreEtoilesSelectionne("5-Star")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    filtreEtoilesSelectionne === "5-Star"
                      ? "bg-yellow-500 text-white shadow-lg hover:bg-yellow-600"
                      : "bg-gray-200 text-gray-700 hover:bg-yellow-300 hover:text-gray-800"
                  }`}
                >
                  <Star className="w-4 h-4" />5 نجوم
                </button>
                <button
                  onClick={() => setFiltreEtoilesSelectionne("4-Star")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    filtreEtoilesSelectionne === "4-Star"
                      ? "bg-yellow-500 text-white shadow-lg hover:bg-yellow-600"
                      : "bg-gray-200 text-gray-700 hover:bg-yellow-300 hover:text-gray-800"
                  }`}
                >
                  <Star className="w-4 h-4" />4 نجوم
                </button>
                <button
                  onClick={() => setFiltreEtoilesSelectionne("3-Star")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    filtreEtoilesSelectionne === "3-Star"
                      ? "bg-yellow-500 text-white shadow-lg hover:bg-yellow-600"
                      : "bg-gray-200 text-gray-700 hover:bg-yellow-300 hover:text-gray-800"
                  }`}
                >
                  <Star className="w-4 h-4" />3 نجوم
                </button>
                <button
                  onClick={() => setFiltreEtoilesSelectionne("2-Star")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    filtreEtoilesSelectionne === "2-Star"
                      ? "bg-yellow-500 text-white shadow-lg hover:bg-yellow-600"
                      : "bg-gray-200 text-gray-700 hover:bg-yellow-300 hover:text-gray-800"
                  }`}
                >
                  <Star className="w-4 h-4" />
                  نجمتان
                </button>
                <button
                  onClick={() => setFiltreEtoilesSelectionne("1-Star")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    filtreEtoilesSelectionne === "1-Star"
                      ? "bg-yellow-500 text-white shadow-lg hover:bg-yellow-600"
                      : "bg-gray-200 text-gray-700 hover:bg-yellow-300 hover:text-gray-800"
                  }`}
                >
                  <Star className="w-4 h-4" />
                  نجمة واحدة
                </button>
                <button
                  onClick={() => setFiltreEtoilesSelectionne("0-Star")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    filtreEtoilesSelectionne === "0-Star"
                      ? "bg-yellow-500 text-white shadow-lg hover:bg-yellow-600"
                      : "bg-gray-200 text-gray-700 hover:bg-yellow-300 hover:text-gray-800"
                  }`}
                >
                  <Star className="w-4 h-4" />
                  بدون نجوم
                </button>
              </div>
              {/* Menu Déroulant des Hôtels */}
              <select
                value={hotelSelectionne}
                onChange={(e) => gererSelectionHotel(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-50 border-2 border-yellow-400 text-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-yellow-200 transition-all"
              >
                <option value="">اختر فندق...</option>
                {hotelaFiltres.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name} ({hotel.category}) - {hotel.district}
                  </option>
                ))}
              </select>

              {hotelaFiltres.length === 0 &&
                (termeRecherche || filtreEtoilesSelectionne) && (
                  <p className="text-gray-600 text-sm mt-2">
                    لم يتم العثور على فنادق تطابق معاييرك.
                  </p>
                )}
            </div>

            {hotelSelectionne && (
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border-2 border-yellow-300">
                <h3 className="text-gray-800 font-bold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  حالة الإكمال
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-300 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-amber-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${obtenirPourcentageCompletion()}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-800 font-bold">
                      %{obtenirPourcentageCompletion()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    <div>✅ مكتمل: {obtenirChampsRemplis().length} حقل</div>
                    <div>❌ ناقص: {obtenirChampsVides().length} حقل</div>
                  </div>
                  {donneesHotelSelectionne && (
                    <div className="text-sm text-gray-700 border-t border-gray-300 pt-2">
                      <div>
                        <strong>الفندق:</strong> {donneesHotelSelectionne.name}
                      </div>
                      <div>
                        <strong>الفئة:</strong>{" "}
                        {donneesHotelSelectionne.category}
                      </div>
                      <div>
                        <strong>المنطقة:</strong>{" "}
                        {donneesHotelSelectionne.district}
                      </div>
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
                  حفظ
                </button>
                <button
                  onClick={exporterVersExcel}
                  className="bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  تصدير الفندق
                </button>
         
              </div>

              <div className="flex items-center gap-3 bg-white/90 rounded-xl p-3 border-2 border-yellow-300">
                <Filter className="w-5 h-5 text-gray-600" />
                <label className="flex items-center gap-2 text-gray-800 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={afficherSeulementManquants}
                    onChange={(e) =>
                      setAfficherSeulementManquants(e.target.checked)
                    }
                    className="w-4 h-4 text-yellow-500 rounded"
                  />
                  إظهار الحقول الناقصة فقط
                </label>
              </div>
            </div>

            {messageSauvegarde && (
              <div className="bg-green-100 border-2 border-green-400 text-green-800 px-6 py-4 rounded-xl mb-6 font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {messageSauvegarde}
              </div>
            )}

            {/* حقول إدخال البيانات */}
            <div className="space-y-6">
              {Object.entries(categoriesChamps)
                .filter(
                  ([nomCategorie]) => nomCategorie !== "أنواع الغرف والأجنحة"
                )
                .concat(Object.entries(generateRoomTypeCategories()))
                .map(([nomCategorie, donneesCategorie]) => {
                  const champsAAfficher = obtenirChampsAAfficher(
                    donneesCategorie.fields
                  );

                  if (
                    champsAAfficher.length === 0 &&
                    afficherSeulementManquants
                  ) {
                    return (
                      <div
                        key={nomCategorie}
                        className="bg-green-50 backdrop-blur-lg rounded-2xl p-6 border-2 border-green-400"
                      >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl mb-4">
                          <h3 className="text-white text-xl font-bold flex items-center gap-3">
                            <CheckCircle className="w-6 h-6" />
                            {nomCategorie} - جميع البيانات مكتملة ✅
                          </h3>
                        </div>
                        <p className="text-green-700 font-semibold text-center py-4">
                          تم إكمال جميع حقول هذه الفئة!
                        </p>
                      </div>
                    );
                  }

                  // Check if this is a room type category
                  const isRoomTypeCategory =
                    nomCategorie.includes("النوع") &&
                    nomCategorie.includes("معلومات الغرفة");

                  return (
                    <div
                      key={nomCategorie}
                      className={`bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 ${
                        isRoomTypeCategory
                          ? "border-purple-400"
                          : "border-yellow-300"
                      }`}
                    >
                      <div
                        className={`bg-gradient-to-r ${donneesCategorie.color} p-4 rounded-xl mb-6`}
                      >
                        <h3 className="text-white text-xl font-bold flex items-center gap-3">
                          {donneesCategorie.icon}
                          {nomCategorie}
                          {afficherSeulementManquants &&
                            champsAAfficher.length > 0 && (
                              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                {champsAAfficher.length} ناقص
                              </span>
                            )}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {champsAAfficher.map((champ) => (
                          <div key={champ} className="space-y-2">
                            <label className="block text-gray-800 text-sm font-semibold">
                              {champ}
                              {!donneesActuelles[champ]?.trim() && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>
                            <input
                              type="text"
                              value={donneesActuelles[champ] || ""}
                              onChange={(e) =>
                                gererChangementChamp(champ, e.target.value)
                              }
                              className="w-full p-3 rounded-lg bg-gray-50 border-2 border-yellow-400 text-gray-800 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                              placeholder={`أدخل ${champ.toLowerCase()}...`}
                              data-field={champ}
                              onFocus={() => setChampEnCoursEdition(champ)}
                              onBlur={() => setChampEnCoursEdition("")}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

              {/* Add the room type management section separately at the end */}
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 border-purple-400">
                <div className="bg-gradient-to-r from-purple-600 to-violet-700 p-4 rounded-xl mb-6">
                  <h3 className="text-white text-xl font-bold flex items-center gap-3">
                    <Building className="w-6 h-6" />
                    إدارة أنواع الغرف والأجنحة
                  </h3>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={ajouterNouveauTypeGhambre}
                    disabled={nombreTypesChambres >= 20}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                      nombreTypesChambres >= 20
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white shadow-lg"
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                    إضافة نوع غرفة جديد ({nombreTypesChambres}/20)
                  </button>
                  {nombreTypesChambres > 1 && (
                    <button
                      onClick={supprimerTypeGhambre}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                      حذف آخر نوع
                    </button>
                  )}
                </div>

                <div className="mt-4 text-center text-sm text-gray-600">
                  عدد أنواع الغرف الحالية: {nombreTypesChambres}
                </div>
              </div>
              {/* الحقول المخصصة */}
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 border-yellow-300">
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 rounded-xl mb-6">
                  <h3 className="text-white text-xl font-bold flex items-center gap-3">
                    <Edit3 className="w-5 h-5" />
                    الحقول المخصصة ({champsPersonnalises.length})
                    {afficherSeulementManquants &&
                      champsPersonnalises.filter(
                        (champ) => !donneesActuelles[champ]?.trim()
                      ).length > 0 && (
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                          {
                            champsPersonnalises.filter(
                              (champ) => !donneesActuelles[champ]?.trim()
                            ).length
                          }{" "}
                          ناقص
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
                          {!donneesActuelles[champ]?.trim() && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                        <button
                          onClick={() => supprimerChampPersonnalise(champ)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          title="حذف الحقل المخصص"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={donneesActuelles[champ] || ""}
                        onChange={(e) =>
                          gererChangementChamp(champ, e.target.value)
                        }
                        className="w-full p-3 rounded-lg bg-gray-50 border-2 border-yellow-400 text-gray-800 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                        placeholder={`أدخل ${champ.toLowerCase()}...`}
                        onFocus={() => setChampEnCoursEdition(champ)}
                        onBlur={() => setChampEnCoursEdition("")}
                        data-field={champ}
                      />
                    </div>
                  ))}
                </div>

                {champsPersonnalises.length === 0 && (
                  <p className="text-gray-500 text-center py-4 italic">
                    لم يتم إضافة أي حقول مخصصة حتى الآن
                  </p>
                )}

                {afficherSaisieChampPersonnalise ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nomNouveauChamp}
                      onChange={(e) => setNomNouveauChamp(e.target.value)}
                      placeholder="أدخل اسم الحقل الجديد..."
                      className="flex-1 p-3 rounded-lg bg-gray-50 border-2 border-yellow-400 text-gray-800 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                      onKeyPress={(e) =>
                        e.key === "Enter" && ajouterChampPersonnalise()
                      }
                    />
                    <button
                      onClick={ajouterChampPersonnalise}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      إضافة
                    </button>
                    <button
                      onClick={() => {
                        setAfficherSaisieChampPersonnalise(false);
                        setNomNouveauChamp("");
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAfficherSaisieChampPersonnalise(true)}
                    className="bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    إضافة حقل مخصص
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* تذييل الصفحة */}
        <div className="text-center mt-12 bg-gradient-to-r from-gray-700 to-slate-800 rounded-2xl p-6 border-2 border-orange-300">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Hotel className="w-6 h-6 text-orange-400" />
            <p className="text-white font-semibold">
              © 2025 حجز العمرة - نظام إدارة البيانات الفندقية
            </p>
          </div>
          <p className="text-gray-300">
            إدارة {hotels.length}+ فندق في مكة المكرمة بامتياز مهني
          </p>
        </div>
      </div>
    </div>
  );
};

export default GestionnaireHotels;
