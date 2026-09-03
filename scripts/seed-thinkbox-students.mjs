import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });

const studentNames = [
  'Nnanna Paschal Uchechukwuoji', 'Ezebuiro Chihurumnanya Glorious', 'Chigbu Emmanuel Chibuzor', 'Nwabuko Somtochukwu Malcolm', 'Torty Chimezie Jeremy', 'Alloy Champion Ekeoma', 'Uchegbu Paul Chukwuoma', 'Inwauju Ikenna', 'Ojimma Emmanuel Izuchukwu', 'Ukanwa Ezinne Fortune', 'Cornelius Emmanuel Chigozirim', 'Nwaogbo Maxwell Chidera', 'Chima Chipuruime Levi',
  'Zirkushu Daniel Biyama', 'Mohammed Bashir Garba', 'Ibrahim Muhammad Hamid', 'Yakubu Shadrach', 'Kadakufo Weyopwa Moye', 'Jaafar Aminu', 'Haliru Nafarasu Pakchama', 'Kumbo Aaron Anthony', 'Musa Habib Haruna', 'Ngida Joshua', 'Bulama David Barka', 'Stephen Isinga Cyprian', 'Kefas Isaac',
  'Udoumo Champion Awasiubong', 'Udounwa Abasiofon Effiong', 'Ikoh Paul Ezekiel', 'Samuel Fortune Mbaka', 'Edet Nsentip Godwin', 'Moses Abraham Uduak', 'Eka Jefferson Kenny', 'Edet Edima Michael', 'Anthony Sage Osuiniabasi', 'Akpan Bright Unwana', 'Imoh Rhema Imoh', 'Iniunam Edo Aniefiok', 'Kufre Precious Ndiyo',
  'Egwudike Chukwuemeka', 'Madueke Chidubem', 'Muodebelu Victor Onyedikachi', 'Azubuko Akachukwu Henry', 'Onwubualili Victor Uchenna', 'Okonkwo Victor Osidi', 'Muogbo Chibuzo Nelson-Paul', 'Nnefe Emmanuel', 'Allison Chukwuemeka Wale', 'Nwakonobi Victor Ikemefuna', 'Onwuzulike Ifechukwu Joseph', 'Onuegbu Samuel Chinonso', 'Okeke Justice Chidozie',
  'Salihu Sani', 'Muktar Ahmad Muntaka', 'Haruna Kamal', 'Minighom Daniel', 'Mohammed Abdulaziz', 'Ibrahim Mahmoud Hamza', 'Mohammed Muhammadu Ibrahim', 'Madaki Muhammad Gidado', 'Ibrahim Al-Amin Shehu', 'Gowon Chongkeny Gideon', 'Turaki Muhammad Aliyu', 'Abubakar Abdulhamid Auwal', 'Ahmad Almustapha Baba',
  'Ogboke Gideon Woyengilayefa', 'Ebizimor Blessing James', 'Buseni Daniel Oyinkro', 'Gabriel Lucky', 'Gita Ebipade Ziboumor', 'Peredei Greatness Ebedaowei', 'William Ebikonbe-Ere', 'Ayeni Victor Biobelemoye', 'Gagariga Daniel', 'Odoko Blessing Tarila', 'Angagha-Pere Perearedei Joseph', 'Dematiede Pristine Ebimobowei', 'Nawerebogha Progress',
  'Uvandeamo Alison Aondosoo', 'Baba David', 'Edoh Godwin Ochowechi', 'Onoja Israel', 'Ikyoor Emmanuel Terzungwe', 'Simon Oloche Francis', 'Ali Abubakar Sultan', 'Michael Samson', 'Oche Angel Maria', 'Tyokumba Derick Terungwa', 'Er Samuel Ka-Aondo', 'Orfega Terungwa Emmanuel', 'Monday Nathaniel Oche',
  'Iliyasu Marzuq Nakaka', 'Yidawi Elnathan Irimiya', 'Bulama Inzinah', 'Mustapha Ibrahim Ahmed', 'Muhammad Ibrahim Abba', 'Yakubu Usman Yahaya', 'Hammawa Muhammed Jasini', 'Julius Hyelapamduwa Jeremiah', 'Baba Muhammad Sadiq', 'Baba Annur Muhammad', 'Ishaku Moses', 'Adamu Al-Amin Yahaya', 'Maina Abba Musa',
  'Israel Uriel Igelle', 'Utsu Francis Unimdebeshi', 'Praise Miracle Osowojuameshua', 'Ogar Victor Damilare', 'Amama Favour Aganyi', 'Odey Paul', 'Egor Francis Elias', 'Odey Elizabeth', 'Inawo Matthew Inawo', 'Agbor Prince Chigozirim', 'Obona Sifune Godswill', 'Digberen Glory Odianosen', 'Odidi Andrew Okate',
  'Oputaajie Ifechukwudeni Awesome', 'Ahon Carlin Oghenekaro', 'Okafor Victor Ogochukwu', 'Williams Henry Efetobori', 'Isaac Paul Oluwatitofunmi', 'Udumebraye Oghenemine Michael', 'Ozofere Favour Ovie', 'Stanley Marvellous Timipre', 'Akokono Ighozino Oluwatosin', 'Sekegor Oghenetega Joshua', 'Okonji Emmanuel Ikechukwu', 'Godwin Desmond', 'Anwuzia Fulfillment Chukwubuikem',
  'Awoke Greatness Chidera', 'Igwe Godwill Chukwudindu', 'Ukpai Godwin Chuwkwuma', 'Okereke Chisom Christopher', 'Obasi Prince Dennis', 'Vincent Chinenye Gift', 'Nwenyim Joshua Akam', 'Ibe Lucky Donatus', 'Onu Nmesoma Ruth', 'Otu Augustine Omeri', 'James Nnamdi', 'Hamza Abdulazeez Eze', 'Oyim Ezinne Victoria',
  'Ajakaiye Jerome Odafe', 'Olusegun Efe Dele', 'Freeman Light Jesse', 'Ighalo Irezua Bright', 'Okoruwa Osezele Great', 'Omo-Erhabor Osayogie Emmanuel', 'Iyoha Emmanuel Ehizele', 'Braimoh Ebosetale Clinton', 'Idogbo Christopher Eromonse', 'Osaro Osagie Francis', 'Osato-Okoro Joshua Osazeme', 'Adeyemi Adesola Ibrahim', 'Daniel Omime Alex',
  'Aborisade Marvellous Olalekan', 'Ajibade Temitayo Oluwaseun', 'Ogundugba Maxwell', 'Muhammed Yahaya', 'Adeniyi Samuel Oluwafemi', 'Afolabi Idris Abiodun', 'Adedara Adegboyega Caleb', 'Ibrahim Abdmajid Tiwatope', 'Olufemi Ayomide Emmanuel', 'Olonisola Olatomiwa', 'Kehinde Oluwatimilehin Ayomide', 'Osajuyigbe Ayomide', 'Deakoni Adeyinka Raymond',
  'Wilson David Obinna', 'Kingdom Onyedika', 'Agu Success', 'Ezeh Samuel Uchenna', 'Igboke Vitus Chidera', 'Ajogwu Kingsley Maduka', 'Ucheleke Clinton Chibuchi', 'Thankgod Ifeanyi Chinedu', 'Ibekaku Chukwuemeka Anthony', 'Mbah Udochukwu Samuel', 'Chika Jefferson Chukwuebuka', 'Ugwueze Gabriel Chisom', 'Nathaniel Divine Ijeoma',
  'Ishaku Joel', 'Hamza Nabil Naeem', 'Ibrahim Ahmed', 'Ebute Joseph Onyefie Owoicho', 'Elisha Bhokosayi Martins', 'Danjuma Shem Zawali',
  'Damji Nabeel Abdulmumini', 'Yusuf Anderson Azael', 'Musa Micaiah Saidu', 'Zakari Joseph Jireh', 'Chugali Amaiyin Michael', 'Aliyu Faisal Maidoki', 'Stephen Elishama', 'Yugudah Yusuf Muhammad', 'Salisu Adam', 'Ibrahim Munir Usman', 'Joel Samuel Buba', 'Abiathar Jesse Yila', 'Ilorin Brains Mathew',
  'Chimezie Chibundu Vincent', 'Chimezie Royal Ezichi', 'Nwachukwu Uchenna Emmanuel', 'Leonard Increase Chimezirim', 'Nwanugo Kingsley Obinna', 'Nwosu Tochukwu Marvelous', 'Okoroafor John Ndundu', 'Emekoma Jabir Aliyu', 'Ahamefule Joseph Obioma', 'Ugochukwu David Onyekachi', 'Nnadi Emmanuel Chukwudi', 'Oguzie Chisom Gabriel', 'Ahamefula Emmanuel Ifeanyi',
  'Ibrahim Yalo', 'Abdullahi Usman Abubakar', 'Baba Abduljalil Muhammad', 'Magaji Nura Haruna', 'Adamu Suleiman Muhammed', 'Sabitu Samir Yahaya', "Hassan Ja'afar", 'Isah Ishaq Ibrahim', 'Lawal Yakubu', 'Abubakar Mubarak', 'Muhammad Adam Adamu', 'Umar Sulaiman', 'Abdulazeez Aliyu Sadiq',
  'Kure Joshua John', 'David Jemimah', 'Rabiu Umar', 'Ishaku Billy', 'Sabo Gyenum Jesse', 'Ahmed Sudais', 'Yahya Idris Sadeeq', 'Bello Mustapha Sani', 'Musa Bobai Stephen', 'Duniya Jerry Emmanuel', 'Muhammad Mustapha Labir', 'Joseph Aaron Kamai', 'Musa Yusuf Timothy',
  'Gambo Abubakar', 'Muhammed Abdulkadir Rabiu', 'Ibrahim Imran', 'Muhammad Ahmad', 'Zakari Habibu Danzabuwa', 'Aminu Shafiu Rabiu', 'Muazu Muhsin', 'Abdulsalam Muhammad Sani', 'Umar Yusuf Idris', 'Imam Muhammad Nazifi', 'Jibril Yahaya Usman', 'Aliyu Abdallah Abdullahi', 'Suleiman Khamis',
  'Armayau Yusuf Yusuf', 'Jibia Ahmad Ibrahim', 'Danja Dahiru Sani', 'Sani Bashir', 'Garba Adam Ado', 'Garba Abdulahad Shuaibu',
];

