export interface DrugDatabaseItem {
  id: string;
  nameTH: string;
  nameEN: string;
  aliases: string[]; // Other brand names or search terms
  category: string;
  indication: string;
  defaultDosage: string;
  availableDosages: string[];
  suggestedFrequency: string;
  suggestedMealTimings: string[];
  caution: string;
  instructions: string;
}

export const DRUG_DATABASE: DrugDatabaseItem[] = [
  // ==========================================
  // 1. กลุ่มยาลดความดันโลหิต / โรคหัวใจ (Cardiovascular & Antihypertensives)
  // ==========================================
  {
    id: 'amlodipine',
    nameTH: 'ยาลดความดันโลหิต แอมโลดิพีน (Amlodipine)',
    nameEN: 'Amlodipine Besylate',
    aliases: ['Norvasc', 'Amlo', 'แอมโล', 'นอร์วาสก์', 'อะมโลดิพีน', 'Amlodipine 5', 'Amlodipine 10'],
    category: 'ยาลดความดันโลหิต',
    indication: 'รักษาโรคความดันโลหิตสูง และป้องกันอาการเจ็บแน่นหน้าอก',
    defaultDosage: '5 mg',
    availableDosages: ['5 mg', '10 mg'],
    suggestedFrequency: 'รับประทานวันละ 1 ครั้ง',
    suggestedMealTimings: ['เช้า', 'หลังอาหาร'],
    caution: 'อาจมีอาการข้อเท้าบวม หรือหน้ามืดเวลาเปลี่ยนท่ากะทันหัน',
    instructions: 'รับประทานสม่ำเสมอทุกวันในเวลาเดียวกันตอนเช้า',
  },
  {
    id: 'enalapril',
    nameTH: 'ยาลดความดันโลหิต อีนาลาพริล (Enalapril)',
    nameEN: 'Enalapril Maleate',
    aliases: ['Anapril', 'Renitec', 'อีนาลาพริล', 'อนาพริล', 'เรนิเทค', 'Enalapril 5', 'Enalapril 20'],
    category: 'ยาลดความดันโลหิต / หัวใจ',
    indication: 'ลดความดันโลหิต และช่วยชะลอความเสื่อมของไตในผู้ป่วยเบาหวาน',
    defaultDosage: '10 mg',
    availableDosages: ['5 mg', '10 mg', '20 mg'],
    suggestedFrequency: 'รับประทานวันละ 1 ครั้ง',
    suggestedMealTimings: ['เช้า', 'หลังอาหาร'],
    caution: 'อาจมีอาการไอแห้งๆ หากไอมากต่อเนื่องควรปรึกษาแพทย์',
    instructions: 'ควรรับประทานเวลาเดิมทุกวัน และดื่มน้ำตามปกติ',
  },
  {
    id: 'losartan',
    nameTH: 'ยาลดความดันโลหิต โลซาร์แทน (Losartan)',
    nameEN: 'Losartan Potassium',
    aliases: ['Cozaar', 'Losar', 'โคซาร์', 'โลซาร์', 'Losartan 50', 'Losartan 100'],
    category: 'ยาลดความดันโลหิต',
    indication: 'ลดความดันโลหิตสูง และปกป้องการทำงานของไต',
    defaultDosage: '50 mg',
    availableDosages: ['50 mg', '100 mg'],
    suggestedFrequency: 'รับประทานวันละ 1 ครั้ง',
    suggestedMealTimings: ['เช้า', 'หลังอาหาร'],
    caution: 'ระวังอาการเวียนศีรษะขณะเปลี่ยนอิริยาบถ',
    instructions: 'รับประทานต่อเนื่อง ห้ามหยุดยาเองแม้ความดันจะปกติแล้ว',
  },
  {
    id: 'atenolol',
    nameTH: 'ยาควบคุมการเต้นหัวใจและลดความดัน อะทีโนลอล (Atenolol)',
    nameEN: 'Atenolol',
    aliases: ['Tenormin', 'เทนอร์มิน', 'อะทีโนลอล', 'Atenolol 25', 'Atenolol 50'],
    category: 'ยาลดความดันโลหิต / ควบคุมการเต้นหัวใจ',
    indication: 'ควบคุมอัตราการเต้นของหัวใจ และลดความดันโลหิต',
    defaultDosage: '50 mg',
    availableDosages: ['25 mg', '50 mg', '100 mg'],
    suggestedFrequency: 'รับประทานวันละ 1 ครั้ง',
    suggestedMealTimings: ['เช้า', 'ก่อนอาหาร'],
    caution: 'อาจทำให้ชีพจรเต้นช้าลง ระวังอาการเหนื่อยหรือหน้ามืด',
    instructions: 'ห้ามหยุดยากะทันหันเพราะอาจทำให้หัวใจเต้นเร็วผิดปกติ',
  },
  {
    id: 'hydrochlorothiazide',
    nameTH: 'ยาขับปัสสาวะลดความดัน ไฮโดรคลอโรไทอะไซด์ (HCTZ)',
    nameEN: 'Hydrochlorothiazide',
    aliases: ['HCTZ', 'ไฮโดรคลอโรไทอะไซด์', 'ยาขับปัสสาวะ', 'HCTZ 25', 'HCTZ 50'],
    category: 'ยาขับปัสสาวะ / ลดความดัน',
    indication: 'ขับปัสสาวะ ลดอาการบวมน้ำ และลดความดันโลหิต',
    defaultDosage: '25 mg',
    availableDosages: ['12.5 mg', '25 mg', '50 mg'],
    suggestedFrequency: 'รับประทานวันละ 1 ครั้ง',
    suggestedMealTimings: ['เช้า', 'หลังอาหาร'],
    caution: 'ควรทานในตอนเช้าเพื่อหลีกเลี่ยงการตื่นมาปัสสาวะตอนกลางคืน',
    instructions: 'ดื่มน้ำให้เพียงพอ และตรวจติดตามเกลือแร่ในเลือดตามนัด',
  },

  // ==========================================
  // 2. กลุ่มยารักษาโรคเบาหวาน (Antidiabetic Medications)
  // ==========================================
  {
    id: 'metformin',
    nameTH: 'ยาลดน้ำตาลในเลือด เมตฟอร์มิน (Metformin)',
    nameEN: 'Metformin Hydrochloride',
    aliases: ['Glucophage', 'กลูโคฟาส', 'เมตฟอร์มิน', 'Metformin 500', 'Metformin 850', 'Metformin 1000'],
    category: 'ยารักษาโรคเบาหวาน',
    indication: 'ควบคุมระดับน้ำตาลในเลือดสำหรับผู้ป่วยเบาหวานชนิดที่ 2',
    defaultDosage: '500 mg',
    availableDosages: ['500 mg', '850 mg', '1000 mg'],
    suggestedFrequency: 'รับประทานวันละ 2 ครั้ง',
    suggestedMealTimings: ['เช้า', 'เย็น', 'พร้อมอาหาร', 'หลังอาหาร'],
    caution: 'อาจมีอาการแน่นท้อง ท้องอืด หรือคลื่นไส้ ควรรับประทานพร้อมหรือหลังอาหารทันที',
    instructions: 'รับประทานพร้อมอาหารเพื่อลดอาการระคายเคืองกระเพาะอาหาร',
  },
  {
    id: 'glimepiride',
    nameTH: 'ยากระตุ้นการหลั่งอินซูลิน กลิเมพิไรด์ (Glimepiride)',
    nameEN: 'Glimepiride',
    aliases: ['Amaryl', 'อะมาริล', 'กลิเมพิไรด์', 'Glimepiride 2', 'Glimepiride 4'],
    category: 'ยารักษาโรคเบาหวาน',
    indication: 'กระตุ้นตับอ่อนให้หลั่งอินซูลินเพื่อลดระดับน้ำตาลในเลือด',
    defaultDosage: '2 mg',
    availableDosages: ['1 mg', '2 mg', '3 mg', '4 mg'],
    suggestedFrequency: 'รับประทานวันละ 1 ครั้ง',
    suggestedMealTimings: ['เช้า', 'ก่อนอาหาร'],
    caution: 'ระวังภาวะน้ำตาลในเลือดต่ำ (ใจสั่น เหงื่อออก หน้ามืด) ควรพกลูกอมหรือน้ำหวานไว้เสมอ',
    instructions: 'รับประทานก่อนอาหารมื้อแรกของวันประมาณ 15-30 นาที และต้องรับประทานอาหารตรงเวลา',
  },
  {
    id: 'glipizide',
    nameTH: 'ยาลดน้ำตาลในเลือด กลิพิไซด์ (Glipizide)',
    nameEN: 'Glipizide',
    aliases: ['Minidiab', 'กลิพิไซด์', 'มินิไดแอบ', 'Glipizide 5'],
    category: 'ยารักษาโรคเบาหวาน',
    indication: 'ลดระดับน้ำตาลในเลือดสำหรับผู้ป่วยเบาหวานชนิดที่ 2',
    defaultDosage: '5 mg',
    availableDosages: ['2.5 mg', '5 mg', '10 mg'],
    suggestedFrequency: 'รับประทานวันละ 1-2 ครั้ง',
    suggestedMealTimings: ['เช้า', 'ก่อนอาหาร'],
    caution: 'ห้ามงดอาหารหลังทานยา เพราะอาจทำให้น้ำตาลในเลือดต่ำรุนแรง',
    instructions: 'รับประทานก่อนอาหารเช้า 30 นาที',
  },
  {
    id: 'dapagliflozin',
    nameTH: 'ยาขับน้ำตาลทางปัสสาวะ ดาพากลิฟโลซิน (Dapagliflozin / Forxiga)',
    nameEN: 'Dapagliflozin',
    aliases: ['Forxiga', 'ฟอร์ซิกา', 'ดาพากลิฟโลซิน', 'Forxiga 10'],
    category: 'ยารักษาโรคเบาหวาน / โรคไตและหัวใจ',
    indication: 'ขับน้ำตาลส่วนเกินออกทางปัสสาวะ ปกป้องไตและลดความเสี่ยงภาวะหัวใจล้มเหลว',
    defaultDosage: '10 mg',
    availableDosages: ['5 mg', '10 mg'],
    suggestedFrequency: 'รับประทานวันละ 1 ครั้ง',
    suggestedMealTimings: ['เช้า', 'หลังอาหาร'],
    caution: 'ดื่มน้ำสะอาดให้เพียงพอ และระวังการติดเชื้อในทางเดินปัสสาวะโดยรักษาความสะอาด',
    instructions: 'รับประทานเวลาเช้าเป็นประจำทุกวัน',
  },

  // ==========================================
  // 3. กลุ่มยาลดไขมันในเลือด (Lipid-Lowering Agents)
  // ==========================================
  {
    id: 'simvastatin',
    nameTH: 'ยาลดไขมันคอเลสเตอรอล ซิมวาสแตติน (Simvastatin)',
    nameEN: 'Simvastatin',
    aliases: ['Zocor', 'โซคอร์', 'ซิมวาสแตติน', 'Simvastatin 10', 'Simvastatin 20', 'Simvastatin 40'],
    category: 'ยาลดไขมันในเลือด',
    indication: 'ลดระดับคอเลสเตอรอลและไตรกลีเซอไรด์ ป้องกันหลอดเลือดตีบ',
    defaultDosage: '20 mg',
    availableDosages: ['10 mg', '20 mg', '40 mg'],
    suggestedFrequency: 'รับประทานวันละ 1 ครั้ง',
    suggestedMealTimings: ['ก่อนนอน'],
    caution: 'ควรทานก่อนนอนเนื่องจากตับสร้างคอเลสเตอรอลมากในเวลากลางคืน หากมีอาการปวดกล้ามเนื้อรุนแรงให้แจ้งแพทย์',
    instructions: 'รับประทานก่อนนอนสม่ำเสมอ และหลีกเลี่ยงการดื่มเครื่องดื่มแอลกอฮอล์',
  },
  {
    id: 'atorvastatin',
    nameTH: 'ยาลดไขมันในเลือด อะตอร์วาสแตติน (Atorvastatin)',
    nameEN: 'Atorvastatin Calcium',
    aliases: ['Lipitor', 'ลิปิเตอร์', 'อะตอร์วาสแตติน', 'Atorvastatin 10', 'Atorvastatin 20', 'Atorvastatin 40'],
    category: 'ยาลดไขมันในเลือด',
    indication: 'ลดไขมันเลว (LDL) ป้องกันโรคหลอดเลือดสมองและหัวใจขาดเลือด',
    defaultDosage: '20 mg',
    availableDosages: ['10 mg', '20 mg', '40 mg', '80 mg'],
    suggestedFrequency: 'รับประทานวันละ 1 ครั้ง',
    suggestedMealTimings: ['เย็น', 'หลังอาหาร', 'ก่อนนอน'],
    caution: 'สังเกตอาการปวดเมื่อยกล้ามเนื้อผิดปกติ และหลีกเลี่ยงผลไม้ตระกูลเกรปฟรุต',
    instructions: 'รับประทานวันละ 1 ครั้งในเวลาเดิมทุกวัน',
  },

  // ==========================================
  // 4. กลุ่มยาต้านเกล็ดเลือด / ยาสลายลิ่มเลือด (Antiplatelets & Anticoagulants)
  // ==========================================
  {
    id: 'aspirin',
    nameTH: 'ยาต้านเกล็ดเลือด แอสไพรินขนาดต่ำ (Aspirin 81 mg)',
    nameEN: 'Aspirin (Acetylsalicylic acid)',
    aliases: ['Baby Aspirin', 'Aspent', 'แอสเปนท์', 'แอสไพริน', 'Aspirin 81', 'Aspirin 300'],
    category: 'ยาต้านเกล็ดเลือด',
    indication: 'ป้องกันการเกิดลิ่มเลือดอุดตันในหลอดเลือดหัวใจและสมอง',
    defaultDosage: '81 mg',
    availableDosages: ['81 mg', '100 mg', '300 mg'],
    suggestedFrequency: 'รับประทานวันละ 1 ครั้ง',
    suggestedMealTimings: ['เช้า', 'หลังอาหาร'],
    caution: 'ระคายเคืองกระเพาะอาหาร ต้องรับประทานหลังอาหารทันที และระวังภาวะเลือดออกง่ายหรืออุจจาระดำ',
    instructions: 'กลืนทั้งเม็ดพร้อมน้ำ 1 แก้วเต็มหลังอาหารทันที ห้ามเคี้ยวเม็ดยาเคลือบ',
  },
  {
    id: 'clopidogrel',
    nameTH: 'ยาต้านเกล็ดเลือด คลอพิโดเกรล (Clopidogrel)',
    nameEN: 'Clopidogrel Bisulfate',
    aliases: ['Plavix', 'พลาวิกซ์', 'คลอพิโดเกรล', 'Clopidogrel 75'],
    category: 'ยาต้านเกล็ดเลือด',
    indication: 'ป้องกันการเกิดลิ่มเลือดอุดตันในผู้ป่วยใส่ขดลวดหัวใจหรืออัมพฤกษ์',
    defaultDosage: '75 mg',
    availableDosages: ['75 mg'],
    suggestedFrequency: 'รับประทานวันละ 1 ครั้ง',
    suggestedMealTimings: ['เช้า', 'หลังอาหาร'],
    caution: 'ระวังการเกิดแผลหรือเลือดออกผิดปกติ แจ้งทันตแพทย์หรือแพทย์ก่อนทำหัตถการผ่าตัด',
    instructions: 'รับประทานต่อเนื่องตามแพทย์สั่งอย่างเคร่งครัด',
  },

  // ==========================================
  // 5. กลุ่มยาแก้ปวด ลดไข้ และต้านการอักเสบ (Pain Relief & Anti-inflammatory)
  // ==========================================
  {
    id: 'paracetamol',
    nameTH: 'ยาแก้ปวดลดไข้ พาราเซตามอล (Paracetamol / Tylenol / Sara)',
    nameEN: 'Paracetamol (Acetaminophen)',
    aliases: ['Tylenol', 'Sara', 'ไทลินอล', 'ซาร่า', 'พารา', 'Paracetamol 500'],
    category: 'ยาบรรเทาปวดและลดไข้',
    indication: 'บรรเทาอาการปวดศีรษะ ปวดฟัน ปวดกล้ามเนื้อ และลดไข้',
    defaultDosage: '500 mg',
    availableDosages: ['325 mg', '500 mg', '650 mg (Extended-Release)'],
    suggestedFrequency: 'รับประทานทุก 4-6 ชั่วโมง เมื่อมีอาการ',
    suggestedMealTimings: ['หลังอาหาร', 'เมื่อมีอาการ'],
    caution: 'ห้ามรับประทานเกินวันละ 8 เม็ด (4,000 mg) เพราะอาจเป็นพิษต่อตับ ห้ามทานร่วมกับแอลกอฮอล์',
    instructions: 'รับประทานเมื่อมีอาการปวดหรือมีไข้ เว้นระยะอย่างน้อย 4 ชั่วโมง',
  },
  {
    id: 'ibuprofen',
    nameTH: 'ยาแก้ปวดต้านอักเสบ ไอบูโพรเฟน (Ibuprofen / Nurofen / Gofen)',
    nameEN: 'Ibuprofen',
    aliases: ['Nurofen', 'Gofen', 'ไอบูโพรเฟน', 'นูโรเฟน', 'โกเฟน', 'Ibuprofen 400'],
    category: 'ยาแก้ปวดและต้านการอักเสบ (NSAIDs)',
    indication: 'ลดอาการปวด บวม แดง ร้อน จากการอักเสบของข้อและกล้ามเนื้อ หรือปวดประจำเดือน',
    defaultDosage: '400 mg',
    availableDosages: ['200 mg', '400 mg', '600 mg'],
    suggestedFrequency: 'รับประทานวันละ 2-3 ครั้ง',
    suggestedMealTimings: ['เช้า', 'เที่ยง', 'เย็น', 'หลังอาหาร'],
    caution: 'ระคายเคืองกระเพาะอาหารสูง ต้องรับประทานหลังอาหารทันทีและดื่มน้ำตามมากๆ ผู้ป่วยโรคไต/โรคหัวใจควรปรึกษาแพทย์',
    instructions: 'รับประทานหลังอาหารทันที และไม่ควรทานติดต่อกันเป็นเวลานานโดยไม่มีคำสั่งแพทย์',
  },
  {
    id: 'mefenamic_acid',
    nameTH: 'ยาแก้ปวดประจำเดือน / ปวดฟัน พอนสแตน (Mefenamic Acid / Ponstan)',
    nameEN: 'Mefenamic Acid',
    aliases: ['Ponstan', 'พอนสแตน', 'มีเฟนามิก', 'Ponstan 500'],
    category: 'ยาแก้ปวดต้านการอักเสบ (NSAIDs)',
    indication: 'บรรเทาอาการปวดประจำเดือน ปวดฟัน และปวดกล้ามเนื้อ',
    defaultDosage: '500 mg',
    availableDosages: ['250 mg', '500 mg'],
    suggestedFrequency: 'รับประทานวันละ 3 ครั้ง',
    suggestedMealTimings: ['เช้า', 'เที่ยง', 'เย็น', 'หลังอาหาร'],
    caution: 'ต้องรับประทานหลังอาหารทันที ห้ามรับประทานขณะท้องว่าง',
    instructions: 'รับประทานเฉพาะช่วงที่มีอาการปวด',
  },
  {
    id: 'tramadol',
    nameTH: 'ยาแก้ปวดระดับปานกลางถึงรุนแรง ทรามาดอล (Tramadol)',
    nameEN: 'Tramadol Hydrochloride',
    aliases: ['Tramal', 'ทรามาล', 'ทรามาดอล', 'Ultracet'],
    category: 'ยาแก้ปวดกลุ่มโอปิออยด์สังเคราะห์',
    indication: 'บรรเทาอาการปวดปานกลางถึงรุนแรง เช่น ปวดหลังผ่าตัด หรือปวดข้อรุนแรง',
    defaultDosage: '50 mg',
    availableDosages: ['50 mg', '100 mg'],
    suggestedFrequency: 'รับประทานทุก 6-8 ชั่วโมง เมื่อมีอาการปวดมาก',
    suggestedMealTimings: ['หลังอาหาร', 'เมื่อมีอาการ'],
    caution: 'อาจทำให้เวียนศีรษะ คลื่นไส้ ง่วงซึม ห้ามขับขี่ยานพาหนะ และต้องใช้ภายใต้การดูแลของแพทย์',
    instructions: 'รับประทานตามขนาดที่แพทย์สั่งอย่างเคร่งครัด',
  },

  // ==========================================
  // 6. กลุ่มยาระบบทางเดินอาหาร (Gastrointestinal Medications)
  // ==========================================
  {
    id: 'omeprazole',
    nameTH: 'ยาลดกรดและรักษาแผลในกระเพาะ โอเมพราโซล (Omeprazole / Miracid)',
    nameEN: 'Omeprazole',
    aliases: ['Miracid', 'มิราซิด', 'โอเมพราโซล', 'Losec', 'โลเสก', 'Omeprazole 20'],
    category: 'ยาลดกรดในกระเพาะอาหาร (PPI)',
    indication: 'รักษาโรคกรดไหลย้อน แผลในกระเพาะอาหาร และลดการหลั่งกรด',
    defaultDosage: '20 mg',
    availableDosages: ['20 mg', '40 mg'],
    suggestedFrequency: 'รับประทานวันละ 1 ครั้ง',
    suggestedMealTimings: ['เช้า', 'ก่อนอาหาร'],
    caution: 'ต้องรับประทานก่อนอาหารเช้าประมาณ 30-60 นาที และกลืนทั้งแคปซูลห้ามเคี้ยว',
    instructions: 'รับประทานก่อนอาหารเช้าทุกวันอย่างน้อย 30 นาที',
  },
  {
    id: 'antacid_gel',
    nameTH: 'ยาลดกรดชนิดน้ำ / เจล (Antacid Gel / Gaviscon / Alum Milk)',
    nameEN: 'Aluminium Hydroxide & Magnesium Hydroxide',
    aliases: ['Gaviscon', 'กาวิสคอน', 'แอนตาซิล', 'Antacil', 'ยาน้ำลดกรด', 'เครมิล'],
    category: 'ยาลดกรดเคลือบกระเพาะ',
    indication: 'บรรเทาอาการแสบร้อนกลางอก อาหารไม่ย่อย จุกแน่นจากกรดเกิน',
    defaultDosage: '1-2 ช้อนโต๊ะ (15 ml)',
    availableDosages: ['15 ml', '1 ซอง'],
    suggestedFrequency: 'รับประทานวันละ 3-4 ครั้ง',
    suggestedMealTimings: ['หลังอาหาร', 'ก่อนนอน', 'เมื่อมีอาการ'],
    caution: 'ควรรับประทานหลังอาหาร 1 ชั่วโมง หรือก่อนนอน และเว้นระยะห่างจากยาอื่นอย่างน้อย 2 ชั่วโมง',
    instructions: 'เขย่าขวดก่อนรินยา และดื่มน้ำตามเล็กน้อย',
  },
  {
    id: 'domperidone',
    nameTH: 'ยาแก้คลื่นไส้อาเจียนและช่วยย่อย ดอมเพอริโดน (Domperidone / Motilium)',
    nameEN: 'Domperidone',
    aliases: ['Motilium', 'โมติเลียม', 'ดอมเพอริโดน', 'Domperidone 10'],
    category: 'ยาแก้คลื่นไส้และช่วยบีบตัวของกระเพาะ',
    indication: 'บรรเทาอาการคลื่นไส้ อาเจียน แน่นท้อง อาหารไม่ย่อย ท้องอืด',
    defaultDosage: '10 mg',
    availableDosages: ['10 mg'],
    suggestedFrequency: 'รับประทานวันละ 3 ครั้ง',
    suggestedMealTimings: ['เช้า', 'เที่ยง', 'เย็น', 'ก่อนอาหาร'],
    caution: 'ควรรับประทานก่อนอาหาร 15-30 นาที',
    instructions: 'รับประทานก่อนอาหารมื้อหลักเพื่อช่วยให้อาหารเคลื่อนตัวได้ดี',
  },

  // ==========================================
  // 7. กลุ่มยาแก้แพ้และระบบทางเดินหายใจ (Antihistamines & Respiratory)
  // ==========================================
  {
    id: 'cetirizine',
    nameTH: 'ยาแก้แพ้ เซทิริซีน (Cetirizine / Zyrtec)',
    nameEN: 'Cetirizine Dihydrochloride',
    aliases: ['Zyrtec', 'เซอร์เทค', 'เซทิริซีน', 'ยาแก้แพ้ไม่ง่วง', 'Cetirizine 10'],
    category: 'ยาแก้แพ้และบรรเทาอาการคัน',
    indication: 'บรรเทาอาการแพ้อากาศ คัดจมูก น้ำมูกไหล ผื่นคัน ลมพิษ',
    defaultDosage: '10 mg',
    availableDosages: ['10 mg'],
    suggestedFrequency: 'รับประทานวันละ 1 ครั้ง',
    suggestedMealTimings: ['ก่อนนอน', 'หลังอาหาร'],
    caution: 'อาจทำให้ง่วงซึมเล็กน้อยในบางราย ควรระวังเมื่อต้องขับขี่รถยนต์',
    instructions: 'รับประทานวันละ 1 เม็ดก่อนนอนหรือเมื่อมีอาการแพ้',
  },
  {
    id: 'loratadine',
    nameTH: 'ยาแก้แพ้ไม่ง่วง ลอราทาดีน (Loratadine / Claritin)',
    nameEN: 'Loratadine',
    aliases: ['Claritin', 'คลาริติน', 'ลอราทาดีน', 'Loratadine 10'],
    category: 'ยาแก้แพ้ (ไม่ง่วงซึม)',
    indication: 'บรรเทาอาการแพ้ จาม น้ำมูกไหล คันตา และผื่นคันจากภูมิแพ้',
    defaultDosage: '10 mg',
    availableDosages: ['10 mg'],
    suggestedFrequency: 'รับประทานวันละ 1 ครั้ง',
    suggestedMealTimings: ['เช้า', 'หลังอาหาร'],
    caution: 'หลีกเลี่ยงการรับประทานเกินขนาดที่กำหนด',
    instructions: 'รับประทานวันละ 1 เม็ดในเวลาเช้า',
  },
  {
    id: 'salbutamol',
    nameTH: 'ยาขยายหลอดลม ซัลบูทามอล (Salbutamol / Ventolin)',
    nameEN: 'Salbutamol Sulfate',
    aliases: ['Ventolin', 'เวนโทลิน', 'ซัลบูทามอล', 'ยาพ่นหอบ', 'ยาขยายหลอดลม'],
    category: 'ยาขยายหลอดลม / โรคหอบหืด',
    indication: 'บรรเทาอาการหายใจมีเสียงหวีด หอบเหนื่อย แน่นหน้าอก และหลอดลมหดเกร็ง',
    defaultDosage: '2 mg (เม็ด) หรือ 100 mcg (พ่น)',
    availableDosages: ['2 mg', '4 mg', '100 mcg / actuation'],
    suggestedFrequency: 'รับประทานวันละ 3 ครั้ง หรือพ่นเมื่อมีอาการ',
    suggestedMealTimings: ['เช้า', 'เที่ยง', 'เย็น', 'หลังอาหาร', 'เมื่อมีอาการ'],
    caution: 'อาจทำให้ใจสั่น มือสั่น หรือหัวใจเต้นเร็วชั่วคราว',
    instructions: 'กรณีใช้ยาพ่น ให้บ้วนปากด้วยน้ำสะอาดทุกครั้งหลังพ่นยา',
  },

  // ==========================================
  // 8. กลุ่มกระดูก ข้อ และวิตามินบำรุง (Bone, Joint & Supplements)
  // ==========================================
  {
    id: 'calcium_carbonate',
    nameTH: 'แคลเซียมคาร์บอเนต บำรุงกระดูกและฟัน (Calcium Carbonate + Vit D)',
    nameEN: 'Calcium Carbonate with Vitamin D',
    aliases: ['Caltrate', 'แคลเทรต', 'แคลเซียม', 'Calcium 1000', 'Calcium 600'],
    category: 'แร่ธาตุและวิตามินบำรุงกระดูก',
    indication: 'ป้องกันและรักษาโรคกระดูกพรุน เสริมสร้างมวลกระดูกในผู้สูงอายุ',
    defaultDosage: '1000 mg (แคลเซียม 400-600 mg)',
    availableDosages: ['600 mg', '1000 mg', '1500 mg'],
    suggestedFrequency: 'รับประทานวันละ 1-2 ครั้ง',
    suggestedMealTimings: ['เช้า', 'เย็น', 'หลังอาหาร'],
    caution: 'ควรรับประทานหลังอาหารทันทีเพื่อให้กรดในกระเพาะช่วยดูดซึม และดื่มน้ำตามมากๆ ป้องกันท้องผูก',
    instructions: 'รับประทานหลังอาหารมื้อเช้าหรือเย็นเป็นประจำ',
  },
  {
    id: 'glucosamine',
    nameTH: 'ยากลูโคซามีน บำรุงข้อเข่าเสื่อม (Glucosamine Sulfate)',
    nameEN: 'Glucosamine Sulfate',
    aliases: ['Viartril-S', 'เวียร์ทริล', 'กลูโคซามีน', 'ยาบำรุงข้อ'],
    category: 'ยารักษาโรคข้อเสื่อม',
    indication: 'ชะลอการเสื่อมของกระดูกอ่อนข้อเข่า และลดอาการปวดข้อเข่าเสื่อม',
    defaultDosage: '1500 mg (ซองละลายน้ำ)',
    availableDosages: ['500 mg', '1500 mg'],
    suggestedFrequency: 'รับประทานวันละ 1 ครั้ง',
    suggestedMealTimings: ['เช้า', 'ก่อนอาหาร', 'พร้อมอาหาร'],
    caution: 'ผู้ที่แพ้อาหารทะเลเปลือกแข็ง (กุ้ง ปู) ควรระมัดระวัง',
    instructions: 'ละลายผงยาในน้ำ 1 แก้ว ดื่มวันละ 1 ครั้งต่อเนื่องอย่างน้อย 3 เดือน',
  },
  {
    id: 'vitamin_b_complex',
    nameTH: 'วิตามินบีรวม บำรุงปลายประสาท (Vitamin B Complex / Neurobion)',
    nameEN: 'Vitamin B1-6-12 Complex',
    aliases: ['Neurobion', 'นูโรเบียน', 'วิตามินบีรวม', 'B-Complex'],
    category: 'วิตามินบำรุงระบบประสาท',
    indication: 'บำรุงปลายประสาท บรรเทาอาการเหน็บชา ปลายมือปลายเท้าชา',
    defaultDosage: '1 เม็ด',
    availableDosages: ['1 เม็ด'],
    suggestedFrequency: 'รับประทานวันละ 1-3 ครั้ง',
    suggestedMealTimings: ['เช้า', 'เที่ยง', 'เย็น', 'หลังอาหาร'],
    caution: 'อาจทำให้ปัสสาวะมีสีเหลืองเข้มขึ้น ซึ่งเป็นภาวะปกติไม่มีอันตราย',
    instructions: 'รับประทานหลังอาหารเป็นประจำ',
  },

  // ==========================================
  // 9. กลุ่มยารักษาโรคเกาต์ (Antigout)
  // ==========================================
  {
    id: 'allopurinol',
    nameTH: 'ยาลดกรดยูริก อัลโลพูรินอล (Allopurinol / Zyloric)',
    nameEN: 'Allopurinol',
    aliases: ['Zyloric', 'ไซโลริก', 'อัลโลพูรินอล', 'Allopurinol 100', 'Allopurinol 300'],
    category: 'ยารักษาโรคเกาต์ (ลดการสร้างกรดยูริก)',
    indication: 'ป้องกันการกำเริบของโรคเกาต์ และลดระดับกรดยูริกในเลือดระยะยาว',
    defaultDosage: '100 mg',
    availableDosages: ['100 mg', '300 mg'],
    suggestedFrequency: 'รับประทานวันละ 1 ครั้ง',
    suggestedMealTimings: ['เช้า', 'หลังอาหาร'],
    caution: 'หากมีผื่นคัน ตาบวม หรือมีไข้หลังเริ่มยา ให้หยุดยาทันทีและรีบพบแพทย์ (ตรวจยีน HLA-B*5801 ก่อนเริ่มยา)',
    instructions: 'ดื่มน้ำมากๆ วันละ 2-3 ลิตร เพื่อช่วยขับกรดยูริกและป้องกันนิ่วในไต',
  },
  {
    id: 'colchicine',
    nameTH: 'ยาแก้ปวดเกาต์เฉียบพลัน โคลชิซีน (Colchicine)',
    nameEN: 'Colchicine',
    aliases: ['Colchicine 0.6', 'โคลชิซีน', 'ยาเกาต์'],
    category: 'ยารักษาโรคเกาต์เฉียบพลัน',
    indication: 'บรรเทาอาการปวดข้ออักเสบเฉียบพลันจากโรคเกาต์',
    defaultDosage: '0.6 mg',
    availableDosages: ['0.6 mg'],
    suggestedFrequency: 'รับประทานวันละ 1-2 ครั้ง ตามอาการ',
    suggestedMealTimings: ['หลังอาหาร', 'เมื่อมีอาการ'],
    caution: 'หากมีอาการท้องเสีย ปวดเกร็งท้อง หรือคลื่นไส้รุนแรง ให้หยุดยาและแจ้งแพทย์',
    instructions: 'รับประทานทันทีเมื่อมีอาการปวดเกาต์กำเริบ',
  }
];

