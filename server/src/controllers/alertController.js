const dataStore = require('../services/dataStoreService');

async function getAlerts(req, res, next) {
  try {
    let { page = 1, limit = 20, search = '', severity = '', status = '', sort = 'created_at', order = 'desc' } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let filtered = [...dataStore.alerts];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(a => 
        (a.tx_hash && a.tx_hash.toLowerCase().includes(q)) ||
        (a.wallet_address && a.wallet_address.toLowerCase().includes(q)) ||
        a.description.toLowerCase().includes(q) ||
        a.alert_type.toLowerCase().includes(q)
      );
    }

    if (severity) {
      filtered = filtered.filter(a => a.severity.toUpperCase() === severity.toUpperCase());
    }

    if (status) {
      filtered = filtered.filter(a => a.status.toUpperCase() === status.toUpperCase());
    }

    filtered.sort((a, b) => {
      let valA = a[sort] || a.created_at;
      let valB = b[sort] || b.created_at;

      if (sort === 'created_at') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return res.json({
      success: true,
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getAlertById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const alert = dataStore.alerts.find(a => a.id === id);

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    const notes = dataStore.investigationNotes.filter(n => n.alert_id === id);
    const relatedTx = dataStore.transactions.find(t => t.tx_hash === alert.tx_hash);

    return res.json({
      success: true,
      alert: {
        ...alert,
        notes,
        related_transaction: relatedTx || null
      }
    });
  } catch (err) {
    next(err);
  }
}

async function updateAlertStatus(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const alert = dataStore.alerts.find(a => a.id === id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    if (!['NEW', 'ACKNOWLEDGED', 'INVESTIGATING', 'RESOLVED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    alert.status = status;
    alert.updated_at = new Date().toISOString();

    return res.json({ success: true, message: 'Alert status updated successfully', alert });
  } catch (err) {
    next(err);
  }
}

async function assignAlert(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const { assigned_to, assigned_user } = req.body;

    const alert = dataStore.alerts.find(a => a.id === id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    alert.assigned_to = assigned_to || 2;
    alert.assigned_user = assigned_user || 'Lead Security Analyst';
    alert.updated_at = new Date().toISOString();

    return res.json({ success: true, message: 'Alert assignment updated', alert });
  } catch (err) {
    next(err);
  }
}

async function addAlertNote(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const { note, user_name = 'Security Analyst' } = req.body;

    if (!note) {
      return res.status(400).json({ success: false, message: 'Note text required' });
    }

    const newNote = {
      id: dataStore.investigationNotes.length + 1,
      alert_id: id,
      user_id: req.user ? req.user.id : 2,
      user_name: req.user ? req.user.name : user_name,
      note,
      created_at: new Date().toISOString()
    };

    dataStore.investigationNotes.push(newNote);

    return res.status(201).json({ success: true, note: newNote });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAlerts,
  getAlertById,
  updateAlertStatus,
  assignAlert,
  addAlertNote
};
