import type { Language } from '@/types';

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
];

type TranslationKey =
  | 'appName'
  | 'tagline'
  | 'landingSubtitle'
  | 'imFarmer'
  | 'imDriver'
  | 'signIn'
  | 'signUp'
  | 'signOut'
  | 'farmerPortal'
  | 'driverPortal'
  | 'farmerSubtitle'
  | 'driverSubtitle'
  | 'farmerId'
  | 'driverId'
  | 'password'
  | 'confirmPassword'
  | 'fullName'
  | 'mobileNumber'
  | 'village'
  | 'district'
  | 'state'
  | 'farmLocation'
  | 'cropType'
  | 'cropQuantity'
  | 'preferredMandi'
  | 'sendVerificationCode'
  | 'verifyAndCreate'
  | 'demoVerificationCode'
  | 'enterCode'
  | 'accountCreated'
  | 'saveId'
  | 'welcome'
  | 'profile'
  | 'logout'
  | 'myCrop'
  | 'findTransport'
  | 'findBestVehicle'
  | 'bestMatch'
  | 'otherMatches'
  | 'viewAllMatches'
  | 'matchScore'
  | 'whyThisVehicle'
  | 'requestVehicle'
  | 'confirmRequest'
  | 'requestSent'
  | 'waitingForDriver'
  | 'editCropDetails'
  | 'available'
  | 'unavailable'
  | 'acceptLoad'
  | 'viewMore'
  | 'activeTrip'
  | 'startTrip'
  | 'tripStarted'
  | 'bestFarmerMatch'
  | 'whyThisMatch'
  | 'useMyLocation'
  | 'locationDenied'
  | 'home'
  | 'myRequest'
  | 'bestMatches'
  | 'myTrip'
  | 'vehicle'
  | 'vehicleNo'
  | 'route'
  | 'emptyCapacity'
  | 'status'
  | 'pickup'
  | 'destination'
  | 'load'
  | 'capacity'
  | 'remainingCapacity'
  | 'reducePostHarvestLoss'
  | 'useEmptyCapacity'
  | 'affordableTransport'
  | 'stopEmptyTrips'
  | 'landingHeroSubtitle'
  | 'farmerFlow'
  | 'smartMatching'
  | 'emptyVehicle'
  | 'localMandi'
  | 'back'
  | 'cancel'
  | 'sendRequest'
  | 'requestConfirmation'
  | 'trip'
  | 'crop'
  | 'quantity'
  | 'refrigerated'
  | 'kmAway'
  | 'kgAvailable'
  | 'noMatchesFound'
  | 'noActiveTrip'
  | 'noRequests'
  | 'demoData'
  | 'forgotPassword'
  | 'vehicleType'
  | 'vehicleCapacity'
  | 'refrigerationType'
  | 'currentDistrict'
  | 'currentLocation'
  | 'typicalRoute'
  | 'availableForLoads'
  | 'matchConfirmed'
  | 'requestAccepted'
  | 'farmer'
  | 'driver'
  | 'language'
  | 'selectVillageManually';

type Translations = Record<TranslationKey, string>;

