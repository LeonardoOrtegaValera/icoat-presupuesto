import { useState, useMemo, useRef } from 'react';
import {
  Building2, Users, Wrench, Package, Truck, Box, Calculator,
  FileText, Printer, Download, Upload, Plus, Trash2, RotateCcw,
  Calendar, MapPin, User, DollarSign, ChevronDown, ChevronUp,
  ClipboardList, Briefcase, TrendingUp, Hash, Info
} from 'lucide-react';

// ========================================================
// Paleta de colores (espejando los colores del Excel del cliente)
// ========================================================
const C = {
  primary: '#1F4E78',      // azul navy (header / títulos)
  primaryDark: '#163E5F',
  primaryLight: '#2E75B6',
  accent: '#D4A017',       // dorado / amber (acentos)
  accentLight: '#FFE699',  // amarillo suave (totales destacados)
  inputBg: '#FFF2CC',      // amarillo input (igual que el Excel)
  inputText: '#1F4E78',
  bg: '#F8FAFC',
  cardBg: '#FFFFFF',
  border: '#E2E8F0',
  borderDark: '#CBD5E1',
  text: '#1E293B',
  textLight: '#64748B',
  totalBg: '#D9E1F2',      // azul muy claro
};

// ========================================================
// Datos iniciales (mismos del Excel)
// ========================================================
const initialStaff = [
  { id: 1, role: 'Ingeniero de Obra', salaryBiweekly: 1200, qty: 1 },
  { id: 2, role: 'Capataz',           salaryBiweekly:  900, qty: 1 },
  { id: 3, role: 'Técnico',           salaryBiweekly:  800, qty: 2 },
  { id: 4, role: 'Ayudante',          salaryBiweekly:  700, qty: 3 },
];

const initialMachinery = [
  { id: 1,  name: 'Escarificadora',        unit: 'día', cost: 85,  qty: 0, days: 0, notes: 'Preparación de superficie' },
  { id: 2,  name: 'Pulidora de concreto',  unit: 'día', cost: 120, qty: 0, days: 0, notes: 'Pulido fino y semi-pulido' },
  { id: 3,  name: 'Shot Blaster',          unit: 'día', cost: 150, qty: 0, days: 0, notes: 'Granallado mecánico' },
  { id: 4,  name: 'Cortadora de concreto', unit: 'día', cost: 60,  qty: 0, days: 0, notes: 'Cortes de junta' },
  { id: 5,  name: 'Lijadora monoplano',    unit: 'día', cost: 45,  qty: 0, days: 0, notes: '' },
  { id: 6,  name: 'Pulidora flexible',     unit: 'día', cost: 25,  qty: 0, days: 0, notes: 'Equipo manual' },
  { id: 7,  name: 'Aspiradora grande',     unit: 'día', cost: 55,  qty: 0, days: 0, notes: 'HEPA industrial' },
  { id: 8,  name: 'Aspiradora mediana',    unit: 'día', cost: 35,  qty: 0, days: 0, notes: '' },
  { id: 9,  name: 'Generador 30 KVA',      unit: 'día', cost: 90,  qty: 0, days: 0, notes: 'Incluye mantenimiento' },
  { id: 10, name: 'Generador pequeño',     unit: 'día', cost: 40,  qty: 0, days: 0, notes: '5-10 KVA' },
  { id: 11, name: 'Baño portátil',         unit: 'día', cost: 15,  qty: 0, days: 0, notes: 'Por unidad' },
  { id: 12, name: 'Cambiador / Vestidor',  unit: 'día', cost: 20,  qty: 0, days: 0, notes: '' },
  { id: 13, name: 'Oficina trailer',       unit: 'día', cost: 50,  qty: 0, days: 0, notes: '' },
  { id: 14, name: 'Camión mediano',        unit: 'día', cost: 80,  qty: 0, days: 0, notes: 'Transporte de equipos' },
  { id: 15, name: 'Pick-up',               unit: 'día', cost: 45,  qty: 0, days: 0, notes: '' },
  { id: 16, name: 'Combustible',           unit: 'día', cost: 60,  qty: 0, days: 0, notes: 'Estimado diario' },
];

const initialConsumables = [
  { id: 1,  name: 'Felpa 9 pulg.',           unit: 'und', cost: 8,    qty: 0 },
  { id: 2,  name: 'Felpa 18 pulg.',          unit: 'und', cost: 14,   qty: 0 },
  { id: 3,  name: 'Máquina rodillo 9 pulg.', unit: 'und', cost: 12,   qty: 0 },
  { id: 4,  name: 'Máquina rodillo 18 pulg.',unit: 'und', cost: 22,   qty: 0 },
  { id: 5,  name: 'Rodillo de puntas',       unit: 'und', cost: 18,   qty: 0 },
  { id: 6,  name: 'Jalador metálico',        unit: 'und', cost: 35,   qty: 0 },
  { id: 7,  name: 'Cam set',                 unit: 'und', cost: 25,   qty: 0 },
  { id: 8,  name: 'Jalador plástico',        unit: 'und', cost: 15,   qty: 0 },
  { id: 9,  name: 'Squeegee',                unit: 'und', cost: 28,   qty: 0 },
  { id: 10, name: 'Guantes de punto',        unit: 'par', cost: 3.5,  qty: 0 },
  { id: 11, name: 'Guantes de látex',        unit: 'par', cost: 1.2,  qty: 0 },
  { id: 12, name: 'Zapatos de puntas',       unit: 'par', cost: 45,   qty: 0 },
  { id: 13, name: 'Uniforme',                unit: 'und', cost: 35,   qty: 0 },
  { id: 14, name: 'Botas de seguridad',      unit: 'par', cost: 55,   qty: 0 },
  { id: 15, name: 'Trapos / paños',          unit: 'kg',  cost: 4.5,  qty: 0 },
  { id: 16, name: 'Máscara medio rostro',    unit: 'und', cost: 38,   qty: 0 },
  { id: 17, name: 'Filtro de máscara',       unit: 'par', cost: 14,   qty: 0 },
  { id: 18, name: 'Lentes de seguridad',     unit: 'und', cost: 6,    qty: 0 },
];