const studentSchema = new mongoose.Schema({
  email: String,
  name: String,
  company: String,
  school: mongoose.Schema.Types.ObjectId,
  studentId: String,
  pin: String,
  approvedAt: Date,
  isActive: Boolean,
});

const schoolSchema = new mongoose.Schema({ name: String, isActive: Boolean });
const DemoUser = mongoose.models.DemoUser || mongoose.model('DemoUser', studentSchema);
const School = mongoose.models.School || mongoose.model('School', schoolSchema);

function emailFor(name, index) {
  const slug = name
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '')
    .toLowerCase();
  return `${slug}.${String(index + 1).padStart(4, '0')}@thinkbox.com`;
}

async function seedStudents() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI is required to seed students.');

  await mongoose.connect(mongoUri);
  const schools = await School.find({ isActive: true }).sort({ name: 1 }).lean();
  if (schools.length === 0) throw new Error('No active schools found. Seed schools before students.');

  const pinHash = await bcryptjs.hash('1947', 10);
  const now = new Date();
  const operations = studentNames.map((name, index) => {
    const school = schools[index % schools.length];
    const studentId = `TB-${String(index + 1).padStart(4, '0')}`;
    const email = emailFor(name, index);

    return {
      updateOne: {
        filter: { email },
        update: {
          $setOnInsert: {
            email,
            name,
            company: school.name,
            school: school._id,
            studentId,
            pin: pinHash,
            approvedAt: now,
            isActive: true,
          },
        },
        upsert: true,
      },
    };
  });

  const result = await DemoUser.bulkWrite(operations, { ordered: true });
  console.log(`Student seed complete: ${result.upsertedCount} added, ${result.matchedCount} already present across ${schools.length} schools.`);
}

seedStudents()
  .catch((error) => {
    console.error('Unable to seed students:', error instanceof Error ? error.message : 'Unknown error');
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });