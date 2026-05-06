import React, { useState, useMemo, useEffect, createContext, useContext } from 'react';
import {
  LayoutDashboard, Users, BookOpen, Eye, Target, Activity, ClipboardCheck,
  BarChart3, Calendar, Bell, Search, Filter, Download, ChevronRight,
  TrendingUp, TrendingDown, CheckCircle2, Clock, AlertCircle, ArrowRight, ArrowLeft,
  User, Shield, Sparkles, FileText, Settings, LogOut, ChevronDown,
  Circle, Star, MessageSquare, Award, Briefcase, GraduationCap,
  Building2, PieChart, PlayCircle, Upload, Plus, MoreVertical, X, Check,
  FileSpreadsheet, Send, RefreshCw, Edit3, Info, ThumbsUp, UserCheck, Lock,
  Trash2, UserPlus, Mail
} from 'lucide-react';

// =====================================================================
// THEME & CONSTANTS
// =====================================================================
const theme = {
  navy: '#0A2540',
  navyLight: '#153858',
  navyDark: '#061729',
  gold: '#B8935A',
  goldLight: '#D4B77E',
  goldDark: '#8E6F3E',
  bg: '#F5F6F8',
  surface: '#FFFFFF',
  border: '#E2E5EA',
  borderStrong: '#CDD2DA',
  text: '#0F172A',
  textMuted: '#5A6473',
  textSubtle: '#8B94A3',
  success: '#0F766E',
  successBg: '#ECFDF5',
  warning: '#B45309',
  warningBg: '#FEF3C7',
  danger: '#B91C1C',
  dangerBg: '#FEF2F2',
  info: '#1D4ED8',
  infoBg: '#EFF6FF',
};

const fonts = {
  display: "'Source Serif Pro', Georgia, 'Times New Roman', serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
};

// =====================================================================
// ROLES
// =====================================================================
// =====================================================================
// ROLE DEFINITIONS — karakteristik setiap role (label, icon, tanpa user)
// =====================================================================
const ROLE_DEFS = {
  admin:   { id: 'admin',   nama: 'Admin DSDM', label: 'Administrator Departemen SDM',  icon: Shield,        color: '#0A2540' },
  mentor:  { id: 'mentor',  nama: 'Mentor',     label: 'Coach / Mentor (atasan peserta)', icon: Sparkles,      color: '#B8935A' },
  peserta: { id: 'peserta', nama: 'Peserta',    label: 'Peserta Program Coaching',         icon: GraduationCap, color: '#0F766E' },
  board:   { id: 'board',   nama: 'Pimpinan',   label: 'Executive / Board Viewer',          icon: Briefcase,     color: '#B45309' },
};

// =====================================================================
// USERS — master user data (dari Azure AD / BI HRIS)
// Setiap user memiliki: roles[] (peran apa saja), programs[] (program apa yang diikuti)
// =====================================================================
const USERS = {
  u001: {
    id: 'u001', user: 'Dr. Ratna Kusumaningrum', nip: '197504221999032001',
    jabatan: 'Kepala Divisi Pengembangan SDM', satker: 'DSDM — Departemen Sumber Daya Manusia',
    short: 'RK', roles: ['admin'], programs: ['diksi', 'mentoringKpp', 'coachingLm', 'groupSupport'], // admin lihat semua program
  },
  u002: {
    // Yanuar Pradipta — multi-role: Mentor (juga bisa jadi peserta program lain)
    id: 'u002', user: 'Yanuar Pradipta, M.Psi', nip: '198209152010031002',
    jabatan: 'Deputi Direktur DKEM', satker: 'DKEM — Departemen Kebijakan Ekonomi & Moneter',
    short: 'YP', roles: ['mentor'], programs: ['diksi'],
  },
  u003: {
    id: 'u003', user: 'Dr. Hendra Wijaya', nip: '196812041995031001',
    jabatan: 'Direktur DKMP', satker: 'DKMP — Departemen Kebijakan Makroprudensial',
    short: 'HW', roles: ['mentor'], programs: ['diksi'],
  },
  u004: {
    id: 'u004', user: 'Arif Budiman Pratama', nip: '199203142018031001',
    jabatan: 'Manajer', satker: 'DKEM — Departemen Kebijakan Ekonomi & Moneter',
    short: 'AB', roles: ['peserta'], programs: ['diksi'],
  },
  u005: {
    id: 'u005', user: 'Ir. Soedarjono, MSc', nip: '196403181988031001',
    jabatan: 'Deputi Gubernur BI', satker: 'Dewan Gubernur Bank Indonesia',
    short: 'SD', roles: ['board'], programs: ['diksi', 'mentoringKpp', 'coachingLm', 'groupSupport'],
  },
};

// =====================================================================
// ROLES — backward compat (mapping role → user representatif untuk landing)
// =====================================================================
const ROLES = {
  admin:   { ...ROLE_DEFS.admin,   user: USERS.u001.user, nip: USERS.u001.nip, jabatan: USERS.u001.jabatan, satker: USERS.u001.satker, short: USERS.u001.short, userId: 'u001' },
  mentor:  { ...ROLE_DEFS.mentor,  user: USERS.u002.user, nip: USERS.u002.nip, jabatan: USERS.u002.jabatan, satker: USERS.u002.satker, short: USERS.u002.short, userId: 'u002' },
  peserta: { ...ROLE_DEFS.peserta, user: USERS.u004.user, nip: USERS.u004.nip, jabatan: USERS.u004.jabatan, satker: USERS.u004.satker, short: USERS.u004.short, userId: 'u004' },
  board:   { ...ROLE_DEFS.board,   user: USERS.u005.user, nip: USERS.u005.nip, jabatan: USERS.u005.jabatan, satker: USERS.u005.satker, short: USERS.u005.short, userId: 'u005' },
};

// =====================================================================
// STAGES (7 tahapan — revisi DSDM)
// =====================================================================
// =====================================================================
// 7 TAHAP — Revisi sesuai dokumen DSDM
// Scope mockup: Tahap 1-3 fully functional, Tahap 4-7 placeholder
// =====================================================================
const STAGES = [
  { id: 1, key: 'registrasi',   nama: 'Registrasi',   tipe: 'KUANTITATIF', icon: Upload,       desc: 'Konfirmasi peserta & check-in saat kegiatan',  actor: 'Peserta', built: true },
  { id: 2, key: 'sosialisasi',  nama: 'Sosialisasi',  tipe: 'KUANTITATIF', icon: BookOpen,     desc: 'Pretest & Posttest',                            actor: 'Peserta', built: true },
  { id: 3, key: 'coaching',     nama: 'Coaching',     tipe: 'KUALITATIF',  icon: Sparkles,     desc: '1-on-1 coaching dengan mentor',                 actor: 'Peserta + Mentor', built: true },
  { id: 4, key: 'monitoring1',  nama: 'Monitoring 1', tipe: 'KUALITATIF',  icon: Activity,     desc: 'Akan dibahas pada iterasi berikutnya',         actor: 'TBD', built: false },
  { id: 5, key: 'monitoring2',  nama: 'Monitoring 2', tipe: 'KUALITATIF',  icon: Activity,     desc: 'Akan dibahas pada iterasi berikutnya',         actor: 'TBD', built: false },
  { id: 6, key: 'monitoring3',  nama: 'Monitoring 3', tipe: 'KUANTITATIF', icon: Star,         desc: 'Akan dibahas pada iterasi berikutnya',         actor: 'TBD', built: false },
  { id: 7, key: 'evaluasi',     nama: 'Evaluasi',     tipe: '3-TIER',      icon: ClipboardCheck, desc: 'Akan dibahas pada iterasi berikutnya',       actor: 'TBD', built: false },
];

// =====================================================================
// PROGRAMS — 4 program coaching DSDM, hanya DIKSI yang available
// =====================================================================
const PROGRAMS = {
  diksi:        { id: 'diksi',        nama: 'DIKSI',                kode: 'DIKSI',     deskripsi: 'Pengembangan kapasitas leadership untuk talenta KPP', icon: GraduationCap, color: '#0A2540', status: 'active' },
  mentoringKpp: { id: 'mentoringKpp', nama: 'Mentoring PCMP',       kode: 'PCMP',      deskripsi: 'Mentoring PCMP, KPP, & PTB',                          icon: Users,         color: '#7C3AED', status: 'coming_soon' },
  coachingLm:   { id: 'coachingLm',   nama: 'Coaching for LM',      kode: 'LM',        deskripsi: 'Program coaching khusus Line Manager',                icon: UserCheck,     color: '#0F766E', status: 'coming_soon' },
  groupSupport: { id: 'groupSupport', nama: 'Group Support',        kode: 'GS',        deskripsi: 'Forum sharing & peer support antar talenta',          icon: MessageSquare, color: '#B45309', status: 'coming_soon' },
};

// =====================================================================
// BATCHES — Periode/angkatan DIKSI
// =====================================================================
const seedBatches = () => [
  { id: 'B2026S1', kode: 'DIKSI-2026-01', nama: 'DIKSI Batch 1 · 2026', tanggalMulai: '2026-01-15', tanggalSelesai: '2026-06-30', status: 'active', pesertaIds: ['P001','P002','P003','P004','P005','P006'] },
  { id: 'B2025S2', kode: 'DIKSI-2025-02', nama: 'DIKSI Batch 2 · 2025', tanggalMulai: '2025-07-15', tanggalSelesai: '2025-12-15', status: 'completed', pesertaIds: [] },
  { id: 'B2025S1', kode: 'DIKSI-2025-01', nama: 'DIKSI Batch 1 · 2025', tanggalMulai: '2025-01-15', tanggalSelesai: '2025-06-30', status: 'completed', pesertaIds: [] },
];

// =====================================================================
// MENTORS — Pool mentor yang dikelola admin (atasan peserta yang qualify)
// =====================================================================
const seedMentors = () => [
  { id: 'M001', nip: '198209152010031002', nama: 'Yanuar Pradipta, M.Psi',     jabatan: 'Deputi Direktur',       satker: 'DKEM', email: 'yanuar.pradipta@bi.go.id', kompetensi: 'Strategic Leadership · Economic Policy', tahunMenjabat: 2018, aktif: true,  userId: 'u002' },
  { id: 'M002', nip: '196812041995031001', nama: 'Dr. Hendra Wijaya',           jabatan: 'Direktur',              satker: 'DKMP', email: 'hendra.wijaya@bi.go.id',  kompetensi: 'Macroprudential · Risk Management',     tahunMenjabat: 2015, aktif: true,  userId: 'u003' },
  { id: 'M003', nip: '197306182001031003', nama: 'Bambang Suryanto, MBA',       jabatan: 'Deputi Direktur',       satker: 'DSPR', email: 'bambang.suryanto@bi.go.id', kompetensi: 'Payment System · Digital Innovation',  tahunMenjabat: 2019, aktif: true,  userId: null },
  { id: 'M004', nip: '198104232006031001', nama: 'Lisa Anindita, MM',           jabatan: 'Asisten Direktur',       satker: 'DKOM', email: 'lisa.anindita@bi.go.id',    kompetensi: 'Communication · Stakeholder Engagement', tahunMenjabat: 2020, aktif: true,  userId: null },
  { id: 'M005', nip: '197505102000031001', nama: 'Ir. Rudi Hermawan, M.Sc',     jabatan: 'Deputi Direktur',       satker: 'DSta', email: 'rudi.hermawan@bi.go.id',    kompetensi: 'Statistics · Data Governance',          tahunMenjabat: 2017, aktif: false, userId: null },
];

// =====================================================================
// CRITERIA — Untuk seleksi peserta DIKSI (ref: dokumen DSDM)
// =====================================================================
const CRITERIA_OPTIONS = {
  statusPegawai: { label: 'Status Pegawai', options: ['KPP', 'Non-KPP'] },
  tipeSatker:    { label: 'Tipe Satker',    options: ['KP (Kantor Pusat)', 'KPW (Kantor Perwakilan)'] },
  jobFamily:     { label: 'Job Family',     options: ['Ekonom', 'Pengawas Bank', 'Sistem Pembayaran', 'Komunikasi', 'Hukum', 'Statistik', 'Manajemen Strategis'] },
  statusNK:      { label: 'Status NK',      options: ['Upper', 'Lower'] },
  smdMin:        { label: 'Sisa Masa Dinas (Minimum)', options: ['2 tahun', '3 tahun', '5 tahun'] },
};

// =====================================================================

// =====================================================================
// INITIAL SEED DATA - realistic BI naming
// =====================================================================
const SATKER_OPTIONS = ['DKEM', 'DKMP', 'DSPR', 'DKOM', 'DHK', 'DSDM', 'DKMK', 'DSTA'];


const seedParticipants = () => [
  {
    id: 'P001', nip: '199203142018031001', nama: 'Arif Budiman Pratama', satker: 'DKEM',
    tipeSatker: 'KP', jobFamily: 'Ekonom', pangkat: 'Manajer',
    statusPegawai: 'KPP', statusNK: 'Upper', smdTahun: 8,
    mentorUserId: 'u002', batchId: 'B2026S1', konfirmasiHadir: 'confirmed',
    stage: 3, status: 'active',
    stageData: {
      registrasi:  { status: 'completed', registeredAt: '2026-01-15', checkInAt: '2026-01-18 09:05' },
      sosialisasi: { status: 'completed', pretestScore: 78, posttestScore: 92, completedAt: '2026-01-22', pretestVisible: true, posttestVisible: true },
      coaching:    { status: 'in_progress', sesi: 1, mentorEvaluation: null, pesertaSurvey: null,
        sessions: [
          { id: 'CS001', tanggal: '2026-05-15', waktu: '14:00', durasi: 60, lokasi: 'Online · Microsoft Teams', topik: 'Strategic thinking & decision-making leadership', status: 'proposed', proposedBy: 'mentor', proposedAt: '2026-04-26', notes: 'Mohon konfirmasi ketersediaan. Bisa adjust kalau jadwal bentrok.' },
        ] },
      monitoring1: { status: 'pending' },
      monitoring2: { status: 'pending' },
      monitoring3: { status: 'pending' },
      evaluasi:    { status: 'pending' },
    }
  },
  {
    id: 'P002', nip: '198807252015022003', nama: 'Siti Rahmawati Dewi', satker: 'DKMP',
    tipeSatker: 'KP', jobFamily: 'Pengawas Bank', pangkat: 'Manajer',
    statusPegawai: 'KPP', statusNK: 'Upper', smdTahun: 12,
    mentorUserId: 'u003', batchId: 'B2026S1', konfirmasiHadir: 'confirmed',
    stage: 7, status: 'active',
    stageData: {
      registrasi:  { status: 'completed', registeredAt: '2026-01-15', checkInAt: '2026-01-18 08:55' },
      sosialisasi: { status: 'completed', pretestScore: 85, posttestScore: 95, completedAt: '2026-01-20', pretestVisible: true, posttestVisible: true },
      coaching:    { status: 'completed', sesi: 1,
        mentorEvaluation: { strengths: 'Analitis tajam, kepemimpinan kuat.', development: 'Strategic delegation perlu diperdalam.', recommendation: 'Lanjut ke tahap monitoring.', evaluatedAt: '2026-02-15' },
        pesertaSurvey: { mentorEffectiveness: 9, sessionQuality: 9, comment: 'Sesi sangat membantu dalam memetakan peluang growth.', submittedAt: '2026-02-16' },
        sessions: [
          { id: 'CS002', tanggal: '2026-02-14', waktu: '10:00', durasi: 60, lokasi: 'Offline · R. Coaching DSDM Lt.5', topik: 'Macroprudential leadership & risk-taking', status: 'completed', proposedBy: 'mentor', proposedAt: '2026-02-05', acceptedAt: '2026-02-06', completedAt: '2026-02-14 11:05', teamsLink: 'https://teams.microsoft.com/l/meetup-join/meet-CS002-mock' },
        ] },
      monitoring1: { status: 'completed', submittedAt: '2026-03-15',
        tindakLanjut: 'Telah memulai inisiatif "macroprudential analytics dashboard" bersama tim DKMP. Sudah identifikasi 3 use case prioritas dan menyusun timeline 3-bulan. Selain itu, mulai praktik delegasi yang lebih strategis kepada tim — fokus pada outcome bukan task.',
        kendala: 'Beban operasional harian masih cukup tinggi sehingga sulit alokasi waktu khusus untuk strategic initiative. Tim juga masih perlu adaptasi dengan style delegasi baru.',
        dukungan: 'Mentoring lanjutan dari Pak Hendra terkait prioritization framework. Akses ke data tools yang lebih advanced untuk mendukung dashboard project. Buy-in dari Direktur untuk dedicate 20% waktu ke initiative ini.',
        pelatihan: 'Strategic Decision-Making Workshop (April 2026) · Advanced Risk Analytics (planned Q3)',
        sertifikasi: 'CFA Level 3 (sedang persiapan, target Juni 2026)',
        kepanitiaan: 'Anggota Tim Penyusun Kebijakan Makroprudensial 2026',
        lainnya: 'Aktif sharing insight di forum internal DKMP setiap 2 minggu sekali, sebagai bagian dari knowledge transfer ke tim.'
      },
      monitoring2: { status: 'completed', submittedAt: '2026-04-20',
        manfaat: 9,
        bertumbuh: 9,
        rekomendasi: 10,
        saran: 'Proses follow-up sudah cukup baik. Mungkin bisa ditambah peer-learning session antar peserta DIKSI untuk saling sharing best practice tindak lanjut. Format quarterly check-in dengan grup kecil akan sangat membantu.',
        bersedia_fasilitator: 'Ya',
        bersedia_pembekalan: 'Ya'
      },
      monitoring3: { status: 'completed', submittedAt: '2026-05-25',
        kategori_perubahan: 'transformatif',
        elaborasi_perubahan: 'Setelah 6 bulan mengikuti DIKSI, perubahan terbesar adalah dalam cara saya melihat decision-making. Dulu sangat operational dan reaktif, sekarang lebih banyak menggunakan strategic frame: tanya "kenapa" sebelum "apa". Confidence dalam taking calculated risks juga meningkat signifikan.',
        kategori_pencapaian: 'melampaui',
        elaborasi_pencapaian: 'Berhasil men-deliver macroprudential analytics dashboard fase 1 yang sekarang dipakai di 3 satker. Promosi internal sebagai Lead Working Group Krisis Manajemen. Mentoring 2 junior staff dengan structured approach yang dipelajari dari sesi coaching.',
        kategori_pembelajaran: 'sangat_mendalam',
        elaborasi_pembelajaran: 'Pembelajaran utama: leadership bukan tentang punya semua jawaban, tapi tentang ask better questions. Style delegasi yang strategic ternyata membuat tim lebih mature dan ownership-driven. Vulnerability sebagai leader (mengakui tidak tahu) justru meningkatkan trust.',
        kategori_kedepan: 'sangat_jelas',
        elaborasi_kedepan: 'Ke depan ingin lebih dalam di area systemic risk modeling dan cross-border policy coordination. Ambisi 3-5 tahun: berkontribusi di level kebijakan ASEAN melalui forum regional banking supervisors.'
      },
      evaluasi:    { status: 'completed', submittedAt: '2026-06-10',
        skor_program: 9,
        skor_mentor: 10,
        kebermanfaatan: 9,
        feedback_program: 'DIKSI adalah salah satu program pengembangan paling impactful yang pernah saya ikuti di BI. Struktur 7-tahap yang gradual membantu sustained behavior change, bukan hanya knowledge transfer. Kombinasi 1-on-1 coaching + monitoring berkala memastikan akuntabilitas tindak lanjut. Material wiki dan QNA inbox juga sangat helpful sebagai pendamping di luar sesi.',
        feedback_mentor: 'Pak Hendra adalah mentor exceptional. Beliau sangat skilled dalam asking powerful questions yang membuat saya self-discover insights, bukan hanya menerima nasihat. Pengalaman beliau di macroprudential dan risk management sangat relevan dengan growth area saya. Sangat patient dan structured dalam approach-nya.',
        rekomendasi_perbaikan: 'Saran: tambahkan optional peer-coaching session antar peserta yang seangkatan untuk lateral learning. Plus, sediakan toolkit/template untuk facilitate self-application di tempat kerja antar sesi.'
      },
    }
  },
  {
    id: 'P003', nip: '199105102019031005', nama: 'Bagus Kurniawan Saputra', satker: 'KPwBI Lampung',
    tipeSatker: 'KPW', jobFamily: 'Sistem Pembayaran', pangkat: 'Asisten Manajer',
    statusPegawai: 'KPP', statusNK: 'Lower', smdTahun: 7,
    mentorUserId: 'u002', batchId: 'B2026S1', konfirmasiHadir: 'confirmed',
    stage: 2, status: 'active',
    stageData: {
      registrasi:  { status: 'completed', registeredAt: '2026-01-15', checkInAt: '2026-01-18 09:12' },
      sosialisasi: { status: 'in_progress', pretestScore: 78, posttestScore: null, completedAt: null, pretestVisible: true, posttestVisible: true },
      coaching:    { status: 'pending' },
      monitoring1: { status: 'pending' },
      monitoring2: { status: 'pending' },
      monitoring3: { status: 'pending' },
      evaluasi:    { status: 'pending' },
    }
  },
  {
    id: 'P004', nip: '198512082014031002', nama: 'Dewi Kusuma Ningrum', satker: 'DSPR',
    tipeSatker: 'KP', jobFamily: 'Sistem Pembayaran', pangkat: 'Deputi Direktur',
    statusPegawai: 'KPP', statusNK: 'Upper', smdTahun: 14,
    mentorUserId: 'u003', batchId: 'B2026S1', konfirmasiHadir: 'confirmed',
    stage: 3, status: 'active',
    stageData: {
      registrasi:  { status: 'completed', registeredAt: '2026-01-15', checkInAt: '2026-01-18 08:48' },
      sosialisasi: { status: 'completed', pretestScore: 88, posttestScore: 96, completedAt: '2026-01-18', pretestVisible: true, posttestVisible: true },
      coaching:    { status: 'in_progress', sesi: 1, mentorEvaluation: null, pesertaSurvey: null,
        sessions: [
          { id: 'CS004', tanggal: '2026-05-08', waktu: '09:30', durasi: 60, lokasi: 'Online · Microsoft Teams', topik: 'Payment system innovation roadmap', status: 'accepted', proposedBy: 'mentor', proposedAt: '2026-04-22', acceptedAt: '2026-04-23', teamsLink: 'https://teams.microsoft.com/l/meetup-join/meet-CS004-mock' },
        ] },
      monitoring1: { status: 'pending' },
      monitoring2: { status: 'pending' },
      monitoring3: { status: 'pending' },
      evaluasi:    { status: 'pending' },
    }
  },
  {
    id: 'P005', nip: '199309162020032004', nama: 'Fajar Maulana Rizki', satker: 'DKMP',
    tipeSatker: 'KP', jobFamily: 'Manajemen Strategis', pangkat: 'Asisten Manajer',
    statusPegawai: 'KPP', statusNK: 'Lower', smdTahun: 6,
    mentorUserId: 'u003', batchId: 'B2026S1', konfirmasiHadir: 'pending',
    stage: 1, status: 'active',
    stageData: {
      registrasi:  { status: 'in_progress', registeredAt: '2026-01-15', checkInAt: null },
      sosialisasi: { status: 'pending' },
      coaching:    { status: 'pending' },
      monitoring1: { status: 'pending' },
      monitoring2: { status: 'pending' },
      monitoring3: { status: 'pending' },
      evaluasi:    { status: 'pending' },
    }
  },
  {
    id: 'P006', nip: '199407232021032005', nama: 'Nadia Alya Salsabila', satker: 'DKOM',
    tipeSatker: 'KP', jobFamily: 'Komunikasi', pangkat: 'Asisten Manajer',
    statusPegawai: 'KPP', statusNK: 'Lower', smdTahun: 5,
    mentorUserId: 'u002', batchId: 'B2026S1', konfirmasiHadir: 'pending',
    stage: 1, status: 'active',
    stageData: {
      registrasi:  { status: 'pending', registeredAt: null, checkInAt: null },
      sosialisasi: { status: 'pending' },
      coaching:    { status: 'pending' },
      monitoring1: { status: 'pending' },
      monitoring2: { status: 'pending' },
      monitoring3: { status: 'pending' },
      evaluasi:    { status: 'pending' },
    }
  },
];

// =====================================================================
// QNA THREADS — Pertanyaan personal dari peserta ke admin (1-on-1)
// Setiap thread terdiri dari beberapa messages bolak-balik
// =====================================================================
const seedQnaThreads = () => [
  {
    id: 'QT001', pesertaId: 'P001', subject: 'Jadwal sesi coaching',
    createdAt: '2026-01-25', updatedAt: '2026-01-26', status: 'answered', adminUnread: false,
    messages: [
      { id: 'm1', from: 'peserta', author: 'Arif Budiman Pratama', body: 'Selamat siang, ingin menanyakan apakah jadwal sesi 1-on-1 coaching saya bisa dimajukan dari rencana awal? Karena ada agenda penting di pekan ke-3 Februari.', at: '2026-01-25 13:24' },
      { id: 'm2', from: 'admin',   author: 'Dr. Ratna Kusumaningrum', body: 'Halo Pak Arif. Untuk perubahan jadwal mohon koordinasi langsung dengan mentor (Pak Yanuar). Admin DSDM akan support approval-nya. Silakan WA Pak Yanuar.', at: '2026-01-26 09:15' },
      { id: 'm3', from: 'peserta', author: 'Arif Budiman Pratama', body: 'Baik, sudah saya hubungi. Terima kasih.', at: '2026-01-26 10:32' },
    ],
  },
  {
    id: 'QT002', pesertaId: 'P003', subject: 'Akomodasi peserta KPwBI',
    createdAt: '2026-01-20', updatedAt: '2026-01-21', status: 'answered', adminUnread: false,
    messages: [
      { id: 'm4', from: 'peserta', author: 'Bagus Kurniawan Saputra', body: 'Untuk peserta KPwBI Lampung seperti saya, apakah ada akomodasi tertentu selama kegiatan offline di Jakarta?', at: '2026-01-20 16:08' },
      { id: 'm5', from: 'admin',   author: 'Dr. Ratna Kusumaningrum', body: 'Iya Pak Bagus, akomodasi disiapkan untuk peserta KPwBI selama kegiatan offline. Hotel & transport dicover. Silakan kontak panitia (Bu Sari, ext. 4521) untuk detail.', at: '2026-01-21 08:45' },
    ],
  },
  {
    id: 'QT003', pesertaId: 'P006', subject: 'Materi sosialisasi belum tersedia',
    createdAt: '2026-01-28', updatedAt: '2026-01-28', status: 'pending', adminUnread: true,
    messages: [
      { id: 'm6', from: 'peserta', author: 'Nadia Alya Salsabila', body: 'Halo, saya cek di menu Wiki belum ada modul sosialisasi terbaru. Apakah akan diupload sebelum kegiatan tanggal 30 Januari?', at: '2026-01-28 14:50' },
    ],
  },
  {
    id: 'QT004', pesertaId: 'P004', subject: 'Persiapan sebelum sesi 1-on-1',
    createdAt: '2026-02-01', updatedAt: '2026-02-01', status: 'pending', adminUnread: true,
    messages: [
      { id: 'm7', from: 'peserta', author: 'Dewi Kusuma Ningrum', body: 'Sebelum sesi 1-on-1 coaching minggu depan, apakah ada template self-assessment yang perlu saya isi terlebih dahulu? Mohon panduannya.', at: '2026-02-01 11:22' },
    ],
  },
];

const seedNotifications = () => ({
  admin: [
    { id: 'n1', type: 'info', title: '4 peserta DIKSI siap untuk coaching 1-on-1', desc: 'Tahap 3 aktif · pengaturan jadwal mentor', time: '2 menit lalu', read: false },
    { id: 'n2', type: 'success', title: 'Pretest Sosialisasi 5 peserta selesai', desc: 'Rata-rata skor: 83', time: '1 jam lalu', read: false },
    { id: 'n3', type: 'info', title: 'QNA baru dari Arif Budiman', desc: 'Pertanyaan tentang jadwal sesi coaching', time: '3 jam lalu', read: false },
  ],
  mentor: [
    { id: 'n4', type: 'info', title: 'Anda mendampingi 3 mentee di DIKSI Batch 1 · 2026', desc: 'Arif Budiman, Bagus Kurniawan, Nadia Alya', time: '5 jam lalu', read: false },
    { id: 'n5', type: 'warning', title: 'Sesi coaching Arif belum dievaluasi', desc: 'Mohon input hasil evaluasi 1-on-1', time: '1 hari lalu', read: false },
  ],
  peserta: [
    { id: 'n6', type: 'success', title: 'Anda terpilih sebagai peserta DIKSI Batch 1 · 2026', desc: 'Kegiatan dimulai 18 Januari 2026 · ruang Auditorium A', time: '1 hari lalu', read: false },
    { id: 'n7', type: 'info', title: 'Sesi 1-on-1 coaching dijadwalkan', desc: 'Mentor Anda: Yanuar Pradipta · 15 Februari 2026', time: '3 hari lalu', read: true },
  ],
  board: [
    { id: 'n8', type: 'info', title: 'Executive Summary Batch 1 · 2026 tersedia', desc: 'Completion rate naik 12% dari batch sebelumnya', time: 'Hari ini', read: false },
  ],
});

// =====================================================================
// APP STATE CONTEXT (single source of truth)
// =====================================================================
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

function AppProvider({ children }) {
  const [role, setRole] = useState('admin');
  const [currentUserId, setCurrentUserId] = useState('u001'); // siapa yang sedang login
  const [page, setPage] = useState('landing'); // landing | app
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [participants, setParticipants] = useState(seedParticipants);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [toasts, setToasts] = useState([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState('P001');
  // Batches state — admin bisa create batch baru, pilih batch aktif untuk dikelola
  const [batches, setBatches] = useState(seedBatches);
  const [activeBatchId, setActiveBatchId] = useState('B2026S1');
  // Mentors state — pool mentor yang dikelola admin
  const [mentors, setMentors] = useState(seedMentors);
  // QNA threads — pertanyaan personal peserta ke admin
  const [qnaThreads, setQnaThreads] = useState(seedQnaThreads);
  const [selectedQnaThreadId, setSelectedQnaThreadId] = useState(null);
  // Workspace state — untuk Mentor participant management
  const [workspaceParticipantId, setWorkspaceParticipantId] = useState(null);
  const [workspaceTab, setWorkspaceTab] = useState('overview');
  // Peserta persona — saat user login sebagai Peserta, di-"mainkan" sebagai peserta mana (demo only)
  const [pesertaPersonaId, setPesertaPersonaId] = useState('P001');
  const [auditLog, setAuditLog] = useState([
    { id: 'a1', time: '10:34', actor: 'Dr. Hendra Wijaya', action: 'Menyelesaikan sesi Monitoring 2', target: 'Siti Rahmawati', date: 'Hari ini' },
    { id: 'a2', time: '10:20', actor: 'Arif Budiman Pratama', action: 'Submit Coaching Plan', target: null, date: 'Hari ini' },
    { id: 'a3', time: '09:15', actor: 'Yanuar Pradipta', action: 'Input Observasi awal', target: 'Fajar Maulana', date: 'Hari ini' },
    { id: 'a4', time: '08:00', actor: 'Sistem', action: 'Reminder otomatis terkirim ke 3 peserta', target: null, date: 'Hari ini' },
  ]);

  const currentUser = USERS[currentUserId] || USERS.u001;

  const toast = (message, variant = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, variant }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const addAudit = (actor, action, target = null) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    setAuditLog(prev => [{ id: 'a' + Date.now(), time, actor, action, target, date: 'Baru saja' }, ...prev].slice(0, 20));
  };

  const pushNotif = (targetRole, notif) => {
    setNotifications(prev => ({
      ...prev,
      [targetRole]: [{ id: 'n' + Date.now(), read: false, time: 'Baru saja', ...notif }, ...prev[targetRole]],
    }));
  };

  const updateParticipant = (pid, updater) => {
    setParticipants(prev => prev.map(p => p.id === pid ? updater(p) : p));
  };

  const selectedParticipant = useMemo(
    () => participants.find(p => p.id === selectedParticipantId) || participants[0],
    [participants, selectedParticipantId]
  );

  const value = {
    role, setRole,
    currentUserId, setCurrentUserId, currentUser,
    page, setPage, activeMenu, setActiveMenu,
    participants, setParticipants, updateParticipant,
    batches, setBatches, activeBatchId, setActiveBatchId,
    mentors, setMentors,
    qnaThreads, setQnaThreads, selectedQnaThreadId, setSelectedQnaThreadId,
    selectedParticipant, setSelectedParticipantId,
    workspaceParticipantId, setWorkspaceParticipantId,
    workspaceTab, setWorkspaceTab,
    pesertaPersonaId, setPesertaPersonaId,
    notifications, pushNotif, toasts, toast,
    auditLog, addAudit,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// =====================================================================
// UI PRIMITIVES
// =====================================================================
function Toast() {
  const { toasts } = useApp();
  if (!toasts.length) return null;
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => {
        const color = t.variant === 'success' ? theme.success : t.variant === 'warning' ? theme.warning : t.variant === 'danger' ? theme.danger : theme.info;
        const bg = t.variant === 'success' ? theme.successBg : t.variant === 'warning' ? theme.warningBg : t.variant === 'danger' ? theme.dangerBg : theme.infoBg;
        return (
          <div key={t.id} style={{
            background: '#fff', borderLeft: `3px solid ${color}`, padding: '12px 16px',
            boxShadow: '0 8px 24px rgba(10,37,64,0.12)', borderRadius: 3, minWidth: 320, maxWidth: 420,
            display: 'flex', gap: 10, alignItems: 'flex-start', animation: 'slideIn 0.2s ease',
          }}>
            <div style={{ marginTop: 1 }}>
              {t.variant === 'success' && <CheckCircle2 size={16} style={{ color }}/>}
              {t.variant === 'warning' && <AlertCircle size={16} style={{ color }}/>}
              {t.variant === 'danger'  && <X size={16} style={{ color }}/>}
              {t.variant === 'info'    && <Info size={16} style={{ color }}/>}
            </div>
            <div style={{ fontSize: 12, color: theme.text, lineHeight: 1.5, fontFamily: fonts.body }}>{t.message}</div>
          </div>
        );
      })}
      <style>{`@keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}

function Pill({ children, variant = 'default', size = 'sm' }) {
  const styles = {
    default: { bg: '#F1F3F6', color: theme.textMuted, border: '#E2E5EA' },
    success: { bg: theme.successBg, color: theme.success, border: '#A7F3D0' },
    warning: { bg: theme.warningBg, color: theme.warning, border: '#FCD34D' },
    danger:  { bg: theme.dangerBg,  color: theme.danger,  border: '#FCA5A5' },
    info:    { bg: theme.infoBg,    color: theme.info,    border: '#BFDBFE' },
    gold:    { bg: theme.gold,      color: '#fff',        border: theme.gold },
    navy:    { bg: theme.navy,      color: '#fff',        border: theme.navy },
    ghost:   { bg: '#fff',          color: theme.textMuted, border: theme.border },
  };
  const s = styles[variant];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: size === 'xs' ? 9 : 10, fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      padding: size === 'xs' ? '2px 6px' : '3px 8px',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: 2, whiteSpace: 'nowrap', fontFamily: fonts.body,
    }}>
      {children}
    </span>
  );
}

function ProgressBar({ value, color = theme.navy, height = 4 }) {
  return (
    <div style={{ width: '100%', height, background: '#F1F3F6', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(100, value)}%`, height: '100%', background: color, transition: 'width 0.3s' }}/>
    </div>
  );
}

function StatCard({ label, value, sub, trend, accent }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.textMuted, fontWeight: 600, fontFamily: fonts.body }}>{label}</span>
        {trend !== undefined && (
          <span style={{ fontSize: 10, fontWeight: 700, color: trend >= 0 ? theme.success : theme.danger, display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: fonts.body }}>
            {trend >= 0 ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 30, fontWeight: 400, color: theme.text, fontFamily: fonts.display, letterSpacing: '-0.02em' }}>{value}</span>
        {sub && <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: fonts.body }}>{sub}</span>}
      </div>
      {accent && <div style={{ marginTop: 10, height: 2, width: 32, background: accent }}/>}
    </div>
  );
}

function Button({ children, onClick, variant = 'primary', size = 'md', icon: Icon, disabled, style = {} }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: size === 'sm' ? 11 : 12, fontWeight: 600, fontFamily: fonts.body,
    padding: size === 'sm' ? '6px 12px' : '8px 14px',
    borderRadius: 2, border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1, transition: 'all 0.12s',
  };
  const variants = {
    primary: { background: theme.navy, color: '#fff', borderColor: theme.navy },
    secondary: { background: '#fff', color: theme.navy, borderColor: theme.borderStrong },
    gold: { background: theme.gold, color: '#fff', borderColor: theme.gold },
    ghost: { background: 'transparent', color: theme.textMuted, borderColor: 'transparent' },
    danger: { background: theme.danger, color: '#fff', borderColor: theme.danger },
    success: { background: theme.success, color: '#fff', borderColor: theme.success },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>
      {Icon && <Icon size={size === 'sm' ? 12 : 13}/>}
      {children}
    </button>
  );
}

function SectionHeader({ eyebrow, title, desc, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
      <div>
        {eyebrow && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ height: 1, width: 32, background: theme.gold }}/>
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: theme.textMuted, fontWeight: 600, fontFamily: fonts.body }}>{eyebrow}</span>
          </div>
        )}
        <h1 style={{ fontSize: 24, fontWeight: 400, color: theme.text, fontFamily: fonts.display, margin: 0, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{title}</h1>
        {desc && <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 6, marginBottom: 0, fontFamily: fonts.body }}>{desc}</p>}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

// =====================================================================
// LANDING PAGE
// =====================================================================
// Logo Bank Indonesia — SVG resmi (lingkaran dengan api merah)
function BILogo({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="biLogoBg" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#F5F1E8"/>
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#biLogoBg)" stroke="#B8935A" strokeWidth="1.5"/>
      <circle cx="32" cy="32" r="26" fill="none" stroke="#B8935A" strokeWidth="0.8" opacity="0.5"/>
      {/* Stylized flame shape — Bank Indonesia symbol */}
      <path d="M32 14 C 36 20, 42 24, 42 32 C 42 38, 38 44, 32 46 C 26 44, 22 38, 22 32 C 22 24, 28 20, 32 14 Z"
            fill="#C8102E"/>
      <path d="M32 18 C 35 23, 39 26, 39 32 C 39 37, 36 41, 32 43 C 28 41, 25 37, 25 32 C 25 26, 29 23, 32 18 Z"
            fill="#E8404D" opacity="0.85"/>
      <path d="M32 22 C 34 26, 36 28, 36 32 C 36 35, 34 38, 32 39 C 30 38, 28 35, 28 32 C 28 28, 30 26, 32 22 Z"
            fill="#FFB800" opacity="0.7"/>
    </svg>
  );
}

// Ilustrasi 3D — Coaching scene: mentor + coachee avatars + goal card + checklist
function CoachingIllustration() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 560 440" xmlns="http://www.w3.org/2000/svg"
         style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.25))' }}>
      <defs>
        {/* Card gradients (navy variants) */}
        <linearGradient id="cardNavy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1A3A5C"/>
          <stop offset="100%" stopColor="#0A2540"/>
        </linearGradient>
        <linearGradient id="cardNavyLight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2A4A6C"/>
          <stop offset="100%" stopColor="#153858"/>
        </linearGradient>
        {/* Gold gradients */}
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4B77E"/>
          <stop offset="100%" stopColor="#B8935A"/>
        </linearGradient>
        <linearGradient id="goldShine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5E4C2"/>
          <stop offset="100%" stopColor="#B8935A"/>
        </linearGradient>
        {/* Paper */}
        <linearGradient id="paperGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#F5F6F8"/>
        </linearGradient>
        {/* Subtle glow */}
        <radialGradient id="glowGold" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#B8935A" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#B8935A" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Background decorative circles with gold glow */}
      <circle cx="460" cy="90"  r="110" fill="url(#glowGold)"/>
      <circle cx="140" cy="360" r="130" fill="url(#glowGold)" opacity="0.6"/>
      <circle cx="470" cy="100" r="48" fill="#0D2A4A" opacity="0.5"/>
      <circle cx="130" cy="370" r="38" fill="#0D2A4A" opacity="0.55"/>

      {/* Dotted pattern subtle */}
      <g opacity="0.25">
        {[...Array(6)].map((_, i) => [...Array(5)].map((_, j) => (
          <circle key={`${i}-${j}`} cx={40 + i*20} cy={40 + j*20} r="1.2" fill="#B8935A"/>
        )))}
      </g>

      {/* === MAIN DOCUMENT / PAPER (Coaching Plan) === */}
      {/* Back paper */}
      <g transform="translate(170, 180) rotate(-4)">
        <rect x="0" y="0" width="180" height="210" rx="4" fill="#E8E1D0" opacity="0.9"/>
      </g>
      {/* Main paper */}
      <g transform="translate(160, 170)">
        <rect x="0" y="0" width="180" height="210" rx="4" fill="url(#paperGrad)"/>
        {/* Header accent */}
        <rect x="0" y="0" width="180" height="6" fill="url(#goldGrad)"/>
        {/* Title line */}
        <rect x="18" y="22" width="90" height="5" rx="1" fill="#0A2540" opacity="0.85"/>
        <rect x="18" y="32" width="60" height="3" rx="1" fill="#B8935A"/>
        {/* Body lines */}
        <rect x="18" y="52" width="130" height="3" rx="1" fill="#5A6473" opacity="0.5"/>
        <rect x="18" y="62" width="115" height="3" rx="1" fill="#5A6473" opacity="0.5"/>
        <rect x="18" y="72" width="140" height="3" rx="1" fill="#5A6473" opacity="0.5"/>
        {/* Goal section */}
        <rect x="18" y="92" width="50" height="4" rx="1" fill="#B8935A"/>
        <rect x="18" y="104" width="144" height="2" rx="1" fill="#CDD2DA"/>
        <rect x="18" y="114" width="144" height="2" rx="1" fill="#CDD2DA"/>
        <rect x="18" y="124" width="100" height="2" rx="1" fill="#CDD2DA"/>
        {/* Goal section 2 */}
        <rect x="18" y="144" width="50" height="4" rx="1" fill="#B8935A"/>
        <rect x="18" y="156" width="144" height="2" rx="1" fill="#CDD2DA"/>
        <rect x="18" y="166" width="120" height="2" rx="1" fill="#CDD2DA"/>
        {/* Signature area */}
        <circle cx="30" cy="192" r="8" fill="#B8935A" opacity="0.25"/>
        <rect x="44" y="188" width="60" height="3" rx="1" fill="#5A6473" opacity="0.4"/>
        <rect x="44" y="196" width="40" height="2" rx="1" fill="#5A6473" opacity="0.3"/>
      </g>

      {/* === AVATAR CARD: MENTOR/COACH (larger, back-right) === */}
      <g transform="translate(360, 90)">
        <rect x="0" y="0" width="110" height="130" rx="10" fill="url(#cardNavy)"/>
        <rect x="0" y="0" width="110" height="4" rx="2" fill="url(#goldGrad)"/>
        {/* Avatar circle */}
        <circle cx="55" cy="50" r="26" fill="url(#cardNavyLight)" stroke="#B8935A" strokeWidth="2"/>
        {/* Face — simplified */}
        <circle cx="55" cy="45" r="10" fill="#F5E4C2"/>
        <path d="M40 68 Q55 58 70 68 L70 74 L40 74 Z" fill="#B8935A"/>
        {/* Crown/badge (coach indicator) */}
        <path d="M45 27 L50 22 L55 27 L60 22 L65 27 L63 32 L47 32 Z" fill="#D4B77E"/>
        {/* Name lines */}
        <rect x="20" y="90" width="70" height="4" rx="1" fill="#FFFFFF" opacity="0.95"/>
        <rect x="28" y="100" width="54" height="3" rx="1" fill="#B8935A" opacity="0.8"/>
        <rect x="30" y="112" width="50" height="2" rx="1" fill="#FFFFFF" opacity="0.4"/>
      </g>

      {/* === SMALL AVATAR CARDS (peserta row) === */}
      {[
        { x: 70,  y: 260, color: '#1A3A5C' },
        { x: 160, y: 280, color: '#153858' },
        { x: 250, y: 300, color: '#1A3A5C' },
      ].map((a, i) => (
        <g key={i} transform={`translate(${a.x}, ${a.y})`}>
          <rect x="0" y="0" width="76" height="88" rx="8" fill={a.color}/>
          <rect x="0" y="0" width="76" height="3" rx="1" fill="#B8935A" opacity="0.7"/>
          {/* Avatar */}
          <circle cx="38" cy="34" r="16" fill="#2A4A6C" stroke="#B8935A" strokeWidth="1.2"/>
          <circle cx="38" cy="30" r="6" fill="#F5E4C2"/>
          <path d="M28 44 Q38 38 48 44 L48 48 L28 48 Z" fill="#B8935A" opacity="0.8"/>
          {/* Name lines */}
          <rect x="14" y="60" width="48" height="3" rx="1" fill="#FFFFFF" opacity="0.9"/>
          <rect x="20" y="68" width="36" height="2" rx="1" fill="#B8935A" opacity="0.7"/>
          <rect x="22" y="76" width="32" height="2" rx="1" fill="#FFFFFF" opacity="0.35"/>
        </g>
      ))}

      {/* === CHECKLIST CARD (floating top-right, gold accented) === */}
      <g transform="translate(400, 235) rotate(4)">
        <rect x="0" y="0" width="130" height="155" rx="6" fill="url(#paperGrad)"/>
        <rect x="0" y="0" width="130" height="38" rx="6" fill="url(#cardNavy)"/>
        <rect x="0" y="32" width="130" height="6" fill="url(#cardNavy)"/>
        {/* Header text */}
        <rect x="14" y="14" width="60" height="4" rx="1" fill="#B8935A"/>
        <rect x="14" y="22" width="85" height="3" rx="1" fill="#FFFFFF" opacity="0.7"/>
        {/* Checklist items */}
        {[0, 1, 2, 3].map(i => (
          <g key={i} transform={`translate(14, ${52 + i*22})`}>
            <rect x="0" y="0" width="14" height="14" rx="3" fill={i < 3 ? '#B8935A' : '#FFFFFF'} stroke="#B8935A" strokeWidth="1.5"/>
            {i < 3 && <path d="M3 7 L6 10 L11 4" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>}
            <rect x="22" y="3" width="70" height="3.5" rx="1" fill="#0A2540" opacity={i < 3 ? 0.85 : 0.5}/>
            <rect x="22" y="10" width={50 - i*8} height="2" rx="1" fill="#5A6473" opacity="0.4"/>
          </g>
        ))}
      </g>

      {/* === GOAL BADGE (small star, floating) === */}
      <g transform="translate(88, 140)">
        <circle cx="0" cy="0" r="28" fill="url(#goldShine)"/>
        <circle cx="0" cy="0" r="28" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.3"/>
        <path d="M0 -14 L4 -4 L14 -4 L6 3 L10 13 L0 7 L-10 13 L-6 3 L-14 -4 L-4 -4 Z" fill="#FFFFFF"/>
      </g>

      {/* === ARROW CONNECTORS (subtle) === */}
      <path d="M175 200 Q200 170 245 165" stroke="#B8935A" strokeWidth="1.5" fill="none" opacity="0.4" strokeDasharray="3 3"/>
      <path d="M345 220 Q380 240 395 260" stroke="#B8935A" strokeWidth="1.5" fill="none" opacity="0.4" strokeDasharray="3 3"/>

      {/* === SMALL DECORATIVE DOTS === */}
      <circle cx="70" cy="100" r="3" fill="#B8935A"/>
      <circle cx="510" cy="380" r="4" fill="#B8935A" opacity="0.6"/>
      <circle cx="40" cy="240" r="2.5" fill="#B8935A" opacity="0.5"/>
      <circle cx="530" cy="200" r="3" fill="#B8935A" opacity="0.4"/>
    </svg>
  );
}

// Menu cards di landing untuk preview per role
// Note: di Turn 2 ini akan diganti dengan struktur "4 program tile" sesuai revisi DSDM.
// Untuk sekarang masih dipakai sebagai temporary scaffold.
const LANDING_MENUS = {
  admin: [
    { id: 'batches',  icon: Calendar,       color: '#B8935A', bg: 'rgba(184,147,90,0.08)', title: 'Kelola Batch DIKSI',  desc: 'Buat batch baru atau pilih batch yang sudah ada untuk dikelola.', menu: 'batches' },
    { id: 'peserta',  icon: Users,          color: '#0A2540', bg: 'rgba(10,37,64,0.06)',   title: 'Management Kegiatan', desc: 'Pilih peserta berdasarkan kriteria & assign mentor.', menu: 'peserta' },
    { id: 'tahapan',  icon: Activity,       color: '#153858', bg: 'rgba(21,56,88,0.06)',   title: 'Monitoring Tahapan',  desc: 'Pantau progress 7 tahapan seluruh peserta.', menu: 'tahapan' },
  ],
  mentor: [
    { id: 'mentees',  icon: Users,          color: '#B8935A', bg: 'rgba(184,147,90,0.08)', title: 'Mentee Saya',          desc: 'Daftar peserta yang Anda dampingi sebagai mentor.', menu: 'mentees' },
    { id: 'coaching', icon: Sparkles,       color: '#0A2540', bg: 'rgba(10,37,64,0.06)',   title: '1-on-1 Coaching',      desc: 'Input hasil evaluasi sesi coaching 1-on-1.', menu: 'mentees' },
  ],
};

// Role yang memiliki preview menu (sisanya langsung masuk aplikasi)
const ROLES_WITH_PREVIEW = ['admin', 'mentor'];

function LandingPage() {
  const { setPage, setRole, setActiveMenu, setCurrentUserId } = useApp();
  const [selectedRole, setSelectedRole] = useState('admin');
  const [rolePicker, setRolePicker] = useState(null); // { user, availableRoles } atau null

  const enterAs = (r, menu = 'dashboard') => {
    setRole(r);
    setActiveMenu(menu);
    setPage('app');
  };

  // Login sebagai user, kemudian handle single vs multi role
  const loginAs = (userId, preferredRole = null) => {
    const user = USERS[userId];
    if (!user) return;
    setCurrentUserId(userId);

    // Multi-role → tampilkan picker
    if (user.roles.length > 1 && !preferredRole) {
      setRolePicker({ user, availableRoles: user.roles });
      return;
    }

    // Single role atau sudah pilih role → langsung proceed
    const chosenRole = preferredRole || user.roles[0];

    // Role dengan preview menu → update selectedRole (stay di landing)
    if (ROLES_WITH_PREVIEW.includes(chosenRole)) {
      setSelectedRole(chosenRole);
      setRolePicker(null);
    } else {
      // Direct entry (Peserta / Pimpinan)
      setRolePicker(null);
      enterAs(chosenRole);
    }
  };

  const handleRoleClick = (roleId) => {
    // Mapping role → userId (role switcher di landing untuk demo)
    const userId = ROLES[roleId].userId;
    loginAs(userId);
  };

  const handlePickRole = (roleId) => {
    const userId = rolePicker.user.id;
    setCurrentUserId(userId);
    if (ROLES_WITH_PREVIEW.includes(roleId)) {
      setSelectedRole(roleId);
      setRolePicker(null);
    } else {
      setRolePicker(null);
      enterAs(roleId);
    }
  };

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  const currentRole = ROLES[selectedRole];
  const currentMenus = LANDING_MENUS[selectedRole] || [];

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, fontFamily: fonts.body, display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <div style={{ background: theme.navy, borderBottom: `1px solid ${theme.navyDark}` }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <BILogo size={44}/>
            <div>
              <div style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: 600, color: '#fff', letterSpacing: '-0.005em', lineHeight: 1.1 }}>Coaching Plan Platform</div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.goldLight, fontWeight: 500, marginTop: 2 }}>Bank Indonesia · DSDM</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>{currentRole.user}</div>
              <div style={{ fontSize: 10, color: theme.goldLight, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{currentRole.nama}</div>
            </div>
            <div style={{ width: 1, height: 28, background: 'rgba(184,147,90,0.3)' }}/>
            <div style={{ width: 36, height: 36, background: theme.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, fontFamily: fonts.body, fontSize: 12, fontWeight: 700, color: theme.navy }}>{currentRole.short}</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, maxWidth: 1280, margin: '0 auto', padding: '32px 32px 24px', width: '100%', boxSizing: 'border-box' }}>

        {/* HERO CARD with illustration */}
        <div style={{
          background: `linear-gradient(135deg, ${theme.navy} 0%, ${theme.navyDark} 100%)`,
          borderRadius: 4, position: 'relative', overflow: 'hidden',
          padding: '44px 48px', minHeight: 360, display: 'flex', alignItems: 'center',
        }}>
          {/* Decorative background pattern */}
          <div style={{ position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(184,147,90,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(184,147,90,0.1) 0%, transparent 50%)`,
          }}/>
          {/* Dot grid texture */}
          <svg style={{ position: 'absolute', inset: 0, opacity: 0.08 }} width="100%" height="100%">
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#B8935A"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots)"/>
          </svg>

          {/* Left content */}
          <div style={{ position: 'relative', zIndex: 2, flex: 1, maxWidth: 500 }}>
            {/* Top row: date + app name badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '5px 12px', background: 'rgba(184,147,90,0.15)',
                border: '1px solid rgba(184,147,90,0.35)', borderRadius: 20,
                fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em',
                color: theme.goldLight, fontWeight: 600,
              }}>
                <div style={{ width: 5, height: 5, borderRadius: 3, background: theme.gold }}/>
                {today}
              </div>
            </div>

            {/* App name eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ height: 1, width: 28, background: theme.gold }}/>
              <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: theme.goldLight, fontWeight: 600 }}>
                Coaching Plan · Program DIKSI
              </span>
            </div>

            {/* Greeting */}
            <h1 style={{
              fontFamily: fonts.display, fontSize: 44, fontWeight: 400, color: '#fff',
              margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em',
            }}>
              Selamat datang,<br/>
              <span style={{ color: theme.gold, fontStyle: 'italic', fontWeight: 300 }}>{currentRole.user.split(',')[0]}</span>
            </h1>

            {/* Multi-role badge inline (kalau user punya banyak role) */}
            {(USERS[currentRole.userId]?.roles || []).length > 1 && (
              <div style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 10px', background: 'rgba(184,147,90,0.15)', border: '1px solid rgba(184,147,90,0.35)', borderRadius: 20, fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.goldLight, fontWeight: 600 }}>
                <UserCheck size={11}/>
                Multi-Role · {USERS[currentRole.userId].roles.length}×
              </div>
            )}
          </div>

          {/* Right illustration */}
          <div style={{ position: 'relative', zIndex: 2, flex: '0 0 520px', height: 380, marginLeft: 40 }}>
            <CoachingIllustration/>
          </div>
        </div>

        {/* PROGRAM TILES Section — 4 program coaching DSDM */}
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 18, background: theme.gold }}/>
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.25em', color: theme.text, fontWeight: 600 }}>Pilih Program</span>
            </div>
            <div style={{ fontSize: 10, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
              {(() => {
                const userPrograms = USERS[currentRole.userId]?.programs || [];
                const visible = Object.values(PROGRAMS).filter(p => userPrograms.includes(p.id));
                return `${visible.length} program tersedia untuk Anda`;
              })()}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {(() => {
              const userPrograms = USERS[currentRole.userId]?.programs || [];
              return Object.values(PROGRAMS).filter(p => userPrograms.includes(p.id)).map(prog => {
                const Ic = prog.icon;
                const isActive = prog.status === 'active';
                const isDisabled = !isActive;
                return (
                  <button key={prog.id}
                    onClick={() => isActive && enterAs(selectedRole)}
                    disabled={isDisabled}
                    style={{
                      background: '#fff', border: `1px solid ${isActive ? theme.border : theme.border}`, padding: 22, textAlign: 'left',
                      borderRadius: 3, cursor: isActive ? 'pointer' : 'not-allowed',
                      transition: 'all 0.15s', position: 'relative', overflow: 'hidden',
                      fontFamily: fonts.body,
                      opacity: isDisabled ? 0.6 : 1,
                    }}
                    onMouseEnter={e => {
                      if (!isActive) return;
                      e.currentTarget.style.borderColor = prog.color;
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(10,37,64,0.08)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      if (!isActive) return;
                      e.currentTarget.style.borderColor = theme.border;
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Decorative corner gradient */}
                    <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, background: prog.color + '12' }}/>

                    {/* Coming Soon badge — overlay top-right */}
                    {!isActive && (
                      <div style={{
                        position: 'absolute', top: 12, right: 12, zIndex: 2,
                        background: theme.bg, border: `1px solid ${theme.borderStrong}`,
                        padding: '3px 7px', borderRadius: 2,
                        fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.15em',
                        color: theme.textMuted, fontWeight: 700,
                      }}>
                        Coming Soon
                      </div>
                    )}

                    {/* Icon header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, position: 'relative' }}>
                      <div style={{
                        width: 48, height: 48,
                        background: isActive ? prog.color : theme.bg,
                        border: isActive ? 'none' : `1px solid ${theme.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3,
                      }}>
                        <Ic size={20} style={{ color: isActive ? '#fff' : theme.textMuted }}/>
                      </div>
                      {isActive ? (
                        <div style={{ width: 28, height: 28, borderRadius: 14, background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ArrowRight size={13} style={{ color: theme.textMuted }}/>
                        </div>
                      ) : (
                        <Lock size={13} style={{ color: theme.textSubtle, marginTop: 8 }}/>
                      )}
                    </div>

                    {/* Title + kode */}
                    <div style={{ position: 'relative', marginBottom: 6 }}>
                      <div style={{ fontFamily: fonts.mono, fontSize: 9, color: prog.color, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>
                        {prog.kode}
                      </div>
                      <h3 style={{
                        fontFamily: fonts.display, fontSize: 17, fontWeight: 600, color: theme.text,
                        margin: 0, letterSpacing: '-0.005em',
                      }}>{prog.nama}</h3>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 11.5, color: theme.textMuted, lineHeight: 1.55, margin: 0, position: 'relative' }}>
                      {prog.deskripsi}
                    </p>

                    {/* Bottom status bar */}
                    {isActive && (
                      <div style={{
                        marginTop: 14, paddingTop: 12, borderTop: `1px solid ${theme.border}`,
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: 10, color: theme.success, fontWeight: 600,
                        textTransform: 'uppercase', letterSpacing: '0.12em',
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: 3, background: theme.success }}/>
                        Aktif · Klik untuk masuk
                      </div>
                    )}
                  </button>
                );
              });
            })()}
          </div>
        </div>

        {/* Role switcher — demo mode */}
        <div style={{ marginTop: 20, background: '#fff', border: `1px dashed ${theme.borderStrong}`, borderRadius: 3, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, flexShrink: 0 }}>
              <Users size={14} style={{ color: theme.textMuted }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: theme.text, fontWeight: 700, marginBottom: 3 }}>Mode Demo · Ganti Role</div>
              <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.5 }}>Simulasikan aplikasi dari sudut pandang role yang berbeda untuk melihat alur lengkap.</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
            {Object.values(ROLES).map((r) => {
              const Ic = r.icon;
              const active = r.id === selectedRole;
              const hasPreview = ROLES_WITH_PREVIEW.includes(r.id);
              return (
                <button key={r.id} onClick={() => handleRoleClick(r.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px',
                    border: `1px solid ${active ? theme.navy : !hasPreview ? theme.gold : theme.border}`,
                    background: active ? theme.navy : !hasPreview ? 'rgba(184,147,90,0.06)' : '#fff',
                    borderRadius: 2, cursor: 'pointer', fontFamily: fonts.body, position: 'relative',
                    transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => {
                    if (active) return;
                    if (hasPreview) {
                      e.currentTarget.style.borderColor = theme.gold;
                      e.currentTarget.style.background = 'rgba(184,147,90,0.04)';
                    } else {
                      e.currentTarget.style.background = theme.gold;
                      e.currentTarget.querySelectorAll('.role-text').forEach(el => el.style.color = theme.navy);
                      e.currentTarget.querySelectorAll('.role-sub').forEach(el => el.style.color = theme.navyDark);
                      e.currentTarget.querySelectorAll('.role-arrow').forEach(el => el.style.color = theme.navy);
                    }
                  }}
                  onMouseLeave={e => {
                    if (active) return;
                    if (hasPreview) {
                      e.currentTarget.style.borderColor = theme.border;
                      e.currentTarget.style.background = '#fff';
                    } else {
                      e.currentTarget.style.background = 'rgba(184,147,90,0.06)';
                      e.currentTarget.querySelectorAll('.role-text').forEach(el => el.style.color = theme.text);
                      e.currentTarget.querySelectorAll('.role-sub').forEach(el => el.style.color = theme.gold);
                      e.currentTarget.querySelectorAll('.role-arrow').forEach(el => el.style.color = theme.gold);
                    }
                  }}
                >
                  <div style={{ width: 30, height: 30, background: active ? theme.gold : !hasPreview ? theme.gold : theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, flexShrink: 0 }}>
                    <Ic size={13} style={{ color: theme.navy }}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <div className="role-text" style={{ fontSize: 11.5, fontWeight: 600, color: active ? '#fff' : theme.text, lineHeight: 1.2 }}>{r.nama}</div>
                    <div className="role-sub" style={{ fontSize: 9, color: active ? theme.goldLight : !hasPreview ? theme.gold : theme.textMuted, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: !hasPreview ? 600 : 400, textTransform: !hasPreview ? 'uppercase' : 'none', letterSpacing: !hasPreview ? '0.1em' : 'normal' }}>
                      {hasPreview ? r.jabatan.split(' ').slice(0,3).join(' ') : 'Masuk Aplikasi'}
                    </div>
                  </div>
                  {active && (
                    <div style={{ position: 'absolute', top: 6, right: 6, fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.navy, background: theme.gold, padding: '2px 5px', borderRadius: 2, fontWeight: 700 }}>Aktif</div>
                  )}
                  {!hasPreview && !active && (
                    <ArrowRight size={13} className="role-arrow" style={{ color: theme.gold, flexShrink: 0 }}/>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <footer style={{ padding: '18px 32px', textAlign: 'center', fontSize: 10.5, color: theme.textMuted, borderTop: `1px solid ${theme.border}`, background: '#fff' }}>
        Platform Coaching Plan · DSDM Bank Indonesia · Dikembangkan oleh PT Diksta Cipta Solusi
      </footer>

      {rolePicker && (
        <RolePickerModal
          user={rolePicker.user}
          availableRoles={rolePicker.availableRoles}
          onPick={handlePickRole}
          onClose={() => setRolePicker(null)}
        />
      )}
    </div>
  );
}

// =====================================================================
// ROLE PICKER MODAL — untuk user dengan multi-role
// =====================================================================
function RolePickerModal({ user, availableRoles, onPick, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(10,37,64,0.72)',
      zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, fontFamily: fonts.body,
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: '#fff', width: 520, maxWidth: '100%', borderRadius: 4,
        boxShadow: '0 32px 64px rgba(0,0,0,0.3)', overflow: 'hidden',
        animation: 'modalIn 0.2s ease-out',
      }}>
        {/* Header banner */}
        <div style={{
          background: `linear-gradient(135deg, ${theme.navy} 0%, ${theme.navyDark} 100%)`,
          padding: '28px 28px 22px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(circle at 80% 20%, rgba(184,147,90,0.18) 0%, transparent 50%)`,
          }}/>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 50, height: 50, background: theme.gold,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 3, fontSize: 16, fontWeight: 700, color: theme.navy,
            }}>{user.short}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: theme.goldLight, fontWeight: 600, marginBottom: 4 }}>
                Multi-Role User · Pilih Konteks Sesi
              </div>
              <div style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>{user.user}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{user.jabatan} · {user.satker}</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, background: theme.infoBg, border: '1px solid #BFDBFE', borderRadius: 2, marginBottom: 18 }}>
            <Info size={14} style={{ color: theme.info, flexShrink: 0, marginTop: 1 }}/>
            <div style={{ fontSize: 11, color: theme.text, lineHeight: 1.5 }}>
              Akun Anda ter-assign pada <strong>{availableRoles.length} peran</strong> di program ini.
              Pilih konteks untuk sesi saat ini — Anda dapat beralih kapan saja via menu profil di header aplikasi.
            </div>
          </div>

          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.textMuted, fontWeight: 600, marginBottom: 10 }}>
            Peran Tersedia
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {availableRoles.map(roleId => {
              const def = ROLE_DEFS[roleId];
              const Ic = def.icon;
              return (
                <button key={roleId} onClick={() => onPick(roleId)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: 16, background: '#fff',
                    border: `1px solid ${theme.border}`, borderRadius: 3,
                    cursor: 'pointer', fontFamily: fonts.body, textAlign: 'left',
                    transition: 'all 0.12s', position: 'relative', overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = def.color;
                    e.currentTarget.style.background = 'rgba(184,147,90,0.03)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.querySelector('.pick-arrow').style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = theme.border;
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.querySelector('.pick-arrow').style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: def.color }}/>
                  <div style={{
                    width: 44, height: 44, background: def.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 3, flexShrink: 0, marginLeft: 4,
                  }}>
                    <Ic size={18} style={{ color: '#fff' }}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: fonts.display, fontSize: 15, fontWeight: 600, color: theme.text, letterSpacing: '-0.005em' }}>
                      Masuk sebagai {def.nama}
                    </div>
                    <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 3 }}>{def.label}</div>
                  </div>
                  <ArrowRight className="pick-arrow" size={16} style={{ color: def.color, transition: 'transform 0.15s' }}/>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 20, paddingTop: 14, borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 10, color: theme.textSubtle, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Shield size={11}/>
              Role mapping dari Azure AD · sesi aktif 8 jam
            </div>
            <button onClick={onClose} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 11, color: theme.textMuted, padding: '6px 10px', fontFamily: fonts.body,
            }}>Batal</button>
          </div>
        </div>
      </div>
      <style>{`@keyframes modalIn { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}

// =====================================================================
// HEADER & SIDEBAR
// =====================================================================
function Header() {
  const { role, setRole, setPage, setActiveMenu, currentUser } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const r = ROLES[role];
  const Ic = r.icon;
  const isMultiRole = (currentUser.roles || []).length > 1;

  return (
    <header style={{ background: theme.navy, borderBottom: `1px solid ${theme.navyDark}`, position: 'sticky', top: 0, zIndex: 40 }}>
      <div style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => setPage('landing')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: 0 }}>
          <BILogo size={36}/>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', color: theme.goldLight, fontWeight: 500, fontFamily: fonts.body }}>Bank Indonesia · DSDM</div>
            <div style={{ fontSize: 13, color: '#fff', fontWeight: 500, fontFamily: fonts.display, letterSpacing: '-0.005em' }}>Program DIKSI · Batch 1 · 2026</div>
          </div>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Tombol kembali ke beranda landing */}
          <button onClick={() => { setPage('landing'); setActiveMenu('dashboard'); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 12px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(184,147,90,0.3)', borderRadius: 2,
              cursor: 'pointer', fontFamily: fonts.body,
              fontSize: 11, color: '#fff', fontWeight: 500,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(184,147,90,0.15)'; e.currentTarget.style.borderColor = theme.gold; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(184,147,90,0.3)'; }}
          >
            <ArrowLeft size={13}/> Beranda
          </button>

          {/* Role/User dropdown */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px 6px 10px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(184,147,90,0.3)',
                borderRadius: 2, cursor: 'pointer', fontFamily: fonts.body, position: 'relative',
              }}>
              <div style={{ width: 32, height: 32, background: theme.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                <Ic size={14} style={{ color: theme.navy }}/>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.goldLight, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                  {r.nama}
                  {isMultiRole && <span style={{ background: theme.gold, color: theme.navy, padding: '1px 4px', borderRadius: 2, fontSize: 8, fontWeight: 700, letterSpacing: '0.08em' }}>MULTI</span>}
                </div>
                <div style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>{currentUser.user.split(',')[0]}</div>
              </div>
              <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.55)' }}/>
            </button>
            {menuOpen && (
              <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, width: 360, background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, boxShadow: '0 12px 32px rgba(10,37,64,0.14)', overflow: 'hidden', maxHeight: '80vh', overflowY: 'auto' }}>
                {/* Active context */}
                <div style={{ padding: '14px 16px', background: `linear-gradient(135deg, ${theme.navy}, ${theme.navyDark})`, color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, background: theme.gold, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: theme.navy, flexShrink: 0 }}>
                      {currentUser.short}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{currentUser.user}</div>
                      <div style={{ fontSize: 10, color: theme.goldLight, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.jabatan}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(184,147,90,0.3)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 10 }}>
                    <Ic size={11} style={{ color: theme.gold }}/>
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>Konteks aktif:</span>
                    <span style={{ color: theme.gold, fontWeight: 600 }}>{r.nama}</span>
                  </div>
                </div>

                {/* Ganti Role — hanya tampil jika user multi-role */}
                {isMultiRole && (
                  <>
                    <div style={{ padding: '12px 16px 8px', background: theme.bg, borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` }}>
                      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: theme.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <RefreshCw size={11}/>
                        Ganti Role (akun ini)
                      </div>
                      <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 3 }}>{currentUser.roles.length} peran ter-assign pada Anda</div>
                    </div>
                    {currentUser.roles.map(roleId => {
                      const def = ROLE_DEFS[roleId];
                      const RIc = def.icon;
                      const active = roleId === role;
                      return (
                        <button key={roleId}
                          onClick={() => { setRole(roleId); setActiveMenu('dashboard'); setMenuOpen(false); }}
                          style={{
                            width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
                            background: active ? 'rgba(184,147,90,0.06)' : '#fff', border: 'none', borderBottom: `1px solid ${theme.border}`,
                            cursor: 'pointer', textAlign: 'left', fontFamily: fonts.body,
                          }}
                          onMouseEnter={e => { if (!active) e.currentTarget.style.background = theme.bg; }}
                          onMouseLeave={e => { if (!active) e.currentTarget.style.background = '#fff'; }}>
                          <div style={{ width: 32, height: 32, background: active ? def.color : theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                            <RIc size={13} style={{ color: active ? '#fff' : def.color }}/>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: theme.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                              {def.nama}
                              {active && <Pill variant="success" size="xs">Aktif</Pill>}
                            </div>
                            <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>{def.label}</div>
                          </div>
                          {!active && <ArrowRight size={13} style={{ color: theme.textSubtle }}/>}
                        </button>
                      );
                    })}
                  </>
                )}

                {/* Demo · Login as other user */}
                <div style={{ padding: '12px 16px 8px', background: theme.bg, borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` }}>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: theme.text }}>Demo · Login sebagai User Lain</div>
                  <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 3 }}>Simulasi SSO Microsoft 365 untuk keperluan demo</div>
                </div>
                {Object.values(ROLES).map(rr => {
                  const RIc = rr.icon;
                  const active = rr.userId === currentUser.id;
                  return (
                    <button key={rr.id}
                      onClick={() => { setPage('landing'); setMenuOpen(false); }}
                      disabled={active}
                      style={{
                        width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
                        background: active ? theme.bg : '#fff', border: 'none', borderBottom: `1px solid ${theme.border}`,
                        cursor: active ? 'default' : 'pointer', textAlign: 'left', fontFamily: fonts.body,
                        opacity: active ? 0.5 : 1,
                      }}>
                      <div style={{ width: 30, height: 30, background: '#F1F3F6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, fontSize: 10, fontWeight: 700, color: theme.navy }}>
                        {rr.short}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 500, color: theme.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rr.user}</div>
                        <div style={{ fontSize: 9, color: theme.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rr.nama} · {rr.satker.split('—')[0].trim()}</div>
                      </div>
                      {active && <span style={{ fontSize: 9, color: theme.textSubtle }}>(saat ini)</span>}
                    </button>
                  );
                })}

                <button onClick={() => setPage('landing')}
                  style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: theme.textMuted, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: fonts.body }}>
                  <LogOut size={12}/> Keluar dari sistem
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

const MENUS = {
  admin: [
    { id: 'dashboard',   label: 'Dashboard',           icon: LayoutDashboard },
    { id: 'batches',     label: 'Kelola Batch',         icon: Calendar },
    { id: 'peserta',     label: 'Management Kegiatan',  icon: Users },
    { id: 'mentorList',  label: 'List Mentor',          icon: Sparkles },
    { id: 'tahapan',     label: 'Monitoring Tahapan',   icon: Activity },
    { id: 'wiki',        label: 'Wiki / Modul',         icon: BookOpen },
    { id: 'qna',         label: 'QNA Inbox',            icon: MessageSquare },
  ],
  mentor: [
    { id: 'dashboard',  label: 'Beranda',          icon: LayoutDashboard },
    { id: 'mentees',    label: 'Mentee Saya',      icon: Users },
    { id: 'wiki',       label: 'Wiki / Modul',     icon: BookOpen },
  ],
  peserta: [
    { id: 'dashboard',   label: 'Journey Saya',           icon: LayoutDashboard },
    { id: 'registrasi',  label: 'Check-in',                icon: Upload },
    { id: 'sosialisasi', label: 'Pretest & Posttest',     icon: Target },
    { id: 'coaching',    label: 'Sesi Coaching',          icon: Sparkles },
    { id: 'monitoring',  label: 'Monitoring',             icon: Activity },
    { id: 'evaluasi',    label: 'Evaluasi',               icon: ClipboardCheck },
    { id: 'wiki',        label: 'Wiki / Modul',           icon: BookOpen },
    { id: 'qna',         label: 'QNA',                    icon: MessageSquare },
  ],
  board: [
    { id: 'dashboard',  label: 'Dashboard Insight',  icon: BarChart3 },
  ],
};

function Sidebar() {
  const { role, activeMenu, setActiveMenu, participants, pesertaPersonaId, setPesertaPersonaId } = useApp();
  const items = MENUS[role];
  const currentPersona = participants.find(p => p.id === pesertaPersonaId) || participants[0];

  return (
    <aside style={{ width: 220, background: '#fff', borderRight: `1px solid ${theme.border}`, minHeight: 'calc(100vh - 57px)', padding: '20px 0', fontFamily: fonts.body }}>
      <div style={{ padding: '0 16px 16px', marginBottom: 10, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 3, background: theme.gold }}/>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Program DIKSI</div>
            <div style={{ fontSize: 10, color: theme.textMuted, fontFamily: fonts.mono, marginTop: 2 }}>Batch 1 · 2026</div>
          </div>
        </div>
      </div>

      {/* Persona switcher khusus role peserta — demo affordance untuk simulate peserta berbeda */}
      {role === 'peserta' && (
        <div style={{ padding: '0 16px 16px', marginBottom: 10, borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.textSubtle, fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
            <User size={10}/> Demo · Persona Peserta
          </div>
          <select value={pesertaPersonaId} onChange={e => setPesertaPersonaId(e.target.value)}
            style={{ width: '100%', fontSize: 11, padding: '6px 8px', border: `1px solid ${theme.border}`, borderRadius: 2, background: '#fff', color: theme.text, fontFamily: fonts.body, cursor: 'pointer', outline: 'none' }}>
            {participants.map(p => (
              <option key={p.id} value={p.id}>{p.nama.split(' ').slice(0,2).join(' ')} · T{p.stage}/7</option>
            ))}
          </select>
          <div style={{ marginTop: 6, fontSize: 9.5, color: theme.textMuted, lineHeight: 1.4 }}>
            Simulasi "bermain sebagai" peserta berbeda untuk demo flow pretest, coaching plan, reflection.
          </div>
        </div>
      )}

      <nav style={{ padding: '0 10px' }}>
        {items.map(m => {
          const Ic = m.icon;
          const active = m.id === activeMenu;
          return (
            <button key={m.id} onClick={() => setActiveMenu(m.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', width: '100%',
                fontSize: 12, fontWeight: 500, fontFamily: fonts.body,
                background: active ? theme.navy : 'transparent',
                color: active ? '#fff' : theme.textMuted,
                border: 'none', borderRadius: 2, cursor: 'pointer',
                marginBottom: 2, transition: 'all 0.1s',
                textAlign: 'left',
              }}
              onMouseEnter={e => !active && (e.currentTarget.style.background = theme.bg)}
              onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}>
              <Ic size={13}/>
              <span style={{ flex: 1 }}>{m.label}</span>
              {active && <div style={{ width: 4, height: 4, borderRadius: 2, background: theme.gold }}/>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

// =====================================================================
// SHARED: PARTICIPANT STATUS HELPERS
// =====================================================================
const stageStatus = (p, stageKey) => p.stageData[stageKey]?.status || 'pending';
const calcProgress = (p) => {
  const completed = STAGES.filter(s => p.stageData[s.key]?.status === 'completed').length;
  return Math.round((completed / STAGES.length) * 100);
};

// =====================================================================
// ADMIN DSDM VIEWS
// =====================================================================
function AdminDashboard() {
  const { participants, setActiveMenu, auditLog } = useApp();
  const total = participants.length;
  const avgProgress = Math.round(participants.reduce((a, p) => a + calcProgress(p), 0) / total);
  const completed = participants.filter(p => p.status === 'completed').length;
  const atRisk = participants.filter(p => calcProgress(p) < 40 && p.status === 'active').length;

  return (
    <div>
      <SectionHeader
        eyebrow="Admin DSDM · Dashboard"
        title="Ringkasan Program DIKSI Coaching"
        desc={`Batch 1 · 2026 · ${total} peserta terdaftar · data diperbarui otomatis`}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <StatCard label="Total Peserta" value={total} sub="orang" accent={theme.navy}/>
        <StatCard label="Avg. Completion" value={`${avgProgress}%`} trend={+12} accent={theme.gold}/>
        <StatCard label="Selesai Penuh" value={completed} sub={`dari ${total}`} accent={theme.success}/>
        <StatCard label="At-Risk" value={atRisk} sub="butuh intervensi" accent={theme.danger}/>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2 }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Distribusi Peserta per Tahapan</div>
              <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>Dari 7 tahapan alur program DIKSI Coaching</div>
            </div>
            <Pill variant="success">Live</Pill>
          </div>
          <div style={{ padding: 18 }}>
            {STAGES.map(t => {
              const count = participants.filter(p => p.stage >= t.id).length;
              const pct = Math.round((count / total) * 100);
              const color = t.tipe === 'KUANTITATIF' ? theme.navy : t.tipe === 'KUALITATIF' ? theme.gold : theme.success;
              return (
                <div key={t.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, fontSize: 11 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: fonts.mono, color: theme.textSubtle, width: 24 }}>0{t.id}</span>
                      <span style={{ fontWeight: 500, color: theme.text }}>{t.nama}</span>
                      <Pill variant={t.tipe === 'KUANTITATIF' ? 'info' : t.tipe === 'KUALITATIF' ? 'gold' : 'success'} size="xs">{t.tipe}</Pill>
                    </div>
                    <span style={{ fontFamily: fonts.mono, color: theme.textMuted }}>{count}/{total} · {pct}%</span>
                  </div>
                  <ProgressBar value={pct} color={color}/>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2 }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Activity Log</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>Audit trail submit & update tahapan · real-time</div>
          </div>
          <Pill>Auto-refresh</Pill>
        </div>
        {auditLog.slice(0, 6).map(a => (
          <div key={a.id} style={{ padding: '10px 18px', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: theme.bg, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={12} style={{ color: theme.textMuted }}/>
            </div>
            <div style={{ flex: 1, fontSize: 11, color: theme.text }}>
              <span style={{ fontWeight: 600 }}>{a.actor}</span>
              <span style={{ color: theme.textMuted }}> {a.action}</span>
              {a.target && <span style={{ fontWeight: 500 }}> — {a.target}</span>}
            </div>
            <span style={{ fontFamily: fonts.mono, fontSize: 10, color: theme.textSubtle }}>{a.date} {a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// ADMIN: KELOLA BATCH — pilih batch aktif & buat batch baru
// =====================================================================
function AdminBatches() {
  const { batches, setBatches, activeBatchId, setActiveBatchId, participants, toast, addAudit, currentUser, setActiveMenu } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState({ tahun: new Date().getFullYear() + 1, batchKe: '', tanggalMulai: '', tanggalSelesai: '' });

  const userShortName = currentUser.user.split(',')[0];

  const sortedBatches = [...batches].sort((a, b) => b.tanggalMulai.localeCompare(a.tanggalMulai));
  const activeBatch = batches.find(b => b.id === activeBatchId);

  const fmtDate = (s) => new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const monthsBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24 * 30));

  const pesertaCountByBatch = (batchId) => participants.filter(p => p.batchId === batchId).length;

  const selectBatch = (batchId) => {
    setActiveBatchId(batchId);
    const b = batches.find(x => x.id === batchId);
    addAudit(userShortName, `Memilih batch aktif: ${b?.nama}`, null);
    toast(`Batch aktif diubah ke ${b?.nama}.`, 'success');
  };

  const createBatch = () => {
    if (!draft.batchKe || !draft.tanggalMulai || !draft.tanggalSelesai) {
      toast('Mohon lengkapi semua field', 'warning'); return;
    }
    if (new Date(draft.tanggalMulai) >= new Date(draft.tanggalSelesai)) {
      toast('Tanggal selesai harus setelah tanggal mulai', 'warning'); return;
    }
    const batchKe = parseInt(draft.batchKe, 10);
    const tahun = parseInt(draft.tahun, 10);
    const newId = `B${tahun}B${batchKe}`;
    if (batches.find(b => b.id === newId)) {
      toast(`Batch ${batchKe} tahun ${tahun} sudah ada`, 'warning'); return;
    }
    const newBatch = {
      id: newId,
      kode: `DIKSI-${tahun}-${String(batchKe).padStart(2, '0')}`,
      nama: `DIKSI Batch ${batchKe} · ${tahun}`,
      tanggalMulai: draft.tanggalMulai,
      tanggalSelesai: draft.tanggalSelesai,
      status: 'draft',
      pesertaIds: [],
    };
    setBatches([newBatch, ...batches]);
    addAudit(userShortName, `Membuat batch baru: ${newBatch.nama}`, null);
    toast(`${newBatch.nama} berhasil dibuat sebagai draft.`, 'success');
    setShowCreate(false);
    setDraft({ tahun: new Date().getFullYear() + 1, batchKe: '', tanggalMulai: '', tanggalSelesai: '' });
  };

  const statusVariant = (s) => s === 'active' ? 'success' : s === 'completed' ? 'default' : s === 'draft' ? 'warning' : 'info';
  const statusLabel = (s) => s === 'active' ? 'Aktif' : s === 'completed' ? 'Selesai' : s === 'draft' ? 'Draft' : s;

  return (
    <div>
      <SectionHeader
        eyebrow="Admin DSDM · Kelola Batch"
        title="Kelola Batch DIKSI"
        desc={`${batches.length} batch terdaftar · pilih batch yang ingin dikelola atau buat batch baru`}
        right={<Button variant="primary" icon={Plus} onClick={() => setShowCreate(true)}>Buat Batch Baru</Button>}
      />

      {/* Active batch highlight card */}
      {activeBatch && (
        <div style={{
          background: `linear-gradient(135deg, ${theme.navy} 0%, ${theme.navyDark} 100%)`,
          color: '#fff', padding: 22, borderRadius: 3, marginBottom: 18, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 90% 30%, rgba(184,147,90,0.15) 0%, transparent 50%)` }}/>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', color: theme.goldLight, fontWeight: 600, marginBottom: 4 }}>
                Batch Sedang Dikelola
              </div>
              <div style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}>{activeBatch.nama}</div>
              <div style={{ fontSize: 11, color: theme.goldLight, marginTop: 6, fontFamily: fonts.mono }}>
                {activeBatch.kode} · {fmtDate(activeBatch.tanggalMulai)} – {fmtDate(activeBatch.tanggalSelesai)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: fonts.display, fontSize: 26, fontWeight: 300, color: theme.gold, lineHeight: 1 }}>{pesertaCountByBatch(activeBatch.id)}</div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.goldLight, marginTop: 4 }}>Peserta</div>
              </div>
              <div style={{ width: 1, height: 36, background: 'rgba(184,147,90,0.3)' }}/>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: fonts.display, fontSize: 26, fontWeight: 300, color: theme.gold, lineHeight: 1 }}>{monthsBetween(activeBatch.tanggalMulai, activeBatch.tanggalSelesai)}</div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.goldLight, marginTop: 4 }}>Bulan</div>
              </div>
              <Button variant="gold" icon={ArrowRight} onClick={() => setActiveMenu('peserta')}>
                Kelola Peserta
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Batches list */}
      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2 }}>
        <div style={{ padding: '12px 18px', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Daftar Batch</div>
          <div style={{ fontSize: 10, color: theme.textMuted, fontFamily: fonts.mono }}>{batches.length} batch · diurutkan terbaru</div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fonts.body }}>
          <thead>
            <tr style={{ background: theme.bg, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted }}>
              <th style={{ textAlign: 'left', padding: '10px 18px', fontWeight: 600 }}>Batch</th>
              <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600 }}>Kode</th>
              <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600 }}>Periode</th>
              <th style={{ textAlign: 'center', padding: '10px 14px', fontWeight: 600 }}>Peserta</th>
              <th style={{ textAlign: 'center', padding: '10px 14px', fontWeight: 600 }}>Status</th>
              <th style={{ textAlign: 'right', padding: '10px 18px', fontWeight: 600 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sortedBatches.map(b => {
              const isActive = b.id === activeBatchId;
              return (
                <tr key={b.id} style={{
                  borderTop: `1px solid ${theme.border}`,
                  background: isActive ? theme.goldLight + '15' : '#fff',
                  fontSize: 11.5,
                }}>
                  <td style={{ padding: '12px 18px', color: theme.text }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {isActive && <div style={{ width: 4, height: 4, borderRadius: 2, background: theme.gold }}/>}
                      <span style={{ fontWeight: isActive ? 600 : 500 }}>{b.nama}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', color: theme.textMuted, fontFamily: fonts.mono, fontSize: 10.5 }}>{b.kode}</td>
                  <td style={{ padding: '12px 14px', color: theme.textMuted, fontSize: 10.5 }}>{fmtDate(b.tanggalMulai)} – {fmtDate(b.tanggalSelesai)}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{ fontFamily: fonts.mono, color: theme.text }}>{pesertaCountByBatch(b.id)}</span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <Pill variant={statusVariant(b.status)}>{statusLabel(b.status)}</Pill>
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    {isActive ? (
                      <span style={{ fontSize: 10, color: theme.gold, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Aktif</span>
                    ) : b.status === 'completed' ? (
                      <Button variant="ghost" size="sm" onClick={() => setActiveMenu('history')}>Lihat History →</Button>
                    ) : (
                      <Button variant="secondary" size="sm" onClick={() => selectBatch(b.id)}>Pilih</Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create batch modal */}
      {showCreate && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(10,37,64,0.72)',
          zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, fontFamily: fonts.body,
        }}
        onClick={() => setShowCreate(false)}>
          <div style={{ background: '#fff', borderRadius: 4, width: '100%', maxWidth: 520, overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.gold, fontWeight: 700 }}>Form Batch Baru</div>
                <div style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: 600, color: theme.text, marginTop: 2 }}>Buat Batch DIKSI</div>
              </div>
              <button onClick={() => setShowCreate(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, color: theme.textMuted }}>
                <X size={16}/>
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: theme.text, marginBottom: 4 }}>Tahun <span style={{ color: theme.danger }}>*</span></label>
                  <input type="number" min="2024" max="2030" value={draft.tahun}
                    onChange={e => setDraft({ ...draft, tahun: e.target.value })}
                    style={{ width: '100%', fontSize: 12, fontFamily: fonts.mono, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', boxSizing: 'border-box' }}/>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: theme.text, marginBottom: 4 }}>Batch ke <span style={{ color: theme.danger }}>*</span></label>
                  <input type="number" min="1" max="20" value={draft.batchKe}
                    onChange={e => setDraft({ ...draft, batchKe: e.target.value })}
                    placeholder="1, 2, 3, ..."
                    style={{ width: '100%', fontSize: 12, fontFamily: fonts.mono, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', boxSizing: 'border-box' }}/>
                </div>
              </div>

              <div style={{ background: theme.bg, padding: '8px 12px', borderRadius: 2, marginBottom: 14, fontSize: 10.5, color: theme.textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Info size={12}/>
                Nama batch akan menjadi: <strong style={{ color: theme.text, marginLeft: 4 }}>DIKSI Batch {draft.batchKe || 'X'} · {draft.tahun}</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 4 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: theme.text, marginBottom: 4 }}>Tanggal Mulai <span style={{ color: theme.danger }}>*</span></label>
                  <input type="date" value={draft.tanggalMulai}
                    onChange={e => setDraft({ ...draft, tanggalMulai: e.target.value })}
                    style={{ width: '100%', fontSize: 12, fontFamily: fonts.mono, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', boxSizing: 'border-box' }}/>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: theme.text, marginBottom: 4 }}>Tanggal Selesai <span style={{ color: theme.danger }}>*</span></label>
                  <input type="date" value={draft.tanggalSelesai}
                    onChange={e => setDraft({ ...draft, tanggalSelesai: e.target.value })}
                    style={{ width: '100%', fontSize: 12, fontFamily: fonts.mono, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', boxSizing: 'border-box' }}/>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div style={{ padding: '14px 24px', borderTop: `1px solid ${theme.border}`, background: theme.bg, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button variant="ghost" onClick={() => setShowCreate(false)}>Batal</Button>
              <Button variant="primary" icon={Plus} onClick={createBatch}>Buat Batch</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// =====================================================================
// ADMIN: LIST MENTOR — manajemen pool mentor (add/edit/remove)
// =====================================================================
function AdminMentorList() {
  const { mentors, setMentors, participants, toast, addAudit, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all | active | inactive
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ nama: '', nip: '', jabatan: '', satker: '', email: '', kompetensi: '', tahunMenjabat: new Date().getFullYear() });

  const userShortName = currentUser.user.split(',')[0];

  const filtered = mentors.filter(m => {
    if (filterStatus === 'active' && !m.aktif) return false;
    if (filterStatus === 'inactive' && m.aktif) return false;
    if (search && !m.nama.toLowerCase().includes(search.toLowerCase()) && !m.nip.includes(search) && !m.satker.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const menteeCount = (mentorUserId) => participants.filter(p => p.mentorUserId === mentorUserId).length;

  const resetDraft = () => setDraft({ nama: '', nip: '', jabatan: '', satker: '', email: '', kompetensi: '', tahunMenjabat: new Date().getFullYear() });

  const openEdit = (m) => {
    setEditingId(m.id);
    setDraft({ nama: m.nama, nip: m.nip, jabatan: m.jabatan, satker: m.satker, email: m.email, kompetensi: m.kompetensi, tahunMenjabat: m.tahunMenjabat });
    setShowCreate(true);
  };

  const submit = () => {
    if (!draft.nama || !draft.nip || !draft.jabatan || !draft.satker) {
      toast('Mohon lengkapi field wajib', 'warning'); return;
    }
    if (draft.nip.length < 10) { toast('NIP minimal 10 digit', 'warning'); return; }

    if (editingId) {
      setMentors(prev => prev.map(m => m.id === editingId ? { ...m, ...draft, tahunMenjabat: parseInt(draft.tahunMenjabat, 10) } : m));
      addAudit(userShortName, `Mengubah data mentor: ${draft.nama}`, null);
      toast(`Data mentor ${draft.nama} diperbarui.`, 'success');
    } else {
      const newId = `M${String(mentors.length + 1).padStart(3, '0')}`;
      const newMentor = { id: newId, ...draft, tahunMenjabat: parseInt(draft.tahunMenjabat, 10), aktif: true, userId: null };
      setMentors([newMentor, ...mentors]);
      addAudit(userShortName, `Menambah mentor baru: ${draft.nama}`, null);
      toast(`Mentor ${draft.nama} berhasil ditambahkan.`, 'success');
    }
    setShowCreate(false);
    setEditingId(null);
    resetDraft();
  };

  const toggleActive = (m) => {
    setMentors(prev => prev.map(x => x.id === m.id ? { ...x, aktif: !x.aktif } : x));
    addAudit(userShortName, `${m.aktif ? 'Menonaktifkan' : 'Mengaktifkan'} mentor: ${m.nama}`, null);
    toast(`${m.nama} ${m.aktif ? 'dinonaktifkan' : 'diaktifkan'}.`, 'info');
  };

  const removeMentor = (m) => {
    const count = menteeCount(m.userId);
    if (count > 0) {
      toast(`Tidak bisa menghapus — mentor masih punya ${count} mentee aktif`, 'warning'); return;
    }
    if (!confirm(`Hapus mentor ${m.nama}?`)) return;
    setMentors(prev => prev.filter(x => x.id !== m.id));
    addAudit(userShortName, `Menghapus mentor: ${m.nama}`, null);
    toast(`Mentor ${m.nama} dihapus.`, 'success');
  };

  const totalAktif = mentors.filter(m => m.aktif).length;

  return (
    <div>
      <SectionHeader
        eyebrow="Admin DSDM · List Mentor"
        title="List Mentor"
        desc={`${mentors.length} mentor terdaftar · ${totalAktif} aktif · pool atasan peserta yang qualify untuk coaching`}
        right={<Button variant="primary" icon={Plus} onClick={() => { resetDraft(); setEditingId(null); setShowCreate(true); }}>Tambah Mentor</Button>}
      />

      {/* Stats summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
        <StatCard label="Total Mentor" value={mentors.length} sub="dalam pool" accent={theme.navy}/>
        <StatCard label="Mentor Aktif" value={totalAktif} sub={`${mentors.length - totalAktif} non-aktif`} accent={theme.success}/>
        <StatCard label="Sedang Menugas" value={mentors.filter(m => menteeCount(m.userId) > 0).length} sub="punya mentee" accent={theme.gold}/>
        <StatCard label="Total Penugasan" value={participants.filter(p => p.mentorUserId).length} sub="mentee aktif" accent="#7C3AED"/>
      </div>

      {/* Filter bar */}
      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, padding: '10px 14px', marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: theme.bg, borderRadius: 2 }}>
          <Search size={13} style={{ color: theme.textSubtle }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, NIP, atau satker..."
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 12, fontFamily: fonts.body, color: theme.text }}/>
        </div>
        <div style={{ display: 'flex', gap: 4, padding: 3, background: theme.bg, borderRadius: 2 }}>
          {[
            { v: 'all', l: 'Semua', n: mentors.length },
            { v: 'active', l: 'Aktif', n: totalAktif },
            { v: 'inactive', l: 'Non-aktif', n: mentors.length - totalAktif },
          ].map(opt => (
            <button key={opt.v} onClick={() => setFilterStatus(opt.v)}
              style={{
                padding: '6px 12px', fontSize: 11, fontFamily: fonts.body, fontWeight: 600,
                background: filterStatus === opt.v ? '#fff' : 'transparent',
                color: filterStatus === opt.v ? theme.text : theme.textMuted,
                border: 'none', borderRadius: 2, cursor: 'pointer',
                boxShadow: filterStatus === opt.v ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}>
              {opt.l} <span style={{ fontFamily: fonts.mono, fontSize: 10, color: theme.textSubtle, marginLeft: 3 }}>{opt.n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mentors table */}
      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fonts.body }}>
          <thead>
            <tr style={{ background: theme.bg, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted }}>
              <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600 }}>Mentor</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 600 }}>Jabatan</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 600 }}>Kompetensi</th>
              <th style={{ textAlign: 'center', padding: '10px 12px', fontWeight: 600 }}>Mentee</th>
              <th style={{ textAlign: 'center', padding: '10px 12px', fontWeight: 600 }}>Status</th>
              <th style={{ textAlign: 'right', padding: '10px 16px', fontWeight: 600 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, fontSize: 11, color: theme.textMuted, fontStyle: 'italic' }}>Tidak ada mentor sesuai filter.</td></tr>
            )}
            {filtered.map(m => {
              const mc = menteeCount(m.userId);
              return (
                <tr key={m.id} style={{ borderTop: `1px solid ${theme.border}`, fontSize: 11.5, opacity: m.aktif ? 1 : 0.55 }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, background: theme.navy, color: theme.gold, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0 }}>
                        {m.nama.split(' ').slice(0, 2).map(n => n[0]).join('').replace(/[^A-Z]/g, '').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>{m.nama}</div>
                        <div style={{ fontSize: 10, color: theme.textMuted, fontFamily: fonts.mono }}>NIP {m.nip}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: theme.text }}>
                    <div style={{ fontSize: 11, fontWeight: 500 }}>{m.jabatan}</div>
                    <div style={{ fontSize: 10, color: theme.textMuted }}>{m.satker}</div>
                  </td>
                  <td style={{ padding: '12px', fontSize: 10.5, color: theme.textMuted, lineHeight: 1.5, maxWidth: 220 }}>{m.kompetensi}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {mc > 0 ? (
                      <Pill variant="info">{mc} aktif</Pill>
                    ) : (
                      <span style={{ fontSize: 10, color: theme.textSubtle, fontFamily: fonts.mono }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button onClick={() => toggleActive(m)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <Pill variant={m.aktif ? 'success' : 'default'}>{m.aktif ? 'Aktif' : 'Non-aktif'}</Pill>
                    </button>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 4 }}>
                      <button onClick={() => openEdit(m)} title="Edit"
                        style={{ background: 'transparent', border: `1px solid ${theme.border}`, padding: '5px 8px', cursor: 'pointer', borderRadius: 2, color: theme.textMuted }}>
                        <Edit3 size={11}/>
                      </button>
                      <button onClick={() => removeMentor(m)} title="Hapus" disabled={mc > 0}
                        style={{ background: 'transparent', border: `1px solid ${theme.border}`, padding: '5px 8px', cursor: mc > 0 ? 'not-allowed' : 'pointer', borderRadius: 2, color: mc > 0 ? theme.textSubtle : theme.danger, opacity: mc > 0 ? 0.4 : 1 }}>
                        <X size={11}/>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit modal */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,37,64,0.72)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: fonts.body }}
          onClick={() => { setShowCreate(false); setEditingId(null); }}>
          <div style={{ background: '#fff', borderRadius: 4, width: '100%', maxWidth: 580, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.gold, fontWeight: 700 }}>{editingId ? 'Edit' : 'Form Mentor Baru'}</div>
                <div style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: 600, color: theme.text, marginTop: 2 }}>{editingId ? 'Edit Data Mentor' : 'Tambah Mentor Baru'}</div>
              </div>
              <button onClick={() => { setShowCreate(false); setEditingId(null); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, color: theme.textMuted }}>
                <X size={16}/>
              </button>
            </div>

            <div style={{ padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Nama Lengkap <span style={{ color: theme.danger }}>*</span></label>
                  <input value={draft.nama} onChange={e => setDraft({ ...draft, nama: e.target.value })}
                    placeholder="Contoh: Dr. John Doe, M.Sc"
                    style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', boxSizing: 'border-box' }}/>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>NIP <span style={{ color: theme.danger }}>*</span></label>
                  <input value={draft.nip} onChange={e => setDraft({ ...draft, nip: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="18 digit"
                    style={{ width: '100%', fontSize: 12, fontFamily: fonts.mono, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', boxSizing: 'border-box' }}/>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Tahun Menjabat</label>
                  <input type="number" value={draft.tahunMenjabat} onChange={e => setDraft({ ...draft, tahunMenjabat: e.target.value })}
                    style={{ width: '100%', fontSize: 12, fontFamily: fonts.mono, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', boxSizing: 'border-box' }}/>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Jabatan <span style={{ color: theme.danger }}>*</span></label>
                  <input value={draft.jabatan} onChange={e => setDraft({ ...draft, jabatan: e.target.value })}
                    placeholder="Contoh: Deputi Direktur"
                    style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', boxSizing: 'border-box' }}/>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Satker <span style={{ color: theme.danger }}>*</span></label>
                  <input value={draft.satker} onChange={e => setDraft({ ...draft, satker: e.target.value })}
                    placeholder="DKEM, DKMP, dst"
                    style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', boxSizing: 'border-box' }}/>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Email Resmi</label>
                  <input type="email" value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })}
                    placeholder="nama@bi.go.id"
                    style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', boxSizing: 'border-box' }}/>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Kompetensi / Bidang Keahlian</label>
                  <textarea value={draft.kompetensi} onChange={e => setDraft({ ...draft, kompetensi: e.target.value })} rows={2}
                    placeholder="Contoh: Strategic Leadership · Risk Management"
                    style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', resize: 'none', boxSizing: 'border-box' }}/>
                </div>
              </div>
            </div>

            <div style={{ padding: '14px 24px', borderTop: `1px solid ${theme.border}`, background: theme.bg, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button variant="ghost" onClick={() => { setShowCreate(false); setEditingId(null); }}>Batal</Button>
              <Button variant="primary" icon={editingId ? Check : Plus} onClick={submit}>{editingId ? 'Simpan Perubahan' : 'Tambah Mentor'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// ADMIN: WIKI / MODUL — manajemen materi konseling untuk peserta
// =====================================================================
function AdminWiki() {
  const { toast, addAudit, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ judul: '', kategori: 'Pengantar', tahap: 1, ringkasan: '', isi: '', visibility: 'all' });

  const userShortName = currentUser.user.split(',')[0];

  const [modul, setModul] = useState([
    { id: 'W001', judul: 'Pengantar Program DIKSI Coaching',     kategori: 'Pengantar',   tahap: 1, ringkasan: 'Overview lengkap program, tujuan, dan timeline 7 tahap.', isi: 'Materi lengkap...', visibility: 'all',     updatedAt: '2026-01-10', author: 'Dr. Ratna Kusumaningrum', readCount: 6, status: 'published' },
    { id: 'W002', judul: 'Panduan Check-in dan Registrasi',       kategori: 'Panduan',    tahap: 1, ringkasan: 'Cara melakukan check-in saat kegiatan dimulai.',           isi: 'Materi lengkap...', visibility: 'all',     updatedAt: '2026-01-12', author: 'Dr. Ratna Kusumaningrum', readCount: 5, status: 'published' },
    { id: 'W003', judul: 'Materi Sosialisasi DIKSI 2026',          kategori: 'Materi',     tahap: 2, ringkasan: 'Slide deck sosialisasi yang dipresentasikan saat kickoff.', isi: 'Materi lengkap...', visibility: 'peserta', updatedAt: '2026-01-15', author: 'Dr. Ratna Kusumaningrum', readCount: 5, status: 'published' },
    { id: 'W004', judul: 'Soal Pretest & Bank Soal',                kategori: 'Asesmen',    tahap: 2, ringkasan: 'Bank soal pretest dengan 5 pertanyaan baseline.',          isi: 'Materi lengkap...', visibility: 'admin',   updatedAt: '2026-01-14', author: 'Dr. Ratna Kusumaningrum', readCount: 1, status: 'published' },
    { id: 'W005', judul: 'Persiapan Sesi 1-on-1 Coaching',          kategori: 'Panduan',    tahap: 3, ringkasan: 'Tips & template persiapan sesi coaching antara mentor dan mentee.', isi: 'Materi lengkap...', visibility: 'all', updatedAt: '2026-02-01', author: 'Dr. Ratna Kusumaningrum', readCount: 4, status: 'published' },
    { id: 'W006', judul: 'Template Evaluasi Mentor',                kategori: 'Template',   tahap: 3, ringkasan: 'Format strengths, area pengembangan, rekomendasi.',         isi: 'Materi lengkap...', visibility: 'mentor',  updatedAt: '2026-02-03', author: 'Dr. Ratna Kusumaningrum', readCount: 2, status: 'published' },
    { id: 'W007', judul: 'Coaching Skills untuk Mentor',            kategori: 'Materi',     tahap: 3, ringkasan: 'Modul mentor: GROW model, active listening, powerful questions.', isi: 'Materi lengkap...', visibility: 'mentor', updatedAt: '2026-02-05', author: 'Dr. Ratna Kusumaningrum', readCount: 2, status: 'draft' },
  ]);

  const kategoriList = [...new Set(modul.map(m => m.kategori))];
  const filtered = modul.filter(m => {
    if (filterKategori !== 'all' && m.kategori !== filterKategori) return false;
    if (search && !m.judul.toLowerCase().includes(search.toLowerCase()) && !m.ringkasan.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPublished = modul.filter(m => m.status === 'published').length;

  const resetDraft = () => setDraft({ judul: '', kategori: 'Pengantar', tahap: 1, ringkasan: '', isi: '', visibility: 'all' });

  const openEdit = (m) => {
    setEditingId(m.id);
    setDraft({ judul: m.judul, kategori: m.kategori, tahap: m.tahap, ringkasan: m.ringkasan, isi: m.isi, visibility: m.visibility });
    setShowEditor(true);
  };

  const submit = () => {
    if (!draft.judul.trim() || !draft.ringkasan.trim()) {
      toast('Judul dan ringkasan wajib diisi', 'warning'); return;
    }
    if (editingId) {
      setModul(prev => prev.map(m => m.id === editingId ? { ...m, ...draft, tahap: parseInt(draft.tahap, 10), updatedAt: new Date().toISOString().slice(0,10) } : m));
      addAudit(userShortName, `Mengubah modul: ${draft.judul}`, null);
      toast(`Modul "${draft.judul}" diperbarui.`, 'success');
    } else {
      const newId = `W${String(modul.length + 1).padStart(3, '0')}`;
      const newModul = { id: newId, ...draft, tahap: parseInt(draft.tahap, 10), updatedAt: new Date().toISOString().slice(0,10), author: currentUser.user, readCount: 0, status: 'draft' };
      setModul([newModul, ...modul]);
      addAudit(userShortName, `Membuat modul baru: ${draft.judul}`, null);
      toast(`Modul "${draft.judul}" dibuat sebagai draft.`, 'success');
    }
    setShowEditor(false); setEditingId(null); resetDraft();
  };

  const togglePublish = (m) => {
    setModul(prev => prev.map(x => x.id === m.id ? { ...x, status: x.status === 'published' ? 'draft' : 'published', updatedAt: new Date().toISOString().slice(0,10) } : x));
    addAudit(userShortName, `${m.status === 'published' ? 'Menarik publish' : 'Mempublish'} modul: ${m.judul}`, null);
    toast(`Modul "${m.judul}" ${m.status === 'published' ? 'di-unpublish' : 'dipublish'}.`, 'info');
  };

  const removeModul = (m) => {
    if (!confirm(`Hapus modul "${m.judul}"?`)) return;
    setModul(prev => prev.filter(x => x.id !== m.id));
    addAudit(userShortName, `Menghapus modul: ${m.judul}`, null);
    toast(`Modul "${m.judul}" dihapus.`, 'success');
  };

  const visibilityIcon = (v) => v === 'all' ? Users : v === 'peserta' ? GraduationCap : v === 'mentor' ? Sparkles : Shield;
  const visibilityLabel = (v) => v === 'all' ? 'Semua role' : v === 'peserta' ? 'Peserta saja' : v === 'mentor' ? 'Mentor saja' : 'Admin saja';

  return (
    <div>
      <SectionHeader
        eyebrow="Admin DSDM · Wiki / Modul"
        title="Wiki / Modul Konseling"
        desc={`${modul.length} modul terdaftar · ${totalPublished} published · materi referensi untuk peserta dan mentor`}
        right={<Button variant="primary" icon={Plus} onClick={() => { resetDraft(); setEditingId(null); setShowEditor(true); }}>Tambah Modul</Button>}
      />

      {/* Stats summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
        <StatCard label="Total Modul" value={modul.length} sub="dalam knowledge base" accent={theme.navy}/>
        <StatCard label="Published" value={totalPublished} sub={`${modul.length - totalPublished} draft`} accent={theme.success}/>
        <StatCard label="Total Reads" value={modul.reduce((a,m) => a + m.readCount, 0)} sub="kumulatif" accent={theme.gold}/>
        <StatCard label="Kategori" value={kategoriList.length} sub="topik aktif" accent="#7C3AED"/>
      </div>

      {/* Filter bar */}
      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, padding: '10px 14px', marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: theme.bg, borderRadius: 2 }}>
          <Search size={13} style={{ color: theme.textSubtle }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari judul atau topik..."
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 12, fontFamily: fonts.body, color: theme.text }}/>
        </div>
        <select value={filterKategori} onChange={e => setFilterKategori(e.target.value)}
          style={{ fontSize: 11, fontFamily: fonts.body, padding: '6px 10px', border: `1px solid ${theme.border}`, borderRadius: 2, background: '#fff', color: theme.text, cursor: 'pointer', outline: 'none' }}>
          <option value="all">Semua kategori</option>
          {kategoriList.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      {/* Modul cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', background: '#fff', border: `1px dashed ${theme.borderStrong}`, padding: 32, textAlign: 'center', borderRadius: 2, fontSize: 11, color: theme.textMuted }}>
            Tidak ada modul sesuai filter.
          </div>
        )}
        {filtered.map(m => {
          const VicIc = visibilityIcon(m.visibility);
          return (
            <div key={m.id} style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, padding: 16, position: 'relative' }}>
              {/* Header: kategori + status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Pill variant="info" size="xs">{m.kategori}</Pill>
                  <span style={{ fontSize: 9, color: theme.textMuted, fontFamily: fonts.mono, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tahap 0{m.tahap}</span>
                </div>
                <Pill variant={m.status === 'published' ? 'success' : 'warning'}>{m.status === 'published' ? 'Published' : 'Draft'}</Pill>
              </div>

              {/* Title + ringkasan */}
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, fontFamily: fonts.display, marginBottom: 6, lineHeight: 1.35 }}>{m.judul}</div>
              <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.5, marginBottom: 12, minHeight: 33 }}>{m.ringkasan}</div>

              {/* Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 10, color: theme.textMuted, paddingTop: 10, borderTop: `1px solid ${theme.border}`, marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title={visibilityLabel(m.visibility)}>
                  <VicIc size={11}/> {visibilityLabel(m.visibility)}
                </div>
                <span>·</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Eye size={11}/> {m.readCount} reads
                </div>
                <span style={{ marginLeft: 'auto', fontFamily: fonts.mono, fontSize: 9.5 }}>{m.updatedAt}</span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6 }}>
                <Button variant="ghost" size="sm" onClick={() => openEdit(m)} icon={Edit3}>Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => togglePublish(m)}>
                  {m.status === 'published' ? 'Unpublish' : 'Publish'}
                </Button>
                <button onClick={() => removeModul(m)} title="Hapus"
                  style={{ background: 'transparent', border: `1px solid ${theme.border}`, padding: '5px 8px', cursor: 'pointer', borderRadius: 2, color: theme.danger, marginLeft: 'auto' }}>
                  <X size={11}/>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor modal */}
      {showEditor && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,37,64,0.72)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: fonts.body }}
          onClick={() => { setShowEditor(false); setEditingId(null); }}>
          <div style={{ background: '#fff', borderRadius: 4, width: '100%', maxWidth: 640, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.gold, fontWeight: 700 }}>{editingId ? 'Edit' : 'Form Modul Baru'}</div>
                <div style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: 600, color: theme.text, marginTop: 2 }}>{editingId ? 'Edit Modul' : 'Tambah Modul Baru'}</div>
              </div>
              <button onClick={() => { setShowEditor(false); setEditingId(null); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, color: theme.textMuted }}>
                <X size={16}/>
              </button>
            </div>

            <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Judul Modul <span style={{ color: theme.danger }}>*</span></label>
                <input value={draft.judul} onChange={e => setDraft({ ...draft, judul: e.target.value })}
                  placeholder="Contoh: Persiapan Sesi 1-on-1 Coaching"
                  style={{ width: '100%', fontSize: 13, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', boxSizing: 'border-box' }}/>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Kategori</label>
                  <select value={draft.kategori} onChange={e => setDraft({ ...draft, kategori: e.target.value })}
                    style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                    {['Pengantar', 'Panduan', 'Materi', 'Asesmen', 'Template', 'Referensi'].map(k => <option key={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Tahap Terkait</label>
                  <select value={draft.tahap} onChange={e => setDraft({ ...draft, tahap: e.target.value })}
                    style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                    {STAGES.map(s => <option key={s.id} value={s.id}>0{s.id} · {s.nama}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Visibility</label>
                  <select value={draft.visibility} onChange={e => setDraft({ ...draft, visibility: e.target.value })}
                    style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                    <option value="all">Semua role</option>
                    <option value="peserta">Peserta saja</option>
                    <option value="mentor">Mentor saja</option>
                    <option value="admin">Admin saja</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Ringkasan <span style={{ color: theme.danger }}>*</span></label>
                <textarea value={draft.ringkasan} onChange={e => setDraft({ ...draft, ringkasan: e.target.value })} rows={2}
                  placeholder="Deskripsi singkat 1-2 kalimat untuk preview di card"
                  style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', resize: 'none', boxSizing: 'border-box' }}/>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Isi Materi</label>
                <textarea value={draft.isi} onChange={e => setDraft({ ...draft, isi: e.target.value })} rows={8}
                  placeholder="Konten lengkap modul (mendukung markdown)..."
                  style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.55 }}/>
              </div>
            </div>

            <div style={{ padding: '14px 24px', borderTop: `1px solid ${theme.border}`, background: theme.bg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 10.5, color: theme.textMuted, fontStyle: 'italic' }}>Modul akan dibuat sebagai draft — publish saat siap</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="ghost" onClick={() => { setShowEditor(false); setEditingId(null); }}>Batal</Button>
                <Button variant="primary" icon={editingId ? Check : Plus} onClick={submit}>{editingId ? 'Simpan Perubahan' : 'Buat Modul'}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// ADMIN: QNA INBOX — list pertanyaan + reply inline (minimalis)
// =====================================================================
function AdminQNA() {
  const { qnaThreads, setQnaThreads, participants, toast, addAudit, pushNotif, currentUser } = useApp();
  const [replies, setReplies] = useState({}); // { threadId: 'draft text' }
  const userShortName = currentUser.user.split(',')[0];
  const adminFullName = currentUser.user;

  // Sort: pending dulu, lalu by updatedAt desc
  const sorted = [...qnaThreads].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'pending' ? -1 : 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  const sendReply = (thread) => {
    const text = (replies[thread.id] || '').trim();
    if (!text) { toast('Tulis balasan terlebih dahulu', 'warning'); return; }
    const peserta = participants.find(p => p.id === thread.pesertaId);
    const now = new Date();
    const at = `${now.toISOString().slice(0,10)} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const newMsg = { id: 'm' + Date.now(), from: 'admin', author: adminFullName, body: text, at };
    setQnaThreads(prev => prev.map(t => t.id !== thread.id ? t : ({
      ...t,
      messages: [...t.messages, newMsg],
      status: 'answered',
      updatedAt: at.slice(0,10),
      adminUnread: false,
    })));
    addAudit(userShortName, `Membalas QNA: ${thread.subject}`, peserta?.nama);
    pushNotif('peserta', { type: 'success', title: `Admin membalas: ${thread.subject}`, desc: text.slice(0, 80) + (text.length > 80 ? '...' : '') });
    toast(`Balasan terkirim ke ${peserta?.nama.split(' ').slice(0,2).join(' ') || 'peserta'}.`, 'success');
    setReplies(prev => ({ ...prev, [thread.id]: '' }));
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Admin DSDM · QNA Inbox"
        title="QNA Peserta"
        desc={`${qnaThreads.length} pertanyaan · ${qnaThreads.filter(t => t.status === 'pending').length} menunggu balasan`}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sorted.length === 0 && (
          <div style={{ background: '#fff', border: `1px dashed ${theme.borderStrong}`, padding: 32, textAlign: 'center', borderRadius: 2, fontSize: 11.5, color: theme.textMuted }}>
            Belum ada pertanyaan dari peserta.
          </div>
        )}
        {sorted.map(thread => {
          const peserta = participants.find(p => p.id === thread.pesertaId);
          const lastMsg = thread.messages[thread.messages.length - 1];
          const initialMsg = thread.messages.find(m => m.from === 'peserta') || lastMsg;

          return (
            <div key={thread.id} style={{
              background: '#fff',
              border: `1px solid ${theme.border}`,
              borderLeft: thread.status === 'pending' ? `3px solid ${theme.warning}` : `3px solid ${theme.success}`,
              borderRadius: 2, overflow: 'hidden',
            }}>
              {/* Header: peserta info + status + tanggal */}
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: theme.navy, color: theme.gold, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0 }}>
                    {peserta?.nama.split(' ').slice(0,2).map(n => n[0]).join('') || '??'}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>{peserta?.nama || 'Unknown'}</div>
                    <div style={{ fontSize: 10, color: theme.textMuted }}>{peserta?.satker} · {peserta?.pangkat}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 10, color: theme.textSubtle, fontFamily: fonts.mono }}>{thread.updatedAt}</span>
                  <Pill variant={thread.status === 'pending' ? 'warning' : 'success'}>
                    {thread.status === 'pending' ? 'Menunggu' : 'Dijawab'}
                  </Pill>
                </div>
              </div>

              {/* Body — split: pertanyaan kiri | reply kanan */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                {/* LEFT: pertanyaan + history singkat */}
                <div style={{ padding: 16, borderRight: `1px solid ${theme.border}` }}>
                  <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600, marginBottom: 6 }}>
                    Subject
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 12 }}>{thread.subject}</div>

                  <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600, marginBottom: 6 }}>
                    Pertanyaan
                  </div>
                  <div style={{ fontSize: 12, color: theme.text, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{initialMsg?.body || ''}</div>

                  {/* History balasan sebelumnya, kalau ada */}
                  {thread.messages.length > 1 && (
                    <details style={{ marginTop: 12, fontSize: 11 }}>
                      <summary style={{ cursor: 'pointer', color: theme.textMuted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
                        Riwayat percakapan ({thread.messages.length} pesan)
                      </summary>
                      <div style={{ marginTop: 8, paddingLeft: 8, borderLeft: `2px solid ${theme.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {thread.messages.slice(1).map(m => (
                          <div key={m.id}>
                            <div style={{ fontSize: 9.5, fontWeight: 600, color: m.from === 'admin' ? theme.navy : theme.text, marginBottom: 2 }}>
                              {m.from === 'admin' ? `Admin · ${m.author.split(',')[0]}` : 'Peserta'} · <span style={{ fontFamily: fonts.mono, color: theme.textSubtle, fontWeight: 400 }}>{m.at}</span>
                            </div>
                            <div style={{ fontSize: 11, color: theme.text, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{m.body}</div>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>

                {/* RIGHT: reply box */}
                <div style={{ padding: 16, background: theme.bg }}>
                  <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600, marginBottom: 6 }}>
                    Balasan Admin
                  </div>
                  <textarea
                    value={replies[thread.id] || ''}
                    onChange={e => setReplies({ ...replies, [thread.id]: e.target.value })}
                    rows={5}
                    placeholder={`Tulis balasan ke ${peserta?.nama.split(' ')[0] || 'peserta'}...`}
                    style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.5, background: '#fff' }}
                  />
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="primary" icon={Send} onClick={() => sendReply(thread)} disabled={!(replies[thread.id] || '').trim()}>
                      Kirim Balasan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminPeserta() {
  const { participants, setParticipants, batches, activeBatchId, currentUser, toast, addAudit, pushNotif } = useApp();
  const [filterBatch, setFilterBatch] = useState(activeBatchId);
  const [filterSatker, setFilterSatker] = useState('all');
  const [showImport, setShowImport] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showSetMentor, setShowSetMentor] = useState(null); // peserta object
  const [confirmDelete, setConfirmDelete] = useState(null); // peserta object

  const userShortName = currentUser.user.split(',')[0];

  // Daftar satker unik dari peserta
  const satkerList = [...new Set(participants.map(p => p.satker))].sort();

  // Filter peserta sesuai filter
  const filtered = participants.filter(p => {
    if (filterBatch !== 'all' && p.batchId !== filterBatch) return false;
    if (filterSatker !== 'all' && p.satker !== filterSatker) return false;
    return true;
  });

  const sendReminder = (p) => {
    pushNotif('peserta', { type: 'info', title: 'Reminder konfirmasi kesediaan', desc: `${userShortName} mengirim pengingat untuk konfirmasi keikutsertaan DIKSI` });
    addAudit(userShortName, `Mengirim reminder konfirmasi kesediaan`, p.nama);
    toast(`Reminder terkirim ke ${p.nama}.`, 'success');
  };

  const deletePeserta = (p) => {
    setParticipants(prev => prev.filter(x => x.id !== p.id));
    addAudit(userShortName, `Menghapus peserta dari batch`, p.nama);
    toast(`${p.nama} dihapus dari batch.`, 'success');
    setConfirmDelete(null);
  };

  const updateMentor = (p, mentorUserId) => {
    setParticipants(prev => prev.map(x => x.id !== p.id ? x : { ...x, mentorUserId }));
    const mentor = USERS[mentorUserId];
    addAudit(userShortName, `Set mentor: ${mentor?.user.split(',')[0]}`, p.nama);
    pushNotif('mentor', { type: 'info', title: `Anda di-assign sebagai mentor`, desc: `${p.nama} · ${p.satker}` });
    toast(`Mentor ${p.nama} diperbarui.`, 'success');
    setShowSetMentor(null);
  };

  const konfStat = (k) => {
    if (k === 'confirmed') return { variant: 'success', label: 'Bersedia' };
    if (k === 'declined')  return { variant: 'danger',  label: 'Tidak Bersedia' };
    return { variant: 'warning', label: 'Menunggu' };
  };

  const activeBatch = batches.find(b => b.id === filterBatch);

  return (
    <div>
      <SectionHeader
        eyebrow="Admin DSDM · Management Kegiatan"
        title="Manajemen Peserta DIKSI"
        desc={`${filtered.length} peserta terlihat · ${participants.filter(p => p.konfirmasiHadir === 'pending').length} menunggu konfirmasi kesediaan`}
        right={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button icon={Upload} variant="secondary" onClick={() => setShowImport(true)}>Import Excel</Button>
            <Button icon={UserPlus} variant="primary" onClick={() => setShowAdd(true)}>Tambah Peserta</Button>
          </div>
        }
      />

      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2 }}>
        {/* FILTER BAR — dropdown batch + dropdown satker */}
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}`, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={13} style={{ color: theme.textMuted }}/>
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600 }}>Filter</span>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.textSubtle, fontWeight: 600, marginBottom: 3 }}>Batch</label>
            <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)}
              style={{ fontSize: 11, fontFamily: fonts.body, padding: '6px 10px', border: `1px solid ${theme.border}`, borderRadius: 2, background: '#fff', color: theme.text, cursor: 'pointer', outline: 'none', minWidth: 200 }}>
              <option value="all">Semua Batch</option>
              {batches.map(b => <option key={b.id} value={b.id}>{b.nama}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.textSubtle, fontWeight: 600, marginBottom: 3 }}>Satker</label>
            <select value={filterSatker} onChange={e => setFilterSatker(e.target.value)}
              style={{ fontSize: 11, fontFamily: fonts.body, padding: '6px 10px', border: `1px solid ${theme.border}`, borderRadius: 2, background: '#fff', color: theme.text, cursor: 'pointer', outline: 'none', minWidth: 180 }}>
              <option value="all">Semua Satker</option>
              {satkerList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <Button icon={Download} variant="ghost" size="sm">Export</Button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fonts.body }}>
            <thead>
              <tr style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
                {['NIP', 'Nama Peserta', 'Satker', 'Pangkat', 'Mentor', 'Kesediaan', 'Aksi'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.textMuted, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const stat = konfStat(p.konfirmasiHadir);
                const mentor = USERS[p.mentorUserId];
                return (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <td style={{ padding: '10px 14px', fontSize: 11, color: theme.textMuted, fontFamily: fonts.mono }}>{p.nip}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: theme.text }}>{p.nama}</div>
                      <div style={{ fontSize: 10, color: theme.textMuted }}>{p.jobFamily}</div>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: 11, color: theme.text }}>{p.satker}</td>
                    <td style={{ padding: '10px 14px', fontSize: 11, color: theme.text }}>{p.pangkat}</td>
                    <td style={{ padding: '10px 14px', fontSize: 11, color: theme.text }}>{mentor ? mentor.user.split(',')[0] : <span style={{ color: theme.textSubtle, fontStyle: 'italic' }}>belum di-assign</span>}</td>
                    <td style={{ padding: '10px 14px' }}><Pill variant={stat.variant}>{stat.label}</Pill></td>
                    <td style={{ padding: '8px 14px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => sendReminder(p)} title="Kirim reminder kesediaan"
                          style={{ background: 'transparent', border: `1px solid ${theme.border}`, padding: '5px 7px', cursor: 'pointer', borderRadius: 2, color: theme.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = theme.gold; e.currentTarget.style.color = theme.goldDark; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textMuted; }}>
                          <Mail size={12}/>
                        </button>
                        <button onClick={() => setShowSetMentor(p)} title="Set mentor"
                          style={{ background: 'transparent', border: `1px solid ${theme.border}`, padding: '5px 7px', cursor: 'pointer', borderRadius: 2, color: theme.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = theme.navy; e.currentTarget.style.color = theme.navy; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textMuted; }}>
                          <Sparkles size={12}/>
                        </button>
                        <button onClick={() => setConfirmDelete(p)} title="Hapus peserta"
                          style={{ background: 'transparent', border: `1px solid ${theme.border}`, padding: '5px 7px', cursor: 'pointer', borderRadius: 2, color: theme.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = theme.danger; e.currentTarget.style.color = theme.danger; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textMuted; }}>
                          <Trash2 size={12}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', fontSize: 11, color: theme.textMuted, fontStyle: 'italic' }}>Tidak ada peserta sesuai filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showImport && <ImportModal onClose={() => setShowImport(false)}/>}
      {showAdd && <AddPesertaModal onClose={() => setShowAdd(false)}/>}
      {showSetMentor && <SetMentorModal peserta={showSetMentor} onClose={() => setShowSetMentor(null)} onSave={updateMentor}/>}
      {confirmDelete && (
        <ConfirmModal
          title="Hapus peserta"
          desc={<>Yakin menghapus <strong>{confirmDelete.nama}</strong> dari batch ini? Tindakan ini tidak bisa dibatalkan.</>}
          confirmLabel="Hapus"
          confirmVariant="danger"
          onConfirm={() => deletePeserta(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}/>
      )}
    </div>
  );
}

// =====================================================================
// CONFIRM MODAL — generic
// =====================================================================
function ConfirmModal({ title, desc, confirmLabel = 'OK', cancelLabel = 'Batal', confirmVariant = 'primary', onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,37,64,0.72)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: fonts.body }} onClick={onCancel}>
      <div style={{ background: '#fff', borderRadius: 4, width: '100%', maxWidth: 420, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 38, height: 38, background: confirmVariant === 'danger' ? '#FEE2E2' : theme.goldLight + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 19 }}>
              <AlertCircle size={18} style={{ color: confirmVariant === 'danger' ? theme.danger : theme.goldDark }}/>
            </div>
            <div style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: 600, color: theme.text }}>{title}</div>
          </div>
          <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.55 }}>{desc}</div>
        </div>
        <div style={{ padding: '12px 22px', borderTop: `1px solid ${theme.border}`, background: theme.bg, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={confirmVariant} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// SET MENTOR MODAL
// =====================================================================
function SetMentorModal({ peserta, onClose, onSave }) {
  const [selected, setSelected] = useState(peserta.mentorUserId || '');
  const mentorUsers = Object.values(USERS).filter(u => (u.roles || []).includes('mentor'));

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,37,64,0.72)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: fonts.body }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 4, width: '100%', maxWidth: 480, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.gold, fontWeight: 700 }}>Set Mentor</div>
            <div style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: 600, color: theme.text, marginTop: 2 }}>{peserta.nama}</div>
            <div style={{ fontSize: 10, color: theme.textMuted, fontFamily: fonts.mono, marginTop: 2 }}>{peserta.satker} · NIP {peserta.nip}</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, color: theme.textMuted }}><X size={16}/></button>
        </div>
        <div style={{ padding: 22 }}>
          <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 12, lineHeight: 1.55 }}>
            Mentor adalah atasan peserta yang qualify untuk membimbing. Pilih dari daftar mentor terdaftar.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto' }}>
            {mentorUsers.map(m => (
              <label key={m.id}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: selected === m.id ? theme.goldLight + '30' : theme.bg, border: `1px solid ${selected === m.id ? theme.gold : theme.border}`, borderRadius: 2, cursor: 'pointer' }}>
                <input type="radio" checked={selected === m.id} onChange={() => setSelected(m.id)} style={{ accentColor: theme.gold }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: theme.text }}>{m.user}</div>
                  <div style={{ fontSize: 10, color: theme.textMuted }}>{m.jabatan} · {m.satker}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div style={{ padding: '12px 22px', borderTop: `1px solid ${theme.border}`, background: theme.bg, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={() => onSave(peserta, selected)} disabled={!selected}>Simpan Mentor</Button>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// ADD PESERTA MODAL — tambah satu peserta dengan validasi duplikat NIP
// =====================================================================
function AddPesertaModal({ onClose }) {
  const { participants, setParticipants, batches, activeBatchId, currentUser, toast, addAudit, pushNotif } = useApp();
  const [form, setForm] = useState({
    nip: '', nama: '', satker: '', pangkat: '', jobFamily: 'Ekonom',
    statusPegawai: 'KPP', tipeSatker: 'KP', statusNK: 'Upper', smdTahun: 5,
    batchId: activeBatchId,
  });
  const [error, setError] = useState(null);

  const userShortName = currentUser.user.split(',')[0];

  const validate = () => {
    if (!form.nip || !form.nama || !form.satker || !form.pangkat) return 'Mohon lengkapi semua field wajib (*)';
    if (!/^\d{18}$/.test(form.nip)) return 'NIP harus 18 digit angka';
    // VALIDASI DUPLIKAT — cek apakah NIP sudah pernah terdaftar di program manapun
    const dup = participants.find(p => p.nip === form.nip);
    if (dup) return `NIP ini sudah terdaftar atas nama "${dup.nama}" pada batch ${batches.find(b => b.id === dup.batchId)?.nama || dup.batchId}`;
    return null;
  };

  const submit = () => {
    const err = validate();
    if (err) { setError(err); toast(err, 'warning'); return; }
    const newP = {
      id: 'P' + Date.now(),
      nip: form.nip, nama: form.nama, satker: form.satker,
      tipeSatker: form.tipeSatker, jobFamily: form.jobFamily, pangkat: form.pangkat,
      statusPegawai: form.statusPegawai, statusNK: form.statusNK, smdTahun: parseInt(form.smdTahun, 10) || 0,
      mentorUserId: null, batchId: form.batchId, konfirmasiHadir: 'pending',
      stage: 1, status: 'active',
      stageData: {
        registrasi:  { status: 'in_progress', registeredAt: new Date().toISOString().slice(0,10), checkInAt: null },
        sosialisasi: { status: 'pending' }, coaching: { status: 'pending' },
        monitoring1: { status: 'pending' }, monitoring2: { status: 'pending' },
        monitoring3: { status: 'pending' }, evaluasi: { status: 'pending' },
      },
    };
    setParticipants(prev => [...prev, newP]);
    addAudit(userShortName, `Tambah peserta baru: ${form.nama}`, null);
    pushNotif('peserta', { type: 'success', title: 'Anda terdaftar sebagai peserta DIKSI', desc: `${batches.find(b => b.id === form.batchId)?.nama} · mohon konfirmasi kesediaan` });
    toast(`${form.nama} berhasil ditambahkan ke ${batches.find(b => b.id === form.batchId)?.nama}.`, 'success');
    onClose();
  };

  const inputStyle = { width: '100%', fontSize: 11.5, fontFamily: fonts.body, padding: 9, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,37,64,0.72)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: fonts.body }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 4, width: '100%', maxWidth: 580, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.gold, fontWeight: 700 }}>Form Peserta Baru</div>
            <div style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: 600, color: theme.text, marginTop: 2 }}>Tambah Peserta DIKSI</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, color: theme.textMuted }}><X size={16}/></button>
        </div>

        <div style={{ padding: 22, overflowY: 'auto', flex: 1 }}>
          {error && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', padding: 10, borderRadius: 2, marginBottom: 14, fontSize: 11, color: theme.danger, display: 'flex', gap: 8 }}>
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
              <div>{error}</div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: 10.5, fontWeight: 600, color: theme.text, marginBottom: 4 }}>NIP <span style={{ color: theme.danger }}>*</span></label>
              <input value={form.nip} onChange={e => { setForm({ ...form, nip: e.target.value.replace(/\D/g, '').slice(0, 18) }); setError(null); }}
                placeholder="18 digit angka" style={{ ...inputStyle, fontFamily: fonts.mono }}/>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: 10.5, fontWeight: 600, color: theme.text, marginBottom: 4 }}>Nama Lengkap <span style={{ color: theme.danger }}>*</span></label>
              <input value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} style={inputStyle}/>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10.5, fontWeight: 600, color: theme.text, marginBottom: 4 }}>Satker <span style={{ color: theme.danger }}>*</span></label>
              <input value={form.satker} onChange={e => setForm({ ...form, satker: e.target.value })} placeholder="DKEM, DKMP, KPwBI Lampung..." style={inputStyle}/>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10.5, fontWeight: 600, color: theme.text, marginBottom: 4 }}>Pangkat <span style={{ color: theme.danger }}>*</span></label>
              <input value={form.pangkat} onChange={e => setForm({ ...form, pangkat: e.target.value })} placeholder="Manajer, Asisten Manajer..." style={inputStyle}/>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10.5, fontWeight: 600, color: theme.text, marginBottom: 4 }}>Job Family</label>
              <select value={form.jobFamily} onChange={e => setForm({ ...form, jobFamily: e.target.value })} style={inputStyle}>
                {CRITERIA_OPTIONS.jobFamily.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10.5, fontWeight: 600, color: theme.text, marginBottom: 4 }}>Status Pegawai</label>
              <select value={form.statusPegawai} onChange={e => setForm({ ...form, statusPegawai: e.target.value })} style={inputStyle}>
                {CRITERIA_OPTIONS.statusPegawai.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10.5, fontWeight: 600, color: theme.text, marginBottom: 4 }}>Tipe Satker</label>
              <select value={form.tipeSatker} onChange={e => setForm({ ...form, tipeSatker: e.target.value })} style={inputStyle}>
                <option value="KP">KP (Kantor Pusat)</option>
                <option value="KPW">KPW (Kantor Perwakilan)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10.5, fontWeight: 600, color: theme.text, marginBottom: 4 }}>Status NK</label>
              <select value={form.statusNK} onChange={e => setForm({ ...form, statusNK: e.target.value })} style={inputStyle}>
                <option value="Upper">Upper</option>
                <option value="Lower">Lower</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10.5, fontWeight: 600, color: theme.text, marginBottom: 4 }}>SMD (tahun)</label>
              <input type="number" value={form.smdTahun} onChange={e => setForm({ ...form, smdTahun: e.target.value })}
                style={{ ...inputStyle, fontFamily: fonts.mono }}/>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: 10.5, fontWeight: 600, color: theme.text, marginBottom: 4 }}>Batch <span style={{ color: theme.danger }}>*</span></label>
              <select value={form.batchId} onChange={e => setForm({ ...form, batchId: e.target.value })} style={inputStyle}>
                {batches.map(b => <option key={b.id} value={b.id}>{b.nama}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginTop: 16, padding: 10, background: theme.infoBg, border: '1px solid #BFDBFE', borderRadius: 2, fontSize: 10.5, color: theme.info, display: 'flex', gap: 8 }}>
            <Info size={13} style={{ flexShrink: 0, marginTop: 1 }}/>
            <div>Sistem akan otomatis cek apakah NIP sudah pernah terdaftar di batch manapun. SMD harus minimum 2 tahun untuk memenuhi kriteria DIKSI.</div>
          </div>
        </div>

        <div style={{ padding: '12px 22px', borderTop: `1px solid ${theme.border}`, background: theme.bg, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button variant="primary" icon={UserPlus} onClick={submit}>Tambah Peserta</Button>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// IMPORT MODAL — bulk import dengan validasi duplikat & coverage satker
// =====================================================================
function ImportModal({ onClose }) {
  const { participants, setParticipants, batches, activeBatchId, currentUser, toast, addAudit } = useApp();
  const [step, setStep] = useState(1); // 1 pick file, 2 preview validasi, 3 success

  const userShortName = currentUser.user.split(',')[0];

  // Mock data preview — beberapa valid, satu duplikat (NIP sudah ada di seed)
  const previewRows = [
    { nip: '199506182022032006', nama: 'Lestari Permatasari Wijaya', satker: 'DSTA', pangkat: 'Asisten Manajer', jobFamily: 'Statistik' },
    { nip: '199211052019031007', nama: 'Ahmad Sulaiman Gunawan',     satker: 'DHK',  pangkat: 'Manajer',          jobFamily: 'Hukum' },
    { nip: '199812302023032008', nama: 'Karina Wulandari Putri',     satker: 'KPwBI Yogyakarta', pangkat: 'Analis', jobFamily: 'Komunikasi' },
    { nip: '199203142018031001', nama: 'Arif Budiman Pratama (duplikat)', satker: 'DKEM', pangkat: 'Manajer', jobFamily: 'Ekonom' }, // duplikat existing P001
    { nip: '199407182020032010', nama: 'Putri Maharani Sukma',       satker: 'DKEM', pangkat: 'Asisten Manajer', jobFamily: 'Ekonom' },
  ];

  // VALIDASI DUPLIKAT NIP — cek per row apakah NIP sudah ada
  const existingNips = new Set(participants.map(p => p.nip));
  const validatedRows = previewRows.map(r => ({
    ...r,
    isDuplicate: existingNips.has(r.nip),
    valid: !existingNips.has(r.nip),
  }));

  // VALIDASI SATKER COVERAGE — per satker minimal 1 perwakilan
  // Gabung satker yang sudah ada di batch + yang akan diimport
  const existingSatkerInBatch = new Set(participants.filter(p => p.batchId === activeBatchId).map(p => p.satker));
  const newSatkerInImport = new Set(validatedRows.filter(r => r.valid).map(r => r.satker));
  const allSatkerCovered = new Set([...existingSatkerInBatch, ...newSatkerInImport]);

  // Daftar satker yang BI ekspektasikan harus terwakili (mock list)
  const expectedSatker = ['DKEM', 'DKMP', 'DSPR', 'DKOM', 'DSTA', 'DHK', 'KPwBI Lampung', 'KPwBI Yogyakarta'];
  const missingSatker = expectedSatker.filter(s => !allSatkerCovered.has(s));

  const validCount = validatedRows.filter(r => r.valid).length;
  const dupCount = validatedRows.filter(r => r.isDuplicate).length;

  const handleConfirm = () => {
    const toAdd = validatedRows.filter(r => r.valid).map((r, i) => ({
      id: 'P' + (Date.now() + i),
      nip: r.nip, nama: r.nama, satker: r.satker, pangkat: r.pangkat,
      jobFamily: r.jobFamily, tipeSatker: r.satker.startsWith('KPw') ? 'KPW' : 'KP',
      statusPegawai: 'KPP', statusNK: 'Upper', smdTahun: 6,
      mentorUserId: null, batchId: activeBatchId, konfirmasiHadir: 'pending',
      stage: 1, status: 'active',
      stageData: {
        registrasi:  { status: 'in_progress', registeredAt: new Date().toISOString().slice(0,10), checkInAt: null },
        sosialisasi: { status: 'pending' }, coaching: { status: 'pending' },
        monitoring1: { status: 'pending' }, monitoring2: { status: 'pending' },
        monitoring3: { status: 'pending' }, evaluasi: { status: 'pending' },
      },
    }));
    setParticipants(prev => [...prev, ...toAdd]);
    addAudit(userShortName, `Import ${toAdd.length} peserta baru via Excel`, null);
    toast(`${toAdd.length} peserta berhasil diimport. ${dupCount} dilewati (duplikat).`, 'success');
    setStep(3);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,37,64,0.72)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: fonts.body }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 4, width: '100%', maxWidth: 720, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.gold, fontWeight: 700 }}>Bulk Import</div>
            <div style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: 600, color: theme.text, marginTop: 2 }}>Import Peserta dari Excel</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, color: theme.textMuted }}><X size={16}/></button>
        </div>

        {/* Step indicator */}
        <div style={{ padding: '10px 22px', background: theme.bg, borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5, fontFamily: fonts.mono }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 18, height: 18, borderRadius: 9, background: step >= s ? theme.gold : theme.border, color: step >= s ? theme.navy : theme.textSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>{s}</div>
              <span style={{ color: step === s ? theme.text : theme.textMuted, fontWeight: step === s ? 600 : 400 }}>
                {s === 1 ? 'Pilih File' : s === 2 ? 'Validasi Data' : 'Selesai'}
              </span>
              {s < 3 && <ChevronRight size={11} style={{ color: theme.textSubtle, marginLeft: 6 }}/>}
            </div>
          ))}
        </div>

        <div style={{ padding: 22, overflowY: 'auto', flex: 1 }}>
          {/* STEP 1: pick file */}
          {step === 1 && (
            <div>
              <div style={{ background: theme.bg, border: `2px dashed ${theme.borderStrong}`, borderRadius: 3, padding: 40, textAlign: 'center', marginBottom: 14 }}>
                <FileSpreadsheet size={36} style={{ color: theme.textMuted, margin: '0 auto 10px' }}/>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 4 }}>Drop file Excel di sini</div>
                <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 14 }}>Format yang didukung: .xlsx, .xls, .csv (max 5MB)</div>
                <Button variant="secondary" icon={Upload} onClick={() => setStep(2)}>Pilih File</Button>
              </div>
              <div style={{ background: theme.infoBg, border: '1px solid #BFDBFE', padding: 12, borderRadius: 2, fontSize: 11, color: theme.info, display: 'flex', gap: 8 }}>
                <Info size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 3 }}>Sistem akan validasi otomatis:</div>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    <li>Cek duplikat NIP terhadap database peserta program</li>
                    <li>Cek apakah setiap satker sudah memiliki minimal 1 perwakilan</li>
                  </ul>
                  <div style={{ marginTop: 6 }}>Template Excel bisa diunduh <a href="#" style={{ color: theme.info, fontWeight: 600 }}>di sini</a>.</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: preview validasi */}
          {step === 2 && (
            <div>
              {/* Summary banner */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
                <div style={{ background: theme.successBg, border: '1px solid #A7F3D0', padding: 12, borderRadius: 2, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: theme.success, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Valid</div>
                  <div style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 300, color: theme.success, marginTop: 4 }}>{validCount}</div>
                </div>
                <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', padding: 12, borderRadius: 2, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: theme.danger, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Duplikat NIP</div>
                  <div style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 300, color: theme.danger, marginTop: 4 }}>{dupCount}</div>
                </div>
                <div style={{ background: theme.bg, border: `1px solid ${theme.border}`, padding: 12, borderRadius: 2, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Total Baris</div>
                  <div style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 300, color: theme.text, marginTop: 4 }}>{validatedRows.length}</div>
                </div>
              </div>

              {/* Coverage satker warning */}
              {missingSatker.length > 0 && (
                <div style={{ background: theme.warningBg, border: '1px solid #FCD34D', padding: 12, borderRadius: 2, marginBottom: 14, fontSize: 11, color: theme.warning, display: 'flex', gap: 8 }}>
                  <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 3 }}>Coverage satker belum lengkap</div>
                    <div style={{ color: theme.text }}>Satker berikut belum memiliki perwakilan di batch ini: <strong>{missingSatker.join(', ')}</strong>. Pertimbangkan untuk menambah peserta dari satker tsb.</div>
                  </div>
                </div>
              )}
              {missingSatker.length === 0 && (
                <div style={{ background: theme.successBg, border: '1px solid #A7F3D0', padding: 12, borderRadius: 2, marginBottom: 14, fontSize: 11, color: theme.success, display: 'flex', gap: 8 }}>
                  <CheckCircle2 size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
                  <div><strong>Coverage satker lengkap</strong> — semua satker target sudah memiliki perwakilan.</div>
                </div>
              )}

              <div style={{ border: `1px solid ${theme.border}`, borderRadius: 2, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: theme.bg, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.textMuted }}>
                      <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>NIP</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>Nama</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>Satker</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>Catatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validatedRows.map((r, i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${theme.border}`, background: r.isDuplicate ? '#FFFAFA' : '#fff', fontSize: 11 }}>
                        <td style={{ padding: '8px 12px' }}>
                          {r.valid ? <Pill variant="success">Valid</Pill> : <Pill variant="danger">Duplikat</Pill>}
                        </td>
                        <td style={{ padding: '8px 12px', fontFamily: fonts.mono, fontSize: 10.5, color: theme.textMuted }}>{r.nip}</td>
                        <td style={{ padding: '8px 12px', color: theme.text, fontWeight: 500 }}>{r.nama}</td>
                        <td style={{ padding: '8px 12px', color: theme.text }}>{r.satker}</td>
                        <td style={{ padding: '8px 12px', color: r.isDuplicate ? theme.danger : theme.textMuted, fontSize: 10.5 }}>
                          {r.isDuplicate ? 'NIP sudah terdaftar di program' : 'Akan ditambahkan ke batch'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 3: success */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <div style={{ width: 60, height: 60, background: theme.successBg, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}>
                <CheckCircle2 size={28} style={{ color: theme.success }}/>
              </div>
              <div style={{ fontFamily: fonts.display, fontSize: 18, fontWeight: 600, color: theme.text, marginBottom: 6 }}>Import Berhasil</div>
              <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.55, marginBottom: 4 }}><strong>{validCount}</strong> peserta baru berhasil ditambahkan ke batch.</div>
              {dupCount > 0 && <div style={{ fontSize: 11, color: theme.danger }}>{dupCount} baris dilewati karena NIP duplikat.</div>}
            </div>
          )}
        </div>

        <div style={{ padding: '12px 22px', borderTop: `1px solid ${theme.border}`, background: theme.bg, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {step === 1 && <><Button variant="ghost" onClick={onClose}>Batal</Button><div/></>}
          {step === 2 && (
            <>
              <Button variant="ghost" onClick={() => setStep(1)}>← Kembali</Button>
              <Button variant="primary" icon={CheckCircle2} onClick={handleConfirm} disabled={validCount === 0}>Import {validCount} Peserta</Button>
            </>
          )}
          {step === 3 && <><div/><Button variant="primary" onClick={onClose}>Selesai</Button></>}
        </div>
      </div>
    </div>
  );
}

function AdminTahapan() {
  const { participants, batches, activeBatchId, setActiveBatchId, setSelectedParticipantId, setActiveMenu } = useApp();
  const [batchFilter, setBatchFilter] = useState(activeBatchId);

  // Filter peserta by batch
  const filtered = participants.filter(p => batchFilter === 'all' ? true : p.batchId === batchFilter);
  const selectedBatch = batches.find(b => b.id === batchFilter);

  return (
    <div>
      <SectionHeader
        eyebrow="Admin DSDM · Monitoring Tahapan"
        title="Heatmap Progress per Tahapan"
        desc="Visualisasi status seluruh peserta pada 7 tahapan alur program · klik sel untuk detail"
        right={<Button icon={Download} variant="secondary" size="sm">Export Heatmap</Button>}
      />

      {/* Filter bar — pilih batch */}
      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, padding: '10px 14px', marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.textMuted, fontWeight: 600 }}>Filter Batch</div>
        <select value={batchFilter} onChange={e => setBatchFilter(e.target.value)}
          style={{ fontSize: 12, fontFamily: fonts.body, padding: '6px 12px', border: `1px solid ${theme.border}`, borderRadius: 2, background: '#fff', color: theme.text, cursor: 'pointer', outline: 'none', minWidth: 240 }}>
          <option value="all">Semua batch ({participants.length} peserta)</option>
          {batches.map(b => {
            const cnt = participants.filter(p => p.batchId === b.id).length;
            return <option key={b.id} value={b.id}>{b.nama} ({cnt} peserta) · {b.status}</option>;
          })}
        </select>
        {selectedBatch && batchFilter !== 'all' && (
          <div style={{ marginLeft: 'auto', fontSize: 10.5, color: theme.textMuted, display: 'flex', gap: 14 }}>
            <span><strong style={{ color: theme.text }}>{filtered.length}</strong> peserta</span>
            <span>·</span>
            <span style={{ fontFamily: fonts.mono }}>{selectedBatch.kode}</span>
            <span>·</span>
            <Pill variant={selectedBatch.status === 'active' ? 'success' : 'default'}>{selectedBatch.status === 'active' ? 'Aktif' : selectedBatch.status === 'completed' ? 'Selesai' : selectedBatch.status}</Pill>
          </div>
        )}
      </div>

      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000, fontFamily: fonts.body }}>
          <thead>
            <tr style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.textMuted, fontWeight: 600, position: 'sticky', left: 0, background: theme.bg, minWidth: 200 }}>Peserta</th>
              {STAGES.map(t => (
                <th key={t.id} style={{
                  padding: '10px 8px', textAlign: 'center',
                  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.textMuted, fontWeight: 600,
                  minWidth: t.key === 'sosialisasi' ? 120 : 80,
                  opacity: t.built ? 1 : 0.5,
                }}>
                  <div>T.0{t.id}</div>
                  <div style={{ fontSize: 9, marginTop: 2, color: theme.textSubtle, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{t.nama}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={STAGES.length + 1} style={{ textAlign: 'center', padding: 32, fontSize: 11, color: theme.textMuted, fontStyle: 'italic' }}>
                Tidak ada peserta di batch ini.
              </td></tr>
            )}
            {filtered.map(p => (
              <tr key={p.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                <td style={{ padding: '10px 14px', position: 'sticky', left: 0, background: '#fff' }}>
                  <button onClick={() => { setSelectedParticipantId(p.id); setActiveMenu('peserta'); }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', fontFamily: fonts.body }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: theme.text }}>{p.nama.split(' ').slice(0, 2).join(' ')}</div>
                    <div style={{ fontSize: 10, color: theme.textMuted }}>{p.satker} · {p.pangkat}</div>
                  </button>
                </td>
                {STAGES.map(t => {
                  const status = stageStatus(p, t.key);
                  const sd = p.stageData[t.key];
                  const isPlaceholder = !t.built;

                  // KOLOM SOSIALISASI: tampilkan skor pretest + posttest sesuai dokumen revisi
                  if (t.key === 'sosialisasi') {
                    const pre = sd?.pretestScore;
                    const post = sd?.posttestScore;
                    return (
                      <td key={t.id} style={{ padding: '8px 6px', textAlign: 'center' }}>
                        {(pre == null && post == null) ? (
                          <div style={{ width: 30, height: 30, margin: '0 auto', border: `2px dashed ${theme.borderStrong}`, borderRadius: 2 }}/>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                            <div title="Pretest" style={{
                              minWidth: 32, padding: '4px 6px',
                              background: pre != null ? (pre >= 80 ? theme.successBg : pre >= 60 ? theme.warningBg : theme.dangerBg) : '#F1F3F6',
                              border: `1px solid ${pre != null ? (pre >= 80 ? theme.success : pre >= 60 ? theme.warning : theme.danger) : theme.border}`,
                              borderRadius: 2, textAlign: 'center',
                            }}>
                              <div style={{ fontSize: 7.5, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Pre</div>
                              <div style={{ fontSize: 11, fontFamily: fonts.mono, fontWeight: 700, color: pre != null ? (pre >= 80 ? theme.success : pre >= 60 ? theme.warning : theme.danger) : theme.textSubtle, lineHeight: 1.1 }}>
                                {pre != null ? pre : '–'}
                              </div>
                            </div>
                            <div title="Posttest" style={{
                              minWidth: 32, padding: '4px 6px',
                              background: post != null ? (post >= 80 ? theme.successBg : post >= 60 ? theme.warningBg : theme.dangerBg) : '#F1F3F6',
                              border: `1px solid ${post != null ? (post >= 80 ? theme.success : post >= 60 ? theme.warning : theme.danger) : theme.border}`,
                              borderRadius: 2, textAlign: 'center',
                            }}>
                              <div style={{ fontSize: 7.5, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Post</div>
                              <div style={{ fontSize: 11, fontFamily: fonts.mono, fontWeight: 700, color: post != null ? (post >= 80 ? theme.success : post >= 60 ? theme.warning : theme.danger) : theme.textSubtle, lineHeight: 1.1 }}>
                                {post != null ? post : '–'}
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  }

                  // Kolom lain: standard heatmap cell
                  return (
                    <td key={t.id} style={{ textAlign: 'center', padding: '10px 8px', opacity: isPlaceholder ? 0.5 : 1 }}>
                      {status === 'completed' && (
                        <div style={{ width: 30, height: 30, margin: '0 auto', background: theme.success, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle2 size={13} style={{ color: '#fff' }}/>
                        </div>
                      )}
                      {status === 'in_progress' && (
                        <div style={{ width: 30, height: 30, margin: '0 auto', background: theme.gold, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Clock size={13} style={{ color: theme.navy }}/>
                        </div>
                      )}
                      {status === 'in_review' && (
                        <div style={{ width: 30, height: 30, margin: '0 auto', background: theme.info, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Eye size={13} style={{ color: '#fff' }}/>
                        </div>
                      )}
                      {status === 'pending' && (
                        <div style={{ width: 30, height: 30, margin: '0 auto', border: `2px ${isPlaceholder ? 'dashed' : 'dashed'} ${theme.borderStrong}`, borderRadius: 2 }}/>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '10px 14px', borderTop: `1px solid ${theme.border}`, display: 'flex', gap: 14, fontSize: 10, color: theme.textMuted, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, background: theme.success, borderRadius: 2 }}/> Selesai</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, background: theme.gold, borderRadius: 2 }}/> Sedang berjalan</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, background: theme.info, borderRadius: 2 }}/> Menunggu review</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, border: `2px dashed ${theme.borderStrong}`, borderRadius: 2 }}/> Belum dimulai</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Skor:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 10, height: 10, background: theme.success, borderRadius: 2 }}/> ≥80</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 10, height: 10, background: theme.warning, borderRadius: 2 }}/> 60-79</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 10, height: 10, background: theme.danger, borderRadius: 2 }}/> &lt;60</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminApproval() {
  const { participants, toast, addAudit, pushNotif, updateParticipant, currentUser } = useApp();
  const pending = participants.filter(p => p.stageData.registrasi?.status === 'in_progress');
  const userShortName = currentUser.user.split(',')[0];

  const approve = (p) => {
    updateParticipant(p.id, old => ({
      ...old, stage: 2,
      stageData: {
        ...old.stageData,
        registrasi: { status: 'completed', approvedAt: new Date().toISOString().slice(0,10), approvedBy: userShortName },
        sosialisasi: { status: 'in_progress' },
      }
    }));
    addAudit(userShortName, 'Approve registrasi peserta', p.nama);
    pushNotif('peserta', { type: 'success', title: 'Registrasi Anda telah disetujui', desc: 'Lanjut ke Tahap 02 · Sosialisasi (pretest)' });
    toast(`Registrasi ${p.nama} disetujui. Peserta dipindah ke Sosialisasi.`, 'success');
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Admin DSDM · Approval Workflow"
        title="Antrian Approval Registrasi"
        desc={`${pending.length} peserta menunggu approval untuk melanjutkan ke Sosialisasi`}
      />

      {pending.length === 0 ? (
        <div style={{ background: '#fff', border: `1px dashed ${theme.borderStrong}`, padding: 32, textAlign: 'center', borderRadius: 2 }}>
          <CheckCircle2 size={32} style={{ color: theme.success, margin: '0 auto 10px' }}/>
          <div style={{ fontSize: 13, fontWeight: 500, color: theme.text }}>Tidak ada antrian approval</div>
          <p style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>Semua registrasi sudah diproses. Coba import peserta baru untuk memulai flow.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2 }}>
          {pending.map(p => (
            <div key={p.id} style={{ padding: 18, borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, background: theme.navy, color: theme.gold, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, fontFamily: fonts.body }}>
                {p.nama.split(' ').slice(0, 2).map(n => n[0]).join('')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{p.nama}</div>
                <div style={{ fontSize: 11, color: theme.textMuted }}>{p.satker} · {p.pangkat} · NIP {p.nip}</div>
              </div>
              <Pill variant="warning">Tahap 01 Registrasi</Pill>
              <Button variant="success" icon={Check} onClick={() => approve(p)}>Setujui</Button>
              <Button variant="danger">Tolak</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================================================
// PARTICIPANT MANAGEMENT HUB (Fasilitator & Coach)
// Unified UX: list peserta → klik → workspace per peserta dengan tabs
// =====================================================================

// Helper: cari action yang pending untuk mentor terhadap peserta tertentu
function getPendingActions(p, role) {
  const actions = [];
  if (role === 'mentor') {
    if (p.stageData.coaching?.status === 'in_progress') actions.push({ key: 'coaching', label: 'Input Evaluasi Coaching 1-on-1', stage: 3, urgent: true });
  }
  return actions;
}

function MyPesertaHub() {
  const { role, currentUser, workspaceParticipantId, setWorkspaceParticipantId, participants } = useApp();

  // Filter mentee untuk role mentor
  const myMentees = role === 'mentor'
    ? participants.filter(p => p.mentorUserId === currentUser.id)
    : participants;

  // Auto-select first mentee saat masuk halaman (kalau belum ada selection)
  useEffect(() => {
    if (!workspaceParticipantId && myMentees.length > 0) {
      setWorkspaceParticipantId(myMentees[0].id);
    } else if (workspaceParticipantId && !myMentees.find(p => p.id === workspaceParticipantId)) {
      // Selected participant tidak di mentee list (ganti role) — reset ke first
      setWorkspaceParticipantId(myMentees.length > 0 ? myMentees[0].id : null);
    }
  }, [workspaceParticipantId, myMentees.length]);

  const workspaceParticipant = participants.find(p => p.id === workspaceParticipantId);

  // Empty state — mentor tidak punya mentee
  if (myMentees.length === 0) {
    return (
      <div>
        <SectionHeader eyebrow="Mentor · Workspace Mentee" title="Mentee Saya" desc="Daftar peserta yang Anda dampingi"/>
        <div style={{ background: '#fff', border: `1px dashed ${theme.borderStrong}`, padding: 32, textAlign: 'center', borderRadius: 2 }}>
          <Users size={28} style={{ color: theme.textMuted, margin: '0 auto 10px' }}/>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Belum ada mentee</div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 6 }}>Anda belum memiliki peserta yang ditugaskan untuk dimentoring.</div>
        </div>
      </div>
    );
  }

  if (!workspaceParticipant) return null;

  return <ParticipantWorkspace participant={workspaceParticipant} mentees={myMentees}/>;
}


// =====================================================================
// PARTICIPANT WORKSPACE — detail view per peserta dengan tabs
// =====================================================================
function ParticipantWorkspace({ participant: p, mentees = [] }) {
  const { role, workspaceTab, setWorkspaceTab, setWorkspaceParticipantId } = useApp();
  const pendingActions = getPendingActions(p, role);
  const progress = calcProgress(p);

  // Tabs per role — sesuai dokumen revisi DSDM (mentor follow seluruh tahap)
  const tabsByRole = {
    mentor: [
      { id: 'overview',   label: 'Overview',          icon: LayoutDashboard },
      { id: 'coaching',   label: '1-on-1 Coaching',   icon: Sparkles },
      { id: 'mon1',       label: 'Monitoring 1',      icon: Activity },
      { id: 'mon2',       label: 'Monitoring 2',      icon: Activity },
      { id: 'mon3',       label: 'Monitoring 3',      icon: Activity },
      { id: 'evaluasi',   label: 'Evaluasi',          icon: ClipboardCheck },
    ],
  };
  const tabs = tabsByRole[role] || tabsByRole.mentor;

  const renderTab = () => {
    switch (workspaceTab) {
      case 'coaching':   return <WorkspaceCoaching participant={p}/>;
      case 'mon1':       return <WorkspaceMon1View participant={p}/>;
      case 'mon2':       return <WorkspaceMon2View participant={p}/>;
      case 'mon3':       return <WorkspaceMon3View participant={p}/>;
      case 'evaluasi':   return <WorkspaceEvalView participant={p}/>;
      default:           return <WorkspaceOverview participant={p} onNavigate={(tab) => setWorkspaceTab(tab)}/>;
    }
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Mentor · Workspace Mentee"
        title="Mentee Saya"
        desc={`${mentees.length} peserta yang Anda dampingi · pilih dari dropdown untuk switch antar mentee`}
      />

      {/* Mentee dropdown selector */}
      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 3, padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.textMuted, fontWeight: 700, flexShrink: 0 }}>Mentee Aktif</div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: theme.navy, color: theme.gold, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, fontFamily: fonts.display, flexShrink: 0 }}>
            {p.nama.split(' ').slice(0, 2).map(n => n[0]).join('')}
          </div>
          <select value={p.id} onChange={e => setWorkspaceParticipantId(e.target.value)}
            style={{
              flex: 1, fontSize: 13, fontFamily: fonts.body, fontWeight: 600, color: theme.text,
              padding: '8px 12px', border: `1px solid ${theme.border}`, borderRadius: 2,
              background: '#fff', cursor: 'pointer', outline: 'none',
            }}>
            {mentees.map(m => (
              <option key={m.id} value={m.id}>
                {m.nama} · {m.satker} · Tahap {m.stage}/7 · {STAGES[m.stage - 1]?.nama}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 6, fontSize: 10.5, color: theme.textMuted, flexShrink: 0 }}>
          <span style={{ fontFamily: fonts.mono }}>{p.nip}</span>
          <span>·</span>
          <span>{p.pangkat}</span>
        </div>
      </div>

      {/* Participant header card */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.navy} 0%, ${theme.navyDark} 100%)`,
        borderRadius: 3, padding: 24, marginBottom: 0, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 90% 20%, rgba(184,147,90,0.15) 0%, transparent 50%)` }}/>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 60, height: 60, background: theme.gold, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontSize: 20, fontWeight: 700, color: theme.navy, flexShrink: 0 }}>
            {p.nama.split(' ').slice(0, 2).map(n => n[0]).join('')}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.goldLight, fontWeight: 600, marginBottom: 4 }}>
              {p.satker} · {p.jobFamily}
            </div>
            <div style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 500, color: '#fff', letterSpacing: '-0.01em' }}>{p.nama}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4, display: 'flex', gap: 12, fontFamily: fonts.body }}>
              <span style={{ fontFamily: fonts.mono }}>NIP {p.nip}</span>
              <span>·</span>
              <span>{p.pangkat}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.goldLight, fontWeight: 600, marginBottom: 4 }}>Progress</div>
            <div style={{ fontFamily: fonts.display, fontSize: 30, fontWeight: 300, color: theme.gold, lineHeight: 1 }}>{progress}%</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>Tahap {p.stage} · {STAGES[p.stage - 1]?.nama}</div>
          </div>
        </div>
        {pendingActions.length > 0 && (
          <div style={{ position: 'relative', marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(184,147,90,0.3)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={14} style={{ color: theme.gold, flexShrink: 0 }}/>
            <div style={{ fontSize: 11, color: '#fff', flex: 1 }}>
              <strong style={{ color: theme.gold }}>{pendingActions.length} aksi pending:</strong> {pendingActions.map(a => a.label).join(' · ')}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderTop: 'none', borderRadius: '0 0 3px 3px' }}>
        <div style={{ display: 'flex', borderBottom: `1px solid ${theme.border}`, background: theme.bg, overflowX: 'auto' }}>
          {tabs.map(t => {
            const Ic = t.icon;
            const active = t.id === workspaceTab;
            const hasPending = pendingActions.some(a => a.key === t.id);
            return (
              <button key={t.id} onClick={() => setWorkspaceTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '14px 16px', border: 'none', background: 'transparent',
                  borderBottom: `2px solid ${active ? theme.gold : 'transparent'}`,
                  color: active ? theme.text : theme.textMuted,
                  fontSize: 11.5, fontWeight: active ? 600 : 500, fontFamily: fonts.body,
                  cursor: 'pointer', whiteSpace: 'nowrap', position: 'relative',
                }}>
                <Ic size={13}/>
                {t.label}
                {hasPending && <div style={{ width: 6, height: 6, borderRadius: 3, background: theme.gold }}/>}
              </button>
            );
          })}
        </div>
        <div style={{ padding: 22 }}>
          {renderTab()}
        </div>
      </div>
    </div>
  );
}

// ----- TAB: OVERVIEW -----
function WorkspaceOverview({ participant: p, onNavigate }) {
  const { role } = useApp();
  const pendingActions = getPendingActions(p, role);
  const mentor = USERS[p.mentorUserId];

  return (
    <div>
      {/* Quick actions */}
      {pendingActions.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: theme.textMuted, marginBottom: 10 }}>Quick Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {pendingActions.map((a, idx) => (
              <button key={idx} onClick={() => onNavigate(a.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: 12, background: theme.goldLight + '20',
                  border: `1px solid ${theme.gold}`, borderRadius: 2,
                  cursor: 'pointer', fontFamily: fonts.body, textAlign: 'left',
                }}
                onMouseEnter={e => e.currentTarget.style.background = theme.goldLight + '40'}
                onMouseLeave={e => e.currentTarget.style.background = theme.goldLight + '20'}>
                <div style={{ width: 30, height: 30, background: theme.gold, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ArrowRight size={13} style={{ color: theme.navy }}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: theme.text }}>{a.label}</div>
                  <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 1 }}>Tahap {a.stage}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Journey timeline — 7 stages */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: theme.textMuted, marginBottom: 10 }}>Journey · 7 Tahap</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {STAGES.map(s => {
            const status = stageStatus(p, s.key);
            const color = status === 'completed' ? theme.success : status === 'in_progress' ? theme.gold : '#F1F3F6';
            const Ic = s.icon;
            const isPlaceholder = !s.built;
            return (
              <div key={s.id} title={`${s.nama} · ${status}${isPlaceholder ? ' (placeholder)' : ''}`}
                style={{
                  position: 'relative', padding: '10px 6px', borderRadius: 2,
                  background: color === '#F1F3F6' ? color : color + '15',
                  border: `1px ${isPlaceholder ? 'dashed' : 'solid'} ${color === '#F1F3F6' ? theme.border : color}`,
                  textAlign: 'center', opacity: isPlaceholder ? 0.55 : 1,
                }}>
                <div style={{ fontFamily: fonts.mono, fontSize: 9, color: theme.textSubtle, marginBottom: 4 }}>0{s.id}</div>
                <Ic size={14} style={{ color: color === '#F1F3F6' ? theme.textSubtle : color }}/>
                <div style={{ fontSize: 9.5, marginTop: 5, color: theme.text, fontWeight: status === 'in_progress' ? 600 : 400, lineHeight: 1.2 }}>{s.nama.split(' ')[0]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 2, padding: 16 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: theme.textMuted, marginBottom: 10 }}>Profil & Kriteria</div>
          {[
            ['Status Pegawai', p.statusPegawai],
            ['Tipe Satker',    p.tipeSatker],
            ['Job Family',     p.jobFamily],
            ['Status NK',      p.statusNK],
            ['Sisa Masa Dinas', `${p.smdTahun} tahun`],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '5px 0', borderBottom: `1px solid ${theme.border}` }}>
              <span style={{ color: theme.textMuted }}>{k}</span>
              <span style={{ color: theme.text, fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 2, padding: 16 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: theme.textMuted, marginBottom: 10 }}>Skor Sosialisasi</div>
          {p.stageData.sosialisasi?.status === 'completed' || p.stageData.sosialisasi?.status === 'in_progress' ? (
            <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
              <div style={{ flex: 1, textAlign: 'center', padding: 12, background: '#fff', borderRadius: 2 }}>
                <div style={{ fontSize: 9, color: theme.textSubtle, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pretest</div>
                <div style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 300, color: theme.navy, marginTop: 4 }}>
                  {p.stageData.sosialisasi.pretestScore || '-'}<span style={{ fontSize: 11, color: theme.textSubtle }}>/100</span>
                </div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: 12, background: '#fff', borderRadius: 2 }}>
                <div style={{ fontSize: 9, color: theme.textSubtle, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Posttest</div>
                <div style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 300, color: p.stageData.sosialisasi.posttestScore ? theme.success : theme.textSubtle, marginTop: 4 }}>
                  {p.stageData.sosialisasi.posttestScore || '-'}<span style={{ fontSize: 11, color: theme.textSubtle }}>/100</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 11, color: theme.textMuted, fontStyle: 'italic', marginBottom: 14 }}>Belum diisi</div>
          )}

          <div style={{ paddingTop: 10, borderTop: `1px solid ${theme.border}` }}>
            <div style={{ fontSize: 10, color: theme.textSubtle, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Mentor</div>
            <div style={{ fontSize: 11, color: theme.text, fontWeight: 500 }}>{mentor?.user || '-'}</div>
            <div style={{ fontSize: 10, color: theme.textMuted }}>{mentor?.satker || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----- TAB: COACHING (1-on-1 mentor: schedule + evaluation) -----
function WorkspaceCoaching({ participant: target }) {
  const { updateParticipant, toast, addAudit, pushNotif, currentUser } = useApp();
  const coaching = target.stageData.coaching;
  const existing = coaching?.mentorEvaluation;
  const [strengths, setStrengths]           = useState(existing?.strengths || '');
  const [development, setDevelopment]       = useState(existing?.development || '');
  const [recommendation, setRecommendation] = useState(existing?.recommendation || '');

  // Schedule proposal form
  const [showProposeForm, setShowProposeForm] = useState(false);
  const [proposal, setProposal] = useState({ tanggal: '', waktu: '14:00', durasi: 60, lokasi: 'Online · Microsoft Teams', topik: '', notes: '' });

  useEffect(() => {
    const ev = target.stageData.coaching?.mentorEvaluation;
    setStrengths(ev?.strengths || ''); setDevelopment(ev?.development || ''); setRecommendation(ev?.recommendation || '');
    setShowProposeForm(false);
    setProposal({ tanggal: '', waktu: '14:00', durasi: 60, lokasi: 'Online · Microsoft Teams', topik: '', notes: '' });
  }, [target.id]);

  const isInactive = !coaching || coaching.status === 'pending';
  const userShortName = currentUser.user.split(',')[0];

  if (isInactive) {
    return (
      <div style={{ background: theme.bg, border: `1px dashed ${theme.borderStrong}`, padding: 32, textAlign: 'center', borderRadius: 2 }}>
        <Clock size={26} style={{ color: theme.textMuted, margin: '0 auto 10px' }}/>
        <div style={{ fontSize: 13, fontWeight: 500 }}>Sesi Coaching Belum Aktif</div>
        <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>Tahap 3 akan aktif setelah peserta menyelesaikan Tahap 2 Sosialisasi (pretest & posttest)</div>
      </div>
    );
  }

  const sessions = coaching.sessions || [];
  const activeSession = sessions[sessions.length - 1];
  const today = new Date().toISOString().slice(0, 10);
  const sessionDatePassed = activeSession && activeSession.tanggal <= today;

  const isProposed = activeSession?.status === 'proposed';
  const isAccepted = activeSession?.status === 'accepted';
  const isRejected = activeSession?.status === 'rejected';
  const isSessionCompleted = activeSession?.status === 'completed';
  const evaluasiUnlocked = (isAccepted && sessionDatePassed) || isSessionCompleted;
  const surveyDone = !!coaching.pesertaSurvey;

  const fmtTanggal = (s) => s ? new Date(s).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-';
  const fmtTanggalShort = (s) => s ? new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

  const proposeSchedule = () => {
    if (!proposal.tanggal || !proposal.waktu || !proposal.topik.trim()) {
      toast('Tanggal, waktu, dan topik wajib diisi', 'warning'); return;
    }
    if (proposal.tanggal < today) {
      toast('Tanggal tidak bisa di masa lalu', 'warning'); return;
    }
    const newSession = {
      id: `CS${Date.now().toString(36).toUpperCase()}`,
      tanggal: proposal.tanggal,
      waktu: proposal.waktu,
      durasi: parseInt(proposal.durasi, 10),
      lokasi: proposal.lokasi,
      topik: proposal.topik,
      status: 'proposed',
      proposedBy: 'mentor',
      proposedAt: today,
      notes: proposal.notes,
    };
    updateParticipant(target.id, old => ({
      ...old,
      stageData: {
        ...old.stageData,
        coaching: {
          ...old.stageData.coaching,
          sessions: [...(old.stageData.coaching.sessions || []), newSession],
        },
      },
    }));
    addAudit(userShortName, `Mengajukan jadwal sesi coaching · ${fmtTanggalShort(proposal.tanggal)}`, target.nama);
    pushNotif('peserta', { type: 'info', title: `Mentor mengajukan jadwal coaching`, desc: `${fmtTanggalShort(proposal.tanggal)} ${proposal.waktu} · mohon konfirmasi ketersediaan` });
    toast(`Jadwal diajukan ke ${target.nama}.`, 'success');
    setShowProposeForm(false);
    setProposal({ tanggal: '', waktu: '14:00', durasi: 60, lokasi: 'Online · Microsoft Teams', topik: '', notes: '' });
  };

  const submitEvaluasi = () => {
    if (!strengths.trim() || !development.trim() || !recommendation.trim()) {
      toast('Mohon lengkapi semua field evaluasi', 'warning'); return;
    }
    updateParticipant(target.id, old => ({
      ...old,
      stageData: {
        ...old.stageData,
        coaching: {
          ...old.stageData.coaching,
          mentorEvaluation: { strengths, development, recommendation, evaluatedAt: new Date().toISOString().slice(0,10), evaluatedBy: userShortName },
          status: old.stageData.coaching.pesertaSurvey ? 'completed' : 'in_progress',
          sessions: old.stageData.coaching.sessions.map(s =>
            s.id === activeSession.id && s.status !== 'completed' ? { ...s, status: 'completed', completedAt: new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5) } : s
          ),
        },
      },
    }));
    addAudit(userShortName, 'Submit evaluasi 1-on-1 coaching', target.nama);
    pushNotif('peserta', { type: 'info', title: 'Evaluasi mentor tersedia', desc: `${userShortName} telah submit evaluasi sesi coaching Anda` });
    toast(`Evaluasi coaching ${target.nama} tersimpan.`, 'success');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, fontFamily: fonts.display }}>Sesi 1-on-1 Coaching</div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>Penjadwalan + evaluasi sesi coaching dengan {target.nama.split(' ').slice(0, 2).join(' ')}</div>
        </div>
        <Pill variant={isSessionCompleted || existing ? 'success' : isAccepted ? 'info' : isProposed ? 'warning' : 'default'}>
          {isSessionCompleted ? 'Sesi Selesai' : isAccepted ? sessionDatePassed ? 'Siap Evaluasi' : 'Terjadwal' : isProposed ? 'Menunggu Peserta' : isRejected ? 'Ditolak' : 'Belum Dijadwalkan'}
        </Pill>
      </div>

      {/* === A. NO SESSION YET → propose form === */}
      {!activeSession && !showProposeForm && (
        <div style={{ background: '#fff', border: `1px dashed ${theme.borderStrong}`, padding: 32, textAlign: 'center', borderRadius: 2 }}>
          <Calendar size={28} style={{ color: theme.textMuted, margin: '0 auto 10px' }}/>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Belum ada jadwal sesi</div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 6, lineHeight: 1.5, marginBottom: 16 }}>
            Ajukan jadwal coaching ke {target.nama.split(' ').slice(0, 2).join(' ')}. Setelah disetujui, sistem otomatis membuat Microsoft Teams meeting.
          </div>
          <Button variant="primary" icon={Plus} onClick={() => setShowProposeForm(true)}>Ajukan Jadwal</Button>
        </div>
      )}

      {/* === B. REJECTED → propose ulang === */}
      {isRejected && !showProposeForm && (
        <div style={{ background: '#fff', border: `1px solid ${theme.warning}`, borderLeft: `4px solid ${theme.warning}`, borderRadius: 2, padding: 18, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
            <X size={16} style={{ color: theme.warning, marginTop: 2 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Peserta menolak jadwal sebelumnya</div>
              <div style={{ fontSize: 10.5, color: theme.textMuted, marginTop: 2 }}>{fmtTanggalShort(activeSession.tanggal)} {activeSession.waktu} — ditolak {activeSession.rejectedAt}</div>
              {activeSession.rejectReason && (
                <div style={{ fontSize: 11, color: theme.text, lineHeight: 1.5, marginTop: 8, padding: 10, background: theme.bg, borderRadius: 2, fontStyle: 'italic' }}>
                  "{activeSession.rejectReason}"
                </div>
              )}
            </div>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => setShowProposeForm(true)}>Ajukan Jadwal Ulang</Button>
        </div>
      )}

      {/* === C. PROPOSE FORM === */}
      {showProposeForm && (
        <div style={{ background: '#fff', border: `1px solid ${theme.gold}`, borderRadius: 3, padding: 22, marginBottom: 14 }}>
          <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.gold, fontWeight: 700, marginBottom: 4 }}>Form Penjadwalan</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, fontFamily: fonts.display, marginBottom: 14 }}>Ajukan Jadwal Sesi Coaching</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Tanggal <span style={{ color: theme.danger }}>*</span></label>
              <input type="date" value={proposal.tanggal} min={today}
                onChange={e => setProposal({ ...proposal, tanggal: e.target.value })}
                style={{ width: '100%', fontSize: 12, fontFamily: fonts.mono, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', boxSizing: 'border-box' }}/>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Waktu <span style={{ color: theme.danger }}>*</span></label>
              <input type="time" value={proposal.waktu}
                onChange={e => setProposal({ ...proposal, waktu: e.target.value })}
                style={{ width: '100%', fontSize: 12, fontFamily: fonts.mono, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', boxSizing: 'border-box' }}/>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Durasi (menit)</label>
              <select value={proposal.durasi} onChange={e => setProposal({ ...proposal, durasi: e.target.value })}
                style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                {[30, 45, 60, 90, 120].map(d => <option key={d} value={d}>{d} menit</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Lokasi / Mode</label>
            <select value={proposal.lokasi} onChange={e => setProposal({ ...proposal, lokasi: e.target.value })}
              style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
              <option>Online · Microsoft Teams</option>
              <option>Offline · R. Coaching DSDM Lt.5</option>
              <option>Offline · R. Meeting Mentor</option>
              <option>Hybrid · Teams + R. Coaching</option>
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Topik Pembahasan <span style={{ color: theme.danger }}>*</span></label>
            <input value={proposal.topik} onChange={e => setProposal({ ...proposal, topik: e.target.value })}
              placeholder="Mis. Strategic thinking, Decision-making leadership"
              style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', boxSizing: 'border-box' }}/>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Catatan untuk Peserta (opsional)</label>
            <textarea value={proposal.notes} onChange={e => setProposal({ ...proposal, notes: e.target.value })} rows={2}
              placeholder="Mis. Mohon siapkan refleksi 2 minggu terakhir sebelum sesi"
              style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', resize: 'none', boxSizing: 'border-box' }}/>
          </div>

          <div style={{ background: theme.infoBg, border: '1px solid #BFDBFE', padding: 10, borderRadius: 2, fontSize: 11, color: theme.info, display: 'flex', gap: 8, marginBottom: 14 }}>
            <Info size={13} style={{ flexShrink: 0, marginTop: 1 }}/>
            <div>Peserta akan menerima notifikasi untuk konfirmasi. Setelah disetujui, Microsoft Teams meeting otomatis dibuat dan ditambahkan ke kedua calendar.</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="ghost" onClick={() => setShowProposeForm(false)}>Batal</Button>
            <Button variant="primary" icon={Send} onClick={proposeSchedule}>Kirim Proposal</Button>
          </div>
        </div>
      )}

      {/* === D. PROPOSED → waiting peserta === */}
      {isProposed && !showProposeForm && (
        <div style={{ background: '#fff', border: `1px solid ${theme.warning}`, borderLeft: `4px solid ${theme.warning}`, borderRadius: 2, padding: 18, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Clock size={16} style={{ color: theme.warning }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Menunggu konfirmasi peserta</div>
              <div style={{ fontSize: 10.5, color: theme.textMuted, marginTop: 2 }}>Diajukan {activeSession.proposedAt}</div>
            </div>
          </div>
          <div style={{ padding: 12, background: theme.bg, borderRadius: 2, fontSize: 11.5, color: theme.text, lineHeight: 1.5 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{fmtTanggal(activeSession.tanggal)} · {activeSession.waktu} WIB ({activeSession.durasi} menit)</div>
            <div style={{ color: theme.textMuted, marginBottom: 4 }}>{activeSession.lokasi}</div>
            <div style={{ color: theme.textMuted, fontSize: 10.5 }}>Topik: {activeSession.topik}</div>
          </div>
        </div>
      )}

      {/* === E. ACCEPTED → calendar entry === */}
      {isAccepted && (
        <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, marginBottom: 14, overflow: 'hidden' }}>
          <div style={{ background: theme.success, color: '#fff', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 size={15}/>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Jadwal Dikonfirmasi · Calendar Tersinkronisasi</div>
            {sessionDatePassed && (
              <div style={{ marginLeft: 'auto', fontSize: 11, fontFamily: fonts.mono }}>Sesi sudah berlangsung</div>
            )}
          </div>
          <div style={{ padding: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600 }}>Tanggal</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginTop: 3 }}>{fmtTanggalShort(activeSession.tanggal)} {activeSession.waktu}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600 }}>Lokasi</div>
                <div style={{ fontSize: 11.5, color: theme.text, marginTop: 3 }}>{activeSession.lokasi}</div>
              </div>
            </div>
            {activeSession.teamsLink && (
              <a href={activeSession.teamsLink} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: '#5059C9', color: '#fff', borderRadius: 2, textDecoration: 'none', fontSize: 11, fontWeight: 600, fontFamily: fonts.body }}>
                <PlayCircle size={13}/> Buka Teams Meeting
              </a>
            )}
            {!sessionDatePassed && (
              <div style={{ marginTop: 12, fontSize: 11, color: theme.textMuted, fontStyle: 'italic' }}>
                Form evaluasi akan otomatis terbuka setelah sesi berlangsung.
              </div>
            )}
          </div>
        </div>
      )}

      {/* === F. EVALUASI FORM (after session passed) === */}
      {evaluasiUnlocked && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderLeft: `3px solid ${existing ? theme.success : theme.warning}`, padding: 12, borderRadius: 2 }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.textMuted, fontWeight: 600, marginBottom: 4 }}>Evaluasi Mentor</div>
              <div style={{ fontSize: 11, color: theme.text }}>{existing ? `Tersimpan ${existing.evaluatedAt}` : 'Belum diinput'}</div>
            </div>
            <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderLeft: `3px solid ${surveyDone ? theme.success : theme.warning}`, padding: 12, borderRadius: 2 }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.textMuted, fontWeight: 600, marginBottom: 4 }}>Survey Peserta</div>
              <div style={{ fontSize: 11, color: theme.text }}>
                {surveyDone
                  ? `Skor mentor ${coaching.pesertaSurvey.mentorEffectiveness}/10 · sesi ${coaching.pesertaSurvey.sessionQuality}/10`
                  : 'Peserta belum submit survey'}
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, fontFamily: fonts.display, marginBottom: 4 }}>Form Evaluasi Mentor</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 14 }}>Berikan strengths, area pengembangan, dan rekomendasi tindak lanjut</div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: theme.text, marginBottom: 3 }}>Kekuatan (Strengths) <span style={{ color: theme.danger }}>*</span></label>
              <textarea value={strengths} onChange={e => setStrengths(e.target.value)} rows={3} disabled={!!existing}
                placeholder="Contoh: Peserta menunjukkan kapasitas analitis yang kuat..."
                style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', resize: 'none', boxSizing: 'border-box', background: existing ? theme.bg : '#fff' }}/>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: theme.text, marginBottom: 3 }}>Area Pengembangan <span style={{ color: theme.danger }}>*</span></label>
              <textarea value={development} onChange={e => setDevelopment(e.target.value)} rows={3} disabled={!!existing}
                placeholder="Area-area yang masih dapat dikembangkan..."
                style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', resize: 'none', boxSizing: 'border-box', background: existing ? theme.bg : '#fff' }}/>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: theme.text, marginBottom: 3 }}>Rekomendasi <span style={{ color: theme.danger }}>*</span></label>
              <textarea value={recommendation} onChange={e => setRecommendation(e.target.value)} rows={3} disabled={!!existing}
                placeholder="Rekomendasi tindak lanjut atau development plan..."
                style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', resize: 'none', boxSizing: 'border-box', background: existing ? theme.bg : '#fff' }}/>
            </div>
            {!existing && (
              <div style={{ paddingTop: 12, borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <Button variant="primary" icon={Send} onClick={submitEvaluasi}>Submit Evaluasi</Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// =====================================================================
// MENTOR VIEW: shared helpers untuk preview form mentee
// =====================================================================
function PreviewLabel({ label, desc, required, status }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>{label}</span>
        {required && <span style={{ color: theme.danger, fontSize: 11 }}>*</span>}
        {status === 'filled' && <CheckCircle2 size={11} style={{ color: theme.success }}/>}
      </div>
      {desc && <div style={{ fontSize: 10.5, color: theme.textMuted, lineHeight: 1.5 }}>{desc}</div>}
    </div>
  );
}

function PreviewTextValue({ value, placeholder = 'Belum diisi peserta' }) {
  if (value) {
    return (
      <div style={{ marginTop: 6, padding: 12, background: theme.bg, borderRadius: 2, fontSize: 12, color: theme.text, lineHeight: 1.6, whiteSpace: 'pre-wrap', border: `1px solid ${theme.border}` }}>
        {value}
      </div>
    );
  }
  return (
    <div style={{ marginTop: 6, padding: 12, background: '#FAFBFC', border: `1px dashed ${theme.borderStrong}`, borderRadius: 2, fontSize: 11, color: theme.textSubtle, fontStyle: 'italic', minHeight: 40, display: 'flex', alignItems: 'center' }}>
      {placeholder}
    </div>
  );
}

function PreviewLikert({ value, color }) {
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <div key={n} style={{
            flex: 1, height: 28, fontSize: 10.5, fontFamily: fonts.mono, fontWeight: 600,
            background: value && n <= value ? (n >= 8 ? theme.success : n >= 5 ? theme.gold : theme.warning) : '#F1F3F6',
            color: value && n <= value ? '#fff' : theme.textSubtle,
            border: 'none', borderRadius: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{n}</div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: theme.textSubtle }}>
        <span>1 — Tidak / Rendah</span>
        <span style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: 300, color: value ? color : theme.textSubtle, lineHeight: 1 }}>
          {value ? <>{value}<span style={{ fontSize: 10 }}>/10</span></> : '—'}
        </span>
        <span>10 — Sangat / Tinggi</span>
      </div>
    </div>
  );
}

function PreviewYesNo({ value, options = ['Ya', 'Belum bisa memutuskan', 'Tidak'] }) {
  return (
    <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
      {options.map(opt => {
        const isSelected = value === opt;
        return (
          <div key={opt} style={{
            padding: '8px 14px', fontSize: 11.5, fontFamily: fonts.body, fontWeight: 500,
            background: isSelected ? (opt === 'Ya' ? theme.success : opt === 'Tidak' ? theme.danger : theme.gold) : '#fff',
            color: isSelected ? '#fff' : theme.textMuted,
            border: `1px solid ${isSelected ? 'transparent' : theme.border}`, borderRadius: 2,
            opacity: !value ? 0.5 : 1,
          }}>{opt}</div>
        );
      })}
      {!value && <span style={{ fontSize: 10.5, color: theme.textSubtle, fontStyle: 'italic', alignSelf: 'center' }}>belum dipilih</span>}
    </div>
  );
}

function PreviewKategori({ selectedValue, kategori }) {
  return (
    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {kategori.map(opt => {
        const isSelected = selectedValue === opt.value;
        return (
          <div key={opt.value} title={opt.hint} style={{
            padding: '8px 14px',
            background: isSelected ? opt.color : '#fff',
            color: isSelected ? '#fff' : theme.textMuted,
            border: `1px solid ${isSelected ? opt.color : theme.border}`, borderRadius: 2,
            fontSize: 11, fontFamily: fonts.body, fontWeight: isSelected ? 600 : 500,
            opacity: selectedValue && !isSelected ? 0.45 : 1,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            {isSelected && <CheckCircle2 size={11}/>}
            {opt.label}
          </div>
        );
      })}
    </div>
  );
}

function PreviewHeader({ tahap, label, desc, status, submittedAt }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${theme.border}` }}>
      <div>
        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.gold, fontWeight: 700 }}>Tahap {tahap}</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: theme.text, fontFamily: fonts.display, marginTop: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 3 }}>{desc}</div>
      </div>
      {status === 'completed' ? (
        <div style={{ textAlign: 'right' }}>
          <Pill variant="success">Selesai</Pill>
          {submittedAt && <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 4, fontFamily: fonts.mono }}>{submittedAt}</div>}
        </div>
      ) : (
        <Pill variant="warning">Belum diisi peserta</Pill>
      )}
    </div>
  );
}

// ----- TAB: MONITORING 1 (mentor preview view) -----
function WorkspaceMon1View({ participant: p }) {
  const m1 = p.stageData.monitoring1;
  const filled = m1?.status === 'completed';

  return (
    <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderLeft: `4px solid ${filled ? theme.success : theme.borderStrong}`, borderRadius: 2, padding: 24 }}>
      <PreviewHeader tahap="04" label="Monitoring 1 · Tindak Lanjut Awal"
        desc={filled ? `Update progress development plan dari ${p.nama.split(' ')[0]} setelah sesi coaching` : `Form yang akan diisi oleh ${p.nama.split(' ')[0]} pada Tahap 04`}
        status={m1?.status} submittedAt={m1?.submittedAt}/>

      {/* 3 essay utama */}
      {[
        { key: 'tindakLanjut', label: 'Tindak Lanjut yang Sudah Dilakukan', desc: 'Terkait tindak lanjut rencana pengembangan individu setelah sesi DIKSI, hal apa yang sudah dilakukan?', required: true },
        { key: 'kendala', label: 'Kendala yang Dihadapi', desc: 'Apa kendala yang dihadapi terkait tindak lanjut rencana pengembangan?', required: true },
        { key: 'dukungan', label: 'Dukungan yang Dibutuhkan', desc: 'Dukungan dan support seperti apa yang dibutuhkan terkait tindak lanjut rencana pengembangan?', required: true },
      ].map(f => (
        <div key={f.key} style={{ marginBottom: 18 }}>
          <PreviewLabel label={f.label} desc={f.desc} required={f.required} status={m1?.[f.key] ? 'filled' : null}/>
          <PreviewTextValue value={m1?.[f.key]}/>
        </div>
      ))}

      {/* Detail tindak lanjut */}
      <div style={{ paddingTop: 14, borderTop: `1px solid ${theme.border}` }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.textMuted, fontWeight: 600, marginBottom: 12 }}>Detail Tindak Lanjut Spesifik</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { key: 'pelatihan', label: 'Pelatihan / IHT' },
            { key: 'sertifikasi', label: 'Sertifikasi' },
            { key: 'kepanitiaan', label: 'Kepanitiaan' },
            { key: 'lainnya', label: 'Lainnya' },
          ].map(f => (
            <div key={f.key}>
              <PreviewLabel label={f.label} status={m1?.[f.key] ? 'filled' : null}/>
              <PreviewTextValue value={m1?.[f.key]} placeholder="—"/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----- TAB: MONITORING 2 (mentor preview view) -----
function WorkspaceMon2View({ participant: p }) {
  const m2 = p.stageData.monitoring2;
  const filled = m2?.status === 'completed';

  return (
    <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderLeft: `4px solid ${filled ? theme.success : theme.borderStrong}`, borderRadius: 2, padding: 24 }}>
      <PreviewHeader tahap="05" label="Monitoring 2 · Penilaian Pertengahan"
        desc={filled ? `Penilaian manfaat program & kesediaan kontribusi balik dari ${p.nama.split(' ')[0]}` : `Form yang akan diisi oleh ${p.nama.split(' ')[0]} pada Tahap 05`}
        status={m2?.status} submittedAt={m2?.submittedAt}/>

      {/* 3 Likert questions */}
      {[
        { key: 'manfaat', label: 'Manfaat DIKSI bagi Peserta', desc: 'Sejauh mana DIKSI memberikan manfaat bagi peserta?' },
        { key: 'bertumbuh', label: 'Bertumbuh Menjadi Versi Terbaik', desc: 'Sejauh mana DIKSI membantu peserta bertumbuh menjadi versi terbaik?' },
        { key: 'rekomendasi', label: 'Rekomendasi DIKSI', desc: 'Sejauh mana peserta merekomendasikan DIKSI untuk diikuti pegawai lain?' },
      ].map(f => (
        <div key={f.key} style={{ marginBottom: 22 }}>
          <PreviewLabel label={f.label} desc={f.desc} status={m2?.[f.key] != null ? 'filled' : null}/>
          <PreviewLikert value={m2?.[f.key]} color={theme.navy}/>
        </div>
      ))}

      {/* Saran textarea */}
      <div style={{ marginBottom: 18, paddingTop: 6 }}>
        <PreviewLabel label="Saran Proses Follow-up" desc="Saran terhadap proses follow-up atas tindak lanjut pengisian coaching plan yang telah diterima selama ini" required status={m2?.saran ? 'filled' : null}/>
        <PreviewTextValue value={m2?.saran}/>
      </div>

      {/* 2 Yes/No */}
      <div style={{ paddingTop: 12, borderTop: `1px solid ${theme.border}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div>
          <PreviewLabel label="Bersedia Menjadi Fasilitator" desc="Apabila DIKSI dilaksanakan di masing-masing satuan kerja, bersedia menjadi Fasilitator (pemandu kegiatan Group Coaching)?" required status={m2?.bersedia_fasilitator ? 'filled' : null}/>
          <PreviewYesNo value={m2?.bersedia_fasilitator}/>
        </div>
        <div>
          <PreviewLabel label="Bersedia Pembekalan Fasilitator" desc="Bersedia mengikuti kegiatan Pembekalan Fasilitator DIKSI?" required status={m2?.bersedia_pembekalan ? 'filled' : null}/>
          <PreviewYesNo value={m2?.bersedia_pembekalan}/>
        </div>
      </div>
    </div>
  );
}

// ----- TAB: MONITORING 3 (mentor preview view dengan kategorisasi kualitatif) -----
function WorkspaceMon3View({ participant: p }) {
  const m3 = p.stageData.monitoring3;
  const filled = m3?.status === 'completed';

  const sections = [
    {
      katKey: 'kategori_perubahan', elabKey: 'elaborasi_perubahan', fallback: 'refleksi_perubahan',
      label: 'Tingkat Perubahan dalam Diri',
      desc: 'Setelah mengikuti DIKSI, sejauh mana peserta merasakan perubahan dalam cara berpikir, sikap, atau kapasitas diri?',
      kategori: [
        { value: 'transformatif', label: 'Transformatif',  hint: 'Perubahan mendasar dalam cara pikir & paradigma',  color: theme.success },
        { value: 'signifikan',    label: 'Signifikan',     hint: 'Banyak aspek diri yang berkembang nyata',          color: theme.success },
        { value: 'sedang',        label: 'Sedang',         hint: 'Beberapa aspek mengalami perubahan',                color: theme.gold },
        { value: 'sedikit',       label: 'Sedikit',        hint: 'Perubahan minor pada aspek tertentu',               color: theme.warning },
        { value: 'belum_terasa',  label: 'Belum Terasa',   hint: 'Belum merasakan perubahan signifikan',              color: theme.danger },
      ],
    },
    {
      katKey: 'kategori_pencapaian', elabKey: 'elaborasi_pencapaian', fallback: 'refleksi_pencapaian',
      label: 'Tingkat Pencapaian Tujuan Pengembangan',
      desc: 'Sejauh mana tujuan/target development plan yang disusun saat coaching tercapai?',
      kategori: [
        { value: 'melampaui',     label: 'Melampaui Ekspektasi', hint: 'Pencapaian melebihi target awal',          color: theme.success },
        { value: 'sesuai_target', label: 'Sesuai Target',         hint: 'Pencapaian sesuai dengan rencana',         color: theme.success },
        { value: 'sebagian',      label: 'Sebagian Tercapai',     hint: 'Beberapa target tercapai, lainnya masih', color: theme.gold },
        { value: 'berproses',     label: 'Masih Berproses',       hint: 'Target dalam tahap pengerjaan aktif',     color: theme.warning },
        { value: 'belum_tercapai',label: 'Belum Tercapai',        hint: 'Target belum dapat direalisasikan',       color: theme.danger },
      ],
    },
    {
      katKey: 'kategori_pembelajaran', elabKey: 'elaborasi_pembelajaran', fallback: 'refleksi_pembelajaran',
      label: 'Kualitas Pembelajaran yang Diperoleh',
      desc: 'Bagaimana kualitas pembelajaran (insight, skill, mindset) yang diperoleh dari proses coaching dan monitoring?',
      kategori: [
        { value: 'sangat_mendalam', label: 'Sangat Mendalam',    hint: 'Insight transformatif & shift mindset besar', color: theme.success },
        { value: 'mendalam',        label: 'Mendalam',            hint: 'Pembelajaran kaya dan berkesan',              color: theme.success },
        { value: 'standar',         label: 'Standar',             hint: 'Pembelajaran cukup, sesuai ekspektasi',       color: theme.gold },
        { value: 'kurang_optimal',  label: 'Kurang Optimal',      hint: 'Pembelajaran terbatas atau tidak menempel',   color: theme.warning },
      ],
    },
    {
      katKey: 'kategori_kedepan', elabKey: 'elaborasi_kedepan', fallback: 'refleksi_kedepan',
      label: 'Kejelasan Visi & Aspirasi ke Depan',
      desc: 'Setelah program ini, seberapa jelas visi karir dan aspirasi peserta di Bank Indonesia?',
      kategori: [
        { value: 'sangat_jelas',  label: 'Sangat Jelas dengan Roadmap', hint: 'Visi jelas dengan langkah konkret 3-5 tahun', color: theme.success },
        { value: 'cukup_jelas',   label: 'Cukup Jelas',                  hint: 'Arah sudah jelas, detail eksekusi berkembang', color: theme.success },
        { value: 'eksploratif',   label: 'Masih Eksploratif',            hint: 'Sedang menjelajahi berbagai kemungkinan',      color: theme.gold },
        { value: 'belum_terbentuk', label: 'Belum Terbentuk',            hint: 'Belum ada gambaran konkret',                   color: theme.warning },
      ],
    },
  ];

  return (
    <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderLeft: `4px solid ${filled ? theme.success : theme.borderStrong}`, borderRadius: 2, padding: 24 }}>
      <PreviewHeader tahap="06" label="Monitoring 3 · Self Reflection"
        desc={filled ? `Refleksi mendalam dengan kategorisasi kualitatif dari ${p.nama.split(' ')[0]}` : `Form self-reflection yang akan diisi oleh ${p.nama.split(' ')[0]} pada Tahap 06`}
        status={m3?.status} submittedAt={m3?.submittedAt}/>

      {sections.map((section, idx) => {
        const selectedValue = m3?.[section.katKey];
        const elaborasi = m3?.[section.elabKey] || m3?.[section.fallback];
        return (
          <div key={section.katKey} style={{ marginBottom: 22, paddingBottom: 22, borderBottom: idx < sections.length - 1 ? `1px solid ${theme.border}` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: fonts.mono, fontSize: 10, color: theme.textSubtle }}>0{idx + 1}</span>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: theme.text, fontFamily: fonts.display }}>{section.label}</div>
              {selectedValue && <CheckCircle2 size={11} style={{ color: theme.success }}/>}
            </div>
            <div style={{ fontSize: 10.5, color: theme.textMuted, lineHeight: 1.5, marginBottom: 6, paddingLeft: 22 }}>{section.desc}</div>

            <div style={{ paddingLeft: 22 }}>
              <PreviewKategori selectedValue={selectedValue} kategori={section.kategori}/>
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Elaborasi</div>
                <PreviewTextValue value={elaborasi}/>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ----- TAB: EVALUASI AKHIR (mentor preview view) -----
function WorkspaceEvalView({ participant: p }) {
  const ev = p.stageData.evaluasi;
  const filled = ev?.status === 'completed';
  const mentor = USERS[p.mentorUserId];

  return (
    <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderLeft: `4px solid ${filled ? theme.success : theme.borderStrong}`, borderRadius: 2, padding: 24 }}>
      <PreviewHeader tahap="07" label="Evaluasi Akhir Program"
        desc={filled ? `Penilaian komprehensif program DIKSI dan mentor dari ${p.nama.split(' ')[0]}` : `Form evaluasi akhir yang akan diisi oleh ${p.nama.split(' ')[0]} pada Tahap 07`}
        status={ev?.status} submittedAt={ev?.submittedAt}/>

      {filled && (
        <div style={{ background: theme.successBg, border: `1px solid ${theme.success}`, padding: 12, borderRadius: 2, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle2 size={16} style={{ color: theme.success }}/>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Peserta menyelesaikan program</div>
            <div style={{ fontSize: 10.5, color: theme.textMuted, marginTop: 2 }}>Evaluasi akhir disubmit {ev.submittedAt}</div>
          </div>
        </div>
      )}

      {/* Skor section */}
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.textMuted, fontWeight: 600, marginBottom: 14 }}>Penilaian (Skala 1-10)</div>

      {/* Skor program */}
      <div style={{ marginBottom: 22 }}>
        <PreviewLabel label="Penilaian Keseluruhan Program DIKSI" desc="Penilaian peserta terhadap program DIKSI secara keseluruhan (kualitas, struktur, eksekusi)" status={ev?.skor_program ? 'filled' : null}/>
        <PreviewLikert value={ev?.skor_program} color={theme.navy}/>
      </div>

      {/* Skor mentor — highlighted */}
      <div style={{ marginBottom: 22, padding: 14, background: theme.goldLight + '20', border: `1px solid ${theme.gold}`, borderLeft: `4px solid ${theme.gold}`, borderRadius: 2 }}>
        <div style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.goldDark, fontWeight: 700, marginBottom: 4 }}>Penilaian Untuk Anda Sebagai Mentor</div>
        <PreviewLabel label={`Skor untuk ${mentor?.user.split(',')[0] || 'Mentor'}`} desc={`Penilaian peserta terhadap performa Anda sebagai coach selama program`} status={ev?.skor_mentor ? 'filled' : null}/>
        <PreviewLikert value={ev?.skor_mentor} color={theme.gold}/>
      </div>

      {/* Skor kebermanfaatan */}
      <div style={{ marginBottom: 22 }}>
        <PreviewLabel label="Kebermanfaatan Program" desc="Sejauh mana program DIKSI memberikan dampak nyata pada karir dan pengembangan peserta" status={ev?.kebermanfaatan ? 'filled' : null}/>
        <PreviewLikert value={ev?.kebermanfaatan} color={theme.success}/>
      </div>

      {/* Feedback section */}
      <div style={{ paddingTop: 12, borderTop: `1px solid ${theme.border}` }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.textMuted, fontWeight: 600, marginBottom: 14 }}>Feedback Tertulis</div>

        <div style={{ marginBottom: 18 }}>
          <PreviewLabel label="Feedback untuk Program DIKSI" desc="Apa yang paling diapresiasi dari program ini? Apa yang berkesan?" required status={ev?.feedback_program ? 'filled' : null}/>
          <PreviewTextValue value={ev?.feedback_program}/>
        </div>

        {/* Feedback mentor — highlighted gold */}
        <div style={{ marginBottom: 18, padding: 14, background: theme.goldLight + '20', border: `1px solid ${theme.gold}40`, borderLeft: `4px solid ${theme.gold}`, borderRadius: 2 }}>
          <div style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.goldDark, fontWeight: 700, marginBottom: 6 }}>Feedback Untuk Anda Sebagai Mentor</div>
          <PreviewLabel label={`Feedback untuk ${mentor?.user.split(',')[0] || 'Mentor'}`} desc="Pengalaman peserta dengan Anda sebagai mentor + saran" required status={ev?.feedback_mentor ? 'filled' : null}/>
          <PreviewTextValue value={ev?.feedback_mentor}/>
        </div>

        <div>
          <PreviewLabel label="Rekomendasi Perbaikan Program" desc="Saran konkret untuk peningkatan kualitas DIKSI di masa depan (opsional)" status={ev?.rekomendasi_perbaikan ? 'filled' : null}/>
          <PreviewTextValue value={ev?.rekomendasi_perbaikan}/>
        </div>
      </div>
    </div>
  );
}


// =====================================================================
// PESERTA VIEWS
// =====================================================================

function PesertaJourney() {
  const { participants, setParticipants, batches, setActiveMenu, pesertaPersonaId, toast, addAudit, pushNotif } = useApp();
  const me = participants.find(p => p.id === pesertaPersonaId) || participants[0];
  const mentor = USERS[me.mentorUserId];
  const myBatch = batches.find(b => b.id === me.batchId);

  const isConfirmed = me.konfirmasiHadir === 'confirmed';
  const isPending = me.konfirmasiHadir === 'pending';
  const isDeclined = me.konfirmasiHadir === 'declined';

  const fmtDate = (s) => s ? new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

  const confirm = (status) => {
    setParticipants(prev => prev.map(p => p.id !== me.id ? p : ({
      ...p,
      konfirmasiHadir: status,
      stageData: status === 'confirmed' ? {
        ...p.stageData,
        registrasi: { ...p.stageData.registrasi, status: 'in_progress', registeredAt: new Date().toISOString().slice(0,10) },
      } : p.stageData,
    })));
    if (status === 'confirmed') {
      addAudit(me.nama, 'Konfirmasi bersedia mengikuti program DIKSI', null);
      pushNotif('admin', { type: 'success', title: `${me.nama} bersedia mengikuti DIKSI`, desc: `${me.satker} · konfirmasi diterima` });
      toast('Terima kasih atas konfirmasinya. Anda resmi terdaftar sebagai peserta DIKSI.', 'success');
    } else {
      addAudit(me.nama, 'Menolak partisipasi program DIKSI', null);
      pushNotif('admin', { type: 'warning', title: `${me.nama} menolak DIKSI`, desc: `${me.satker} · perlu follow-up` });
      toast('Konfirmasi penolakan dicatat. Admin DSDM akan menindaklanjuti.', 'info');
    }
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Peserta · Journey"
        title="Journey Coaching Anda"
        desc={
          isConfirmed
            ? `Tahap ${me.stage} dari 7 · ${myBatch?.nama || ''}${myBatch ? ` · ${fmtDate(myBatch.tanggalMulai)} – ${fmtDate(myBatch.tanggalSelesai)}` : ''}`
            : isDeclined
              ? 'Status: tidak berpartisipasi'
              : `Konfirmasi kesediaan diperlukan${myBatch ? ` · ${fmtDate(myBatch.tanggalMulai)} – ${fmtDate(myBatch.tanggalSelesai)}` : ''}`
        }
      />

      {/* === 1. KONFIRMASI CARD === */}
      {isPending && (
        <div style={{
          background: '#fff', border: `1px solid ${theme.gold}`, borderLeft: `4px solid ${theme.gold}`,
          borderRadius: 3, padding: 24, marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 48, height: 48, background: theme.goldLight + '40', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertCircle size={22} style={{ color: theme.goldDark }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.gold, fontWeight: 700, marginBottom: 4 }}>Konfirmasi Diperlukan</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: theme.text, fontFamily: fonts.display, marginBottom: 8 }}>
                Bersedia mengikuti program DIKSI?
              </div>
              <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.6, marginBottom: 16 }}>
                Anda telah dipilih oleh DSDM sebagai peserta <strong style={{ color: theme.text }}>{myBatch?.nama || 'DIKSI'}</strong>.
                Program ini berjalan {fmtDate(myBatch?.tanggalMulai)} hingga {fmtDate(myBatch?.tanggalSelesai)},
                dengan komitmen rata-rata 4-5 jam/bulan untuk sesi coaching, monitoring, dan evaluasi.
                Mohon konfirmasi kesediaan Anda untuk berpartisipasi.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="primary" icon={CheckCircle2} onClick={() => confirm('confirmed')}>Bersedia, Saya Ikut</Button>
                <Button variant="ghost" onClick={() => confirm('declined')}>Tidak Bersedia</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeclined && (
        <div style={{
          background: theme.bg, border: `1px dashed ${theme.borderStrong}`,
          borderRadius: 3, padding: 24, marginBottom: 20, textAlign: 'center',
        }}>
          <X size={26} style={{ color: theme.textMuted, margin: '0 auto 8px' }}/>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Anda tidak berpartisipasi dalam program DIKSI</div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4, marginBottom: 14 }}>Hubungi Admin DSDM jika ingin berubah keputusan.</div>
          <Button variant="ghost" onClick={() => confirm('confirmed')}>Berubah pikiran — Saya bersedia ikut</Button>
        </div>
      )}

      {/* === 2. PROGRESS KESELURUHAN === */}
      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, padding: 28, marginBottom: 20, opacity: isConfirmed ? 1 : 0.55 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.textMuted, marginBottom: 4 }}>Progress Keseluruhan</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: fonts.display, fontSize: 42, fontWeight: 300, color: theme.text, letterSpacing: '-0.02em' }}>{calcProgress(me)}%</span>
              <span style={{ fontSize: 12, color: theme.textMuted }}>tahap {me.stage} dari 7</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.textMuted, marginBottom: 4 }}>Tahap saat ini</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{STAGES[me.stage-1]?.nama}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: fonts.mono, marginTop: 2 }}>{STAGES[me.stage-1]?.actor}</div>
          </div>
        </div>

        {/* Timeline 7 stages */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 20, height: 2, background: theme.border }}/>
          <div style={{ position: 'absolute', left: 0, top: 20, height: 2, background: theme.gold, width: `${((me.stage - 1) / (STAGES.length - 1)) * 100}%`, transition: 'width 0.3s' }}/>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
            {STAGES.map(t => {
              const status = stageStatus(me, t.key);
              const Ic = t.icon;
              const dim = !t.built;
              return (
                <div key={t.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, opacity: dim ? 0.5 : 1 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 21,
                    background: status === 'completed' ? theme.success : status === 'in_progress' ? theme.gold : '#fff',
                    border: status === 'pending' ? `2px ${dim ? 'dashed' : 'solid'} ${theme.border}` : 'none',
                    boxShadow: status === 'in_progress' ? `0 0 0 4px ${theme.gold}30` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', zIndex: 1, transition: 'all 0.2s',
                  }}>
                    {status === 'completed' ? <CheckCircle2 size={16} style={{ color: '#fff' }}/>
                      : <Ic size={14} style={{ color: status === 'in_progress' ? theme.navy : theme.textSubtle }}/>}
                  </div>
                  <div style={{ marginTop: 10, textAlign: 'center', maxWidth: 90 }}>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: theme.textSubtle }}>0{t.id}</div>
                    <div style={{ fontSize: 10, fontWeight: status === 'in_progress' ? 600 : 500, color: status === 'in_progress' ? theme.text : theme.textMuted, marginTop: 2, lineHeight: 1.3 }}>{t.nama}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* === 3. INFO MENTOR === */}
      {mentor && (
        <div style={{
          background: `linear-gradient(135deg, ${theme.navy} 0%, ${theme.navyDark} 100%)`,
          color: '#fff', padding: 24, borderRadius: 3, marginBottom: 20, position: 'relative', overflow: 'hidden',
          opacity: isConfirmed ? 1 : 0.55,
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 90% 30%, rgba(184,147,90,0.15) 0%, transparent 50%)` }}/>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: theme.gold, color: theme.navy,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, fontFamily: fonts.display,
              border: `3px solid rgba(184,147,90,0.4)`, flexShrink: 0,
            }}>
              {mentor.user.split(' ').slice(0, 2).map(n => n[0]).join('').replace(/[^A-Z]/g, '').slice(0, 2)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', color: theme.goldLight, fontWeight: 600, marginBottom: 4 }}>
                Mentor Anda
              </div>
              <div style={{ fontFamily: fonts.display, fontSize: 18, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 3 }}>{mentor.user}</div>
              <div style={{ fontSize: 11.5, color: theme.goldLight, lineHeight: 1.5 }}>
                {mentor.jabatan} · {mentor.satker}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
              <Pill variant="gold">Atasan langsung</Pill>
              <button onClick={() => isConfirmed && setActiveMenu('coaching')} disabled={!isConfirmed}
                style={{
                  background: 'rgba(184,147,90,0.15)', color: theme.gold,
                  border: '1px solid rgba(184,147,90,0.4)', padding: '6px 12px', borderRadius: 2,
                  fontFamily: fonts.body, fontSize: 11, fontWeight: 600, cursor: isConfirmed ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', gap: 5, opacity: isConfirmed ? 1 : 0.5,
                }}>
                Lihat sesi coaching <ArrowRight size={11}/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





function PesertaSosialisasi() {
  const { participants, setParticipants, toast, addAudit, pushNotif, pesertaPersonaId } = useApp();
  const me = participants.find(p => p.id === pesertaPersonaId) || participants[0];
  const sos = me.stageData.sosialisasi;

  const pretestVisible = !!sos?.pretestVisible;
  const posttestVisible = !!sos?.posttestVisible;
  const pretestDone = sos?.pretestScore != null;
  const posttestDone = sos?.posttestScore != null;

  const [pretestAnswers, setPretestAnswers] = useState({});
  const [posttestAnswers, setPosttestAnswers] = useState({});

  const questionsPretest = [
    { id: 'q1', q: 'Apa tujuan utama program DIKSI Coaching?', options: ['Promosi jabatan', 'Pengembangan kapasitas leadership untuk talenta KPP', 'Evaluasi kinerja', 'Training kompetensi dasar'], answer: 1 },
    { id: 'q2', q: 'Berapa jumlah tahapan dalam alur program DIKSI?', options: ['5', '6', '7', '8'], answer: 2 },
    { id: 'q3', q: 'Siapa yang menjadi mentor peserta DIKSI?', options: ['Admin DSDM', 'Eksternal coach profesional', 'Atasan peserta yang qualify', 'Tim HR'], answer: 2 },
    { id: 'q4', q: 'Sesi 1-on-1 coaching ada di tahap ke berapa?', options: ['Tahap 1', 'Tahap 2', 'Tahap 3', 'Tahap 4'], answer: 2 },
    { id: 'q5', q: 'Apa salah satu kriteria peserta DIKSI?', options: ['SMD min 5 tahun', 'SMD min 2 tahun', 'Status pegawai bebas', 'Tidak ada kriteria'], answer: 1 },
  ];

  const questionsPosttest = [
    { id: 'q1', q: 'Setelah sosialisasi, apa output utama dari sesi 1-on-1 coaching?', options: ['Promosi jabatan', 'Evaluasi mentor + survey peserta untuk pengembangan', 'Sertifikat training', 'Bonus tahunan'], answer: 1 },
    { id: 'q2', q: 'Jika konfirmasi kesediaan ditolak, apa yang harus dilakukan?', options: ['Tetap dipaksa ikut', 'Hubungi Admin DSDM', 'Diabaikan', 'Mengundurkan diri'], answer: 1 },
    { id: 'q3', q: 'Apa peran mentor dalam DIKSI?', options: ['Mengevaluasi performa kerja harian', 'Mendampingi peserta dengan strengths/development/recommendation', 'Memberikan promosi', 'Mengisi pretest'], answer: 1 },
    { id: 'q4', q: 'Setelah Tahap 03 Coaching, peserta masuk ke tahap apa?', options: ['Evaluasi langsung', 'Monitoring 1', 'Sertifikasi', 'Selesai'], answer: 1 },
    { id: 'q5', q: 'Komitmen waktu rata-rata peserta DIKSI per bulan?', options: ['1-2 jam', '4-5 jam', '10 jam', '20 jam'], answer: 1 },
  ];

  const submitPretest = () => {
    const correct = questionsPretest.filter(q => pretestAnswers[q.id] === q.answer).length;
    const score = Math.round((correct / questionsPretest.length) * 100);
    setParticipants(prev => prev.map(p => p.id !== me.id ? p : ({
      ...p,
      stageData: {
        ...p.stageData,
        sosialisasi: { ...p.stageData.sosialisasi, status: 'in_progress', pretestScore: score },
      }
    })));
    addAudit(me.nama, `Menyelesaikan pretest Sosialisasi (skor ${score})`, null);
    pushNotif('admin', { type: 'info', title: `${me.nama} selesai pretest`, desc: `Skor: ${score}/100` });
    pushNotif('mentor', { type: 'info', title: `${me.nama} selesai pretest`, desc: `Skor ${score}/100 · siap untuk dibukakan posttest setelah sesi sosialisasi` });
    toast(`Pretest selesai! Skor: ${score}/100. Posttest akan dibuka oleh mentor.`, 'success');
    setPretestAnswers({});
  };

  const submitPosttest = () => {
    const correct = questionsPosttest.filter(q => posttestAnswers[q.id] === q.answer).length;
    const score = Math.round((correct / questionsPosttest.length) * 100);
    setParticipants(prev => prev.map(p => p.id !== me.id ? p : ({
      ...p, stage: 3,
      stageData: {
        ...p.stageData,
        sosialisasi: { ...p.stageData.sosialisasi, status: 'completed', posttestScore: score, completedAt: new Date().toISOString().slice(0,10) },
        coaching: { status: 'in_progress', sesi: 1, mentorEvaluation: null, pesertaSurvey: null },
      }
    })));
    const mentor = USERS[me.mentorUserId];
    addAudit(me.nama, `Menyelesaikan posttest Sosialisasi (skor ${score})`, null);
    if (mentor) pushNotif('mentor', { type: 'info', title: `${me.nama} siap untuk coaching 1-on-1`, desc: `Pretest ${me.stageData.sosialisasi.pretestScore} → Posttest ${score}` });
    pushNotif('admin', { type: 'success', title: `${me.nama} masuk Tahap 3 Coaching`, desc: `Sosialisasi selesai · skor naik ${score - me.stageData.sosialisasi.pretestScore} poin` });
    toast(`Posttest selesai! Skor: ${score}/100. Lanjut ke Tahap 3 Coaching 1-on-1.`, 'success');
    setPosttestAnswers({});
  };

  // Belum check-in
  if (!sos || sos.status === 'pending') {
    return (
      <div>
        <SectionHeader eyebrow="Peserta · Tahap 02 · Sosialisasi" title="Belum Tersedia" desc="Lengkapi check-in pada Tahap 01 terlebih dahulu"/>
        <div style={{ background: '#fff', border: `1px dashed ${theme.borderStrong}`, padding: 32, textAlign: 'center', borderRadius: 2 }}>
          <Lock size={28} style={{ color: theme.textMuted, margin: '0 auto 10px' }}/>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Menunggu check-in registrasi</div>
        </div>
      </div>
    );
  }

  // Helper: render quiz section
  const renderQuiz = (label, questions, answers, setAnswers, onSubmit, scoreColor, currentScore) => {
    const answered = Object.keys(answers).length;
    return (
      <>
        {questions.map((q, idx) => (
          <div key={q.id} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
              <span style={{ fontFamily: fonts.mono, fontSize: 10, color: theme.textSubtle, marginTop: 3 }}>Q.0{idx+1}</span>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, lineHeight: 1.5 }}>{q.q}</div>
            </div>
            <div style={{ paddingLeft: 30 }}>
              {q.options.map((opt, oi) => (
                <label key={oi} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: answers[q.id] === oi ? theme.goldLight + '30' : theme.bg, border: `1px solid ${answers[q.id] === oi ? theme.gold : theme.border}`, borderRadius: 2, marginBottom: 6, cursor: 'pointer', fontSize: 12, fontFamily: fonts.body }}>
                  <input type="radio" name={`${label}-${q.id}`} checked={answers[q.id] === oi}
                    onChange={() => setAnswers({ ...answers, [q.id]: oi })}
                    style={{ accentColor: theme.gold }}/>
                  <span style={{ color: theme.text }}>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <div style={{ paddingTop: 16, borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 11, color: theme.textMuted }}>{answered} dari {questions.length} pertanyaan dijawab</div>
          <Button variant="primary" icon={Send} onClick={onSubmit} disabled={answered < questions.length}>Submit {label}</Button>
        </div>
      </>
    );
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Peserta · Tahap 02 · Sosialisasi"
        title="Pretest & Posttest"
        desc="Asesmen pemahaman sebelum dan sesudah sesi sosialisasi materi DIKSI"
      />

      {/* === SECTION PRETEST === */}
      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderLeft: `4px solid ${pretestDone ? theme.success : pretestVisible ? theme.gold : theme.borderStrong}`, borderRadius: 2, padding: 24, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${theme.border}` }}>
          <div>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.gold, fontWeight: 700, marginBottom: 4 }}>Bagian 1</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: theme.text, fontFamily: fonts.display }}>Pretest</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>Asesmen pemahaman awal sebelum sesi sosialisasi</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {pretestDone ? (
              <>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600 }}>Skor Anda</div>
                <div style={{ fontFamily: fonts.display, fontSize: 32, fontWeight: 300, color: sos.pretestScore >= 80 ? theme.success : sos.pretestScore >= 60 ? theme.warning : theme.danger }}>
                  {sos.pretestScore}<span style={{ fontSize: 14, color: theme.textSubtle }}>/100</span>
                </div>
              </>
            ) : (
              <Pill variant={pretestVisible ? 'gold' : 'default'}>
                {pretestVisible ? 'Siap diisi' : 'Belum dibuka mentor'}
              </Pill>
            )}
          </div>
        </div>

        {pretestDone ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: theme.text, padding: '8px 12px', background: theme.successBg, borderRadius: 2 }}>
            <CheckCircle2 size={14} style={{ color: theme.success }}/>
            Pretest sudah selesai. Lanjutkan ke posttest setelah dibuka oleh mentor.
          </div>
        ) : !pretestVisible ? (
          <div style={{ padding: 24, textAlign: 'center', background: theme.bg, borderRadius: 2 }}>
            <Lock size={22} style={{ color: theme.textMuted, margin: '0 auto 8px' }}/>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Pretest belum dibuka</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4, lineHeight: 1.5 }}>
              Mentor akan membuka akses pretest sebelum sesi sosialisasi dimulai.
            </div>
          </div>
        ) : (
          renderQuiz('Pretest', questionsPretest, pretestAnswers, setPretestAnswers, submitPretest, theme.gold, sos?.pretestScore)
        )}
      </div>

      {/* === SECTION POSTTEST === */}
      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderLeft: `4px solid ${posttestDone ? theme.success : posttestVisible ? theme.gold : theme.borderStrong}`, borderRadius: 2, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${theme.border}` }}>
          <div>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.gold, fontWeight: 700, marginBottom: 4 }}>Bagian 2</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: theme.text, fontFamily: fonts.display }}>Posttest</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>Asesmen setelah mengikuti sesi sosialisasi langsung</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {posttestDone ? (
              <>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600 }}>Skor Anda</div>
                <div style={{ fontFamily: fonts.display, fontSize: 32, fontWeight: 300, color: sos.posttestScore >= 80 ? theme.success : sos.posttestScore >= 60 ? theme.warning : theme.danger }}>
                  {sos.posttestScore}<span style={{ fontSize: 14, color: theme.textSubtle }}>/100</span>
                </div>
              </>
            ) : (
              <Pill variant={posttestVisible ? 'gold' : 'default'}>
                {posttestVisible ? 'Siap diisi' : 'Belum dibuka mentor'}
              </Pill>
            )}
          </div>
        </div>

        {posttestDone ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: theme.text, padding: '8px 12px', background: theme.successBg, borderRadius: 2 }}>
            <CheckCircle2 size={14} style={{ color: theme.success }}/>
            Posttest selesai. Tahap Sosialisasi complete — peningkatan skor: <strong style={{ color: theme.success }}>{sos.posttestScore - sos.pretestScore >= 0 ? '+' : ''}{sos.posttestScore - sos.pretestScore} poin</strong>
          </div>
        ) : !posttestVisible ? (
          <div style={{ padding: 24, textAlign: 'center', background: theme.bg, borderRadius: 2 }}>
            <Lock size={22} style={{ color: theme.textMuted, margin: '0 auto 8px' }}/>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Posttest belum dibuka</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4, lineHeight: 1.5, maxWidth: 380, marginLeft: 'auto', marginRight: 'auto' }}>
              Posttest akan dibuka oleh <strong style={{ color: theme.text }}>mentor</strong> setelah Anda menyelesaikan pretest dan mengikuti sesi sosialisasi langsung.
            </div>
          </div>
        ) : (
          renderQuiz('Posttest', questionsPosttest, posttestAnswers, setPosttestAnswers, submitPosttest, theme.gold, sos?.posttestScore)
        )}
      </div>
    </div>
  );
}


// =====================================================================
// MENTOR VIEWS
// =====================================================================
function MentorDashboard() {
  const { participants, currentUser, setActiveMenu, setWorkspaceParticipantId, setWorkspaceTab } = useApp();
  const myMentees = participants.filter(p => p.mentorUserId === currentUser.id);

  const today = new Date().toISOString().slice(0, 10);

  // Filter satker
  const [filterSatker, setFilterSatker] = useState('all');
  const satkerList = [...new Set(myMentees.map(p => p.satker))].sort();
  const filteredMentees = filterSatker === 'all' ? myMentees : myMentees.filter(p => p.satker === filterSatker);

  // Helper: cek apakah peserta butuh action mentor
  // Returns null kalau gak butuh, atau { label, type, onClick }
  const getActionStatus = (p) => {
    const c = p.stageData.coaching;
    const sessions = c?.sessions || [];
    const lastSession = sessions[sessions.length - 1];

    // 1. Submit evaluasi (sesi sudah lewat)
    if (c && !c.mentorEvaluation && lastSession?.status === 'accepted' && lastSession.tanggal <= today) {
      return { label: 'Input Evaluasi', type: 'gold', tab: 'coaching' };
    }
    // 2. Ajukan jadwal (no session atau last rejected)
    if (c?.status === 'in_progress' && (!lastSession || lastSession.status === 'rejected')) {
      return { label: 'Ajukan Jadwal', type: 'gold', tab: 'coaching' };
    }
    // 3. Sesi terjadwal future — info only, no action
    if (lastSession?.status === 'accepted' && lastSession.tanggal > today) {
      return { label: 'Sesi Terjadwal', type: 'info', tab: 'coaching' };
    }
    // 4. Menunggu konfirmasi peserta (proposed)
    if (lastSession?.status === 'proposed') {
      return { label: 'Menunggu Peserta', type: 'warning', tab: 'coaching' };
    }
    return null;
  };

  // Stats
  const totalNeedAction = myMentees.filter(p => {
    const s = getActionStatus(p);
    return s?.type === 'gold';
  }).length;

  const totalScheduled = myMentees.filter(p => {
    const s = getActionStatus(p);
    return s?.type === 'info';
  }).length;

  const completedMentees = myMentees.filter(p => p.stageData.coaching?.status === 'completed').length;

  const openMentee = (p, tab = 'overview') => {
    setWorkspaceTab(tab);
    setWorkspaceParticipantId(p.id);
    setActiveMenu('mentees');
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Mentor · Beranda"
        title={`Selamat datang, ${currentUser.user.split(',')[0]}`}
        desc={`${myMentees.length} mentee aktif · ${totalNeedAction} butuh tindakan Anda · ${totalScheduled} sesi terjadwal`}
        right={<Button variant="primary" icon={Users} onClick={() => setActiveMenu('mentees')}>Buka Workspace</Button>}
      />

      {/* Stats overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
        <StatCard label="Mentee Saya" value={myMentees.length} sub="aktif" accent={theme.navy}/>
        <StatCard label="Butuh Action" value={totalNeedAction} sub="perlu tindakan" accent={totalNeedAction > 0 ? theme.gold : theme.success}/>
        <StatCard label="Sesi Terjadwal" value={totalScheduled} sub="akan datang" accent={theme.info}/>
        <StatCard label="Sesi Selesai" value={completedMentees} sub={`dari ${myMentees.length} mentee`} accent={theme.success}/>
      </div>

      {/* Filter bar */}
      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, padding: '10px 14px', marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.textMuted, fontWeight: 600 }}>Filter Satker</div>
        <select value={filterSatker} onChange={e => setFilterSatker(e.target.value)}
          style={{ fontSize: 12, fontFamily: fonts.body, padding: '6px 12px', border: `1px solid ${theme.border}`, borderRadius: 2, background: '#fff', color: theme.text, cursor: 'pointer', outline: 'none', minWidth: 200 }}>
          <option value="all">Semua satker ({myMentees.length})</option>
          {satkerList.map(s => {
            const cnt = myMentees.filter(p => p.satker === s).length;
            return <option key={s} value={s}>{s} ({cnt})</option>;
          })}
        </select>
        {filterSatker !== 'all' && (
          <div style={{ fontSize: 10.5, color: theme.textMuted, marginLeft: 'auto' }}>
            Menampilkan <strong style={{ color: theme.text }}>{filteredMentees.length}</strong> dari {myMentees.length} mentee
          </div>
        )}
      </div>

      {/* Mentee table dengan kolom status */}
      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Mentee Saya</div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>Daftar peserta yang Anda dampingi · klik baris untuk membuka workspace</div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fonts.body }}>
          <thead>
            <tr style={{ background: theme.bg, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted }}>
              <th style={{ textAlign: 'left', padding: '10px 18px', fontWeight: 600 }}>Mentee</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 600 }}>Satker</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 600 }}>Tahap</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 600 }}>Progress</th>
              <th style={{ textAlign: 'center', padding: '10px 12px', fontWeight: 600 }}>Status / Action</th>
              <th style={{ textAlign: 'right', padding: '10px 18px', fontWeight: 600 }}>—</th>
            </tr>
          </thead>
          <tbody>
            {filteredMentees.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, fontSize: 11, color: theme.textMuted, fontStyle: 'italic' }}>Tidak ada mentee di satker tersebut.</td></tr>
            )}
            {filteredMentees.map(p => {
              const action = getActionStatus(p);
              return (
                <tr key={p.id} style={{ borderTop: `1px solid ${theme.border}`, fontSize: 11.5, cursor: 'pointer' }}
                  onClick={() => openMentee(p, action?.tab || 'overview')}
                  onMouseEnter={e => e.currentTarget.style.background = theme.bg}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, background: theme.navy, color: theme.gold, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0 }}>
                        {p.nama.split(' ').slice(0, 2).map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>{p.nama}</div>
                        <div style={{ fontSize: 10, color: theme.textMuted, fontFamily: fonts.mono }}>NIP {p.nip}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: 11, color: theme.text }}>
                    <div style={{ fontWeight: 500 }}>{p.satker}</div>
                    <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>{p.pangkat}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: theme.text }}>{p.stage}/7</div>
                    <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>{STAGES[p.stage-1]?.nama}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 110 }}>
                      <ProgressBar value={calcProgress(p)}/>
                      <span style={{ fontFamily: fonts.mono, fontSize: 10 }}>{calcProgress(p)}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {action ? (
                      <Pill variant={action.type === 'gold' ? 'gold' : action.type === 'info' ? 'info' : 'warning'}>
                        {action.label}
                      </Pill>
                    ) : (
                      <span style={{ fontSize: 10, color: theme.textSubtle, fontStyle: 'italic' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <ArrowRight size={14} style={{ color: theme.textMuted }}/>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =====================================================================
// PESERTA VIEWS — additional (Check-in, Coaching survey, QNA)
// =====================================================================

function PesertaRegistrasi() {
  const { participants, setParticipants, toast, addAudit, pushNotif, pesertaPersonaId } = useApp();
  const me = participants.find(p => p.id === pesertaPersonaId) || participants[0];
  const reg = me.stageData.registrasi;
  const isConfirmed = me.konfirmasiHadir === 'confirmed';

  const [nipInput, setNipInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const checkIn = () => {
    if (!nipInput.trim()) { toast('Masukkan NIP Anda', 'warning'); return; }
    if (nipInput.replace(/\s/g, '') !== me.nip) {
      toast('NIP tidak cocok dengan data peserta. Periksa kembali.', 'warning');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const now = new Date();
      const checkInAt = `${now.toISOString().slice(0,10)} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      setParticipants(prev => prev.map(p => p.id !== me.id ? p : ({
        ...p, stage: 2,
        stageData: {
          ...p.stageData,
          registrasi: { ...p.stageData.registrasi, status: 'completed', checkInAt },
          sosialisasi: { status: 'in_progress', pretestVisible: true, posttestVisible: true },
        }
      })));
      addAudit(me.nama, 'Check-in kegiatan DIKSI', null);
      pushNotif('admin', { type: 'success', title: `${me.nama} check-in`, desc: `Check-in pada ${checkInAt}` });
      toast('Check-in berhasil. Lanjut ke tahap Sosialisasi.', 'success');
      setSubmitting(false);
      setNipInput('');
    }, 600);
  };

  // Belum konfirmasi
  if (!isConfirmed) {
    return (
      <div>
        <SectionHeader eyebrow="Peserta · Check-in" title="Belum Bisa Check-in" desc="Konfirmasi kesediaan diperlukan terlebih dahulu"/>
        <div style={{ background: theme.bg, border: `1px dashed ${theme.borderStrong}`, padding: 32, textAlign: 'center', borderRadius: 2 }}>
          <Lock size={26} style={{ color: theme.textMuted, margin: '0 auto 8px' }}/>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Belum bisa check-in</div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4, lineHeight: 1.5 }}>
            Konfirmasi kesediaan Anda di menu <strong style={{ color: theme.text }}>Journey Saya</strong> terlebih dahulu.
          </div>
        </div>
      </div>
    );
  }

  // Sudah check-in
  if (reg?.status === 'completed') {
    return (
      <div>
        <SectionHeader eyebrow="Peserta · Check-in" title="Check-in Selesai" desc={`Tercatat pada ${reg.checkInAt}`}/>
        <div style={{ background: '#fff', border: `1px solid ${theme.success}`, borderLeft: `4px solid ${theme.success}`, borderRadius: 2, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{ width: 48, height: 48, background: theme.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 24 }}>
              <CheckCircle2 size={24} style={{ color: theme.success }}/>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: fonts.display, color: theme.text }}>Anda berhasil check-in</div>
              <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 3 }}>Tercatat pada {reg.checkInAt}</div>
            </div>
          </div>
          <div style={{ paddingTop: 14, borderTop: `1px solid ${theme.border}`, fontSize: 11.5, color: theme.textMuted, lineHeight: 1.6 }}>
            Selamat datang di program DIKSI. Anda sudah dapat melanjutkan ke <strong style={{ color: theme.text }}>Tahap 02 · Pretest & Posttest</strong> melalui menu sidebar.
          </div>
        </div>
      </div>
    );
  }

  // Form check-in
  return (
    <div>
      <SectionHeader
        eyebrow="Peserta · Check-in"
        title="Check-in Kegiatan DIKSI"
        desc="Konfirmasi kehadiran Anda dengan memasukkan NIP"
      />

      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 3, padding: 32, maxWidth: 480, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ width: 56, height: 56, background: theme.goldLight + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 28, margin: '0 auto 12px' }}>
            <Upload size={24} style={{ color: theme.goldDark }}/>
          </div>
          <div style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: 600, color: theme.text, marginBottom: 4 }}>Konfirmasi Kehadiran</div>
          <div style={{ fontSize: 11.5, color: theme.textMuted, lineHeight: 1.5 }}>Masukkan NIP Anda untuk memastikan kehadiran tercatat dengan benar</div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: theme.text, marginBottom: 5 }}>NIP <span style={{ color: theme.danger }}>*</span></label>
          <input
            value={nipInput}
            onChange={e => setNipInput(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="18 digit NIP"
            maxLength={18}
            disabled={submitting}
            style={{
              width: '100%', fontSize: 14, fontFamily: fonts.mono, padding: '12px 14px',
              border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none',
              boxSizing: 'border-box', letterSpacing: '0.03em',
              textAlign: 'center',
            }}
          />
          <div style={{ marginTop: 6, fontSize: 10, color: theme.textSubtle, fontFamily: fonts.mono, textAlign: 'center' }}>
            {nipInput.length}/18 digit
          </div>
        </div>

        <Button variant="primary" icon={CheckCircle2} onClick={checkIn} disabled={submitting || nipInput.length < 10}
          style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: 13 }}>
          {submitting ? 'Memproses...' : 'Check-in Sekarang'}
        </Button>

        <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${theme.border}`, fontSize: 10.5, color: theme.textMuted, display: 'flex', gap: 8, lineHeight: 1.55 }}>
          <Info size={12} style={{ flexShrink: 0, marginTop: 2 }}/>
          <div>Pastikan Anda hadir di lokasi (Auditorium A · Gedung BI Thamrin) sebelum melakukan check-in.</div>
        </div>
      </div>
    </div>
  );
}


function PesertaCoaching() {
  const { participants, setParticipants, toast, addAudit, pushNotif, pesertaPersonaId } = useApp();
  const me = participants.find(p => p.id === pesertaPersonaId) || participants[0];
  const coaching = me.stageData.coaching;
  const mentor = USERS[me.mentorUserId];

  const [effectiveness, setEffectiveness] = useState(8);
  const [quality, setQuality] = useState(8);
  const [comment, setComment] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    const survey = me.stageData.coaching?.pesertaSurvey;
    if (survey) {
      setEffectiveness(survey.mentorEffectiveness);
      setQuality(survey.sessionQuality);
      setComment(survey.comment || '');
    } else {
      setEffectiveness(8); setQuality(8); setComment('');
    }
    setShowRejectForm(false); setRejectReason('');
  }, [me.id]);

  if (!coaching || coaching.status === 'pending') {
    return (
      <div>
        <SectionHeader eyebrow="Peserta · Tahap 03 · Coaching" title="Sesi Coaching Belum Aktif" desc="Sesi 1-on-1 coaching akan tersedia setelah Sosialisasi (pretest & posttest) selesai"/>
        <div style={{ background: '#fff', border: `1px dashed ${theme.borderStrong}`, padding: 32, textAlign: 'center', borderRadius: 2 }}>
          <Clock size={28} style={{ color: theme.textMuted, margin: '0 auto 10px' }}/>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Menunggu Tahap Sosialisasi selesai</div>
        </div>
      </div>
    );
  }

  const sessions = coaching.sessions || [];
  const activeSession = sessions[sessions.length - 1]; // sesi terakhir
  const today = new Date().toISOString().slice(0, 10);

  // Cek status sesi
  const isProposed   = activeSession?.status === 'proposed';
  const isAccepted   = activeSession?.status === 'accepted';
  const isRejected   = activeSession?.status === 'rejected';
  const isCompleted  = activeSession?.status === 'completed';
  const sessionDatePassed = activeSession && activeSession.tanggal <= today;
  // Survey form unlocked: sesi accepted & tanggal sudah lewat (otomatis dianggap completed) ATAU status sudah completed
  const surveyUnlocked = (isAccepted && sessionDatePassed) || isCompleted;

  const surveyDone = !!coaching.pesertaSurvey;
  const mentorDone = !!coaching.mentorEvaluation;

  const fmtTanggal = (s) => s ? new Date(s).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-';
  const fmtTanggalShort = (s) => s ? new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

  // Hitung hari lagi sampai sesi
  const daysUntil = activeSession ? Math.ceil((new Date(activeSession.tanggal) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  const acceptSession = () => {
    const teamsLink = `https://teams.microsoft.com/l/meetup-join/meet-${activeSession.id}-${Date.now().toString(36)}`;
    setParticipants(prev => prev.map(p => p.id !== me.id ? p : ({
      ...p,
      stageData: {
        ...p.stageData,
        coaching: {
          ...p.stageData.coaching,
          sessions: p.stageData.coaching.sessions.map(s =>
            s.id === activeSession.id ? { ...s, status: 'accepted', acceptedAt: new Date().toISOString().slice(0, 10), teamsLink } : s
          ),
        },
      }
    })));
    addAudit(me.nama, `Menyetujui jadwal sesi coaching · ${fmtTanggalShort(activeSession.tanggal)}`, null);
    pushNotif('mentor', { type: 'success', title: `${me.nama} menyetujui jadwal coaching`, desc: `${fmtTanggalShort(activeSession.tanggal)} ${activeSession.waktu} · Teams meeting otomatis dibuat` });
    pushNotif('admin', { type: 'info', title: `Jadwal coaching dikonfirmasi`, desc: `${me.nama} & ${mentor?.user.split(',')[0]} · ${fmtTanggalShort(activeSession.tanggal)}` });
    toast('Jadwal disetujui. Calendar Teams meeting otomatis dibuat.', 'success');
  };

  const rejectSession = () => {
    if (!rejectReason.trim()) { toast('Mohon isi alasan/usulan jadwal alternatif', 'warning'); return; }
    setParticipants(prev => prev.map(p => p.id !== me.id ? p : ({
      ...p,
      stageData: {
        ...p.stageData,
        coaching: {
          ...p.stageData.coaching,
          sessions: p.stageData.coaching.sessions.map(s =>
            s.id === activeSession.id ? { ...s, status: 'rejected', rejectedAt: new Date().toISOString().slice(0, 10), rejectReason } : s
          ),
        },
      }
    })));
    addAudit(me.nama, `Menolak jadwal sesi coaching`, null);
    pushNotif('mentor', { type: 'warning', title: `${me.nama} menolak jadwal coaching`, desc: rejectReason.slice(0, 80) });
    toast('Penolakan dikirim ke mentor untuk reschedule.', 'info');
    setShowRejectForm(false); setRejectReason('');
  };

  const submitSurvey = () => {
    if (!comment.trim()) { toast('Mohon isi komentar Anda', 'warning'); return; }
    setParticipants(prev => prev.map(p => p.id !== me.id ? p : ({
      ...p,
      stageData: {
        ...p.stageData,
        coaching: {
          ...p.stageData.coaching,
          pesertaSurvey: { mentorEffectiveness: effectiveness, sessionQuality: quality, comment, submittedAt: new Date().toISOString().slice(0,10) },
          status: p.stageData.coaching.mentorEvaluation ? 'completed' : 'in_progress',
          // Mark active session as completed
          sessions: p.stageData.coaching.sessions.map(s =>
            s.id === activeSession.id && s.status !== 'completed' ? { ...s, status: 'completed', completedAt: new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5) } : s
          ),
        },
      }
    })));
    addAudit(me.nama, 'Submit survey peserta untuk sesi coaching', null);
    pushNotif('mentor', { type: 'info', title: `${me.nama} submit survey coaching`, desc: `Skor mentor: ${effectiveness}/10 · Skor sesi: ${quality}/10` });
    toast('Survey Anda tersimpan. Terima kasih atas feedback-nya!', 'success');
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Peserta · Tahap 03 · Coaching"
        title="Sesi 1-on-1 Coaching"
        desc="Sesi pendampingan personal antara Anda dan mentor (atasan langsung)"
      />

      {/* Mentor Card prominent */}
      {mentor && (
        <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderLeft: `4px solid ${theme.gold}`, borderRadius: 2, padding: 18, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: theme.navy, color: theme.gold,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, fontFamily: fonts.display, flexShrink: 0,
          }}>
            {mentor.user.split(' ').slice(0, 2).map(n => n[0]).join('').replace(/[^A-Z]/g, '').slice(0, 2)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.gold, fontWeight: 700, marginBottom: 4 }}>Mentor Anda · Atasan Langsung</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, fontFamily: fonts.display, marginBottom: 2 }}>{mentor.user}</div>
            <div style={{ fontSize: 11, color: theme.textMuted }}>{mentor.jabatan} · {mentor.satker}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600, marginBottom: 4 }}>NIP</div>
            <div style={{ fontFamily: fonts.mono, fontSize: 11, color: theme.text }}>{mentor.nip}</div>
          </div>
        </div>
      )}

      {/* === STEP 1: Penjadwalan === */}
      {!activeSession && (
        <div style={{ background: '#fff', border: `1px dashed ${theme.borderStrong}`, padding: 32, textAlign: 'center', borderRadius: 2 }}>
          <Clock size={28} style={{ color: theme.textMuted, margin: '0 auto 10px' }}/>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Menunggu jadwal dari mentor</div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 6, lineHeight: 1.5 }}>
            Mentor akan mengajukan jadwal sesi coaching dalam waktu dekat. Anda akan menerima notifikasi.
          </div>
        </div>
      )}

      {/* Proposal session — peserta belum response */}
      {isProposed && (
        <div style={{ background: '#fff', border: `2px solid ${theme.gold}`, borderRadius: 3, marginBottom: 14, overflow: 'hidden' }}>
          <div style={{ background: theme.goldLight + '25', padding: '12px 18px', borderBottom: `1px solid ${theme.gold}40`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calendar size={16} style={{ color: theme.goldDark }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.goldDark, fontWeight: 700 }}>Tindakan Diperlukan</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginTop: 2 }}>Mentor Mengajukan Jadwal Coaching</div>
            </div>
          </div>

          <div style={{ padding: 22 }}>
            {/* Schedule details grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600, marginBottom: 4 }}>Tanggal</div>
                <div style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: 600, color: theme.text }}>{fmtTanggal(activeSession.tanggal)}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600, marginBottom: 4 }}>Waktu & Durasi</div>
                <div style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: 600, color: theme.text }}>{activeSession.waktu} WIB · {activeSession.durasi} menit</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600, marginBottom: 4 }}>Lokasi</div>
                <div style={{ fontSize: 12.5, color: theme.text, fontWeight: 500 }}>{activeSession.lokasi}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600, marginBottom: 4 }}>Topik Pembahasan</div>
                <div style={{ fontSize: 12.5, color: theme.text, fontWeight: 500 }}>{activeSession.topik}</div>
              </div>
              {activeSession.notes && (
                <div style={{ gridColumn: 'span 2', padding: 10, background: theme.bg, borderRadius: 2 }}>
                  <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600, marginBottom: 4 }}>Catatan dari Mentor</div>
                  <div style={{ fontSize: 11.5, color: theme.text, lineHeight: 1.5, fontStyle: 'italic' }}>"{activeSession.notes}"</div>
                </div>
              )}
            </div>

            {/* Auto-create info */}
            <div style={{ background: theme.infoBg, border: '1px solid #BFDBFE', padding: 10, borderRadius: 2, fontSize: 11, color: theme.info, display: 'flex', gap: 8, marginBottom: 14 }}>
              <Info size={13} style={{ flexShrink: 0, marginTop: 1 }}/>
              <div>Jika Anda menyetujui, sistem akan <strong>otomatis membuat Microsoft Teams meeting</strong> dan menambahkannya ke calendar Anda dan mentor.</div>
            </div>

            {/* Actions */}
            {!showRejectForm ? (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => setShowRejectForm(true)}>Tidak Bisa, Ajukan Reschedule</Button>
                <Button variant="primary" icon={CheckCircle2} onClick={acceptSession}>Setujui Jadwal</Button>
              </div>
            ) : (
              <div style={{ paddingTop: 14, borderTop: `1px solid ${theme.border}` }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: theme.text, marginBottom: 5 }}>Alasan / Usulan jadwal alternatif <span style={{ color: theme.danger }}>*</span></label>
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3}
                  placeholder="Mis. Bentrok dengan rapat ALCO. Bisa di-reschedule ke tanggal X jam Y?"
                  style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', resize: 'none', boxSizing: 'border-box' }}/>
                <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <Button variant="ghost" onClick={() => { setShowRejectForm(false); setRejectReason(''); }}>Batal</Button>
                  <Button variant="secondary" onClick={rejectSession}>Kirim ke Mentor</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rejected — wait for new proposal */}
      {isRejected && (
        <div style={{ background: '#fff', border: `1px solid ${theme.warning}`, borderLeft: `4px solid ${theme.warning}`, borderRadius: 2, padding: 18, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <X size={16} style={{ color: theme.warning }}/>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Jadwal sebelumnya ditolak — menunggu mentor mengajukan ulang</div>
          </div>
          {activeSession.rejectReason && (
            <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.5, marginTop: 4, fontStyle: 'italic' }}>
              Alasan Anda: "{activeSession.rejectReason}"
            </div>
          )}
        </div>
      )}

      {/* === STEP 2: Calendar entry (accepted, sebelum/saat sesi) === */}
      {isAccepted && (
        <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, marginBottom: 14, overflow: 'hidden' }}>
          <div style={{ background: theme.success, color: '#fff', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 size={15}/>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Jadwal Dikonfirmasi · Calendar Tersinkronisasi</div>
            {!sessionDatePassed && daysUntil != null && (
              <div style={{ marginLeft: 'auto', fontSize: 11, fontFamily: fonts.mono }}>
                {daysUntil === 0 ? 'Hari ini' : daysUntil === 1 ? 'Besok' : `${daysUntil} hari lagi`}
              </div>
            )}
          </div>
          <div style={{ padding: 22 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600, marginBottom: 4 }}>Tanggal</div>
                <div style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: 600, color: theme.text }}>{fmtTanggal(activeSession.tanggal)}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600, marginBottom: 4 }}>Waktu</div>
                <div style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: 600, color: theme.text }}>{activeSession.waktu} WIB · {activeSession.durasi} menit</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600, marginBottom: 4 }}>Lokasi</div>
                <div style={{ fontSize: 12.5, color: theme.text, fontWeight: 500 }}>{activeSession.lokasi}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600, marginBottom: 4 }}>Topik</div>
                <div style={{ fontSize: 12.5, color: theme.text, fontWeight: 500 }}>{activeSession.topik}</div>
              </div>
            </div>

            {activeSession.teamsLink && (
              <div style={{ paddingTop: 14, borderTop: `1px solid ${theme.border}` }}>
                <a href={activeSession.teamsLink} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#5059C9', color: '#fff', borderRadius: 2, textDecoration: 'none', fontSize: 12, fontWeight: 600, fontFamily: fonts.body }}>
                  <PlayCircle size={14}/> Buka Microsoft Teams Meeting
                </a>
                <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 6, fontFamily: fonts.mono, wordBreak: 'break-all' }}>{activeSession.teamsLink}</div>
              </div>
            )}

            {!sessionDatePassed && (
              <div style={{ marginTop: 14, padding: 10, background: theme.infoBg, border: '1px solid #BFDBFE', borderRadius: 2, fontSize: 11, color: theme.info, display: 'flex', gap: 8 }}>
                <Info size={13} style={{ flexShrink: 0, marginTop: 1 }}/>
                <div>Form survey peserta akan otomatis terbuka setelah sesi coaching berlangsung pada tanggal di atas.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* === STEP 3: Survey form (after session passed) === */}
      {surveyUnlocked && (
        <>
          {/* Status panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderLeft: `3px solid ${mentorDone ? theme.success : theme.warning}`, padding: 16, borderRadius: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: theme.text }}>Evaluasi Mentor</div>
                <Pill variant={mentorDone ? 'success' : 'warning'}>{mentorDone ? 'Selesai' : 'Menunggu'}</Pill>
              </div>
              <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.5 }}>
                {mentorDone
                  ? `${mentor?.user.split(',')[0]} sudah memberikan evaluasi. Lihat di bagian "Hasil Evaluasi Mentor" di bawah.`
                  : `Menunggu mentor menginput hasil evaluasi sesi coaching.`}
              </div>
            </div>
            <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderLeft: `3px solid ${surveyDone ? theme.success : theme.warning}`, padding: 16, borderRadius: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: theme.text }}>Survey Peserta</div>
                <Pill variant={surveyDone ? 'success' : 'warning'}>{surveyDone ? 'Selesai' : 'Wajib Diisi'}</Pill>
              </div>
              <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.5 }}>
                {surveyDone ? 'Anda sudah submit survey. Terima kasih.' : 'Berikan feedback Anda terhadap mentor & kualitas sesi.'}
              </div>
            </div>
          </div>

          {/* Hasil evaluasi mentor */}
          {mentorDone && (
            <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, padding: 18, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, fontFamily: fonts.display, marginBottom: 10 }}>Hasil Evaluasi dari Mentor</div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: theme.textSubtle, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Kekuatan</div>
                <div style={{ fontSize: 12, color: theme.text, lineHeight: 1.5 }}>{coaching.mentorEvaluation.strengths}</div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: theme.textSubtle, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Area Pengembangan</div>
                <div style={{ fontSize: 12, color: theme.text, lineHeight: 1.5 }}>{coaching.mentorEvaluation.development}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: theme.textSubtle, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Rekomendasi</div>
                <div style={{ fontSize: 12, color: theme.text, lineHeight: 1.5 }}>{coaching.mentorEvaluation.recommendation}</div>
              </div>
            </div>
          )}

          {/* Survey peserta */}
          <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, fontFamily: fonts.display, marginBottom: 4 }}>Survey Hasil Sesi Coaching</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 18 }}>
              Sesi pada {fmtTanggalShort(activeSession.tanggal)} sudah berlangsung. Berikan penilaian jujur — feedback Anda membantu peningkatan kualitas program.
            </div>

            {[
              { key: 'effectiveness', label: 'Efektivitas Mentor', desc: 'Seberapa membantu mentor dalam memberikan insight & arahan?', value: effectiveness, set: setEffectiveness },
              { key: 'quality', label: 'Kualitas Sesi Coaching', desc: 'Seberapa baik kualitas sesi 1-on-1 yang dilaksanakan?', value: quality, set: setQuality },
            ].map(q => (
              <div key={q.key} style={{ marginBottom: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 600 }}>{q.label}</label>
                  <span style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 300, color: theme.navy }}>{q.value}<span style={{ fontSize: 11, color: theme.textSubtle }}>/10</span></span>
                </div>
                <p style={{ fontSize: 11, color: theme.textMuted, margin: '0 0 10px' }}>{q.desc}</p>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button key={n} onClick={() => !surveyDone && q.set(n)} disabled={surveyDone}
                      style={{
                        flex: 1, height: 32, fontSize: 11, fontFamily: fonts.mono, fontWeight: 600,
                        background: n <= q.value ? (n >= 8 ? theme.success : n >= 5 ? theme.gold : theme.warning) : '#F1F3F6',
                        color: n <= q.value ? '#fff' : theme.textSubtle,
                        border: 'none', borderRadius: 2, cursor: surveyDone ? 'default' : 'pointer',
                      }}>{n}</button>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Komentar</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4} disabled={surveyDone}
                placeholder="Bagikan pengalaman Anda dalam sesi ini..."
                style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', resize: 'none', boxSizing: 'border-box', background: surveyDone ? theme.bg : '#fff' }}/>
            </div>

            {!surveyDone && (
              <div style={{ paddingTop: 14, borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="primary" icon={Send} onClick={submitSurvey}>Submit Survey</Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function PesertaQNA() {
  const { qnaThreads, setQnaThreads, participants, pesertaPersonaId, toast, addAudit, pushNotif } = useApp();
  const me = participants.find(p => p.id === pesertaPersonaId) || participants[0];

  const [draft, setDraft] = useState({ subject: '', body: '' });
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [reply, setReply] = useState('');

  // Filter thread milik peserta ini
  const myThreads = qnaThreads
    .filter(t => t.pesertaId === me.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const activeThread = myThreads.find(t => t.id === activeThreadId);

  const submitNew = () => {
    if (!draft.subject.trim() || !draft.body.trim()) { toast('Subject dan pertanyaan wajib diisi', 'warning'); return; }
    const now = new Date();
    const at = `${now.toISOString().slice(0,10)} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const newThread = {
      id: 'QT' + Date.now(),
      pesertaId: me.id,
      subject: draft.subject,
      createdAt: at.slice(0, 10),
      updatedAt: at.slice(0, 10),
      status: 'pending',
      adminUnread: true,
      messages: [{ id: 'm' + Date.now(), from: 'peserta', author: me.nama, body: draft.body, at }],
    };
    setQnaThreads(prev => [newThread, ...prev]);
    addAudit(me.nama, `Mengajukan QNA: ${draft.subject}`, null);
    pushNotif('admin', { type: 'info', title: `QNA baru dari ${me.nama.split(' ').slice(0,2).join(' ')}`, desc: draft.subject });
    toast('Pertanyaan terkirim ke Admin DSDM.', 'success');
    setDraft({ subject: '', body: '' });
    setActiveThreadId(newThread.id);
  };

  const sendReply = () => {
    if (!reply.trim()) { toast('Tulis pesan terlebih dahulu', 'warning'); return; }
    const now = new Date();
    const at = `${now.toISOString().slice(0,10)} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const newMsg = { id: 'm' + Date.now(), from: 'peserta', author: me.nama, body: reply, at };
    setQnaThreads(prev => prev.map(t => t.id !== activeThread.id ? t : ({
      ...t,
      messages: [...t.messages, newMsg],
      status: 'pending',
      adminUnread: true,
      updatedAt: at.slice(0,10),
    })));
    addAudit(me.nama, `Membalas QNA: ${activeThread.subject}`, null);
    pushNotif('admin', { type: 'info', title: `Lanjutan QNA dari ${me.nama.split(' ').slice(0,2).join(' ')}`, desc: activeThread.subject });
    toast('Pesan terkirim.', 'success');
    setReply('');
  };

  const totalPending = myThreads.filter(t => t.status === 'pending').length;
  const totalAnswered = myThreads.length - totalPending;

  return (
    <div>
      <SectionHeader
        eyebrow="Peserta · QNA"
        title="QNA dengan Admin DSDM"
        desc={`${myThreads.length} pertanyaan · ${totalAnswered} dijawab · ${totalPending} menunggu balasan`}
      />

      {/* New question composer */}
      {!activeThread && (
        <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, padding: 18, marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, fontFamily: fonts.display }}>Pertanyaan Baru</div>
          <input value={draft.subject} onChange={e => setDraft({ ...draft, subject: e.target.value })}
            placeholder="Subject (mis. Jadwal sesi, Akomodasi, Materi)"
            style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, marginBottom: 10, outline: 'none', boxSizing: 'border-box' }}/>
          <textarea value={draft.body} onChange={e => setDraft({ ...draft, body: e.target.value })} rows={4}
            placeholder="Tulis pertanyaan Anda di sini..."
            style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', resize: 'none', boxSizing: 'border-box' }}/>
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" icon={Send} onClick={submitNew}>Kirim ke Admin</Button>
          </div>
        </div>
      )}

      {/* Thread detail view */}
      {activeThread && (
        <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, marginBottom: 18, overflow: 'hidden' }}>
          {/* Back + subject */}
          <div style={{ padding: '12px 18px', borderBottom: `1px solid ${theme.border}`, background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => setActiveThreadId(null)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: theme.textMuted, fontFamily: fonts.body, padding: 0 }}>
              <ArrowLeft size={12}/> Kembali ke daftar
            </button>
            <Pill variant={activeThread.status === 'pending' ? 'warning' : 'success'}>
              {activeThread.status === 'pending' ? 'Menunggu admin' : 'Dijawab'}
            </Pill>
          </div>
          <div style={{ padding: '12px 18px', borderBottom: `1px solid ${theme.border}` }}>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600, marginBottom: 3 }}>Subject</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, fontFamily: fonts.display }}>{activeThread.subject}</div>
          </div>

          {/* Messages */}
          <div style={{ padding: 20, background: '#FAFBFC', maxHeight: 420, overflowY: 'auto' }}>
            {activeThread.messages.map(msg => {
              const isMe = msg.from === 'peserta';
              return (
                <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 14 }}>
                  <div style={{ maxWidth: '78%' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 3, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: isMe ? theme.text : theme.navy }}>
                        {isMe ? 'Anda' : `${msg.author.split(',')[0]} · Admin`}
                      </span>
                      <span style={{ fontSize: 9.5, color: theme.textSubtle, fontFamily: fonts.mono }}>{msg.at}</span>
                    </div>
                    <div style={{
                      padding: '10px 14px',
                      background: isMe ? theme.gold : '#fff',
                      color: isMe ? theme.navy : theme.text,
                      border: isMe ? 'none' : `1px solid ${theme.border}`,
                      borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      fontSize: 12, lineHeight: 1.55, whiteSpace: 'pre-wrap',
                      boxShadow: isMe ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
                    }}>
                      {msg.body}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply composer */}
          <div style={{ borderTop: `1px solid ${theme.border}`, padding: 14, background: '#fff' }}>
            <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3}
              placeholder={activeThread.status === 'answered' ? 'Lanjutkan diskusi...' : 'Tambah info atau klarifikasi...'}
              onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') sendReply(); }}
              style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.5 }}/>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 10, color: theme.textMuted, fontStyle: 'italic' }}>
                Cmd/Ctrl + Enter untuk kirim
              </div>
              <Button variant="primary" icon={Send} onClick={sendReply} disabled={!reply.trim()}>Kirim</Button>
            </div>
          </div>
        </div>
      )}

      {/* Thread list */}
      {!activeThread && (
        <>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.textMuted, fontWeight: 600, marginBottom: 10 }}>
            Riwayat Pertanyaan Anda ({myThreads.length})
          </div>
          {myThreads.length === 0 ? (
            <div style={{ background: '#fff', border: `1px dashed ${theme.borderStrong}`, padding: 32, textAlign: 'center', borderRadius: 2, fontSize: 11.5, color: theme.textMuted }}>
              <MessageSquare size={28} style={{ color: theme.borderStrong, margin: '0 auto 8px' }}/>
              <div>Belum ada pertanyaan. Silakan ajukan pertanyaan baru di atas.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myThreads.map(t => {
                const lastMsg = t.messages[t.messages.length - 1];
                const lastFromAdmin = lastMsg?.from === 'admin';
                const adminReplied = t.messages.some(m => m.from === 'admin');
                return (
                  <button key={t.id} onClick={() => setActiveThreadId(t.id)}
                    style={{ background: '#fff', border: `1px solid ${theme.border}`, borderLeft: lastFromAdmin && t.status === 'answered' ? `3px solid ${theme.success}` : `3px solid ${theme.warning}`, borderRadius: 2, padding: 14, cursor: 'pointer', textAlign: 'left', fontFamily: fonts.body, transition: 'all 0.1s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = theme.gold; e.currentTarget.style.borderLeftColor = theme.gold; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.borderLeftColor = lastFromAdmin && t.status === 'answered' ? theme.success : theme.warning; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>{t.subject}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 10, color: theme.textSubtle, fontFamily: fonts.mono }}>{t.updatedAt}</span>
                        <Pill variant={t.status === 'answered' ? 'success' : 'warning'}>{t.status === 'answered' ? 'Dijawab' : 'Menunggu'}</Pill>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: theme.textMuted, lineHeight: 1.5 }}>
                      <span style={{ fontSize: 9.5, color: lastFromAdmin ? theme.success : theme.gold, fontWeight: 600, flexShrink: 0 }}>
                        {lastFromAdmin ? '↙ Admin:' : '↗ Anda:'}
                      </span>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lastMsg?.body || ''}</span>
                    </div>
                    <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center', fontSize: 9.5, color: theme.textSubtle, fontFamily: fonts.mono }}>
                      <span>{t.messages.length} pesan</span>
                      <span>·</span>
                      <span>dibuka {t.createdAt}</span>
                      {!adminReplied && <>
                        <span style={{ marginLeft: 'auto', color: theme.warning, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 9 }}>Belum dibalas</span>
                      </>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// =====================================================================
// PESERTA: MONITORING (3 tab dengan progressive unlock)
// Tab Mon1 unlocked setelah Coaching selesai · Mon2 setelah Mon1 · Mon3 setelah Mon2
// =====================================================================
function PesertaMonitoring() {
  const { participants, setParticipants, pesertaPersonaId, toast, addAudit, pushNotif } = useApp();
  const me = participants.find(p => p.id === pesertaPersonaId) || participants[0];

  const m1Status = me.stageData.monitoring1?.status || 'pending';
  const m2Status = me.stageData.monitoring2?.status || 'pending';
  const m3Status = me.stageData.monitoring3?.status || 'pending';

  const tab1Locked = me.stageData.coaching?.status !== 'completed';
  const tab2Locked = m1Status !== 'completed';
  const tab3Locked = m2Status !== 'completed';

  const [activeTab, setActiveTab] = useState('mon1');

  const tabs = [
    { id: 'mon1', label: 'Monitoring 1', stage: 4, locked: tab1Locked, status: m1Status, prereq: 'Sesi Coaching' },
    { id: 'mon2', label: 'Monitoring 2', stage: 5, locked: tab2Locked, status: m2Status, prereq: 'Monitoring 1' },
    { id: 'mon3', label: 'Monitoring 3', stage: 6, locked: tab3Locked, status: m3Status, prereq: 'Monitoring 2' },
  ];

  const renderLocked = (tab) => (
    <div style={{ background: theme.bg, border: `1px dashed ${theme.borderStrong}`, padding: 32, textAlign: 'center', borderRadius: 2 }}>
      <Lock size={28} style={{ color: theme.textMuted, margin: '0 auto 10px' }}/>
      <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Tahap belum tersedia</div>
      <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 6, lineHeight: 1.5, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
        {tab.label} akan terbuka setelah <strong style={{ color: theme.text }}>{tab.prereq}</strong> selesai.
      </div>
    </div>
  );

  return (
    <div>
      <SectionHeader
        eyebrow="Peserta · Tahap 04-06 · Monitoring"
        title="Monitoring Berkala"
        desc="3 sesi monitoring untuk menilai progress dan tindak lanjut development plan Anda"
      />

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${theme.border}`, marginBottom: 16 }}>
        {tabs.map(t => {
          const isActive = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{
                background: 'transparent', border: 'none', padding: '10px 18px',
                fontFamily: fonts.body, fontSize: 12, fontWeight: isActive ? 600 : 500,
                color: t.locked ? theme.textSubtle : isActive ? theme.text : theme.textMuted,
                borderBottom: isActive ? `2px solid ${theme.gold}` : '2px solid transparent',
                marginBottom: -1, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                opacity: t.locked ? 0.7 : 1,
              }}>
              {t.locked && <Lock size={11}/>}
              {t.label}
              {t.status === 'completed' && <CheckCircle2 size={12} style={{ color: theme.success }}/>}
              {t.status === 'in_progress' && <div style={{ width: 6, height: 6, borderRadius: 3, background: theme.gold }}/>}
            </button>
          );
        })}
      </div>

      {activeTab === 'mon1' && (tab1Locked ? renderLocked(tabs[0]) : <Mon1Form me={me} setParticipants={setParticipants} toast={toast} addAudit={addAudit} pushNotif={pushNotif}/>)}
      {activeTab === 'mon2' && (tab2Locked ? renderLocked(tabs[1]) : <Mon2Form me={me} setParticipants={setParticipants} toast={toast} addAudit={addAudit} pushNotif={pushNotif}/>)}
      {activeTab === 'mon3' && (tab3Locked ? renderLocked(tabs[2]) : <Mon3Form me={me} setParticipants={setParticipants} toast={toast} addAudit={addAudit} pushNotif={pushNotif}/>)}
    </div>
  );
}

// ----- Monitoring 1 form -----
function Mon1Form({ me, setParticipants, toast, addAudit, pushNotif }) {
  const existing = me.stageData.monitoring1?.status === 'completed' ? me.stageData.monitoring1 : null;
  const [form, setForm] = useState({
    tindakLanjut: existing?.tindakLanjut || '',
    kendala: existing?.kendala || '',
    dukungan: existing?.dukungan || '',
    pelatihan: existing?.pelatihan || '',
    sertifikasi: existing?.sertifikasi || '',
    kepanitiaan: existing?.kepanitiaan || '',
    lainnya: existing?.lainnya || '',
  });

  useEffect(() => {
    const e = me.stageData.monitoring1?.status === 'completed' ? me.stageData.monitoring1 : null;
    setForm({
      tindakLanjut: e?.tindakLanjut || '', kendala: e?.kendala || '', dukungan: e?.dukungan || '',
      pelatihan: e?.pelatihan || '', sertifikasi: e?.sertifikasi || '',
      kepanitiaan: e?.kepanitiaan || '', lainnya: e?.lainnya || '',
    });
  }, [me.id]);

  const submit = () => {
    if (!form.tindakLanjut.trim() || !form.kendala.trim() || !form.dukungan.trim()) {
      toast('Mohon lengkapi 3 pertanyaan utama (tindak lanjut, kendala, dukungan)', 'warning'); return;
    }
    setParticipants(prev => prev.map(p => p.id !== me.id ? p : ({
      ...p, stage: Math.max(p.stage, 5),
      stageData: {
        ...p.stageData,
        monitoring1: { status: 'completed', submittedAt: new Date().toISOString().slice(0,10), ...form },
      }
    })));
    addAudit(me.nama, 'Submit form Monitoring 1', null);
    pushNotif('mentor', { type: 'info', title: `${me.nama} submit Monitoring 1`, desc: 'Update progress tindak lanjut development plan' });
    pushNotif('admin', { type: 'info', title: `${me.nama} masuk Tahap 5`, desc: 'Monitoring 1 selesai · lanjut Monitoring 2' });
    toast('Monitoring 1 tersimpan. Lanjut ke Monitoring 2.', 'success');
  };

  const isReadOnly = !!existing;

  return (
    <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderLeft: `4px solid ${existing ? theme.success : theme.gold}`, borderRadius: 2, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${theme.border}` }}>
        <div>
          <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.gold, fontWeight: 700 }}>Tahap 04</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: theme.text, fontFamily: fonts.display, marginTop: 2 }}>Monitoring 1 · Tindak Lanjut Awal</div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 3 }}>Update progress development plan setelah sesi coaching</div>
        </div>
        {existing && <Pill variant="success">Selesai · {existing.submittedAt}</Pill>}
      </div>

      {/* Pertanyaan utama (3) */}
      {[
        { key: 'tindakLanjut', label: 'Tindak Lanjut yang Sudah Dilakukan', desc: 'Terkait tindak lanjut rencana pengembangan individu setelah sesi DIKSI, hal apa yang sudah Anda lakukan?', required: true, rows: 4 },
        { key: 'kendala', label: 'Kendala yang Dihadapi', desc: 'Apa kendala yang dihadapi terkait tindak lanjut rencana pengembangan Bapak/Ibu?', required: true, rows: 3 },
        { key: 'dukungan', label: 'Dukungan yang Dibutuhkan', desc: 'Dukungan dan support seperti apa yang dibutuhkan terkait tindak lanjut rencana pengembangan Bapak/Ibu?', required: true, rows: 3 },
      ].map(f => (
        <div key={f.key} style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme.text, marginBottom: 3 }}>
            {f.label} {f.required && <span style={{ color: theme.danger }}>*</span>}
          </label>
          <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.5, marginBottom: 8 }}>{f.desc}</div>
          <textarea value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} rows={f.rows} disabled={isReadOnly}
            style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', resize: 'none', boxSizing: 'border-box', background: isReadOnly ? theme.bg : '#fff', lineHeight: 1.55 }}/>
        </div>
      ))}

      {/* Tindak lanjut spesifik (4) */}
      <div style={{ paddingTop: 14, borderTop: `1px solid ${theme.border}` }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.textMuted, fontWeight: 600, marginBottom: 12 }}>Detail Tindak Lanjut</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { key: 'pelatihan', label: 'Pelatihan / IHT', placeholder: 'Mis. Strategic Decision-Making Workshop · Q2 2026' },
            { key: 'sertifikasi', label: 'Sertifikasi', placeholder: 'Mis. CFA Level 3 · sedang persiapan' },
            { key: 'kepanitiaan', label: 'Kepanitiaan', placeholder: 'Mis. Anggota Tim Penyusun Kebijakan...' },
            { key: 'lainnya', label: 'Lainnya', placeholder: 'Aktivitas tindak lanjut lainnya' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{f.label}</label>
              <textarea value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} rows={2} disabled={isReadOnly}
                placeholder={f.placeholder}
                style={{ width: '100%', fontSize: 11.5, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', resize: 'none', boxSizing: 'border-box', background: isReadOnly ? theme.bg : '#fff', lineHeight: 1.5 }}/>
            </div>
          ))}
        </div>
      </div>

      {!isReadOnly && (
        <div style={{ paddingTop: 16, marginTop: 16, borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" icon={Send} onClick={submit}>Submit Monitoring 1</Button>
        </div>
      )}
    </div>
  );
}

// ----- Monitoring 2 form -----
function Mon2Form({ me, setParticipants, toast, addAudit, pushNotif }) {
  const existing = me.stageData.monitoring2?.status === 'completed' ? me.stageData.monitoring2 : null;
  const [form, setForm] = useState({
    manfaat: existing?.manfaat || 8,
    bertumbuh: existing?.bertumbuh || 8,
    rekomendasi: existing?.rekomendasi || 8,
    saran: existing?.saran || '',
    bersedia_fasilitator: existing?.bersedia_fasilitator || '',
    bersedia_pembekalan: existing?.bersedia_pembekalan || '',
  });

  useEffect(() => {
    const e = me.stageData.monitoring2?.status === 'completed' ? me.stageData.monitoring2 : null;
    setForm({
      manfaat: e?.manfaat || 8, bertumbuh: e?.bertumbuh || 8, rekomendasi: e?.rekomendasi || 8,
      saran: e?.saran || '', bersedia_fasilitator: e?.bersedia_fasilitator || '', bersedia_pembekalan: e?.bersedia_pembekalan || '',
    });
  }, [me.id]);

  const submit = () => {
    if (!form.saran.trim() || !form.bersedia_fasilitator || !form.bersedia_pembekalan) {
      toast('Mohon lengkapi semua field', 'warning'); return;
    }
    setParticipants(prev => prev.map(p => p.id !== me.id ? p : ({
      ...p, stage: Math.max(p.stage, 6),
      stageData: {
        ...p.stageData,
        monitoring2: { status: 'completed', submittedAt: new Date().toISOString().slice(0,10), ...form },
      }
    })));
    addAudit(me.nama, 'Submit form Monitoring 2', null);
    pushNotif('admin', { type: 'info', title: `${me.nama} masuk Tahap 6`, desc: 'Monitoring 2 selesai · lanjut Monitoring 3' });
    toast('Monitoring 2 tersimpan. Lanjut ke Monitoring 3.', 'success');
  };

  const isReadOnly = !!existing;

  const likertField = (key, label, desc) => (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>{label}</label>
        <span style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 300, color: theme.navy }}>{form[key]}<span style={{ fontSize: 11, color: theme.textSubtle }}>/10</span></span>
      </div>
      <p style={{ fontSize: 11, color: theme.textMuted, margin: '0 0 10px', lineHeight: 1.5 }}>{desc}</p>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <button key={n} onClick={() => !isReadOnly && setForm({ ...form, [key]: n })} disabled={isReadOnly}
            style={{
              flex: 1, height: 32, fontSize: 11, fontFamily: fonts.mono, fontWeight: 600,
              background: n <= form[key] ? (n >= 8 ? theme.success : n >= 5 ? theme.gold : theme.warning) : '#F1F3F6',
              color: n <= form[key] ? '#fff' : theme.textSubtle,
              border: 'none', borderRadius: 2, cursor: isReadOnly ? 'default' : 'pointer',
            }}>{n}</button>
        ))}
      </div>
    </div>
  );

  const yesnoField = (key, label, desc) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme.text, marginBottom: 3 }}>{label} <span style={{ color: theme.danger }}>*</span></label>
      <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.5, marginBottom: 8 }}>{desc}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {['Ya', 'Belum bisa memutuskan', 'Tidak'].map(opt => (
          <button key={opt} onClick={() => !isReadOnly && setForm({ ...form, [key]: opt })} disabled={isReadOnly}
            style={{
              padding: '10px 16px', fontSize: 11.5, fontFamily: fonts.body, fontWeight: 600,
              background: form[key] === opt ? (opt === 'Ya' ? theme.success : opt === 'Tidak' ? theme.danger : theme.gold) : '#fff',
              color: form[key] === opt ? '#fff' : theme.text,
              border: `1px solid ${form[key] === opt ? 'transparent' : theme.border}`, borderRadius: 2,
              cursor: isReadOnly ? 'default' : 'pointer',
            }}>{opt}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderLeft: `4px solid ${existing ? theme.success : theme.gold}`, borderRadius: 2, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${theme.border}` }}>
        <div>
          <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.gold, fontWeight: 700 }}>Tahap 05</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: theme.text, fontFamily: fonts.display, marginTop: 2 }}>Monitoring 2 · Penilaian Pertengahan</div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 3 }}>Penilaian manfaat program & kesediaan kontribusi balik</div>
        </div>
        {existing && <Pill variant="success">Selesai · {existing.submittedAt}</Pill>}
      </div>

      {likertField('manfaat', 'Manfaat DIKSI bagi Anda', 'Sejauh mana DIKSI memberikan manfaat bagi Bapak/Ibu?')}
      {likertField('bertumbuh', 'Bertumbuh Menjadi Versi Terbaik', 'Sejauh mana DIKSI membantu Bapak/Ibu bertumbuh menjadi versi terbaik?')}
      {likertField('rekomendasi', 'Rekomendasi DIKSI', 'Sejauh mana Bapak/Ibu merekomendasikan DIKSI untuk diikuti oleh pegawai lainnya?')}

      <div style={{ marginBottom: 18, paddingTop: 8 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme.text, marginBottom: 3 }}>Saran Proses Follow-up <span style={{ color: theme.danger }}>*</span></label>
        <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.5, marginBottom: 8 }}>Berikan saran terhadap proses follow-up atas tindak lanjut pengisian coaching plan yang telah Anda terima selama ini</div>
        <textarea value={form.saran} onChange={e => setForm({ ...form, saran: e.target.value })} rows={4} disabled={isReadOnly}
          style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 10, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', resize: 'none', boxSizing: 'border-box', background: isReadOnly ? theme.bg : '#fff', lineHeight: 1.55 }}/>
      </div>

      {yesnoField('bersedia_fasilitator', 'Bersedia Menjadi Fasilitator?', 'Ke depan, apabila DIKSI dilaksanakan di masing-masing satuan kerja, apakah Anda bersedia menjadi Fasilitator (pemandu kegiatan Group Coaching) pada sesi DIKSI tersebut?')}
      {yesnoField('bersedia_pembekalan', 'Bersedia Mengikuti Pembekalan Fasilitator?', 'Apakah Anda bersedia untuk mengikuti kegiatan Pembekalan Fasilitator DIKSI?')}

      {!isReadOnly && (
        <div style={{ paddingTop: 14, marginTop: 6, borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" icon={Send} onClick={submit}>Submit Monitoring 2</Button>
        </div>
      )}
    </div>
  );
}

// ----- Monitoring 3 form (self reflection · kategorisasi kualitatif) -----
function Mon3Form({ me, setParticipants, toast, addAudit, pushNotif }) {
  const existing = me.stageData.monitoring3?.status === 'completed' ? me.stageData.monitoring3 : null;

  const [form, setForm] = useState({
    kategori_perubahan: existing?.kategori_perubahan || '',
    elaborasi_perubahan: existing?.elaborasi_perubahan || existing?.refleksi_perubahan || '',
    kategori_pencapaian: existing?.kategori_pencapaian || '',
    elaborasi_pencapaian: existing?.elaborasi_pencapaian || existing?.refleksi_pencapaian || '',
    kategori_pembelajaran: existing?.kategori_pembelajaran || '',
    elaborasi_pembelajaran: existing?.elaborasi_pembelajaran || existing?.refleksi_pembelajaran || '',
    kategori_kedepan: existing?.kategori_kedepan || '',
    elaborasi_kedepan: existing?.elaborasi_kedepan || existing?.refleksi_kedepan || '',
  });

  useEffect(() => {
    const e = me.stageData.monitoring3?.status === 'completed' ? me.stageData.monitoring3 : null;
    setForm({
      kategori_perubahan: e?.kategori_perubahan || '', elaborasi_perubahan: e?.elaborasi_perubahan || e?.refleksi_perubahan || '',
      kategori_pencapaian: e?.kategori_pencapaian || '', elaborasi_pencapaian: e?.elaborasi_pencapaian || e?.refleksi_pencapaian || '',
      kategori_pembelajaran: e?.kategori_pembelajaran || '', elaborasi_pembelajaran: e?.elaborasi_pembelajaran || e?.refleksi_pembelajaran || '',
      kategori_kedepan: e?.kategori_kedepan || '', elaborasi_kedepan: e?.elaborasi_kedepan || e?.refleksi_kedepan || '',
    });
  }, [me.id]);

  // Definisi kategori kualitatif per pertanyaan
  const sections = [
    {
      kategoriKey: 'kategori_perubahan', elaborasiKey: 'elaborasi_perubahan',
      label: 'Tingkat Perubahan dalam Diri',
      desc: 'Setelah mengikuti DIKSI, sejauh mana Anda merasakan perubahan dalam cara berpikir, sikap, atau kapasitas diri?',
      kategori: [
        { value: 'transformatif', label: 'Transformatif',  hint: 'Perubahan mendasar dalam cara pikir & paradigma',  color: theme.success },
        { value: 'signifikan',    label: 'Signifikan',     hint: 'Banyak aspek diri yang berkembang nyata',          color: theme.success },
        { value: 'sedang',        label: 'Sedang',         hint: 'Beberapa aspek mengalami perubahan',                color: theme.gold },
        { value: 'sedikit',       label: 'Sedikit',        hint: 'Perubahan minor pada aspek tertentu',               color: theme.warning },
        { value: 'belum_terasa',  label: 'Belum Terasa',   hint: 'Belum merasakan perubahan signifikan',              color: theme.danger },
      ],
    },
    {
      kategoriKey: 'kategori_pencapaian', elaborasiKey: 'elaborasi_pencapaian',
      label: 'Tingkat Pencapaian Tujuan Pengembangan',
      desc: 'Sejauh mana tujuan/target development plan yang Anda susun saat coaching tercapai?',
      kategori: [
        { value: 'melampaui',     label: 'Melampaui Ekspektasi', hint: 'Pencapaian melebihi target awal',          color: theme.success },
        { value: 'sesuai_target', label: 'Sesuai Target',         hint: 'Pencapaian sesuai dengan rencana',         color: theme.success },
        { value: 'sebagian',      label: 'Sebagian Tercapai',     hint: 'Beberapa target tercapai, lainnya masih', color: theme.gold },
        { value: 'berproses',     label: 'Masih Berproses',       hint: 'Target dalam tahap pengerjaan aktif',     color: theme.warning },
        { value: 'belum_tercapai',label: 'Belum Tercapai',        hint: 'Target belum dapat direalisasikan',       color: theme.danger },
      ],
    },
    {
      kategoriKey: 'kategori_pembelajaran', elaborasiKey: 'elaborasi_pembelajaran',
      label: 'Kualitas Pembelajaran yang Diperoleh',
      desc: 'Bagaimana kualitas pembelajaran (insight, skill, mindset) yang Anda dapatkan dari proses coaching dan monitoring?',
      kategori: [
        { value: 'sangat_mendalam', label: 'Sangat Mendalam',    hint: 'Insight transformatif & shift mindset besar', color: theme.success },
        { value: 'mendalam',        label: 'Mendalam',            hint: 'Pembelajaran kaya dan berkesan',              color: theme.success },
        { value: 'standar',         label: 'Standar',             hint: 'Pembelajaran cukup, sesuai ekspektasi',       color: theme.gold },
        { value: 'kurang_optimal',  label: 'Kurang Optimal',      hint: 'Pembelajaran terbatas atau tidak menempel',   color: theme.warning },
      ],
    },
    {
      kategoriKey: 'kategori_kedepan', elaborasiKey: 'elaborasi_kedepan',
      label: 'Kejelasan Visi & Aspirasi ke Depan',
      desc: 'Setelah program ini, seberapa jelas visi karir dan aspirasi Anda di Bank Indonesia?',
      kategori: [
        { value: 'sangat_jelas',  label: 'Sangat Jelas dengan Roadmap', hint: 'Visi jelas dengan langkah konkret 3-5 tahun', color: theme.success },
        { value: 'cukup_jelas',   label: 'Cukup Jelas',                  hint: 'Arah sudah jelas, detail eksekusi berkembang', color: theme.success },
        { value: 'eksploratif',   label: 'Masih Eksploratif',            hint: 'Sedang menjelajahi berbagai kemungkinan',      color: theme.gold },
        { value: 'belum_terbentuk', label: 'Belum Terbentuk',            hint: 'Belum ada gambaran konkret',                   color: theme.warning },
      ],
    },
  ];

  const submit = () => {
    // Required: semua 4 kategori harus dipilih
    const missingCategory = sections.find(s => !form[s.kategoriKey]);
    if (missingCategory) {
      toast(`Mohon pilih kategori untuk "${missingCategory.label}"`, 'warning'); return;
    }
    // Elaborasi minimal 1 kalimat (10 chars) untuk tiap section — encouraged for richness
    const missingElaborasi = sections.find(s => !form[s.elaborasiKey].trim() || form[s.elaborasiKey].trim().length < 10);
    if (missingElaborasi) {
      toast(`Mohon isi elaborasi untuk "${missingElaborasi.label}" (minimal 1 kalimat)`, 'warning'); return;
    }
    setParticipants(prev => prev.map(p => p.id !== me.id ? p : ({
      ...p, stage: Math.max(p.stage, 7),
      stageData: {
        ...p.stageData,
        monitoring3: { status: 'completed', submittedAt: new Date().toISOString().slice(0,10), ...form },
      }
    })));
    addAudit(me.nama, 'Submit Self-Reflection (Monitoring 3)', null);
    pushNotif('admin', { type: 'success', title: `${me.nama} masuk Tahap 7 Evaluasi`, desc: 'Self-reflection Monitoring 3 selesai' });
    toast('Self-reflection tersimpan. Lanjut ke tahap akhir Evaluasi.', 'success');
  };

  const isReadOnly = !!existing;

  return (
    <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderLeft: `4px solid ${existing ? theme.success : theme.gold}`, borderRadius: 2, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${theme.border}` }}>
        <div>
          <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.gold, fontWeight: 700 }}>Tahap 06</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: theme.text, fontFamily: fonts.display, marginTop: 2 }}>Monitoring 3 · Self Reflection</div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 3 }}>Refleksi mendalam dengan kategorisasi kualitatif atas pengalaman Anda</div>
        </div>
        {existing && <Pill variant="success">Selesai · {existing.submittedAt}</Pill>}
      </div>

      <div style={{ background: theme.infoBg, border: '1px solid #BFDBFE', padding: 12, borderRadius: 2, fontSize: 11, color: theme.info, display: 'flex', gap: 8, marginBottom: 18, lineHeight: 1.5 }}>
        <Info size={13} style={{ flexShrink: 0, marginTop: 1 }}/>
        <div>Pilih kategori yang paling merepresentasikan refleksi Anda, lalu elaborasikan dengan narasi singkat. Tidak ada jawaban benar/salah — yang penting authentic.</div>
      </div>

      {sections.map((section, idx) => {
        const selectedValue = form[section.kategoriKey];
        const selectedKategori = section.kategori.find(k => k.value === selectedValue);
        return (
          <div key={section.kategoriKey} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: idx < sections.length - 1 ? `1px solid ${theme.border}` : 'none' }}>
            {/* Question header */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: fonts.mono, fontSize: 10, color: theme.textSubtle }}>0{idx + 1}</span>
              <label style={{ fontSize: 13, fontWeight: 600, color: theme.text, fontFamily: fonts.display }}>{section.label} <span style={{ color: theme.danger }}>*</span></label>
            </div>
            <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.5, marginBottom: 12, paddingLeft: 22 }}>{section.desc}</div>

            {/* Category chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12, paddingLeft: 22 }}>
              {section.kategori.map(opt => {
                const isSelected = selectedValue === opt.value;
                return (
                  <button key={opt.value}
                    onClick={() => !isReadOnly && setForm({ ...form, [section.kategoriKey]: opt.value })}
                    disabled={isReadOnly}
                    title={opt.hint}
                    style={{
                      padding: '10px 16px',
                      background: isSelected ? opt.color : '#fff',
                      color: isSelected ? '#fff' : theme.text,
                      border: `1px solid ${isSelected ? opt.color : theme.border}`,
                      borderRadius: 2,
                      fontSize: 11.5, fontFamily: fonts.body, fontWeight: isSelected ? 600 : 500,
                      cursor: isReadOnly ? 'default' : 'pointer',
                      transition: 'all 0.12s',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                    onMouseEnter={e => { if (!isReadOnly && !isSelected) e.currentTarget.style.borderColor = opt.color; }}
                    onMouseLeave={e => { if (!isReadOnly && !isSelected) e.currentTarget.style.borderColor = theme.border; }}
                  >
                    {isSelected && <CheckCircle2 size={12}/>}
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Selected category hint */}
            {selectedKategori && (
              <div style={{ marginLeft: 22, marginBottom: 10, padding: 10, background: theme.bg, borderLeft: `3px solid ${selectedKategori.color}`, borderRadius: 2, fontSize: 10.5, color: theme.text, lineHeight: 1.5 }}>
                <strong style={{ color: selectedKategori.color }}>{selectedKategori.label}</strong> — <span style={{ color: theme.textMuted }}>{selectedKategori.hint}</span>
              </div>
            )}

            {/* Elaborasi */}
            <div style={{ paddingLeft: 22 }}>
              <label style={{ display: 'block', fontSize: 10.5, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                Elaborasi <span style={{ color: theme.danger, textTransform: 'none', letterSpacing: 0 }}>*</span>
              </label>
              <textarea value={form[section.elaborasiKey]} onChange={e => setForm({ ...form, [section.elaborasiKey]: e.target.value })} rows={4} disabled={isReadOnly}
                placeholder="Ceritakan lebih detail pengalaman dan perspektif Anda..."
                style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 12, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', resize: 'vertical', boxSizing: 'border-box', background: isReadOnly ? theme.bg : '#fff', lineHeight: 1.6 }}/>
            </div>
          </div>
        );
      })}

      {!isReadOnly && (
        <div style={{ paddingTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" icon={Send} onClick={submit}>Submit Self-Reflection</Button>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// PESERTA: EVALUASI — final program assessment
// =====================================================================
function PesertaEvaluasi() {
  const { participants, setParticipants, pesertaPersonaId, toast, addAudit, pushNotif } = useApp();
  const me = participants.find(p => p.id === pesertaPersonaId) || participants[0];
  const mentor = USERS[me.mentorUserId];
  const evaluasiUnlocked = me.stageData.monitoring3?.status === 'completed';
  const existing = me.stageData.evaluasi?.status === 'completed' ? me.stageData.evaluasi : null;

  const [form, setForm] = useState({
    skor_program: existing?.skor_program || 8,
    skor_mentor: existing?.skor_mentor || 8,
    kebermanfaatan: existing?.kebermanfaatan || 8,
    feedback_program: existing?.feedback_program || '',
    feedback_mentor: existing?.feedback_mentor || '',
    rekomendasi_perbaikan: existing?.rekomendasi_perbaikan || '',
  });

  useEffect(() => {
    const e = me.stageData.evaluasi?.status === 'completed' ? me.stageData.evaluasi : null;
    setForm({
      skor_program: e?.skor_program || 8, skor_mentor: e?.skor_mentor || 8, kebermanfaatan: e?.kebermanfaatan || 8,
      feedback_program: e?.feedback_program || '', feedback_mentor: e?.feedback_mentor || '', rekomendasi_perbaikan: e?.rekomendasi_perbaikan || '',
    });
  }, [me.id]);

  const submit = () => {
    if (!form.feedback_program.trim() || !form.feedback_mentor.trim()) {
      toast('Mohon isi feedback program dan mentor', 'warning'); return;
    }
    setParticipants(prev => prev.map(p => p.id !== me.id ? p : ({
      ...p, status: 'completed',
      stageData: {
        ...p.stageData,
        evaluasi: { status: 'completed', submittedAt: new Date().toISOString().slice(0,10), ...form },
      }
    })));
    addAudit(me.nama, 'Submit Evaluasi Akhir Program DIKSI', null);
    pushNotif('admin', { type: 'success', title: `${me.nama} menyelesaikan program DIKSI`, desc: `Skor program: ${form.skor_program}/10 · skor mentor: ${form.skor_mentor}/10` });
    pushNotif('mentor', { type: 'success', title: `${me.nama} memberikan evaluasi akhir`, desc: `Skor mentor: ${form.skor_mentor}/10` });
    toast('Evaluasi akhir tersimpan. Selamat menyelesaikan program DIKSI!', 'success');
  };

  if (!evaluasiUnlocked) {
    return (
      <div>
        <SectionHeader eyebrow="Peserta · Tahap 07 · Evaluasi" title="Evaluasi Akhir Program" desc="3-Tier evaluation komprehensif setelah seluruh tahap monitoring selesai"/>
        <div style={{ background: theme.bg, border: `1px dashed ${theme.borderStrong}`, padding: 32, textAlign: 'center', borderRadius: 2 }}>
          <Lock size={28} style={{ color: theme.textMuted, margin: '0 auto 10px' }}/>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Evaluasi belum tersedia</div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 6, lineHeight: 1.5, maxWidth: 380, marginLeft: 'auto', marginRight: 'auto' }}>
            Tahap evaluasi akhir akan terbuka setelah <strong style={{ color: theme.text }}>Monitoring 3</strong> selesai.
          </div>
        </div>
      </div>
    );
  }

  const isReadOnly = !!existing;

  const likertField = (key, label, desc, color = theme.navy) => (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>{label}</label>
        <span style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 300, color }}>{form[key]}<span style={{ fontSize: 11, color: theme.textSubtle }}>/10</span></span>
      </div>
      <p style={{ fontSize: 11, color: theme.textMuted, margin: '0 0 10px', lineHeight: 1.5 }}>{desc}</p>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <button key={n} onClick={() => !isReadOnly && setForm({ ...form, [key]: n })} disabled={isReadOnly}
            style={{
              flex: 1, height: 32, fontSize: 11, fontFamily: fonts.mono, fontWeight: 600,
              background: n <= form[key] ? (n >= 8 ? theme.success : n >= 5 ? theme.gold : theme.warning) : '#F1F3F6',
              color: n <= form[key] ? '#fff' : theme.textSubtle,
              border: 'none', borderRadius: 2, cursor: isReadOnly ? 'default' : 'pointer',
            }}>{n}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <SectionHeader
        eyebrow="Peserta · Tahap 07 · Evaluasi"
        title="Evaluasi Akhir Program"
        desc="Penilaian komprehensif terhadap program DIKSI dan mentor — feedback Anda menentukan kualitas program ke depan"
      />

      {/* Status banner */}
      {existing && (
        <div style={{ background: theme.successBg, border: `1px solid ${theme.success}`, padding: 14, borderRadius: 2, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle2 size={18} style={{ color: theme.success }}/>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Selamat! Anda telah menyelesaikan seluruh program DIKSI</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>Evaluasi akhir disubmit pada {existing.submittedAt}</div>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderLeft: `4px solid ${existing ? theme.success : theme.gold}`, borderRadius: 2, padding: 24 }}>
        {/* Section: Skor */}
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.textMuted, fontWeight: 600, marginBottom: 14 }}>Penilaian (Skala 1-10)</div>

        {likertField('skor_program', 'Penilaian Keseluruhan Program DIKSI', 'Bagaimana Anda menilai program DIKSI secara keseluruhan? (kualitas, struktur, eksekusi)', theme.navy)}
        {likertField('skor_mentor', `Penilaian Mentor (${mentor?.user.split(',')[0] || 'Mentor Anda'})`, `Bagaimana Anda menilai performa ${mentor?.user.split(',')[0] || 'mentor'} sebagai coach selama program?`, theme.gold)}
        {likertField('kebermanfaatan', 'Kebermanfaatan Program', 'Sejauh mana program DIKSI memberikan dampak nyata pada karir dan pengembangan Anda?', theme.success)}

        {/* Section: Feedback */}
        <div style={{ paddingTop: 14, marginTop: 8, borderTop: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.textMuted, fontWeight: 600, marginBottom: 14 }}>Feedback Tertulis</div>

          {[
            { key: 'feedback_program', label: 'Feedback untuk Program DIKSI', desc: 'Apa yang paling Anda apresiasi dari program ini? Apa yang berkesan? (minimum 2 kalimat)', required: true, rows: 5 },
            { key: 'feedback_mentor', label: `Feedback untuk Mentor (${mentor?.user.split(',')[0] || ''})`, desc: 'Bagaimana pengalaman Anda dengan mentor? Apa kualitas yang menonjol? Apa saran untuk mentor?', required: true, rows: 5 },
            { key: 'rekomendasi_perbaikan', label: 'Rekomendasi Perbaikan Program', desc: 'Saran konkret untuk peningkatan kualitas DIKSI di masa depan (opsional namun sangat membantu)', required: false, rows: 4 },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme.text, marginBottom: 3 }}>
                {f.label} {f.required && <span style={{ color: theme.danger }}>*</span>}
              </label>
              <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.5, marginBottom: 8 }}>{f.desc}</div>
              <textarea value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} rows={f.rows} disabled={isReadOnly}
                style={{ width: '100%', fontSize: 12, fontFamily: fonts.body, padding: 12, border: `1px solid ${theme.border}`, borderRadius: 2, outline: 'none', resize: 'vertical', boxSizing: 'border-box', background: isReadOnly ? theme.bg : '#fff', lineHeight: 1.6 }}/>
            </div>
          ))}
        </div>

        {!isReadOnly && (
          <div style={{ paddingTop: 14, borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" icon={Send} onClick={submit}>Submit Evaluasi Akhir</Button>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// PESERTA: WIKI / MODUL — list modul published + detail viewer
// =====================================================================
function PesertaWiki() {
  // Stub modul untuk demo — di production akan share state dengan AdminWiki
  const [modul] = useState([
    { id: 'W001', judul: 'Pengantar Program DIKSI Coaching',     kategori: 'Pengantar',   tahap: 1, ringkasan: 'Overview lengkap program, tujuan, dan timeline 7 tahap.', isi: '# Pengantar Program DIKSI Coaching\n\nProgram DIKSI (Development of Internal Coaches & Senior Influencers) adalah inisiatif strategis Bank Indonesia untuk mengembangkan kapasitas leadership talenta KPP melalui pendekatan coaching terstruktur.\n\n## Tujuan Program\n\n- Meningkatkan kapasitas decision-making berbasis data dan strategic thinking\n- Membangun jejaring lintas satker antara peserta dan mentor senior\n- Menyiapkan talenta KPP untuk peran kepemimpinan ke depan\n\n## Timeline 7 Tahap\n\n1. **Registrasi** — konfirmasi peserta & check-in\n2. **Sosialisasi** — pretest & posttest\n3. **Coaching** — 1-on-1 dengan mentor (atasan)\n4. **Monitoring 1, 2, 3** — review progress berkala\n5. **Evaluasi** — assessment komprehensif\n\nSelamat mengikuti program!', visibility: 'all',     updatedAt: '2026-01-10', author: 'Dr. Ratna Kusumaningrum', readCount: 6, status: 'published' },
    { id: 'W002', judul: 'Panduan Check-in dan Registrasi',       kategori: 'Panduan',    tahap: 1, ringkasan: 'Cara melakukan check-in saat kegiatan dimulai.',           isi: '# Panduan Check-in\n\nCheck-in dilakukan saat kegiatan sosialisasi dimulai pada hari H.\n\n## Langkah-langkah\n\n1. Buka aplikasi pada hari kegiatan\n2. Masuk ke menu **Check-in & Registrasi**\n3. Pastikan Anda hadir di lokasi (Auditorium A)\n4. Klik tombol **Check-in Sekarang**\n\nSetelah check-in berhasil, Anda otomatis lanjut ke Tahap 02 Sosialisasi.', visibility: 'all',     updatedAt: '2026-01-12', author: 'Dr. Ratna Kusumaningrum', readCount: 5, status: 'published' },
    { id: 'W003', judul: 'Materi Sosialisasi DIKSI 2026',          kategori: 'Materi',     tahap: 2, ringkasan: 'Slide deck sosialisasi yang dipresentasikan saat kickoff.', isi: '# Materi Sosialisasi DIKSI 2026\n\nMateri ini adalah ringkasan slide deck yang dipresentasikan oleh tim DSDM pada saat kickoff.\n\n## Outline\n\n- Filosofi coaching di Bank Indonesia\n- Peran mentor (atasan langsung) dalam program\n- Komitmen waktu peserta (rata-rata 4-5 jam/bulan)\n- Etika & kerahasiaan dalam sesi coaching\n- Metrik keberhasilan program\n\n## Quick Tips\n\n- Hadiri semua sesi tanpa kecuali\n- Jujur saat self-assessment\n- Manfaatkan sesi 1-on-1 untuk hal yang substantif', visibility: 'peserta', updatedAt: '2026-01-15', author: 'Dr. Ratna Kusumaningrum', readCount: 5, status: 'published' },
    { id: 'W005', judul: 'Persiapan Sesi 1-on-1 Coaching',          kategori: 'Panduan',    tahap: 3, ringkasan: 'Tips & template persiapan sesi coaching antara mentor dan mentee.', isi: '# Persiapan Sesi 1-on-1 Coaching\n\n## Sebelum Sesi\n\n- Refleksikan progress 2 minggu terakhir\n- Identifikasi 2-3 challenge spesifik yang ingin dibahas\n- Siapkan pertanyaan terbuka untuk mentor\n\n## Saat Sesi\n\n- Hadir tepat waktu dan dalam kondisi fokus\n- Aktif mendengar dan klarifikasi jika belum jelas\n- Catat insight & action items\n\n## Setelah Sesi\n\n- Submit survey peserta di aplikasi\n- Eksekusi action items yang sudah disepakati\n- Komunikasikan progress di sesi berikutnya', visibility: 'all', updatedAt: '2026-02-01', author: 'Dr. Ratna Kusumaningrum', readCount: 4, status: 'published' },
  ]);

  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('all');
  const [activeId, setActiveId] = useState(null);

  // Hanya tampilkan yang published & visibility all atau peserta
  const visible = modul.filter(m => m.status === 'published' && (m.visibility === 'all' || m.visibility === 'peserta'));
  const kategoriList = [...new Set(visible.map(m => m.kategori))];

  const filtered = visible.filter(m => {
    if (filterKategori !== 'all' && m.kategori !== filterKategori) return false;
    if (search && !m.judul.toLowerCase().includes(search.toLowerCase()) && !m.ringkasan.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const active = visible.find(m => m.id === activeId);

  // Detail viewer
  if (active) {
    return (
      <div>
        <SectionHeader
          eyebrow={`Peserta · Wiki · ${active.kategori}`}
          title={active.judul}
          desc={`Tahap 0${active.tahap} · update ${active.updatedAt} · ${active.readCount} reads`}
        />
        <div style={{ marginBottom: 14 }}>
          <button onClick={() => setActiveId(null)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: theme.textMuted, fontFamily: fonts.body, padding: 0 }}>
            <ArrowLeft size={12}/> Kembali ke daftar modul
          </button>
        </div>
        <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, padding: 32, fontFamily: fonts.body }}>
          <div style={{ fontSize: 12.5, color: theme.text, lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
            {active.isi.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <div key={i} style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 600, color: theme.text, margin: '20px 0 10px', letterSpacing: '-0.01em' }}>{line.slice(2)}</div>;
              if (line.startsWith('## ')) return <div key={i} style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: 600, color: theme.text, margin: '18px 0 8px' }}>{line.slice(3)}</div>;
              if (line.startsWith('- ')) return <div key={i} style={{ paddingLeft: 18, margin: '4px 0', position: 'relative' }}><span style={{ position: 'absolute', left: 4, color: theme.gold }}>•</span>{line.slice(2)}</div>;
              if (line.match(/^\d+\. /)) return <div key={i} style={{ paddingLeft: 18, margin: '4px 0' }}>{line}</div>;
              if (line.trim() === '') return <div key={i} style={{ height: 8 }}/>;
              // Inline bold support
              const parts = line.split(/(\*\*[^*]+\*\*)/g);
              return <div key={i} style={{ margin: '4px 0' }}>{parts.map((p, j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j}>{p.slice(2, -2)}</strong> : <span key={j}>{p}</span>)}</div>;
            })}
          </div>
          <div style={{ marginTop: 22, paddingTop: 14, borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: theme.textMuted }}>
            <div>Author: <strong style={{ color: theme.text }}>{active.author}</strong></div>
            <div style={{ fontFamily: fonts.mono }}>{active.updatedAt}</div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div>
      <SectionHeader
        eyebrow="Peserta · Wiki"
        title="Wiki / Modul Konseling"
        desc={`${visible.length} modul tersedia · materi referensi yang dipublish oleh Admin DSDM`}
      />

      {/* Filter */}
      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, padding: '10px 14px', marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: theme.bg, borderRadius: 2 }}>
          <Search size={13} style={{ color: theme.textSubtle }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari modul..."
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 12, fontFamily: fonts.body, color: theme.text }}/>
        </div>
        <select value={filterKategori} onChange={e => setFilterKategori(e.target.value)}
          style={{ fontSize: 11, fontFamily: fonts.body, padding: '6px 10px', border: `1px solid ${theme.border}`, borderRadius: 2, background: '#fff', color: theme.text, cursor: 'pointer', outline: 'none' }}>
          <option value="all">Semua kategori</option>
          {kategoriList.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      {/* Modul cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', background: '#fff', border: `1px dashed ${theme.borderStrong}`, padding: 32, textAlign: 'center', borderRadius: 2, fontSize: 11, color: theme.textMuted }}>
            Tidak ada modul sesuai filter.
          </div>
        )}
        {filtered.map(m => (
          <button key={m.id} onClick={() => setActiveId(m.id)}
            style={{
              background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, padding: 16,
              cursor: 'pointer', textAlign: 'left', fontFamily: fonts.body, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.gold; e.currentTarget.style.boxShadow = '0 4px 12px rgba(10,37,64,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <Pill variant="info" size="xs">{m.kategori}</Pill>
              <span style={{ fontSize: 9, color: theme.textMuted, fontFamily: fonts.mono, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tahap 0{m.tahap}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, fontFamily: fonts.display, marginBottom: 6, lineHeight: 1.35 }}>{m.judul}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.5, marginBottom: 12 }}>{m.ringkasan}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: theme.gold, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Baca selengkapnya <ArrowRight size={11}/>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// MENTOR: WIKI / MODUL — read-only dengan akses materi mentor + all
// =====================================================================
function MentorWiki() {
  const [modul] = useState([
    { id: 'W001', judul: 'Pengantar Program DIKSI Coaching', kategori: 'Pengantar', tahap: 1, ringkasan: 'Overview lengkap program, tujuan, dan timeline 7 tahap.',
      isi: '# Pengantar Program DIKSI Coaching\n\nProgram DIKSI adalah inisiatif strategis Bank Indonesia untuk mengembangkan kapasitas leadership talenta KPP melalui pendekatan coaching terstruktur.\n\n## Peran Mentor\n\nSebagai mentor, Anda adalah atasan langsung peserta yang bertanggung jawab untuk:\n\n- Mendampingi peserta dalam sesi 1-on-1 coaching\n- Memberikan strengths, area pengembangan, dan rekomendasi\n- Mengontrol akses pretest/posttest setelah sesi sosialisasi\n- Mendukung peserta dalam tahap monitoring (1, 2, 3)\n\n## Komitmen Waktu Mentor\n\nRata-rata 2-3 jam/bulan untuk sesi coaching dan administrasi.\n\nTerima kasih atas kontribusinya dalam pengembangan talenta BI!',
      visibility: 'all', updatedAt: '2026-01-10', author: 'Dr. Ratna Kusumaningrum', readCount: 6, status: 'published' },
    { id: 'W005', judul: 'Persiapan Sesi 1-on-1 Coaching', kategori: 'Panduan', tahap: 3, ringkasan: 'Tips & template persiapan sesi coaching antara mentor dan mentee.',
      isi: '# Persiapan Sesi 1-on-1 Coaching (untuk Mentor)\n\n## Sebelum Sesi\n\n- Review profile peserta: latar belakang, satker, tahun SMD\n- Cek skor pretest/posttest sebagai baseline\n- Siapkan 3-5 powerful questions yang relevan\n- Allocate slot 60 menit tanpa interupsi\n\n## Saat Sesi\n\n- Bangun rapport di 5 menit pertama\n- Gunakan GROW model: Goal · Reality · Options · Way Forward\n- Lebih banyak bertanya daripada memberi nasihat (rasio 80:20)\n- Catat insight kunci untuk evaluasi\n\n## Setelah Sesi\n\n- Submit evaluasi mentor: Strengths · Area Pengembangan · Rekomendasi\n- Lihat survey peserta untuk feedback ke diri sendiri\n- Buka akses posttest sosialisasi (kalau belum)',
      visibility: 'all', updatedAt: '2026-02-01', author: 'Dr. Ratna Kusumaningrum', readCount: 4, status: 'published' },
    { id: 'W006', judul: 'Template Evaluasi Mentor', kategori: 'Template', tahap: 3, ringkasan: 'Format strengths, area pengembangan, rekomendasi tindak lanjut.',
      isi: '# Template Evaluasi Mentor\n\n## Format Standar\n\nGunakan struktur 3 bagian berikut saat menulis evaluasi peserta:\n\n## 1. Kekuatan (Strengths)\n\nIdentifikasi 2-3 kekuatan utama yang Anda observasi:\n\n- **Apa yang menonjol?** (kapasitas, sikap, hasil kerja)\n- **Bukti spesifik** dari pengamatan Anda\n- **Bagaimana ini bermanfaat** untuk role saat ini & ke depan\n\n## 2. Area Pengembangan\n\nIdentifikasi 2-3 area development yang prioritas:\n\n- **Apa yang perlu dikembangkan?**\n- **Mengapa ini penting** untuk pertumbuhan peserta\n- **Konteks atau gap spesifik** yang teramati\n\n## 3. Rekomendasi\n\nBerikan 2-4 actionable recommendations:\n\n- Tindak lanjut konkret 30/60/90 hari\n- Resource atau exposure yang disarankan (training, sertifikasi, kepanitiaan)\n- Mentoring lanjutan atau peer-learning\n\n## Tips Penulisan\n\n- Spesifik & evidence-based\n- Hindari generalisasi (\"good performance\")\n- Forward-looking & action-oriented\n- Empathetic tone',
      visibility: 'mentor', updatedAt: '2026-02-03', author: 'Dr. Ratna Kusumaningrum', readCount: 2, status: 'published' },
    { id: 'W007', judul: 'Coaching Skills untuk Mentor', kategori: 'Materi', tahap: 3, ringkasan: 'Modul mentor: GROW model, active listening, powerful questions.',
      isi: '# Coaching Skills untuk Mentor DIKSI\n\n## GROW Model\n\nFramework klasik untuk struktur sesi coaching:\n\n- **G**oal — Apa tujuan peserta dari sesi ini?\n- **R**eality — Bagaimana situasi saat ini?\n- **O**ptions — Apa opsi yang bisa dipertimbangkan?\n- **W**ay Forward — Apa langkah konkret berikutnya?\n\n## Active Listening\n\n3 level mendengar:\n\n1. **Internal** — fokus pada respons sendiri (hindari)\n2. **Focused** — fokus penuh pada lawan bicara\n3. **Global** — observe konteks, nada, body language, energi\n\nTarget Level 2-3 saat coaching.\n\n## Powerful Questions\n\nKarakteristik powerful question:\n\n- Open-ended (\"apa\", \"bagaimana\", bukan \"apakah\")\n- Forward-looking & solution-focused\n- Memunculkan refleksi & insight\n\nContoh:\n\n- \"Apa hal terbaik yang bisa terjadi jika ini berhasil?\"\n- \"Sumber daya apa yang sudah Anda punya untuk mencapai ini?\"\n- \"Jika tidak ada batasan, langkah apa yang akan Anda ambil?\"\n\n## Hal yang Perlu Dihindari\n\n- Memberi solusi langsung (peserta harus self-discover)\n- Judgment atau evaluative comments saat sesi berjalan\n- Membandingkan dengan pengalaman pribadi terlalu banyak',
      visibility: 'mentor', updatedAt: '2026-02-05', author: 'Dr. Ratna Kusumaningrum', readCount: 8, status: 'published' },
  ]);

  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('all');
  const [activeId, setActiveId] = useState(null);

  // Tampilkan yang published & visibility all atau mentor
  const visible = modul.filter(m => m.status === 'published' && (m.visibility === 'all' || m.visibility === 'mentor'));
  const kategoriList = [...new Set(visible.map(m => m.kategori))];

  const filtered = visible.filter(m => {
    if (filterKategori !== 'all' && m.kategori !== filterKategori) return false;
    if (search && !m.judul.toLowerCase().includes(search.toLowerCase()) && !m.ringkasan.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const active = visible.find(m => m.id === activeId);

  if (active) {
    return (
      <div>
        <SectionHeader
          eyebrow={`Mentor · Wiki · ${active.kategori}`}
          title={active.judul}
          desc={`Tahap 0${active.tahap} · update ${active.updatedAt} · ${active.readCount} reads`}
        />
        <div style={{ marginBottom: 14 }}>
          <button onClick={() => setActiveId(null)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: theme.textMuted, fontFamily: fonts.body, padding: 0 }}>
            <ArrowLeft size={12}/> Kembali ke daftar modul
          </button>
        </div>
        <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, padding: 32, fontFamily: fonts.body }}>
          <div style={{ fontSize: 12.5, color: theme.text, lineHeight: 1.75 }}>
            {active.isi.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <div key={i} style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 600, color: theme.text, margin: '20px 0 10px', letterSpacing: '-0.01em' }}>{line.slice(2)}</div>;
              if (line.startsWith('## ')) return <div key={i} style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: 600, color: theme.text, margin: '18px 0 8px' }}>{line.slice(3)}</div>;
              if (line.startsWith('- ')) return <div key={i} style={{ paddingLeft: 18, margin: '4px 0', position: 'relative' }}><span style={{ position: 'absolute', left: 4, color: theme.gold }}>•</span>{line.slice(2)}</div>;
              if (line.match(/^\d+\. /)) return <div key={i} style={{ paddingLeft: 18, margin: '4px 0' }}>{line}</div>;
              if (line.trim() === '') return <div key={i} style={{ height: 8 }}/>;
              const parts = line.split(/(\*\*[^*]+\*\*)/g);
              return <div key={i} style={{ margin: '4px 0' }}>{parts.map((p, j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j}>{p.slice(2, -2)}</strong> : <span key={j}>{p}</span>)}</div>;
            })}
          </div>
          <div style={{ marginTop: 22, paddingTop: 14, borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: theme.textMuted }}>
            <div>Author: <strong style={{ color: theme.text }}>{active.author}</strong></div>
            <div style={{ fontFamily: fonts.mono }}>{active.updatedAt}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Mentor · Wiki"
        title="Wiki / Modul Mentor"
        desc={`${visible.length} modul tersedia · materi referensi mentor termasuk template evaluasi & coaching skills`}
      />

      <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, padding: '10px 14px', marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: theme.bg, borderRadius: 2 }}>
          <Search size={13} style={{ color: theme.textSubtle }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari modul..."
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 12, fontFamily: fonts.body, color: theme.text }}/>
        </div>
        <select value={filterKategori} onChange={e => setFilterKategori(e.target.value)}
          style={{ fontSize: 11, fontFamily: fonts.body, padding: '6px 10px', border: `1px solid ${theme.border}`, borderRadius: 2, background: '#fff', color: theme.text, cursor: 'pointer', outline: 'none' }}>
          <option value="all">Semua kategori</option>
          {kategoriList.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', background: '#fff', border: `1px dashed ${theme.borderStrong}`, padding: 32, textAlign: 'center', borderRadius: 2, fontSize: 11, color: theme.textMuted }}>
            Tidak ada modul sesuai filter.
          </div>
        )}
        {filtered.map(m => {
          const isMentorOnly = m.visibility === 'mentor';
          return (
            <button key={m.id} onClick={() => setActiveId(m.id)}
              style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2, padding: 16, cursor: 'pointer', textAlign: 'left', fontFamily: fonts.body, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = theme.gold; e.currentTarget.style.boxShadow = '0 4px 12px rgba(10,37,64,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <Pill variant="info" size="xs">{m.kategori}</Pill>
                  {isMentorOnly && <Pill variant="gold" size="xs">Mentor Only</Pill>}
                </div>
                <span style={{ fontSize: 9, color: theme.textMuted, fontFamily: fonts.mono, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tahap 0{m.tahap}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, fontFamily: fonts.display, marginBottom: 6, lineHeight: 1.35 }}>{m.judul}</div>
              <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.5, marginBottom: 12 }}>{m.ringkasan}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: theme.gold, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Baca selengkapnya <ArrowRight size={11}/>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// =====================================================================
// BOARD VIEW
// =====================================================================

function BoardDashboard() {
  const { participants } = useApp();
  const avg = participants.length ? Math.round(participants.reduce((a,p) => a + calcProgress(p), 0) / participants.length) : 0;
  const completed = participants.filter(p => p.status === 'completed').length;
  const activeCount = participants.filter(p => p.status === 'active').length;
  const now = new Date();
  const lastSync = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')} WIB`;

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Compact header bar */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.navy} 0%, ${theme.navyDark} 100%)`,
        borderRadius: '3px 3px 0 0', padding: '16px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden', flexShrink: 0,
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 90% 30%, rgba(184,147,90,0.12) 0%, transparent 50%)` }}/>
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: theme.goldLight, fontWeight: 600, marginBottom: 4 }}>
            Executive Dashboard · Read-Only
          </div>
          <div style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 500, color: '#fff', letterSpacing: '-0.01em' }}>
            Talent Development Impact
          </div>
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 300, color: theme.gold, lineHeight: 1 }}>{activeCount}</div>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.goldLight, marginTop: 3 }}>Peserta Aktif</div>
          </div>
          <div style={{ width: 1, height: 32, background: 'rgba(184,147,90,0.3)' }}/>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 300, color: theme.gold, lineHeight: 1 }}>{avg}%</div>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.goldLight, marginTop: 3 }}>Avg Completion</div>
          </div>
          <div style={{ width: 1, height: 32, background: 'rgba(184,147,90,0.3)' }}/>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 300, color: theme.gold, lineHeight: 1 }}>{completed}</div>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.goldLight, marginTop: 3 }}>Program Selesai</div>
          </div>
        </div>
      </div>

      {/* Embed dashboard container */}
      <div style={{
        flex: 1, background: '#fff', border: `1px solid ${theme.border}`, borderTop: 'none',
        borderRadius: '0 0 3px 3px', overflow: 'hidden', position: 'relative',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Toolbar */}
        <div style={{
          padding: '10px 16px', borderBottom: `1px solid ${theme.border}`, background: theme.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: theme.success }}/>
              <span style={{ fontSize: 10, color: theme.textMuted, fontWeight: 500 }}>Live</span>
            </div>
            <div style={{ fontSize: 10, color: theme.textSubtle, fontFamily: fonts.mono }}>Last sync: {lastSync}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Pill variant="ghost">Power BI Embedded</Pill>
            <button style={{
              background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: 2,
              padding: '4px 8px', cursor: 'pointer', fontFamily: fonts.body,
              fontSize: 10, color: theme.textMuted, display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <RefreshCw size={11}/> Refresh
            </button>
            <button style={{
              background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: 2,
              padding: '4px 8px', cursor: 'pointer', fontFamily: fonts.body,
              fontSize: 10, color: theme.textMuted, display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Download size={11}/> Export PDF
            </button>
          </div>
        </div>

        {/* Embedded dashboard body — mockup Power BI visual */}
        <div style={{ flex: 1, padding: 20, overflow: 'auto', background: '#FAFBFC' }}>
          <EmbeddedPowerBIDashboard participants={participants}/>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// EMBEDDED POWER BI DASHBOARD — mockup visual Power BI untuk Pimpinan
// =====================================================================
function EmbeddedPowerBIDashboard({ participants }) {
  const total = participants.length;
  const byStage = STAGES.map(s => ({
    ...s,
    count: participants.filter(p => p.stage >= s.id).length,
  }));
  const bySatker = [...new Set(participants.map(p => p.satker))].map(sk => ({
    nama: sk,
    count: participants.filter(p => p.satker === sk).length,
  }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, fontFamily: fonts.body }}>
      {/* KPI Cards */}
      <div style={{ gridColumn: 'span 4', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Program', value: '4', sub: 'aktif periode ini', trend: null, color: theme.navy },
          { label: 'Total Peserta', value: '147', sub: 'across 4 program', trend: +22, color: theme.gold },
          { label: 'Avg Completion', value: `${Math.round(participants.reduce((a,p)=>a+calcProgress(p),0)/(participants.length||1))}%`, sub: 'vs 74% last sem', trend: +8, color: theme.success },
          { label: 'ROI Estimation', value: '3.4×', sub: 'SDM investment', trend: +12, color: '#7C3AED' },
        ].map((k, i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 3, padding: 16, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: k.color, borderRadius: '3px 0 0 3px' }}/>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMuted, fontWeight: 600 }}>{k.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
              <span style={{ fontFamily: fonts.display, fontSize: 28, fontWeight: 400, color: theme.text, letterSpacing: '-0.02em' }}>{k.value}</span>
              {k.trend !== null && (
                <span style={{ fontSize: 10, fontWeight: 700, color: k.trend >= 0 ? theme.success : theme.danger, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                  {k.trend >= 0 ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}
                  {k.trend >= 0 ? '+' : ''}{k.trend}%
                </span>
              )}
            </div>
            <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 3 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Perbandingan Program — wide */}
      <div style={{ gridColumn: 'span 3', background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 3, padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.text, fontFamily: fonts.display }}>Perbandingan Kinerja Program</div>
            <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>Skor 3-Tier Evaluation · Batch 1 · 2026</div>
          </div>
          <Pill variant="ghost">2026 S1</Pill>
        </div>
        {[
          { nama: 'DIKSI Coaching',              peserta: total, skor: 8.6, completion: Math.round(participants.reduce((a,p)=>a+calcProgress(p),0)/(participants.length||1)), trend: +12, highlight: true },
          { nama: 'Coaching for Line Manager',   peserta: 24,    skor: 8.1, completion: 68, trend: +4 },
          { nama: 'Mentoring KPP/PTB/PCPM',      peserta: 87,    skor: 7.9, completion: 82, trend: +9 },
          { nama: 'Group Support',               peserta: 28,    skor: 8.3, completion: 71, trend: +6 },
        ].map(p => (
          <div key={p.nama} style={{ marginBottom: 14, paddingLeft: p.highlight ? 12 : 0, borderLeft: p.highlight ? `3px solid ${theme.gold}` : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>{p.nama}</div>
                <div style={{ fontSize: 9.5, color: theme.textMuted }}>{p.peserta} peserta aktif</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: fonts.display, fontSize: 20, fontWeight: 400 }}>{p.skor}</span>
                <span style={{ fontSize: 9.5, color: theme.textSubtle }}>/10</span>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: theme.success, marginLeft: 5 }}>+{p.trend}%</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1 }}><ProgressBar value={p.completion} color={p.highlight ? theme.gold : theme.navy}/></div>
              <span style={{ fontFamily: fonts.mono, fontSize: 9.5, color: theme.textMuted, width: 80, textAlign: 'right' }}>{p.completion}% selesai</span>
            </div>
          </div>
        ))}
      </div>

      {/* Highlight Strategis */}
      <div style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 3, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.text, marginBottom: 10, fontFamily: fonts.display }}>Highlight Strategis</div>
          {[
            'DIKSI Coaching completion rate tertinggi periode ini',
            `${participants.filter(p=>p.status==='completed').length} peserta selesai penuh dengan skor >8.5`,
            'Response rate self-reflection 92% — all-time high',
          ].map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 9, fontSize: 10.5, lineHeight: 1.5 }}>
              <Star size={11} style={{ color: theme.gold, fill: theme.gold, flexShrink: 0, marginTop: 2 }}/>
              <span style={{ color: theme.text }}>{h}</span>
            </div>
          ))}
        </div>
        <div style={{ background: theme.warningBg, border: '1px solid #FCD34D', borderRadius: 3, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <AlertCircle size={13} style={{ color: theme.warning }}/>
            <div style={{ fontSize: 11, fontWeight: 600, color: theme.warning }}>Red Flags</div>
          </div>
          <div style={{ fontSize: 10.5, color: theme.text, lineHeight: 1.6 }}>
            · {participants.filter(p => calcProgress(p) < 40).length} peserta DIKSI terindikasi at-risk<br/>
            · Coaching LM perlu review narasumber (6.8)
          </div>
        </div>
      </div>

      {/* Trend chart */}
      <div style={{ gridColumn: 'span 2', background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 3, padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.text, fontFamily: fonts.display }}>Trend Skor Evaluasi · 3 Periode</div>
            <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>Kuantitatif + Kualitatif aggregated</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', height: 160 }}>
          {[
            { periode: '2025 · B1', bars: [{v: 7.4, c: theme.navy}, {v: 7.1, c: theme.gold}, {v: 7.6, c: theme.success}, {v: 7.8, c: '#7C3AED'}] },
            { periode: '2025 · B2', bars: [{v: 8.0, c: theme.navy}, {v: 7.8, c: theme.gold}, {v: 7.7, c: theme.success}, {v: 8.0, c: '#7C3AED'}] },
            { periode: '2026 · B1', bars: [{v: 8.6, c: theme.navy}, {v: 8.1, c: theme.gold}, {v: 7.9, c: theme.success}, {v: 8.3, c: '#7C3AED'}] },
          ].map((p, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: '100%', height: 124, display: 'flex', alignItems: 'flex-end', gap: 2, justifyContent: 'center' }}>
                {p.bars.map((b, j) => (
                  <div key={j} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontFamily: fonts.mono, fontSize: 8.5, color: theme.textSubtle, marginBottom: 2 }}>{b.v}</span>
                    <div style={{ width: '100%', height: `${(b.v/10) * 100}%`, background: b.c, minHeight: 16, borderRadius: '2px 2px 0 0' }}/>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: fonts.mono, fontSize: 9.5, color: theme.textMuted }}>{p.periode}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${theme.border}` }}>
          {[
            { c: theme.navy, l: 'DIKSI' },
            { c: theme.gold, l: 'Coaching LM' },
            { c: theme.success, l: 'Mentoring' },
            { c: '#7C3AED', l: 'Group Support' },
          ].map((b, j) => (
            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9.5 }}>
              <div style={{ width: 9, height: 9, background: b.c, borderRadius: 1 }}/><span>{b.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Distribusi per Satker */}
      <div style={{ gridColumn: 'span 2', background: '#fff', border: `1px solid ${theme.border}`, borderRadius: 3, padding: 18 }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.text, fontFamily: fonts.display }}>Distribusi Peserta DIKSI per Satker</div>
          <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>Berdasarkan penugasan batch berjalan</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {bySatker.map(s => {
            const pct = Math.round((s.count / (total || 1)) * 100);
            return (
              <div key={s.nama} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11 }}>
                <div style={{ width: 80, fontSize: 10.5, fontWeight: 500, color: theme.text }}>{s.nama}</div>
                <div style={{ flex: 1, height: 18, background: theme.bg, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${theme.navy}, ${theme.navyLight})`, transition: 'width 0.3s' }}/>
                  <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: theme.textMuted, fontFamily: fonts.mono }}>{s.count}</span>
                </div>
                <span style={{ fontFamily: fonts.mono, fontSize: 10, color: theme.textMuted, width: 36, textAlign: 'right' }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// GENERIC PLACEHOLDER
// =====================================================================
function Placeholder({ title, desc }) {
  return (
    <div>
      <SectionHeader eyebrow="Modul" title={title} desc={desc}/>
      <div style={{ background: '#fff', border: `1px dashed ${theme.borderStrong}`, padding: 32, textAlign: 'center', borderRadius: 2 }}>
        <div style={{ width: 48, height: 48, background: theme.bg, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
          <FileText size={18} style={{ color: theme.textMuted }}/>
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: theme.text }}>Tampilan detail tersedia pada iterasi berikutnya</div>
        <p style={{ fontSize: 11, color: theme.textMuted, marginTop: 4, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>Modul ini sudah masuk dalam scope implementasi proposal. Silakan request prioritas pengembangan wireframe.</p>
      </div>
    </div>
  );
}

// =====================================================================
// APP SHELL
// =====================================================================
function AppShell() {
  const { role, activeMenu, page, setActiveMenu } = useApp();

  useEffect(() => {
    const menus = MENUS[role] || [];
    if (!menus.find(m => m.id === activeMenu)) setActiveMenu('dashboard');
  }, [role]);

  if (page === 'landing') return <LandingPage/>;

  const render = () => {
    if (role === 'admin') {
      if (activeMenu === 'dashboard')  return <AdminDashboard/>;
      if (activeMenu === 'batches')    return <AdminBatches/>;
      if (activeMenu === 'peserta')    return <AdminPeserta/>;
      if (activeMenu === 'mentorList') return <AdminMentorList/>;
      if (activeMenu === 'tahapan')    return <AdminTahapan/>;
      if (activeMenu === 'wiki')       return <AdminWiki/>;
      if (activeMenu === 'qna')        return <AdminQNA/>;
      return <Placeholder title={MENUS.admin.find(m => m.id === activeMenu)?.label || 'Modul'} desc="Modul akan dibangun pada Turn berikutnya"/>;
    }
    if (role === 'mentor') {
      if (activeMenu === 'dashboard') return <MentorDashboard/>;
      if (activeMenu === 'mentees')   return <MyPesertaHub/>;
      if (activeMenu === 'wiki')      return <MentorWiki/>;
      return <Placeholder title={MENUS.mentor.find(m => m.id === activeMenu)?.label || 'Modul'} desc="Modul mentor lanjutan"/>;
    }
    if (role === 'peserta') {
      if (activeMenu === 'dashboard')   return <PesertaJourney/>;
      if (activeMenu === 'registrasi')  return <PesertaRegistrasi/>;
      if (activeMenu === 'sosialisasi') return <PesertaSosialisasi/>;
      if (activeMenu === 'coaching')    return <PesertaCoaching/>;
      if (activeMenu === 'monitoring')  return <PesertaMonitoring/>;
      if (activeMenu === 'evaluasi')    return <PesertaEvaluasi/>;
      if (activeMenu === 'wiki')        return <PesertaWiki/>;
      if (activeMenu === 'qna')         return <PesertaQNA/>;
      return <Placeholder title={MENUS.peserta.find(m => m.id === activeMenu)?.label} desc="Modul peserta lanjutan"/>;
    }
    if (role === 'board') {
      if (activeMenu === 'dashboard') return <BoardDashboard/>;
      return <Placeholder title={MENUS.board.find(m => m.id === activeMenu)?.label} desc="Modul executive"/>;
    }
  };

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', fontFamily: fonts.body }}>
      <Header/>
      <div style={{ display: 'flex' }}>
        <Sidebar/>
        <main style={{ flex: 1, padding: '28px 32px', maxWidth: 1300, minWidth: 0 }}>{render()}</main>
      </div>
      <Toast/>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        input, textarea, select, button { font-family: inherit; }
      `}</style>
      <AppShell/>
    </AppProvider>
  );
}