const initialMobilizations = [
  { id: 1, name: 'Hospedaje',        unit: 'persona/día', cost: 35,  qty: 0, days: 0 },
  { id: 2, name: 'Comidas',          unit: 'persona/día', cost: 18,  qty: 0, days: 0 },
  { id: 3, name: 'Agua potable',     unit: 'persona/día', cost: 2.5, qty: 0, days: 0 },
  { id: 4, name: 'Hielo',            unit: 'día',         cost: 5,   qty: 0, days: 0 },
  { id: 5, name: 'Transporte local', unit: 'día',         cost: 25,  qty: 0, days: 0 },
  { id: 6, name: 'Otros',            unit: 'día',         cost: 10,  qty: 0, days: 0 },
];

const initialMaterials = [
  { id: 1, name: 'Resina epóxica primer',  unit: 'kit',  cost: 180, yield: 40, qty: 0 },
  { id: 2, name: 'Resina epóxica base',    unit: 'kit',  cost: 240, yield: 25, qty: 0 },
  { id: 3, name: 'Resina epóxica acabado', unit: 'kit',  cost: 280, yield: 30, qty: 0 },
  { id: 4, name: 'Mortero epóxico',        unit: 'kit',  cost: 320, yield: 10, qty: 0 },
  { id: 5, name: 'Uretano cementado',      unit: 'kit',  cost: 450, yield: 15, qty: 0 },
  { id: 6, name: 'Pigmento / color',       unit: 'kg',   cost: 45,  yield: 50, qty: 0 },
  { id: 7, name: 'Cuarzo / agregado',      unit: 'saco', cost: 28,  yield: 20, qty: 0 },
  { id: 8, name: 'Solvente / limpiador',   unit: 'gal',  cost: 18,  yield: 0,  qty: 0 },
];

// ========================================================
// Helpers
// ========================================================
const usd = (n) => '$' + (Number(n) || 0).toLocaleString('es-PA', {
  minimumFractionDigits: 2, maximumFractionDigits: 2
});
const num = (n) => (Number(n) || 0).toLocaleString('es-PA', {
  minimumFractionDigits: 0, maximumFractionDigits: 2
});

