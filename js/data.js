/*
 * ฐานข้อมูลคำราชาศัพท์ไทย
 * โครงสร้างข้อมูลแต่ละคำ:
 *   common   : คำสามัญ
 *   royal    : คำราชาศัพท์ (คำตอบหลัก)
 *   alt      : คำราชาศัพท์อื่นที่ยอมรับได้ (สำหรับโหมดเติมคำ)
 *   category : หมวดหมู่
 *   level    : ระดับความยาก 1=ง่าย 2=กลาง 3=ยาก
 *   tier     : ชั้นบุคคลที่ใช้ (king=พระมหากษัตริย์/พระบรมวงศ์, monk=พระสงฆ์, polite=สุภาพชน)
 *   example  : ตัวอย่างประโยค ({royal} จะถูกแทนด้วยคำราชาศัพท์)
 */

const CATEGORIES = {
  body:    { name: "ร่างกายและอวัยวะ", icon: "🧑" },
  family:  { name: "เครือญาติ",        icon: "👪" },
  verb:    { name: "คำกริยา",          icon: "🏃" },
  object:  { name: "เครื่องใช้",        icon: "👑" },
  food:    { name: "อาหารและเครื่องเสวย", icon: "🍚" },
  cloth:   { name: "เครื่องแต่งกาย",    icon: "👘" },
  monk:    { name: "คำสำหรับพระสงฆ์",   icon: "🧘" },
};

const TIERS = {
  king:   "พระมหากษัตริย์/พระบรมวงศ์",
  monk:   "พระสงฆ์",
  polite: "สุภาพชน",
};

