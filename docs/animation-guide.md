# Animation Guide for Selaras Landing Page

## Context

Selaras saat ini adalah landing page + waitlist untuk validasi demand. Tujuan utamanya bukan hiburan, tetapi membangun rasa percaya, kehangatan, dan keseriusan saat membahas topik hubungan, pernikahan, dan masa depan bersama.

Karena itu, animasi di project ini harus:

- membantu pengguna memahami hierarchy dan alur halaman
- memberi feedback yang jelas pada interaksi
- menambah rasa premium dan polished
- tetap terasa tenang, dewasa, dan meyakinkan

Animasi di project ini tidak boleh terasa terlalu ramai, terlalu playful, atau seperti kampanye promosi yang agresif.

## Product Personality

Gunakan tone motion berikut sebagai acuan utama:

- Warm
- Calm
- Intimate
- Reassuring
- Refined

Hindari tone berikut:

- Hyper-energetic
- Bouncy
- Gimmicky
- Over-celebratory
- Game-like

## Motion Goals

### Primary goals

1. Membuat first impression terasa lebih hidup tanpa mengganggu fokus pada copy dan CTA.
2. Memberi feedback pada tombol, form, dan state submit.
3. Membantu section reveal terasa natural saat user scroll.
4. Menjaga pengalaman tetap ringan di device mobile.

### Non-goals

- Bukan untuk membuat halaman terasa seperti entertainment product.
- Bukan untuk menunjukkan kemampuan animasi semata.
- Bukan untuk memenuhi setiap area dengan motion.
- Bukan untuk mengganti copy, layout, atau hierarchy yang seharusnya kuat sejak awal.

## Performance Constraints

Karena ini landing page marketing ringan dengan target audience luas, performance budget harus ketat.

- Mobile-first.
- Prioritaskan LCP dan responsiveness.
- Gunakan CSS transitions / keyframes terlebih dahulu.
- Hindari menambah library animasi besar jika belum benar-benar perlu.
- Animasi harus dominan memakai `transform` dan `opacity`.
- Hindari animasi kontinu yang berjalan tanpa alasan.
- Hindari animasi layout seperti `width`, `height`, `top`, `left`.
- Jika perlu scroll reveal, gunakan IntersectionObserver ringan, bukan scroll event berat.

## Current Project Structure

Lokasi penting untuk implementasi motion:

- `src/routes/+page.svelte` - animasi per section, button states, form states, scroll reveal
- `src/routes/+layout.svelte` - motion tokens global, easing, reduced motion rules, theme-level behavior
- `src/lib/assets/asset-1.png` - hero image yang bisa ikut diberi entrance treatment ringan

Catatan: project ini saat ini memakai SvelteKit + CSS lokal di file Svelte, bukan Tailwind.

## Motion Strategy Summary

Gunakan pendekatan 4 layer berikut.

### 1. Hero moment

Satu momen utama yang paling terasa saat halaman pertama kali dibuka.

Rekomendasi:

- hero copy muncul bertahap
- hero image masuk sedikit terlambat dari text
- CTA muncul paling akhir sebagai penekanan fokus

Tujuan:

- memperjelas urutan perhatian user
- membuat halaman terasa lebih premium
- tetap menjaga tone tenang

### 2. Feedback layer

Animasi kecil untuk memberi konfirmasi bahwa interaksi sedang atau sudah terjadi.

Rekomendasi:

- hover dan press state untuk tombol
- focus transition untuk input
- disabled/loading state untuk submit button
- success/error feedback yang halus setelah submit

### 3. Transition layer

Membuat perpindahan state tidak terasa kaku.

Rekomendasi:

- section reveal saat scroll
- card reveal stagger tipis
- smooth color/shadow transition di elemen interaktif

### 4. Delight layer

Hanya dipakai sangat hemat.

Rekomendasi:

- sedikit lift pada card tertentu
- shadow shift halus pada CTA utama
- micro-depth pada hero image frame

## Animation Principles for This Project

### One signature moment is enough

Landing page ini tidak butuh banyak hero animation. Satu load choreography yang rapi lebih baik daripada motion tersebar di semua tempat.

### Motion must support content

Copy adalah inti halaman ini. Motion harus membantu user membaca dan memahami, bukan mencuri perhatian.

### Serious does not mean static

Halaman yang serius tetap boleh punya motion, asalkan subtle dan intentional.