const en: Translations = {
  appName: 'ColdLeg',
  tagline: 'Post-Harvest Loss Prevention via Micro-Logistics Matching',
  landingSubtitle: 'Find nearby refrigerated transport. Reduce food loss. Reach your local mandi.',
  imFarmer: "I'm a Farmer",
  imDriver: "I'm a Driver",
  signIn: 'Sign In',
  signUp: 'Sign Up',
  signOut: 'Sign Out',
  farmerPortal: 'Farmer Portal',
  driverPortal: 'Driver Portal',
  farmerSubtitle: 'Connect your crop with nearby refrigerated transport.',
  driverSubtitle: 'Earn from your empty return journey.',
  farmerId: 'Farmer ID',
  driverId: 'Driver ID',
  password: 'Password',
  confirmPassword: 'Confirm Password',
  fullName: 'Full Name',
  mobileNumber: 'Mobile Number',
  village: 'Village',
  district: 'District',
  state: 'State',
  farmLocation: 'Farm Location',
  cropType: 'Crop Type',
  cropQuantity: 'Approximate Crop Quantity (kg)',
  preferredMandi: 'Preferred Mandi',
  sendVerificationCode: 'Send Verification Code',
  verifyAndCreate: 'Verify & Create Account',
  demoVerificationCode: 'Demo verification code',
  enterCode: 'Enter Verification Code',
  accountCreated: 'Account Created Successfully',
  saveId: 'Save this ID for future login.',
  welcome: 'Welcome',
  profile: 'Profile',
  logout: 'Logout',
  myCrop: 'My Crop',
  findTransport: 'Find Refrigerated Transport',
  findBestVehicle: 'Find Best Vehicle',
  bestMatch: 'BEST MATCH',
  otherMatches: 'Other Matches',
  viewAllMatches: 'View All Matches',
  matchScore: 'Match Score',
  whyThisVehicle: 'Why this vehicle?',
  requestVehicle: 'Request Vehicle',
  confirmRequest: 'Confirm Request',
  requestSent: 'Request Sent',
  waitingForDriver: 'Waiting for Driver',
  editCropDetails: 'Edit Crop Details',
  available: 'Available',
  unavailable: 'Unavailable',
  acceptLoad: 'Accept Load',
  viewMore: 'View More',
  activeTrip: 'Active Trip',
  startTrip: 'Start Trip',
  tripStarted: 'Trip Started',
  bestFarmerMatch: 'Best Farmer Match',
  whyThisMatch: 'Why this match?',
  useMyLocation: 'Use My Location',
  locationDenied: 'Location permission was not available. Please select your village manually.',
  home: 'Home',
  myRequest: 'My Request',
  bestMatches: 'Best Matches',
  myTrip: 'My Trip',
  vehicle: 'Vehicle',
  vehicleNo: 'Vehicle No',
  route: 'Route',
  emptyCapacity: 'Empty Capacity',
  status: 'Status',
  pickup: 'Pickup',
  destination: 'Destination',
  load: 'Load',
  capacity: 'Capacity',
  remainingCapacity: 'Remaining Capacity',
  reducePostHarvestLoss: 'Reduce Post-Harvest Loss',
  useEmptyCapacity: 'Use Existing Empty Capacity',
  affordableTransport: 'Affordable Local Transport',
  stopEmptyTrips: 'Stop Empty Trips. Save Fresh Produce.',
  landingHeroSubtitle: 'ColdLeg matches small farmers with refrigerated vehicles returning with unused capacity.',
  farmerFlow: 'FARMER',
  smartMatching: 'SMART MATCHING',
  emptyVehicle: 'EMPTY RETURN VEHICLE',
  localMandi: 'LOCAL MANDI',
  back: 'Back',
  cancel: 'Cancel',
  sendRequest: 'Send Request',
  requestConfirmation: 'Send transport request to',
  trip: 'Trip',
  crop: 'Crop',
  quantity: 'Quantity',
  refrigerated: 'Refrigerated',
  kmAway: 'km away',
  kgAvailable: 'kg available',
  noMatchesFound: 'No matching vehicles found. Try adjusting your crop details.',
  noActiveTrip: 'No active trip yet. Accept a farmer load to start.',
  noRequests: 'No transport requests yet.',
  demoData: 'Demo Data',
  forgotPassword: 'Forgot Password?',
  vehicleType: 'Vehicle Type',
  vehicleCapacity: 'Vehicle Capacity (kg)',
  refrigerationType: 'Vehicle Refrigeration Type',
  currentDistrict: 'Current District',
  currentLocation: 'Current Location',
  typicalRoute: 'Typical Route',
  availableForLoads: 'Available for Farmer Loads',
  matchConfirmed: 'Match Confirmed',
  requestAccepted: 'Request Accepted',
  farmer: 'Farmer',
  driver: 'Driver',
  language: 'Language',
  selectVillageManually: 'Please select your village manually.',
};

