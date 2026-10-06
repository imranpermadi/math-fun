import { Operation } from '../../domain/enums';

/**
 * Text templates (not questions). Placeholders: {name}, {name2}, {A}, {B}.
 * Numbers are always injected at runtime by QuestionGeneratorService.
 */
export interface QuestionTemplate {
  text: string;
  unit: string;
}

export const NAMES_BOY = ['Ahmad', 'Umar', 'Ali', 'Yusuf', 'Ibrahim', 'Hamzah', 'Bilal', 'Zaid'];
export const NAMES_GIRL = ['Fatimah', 'Aisyah', 'Khadijah', 'Maryam', 'Zainab', 'Hafsah', 'Sumayyah'];

export const TEMPLATES: Record<Operation, QuestionTemplate[]> = {
  [Operation.Addition]: [
    { text: 'Bismillah. {name} memiliki {A} kurma. Ibunya memberi {B} kurma lagi. Berapa jumlah kurma {name} sekarang?', unit: 'kurma' },
    { text: '{name} membaca {A} halaman Iqra pagi hari dan {B} halaman sore hari. Berapa halaman yang {name} baca seluruhnya?', unit: 'halaman' },
    { text: 'Di masjid ada {A} sajadah di saf depan dan {B} sajadah di saf belakang. Berapa jumlah sajadah seluruhnya?', unit: 'sajadah' },
    { text: '{name} menabung {A} koin untuk sedekah Jumat, lalu menambah {B} koin. Berapa koin sedekah {name} sekarang?', unit: 'koin' },
  ],
  [Operation.Subtraction]: [
    { text: '{name} memiliki {A} kurma, lalu dibagikan saat buka puasa sebanyak {B} kurma. Berapa sisa kurma {name}?', unit: 'kurma' },
    { text: '{name} punya {A} koin. Sebanyak {B} koin diberikan sebagai sedekah kepada fakir miskin. Berapa sisa koin {name}?', unit: 'koin' },
    { text: 'Ada {A} sandal di depan masjid. {B} sandal sudah diambil jamaah pulang. Berapa sandal yang masih tersisa?', unit: 'sandal' },
    { text: '{name} menghafal {A} ayat. {B} ayat sudah lancar. Berapa ayat yang masih perlu dihafal?', unit: 'ayat' },
  ],
  [Operation.Multiplication]: [
    { text: '{name} membagikan {A} bungkus kurma. Setiap bungkus berisi {B} kurma. Berapa jumlah kurma seluruhnya?', unit: 'kurma' },
    { text: 'Setiap hari {name} membaca {B} ayat Al-Quran selama {A} hari. Berapa total ayat yang dibaca?', unit: 'ayat' },
    { text: 'Ada {A} saf di masjid. Setiap saf diisi {B} jamaah. Berapa jumlah jamaah seluruhnya?', unit: 'jamaah' },
    { text: '{name} menyiapkan {A} paket takjil. Tiap paket berisi {B} gorengan. Berapa jumlah gorengan seluruhnya?', unit: 'gorengan' },
  ],
  [Operation.Division]: [
    { text: '{name} membagi {A} kurma sama banyak kepada {B} anak yatim. Berapa kurma yang diterima setiap anak?', unit: 'kurma' },
    { text: '{A} paket sembako dibagikan sama rata kepada {B} keluarga dhuafa. Berapa paket untuk tiap keluarga?', unit: 'paket' },
    { text: '{name} menyusun {A} Al-Quran kecil ke dalam {B} rak sama banyak. Berapa Al-Quran di setiap rak?', unit: 'Al-Quran' },
    { text: '{A} butir kurma dibagi rata untuk {B} orang berbuka puasa. Berapa butir kurma tiap orang?', unit: 'butir' },
  ],
};

export function renderTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
}