### Calm beats flashy

Jika ragu antara animasi lebih besar vs lebih tenang, pilih yang lebih tenang.

## Recommended Motion by Section

## 1. Header

### Recommended

- tombol CTA punya hover lift kecil
- icon buttons punya color + shadow transition
- optional: header background sedikit lebih solid saat user scroll ke bawah

### Avoid

- sticky header yang terlalu aktif
- nav items dengan underline animation yang terlalu mencolok
- icon bounce

### Suggested timing

- hover: 160ms - 220ms
- press: 100ms - 140ms

## 2. Hero Section

Ini adalah signature motion utama.

### Recommended sequence

1. eyebrow pill fade + rise
2. headline fade + rise
3. paragraph fade + rise
4. CTA buttons fade + rise
5. support copy fade
6. hero image fade + slight scale in

### Motion character

- terasa lembut dan yakin
- tidak dramatis berlebihan
- tidak pakai bounce

### Suggested timing

- total sequence: 500ms - 800ms
- stagger antar item: 80ms - 140ms
- image delay: sedikit setelah text mulai terlihat

### Avoid

- parallax besar di hero
- floating image terus-menerus
- rotating shapes dekoratif berlebihan

## 3. Problem Section

### Recommended

- note cards reveal saat masuk viewport
- stagger tipis antar card
- icon color transition saat card di-hover pada desktop

### Why

Section ini berisi problem statement. Motion cukup untuk mengarahkan baca, bukan untuk menjadi pusat perhatian.

### Avoid

- dramatic slide-in dari samping yang terlalu panjang
- card jump atau bounce

## 4. How It Works Section

### Recommended

- tiap step card reveal saat masuk viewport
- preview panel fade + slight rotate settle
- hover card lift sangat kecil di desktop

### Why

Section ini menjelaskan flow produk. Motion bisa membantu menjelaskan urutan dan hubungan antar elemen.

### Avoid

- animasi berantai yang terlalu lama
- mockup bergerak terus-menerus

## 5. Topics Section

### Recommended

- grid topic cards reveal dengan stagger ringan
- hover state: naik 2px, shadow bertambah sedikit, icon background menguat

### Why

Section ini bisa menerima sedikit rasa playful, tapi tetap harus sopan dan terkontrol.

### Avoid

- card tilt besar
- icon spin
- pulse loop tanpa trigger

## 6. Waitlist / CTA Section

Ini area kedua paling penting setelah hero.

### Recommended

- CTA panel reveal halus saat masuk viewport
- form fields punya focus ring transition yang refined
- submit button punya loading state jelas
- success state muncul dengan fade + slight upward motion
- error state muncul cepat dan jelas tanpa shake berlebihan

### Optional

- success icon flourish kecil jika nanti ditambahkan icon status

### Avoid

- confetti
- success animation yang terlalu celebratory
- error shake besar yang terasa kasar untuk brand ini

## 7. Footer

### Recommended

- cukup hover state pada links

### Avoid

- reveal animation berat
- decorative motion yang tidak menambah value

## Motion Tokens

Disarankan mendefinisikan token motion di `src/routes/+layout.svelte` agar konsisten.