const pa: Translations = {
  appName: 'ਕਿਸਾਨ ਕੋਲਡ ਕਨੈਕਟ',
  tagline: 'ਵਾਢੀ ਤੋਂ ਬਾਅਦ ਦਾ ਨੁਕਸਾਨ ਰੋਕਣ ਲਈ ਮਾਈਕ੍ਰੋ-ਲੌਜਿਸਟਿਕਸ ਮੈਚਿੰਗ',
  landingSubtitle: 'ਨੇੜੇ ਦੇ ਰੈਫਰੀਜਰੇਟਡ ਟ੍ਰਾਂਸਪੋਰਟ ਲੱਭੋ। ਭੋਜਨ ਦਾ ਨੁਕਸਾਨ ਘਟਾਓ। ਆਪਣੇ ਸਥਾਨਕ ਮੰਡੀ ਤੱਕ ਪਹੁੰਚੋ।',
  imFarmer: 'ਮੈਂ ਕਿਸਾਨ ਹਾਂ',
  imDriver: 'ਮੈਂ ਡਰਾਈਵਰ ਹਾਂ',
  signIn: 'ਸਾਈਨ ਇਨ',
  signUp: 'ਸਾਈਨ ਅੱਪ',
  signOut: 'ਸਾਈਨ ਆਊਟ',
  farmerPortal: 'ਕਿਸਾਨ ਪੋਰਟਲ',
  driverPortal: 'ਡਰਾਈਵਰ ਪੋਰਟਲ',
  farmerSubtitle: 'ਆਪਣੀ ਫਸਲ ਨੂੰ ਨੇੜੇ ਦੇ ਰੈਫਰੀਜਰੇਟਡ ਟ੍ਰਾਂਸਪੋਰਟ ਨਾਲ ਜੋੜੋ।',
  driverSubtitle: 'ਆਪਣੀ ਖਾਲੀ ਵਾਪਸੀ ਯਾਤਰਾ ਤੋਂ ਕਮਾਓ।',
  farmerId: 'ਕਿਸਾਨ ID',
  driverId: 'ਡਰਾਈਵਰ ID',
  password: 'ਪਾਸਵਰਡ',
  confirmPassword: 'ਪਾਸਵਰਡ ਪੁਸ਼ਟੀ ਕਰੋ',
  fullName: 'ਪੂਰਾ ਨਾਮ',
  mobileNumber: 'ਮੋਬਾਈਲ ਨੰਬਰ',
  village: 'ਪਿੰਡ',
  district: 'ਜ਼ਿਲ੍ਹਾ',
  state: 'ਰਾਜ',
  farmLocation: 'ਖੇਤ ਦਾ ਟਿਕਾਣਾ',
  cropType: 'ਫਸਲ ਦੀ ਕਿਸਮ',
  cropQuantity: 'ਅੰਦਾਜ਼ਨ ਫਸਲ ਮਾਤਰਾ (kg)',
  preferredMandi: 'ਤਰਜੀਹੀ ਮੰਡੀ',
  sendVerificationCode: 'ਪੁਸ਼ਟੀ ਕੋਡ ਭੇਜੋ',
  verifyAndCreate: 'ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਖਾਤਾ ਬਣਾਓ',
  demoVerificationCode: 'ਡੈਮੋ ਪੁਸ਼ਟੀ ਕੋਡ',
  enterCode: 'ਪੁਸ਼ਟੀ ਕੋਡ ਦਾਖਲ ਕਰੋ',
  accountCreated: 'ਖਾਤਾ ਸਫਲਤਾਪੂਰਵਕ ਬਣਾਇਆ ਗਿਆ',
  saveId: 'ਭਵਿੱਖ ਵਿੱਚ ਲੌਗਇਨ ਲਈ ਇਸ ID ਨੂੰ ਸੰਭਾਲੋ।',
  welcome: 'ਜੀ ਆਇਆਂ ਨੂੰ',
  profile: 'ਪ੍ਰੋਫਾਈਲ',
  logout: 'ਲੌਗਆਊਟ',
  myCrop: 'ਮੇਰੀ ਫਸਲ',
  findTransport: 'ਰੈਫਰੀਜਰੇਟਡ ਟ੍ਰਾਂਸਪੋਰਟ ਲੱਭੋ',
  findBestVehicle: 'ਸਭ ਤੋਂ ਵਧੀਆ ਵਾਹਨ ਲੱਭੋ',
  bestMatch: 'ਸਭ ਤੋਂ ਵਧੀਆ ਮੈਚ',
  otherMatches: 'ਹੋਰ ਮੈਚ',
  viewAllMatches: 'ਸਾਰੇ ਮੈਚ ਵੇਖੋ',
  matchScore: 'ਮੈਚ ਸਕੋਰ',
  whyThisVehicle: 'ਇਹ ਵਾਹਨ ਕਿਉਂ?',
  requestVehicle: 'ਵਾਹਨ ਲਈ ਬੇਨਤੀ ਕਰੋ',
  confirmRequest: 'ਬੇਨਤੀ ਪੁਸ਼ਟੀ ਕਰੋ',
  requestSent: 'ਬੇਨਤੀ ਭੇਜੀ ਗਈ',
  waitingForDriver: 'ਡਰਾਈਵਰ ਦੀ ਉਡੀਕ ਵਿੱਚ',
  editCropDetails: 'ਫਸਲ ਵੇਰਵੇ ਸੋਧੋ',
  available: 'ਉਪਲਬਧ',
  unavailable: 'ਅਣਉਪਲਬਧ',
  acceptLoad: 'ਲੋਡ ਸਵੀਕਾਰ ਕਰੋ',
  viewMore: 'ਹੋਰ ਵੇਖੋ',
  activeTrip: 'ਸਰਗਰਮ ਯਾਤਰਾ',
  startTrip: 'ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ',
  tripStarted: 'ਯਾਤਰਾ ਸ਼ੁਰੂ ਹੋਈ',
  bestFarmerMatch: 'ਸਭ ਤੋਂ ਵਧੀਆ ਕਿਸਾਨ ਮੈਚ',
  whyThisMatch: 'ਇਹ ਮੈਚ ਕਿਉਂ?',
  useMyLocation: 'ਮੇਰਾ ਟਿਕਾਣਾ ਵਰਤੋ',
  locationDenied: 'ਟਿਕਾਣੇ ਦੀ ਇਜਾਜਤ ਉਪਲਬਧ ਨਹੀਂ ਸੀ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਪਿੰਡ ਆਪ ਚੁਣੋ।',
  home: 'ਘਰ',
  myRequest: 'ਮੇਰੀ ਬੇਨਤੀ',
  bestMatches: 'ਵਧੀਆ ਮੈਚ',
  myTrip: 'ਮੇਰੀ ਯਾਤਰਾ',
  vehicle: 'ਵਾਹਨ',
  vehicleNo: 'ਵਾਹਨ ਨੰਬਰ',
  route: 'ਰਸਤਾ',
  emptyCapacity: 'ਖਾਲੀ ਸਮਰੱਥਾ',
  status: 'ਸਥਿਤੀ',
  pickup: 'ਚੁੱਕਣ ਦੀ ਥਾਂ',
  destination: 'ਮੰਜ਼ਿਲ',
  load: 'ਲੋਡ',
  capacity: 'ਸਮਰੱਥਾ',
  remainingCapacity: 'ਬਾਕੀ ਸਮਰੱਥਾ',
  reducePostHarvestLoss: 'ਵਾਢੀ ਤੋਂ ਬਾਅਦ ਦਾ ਨੁਕਸਾਨ ਘਟਾਓ',
  useEmptyCapacity: 'ਮੌਜੂਦਾ ਖਾਲੀ ਸਮਰੱਥਾ ਵਰਤੋ',
  affordableTransport: 'ਸਸਤਾ ਸਥਾਨਕ ਟ੍ਰਾਂਸਪੋਰਟ',
  stopEmptyTrips: 'ਖਾਲੀ ਯਾਤਰਾਵਾਂ ਰੋਕੋ। ਤਾਜ਼ੀ ਪੈਦਾਵਾਰ ਬਚਾਓ।',
  landingHeroSubtitle: 'ਕਿਸਾਨ ਕੋਲਡ ਕਨੈਕਟ ਛੋਟੇ ਕਿਸਾਨਾਂ ਨੂੰ ਅਣਵਰਤੀ ਸਮਰੱਥਾ ਨਾਲ ਵਾਪਸ ਆ ਰਹੇ ਰੈਫਰੀਜਰੇਟਡ ਵਾਹਨਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।',
  farmerFlow: 'ਕਿਸਾਨ',
  smartMatching: 'ਸਮਾਰਟ ਮੈਚਿੰਗ',
  emptyVehicle: 'ਖਾਲੀ ਵਾਪਸੀ ਵਾਹਨ',
  localMandi: 'ਸਥਾਨਕ ਮੰਡੀ',
  back: 'ਵਾਪਸ',
  cancel: 'ਰੱਦ ਕਰੋ',
  sendRequest: 'ਬੇਨਤੀ ਭੇਜੋ',
  requestConfirmation: 'ਟ੍ਰਾਂਸਪੋਰਟ ਬੇਨਤੀ ਭੇਜੋ',
  trip: 'ਯਾਤਰਾ',
  crop: 'ਫਸਲ',
  quantity: 'ਮਾਤਰਾ',
  refrigerated: 'ਰੈਫਰੀਜਰੇਟਡ',
  kmAway: 'ਕਿਲੋਮੀਟਰ ਦੂਰ',
  kgAvailable: 'kg ਉਪਲਬਧ',
  noMatchesFound: 'ਕੋਈ ਮੇਲ ਖਾਂਦਾ ਵਾਹਨ ਨਹੀਂ ਲੱਭਿਆ। ਆਪਣੀ ਫਸਲ ਦੇ ਵੇਰਵੇ ਬਦਲ ਕੇ ਦੇਖੋ।',
  noActiveTrip: 'ਕੋਈ ਸਰਗਰਮ ਯਾਤਰਾ ਨਹੀਂ। ਕਿਸਾਨ ਦਾ ਲੋਡ ਸਵੀਕਾਰ ਕਰਕੇ ਸ਼ੁਰੂ ਕਰੋ।',
  noRequests: 'ਅਜੇ ਤੱਕ ਕੋਈ ਟ੍ਰਾਂਸਪੋਰਟ ਬੇਨਤੀ ਨਹੀਂ।',
  demoData: 'ਡੈਮੋ ਡੇਟਾ',
  forgotPassword: 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
  vehicleType: 'ਵਾਹਨ ਦੀ ਕਿਸਮ',
  vehicleCapacity: 'ਵਾਹਨ ਸਮਰੱਥਾ (kg)',
  refrigerationType: 'ਵਾਹਨ ਰੈਫਰੀਜਰੇਸ਼ਨ ਕਿਸਮ',
  currentDistrict: 'ਮੌਜੂਦਾ ਜ਼ਿਲ੍ਹਾ',
  currentLocation: 'ਮੌਜੂਦਾ ਟਿਕਾਣਾ',
  typicalRoute: 'ਆਮ ਰਸਤਾ',
  availableForLoads: 'ਕਿਸਾਨ ਲੋਡ ਲਈ ਉਪਲਬਧ',
  matchConfirmed: 'ਮੈਚ ਪੁਸ਼ਟੀ ਹੋਈ',
  requestAccepted: 'ਬੇਨਤੀ ਸਵੀਕਾਰ ਹੋਈ',
  farmer: 'ਕਿਸਾਨ',
  driver: 'ਡਰਾਈਵਰ',
  language: 'ਭਾਸ਼ਾ',
  selectVillageManually: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਪਿੰਡ ਆਪ ਚੁਣੋ।',
};

