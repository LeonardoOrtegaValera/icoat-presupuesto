import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Building2, Users, Wrench, Package, Truck, Box, Calculator,
  FileText, Printer, Download, Upload, Plus, Trash2, RotateCcw,
  Calendar, MapPin, User, DollarSign, ChevronDown, ChevronUp,
  ClipboardList, Briefcase, TrendingUp, Hash, Info,
  Save, FolderOpen, Copy, Edit3, Search, CheckCircle2, Clock,
  XCircle, Send, AlertCircle, MoreHorizontal, Database
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

// Condiciones comerciales por defecto (editables por el usuario)
const DEFAULT_CONDITIONS = [
  "Precios en dólares de los Estados Unidos de América (USD), incluyen ITBMS.",
  "Validez de la presente oferta: 15 días a partir de la fecha de emisión.",
  "Forma de pago: 50% de anticipo a la firma de la orden de compra; 50% contra entrega del trabajo terminado.",
  "Plazo de ejecución estimado a partir de la entrega del sitio en condiciones óptimas para la ejecución del trabajo.",
  "El cliente debe garantizar acceso al sitio, suministro de energía eléctrica 110/220 V y agua potable.",
  "Cualquier obra adicional no contemplada será cotizada por separado y aprobada antes de su ejecución.",
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
// localStorage — Gestión de cotizaciones guardadas
// ========================================================
const STORAGE_KEY = 'icoat_quotes_v1';
const COUNTER_KEY = 'icoat_counter_v1';

const STATUS_OPTIONS = ['Borrador', 'Enviada', 'Aprobada', 'Rechazada'];

const STATUS_STYLE = {
  'Borrador':  { bg: '#FEF3C7', color: '#92400E', icon: Edit3 },
  'Enviada':   { bg: '#DBEAFE', color: '#1E40AF', icon: Send },
  'Aprobada':  { bg: '#D1FAE5', color: '#065F46', icon: CheckCircle2 },
  'Rechazada': { bg: '#FEE2E2', color: '#991B1B', icon: XCircle },
};

function loadAllQuotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error al cargar cotizaciones:', e);
    return [];
  }
}

function saveAllQuotes(quotes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    return true;
  } catch (e) {
    console.error('Error al guardar cotizaciones:', e);
    alert('No se pudo guardar. El navegador puede estar lleno o tener bloqueado el almacenamiento.');
    return false;
  }
}

function getNextQuoteNumber() {
  try {
    const year = new Date().getFullYear();
    const counterData = JSON.parse(localStorage.getItem(COUNTER_KEY) || '{}');
    const current = counterData[year] || 0;
    const next = current + 1;
    counterData[year] = next;
    localStorage.setItem(COUNTER_KEY, JSON.stringify(counterData));
    return `COT-${year}-${String(next).padStart(3, '0')}`;
  } catch (e) {
    return `COT-${new Date().getFullYear()}-001`;
  }
}