```css
:global(:root) {
  --motion-fast: 140ms;
  --motion-base: 220ms;
  --motion-slow: 420ms;
  --motion-hero: 620ms;

  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Recommended Timing Rules

Gunakan range ini sebagai standar.

- `100ms - 150ms` untuk press feedback
- `160ms - 240ms` untuk hover / focus / icon state
- `220ms - 320ms` untuk state changes biasa
- `400ms - 650ms` untuk hero entrance atau reveal penting

Exit motion harus lebih cepat dari entrance, kira-kira 70% - 80% dari durasi masuk.

## Recommended Easing Rules

Gunakan easing yang halus dan terasa refined.

- `cubic-bezier(0.25, 1, 0.5, 1)`
- `cubic-bezier(0.22, 1, 0.36, 1)`
- `cubic-bezier(0.16, 1, 0.3, 1)`

Hindari:

- bounce easing
- elastic easing
- linear easing untuk UI transitions

## Accessibility Requirements

`prefers-reduced-motion` wajib dihormati.

### Minimum requirement

- nonaktifkan entrance animation yang panjang
- hilangkan stagger jika user memilih reduced motion
- pertahankan state changes instan atau hampir instan
- jangan membuat informasi penting hanya terlihat melalui motion

Contoh baseline:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Implementation Recommendation

## Phase 1: CSS-only foundation

Kerjakan ini dulu sebelum menambah JS.

- tambah motion tokens global
- tambah hover/press/focus transitions
- tambah hero entrance sederhana via class-based animation
- tambah submit/loading/success/error transitions

Kenapa: paling ringan, cepat, dan cukup untuk kebutuhan halaman ini.

## Phase 2: Scroll reveal ringan

Jika ingin sedikit lebih polished, tambahkan reveal berbasis IntersectionObserver.

Disarankan membuat helper kecil seperti:

- `src/lib/actions/reveal.ts`

Pattern yang aman:

- elemen mulai dari opacity 0 + translateY kecil
- saat visible, tambahkan class `is-visible`
- gunakan stagger hanya di grid/card groups

## Phase 3: Optional enhancements

Hanya jika Phase 1 dan 2 sudah terasa tepat.

- header state saat scroll
- image frame depth transition
- preview panel settle animation yang lebih refined

## Suggested Implementation Sketch

### Reveal pattern

```css
.reveal {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity var(--motion-slow) var(--ease-out-quart),
    transform var(--motion-slow) var(--ease-out-quart);
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Button feedback

```css
.cta-button,
.secondary-button,
.icon-link,
button {
  transition:
    transform var(--motion-base) var(--ease-out-quart),
    box-shadow var(--motion-base) var(--ease-out-quart),
    background-color var(--motion-base) var(--ease-out-quart),
    border-color var(--motion-base) var(--ease-out-quart),
    color var(--motion-base) var(--ease-out-quart);
}

.cta-button:hover,
.secondary-button:hover,
.icon-link:hover,
button:hover {
  transform: translateY(-1px);
}

.cta-button:active,
.secondary-button:active,
.icon-link:active,
button:active {
  transform: translateY(0) scale(0.985);
}
```

### Input feedback

```css
input {
  transition:
    border-color var(--motion-base) var(--ease-out-quart),
    box-shadow var(--motion-base) var(--ease-out-quart),
    transform var(--motion-fast) var(--ease-out-quart);
}

input:focus {
  transform: translateY(-1px);
}
```

## What Not to Animate

Bagian berikut sebaiknya tidak diberi motion tambahan atau hanya sangat minimal:

- footer container
- body background secara terus-menerus
- paragraph text per kata / per huruf
- setiap card sekaligus di semua section
- layout shifts yang mengubah posisi baca user

## Anti-Patterns for Selaras

Jangan lakukan ini pada brand Selaras:

- bouncy CTA
- confetti saat submit waitlist
- looping floating animations di hero image
- pulse loop pada semua cards
- exaggerated tilt pada hover
- heavy parallax
- delay terlalu panjang sampai UI terasa lambat
- animasi yang lebih dominan dari copy

## QA Checklist

Sebelum animasi dianggap selesai, cek ini:

### Visual quality

- Apakah motion terasa tenang dan refined?
- Apakah CTA tetap jadi fokus utama?
- Apakah hierarchy baca jadi lebih jelas?

### Performance

- Apakah animasi tetap halus di mobile?
- Apakah hanya `transform` dan `opacity` yang dominan dianimasikan?
- Apakah tidak ada layout jank?

### Accessibility

- Apakah `prefers-reduced-motion` bekerja?
- Apakah focus states tetap jelas tanpa bergantung pada motion?
- Apakah feedback success/error tetap terbaca walau animasi dimatikan?

### UX

- Apakah submit terasa lebih jelas?
- Apakah reveal membantu orientasi, bukan malah menghambat baca?
- Apakah tidak ada bagian yang terasa terlalu ramai?

## Recommended Rollout Order

Jika nanti ingin implement bertahap, urutan terbaik adalah:

1. motion tokens global
2. button + input micro-interactions
3. hero entrance choreography
4. waitlist submit feedback
5. section reveal on scroll
6. optional header scroll state

## Final Recommendation

Untuk Selaras, motion terbaik adalah motion yang hampir tidak disadari user, tetapi membuat halaman terasa lebih lembut, lebih jelas, dan lebih premium.

Prinsip akhirnya sederhana:

- animasikan yang penting
- percepat yang interaktif
- lembutkan yang transisional
- hilangkan yang dekoratif berlebihan

Jika ragu, pilih versi animasi yang lebih tenang.