// ========================================================
// Componente principal
// ========================================================
export default function ICOATApp() {
  const [activeTab, setActiveTab] = useState('proyecto');
  const fileInputRef = useRef(null);

  // -------- Estado del proyecto --------
  const [project, setProject] = useState({
    name: '', client: '', location: '',
    area: 500,
    date: new Date().toISOString().split('T')[0],
    preparedBy: '',
    description: 'Suministro e instalación de piso epóxico de alto desempeño.',
    validityDays: 15,
  });

  const [days, setDays] = useState({ regular: 10, sunday: 2, holiday: 0 });

  // Matriz de horas extras 3×3
  const [heMatrix, setHeMatrix] = useState({
    regular: { diurna: 2, mixta: 0, nocturna: 0 },
    sunday:  { diurna: 2, mixta: 2, nocturna: 0 },
    holiday: { diurna: 0, mixta: 0, nocturna: 0 },
  });

  // Parámetros laborales
  const [params, setParams] = useState({
    weeklyHours: 48,
    daysPerWeek: 6,
    heDiurna: 1.25,
    heMixta: 1.50,
    heNocturna: 1.75,
    sundaySurcharge: 0.50,
    holidaySurcharge: 1.50,
    socialCharges: 0.30,
  });

  const [staff, setStaff] = useState(initialStaff);
  const [machinery, setMachinery] = useState(initialMachinery);
  const [consumables, setConsumables] = useState(initialConsumables);
  const [mobilizations, setMobilizations] = useState(initialMobilizations);
  const [materials, setMaterials] = useState(initialMaterials);

  const [indirects, setIndirects] = useState({
    admin: 0.08,
    general: 0.05,
    contingency: 0.05,
    profit: 0.15,
    itbms: 0.07,
  });

  // ========================================================
  // Cálculos
  // ========================================================
  const totalDays = days.regular + days.sunday + days.holiday;

  const staffCalc = useMemo(() => staff.map(s => {
    const hourly = s.salaryBiweekly / (params.weeklyHours * 2);
    const dailyReg = hourly * (params.weeklyHours / params.daysPerWeek);
    const dailySun = dailyReg * (1 + params.sundaySurcharge);
    const dailyHol = dailyReg * (1 + params.holidaySurcharge);
    const heDiu = hourly * params.heDiurna;
    const heMix = hourly * params.heMixta;
    const heNoc = hourly * params.heNocturna;

    const dayCost = (heRow, daily) =>
      daily + heRow.diurna * heDiu + heRow.mixta * heMix + heRow.nocturna * heNoc;

    const regCost = days.regular * dayCost(heMatrix.regular, dailyReg);
    const sunCost = days.sunday  * dayCost(heMatrix.sunday,  dailySun);
    const holCost = days.holiday * dayCost(heMatrix.holiday, dailyHol);

    const subtotal = s.qty * (regCost + sunCost + holCost);
    const withCharges = subtotal * (1 + params.socialCharges);

    return {
      ...s, hourly, dailyReg, dailySun, dailyHol,
      heDiu, heMix, heNoc, subtotal, withCharges
    };
  }), [staff, params, days, heMatrix]);

  const totalStaff = staffCalc.reduce((a, s) => a + s.withCharges, 0);
  const totalMachinery = machinery.reduce((a, m) => a + m.qty * m.cost * m.days, 0);
  const totalConsumables = consumables.reduce((a, c) => a + c.qty * c.cost, 0);
  const totalMobilizations = mobilizations.reduce((a, m) => a + m.qty * m.cost * m.days, 0);
  const totalMaterials = materials.reduce((a, m) => a + m.qty * m.cost, 0);

  const directs = totalStaff + totalMachinery + totalConsumables + totalMobilizations + totalMaterials;
  const adminCost = directs * indirects.admin;
  const generalCost = directs * indirects.general;
  const contingencyCost = directs * indirects.contingency;
  const profitCost = directs * indirects.profit;
  const subBeforeITBMS = directs + adminCost + generalCost + contingencyCost + profitCost;
  const itbmsCost = subBeforeITBMS * indirects.itbms;
  const grandTotal = subBeforeITBMS + itbmsCost;
  const pricePerSqm = project.area > 0 ? grandTotal / project.area : 0;

  // ========================================================
  // Acciones
  // ========================================================
  const resetAll = () => {
    if (!confirm('¿Restaurar todos los valores a los predeterminados? Se perderán los cambios actuales.')) return;
    setProject({ name: '', client: '', location: '', area: 500,
      date: new Date().toISOString().split('T')[0], preparedBy: '',
      description: 'Suministro e instalación de piso epóxico de alto desempeño.',
      validityDays: 15 });
    setDays({ regular: 10, sunday: 2, holiday: 0 });
    setHeMatrix({
      regular: { diurna: 2, mixta: 0, nocturna: 0 },
      sunday:  { diurna: 2, mixta: 2, nocturna: 0 },
      holiday: { diurna: 0, mixta: 0, nocturna: 0 },
    });
    setStaff(initialStaff);
    setMachinery(initialMachinery);
    setConsumables(initialConsumables);
    setMobilizations(initialMobilizations);
    setMaterials(initialMaterials);
  };

  const exportJSON = () => {
    const data = {
      project, days, heMatrix, params, staff, machinery,
      consumables, mobilizations, materials, indirects,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (project.name || 'presupuesto').replace(/[^a-z0-9]/gi, '_');
    a.download = `ICOAT_${safeName}_${project.date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.project) setProject(d.project);
        if (d.days) setDays(d.days);
        if (d.heMatrix) setHeMatrix(d.heMatrix);
        if (d.params) setParams(d.params);
        if (d.staff) setStaff(d.staff);
        if (d.machinery) setMachinery(d.machinery);
        if (d.consumables) setConsumables(d.consumables);
        if (d.mobilizations) setMobilizations(d.mobilizations);
        if (d.materials) setMaterials(d.materials);
        if (d.indirects) setIndirects(d.indirects);
        alert('Presupuesto cargado correctamente.');
      } catch (err) {
        alert('No se pudo leer el archivo. ¿Es un archivo JSON válido?');
      }
    };
    reader.readAsText(f);
    e.target.value = '';
  };

  const printQuote = () => {
    setActiveTab('cotizacion');
    setTimeout(() => window.print(), 200);
  };

  // ========================================================
  // Tabs
  // ========================================================
  const tabs = [
    { id: 'proyecto',    label: 'Proyecto',    icon: Building2 },
    { id: 'personal',    label: 'Personal',    icon: Users },
    { id: 'recursos',    label: 'Recursos',    icon: Wrench },
    { id: 'presupuesto', label: 'Presupuesto', icon: Calculator },
    { id: 'cotizacion',  label: 'Cotización',  icon: FileText },
  ];

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: C.text, background: C.bg, minHeight: '100vh' }}>
      <style>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        .editable {
          background: ${C.inputBg};
          color: ${C.inputText};
          font-weight: 600;
          border: 1px solid ${C.borderDark};
          border-radius: 6px;
          padding: 6px 10px;
          width: 100%;
          font-size: 14px;
          transition: all 0.15s;
        }
        .editable:focus {
          outline: none;
          border-color: ${C.primary};
          box-shadow: 0 0 0 3px rgba(31,78,120,0.15);
        }
        .text-input {
          background: white;
          border: 1px solid ${C.border};
          border-radius: 6px;
          padding: 8px 12px;
          width: 100%;
          font-size: 14px;
        }
        .text-input:focus {
          outline: none;
          border-color: ${C.primary};
          box-shadow: 0 0 0 3px rgba(31,78,120,0.15);
        }
        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: none;
          transition: all 0.15s;
        }
        .btn-primary { background: ${C.primary}; color: white; }
        .btn-primary:hover { background: ${C.primaryDark}; }
        .btn-accent { background: ${C.accent}; color: white; }
        .btn-accent:hover { filter: brightness(0.92); }
        .btn-ghost { background: transparent; color: ${C.primary}; border: 1px solid ${C.border}; }
        .btn-ghost:hover { background: ${C.bg}; }
        .btn-danger { background: transparent; color: #DC2626; border: 1px solid #FEE2E2; }
        .btn-danger:hover { background: #FEF2F2; }

        table { border-collapse: collapse; width: 100%; }
        th { background: ${C.primary}; color: white; padding: 10px 8px; text-align: left; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        td { padding: 6px 8px; border-bottom: 1px solid ${C.border}; font-size: 14px; vertical-align: middle; }
        tr:hover td { background: #FAFBFC; }
        .tab-btn {
          padding: 14px 20px; font-weight: 600; font-size: 14px;
          color: ${C.textLight}; cursor: pointer; background: transparent;
          border: none; border-bottom: 3px solid transparent;
          display: flex; align-items: center; gap: 8px;
          transition: all 0.15s; white-space: nowrap;
        }
        .tab-btn:hover { color: ${C.primary}; }
        .tab-btn.active { color: ${C.primary}; border-bottom-color: ${C.accent}; }
        .card {
          background: ${C.cardBg};
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03);
          overflow: hidden;
        }
        .card-header {
          background: ${C.primary};
          color: white;
          padding: 14px 20px;
          font-weight: 700;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .card-body { padding: 20px; }
        .stat-card {
          background: white;
          border-radius: 10px;
          border: 1px solid ${C.border};
          padding: 16px 18px;
        }
        .stat-label { font-size: 12px; color: ${C.textLight}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; font-weight: 600; }
        .stat-value { font-size: 22px; font-weight: 800; color: ${C.primary}; }

        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .card { box-shadow: none !important; border: 1px solid #ddd; }
          .card-header { background: ${C.primary} !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          th { background: ${C.primary} !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; color: white !important; }
        }
        .print-only { display: none; }
      `}</style>

      {/* HEADER */}
      <header className="no-print" style={{ background: C.primary, color: 'white', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              background: 'white', borderRadius: 10, padding: '6px 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <img src="/logo.png" alt="ICOAT GROUP" style={{ height: 36, width: 'auto', display: 'block' }} />
            </div>
            <div>
              <div style={{ fontSize: 13, opacity: 0.85, letterSpacing: 0.5 }}>ICOAT GROUP</div>
              <div style={{ fontSize: 14, opacity: 0.75 }}>Sistema de Presupuestos · Pisos Epóxicos</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }} onClick={() => fileInputRef.current?.click()}>
              <Upload size={16} /> Importar
            </button>
            <input ref={fileInputRef} type="file" accept="application/json" onChange={importJSON} style={{ display: 'none' }} />
            <button className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }} onClick={exportJSON}>
              <Download size={16} /> Exportar
            </button>
            <button className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }} onClick={resetAll}>
              <RotateCcw size={16} /> Reiniciar
            </button>
            <button className="btn btn-accent" onClick={printQuote}>
              <Printer size={16} /> Imprimir Cotización
            </button>
          </div>
        </div>
      </header>

      {/* TABS */}
      <nav className="no-print" style={{ background: 'white', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', overflowX: 'auto' }}>
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                <Icon size={18} /> {t.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* MAIN */}
      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px', paddingBottom: 120 }}>

        {/* ========== TAB: PROYECTO ========== */}
        {activeTab === 'proyecto' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
              <div className="card-header"><Building2 size={20} /> Datos del Proyecto</div>
              <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                <Field label="Nombre del proyecto">
                  <input className="text-input" value={project.name}
                    placeholder="Ej. Bodega de almacenamiento - Tocumen"
                    onChange={e => setProject({ ...project, name: e.target.value })} />
                </Field>
                <Field label="Cliente">
                  <input className="text-input" value={project.client}
                    placeholder="Razón social del cliente"
                    onChange={e => setProject({ ...project, client: e.target.value })} />
                </Field>
                <Field label="Ubicación">
                  <input className="text-input" value={project.location}
                    placeholder="Ciudad, Provincia"
                    onChange={e => setProject({ ...project, location: e.target.value })} />
                </Field>
                <Field label="Área a intervenir (m²)">
                  <input className="editable" type="number" min="0" value={project.area}
                    onChange={e => setProject({ ...project, area: parseFloat(e.target.value) || 0 })} />
                </Field>
                <Field label="Fecha">
                  <input className="text-input" type="date" value={project.date}
                    onChange={e => setProject({ ...project, date: e.target.value })} />
                </Field>
                <Field label="Elaborado por">
                  <input className="text-input" value={project.preparedBy}
                    placeholder="Nombre del responsable"
                    onChange={e => setProject({ ...project, preparedBy: e.target.value })} />
                </Field>
                <Field label="Validez (días)">
                  <input className="editable" type="number" min="0" value={project.validityDays}
                    onChange={e => setProject({ ...project, validityDays: parseInt(e.target.value) || 0 })} />
                </Field>
                <Field label="Descripción del trabajo (aparecerá en la cotización)" full>
                  <textarea className="text-input" rows={2} value={project.description}
                    onChange={e => setProject({ ...project, description: e.target.value })} />
                </Field>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><Calendar size={20} /> Duración de la obra</div>
              <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <Field label="Días regulares (Lun-Sáb)">
                  <input className="editable" type="number" min="0" value={days.regular}
                    onChange={e => setDays({ ...days, regular: parseInt(e.target.value) || 0 })} />
                </Field>
                <Field label="Días domingo">
                  <input className="editable" type="number" min="0" value={days.sunday}
                    onChange={e => setDays({ ...days, sunday: parseInt(e.target.value) || 0 })} />
                </Field>
                <Field label="Días feriado">
                  <input className="editable" type="number" min="0" value={days.holiday}
                    onChange={e => setDays({ ...days, holiday: parseInt(e.target.value) || 0 })} />
                </Field>
                <Field label="TOTAL DÍAS">
                  <div style={{ padding: '10px 12px', background: C.totalBg, borderRadius: 6, fontWeight: 700, color: C.primary, textAlign: 'center', fontSize: 18 }}>
                    {totalDays}
                  </div>
                </Field>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><ClipboardList size={20} /> Horas extras estimadas por día (por persona, por turno)</div>
              <div className="card-body">
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: 140 }}>Tipo de día</th>
                        <th>HE Diurna<br /><span style={{ fontWeight: 400, fontSize: 10, opacity: 0.8 }}>hasta 6:00 PM</span></th>
                        <th>HE Mixta<br /><span style={{ fontWeight: 400, fontSize: 10, opacity: 0.8 }}>6:00 PM - 9:00 PM</span></th>
                        <th>HE Nocturna<br /><span style={{ fontWeight: 400, fontSize: 10, opacity: 0.8 }}>9:00 PM en adelante</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['regular', 'Día regular'],
                        ['sunday',  'Día domingo'],
                        ['holiday', 'Día feriado'],
                      ].map(([key, label]) => (
                        <tr key={key}>
                          <td style={{ fontWeight: 600, background: C.bgDark }}>{label}</td>
                          {['diurna', 'mixta', 'nocturna'].map(t => (
                            <td key={t}>
                              <input className="editable" type="number" step="0.5" min="0"
                                value={heMatrix[key][t]}
                                onChange={e => setHeMatrix({
                                  ...heMatrix,
                                  [key]: { ...heMatrix[key], [t]: parseFloat(e.target.value) || 0 }
                                })}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ marginTop: 12, fontSize: 12, color: C.textLight, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Info size={14} /> Multiplicadores: HE Diurna ×{params.heDiurna}, HE Mixta ×{params.heMixta}, HE Nocturna ×{params.heNocturna} sobre la hora ordinaria. Editables en la pestaña Personal.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========== TAB: PERSONAL ========== */}
        {activeTab === 'personal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
              <div className="card-header"><Briefcase size={20} /> Parámetros laborales</div>
              <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <Field label="Jornada semanal (horas)">
                  <input className="editable" type="number" value={params.weeklyHours}
                    onChange={e => setParams({ ...params, weeklyHours: parseFloat(e.target.value) || 0 })} />
                </Field>
                <Field label="Días laborables por semana">
                  <input className="editable" type="number" value={params.daysPerWeek}
                    onChange={e => setParams({ ...params, daysPerWeek: parseFloat(e.target.value) || 0 })} />
                </Field>
                <Field label="Recargo HE Diurna (hasta 6PM)">
                  <input className="editable" type="number" step="0.05" value={params.heDiurna}
                    onChange={e => setParams({ ...params, heDiurna: parseFloat(e.target.value) || 0 })} />
                </Field>
                <Field label="Recargo HE Mixta (6PM - 9PM)">
                  <input className="editable" type="number" step="0.05" value={params.heMixta}
                    onChange={e => setParams({ ...params, heMixta: parseFloat(e.target.value) || 0 })} />
                </Field>
                <Field label="Recargo HE Nocturna (9PM+)">
                  <input className="editable" type="number" step="0.05" value={params.heNocturna}
                    onChange={e => setParams({ ...params, heNocturna: parseFloat(e.target.value) || 0 })} />
                </Field>
                <Field label="Recargo día domingo">
                  <input className="editable" type="number" step="0.05" value={params.sundaySurcharge}
                    onChange={e => setParams({ ...params, sundaySurcharge: parseFloat(e.target.value) || 0 })} />
                </Field>
                <Field label="Recargo día feriado">
                  <input className="editable" type="number" step="0.05" value={params.holidaySurcharge}
                    onChange={e => setParams({ ...params, holidaySurcharge: parseFloat(e.target.value) || 0 })} />
                </Field>
                <Field label="Cargas sociales / prestaciones">
                  <input className="editable" type="number" step="0.05" value={params.socialCharges}
                    onChange={e => setParams({ ...params, socialCharges: parseFloat(e.target.value) || 0 })} />
                </Field>
              </div>
            </div>

            <div className="card">
              <div className="card-header" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Users size={20} /> Cargos y salarios</div>
                <button className="btn btn-accent" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => {
                  const id = Math.max(0, ...staff.map(s => s.id)) + 1;
                  setStaff([...staff, { id, role: 'Nuevo cargo', salaryBiweekly: 500, qty: 0 }]);
                }}>
                  <Plus size={14} /> Agregar cargo
                </button>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Cargo</th>
                        <th>Salario Quincenal</th>
                        <th>Cant.</th>
                        <th>Costo Día</th>
                        <th>Día Domingo</th>
                        <th>Día Feriado</th>
                        <th>HE Diurna</th>
                        <th>HE Mixta</th>
                        <th>HE Nocturna</th>
                        <th>Subtotal c/cargas</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffCalc.map((s, i) => (
                        <tr key={s.id}>
                          <td>{i + 1}</td>
                          <td>
                            <input className="text-input" style={{ minWidth: 160 }} value={s.role}
                              onChange={e => setStaff(staff.map(x => x.id === s.id ? { ...x, role: e.target.value } : x))} />
                          </td>
                          <td>
                            <input className="editable" type="number" style={{ width: 100 }} value={s.salaryBiweekly}
                              onChange={e => setStaff(staff.map(x => x.id === s.id ? { ...x, salaryBiweekly: parseFloat(e.target.value) || 0 } : x))} />
                          </td>
                          <td>
                            <input className="editable" type="number" style={{ width: 60 }} value={s.qty}
                              onChange={e => setStaff(staff.map(x => x.id === s.id ? { ...x, qty: parseInt(e.target.value) || 0 } : x))} />
                          </td>
                          <td style={{ color: C.textLight }}>{usd(s.dailyReg)}</td>
                          <td style={{ color: C.textLight }}>{usd(s.dailySun)}</td>
                          <td style={{ color: C.textLight }}>{usd(s.dailyHol)}</td>
                          <td style={{ color: C.textLight }}>{usd(s.heDiu)}</td>
                          <td style={{ color: C.textLight }}>{usd(s.heMix)}</td>
                          <td style={{ color: C.textLight }}>{usd(s.heNoc)}</td>
                          <td style={{ fontWeight: 700, color: C.primary, background: C.totalBg }}>{usd(s.withCharges)}</td>
                          <td>
                            <button className="btn btn-danger" style={{ padding: '4px 8px' }}
                              onClick={() => setStaff(staff.filter(x => x.id !== s.id))}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr style={{ background: C.accentLight }}>
                        <td colSpan={10} style={{ textAlign: 'right', fontWeight: 700 }}>TOTAL PERSONAL</td>
                        <td style={{ fontWeight: 800, color: C.primary, fontSize: 16 }}>{usd(totalStaff)}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== TAB: RECURSOS ========== */}
        {activeTab === 'recursos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <ResourceTable
              title="Maquinarias y Equipos"
              icon={Wrench}
              items={machinery}
              setItems={setMachinery}
              columns={['name', 'unit', 'cost', 'qty', 'days', 'notes']}
              showDays
              totalDays={totalDays}
              total={totalMachinery}
            />
            <ResourceTable
              title="Consumibles"
              icon={Package}
              items={consumables}
              setItems={setConsumables}
              columns={['name', 'unit', 'cost', 'qty']}
              total={totalConsumables}
            />
            <ResourceTable
              title="Movilizaciones"
              icon={Truck}
              items={mobilizations}
              setItems={setMobilizations}
              columns={['name', 'unit', 'cost', 'qty', 'days']}
              showDays
              totalDays={totalDays}
              total={totalMobilizations}
            />
            <ResourceTable
              title="Materiales"
              icon={Box}
              items={materials}
              setItems={setMaterials}
              columns={['name', 'unit', 'cost', 'yield', 'qty']}
              hasYield
              total={totalMaterials}
            />
          </div>
        )}

        {/* ========== TAB: PRESUPUESTO ========== */}
        {activeTab === 'presupuesto' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              <Stat label="Costo Directo" value={usd(directs)} />
              <Stat label="Costos Indirectos + Utilidad" value={usd(adminCost + generalCost + contingencyCost + profitCost)} />
              <Stat label="ITBMS (7%)" value={usd(itbmsCost)} />
              <Stat label="TOTAL DE VENTA" value={usd(grandTotal)} highlight />
              <Stat label="Precio por m²" value={usd(pricePerSqm)} />
            </div>

            <div className="card">
              <div className="card-header"><Calculator size={20} /> Desglose de Costos Directos</div>
              <div className="card-body" style={{ padding: 0 }}>
                <table>
                  <thead>
                    <tr><th>#</th><th>Rubro</th><th style={{ textAlign: 'right' }}>Monto (USD)</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>1</td><td>Personal (con cargas sociales)</td><td style={{ textAlign: 'right', fontWeight: 600 }}>{usd(totalStaff)}</td></tr>
                    <tr><td>2</td><td>Maquinarias y equipos</td><td style={{ textAlign: 'right', fontWeight: 600 }}>{usd(totalMachinery)}</td></tr>
                    <tr><td>3</td><td>Consumibles</td><td style={{ textAlign: 'right', fontWeight: 600 }}>{usd(totalConsumables)}</td></tr>
                    <tr><td>4</td><td>Movilizaciones</td><td style={{ textAlign: 'right', fontWeight: 600 }}>{usd(totalMobilizations)}</td></tr>
                    <tr><td>5</td><td>Materiales</td><td style={{ textAlign: 'right', fontWeight: 600 }}>{usd(totalMaterials)}</td></tr>
                    <tr style={{ background: C.totalBg }}>
                      <td colSpan={2} style={{ fontWeight: 700, textAlign: 'right' }}>SUBTOTAL COSTOS DIRECTOS</td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: C.primary, fontSize: 16 }}>{usd(directs)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><TrendingUp size={20} /> Costos Indirectos, Utilidad e Impuestos</div>
              <div className="card-body" style={{ padding: 0 }}>
                <table>
                  <thead>
                    <tr><th>#</th><th>Rubro</th><th style={{ width: 140 }}>%</th><th style={{ textAlign: 'right' }}>Monto (USD)</th></tr>
                  </thead>
                  <tbody>
                    {[
                      ['admin', 'Gastos administrativos (overhead)', adminCost],
                      ['general', 'Gastos generales de obra', generalCost],
                      ['contingency', 'Imprevistos / contingencia', contingencyCost],
                      ['profit', 'Utilidad', profitCost],
                    ].map(([k, label, amount], i) => (
                      <tr key={k}>
                        <td>{i + 1}</td>
                        <td>{label}</td>
                        <td><input className="editable" type="number" step="0.01" value={indirects[k]}
                          onChange={e => setIndirects({ ...indirects, [k]: parseFloat(e.target.value) || 0 })} /></td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{usd(amount)}</td>
                      </tr>
                    ))}
                    <tr style={{ background: C.totalBg }}>
                      <td colSpan={3} style={{ fontWeight: 700, textAlign: 'right' }}>SUBTOTAL ANTES DE ITBMS</td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: C.primary }}>{usd(subBeforeITBMS)}</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>ITBMS</td>
                      <td><input className="editable" type="number" step="0.01" value={indirects.itbms}
                        onChange={e => setIndirects({ ...indirects, itbms: parseFloat(e.target.value) || 0 })} /></td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{usd(itbmsCost)}</td>
                    </tr>
                    <tr style={{ background: C.accentLight }}>
                      <td colSpan={3} style={{ fontWeight: 800, textAlign: 'right', fontSize: 16 }}>TOTAL PRESUPUESTO DE VENTA</td>
                      <td style={{ textAlign: 'right', fontWeight: 900, color: C.primary, fontSize: 20 }}>{usd(grandTotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><Hash size={20} /> Indicadores</div>
              <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: C.textLight, marginBottom: 4 }}>Precio por m²</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.primary }}>{usd(pricePerSqm)}/m²</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: C.textLight, marginBottom: 4 }}>Costo directo por m²</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.primary }}>{usd(project.area > 0 ? directs / project.area : 0)}/m²</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: C.textLight, marginBottom: 4 }}>Margen de utilidad</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.primary }}>
                    {grandTotal > 0 ? ((profitCost / grandTotal) * 100).toFixed(1) : 0}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: C.textLight, marginBottom: 4 }}>Días totales de obra</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.primary }}>{totalDays}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== TAB: COTIZACIÓN ========== */}
        {activeTab === 'cotizacion' && (
          <QuoteView
            project={project}
            grandTotal={grandTotal}
            subBeforeITBMS={subBeforeITBMS}
            itbmsCost={itbmsCost}
            pricePerSqm={pricePerSqm}
            totalDays={totalDays}
            itbmsRate={indirects.itbms}
          />
        )}
      </main>

      {/* FOOTER STICKY: total siempre visible */}
      <div className="no-print" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white', borderTop: `2px solid ${C.primary}`,
        padding: '12px 24px', boxShadow: '0 -4px 12px rgba(0,0,0,0.08)',
        zIndex: 20
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 11, color: C.textLight, textTransform: 'uppercase', fontWeight: 600 }}>Costos directos</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{usd(directs)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.textLight, textTransform: 'uppercase', fontWeight: 600 }}>Precio por m²</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{usd(pricePerSqm)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.textLight, textTransform: 'uppercase', fontWeight: 600 }}>Total de venta</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.primary }}>{usd(grandTotal)}</div>
            </div>
          </div>
          <button className="btn btn-accent" onClick={printQuote}>
            <FileText size={16} /> Ver cotización
          </button>
        </div>
      </div>
    </div>
  );
}