const hi: Translations = {
  appName: 'किसान कोल्ड कनेक्ट',
  tagline: 'कटाई के बाद के नुकसान को रोकने हेतु माइक्रो-लॉजिस्टिक्स मैचिंग',
  landingSubtitle: 'नजदीकी रेफ्रिजरेटेड ट्रांसपोर्ट खोजें। खाद्य हानि कम करें। अपने स्थानीय मंडी तक पहुंचें।',
  imFarmer: 'मैं किसान हूं',
  imDriver: 'मैं ड्राइवर हूं',
  signIn: 'साइन इन',
  signUp: 'साइन अप',
  signOut: 'साइन आउट',
  farmerPortal: 'किसान पोर्टल',
  driverPortal: 'ड्राइवर पोर्टल',
  farmerSubtitle: 'अपनी फसल को नजदीकी रेफ्रिजरेटेड ट्रांसपोर्ट से जोड़ें।',
  driverSubtitle: 'अपनी खाली वापसी यात्रा से कमाएं।',
  farmerId: 'किसान ID',
  driverId: 'ड्राइवर ID',
  password: 'पासवर्ड',
  confirmPassword: 'पासवर्ड की पुष्टि करें',
  fullName: 'पूरा नाम',
  mobileNumber: 'मोबाइल नंबर',
  village: 'गांव',
  district: 'जिला',
  state: 'राज्य',
  farmLocation: 'खेत का स्थान',
  cropType: 'फसल का प्रकार',
  cropQuantity: 'अनुमानित फसल मात्रा (kg)',
  preferredMandi: 'पसंदीदा मंडी',
  sendVerificationCode: 'पुष्टि कोड भेजें',
  verifyAndCreate: 'पुष्टि करें और खाता बनाएं',
  demoVerificationCode: 'डेमो पुष्टि कोड',
  enterCode: 'पुष्टि कोड दर्ज करें',
  accountCreated: 'खाता सफलतापूर्वक बनाया गया',
  saveId: 'भविष्य में लॉगिन के लिए इस ID को सहेजें।',
  welcome: 'स्वागत है',
  profile: 'प्रोफाइल',
  logout: 'लॉगआउट',
  myCrop: 'मेरी फसल',
  findTransport: 'रेफ्रिजरेटेड ट्रांसपोर्ट खोजें',
  findBestVehicle: 'सर्वश्रेष्ठ वाहन खोजें',
  bestMatch: 'सर्वश्रेष्ठ मैच',
  otherMatches: 'अन्य मैच',
  viewAllMatches: 'सभी मैच देखें',
  matchScore: 'मैच स्कोर',
  whyThisVehicle: 'यह वाहन क्यों?',
  requestVehicle: 'वाहन अनुरोध करें',
  confirmRequest: 'अनुरोध की पुष्टि करें',
  requestSent: 'अनुरोध भेजा गया',
  waitingForDriver: 'ड्राइवर की प्रतीक्षा में',
  editCropDetails: 'फसल विवरण संपादित करें',
  available: 'उपलब्ध',
  unavailable: 'अनुपलब्ध',
  acceptLoad: 'लोड स्वीकार करें',
  viewMore: 'और देखें',
  activeTrip: 'सक्रिय यात्रा',
  startTrip: 'यात्रा शुरू करें',
  tripStarted: 'यात्रा शुरू हुई',
  bestFarmerMatch: 'सर्वश्रेष्ठ किसान मैच',
  whyThisMatch: 'यह मैच क्यों?',
  useMyLocation: 'मेरा स्थान उपयोग करें',
  locationDenied: 'स्थान अनुमति उपलब्ध नहीं थी। कृपया अपना गांव स्वयं चुनें।',
  home: 'होम',
  myRequest: 'मेरा अनुरोध',
  bestMatches: 'सर्वश्रेष्ठ मैच',
  myTrip: 'मेरी यात्रा',
  vehicle: 'वाहन',
  vehicleNo: 'वाहन नंबर',
  route: 'मार्ग',
  emptyCapacity: 'खाली क्षमता',
  status: 'स्थिति',
  pickup: 'पिकअप',
  destination: 'गंतव्य',
  load: 'लोड',
  capacity: 'क्षमता',
  remainingCapacity: 'शेष क्षमता',
  reducePostHarvestLoss: 'कटाई के बाद का नुकसान कम करें',
  useEmptyCapacity: 'मौजूदा खाली क्षमता उपयोग करें',
  affordableTransport: 'किफायती स्थानीय ट्रांसपोर्ट',
  stopEmptyTrips: 'खाली यात्राएं रोकें। ताजा उपज बचाएं।',
  landingHeroSubtitle: 'किसान कोल्ड कनेक्ट छोटे किसानों को अप्रयुक्त क्षमता के साथ लौट रहे रेफ्रिजरेटेड वाहनों से मिलाता है।',
  farmerFlow: 'किसान',
  smartMatching: 'स्मार्ट मैचिंग',
  emptyVehicle: 'खाली वापसी वाहन',
  localMandi: 'स्थानीय मंडी',
  back: 'वापस',
  cancel: 'रद्द करें',
  sendRequest: 'अनुरोध भेजें',
  requestConfirmation: 'ट्रांसपोर्ट अनुरोध भेजें',
  trip: 'यात्रा',
  crop: 'फसल',
  quantity: 'मात्रा',
  refrigerated: 'रेफ्रिजरेटेड',
  kmAway: 'किलोमीटर दूर',
  kgAvailable: 'kg उपलब्ध',
  noMatchesFound: 'कोई मेल खाता वाहन नहीं मिला। अपनी फसल विवरण बदलकर देखें।',
  noActiveTrip: 'कोई सक्रिय यात्रा नहीं। किसान का लोड स्वीकार करके शुरू करें।',
  noRequests: 'अभी तक कोई ट्रांसपोर्ट अनुरोध नहीं।',
  demoData: 'डेमो डेटा',
  forgotPassword: 'पासवर्ड भूल गए?',
  vehicleType: 'वाहन प्रकार',
  vehicleCapacity: 'वाहन क्षमता (kg)',
  refrigerationType: 'वाहन रेफ्रिजरेशन प्रकार',
  currentDistrict: 'वर्तमान जिला',
  currentLocation: 'वर्तमान स्थान',
  typicalRoute: 'सामान्य मार्ग',
  availableForLoads: 'किसान लोड के लिए उपलब्ध',
  matchConfirmed: 'मैच की पुष्टि हुई',
  requestAccepted: 'अनुरोध स्वीकार हुआ',
  farmer: 'किसान',
  driver: 'ड्राइवर',
  language: 'भाषा',
  selectVillageManually: 'कृपया अपना गांव स्वयं चुनें।',
};

const translations: Record<Language, Translations> = { en, pa, hi };

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}

export type { TranslationKey };