const VOCAB = [
  // ===== หมวดร่างกายและอวัยวะ =====
  { common: "ผม / เส้นผม", royal: "พระเกศา", alt: ["พระเกศ", "เส้นพระเจ้า"], category: "body", level: 1, tier: "king", example: "พระมหากษัตริย์ทรงไว้ {royal} อย่างงดงาม" },
  { common: "ศีรษะ / หัว", royal: "พระเศียร", alt: [], category: "body", level: 1, tier: "king", example: "ทรงสวมพระมหามงกุฎบน {royal}" },
  { common: "ใบหน้า", royal: "พระพักตร์", alt: [], category: "body", level: 1, tier: "king", example: "{royal} ของพระองค์เปี่ยมด้วยพระเมตตา" },
  { common: "หน้าผาก", royal: "พระนลาฏ", alt: [], category: "body", level: 3, tier: "king", example: "เหงื่อซึมที่ {royal}" },
  { common: "คิ้ว", royal: "พระขนง", alt: [], category: "body", level: 2, tier: "king", example: "{royal} โก่งงาม" },
  { common: "ตา / ดวงตา", royal: "พระเนตร", alt: ["พระจักษุ"], category: "body", level: 1, tier: "king", example: "ทอด{royal}ทอดพระเนตรไปยังประชาชน" },
  { common: "จมูก", royal: "พระนาสิก", alt: ["พระนาสา"], category: "body", level: 2, tier: "king", example: "{royal} โด่งงาม" },
  { common: "ปาก", royal: "พระโอษฐ์", alt: [], category: "body", level: 1, tier: "king", example: "ทรงเอ่ย {royal} ตรัสกับเหล่าทหาร" },
  { common: "ฟัน", royal: "พระทนต์", alt: [], category: "body", level: 2, tier: "king", example: "{royal} ขาวสะอาด" },
  { common: "ลิ้น", royal: "พระชิวหา", alt: [], category: "body", level: 3, tier: "king", example: "{royal} รับรสพระกระยาหาร" },
  { common: "หู", royal: "พระกรรณ", alt: [], category: "body", level: 2, tier: "king", example: "ทรงสดับด้วย {royal}" },
  { common: "คอ", royal: "พระศอ", alt: [], category: "body", level: 1, tier: "king", example: "ทรงสวมสร้อยที่ {royal}" },
  { common: "มือ", royal: "พระหัตถ์", alt: [], category: "body", level: 1, tier: "king", example: "ทรงโบก {royal} ทักทายประชาชน" },
  { common: "แขน", royal: "พระพาหา", alt: ["พระกร"], category: "body", level: 2, tier: "king", example: "{royal} แข็งแรง" },
  { common: "นิ้วมือ", royal: "พระองคุลี", alt: [], category: "body", level: 3, tier: "king", example: "ทรงสวมพระธำมรงค์ที่ {royal}" },
  { common: "เล็บ", royal: "พระนขา", alt: [], category: "body", level: 3, tier: "king", example: "{royal} สะอาดเรียบร้อย" },
  { common: "ท้อง", royal: "พระอุทร", alt: [], category: "body", level: 2, tier: "king", example: "{royal} ปวดเพราะทรงพระประชวร" },
  { common: "หัวใจ", royal: "พระหทัย", alt: ["พระกมล"], category: "body", level: 2, tier: "king", example: "{royal} เปี่ยมด้วยความเมตตา" },
  { common: "เลือด", royal: "พระโลหิต", alt: [], category: "body", level: 1, tier: "king", example: "แพทย์ถวายการตรวจ {royal}" },
  { common: "เท้า", royal: "พระบาท", alt: [], category: "body", level: 1, tier: "king", example: "ประชาชนหมอบกราบแทบ {royal}" },
  { common: "ขา / ตัก", royal: "พระเพลา", alt: [], category: "body", level: 3, tier: "king", example: "ทรงวางพระหัตถ์บน {royal}" },
  { common: "น้ำตา", royal: "น้ำพระเนตร", alt: ["พระอัสสุชล"], category: "body", level: 2, tier: "king", example: "{royal} ไหลรินด้วยความตื้นตัน" },
  { common: "ไหล่", royal: "พระอังสา", alt: [], category: "body", level: 3, tier: "king", example: "ทรงสะพายผ้าบน {royal}" },
  { common: "หนวด", royal: "พระมัสสุ", alt: [], category: "body", level: 3, tier: "king", example: "{royal} ดูสง่างาม" },

  // ===== หมวดเครือญาติ =====
  { common: "พ่อ", royal: "พระชนก", alt: ["พระบิดา"], category: "family", level: 1, tier: "king", example: "{royal} ทรงอบรมสั่งสอนพระราชโอรส" },
  { common: "แม่", royal: "พระชนนี", alt: ["พระมารดา"], category: "family", level: 1, tier: "king", example: "{royal} ทรงเลี้ยงดูด้วยความรัก" },
  { common: "ลูกชาย", royal: "พระราชโอรส", alt: ["พระโอรส"], category: "family", level: 1, tier: "king", example: "{royal} ทรงศึกษาในต่างประเทศ" },
  { common: "ลูกสาว", royal: "พระราชธิดา", alt: ["พระธิดา"], category: "family", level: 1, tier: "king", example: "{royal} ทรงงานด้านการศึกษา" },
  { common: "พี่ชาย", royal: "พระเชษฐา", alt: [], category: "family", level: 2, tier: "king", example: "{royal} ทรงเป็นที่เคารพ" },
  { common: "น้องชาย", royal: "พระอนุชา", alt: [], category: "family", level: 2, tier: "king", example: "{royal} เสด็จมาร่วมพระราชพิธี" },
  { common: "พี่สาว", royal: "พระเชษฐภคินี", alt: [], category: "family", level: 3, tier: "king", example: "{royal} ทรงดูแลพระอนุชา" },
  { common: "น้องสาว", royal: "พระขนิษฐา", alt: [], category: "family", level: 2, tier: "king", example: "{royal} ทรงพระสิริโฉม" },
  { common: "ปู่ / ตา", royal: "พระอัยกา", alt: [], category: "family", level: 3, tier: "king", example: "{royal} ทรงเล่าเรื่องในอดีต" },
  { common: "ย่า / ยาย", royal: "พระอัยยิกา", alt: ["พระอัยกี"], category: "family", level: 3, tier: "king", example: "{royal} ทรงพระเมตตาต่อพระราชนัดดา" },
  { common: "ลูกของลูก (หลาน)", royal: "พระราชนัดดา", alt: ["พระนัดดา"], category: "family", level: 3, tier: "king", example: "{royal} เสด็จมาเยี่ยม" },

  // ===== หมวดคำกริยา =====
  { common: "กิน", royal: "เสวย", alt: [], category: "verb", level: 1, tier: "king", example: "พระมหากษัตริย์ทรง{royal}พระกระยาหาร" },
  { common: "นอน", royal: "บรรทม", alt: ["ทรงบรรทม"], category: "verb", level: 1, tier: "king", example: "ทรง{royal}บนพระแท่น" },
  { common: "เดิน", royal: "ทรงพระดำเนิน", alt: ["เสด็จพระราชดำเนิน"], category: "verb", level: 2, tier: "king", example: "{royal}ไปตามทางลาดพระบาท" },
  { common: "ไป (เคลื่อนที่)", royal: "เสด็จ", alt: ["เสด็จพระราชดำเนิน"], category: "verb", level: 1, tier: "king", example: "ทรง{royal}ไปทรงงานต่างจังหวัด" },
  { common: "พูด", royal: "ตรัส", alt: ["มีพระราชดำรัส", "รับสั่ง"], category: "verb", level: 1, tier: "king", example: "ทรง{royal}กับเหล่าข้าราชบริพาร" },
  { common: "ป่วย", royal: "ทรงพระประชวร", alt: ["ประชวร"], category: "verb", level: 2, tier: "king", example: "พระองค์{royal}เล็กน้อย" },
  { common: "อาบน้ำ", royal: "สรง", alt: ["สรงน้ำ", "ทรงสรง"], category: "verb", level: 2, tier: "king", example: "ทรง{royal}น้ำในตอนเช้า" },
  { common: "โกรธ", royal: "ทรงพระพิโรธ", alt: ["กริ้ว"], category: "verb", level: 2, tier: "king", example: "พระองค์{royal}ที่มีผู้กระทำผิด" },
  { common: "นั่ง", royal: "ประทับ", alt: ["ประทับนั่ง"], category: "verb", level: 1, tier: "king", example: "ทรง{royal}บนพระที่นั่ง" },
  { common: "ให้", royal: "พระราชทาน", alt: [], category: "verb", level: 1, tier: "king", example: "ทรง{royal}รางวัลแก่ผู้ชนะ" },
  { common: "ตาย", royal: "สวรรคต", alt: [], category: "verb", level: 1, tier: "king", example: "พระมหากษัตริย์เสด็จ{royal}" },
  { common: "เกิด", royal: "พระราชสมภพ", alt: ["เสด็จพระราชสมภพ"], category: "verb", level: 2, tier: "king", example: "ทรงเสด็จ{royal}เมื่อปีพุทธศักราช..." },
  { common: "ดู / มอง", royal: "ทอดพระเนตร", alt: [], category: "verb", level: 1, tier: "king", example: "ทรง{royal}นิทรรศการ" },
  { common: "ฟัง", royal: "สดับ", alt: ["ทรงสดับ"], category: "verb", level: 2, tier: "king", example: "ทรง{royal}ปาฐกถา" },
  { common: "คิด", royal: "ทรงพระราชดำริ", alt: ["มีพระราชดำริ"], category: "verb", level: 2, tier: "king", example: "{royal}ที่จะพัฒนาประเทศ" },
  { common: "ฝัน", royal: "ทรงพระสุบิน", alt: ["พระสุบิน"], category: "verb", level: 3, tier: "king", example: "พระองค์{royal}ถึงเหตุการณ์มงคล" },
  { common: "หัวเราะ", royal: "ทรงพระสรวล", alt: ["แย้มพระสรวล"], category: "verb", level: 3, tier: "king", example: "พระองค์{royal}ด้วยความพอพระทัย" },
  { common: "รู้ / ทราบ", royal: "ทรงทราบ", alt: [], category: "verb", level: 1, tier: "king", example: "ทรง{royal}ถึงความเดือดร้อนของราษฎร" },
  { common: "อยากได้ / ต้องการ", royal: "มีพระราชประสงค์", alt: ["ทรงพระราชประสงค์"], category: "verb", level: 2, tier: "king", example: "{royal}ให้ประชาชนมีความสุข" },
  { common: "เขียนหนังสือ", royal: "ทรงพระอักษร", alt: [], category: "verb", level: 3, tier: "king", example: "ทรง{royal}บันทึกพระราชกรณียกิจ" },
  { common: "ดีใจ / พอใจ", royal: "ทรงพระปราโมทย์", alt: ["พอพระราชหฤทัย"], category: "verb", level: 3, tier: "king", example: "พระองค์{royal}ในความสำเร็จ" },

  // ===== หมวดเครื่องใช้ =====
  { common: "รถ", royal: "รถพระที่นั่ง", alt: ["พระที่นั่ง"], category: "object", level: 1, tier: "king", example: "{royal}แล่นผ่านถนนราชดำเนิน" },
  { common: "เรือ", royal: "เรือพระที่นั่ง", alt: [], category: "object", level: 1, tier: "king", example: "{royal}ล่องไปตามแม่น้ำ" },
  { common: "เตียงนอน", royal: "พระแท่นบรรทม", alt: ["พระแท่น"], category: "object", level: 2, tier: "king", example: "ทรงบรรทมบน {royal}" },
  { common: "ร่ม (กันแดด)", royal: "พระกลด", alt: [], category: "object", level: 2, tier: "king", example: "มหาดเล็กกาง {royal} ถวาย" },
  { common: "แว่นตา", royal: "ฉลองพระเนตร", alt: [], category: "object", level: 2, tier: "king", example: "ทรงสวม {royal}" },
  { common: "หวี", royal: "พระสาง", alt: [], category: "object", level: 3, tier: "king", example: "ทรงใช้ {royal} หวีพระเกศา" },
  { common: "กระจกเงา", royal: "พระฉาย", alt: [], category: "object", level: 3, tier: "king", example: "ทอดพระเนตร {royal}" },
  { common: "แหวน", royal: "พระธำมรงค์", alt: [], category: "object", level: 2, tier: "king", example: "ทรงสวม {royal} ที่พระองคุลี" },
  { common: "จดหมาย (ลายพระหัตถ์)", royal: "พระราชหัตถเลขา", alt: ["ลายพระหัตถ์"], category: "object", level: 3, tier: "king", example: "ทรงมี {royal} ถึงพระสหาย" },
  { common: "เก้าอี้ (ที่ประทับ)", royal: "พระเก้าอี้", alt: ["พระราชอาสน์"], category: "object", level: 2, tier: "king", example: "ทรงประทับบน {royal}" },

  // ===== หมวดอาหารและเครื่องเสวย =====
  { common: "ข้าว / อาหาร", royal: "พระกระยาหาร", alt: ["พระกระยาเสวย", "เครื่องเสวย"], category: "food", level: 1, tier: "king", example: "ห้องเครื่องจัด {royal} ถวาย" },
  { common: "น้ำดื่ม", royal: "พระสุธารส", alt: [], category: "food", level: 2, tier: "king", example: "ทรงเสวย {royal}" },
  { common: "น้ำชา", royal: "พระสุธารสชา", alt: [], category: "food", level: 3, tier: "king", example: "มหาดเล็กถวาย {royal}" },
  { common: "ของว่าง / ขนม", royal: "เครื่องว่าง", alt: [], category: "food", level: 2, tier: "king", example: "จัด {royal} ถวายในยามบ่าย" },

  // ===== หมวดเครื่องแต่งกาย =====
  { common: "เสื้อ", royal: "ฉลองพระองค์", alt: [], category: "cloth", level: 1, tier: "king", example: "ทรง {royal} สีขาว" },
  { common: "รองเท้า", royal: "ฉลองพระบาท", alt: [], category: "cloth", level: 1, tier: "king", example: "ทรง {royal} คู่งาม" },
  { common: "ผ้านุ่ง", royal: "พระภูษา", alt: [], category: "cloth", level: 2, tier: "king", example: "ทรง {royal} ลายไทย" },
  { common: "หมวก", royal: "พระมาลา", alt: [], category: "cloth", level: 2, tier: "king", example: "ทรงสวม {royal}" },
  { common: "เข็มขัด", royal: "รัดพระองค์", alt: [], category: "cloth", level: 3, tier: "king", example: "ทรงคาด {royal}" },
  { common: "มงกุฎ", royal: "พระมหามงกุฎ", alt: ["พระมงกุฎ"], category: "cloth", level: 1, tier: "king", example: "ทรงสวม {royal} ในพระราชพิธี" },
  { common: "ผ้าเช็ดหน้า", royal: "ผ้าซับพระพักตร์", alt: [], category: "cloth", level: 3, tier: "king", example: "ถวาย {royal}" },

  // ===== หมวดคำสำหรับพระสงฆ์ =====
  { common: "กิน (พระสงฆ์)", royal: "ฉัน", alt: [], category: "monk", level: 1, tier: "monk", example: "พระภิกษุ{royal}ภัตตาหาร" },
  { common: "นอน (พระสงฆ์)", royal: "จำวัด", alt: [], category: "monk", level: 1, tier: "monk", example: "พระสงฆ์{royal}ในกุฏิ" },
  { common: "อาบน้ำ (พระสงฆ์)", royal: "สรงน้ำ", alt: ["สรง"], category: "monk", level: 2, tier: "monk", example: "พระภิกษุ{royal}ในตอนเย็น" },
  { common: "ป่วย (พระสงฆ์)", royal: "อาพาธ", alt: [], category: "monk", level: 1, tier: "monk", example: "พระอาจารย์{royal}เข้ารักษาตัว" },
  { common: "ตาย (พระสงฆ์)", royal: "มรณภาพ", alt: [], category: "monk", level: 1, tier: "monk", example: "หลวงพ่อ{royal}อย่างสงบ" },
  { common: "อาหาร (พระสงฆ์)", royal: "ภัตตาหาร", alt: [], category: "monk", level: 1, tier: "monk", example: "ญาติโยมถวาย{royal}แด่พระสงฆ์" },
  { common: "ให้ของแก่พระสงฆ์", royal: "ถวาย", alt: [], category: "monk", level: 1, tier: "monk", example: "ญาติโยม{royal}สังฆทาน" },
  { common: "เชิญ (พระสงฆ์)", royal: "อาราธนา", alt: [], category: "monk", level: 2, tier: "monk", example: "{royal}พระสงฆ์เจริญพระพุทธมนต์" },
  { common: "นั่ง (พระสงฆ์)", royal: "นั่งอาสนะ", alt: [], category: "monk", level: 3, tier: "monk", example: "พระสงฆ์{royal}บนอาสนะสงฆ์" },
];

// แนบ id ให้แต่ละคำเพื่อใช้อ้างอิงในสถิติ
VOCAB.forEach((v, i) => { v.id = i; });

const LEVEL_NAMES = { 1: "ง่าย", 2: "ปานกลาง", 3: "ยาก" };