// ========================================================
// Sub-componentes
// ========================================================
function Field({ label, children, full }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.textLight, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div className="stat-card" style={highlight ? { background: C.accentLight, borderColor: C.accent } : {}}>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={highlight ? { fontSize: 26 } : {}}>{value}</div>
    </div>
  );
}

function ResourceTable({ title, icon: Icon, items, setItems, columns, showDays, totalDays, hasYield, total }) {
  const updateItem = (id, key, value) => {
    setItems(items.map(x => x.id === id ? { ...x, [key]: value } : x));
  };
  const removeItem = (id) => setItems(items.filter(x => x.id !== id));
  const addItem = () => {
    const id = Math.max(0, ...items.map(x => x.id)) + 1;
    const base = { id, name: 'Nuevo ítem', unit: 'und', cost: 0, qty: 0 };
    if (showDays) base.days = 0;
    if (hasYield) base.yield = 0;
    setItems([...items, base]);
  };

  return (
    <div className="card">
      <div className="card-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Icon size={20} /> {title}</div>
        <button className="btn btn-accent" style={{ padding: '6px 12px', fontSize: 13 }} onClick={addItem}>
          <Plus size={14} /> Agregar
        </button>
      </div>
      <div className="card-body" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Descripción</th>
                <th style={{ width: 90 }}>Unidad</th>
                <th style={{ width: 130 }}>Costo Unit.</th>
                {hasYield && <th style={{ width: 120 }}>Rend. m²/und</th>}
                <th style={{ width: 90 }}>Cantidad</th>
                {showDays && <th style={{ width: 100 }}>Días uso</th>}
                <th style={{ width: 140, textAlign: 'right' }}>Subtotal</th>
                <th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => {
                const subtotal = showDays ? it.qty * it.cost * it.days : it.qty * it.cost;
                return (
                  <tr key={it.id}>
                    <td>{i + 1}</td>
                    <td>
                      <input className="text-input" style={{ minWidth: 180 }} value={it.name}
                        onChange={e => updateItem(it.id, 'name', e.target.value)} />
                    </td>
                    <td>
                      <input className="text-input" style={{ width: 80 }} value={it.unit}
                        onChange={e => updateItem(it.id, 'unit', e.target.value)} />
                    </td>
                    <td>
                      <input className="editable" type="number" step="0.01" value={it.cost}
                        onChange={e => updateItem(it.id, 'cost', parseFloat(e.target.value) || 0)} />
                    </td>
                    {hasYield && (
                      <td>
                        <input className="editable" type="number" step="0.1" value={it.yield}
                          onChange={e => updateItem(it.id, 'yield', parseFloat(e.target.value) || 0)} />
                      </td>
                    )}
                    <td>
                      <input className="editable" type="number" step="0.5" value={it.qty}
                        onChange={e => updateItem(it.id, 'qty', parseFloat(e.target.value) || 0)} />
                    </td>
                    {showDays && (
                      <td>
                        <input className="editable" type="number" value={it.days}
                          onChange={e => updateItem(it.id, 'days', parseInt(e.target.value) || 0)}
                          placeholder={String(totalDays)} />
                      </td>
                    )}
                    <td style={{ textAlign: 'right', fontWeight: 700, color: C.primary }}>{usd(subtotal)}</td>
                    <td>
                      <button className="btn btn-danger" style={{ padding: '4px 8px' }} onClick={() => removeItem(it.id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              <tr style={{ background: C.accentLight }}>
                <td colSpan={(showDays ? 7 : 6) + (hasYield ? 1 : 0)} style={{ textAlign: 'right', fontWeight: 700 }}>
                  TOTAL {title.toUpperCase()}
                </td>
                <td style={{ textAlign: 'right', fontWeight: 800, color: C.primary, fontSize: 16 }}>{usd(total)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function QuoteView({ project, grandTotal, subBeforeITBMS, itbmsCost, pricePerSqm, totalDays, itbmsRate }) {
  const validUntil = new Date(project.date);
  validUntil.setDate(validUntil.getDate() + (project.validityDays || 0));

  return (
    <div className="card" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ background: C.primary, color: 'white', padding: '32px 40px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{
              background: 'white', borderRadius: 12, padding: '12px 18px',
              display: 'flex', alignItems: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}>
              <img src="/logo.png" alt="ICOAT GROUP" style={{ height: 52, width: 'auto', display: 'block' }} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>ICOAT GROUP</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Soluciones en pisos epóxicos de alto desempeño</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Cotización</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>N° {project.date.replace(/-/g, '')}</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>Fecha: {project.date}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 28, padding: 20, background: C.bg, borderRadius: 10, borderLeft: `4px solid ${C.accent}` }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Cliente</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.primary }}>{project.client || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Proyecto</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{project.name || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Ubicación</div>
            <div style={{ fontSize: 16, color: C.text }}>{project.location || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Área a intervenir</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{num(project.area)} m²</div>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.primary, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${C.accent}` }}>
            Descripción del trabajo
          </h3>
          <p style={{ fontSize: 15, color: C.text, lineHeight: 1.6 }}>{project.description}</p>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.primary, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${C.accent}` }}>
            Alcance
          </h3>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                  <strong>Suministro e instalación de sistema epóxico</strong> sobre superficie de concreto preparada.
                </td>
                <td style={{ padding: '10px 0', borderBottom: `1px solid ${C.border}`, textAlign: 'right', fontWeight: 600 }}>
                  {num(project.area)} m²
                </td>
              </tr>
              <tr>
                <td style={{ padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>Duración estimada de obra</td>
                <td style={{ padding: '10px 0', borderBottom: `1px solid ${C.border}`, textAlign: 'right', fontWeight: 600 }}>
                  {totalDays} días
                </td>
              </tr>
              <tr>
                <td style={{ padding: '10px 0' }}>Precio por metro cuadrado</td>
                <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 600 }}>{usd(pricePerSqm)}/m²</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginBottom: 28, background: C.bg, padding: 24, borderRadius: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 15 }}>Subtotal</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{usd(subBeforeITBMS)}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 15 }}>ITBMS ({(itbmsRate * 100).toFixed(0)}%)</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{usd(itbmsCost)}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0 4px', borderTop: `2px solid ${C.primary}`, marginTop: 6 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>TOTAL</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.primary }}>{usd(grandTotal)}</div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.primary, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${C.accent}` }}>
            Condiciones comerciales
          </h3>
          <ul style={{ fontSize: 14, color: C.text, lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Precios en dólares de los Estados Unidos de América (USD), incluyen ITBMS.</li>
            <li>Validez de la presente oferta: <strong>{project.validityDays} días</strong> a partir de la fecha de emisión ({validUntil.toISOString().split('T')[0]}).</li>
            <li>Forma de pago: 50% de anticipo a la firma de la orden de compra; 50% contra entrega del trabajo terminado.</li>
            <li>Plazo de ejecución estimado: <strong>{totalDays} días calendario</strong> a partir de la entrega del sitio en condiciones.</li>
            <li>El cliente debe garantizar acceso al sitio, suministro de energía eléctrica 110/220 V y agua potable.</li>
            <li>Cualquier obra adicional no contemplada será cotizada por separado y aprobada antes de su ejecución.</li>
          </ul>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 60, paddingTop: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: `1px solid ${C.text}`, paddingTop: 8, fontSize: 13, color: C.textLight }}>
              <strong>{project.preparedBy || 'Representante ICOAT GROUP'}</strong><br />
              ICOAT GROUP
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: `1px solid ${C.text}`, paddingTop: 8, fontSize: 13, color: C.textLight }}>
              <strong>Aceptado por el cliente</strong><br />
              {project.client || '—'}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.textLight, textAlign: 'center' }}>
          ICOAT GROUP · Pisos Epóxicos · República de Panamá
        </div>
      </div>
    </div>
  );
}