/**
 * Intelligent Drug Search & Linker Function
 * Matches user query across trade names, generic names, and aliases
 */
export function searchAndLinkDrugInfo(query: string): DrugDatabaseItem | null {
  if (!query || !query.trim()) return null;
  const cleanQ = query.toLowerCase().trim();

  // 1. Exact match on ID or Names
  const exact = DRUG_DATABASE.find(
    d =>
      d.id.toLowerCase() === cleanQ ||
      d.nameTH.toLowerCase() === cleanQ ||
      d.nameEN.toLowerCase() === cleanQ
  );
  if (exact) return exact;

  // 2. Exact match in aliases
  const aliasMatch = DRUG_DATABASE.find(d =>
    d.aliases.some(a => a.toLowerCase() === cleanQ)
  );
  if (aliasMatch) return aliasMatch;

  // 3. Substring / Partial match
  const partial = DRUG_DATABASE.find(
    d =>
      d.nameTH.toLowerCase().includes(cleanQ) ||
      d.nameEN.toLowerCase().includes(cleanQ) ||
      d.aliases.some(a => a.toLowerCase().includes(cleanQ))
  );
  if (partial) return partial;

  return null;
}

/**
 * Autocomplete suggestions for search dropdown
 */
export function getDrugSuggestions(query: string, limit = 8): DrugDatabaseItem[] {
  if (!query || !query.trim()) {
    return DRUG_DATABASE.slice(0, limit);
  }
  const q = query.toLowerCase().trim();
  return DRUG_DATABASE.filter(
    d =>
      d.nameTH.toLowerCase().includes(q) ||
      d.nameEN.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.indication.toLowerCase().includes(q) ||
      d.aliases.some(a => a.toLowerCase().includes(q))
  ).slice(0, limit);
}
