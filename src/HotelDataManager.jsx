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
        "مرسل من قبل",
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
        "المسافة إلى أقرب مسجد (باستثناء الحرم) / الاسم",
        "المسافة إلى الجمرات (بالمتر)",
                "أقرب أبواب الحرم (الاسم / المسافة)",
      ],
    },
    "الخدمات القريبة": {
      icon: <Building className="w-5 h-5" />,
      color: "from-gray-600 to-gray-700",
      fields: [
                "اسم مكتب الصرافة / المسافة (م)",
        "اسم المستشفى",
        "المسافة إلى المستشفى",
        "اسم الصيدلية",
        "المسافة إلى الصيدلية",
        " مول أبراج البيت – المسافة (بالمتر)",

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
    "مرافق الفندق": {
      icon: <Star className="w-5 h-5" />,
      color: "from-orange-500 to-rose-600",
      fields: [
        "سبا",
        "ساونا",
        "حمام تركي",
        "مركز لياقة بدنية",
        "مسبح",
        "كرسي تدليك",
        "تدليك القدمين متوفر",
        "مركز أعمال",
        "هل يوجد روضة أطفال داخل الفندق؟",
        "هل يتوفر واي فاي مجاني داخل الفندق؟",
        "منطقة لتخزين الأمتعة",
        "صالة رياضية",
        "منطقة مخصصة للتدخين",
        "خدمة غسيل الملابس",
        "خدمة تحويل العملات",
        "التنظيف الجاف",
        "قاعة اجتماعات",
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
        "حضانة أطفال متوفرة في الفندق",
        "ما هو العمر الأدنى للأطفال للحصول على الإقامة المجانية؟",
      ],
    },

    "المطاعم والمقاهي": {
      icon: <Utensils className="w-5 h-5" />,
      color: "from-red-500 to-pink-600",
      fields: [
        "اسم المطعم الأول",
        "نوع المأكولات في المطعم الأول",
        "اسم المطعم الثاني",
        "نوع المأكولات في المطعم الثاني",
        "اسم المطعم الثالث",
        "نوع المأكولات في المطعم الثالث",
        "هل يقدم الفندق السحور والإفطار في رمضان؟",
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

  // Bed type and room category options
  const bedTypeOptions = [
    { value: "", label: "اختر نوع السرير..." },
    { value: "canapé-lit", label: "Canapé-lit — أريكة تتحول إلى سرير" },
    {
      value: "lit-baldaquin",
      label: "Lit à baldaquin — سرير مغطّى (بأعمدة وستائر)",
    },
    { value: "lit-appoint", label: "Lit d'appoint — سرير إضافي" },
    { value: "lit-jour", label: "Lit de jour — سرير نهاري" },
    { value: "lit-double", label: "Lit double — سرير مزدوج" },
    {
      value: "lit-escamotable",
      label: "Lit escamotable — سرير قابل للطيّ (أو سرير جداري)",
    },
    { value: "lit-king", label: "Lit king — سرير كينغ" },
    { value: "lit-queen", label: "Lit queen — سرير كوين" },
    { value: "lit-simple", label: "Lit simple — سرير مفرد" },
    { value: "lit-jumeaux", label: "Lit jumeaux — سريران توأم" },
    { value: "lit-triple", label: "Lit triple — سرير ثلاثي" },
    { value: "lits-superposes", label: "Lits superposés — أسرّة بطابقين" },
  ];

  const roomCategoryOptions = [
    { value: "", label: "اختر فئة الغرفة..." },
    { value: "royale", label: "Royale — ملكيّة" },
    { value: "deluxe", label: "Deluxe — ديلوكس" },
    { value: "standard", label: "Standard — قياسي" },
    { value: "ambassadeur", label: "Ambassadeur — سفير" },
    { value: "classique", label: "Classique — كلاسيكي" },
    { value: "confort", label: "Confort — مريح" },
    { value: "diplomatique", label: "Diplomatique — دبلوماسي" },
    { value: "executive", label: "Executive — تنفيذي" },
    { value: "familiale", label: "Familiale — عائلي" },
    { value: "junior", label: "Junior — جونيور" },
    { value: "panoramique", label: "Panoramique — بانورامي" },
    { value: "pmr", label: "PMR — لذوي الاحتياجات الخاصة" },
    { value: "premium", label: "Premium — بريميوم" },
    { value: "presidentielle", label: "Présidentielle — رئاسي" },
    { value: "prince", label: "Prince — أميري" },
    { value: "residentielle", label: "Résidentielle — سكني" },
    { value: "signature", label: "Signature — سيغنتشر (أو مميّز)" },
    { value: "studio", label: "Studio — استوديو" },
    { value: "superieur", label: "Supérieur — فاخر (أو سوبريور)" },
    { value: "tour", label: "Tour" },
  ];

  const translationMap = {
    "مرسل من قبل": "Envoi par",
    "اسم الفندق": "Nom de l'hôtel",
    "تفاصيل الفندق": "Détails de l'hôtel",
    الحقل: "Champ",
    القيمة: "Valeur",
    "غير مكتمل": "Non complété",

    // Categories
    "معلومات الاتصال والفندق": "Informations de contact et hôtel",
    "المسافة والموقع": "Distance et localisation",
    "الخدمات القريبة": "Services à proximité",
    "الإطلالات والإقامة": "Vues et hébergement",
    "الصلاة والمساجد": "Prière et mosquées",
    "خدمات النقل ومواقف السيارات": "Services de transport et parking",
    "مرافق الفندق": "Équipements de l'hôtel",
    "الخدمات المتعلقة بالعمرة": "Services liés à la Omra",
    "المطاعم والمقاهي": "Restaurants et cafés",
    "معلومات الغرف": "Informations sur les chambres",
    "أنواع الغرف والأجنحة": "Types de chambres et suites",
    "الحقول المخصصة": "Champs personnalisés",

    // Contact and Hotel Info Fields
    "عدد النجوم": "Nombre d'étoiles",
    "سلسلة الفنادق التابعة لها": "Chaîne hôtelière",
    "البريد الإلكتروني للفندق": "Email de l'hôtel",
    "رقم الهاتف": "Numéro de téléphone",
    "الموقع الإلكتروني": "Site web",
    "عنوان الفندق": "Adresse de l'hôtel",
   "الحي": "Quartier",
    "اللغات التي يتحدث بها طاقم العمل": "Langues parlées par le personnel",
    "كم عدد الأبراج؟": "Combien de tours ?",
    "كم عدد الطوابق الفندق؟": "Combien d'étages dans l'hôtel ?",
    "كم عدد المصاعد في الفندق؟": "Combien d'ascenseurs dans l'hôtel ?",

    // Distance and Location Fields
    "المسافة إلى الحرم المكي (متر)": "Distance vers la Mosquée sacrée (mètres)",
    "المسافة إلى المطار (متر)": "Distance vers l'aéroport (mètres)",
    "المسافة إلى منى(متر)": "Distance vers Mina (mètres)",
    "المسافة إلى محطة القطار (متر)": "Distance vers la gare (mètres)",
    "المسافة إلى محطة القطار (دقائق)": "Distance vers la gare (minutes)",
"المسافة إلى أقرب مسجد (باستثناء الحرم) / الاسم":
 "Distance jusqu’à la mosquée la plus proche (hors Haram) / Nom",
    "المسافة إلى الجمرات (بالمتر)": "Distance vers Jamarat (mètres)",
    "اسم مكتب الصرافة / المسافة (م)": "Nom du bureau de change / distance (m)",
    "أقرب أبواب الحرم (الاسم / المسافة)":
      "Portes les plus proches du Haram (nom / distance)",

    // Nearby Services Fields
    "اسم المستشفى": "Nom de l'hôpital",
    "المسافة إلى المستشفى": "Distance vers l'hôpital",
    "اسم الصيدلية": "Nom de la pharmacie",
    "المسافة إلى الصيدلية": "Distance vers la pharmacie",
    "مول أبراج البيت – المسافة (بالمتر)":
      "Centre commercial Abraj Al-Bait – distance (mètres)",
    "المساجد القريبة (الاسم / المسافة)": "Mosquées proches (nom / distance)",

    // Views and Accommodation Fields
    "إطلالة على الكعبة متوفرة": "Vue sur la Kaaba disponible",
    "إطلالة جزئية على الكعبة": "Vue partielle sur la Kaaba",
    "إطلالة عادية على الكعبة": "Vue normale sur la Kaaba",
    "إطلالة بانورامية على الكعبة": "Vue panoramique sur la Kaaba",
    "إطلالة على الحرم": "Vue sur le Haram",
    "فندق يمكن الوصول إليه سيراً على الأقدام": "Hôtel accessible à pied",
    "ما هي الإطلالات المتوفرة في الغرف؟":
      "Quelles vues sont disponibles dans les chambres ?",

    // Prayer and Mosques Fields
    "هل يوجد مصلى داخل الفندق؟": "Y a-t-il une salle de prière dans l'hôtel ?",
    "هل المصلى متصل بالحرم؟":
      "La salle de prière est-elle connectée au Haram ?",
    "هل للمصلى إطلالة بانورامية على الحرم؟":
      "La salle de prière a-t-elle une vue panoramique sur le Haram ?",
    "هل يُذاع الأذان داخل الفندق؟":
      "L'appel à la prière est-il diffusé dans l'hôtel ?",
    "هل يُذاع الأذان في الغرف؟":
      "L'appel à la prière est-il diffusé dans les chambres ?",
    "هل يوجد مسجد آخر قريب من الفندق (أقل من 200 متر)؟":
      "Y a-t-il une autre mosquée près de l'hôtel (moins de 200 mètres) ?",
    "هل يوجد سجادة صلاة في الغرفة؟":
      "Y a-t-il un tapis de prière dans la chambre ?",
    "هل يوجد مصحف في الغرفة؟": "Y a-t-il un Coran dans la chambre ?",

    // Transport and Parking Fields
    "هل توجد حافلة مجانية؟": "Y a-t-il un bus gratuit ?",
    "هل توجد حافلة تعمل 24 ساعة؟": "Y a-t-il un bus 24h/24 ?",
    "هل الحافلة مدفوعة؟": "Le bus est-il payant ?",
    "هل توجد حافلة أثناء أوقات الصلاة؟":
      "Y a-t-il un bus pendant les heures de prière ?",
    "تتوقف الحافلات في غزة أو عند النفق":
      "Les bus s'arrêtent à Gaza ou au tunnel",
    "هل يوجد موقف سيارات؟": "Y a-t-il un parking ?",
    "هل موقف السيارات مدفوع؟": "Le parking est-il payant ?",
    "هل موقف السيارات مجاني؟": "Le parking est-il gratuit ?",
    "هل موقف السيارات متاح أثناء أوقات الصلاة؟":
      "Le parking est-il disponible pendant les heures de prière ?",
    "هل يتوفر موقف للحافلات والفانات؟":
      "Y a-t-il un parking pour bus et fourgonnettes ?",
    "هل يوجد خدمة نقل بين مكة/المدينة والمطار في الفندق؟":
      "Y a-t-il un service de navette entre La Mecque/Médine et l'aéroport ?",

    // Hotel Facilities Fields
    سبا: "Spa",
    ساونا: "Sauna",
    "حمام تركي": "Hammam turc",
    "مركز لياقة بدنية": "Centre de fitness",
    مسبح: "Piscine",
    "كرسي تدليك": "Fauteuil de massage",
    "تدليك القدمين متوفر": "Massage des pieds disponible",
    "مركز أعمال": "Centre d'affaires",
    "هل يوجد روضة أطفال داخل الفندق؟": "Y a-t-il une garderie dans l'hôtel ?",
    "هل يتوفر واي فاي مجاني داخل الفندق؟":
      "Y a-t-il le Wi-Fi gratuit dans l'hôtel ?",
    "منطقة لتخزين الأمتعة": "Zone de stockage des bagages",
    "صالة رياضية": "Salle de sport",
    "منطقة مخصصة للتدخين": "Zone fumeurs",
    "خدمة غسيل الملابس": "Service de blanchisserie",
    "خدمة تحويل العملات": "Service de change",
    "التنظيف الجاف": "Nettoyage à sec",
    "قاعة اجتماعات": "Salle de réunion",
    "قاعة مؤتمرات": "Salle de conférence",
    "خدمة الفاكس وتصوير المستندات": "Service fax et photocopie",
    "مركز خدمات رجال الأعمال": "Centre de services aux entreprises",

    // Omra Services Fields
    "هل يوجد صالون حلاقة داخل الفندق؟":
      "Y a-t-il un salon de coiffure dans l'hôtel ?",
    "هل يوجد صالون حلاقة قريب من الفندق (أقل من 200 متر)؟":
      "Y a-t-il un salon de coiffure près de l'hôtel (moins de 200 mètres) ?",
    "حضانة أطفال متوفرة في الفندق": "Garderie disponible dans l'hôtel",
    "ما هو العمر الأدنى للأطفال للحصول على الإقامة المجانية؟":
      "Quel est l'âge minimum pour l'hébergement gratuit des enfants ?",

    // Restaurant and Cafe Fields
    "اسم المطعم الأول": "Nom du premier restaurant",
    "نوع المأكولات في المطعم الأول": "Type de cuisine du premier restaurant",
    "اسم المطعم الثاني": "Nom du deuxième restaurant",
    "نوع المأكولات في المطعم الثاني": "Type de cuisine du deuxième restaurant",
    "اسم المطعم الثالث": "Nom du troisième restaurant",
    "نوع المأكولات في المطعم الثالث": "Type de cuisine du troisième restaurant",
    "هل يقدم الفندق السحور والإفطار في رمضان؟":
      "L'hôtel sert-il le Suhoor et l'Iftar pendant le Ramadan ?",

    // Room Information Fields
    "اتجاه القبلة معروض في الغرفة":
      "Direction de la Qibla affichée dans la chambre",
    "هل يوجد غرف مناسبة للأشخاص ذوي الحركة المحدودة؟":
      "Y a-t-il des chambres adaptées aux personnes à mobilité réduite ?",
    "هل توجد أجنحة لـ 5 أشخاص في الفندق؟":
      "Y a-t-il des suites pour 5 personnes dans l'hôtel ?",
    "هل توجد غرف رباعية قياسية (4 أسرة) في الفندق؟":
      "Y a-t-il des chambres quadruples standard (4 lits) dans l'hôtel ?",
    "هل توجد غرف متصلة في الفندق؟":
      "Y a-t-il des chambres communicantes dans l'hôtel ?",
    "هل يوجد حوض غسيل منخفض مناسب للأشخاص ذوي الحركة المحدودة؟":
      "Y a-t-il un lavabo bas adapté aux personnes à mobilité réduite ?",
    "كم عدد الحمامات؟": "Combien de salles de bain ?",
    "هل يوجد زاوية مطبخ في الغرف؟":
      "Y a-t-il un coin cuisine dans les chambres ?",
    "هل يوجد ثلاجة في الغرف؟": "Y a-t-il un réfrigérateur dans les chambres ?",
    "هل يتوفر مجفف شعر في الحمام؟":
      "Y a-t-il un sèche-cheveux dans la salle de bain ?",
    "هل يوجد خزنة داخل الغرف؟": "Y a-t-il un coffre-fort dans les chambres ?",
    "هل يوجد آلة صنع القهوة؟": "Y a-t-il une machine à café ?",

    // Room type dynamic patterns
    النوع: "Type",
    "معلومات الغرفة/الجناح": "Informations chambre/suite",
    "ما نوع الغرفة؟ (غرفة أو جناح)":
      "Quel type de chambre ? (chambre ou suite)",
    "إذا كان جناحًا، كم عدد الغرف فيه؟":
      "Si c'est une suite, combien de chambres ?",
    "ما نوع الإطلالة؟": "Quel type de vue ?",
    "كم عدد الأشخاص الذين يمكن أن يشغلوا هذه الغرفة أو الجناح؟":
      "Combien de personnes peuvent occuper cette chambre ou suite ?",
    "ما مساحة الغرفة؟": "Quelle est la superficie de la chambre ?",
    "نوع السرير": "Type de lit",
    "فئة الغرفة": "Catégorie de chambre",
    "ما عدد الأسرة في الغرفة؟": "Combien de lits dans la chambre ?",
    "ما عرض السرير؟": "Quelle est la largeur du lit ?",
    "هل توجد سجادة صلاة، قرآن كريم، واتجاه القبلة معروض في الغرفة؟":
      "Y a-t-il un tapis de prière, un Coran et la direction de la Qibla dans la chambre ?",
  };

  const translateFieldName = (fieldName) => {
  // Direct translation if exists
  if (translationMap[fieldName]) {
    return translationMap[fieldName];
  }
  
  // Handle dynamic room type fields
  const roomTypePattern = /^النوع (\d+) - (.+)$/;
  const match = fieldName.match(roomTypePattern);
  
  if (match) {
    const typeNumber = match[1];
    const fieldPart = match[2];
    const translatedFieldPart = translationMap[fieldPart] || fieldPart;
    return `Type ${typeNumber} - ${translatedFieldPart}`;
  }
  
  // Return original if no translation found
  return fieldName;
};

const translateCategoryName = (categoryName) => {
  // Direct translation if exists
  if (translationMap[categoryName]) {
    return translationMap[categoryName];
  }
  
  // Handle dynamic room type categories
  const roomTypeCategoryPattern = /^النوع (\d+) - (.+)$/;
  const match = categoryName.match(roomTypeCategoryPattern);
  
  if (match) {
    const typeNumber = match[1];
    const categoryPart = match[2];
    const translatedCategoryPart = translationMap[categoryPart] || categoryPart;
    return `Type ${typeNumber} - ${translatedCategoryPart}`;
  }
  
  return categoryName;
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
          `النوع ${i} - نوع السرير`,
          `النوع ${i} - فئة الغرفة`,
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

  // Replace the entire exporterVersExcel function with this:
  const exporterVersExcel = () => {
  if (!hotelSelectionne) {
    alert("يرجى اختيار فندق أولاً!");
    return;
  }

  const donneesHotelSelectionne = hotels.find(h => h.id === hotelSelectionne);
  const wb = XLSX.utils.book_new();
  
  const data = [];

  // Header
  data.push([translationMap['تفاصيل الفندق'], '']);
  data.push(['', '']);
  data.push([translationMap['اسم الفندق'], donneesHotelSelectionne?.name || '']);
  data.push(['', '']);

  // Process categories
  const allCategories = {
    ...categoriesChamps,
    ...generateRoomTypeCategories()
  };

  Object.entries(allCategories).forEach(([categoryName, categoryData]) => {
    if (categoryName === "أنواع الغرف والأجنحة") return;

    // Category header with translation
    const translatedCategoryName = translateCategoryName(categoryName);
    data.push([`=== ${translatedCategoryName} ===`, '']);
    data.push([translationMap['الحقل'], translationMap['القيمة']]);

    // Category fields
    categoryData.fields.forEach(field => {
      const value = donneesActuelles[field] || "";
      const translatedFieldName = translateFieldName(field);
      data.push([
        translatedFieldName,
        value || translationMap['غير مكتمل']
      ]);
    });

    data.push(['', '']); // Empty row
  });

  // Custom fields
  if (champsPersonnalises.length > 0) {
    data.push([`=== ${translationMap['الحقول المخصصة']} ===`, '']);
    data.push([translationMap['الحقل'], translationMap['القيمة']]);

    champsPersonnalises.forEach(field => {
      const value = donneesActuelles[field] || "";
      // For custom fields, we translate if available, otherwise keep original
      const translatedFieldName = translationMap[field] || field;
      data.push([
        translatedFieldName,
        value || translationMap['غير مكتمل']
      ]);
    });
  }

  // Create worksheet from array
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  ws['!cols'] = [
    { width: 50 }, // Column A - Field name (wider for French text)
    { width: 30 }  // Column B - Value
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Données hôtel");
  XLSX.writeFile(wb, `${donneesHotelSelectionne?.name.replace(/[^a-zA-Z0-9]/g, "_")}_donnees_detaillees.xlsx`);
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
                        {champsAAfficher.map((champ) => {
                          const isBedTypeField = champ.includes("نوع السرير");
                          const isRoomCategoryField =
                            champ.includes("فئة الغرفة");

                          return (
                            <div key={champ} className="space-y-2">
                              <label className="block text-gray-800 text-sm font-semibold">
                                {champ}
                                {!donneesActuelles[champ]?.trim() && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </label>
                              {isBedTypeField ? (
                                <select
                                  value={donneesActuelles[champ] || ""}
                                  onChange={(e) =>
                                    gererChangementChamp(champ, e.target.value)
                                  }
                                  className="w-full p-3 rounded-lg bg-gray-50 border-2 border-yellow-400 text-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                                  onFocus={() => setChampEnCoursEdition(champ)}
                                  onBlur={() => setChampEnCoursEdition("")}
                                  data-field={champ}
                                >
                                  {bedTypeOptions.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              ) : isRoomCategoryField ? (
                                <select
                                  value={donneesActuelles[champ] || ""}
                                  onChange={(e) =>
                                    gererChangementChamp(champ, e.target.value)
                                  }
                                  className="w-full p-3 rounded-lg bg-gray-50 border-2 border-yellow-400 text-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                                  onFocus={() => setChampEnCoursEdition(champ)}
                                  onBlur={() => setChampEnCoursEdition("")}
                                  data-field={champ}
                                >
                                  {roomCategoryOptions.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              ) : (
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
                              )}
                            </div>
                          );
                        })}
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