function generateId() {
  return 'q_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
}

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

  const [conditions, setConditions] = useState(DEFAULT_CONDITIONS);

  // ----- Estado para gestión de cotizaciones guardadas -----
  const [currentQuoteId, setCurrentQuoteId] = useState(null);
  const [quoteNumber, setQuoteNumber] = useState(null);
  const [quoteStatus, setQuoteStatus] = useState('Borrador');
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todas');
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState(null);

  // Cargar cotizaciones guardadas al iniciar
  useEffect(() => {
    setSavedQuotes(loadAllQuotes());
  }, []);

  // Auto-seleccionar el contenido de las celdas editables (amarillas) al hacer focus.
  // Soluciona el problema donde el "0" no se reemplaza al escribir y queda como "015".
  useEffect(() => {
    const handler = (e) => {
      if (e.target.matches && e.target.matches('input.editable')) {
        // setTimeout para que ocurra después de que el browser termine el focus
        setTimeout(() => {
          try {
            if (e.target.type === 'number') {
              // Para inputs number, cambiar momentáneamente a text para poder seleccionar
              const originalType = e.target.type;
              e.target.type = 'text';
              e.target.select();
              e.target.type = originalType;
            } else {
              e.target.select();
            }
          } catch (err) { /* algunos browsers no soportan select en number, ignorar */ }
        }, 0);
      }
    };
    document.addEventListener('focusin', handler);
    return () => document.removeEventListener('focusin', handler);
  }, []);

  // Snapshot del estado actual (para comparar y detectar cambios)
  const currentSnapshot = useMemo(() => JSON.stringify({
    project, days, heMatrix, params, staff, machinery,
    consumables, mobilizations, materials, indirects, conditions
  }), [project, days, heMatrix, params, staff, machinery,
       consumables, mobilizations, materials, indirects, conditions]);

  const hasUnsavedChanges = currentQuoteId !== null && lastSavedSnapshot !== null
    && currentSnapshot !== lastSavedSnapshot;
  const isNewQuote = currentQuoteId === null;

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
    setConditions(DEFAULT_CONDITIONS);
  };

  const exportJSON = () => {
    const data = {
      project, days, heMatrix, params, staff, machinery,
      consumables, mobilizations, materials, indirects, conditions,
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
        if (d.conditions) setConditions(d.conditions);
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
  // Gestión de cotizaciones guardadas (localStorage)
  // ========================================================
  const getCurrentDataObject = () => ({
    project, days, heMatrix, params, staff, machinery,
    consumables, mobilizations, materials, indirects, conditions
  });

  const loadDataIntoState = (data) => {
    if (data.project) setProject(data.project);
    if (data.days) setDays(data.days);
    if (data.heMatrix) setHeMatrix(data.heMatrix);
    if (data.params) setParams(data.params);
    if (data.staff) setStaff(data.staff);
    if (data.machinery) setMachinery(data.machinery);
    if (data.consumables) setConsumables(data.consumables);
    if (data.mobilizations) setMobilizations(data.mobilizations);
    if (data.materials) setMaterials(data.materials);
    if (data.indirects) setIndirects(data.indirects);
    if (data.conditions) setConditions(data.conditions);
  };

  const saveCurrentQuote = () => {
    const now = new Date().toISOString();
    const allQuotes = loadAllQuotes();

    if (currentQuoteId) {
      // Actualizar cotización existente
      const idx = allQuotes.findIndex(q => q.id === currentQuoteId);
      if (idx >= 0) {
        allQuotes[idx] = {
          ...allQuotes[idx],
          quoteNumber,
          status: quoteStatus,
          total: grandTotal,
          updatedAt: now,
          data: getCurrentDataObject(),
        };
        if (saveAllQuotes(allQuotes)) {
          setSavedQuotes(allQuotes);
          setLastSavedSnapshot(currentSnapshot);
          alert(`Cotización ${quoteNumber} actualizada correctamente.`);
        }
        return;
      }
    }

    // Crear nueva cotización
    const newNumber = quoteNumber || getNextQuoteNumber();
    const newId = generateId();
    const newQuote = {
      id: newId,
      quoteNumber: newNumber,
      status: quoteStatus,
      total: grandTotal,
      createdAt: now,
      updatedAt: now,
      data: getCurrentDataObject(),
    };
    allQuotes.unshift(newQuote);
    if (saveAllQuotes(allQuotes)) {
      setSavedQuotes(allQuotes);
      setCurrentQuoteId(newId);
      setQuoteNumber(newNumber);
      setLastSavedSnapshot(currentSnapshot);
      alert(`Cotización ${newNumber} guardada correctamente.`);
    }
  };

  const loadQuoteById = (id) => {
    if (hasUnsavedChanges && !confirm(
      'Tienes cambios sin guardar en la cotización actual. ¿Descartar y abrir la otra?'
    )) return;
    const allQuotes = loadAllQuotes();
    const q = allQuotes.find(x => x.id === id);
    if (!q) {
      alert('No se encontró la cotización.');
      return;
    }
    loadDataIntoState(q.data);
    setCurrentQuoteId(q.id);
    setQuoteNumber(q.quoteNumber);
    setQuoteStatus(q.status || 'Borrador');
    setLastSavedSnapshot(JSON.stringify(q.data));
    setActiveTab('proyecto');
  };

  const deleteQuoteById = (id) => {
    const allQuotes = loadAllQuotes();
    const q = allQuotes.find(x => x.id === id);
    if (!q) return;
    if (!confirm(`¿Eliminar la cotización ${q.quoteNumber} (${q.data?.project?.client || 'sin cliente'})? Esta acción no se puede deshacer.`)) return;
    const filtered = allQuotes.filter(x => x.id !== id);
    if (saveAllQuotes(filtered)) {
      setSavedQuotes(filtered);
      if (currentQuoteId === id) {
        // La cotización abierta fue eliminada → empezar una nueva
        startNewQuote(true);
      }
    }
  };

  const duplicateQuoteById = (id) => {
    const allQuotes = loadAllQuotes();
    const q = allQuotes.find(x => x.id === id);
    if (!q) return;
    const newNumber = getNextQuoteNumber();
    const newId = generateId();
    const now = new Date().toISOString();
    const copy = {
      id: newId,
      quoteNumber: newNumber,
      status: 'Borrador',
      total: q.total,
      createdAt: now,
      updatedAt: now,
      data: JSON.parse(JSON.stringify(q.data)), // deep copy
    };
    // Ajustar fecha del proyecto a hoy
    copy.data.project.date = new Date().toISOString().split('T')[0];
    allQuotes.unshift(copy);
    if (saveAllQuotes(allQuotes)) {
      setSavedQuotes(allQuotes);
      alert(`Se creó una copia: ${newNumber}. Ábrela desde la lista para editarla.`);
    }
  };

  const changeQuoteStatus = (id, newStatus) => {
    const allQuotes = loadAllQuotes();
    const idx = allQuotes.findIndex(x => x.id === id);
    if (idx < 0) return;
    allQuotes[idx].status = newStatus;
    allQuotes[idx].updatedAt = new Date().toISOString();
    if (saveAllQuotes(allQuotes)) {
      setSavedQuotes(allQuotes);
      if (currentQuoteId === id) setQuoteStatus(newStatus);
    }
  };

  const startNewQuote = (skipConfirm = false) => {
    if (!skipConfirm && hasUnsavedChanges) {
      if (!confirm('Tienes cambios sin guardar. ¿Descartar y empezar una nueva cotización?')) return;
    }
    setProject({
      name: '', client: '', location: '', area: 500,
      date: new Date().toISOString().split('T')[0], preparedBy: '',
      description: 'Suministro e instalación de piso epóxico de alto desempeño.',
      validityDays: 15
    });
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
    setConditions(DEFAULT_CONDITIONS);
    setCurrentQuoteId(null);
    setQuoteNumber(null);
    setQuoteStatus('Borrador');
    setLastSavedSnapshot(null);
    setActiveTab('proyecto');
  };

  // ========================================================
  // Tabs
  // ========================================================
  const tabs = [
    { id: 'cotizaciones', label: 'Mis Cotizaciones', icon: Database },
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
          /* Papel carta (8.5" x 11") con márgenes ajustados */
          @page {
            size: letter;
            margin: 0.4in 0.5in;
          }
          html, body {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print { display: none !important; }
          .print-only { display: block !important; }

          /* Quitar paddings del contenedor principal y centrarlo */
          main { padding: 0 !important; max-width: 100% !important; }

          /* Cotización: contenedor */
          .quote-card {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            margin: 0 !important;
          }

          /* HEADER de la cotización: más compacto */
          .quote-header {
            padding: 14px 20px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            break-inside: avoid !important;
          }
          .quote-header-left { gap: 12px !important; }
          .quote-logo-box {
            padding: 6px 10px !important;
            border-radius: 8px !important;
            box-shadow: none !important;
          }
          .quote-logo-img { height: 36px !important; }
          .quote-title-main { font-size: 16px !important; }
          .quote-title-sub { font-size: 10px !important; }
          .quote-number-value { font-size: 16px !important; }
          .quote-number > div:nth-child(1) { font-size: 9px !important; }
          .quote-number > div:nth-child(3) { font-size: 10px !important; margin-top: 2px !important; }

          /* CUERPO: reducir padding */
          .quote-body { padding: 16px 20px 12px !important; }

          /* INFO (cliente/proyecto/ubicación/área): compactar */
          .quote-info {
            gap: 10px 18px !important;
            margin-bottom: 12px !important;
            padding: 10px 14px !important;
            border-radius: 6px !important;
            break-inside: avoid !important;
          }
          .quote-info > div > div:first-child {
            font-size: 9px !important;
            margin-bottom: 2px !important;
          }
          .quote-info-value { font-size: 13px !important; }

          /* SECCIONES: márgenes mínimos */
          .quote-section {
            margin-bottom: 12px !important;
            break-inside: avoid !important;
          }
          .quote-section-title {
            font-size: 13px !important;
            margin-bottom: 6px !important;
            padding-bottom: 4px !important;
          }
          .quote-description { font-size: 12px !important; line-height: 1.4 !important; }

          /* TABLA DE ALCANCE: filas más compactas */
          .quote-scope-table td { padding: 5px 0 !important; font-size: 12px !important; }

          /* TOTALES: compactar */
          .quote-totals {
            padding: 10px 14px !important;
            margin-bottom: 12px !important;
            border-radius: 6px !important;
            break-inside: avoid !important;
          }
          .quote-totals > div { padding: 4px 0 !important; }
          .quote-totals > div > div { font-size: 12px !important; }
          .quote-total-row { padding: 8px 0 2px !important; margin-top: 2px !important; }
          .quote-total-row > div:first-child { font-size: 14px !important; }
          .quote-total-amount { font-size: 20px !important; }

          /* CONDICIONES: lista compacta */
          .quote-conditions { margin-bottom: 12px !important; }
          .quote-conditions-list { font-size: 11px !important; line-height: 1.35 !important; padding-left: 16px !important; }
          .quote-conditions-list li { margin-bottom: 2px !important; }

          /* FIRMAS: con espacio real para firmar arriba de la línea */
          .quote-signatures {
            margin-top: 40px !important;
            padding-top: 0 !important;
            gap: 50px !important;
            break-inside: avoid !important;
          }
          .quote-signatures > div {
            min-height: 110px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-end !important;
          }
          .quote-signatures > div > div {
            padding-top: 8px !important;
            font-size: 11px !important;
          }

          /* PIE: pequeño */
          .quote-footer {
            margin-top: 12px !important;
            padding-top: 6px !important;
            font-size: 9px !important;
          }

          /* Asegurar colores en print */
          .quote-header,
          .quote-header *,
          th { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
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
            {/* Indicador de cotización activa */}
            {(quoteNumber || isNewQuote) && (
              <div style={{
                marginLeft: 16, paddingLeft: 16, borderLeft: '1px solid rgba(255,255,255,0.3)',
                display: 'flex', flexDirection: 'column', gap: 2
              }}>
                <div style={{ fontSize: 11, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {isNewQuote ? 'Nueva cotización' : 'Editando'}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {quoteNumber || '(sin guardar)'}
                  {hasUnsavedChanges && (
                    <span title="Cambios sin guardar" style={{
                      display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                      background: '#FBBF24'
                    }} />
                  )}
                </div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }} onClick={() => startNewQuote()}>
              <Plus size={16} /> Nueva
            </button>
            <button className="btn btn-accent" onClick={saveCurrentQuote}>
              <Save size={16} /> {currentQuoteId ? 'Guardar cambios' : 'Guardar'}
            </button>
            <button className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }} onClick={() => fileInputRef.current?.click()}>
              <Upload size={16} /> Importar
            </button>
            <input ref={fileInputRef} type="file" accept="application/json" onChange={importJSON} style={{ display: 'none' }} />
            <button className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }} onClick={exportJSON}>
              <Download size={16} /> Exportar
            </button>
            <button className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }} onClick={printQuote}>
              <Printer size={16} /> Imprimir
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

        {/* ========== TAB: MIS COTIZACIONES ========== */}
        {activeTab === 'cotizaciones' && (
          <QuotesListView
            savedQuotes={savedQuotes}
            currentQuoteId={currentQuoteId}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onOpen={loadQuoteById}
            onDuplicate={duplicateQuoteById}
            onDelete={deleteQuoteById}
            onChangeStatus={changeQuoteStatus}
            onNew={() => startNewQuote()}
          />
        )}

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

            {/* CONDICIONES COMERCIALES (editables) */}
            <div className="card">
              <div className="card-header" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText size={20} /> Condiciones comerciales
                </div>
                <button
                  className="btn btn-ghost"
                  style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.25)', padding: '6px 12px', fontSize: 12 }}
                  onClick={() => {
                    if (!confirm('¿Restablecer las condiciones a las predeterminadas? Se perderán los cambios actuales en esta sección.')) return;
                    setConditions(DEFAULT_CONDITIONS);
                  }}
                >
                  <RotateCcw size={14} /> Restablecer
                </button>
              </div>
              <div className="card-body">
                <p style={{ fontSize: 13, color: C.textLight, marginTop: 0, marginBottom: 14 }}>
                  Estas líneas aparecerán en la cotización entregada al cliente. Edítalas, agrega o elimina las que necesites para cada proyecto.
                </p>
                {conditions.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                    <div style={{ flex: 'none', marginTop: 10, color: C.textLight, fontWeight: 700, minWidth: 22, textAlign: 'right' }}>
                      {i + 1}.
                    </div>
                    <textarea
                      className="text-input"
                      rows={2}
                      value={c}
                      onChange={e => setConditions(conditions.map((x, idx) => idx === i ? e.target.value : x))}
                      style={{ flex: 1, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.4 }}
                    />
                    <button
                      className="btn btn-danger"
                      style={{ padding: '8px 10px', marginTop: 0 }}
                      onClick={() => {
                        if (conditions.length <= 1) {
                          alert('Debe haber al menos una condición.');
                          return;
                        }
                        setConditions(conditions.filter((_, idx) => idx !== i));
                      }}
                      title="Eliminar esta condición"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  className="btn btn-accent"
                  style={{ marginTop: 8 }}
                  onClick={() => setConditions([...conditions, 'Nueva condición...'])}
                >
                  <Plus size={14} /> Agregar condición
                </button>
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
            conditions={conditions}
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

function QuoteView({ project, grandTotal, subBeforeITBMS, itbmsCost, pricePerSqm, totalDays, itbmsRate, conditions = [] }) {
  const validUntil = new Date(project.date);
  validUntil.setDate(validUntil.getDate() + (project.validityDays || 0));

  return (
    <div className="card quote-card" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="quote-header" style={{ background: C.primary, color: 'white', padding: '32px 40px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div className="quote-header-left" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div className="quote-logo-box" style={{
              background: 'white', borderRadius: 12, padding: '12px 18px',
              display: 'flex', alignItems: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}>
              <img className="quote-logo-img" src="/logo.png" alt="ICOAT GROUP" style={{ height: 52, width: 'auto', display: 'block' }} />
            </div>
            <div className="quote-title">
              <div className="quote-title-main" style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>ICOAT GROUP</div>
              <div className="quote-title-sub" style={{ fontSize: 13, opacity: 0.85 }}>Soluciones en pisos epóxicos de alto desempeño</div>
            </div>
          </div>
          <div className="quote-number" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Cotización</div>
            <div className="quote-number-value" style={{ fontSize: 22, fontWeight: 800 }}>N° {project.date.replace(/-/g, '')}</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>Fecha: {project.date}</div>
          </div>
        </div>
      </div>

      <div className="quote-body" style={{ padding: 40 }}>
        <div className="quote-info" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 28, padding: 20, background: C.bg, borderRadius: 10, borderLeft: `4px solid ${C.accent}` }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Cliente</div>
            <div className="quote-info-value" style={{ fontSize: 18, fontWeight: 700, color: C.primary }}>{project.client || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Proyecto</div>
            <div className="quote-info-value" style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{project.name || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Ubicación</div>
            <div className="quote-info-value" style={{ fontSize: 16, color: C.text }}>{project.location || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Área a intervenir</div>
            <div className="quote-info-value" style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{num(project.area)} m²</div>
          </div>
        </div>

        <div className="quote-section" style={{ marginBottom: 28 }}>
          <h3 className="quote-section-title" style={{ fontSize: 16, fontWeight: 700, color: C.primary, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${C.accent}` }}>
            Descripción del trabajo
          </h3>
          <p className="quote-description" style={{ fontSize: 15, color: C.text, lineHeight: 1.6, margin: 0 }}>{project.description}</p>
        </div>

        <div className="quote-section" style={{ marginBottom: 28 }}>
          <h3 className="quote-section-title" style={{ fontSize: 16, fontWeight: 700, color: C.primary, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${C.accent}` }}>
            Alcance
          </h3>
          <table className="quote-scope-table" style={{ width: '100%' }}>
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

        <div className="quote-totals" style={{ marginBottom: 28, background: C.bg, padding: 24, borderRadius: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 15 }}>Subtotal</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{usd(subBeforeITBMS)}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 15 }}>ITBMS ({(itbmsRate * 100).toFixed(0)}%)</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{usd(itbmsCost)}</div>
          </div>
          <div className="quote-total-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0 4px', borderTop: `2px solid ${C.primary}`, marginTop: 6 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>TOTAL</div>
            <div className="quote-total-amount" style={{ fontSize: 28, fontWeight: 900, color: C.primary }}>{usd(grandTotal)}</div>
          </div>
        </div>

        <div className="quote-section quote-conditions" style={{ marginBottom: 24 }}>
          <h3 className="quote-section-title" style={{ fontSize: 16, fontWeight: 700, color: C.primary, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${C.accent}` }}>
            Condiciones comerciales
          </h3>
          <ul className="quote-conditions-list" style={{ fontSize: 14, color: C.text, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
            {conditions.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>

        <div className="quote-signatures" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 60, paddingTop: 24 }}>
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

        <div className="quote-footer" style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.textLight, textAlign: 'center' }}>
          ICOAT GROUP · Pisos Epóxicos · República de Panamá
        </div>
      </div>
    </div>
  );
}

// ========================================================
// Componente: Lista de cotizaciones guardadas
// ========================================================
function QuotesListView({
  savedQuotes, currentQuoteId, searchTerm, setSearchTerm,
  filterStatus, setFilterStatus, onOpen, onDuplicate, onDelete,
  onChangeStatus, onNew
}) {
  // Filtrar y ordenar
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return savedQuotes
      .filter(q => filterStatus === 'Todas' || q.status === filterStatus)
      .filter(q => {
        if (!term) return true;
        const client = (q.data?.project?.client || '').toLowerCase();
        const name = (q.data?.project?.name || '').toLowerCase();
        const number = (q.quoteNumber || '').toLowerCase();
        return client.includes(term) || name.includes(term) || number.includes(term);
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [savedQuotes, searchTerm, filterStatus]);

  const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('es-PA', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Stats
  const stats = useMemo(() => {
    const total = savedQuotes.length;
    const approved = savedQuotes.filter(q => q.status === 'Aprobada').length;
    const sent = savedQuotes.filter(q => q.status === 'Enviada').length;
    const totalAmount = savedQuotes
      .filter(q => q.status === 'Aprobada')
      .reduce((a, q) => a + (q.total || 0), 0);
    return { total, approved, sent, totalAmount };
  }, [savedQuotes]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stats arriba */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        <div className="stat-card">
          <div className="stat-label">Cotizaciones totales</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Enviadas</div>
          <div className="stat-value" style={{ color: '#1E40AF' }}>{stats.sent}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Aprobadas</div>
          <div className="stat-value" style={{ color: '#065F46' }}>{stats.approved}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total facturado (aprobadas)</div>
          <div className="stat-value">{usd(stats.totalAmount)}</div>
        </div>
      </div>

      {/* Barra de búsqueda y acciones */}
      <div className="card">
        <div className="card-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Database size={20} /> Mis Cotizaciones
          </div>
          <button className="btn btn-accent" onClick={onNew}>
            <Plus size={16} /> Nueva cotización
          </button>
        </div>
        <div className="card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textLight }} />
            <input
              className="text-input"
              style={{ paddingLeft: 36 }}
              placeholder="Buscar por cliente, proyecto o N° de cotización…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Todas', ...STATUS_OPTIONS].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  padding: '8px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600,
                  border: `1px solid ${filterStatus === s ? C.primary : C.border}`,
                  background: filterStatus === s ? C.primary : 'white',
                  color: filterStatus === s ? 'white' : C.text,
                  cursor: 'pointer',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de cotizaciones */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: 60, color: C.textLight }}>
            <AlertCircle size={48} style={{ opacity: 0.4, marginBottom: 12 }} />
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
              {savedQuotes.length === 0
                ? 'Aún no tienes cotizaciones guardadas'
                : 'No hay cotizaciones que coincidan con la búsqueda'}
            </div>
            <div style={{ fontSize: 14, marginBottom: 20 }}>
              {savedQuotes.length === 0
                ? 'Crea tu primera cotización para empezar.'
                : 'Prueba con otros términos o cambia el filtro de estado.'}
            </div>
            {savedQuotes.length === 0 && (
              <button className="btn btn-accent" onClick={onNew}>
                <Plus size={16} /> Crear primera cotización
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>N° Cotización</th>
                    <th>Cliente</th>
                    <th>Proyecto</th>
                    <th>Fecha</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                    <th style={{ textAlign: 'center' }}>Estado</th>
                    <th style={{ textAlign: 'center', width: 200 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(q => {
                    const isActive = q.id === currentQuoteId;
                    const statusStyle = STATUS_STYLE[q.status] || STATUS_STYLE['Borrador'];
                    const StatusIcon = statusStyle.icon;
                    return (
                      <tr key={q.id} style={isActive ? { background: '#FFF8E1' } : {}}>
                        <td>
                          <div style={{ fontWeight: 700, color: C.primary }}>{q.quoteNumber}</div>
                          {isActive && (
                            <div style={{ fontSize: 11, color: C.accent, fontWeight: 600 }}>
                              ● ACTIVA
                            </div>
                          )}
                        </td>
                        <td style={{ fontWeight: 600 }}>{q.data?.project?.client || '—'}</td>
                        <td style={{ color: C.textLight }}>{q.data?.project?.name || '—'}</td>
                        <td style={{ color: C.textLight, fontSize: 13 }}>
                          {formatDate(q.updatedAt)}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: C.primary }}>
                          {usd(q.total)}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <select
                            value={q.status}
                            onChange={e => onChangeStatus(q.id, e.target.value)}
                            style={{
                              padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700,
                              background: statusStyle.bg, color: statusStyle.color,
                              border: 'none', cursor: 'pointer', outline: 'none',
                            }}
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                            <button
                              className="btn btn-primary"
                              style={{ padding: '5px 10px', fontSize: 12 }}
                              onClick={() => onOpen(q.id)}
                              title="Abrir y editar"
                            >
                              <FolderOpen size={13} /> Abrir
                            </button>
                            <button
                              className="btn btn-ghost"
                              style={{ padding: '5px 10px', fontSize: 12 }}
                              onClick={() => onDuplicate(q.id)}
                              title="Duplicar"
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              className="btn btn-danger"
                              style={{ padding: '5px 10px', fontSize: 12 }}
                              onClick={() => onDelete(q.id)}
                              title="Eliminar"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div style={{ fontSize: 12, color: C.textLight, padding: '0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Info size={14} />
        Las cotizaciones se guardan en este navegador. Para hacer un respaldo, usa el botón "Exportar" del encabezado.
      </div>
    </div>
  );
}
