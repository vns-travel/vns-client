const { pool } = require('../../config/db');

// Map integer serviceType codes (sent by frontend) to the DB text CHECK values.
// 'car_rental' can also be passed as a string directly.
const TYPE_MAP = { 0: 'homestay', 1: 'tour', 2: 'car_rental' };

function resolveType(serviceType) {
  if (typeof serviceType === 'string') return serviceType; // 'car_rental', 'tour', etc.
  return TYPE_MAP[serviceType] ?? null;
}

// Reverse-map DB text → integer for the frontend (SERVICE_TYPE[n] lookups in React).
const TYPE_INT_MAP = { homestay: 0, tour: 1, car_rental: 2 };

/**
 * Create a service record (and optionally a tours child record in the same transaction).
 * Returns { serviceId } for non-tour types, or { serviceId, tourId } for tours.
 * Tours are created with status='pending' immediately (no separate submit step).
 * All other types default to status='draft'.
 */
async function createService({ partnerId, serviceType, title, city, address, description, tourDetails }) {
  const typeStr = resolveType(serviceType);
  const isTour = typeStr === 'tour' && tourDetails;
  // Tours go straight to pending so the manager can review; other types need explicit submit.
  const status = isTour ? 'pending' : 'draft';

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const svcRes = await client.query(
      `INSERT INTO services (partner_id, type, title, description, city, address, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [partnerId, typeStr, title, description ?? null, city ?? null, address ?? null, status]
    );
    const serviceId = svcRes.rows[0].id;

    let tourId = null;
    if (isTour) {
      const tourRes = await client.query(
        `INSERT INTO tours (service_id, duration_hours, max_capacity, cancellation_policy)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [
          serviceId,
          tourDetails.durationHours ?? null,
          tourDetails.maxParticipants ?? null,
          tourDetails.cancellationPolicy ?? null,
        ]
      );
      tourId = tourRes.rows[0].id;
    }

    await client.query('COMMIT');
    return tourId ? { serviceId, tourId } : { serviceId };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Transition a service from draft → pending (submit for manager review).
 * Only the owning partner may submit. Throws on ownership mismatch or wrong status.
 */
async function submitService({ serviceId, partnerId }) {
  const { rows } = await pool.query(
    `SELECT id, partner_id, status FROM services WHERE id = $1`,
    [serviceId]
  );

  if (!rows.length) {
    const err = new Error('Dịch vụ không tồn tại');
    err.statusCode = 404;
    throw err;
  }

  if (rows[0].partner_id !== partnerId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }

  if (rows[0].status !== 'draft') {
    const err = new Error(`Không thể gửi duyệt từ trạng thái '${rows[0].status}'`);
    err.statusCode = 400;
    throw err;
  }

  await pool.query(
    `UPDATE services SET status = 'pending', updated_at = NOW() WHERE id = $1`,
    [serviceId]
  );
}

/**
 * List all services owned by the given partner.
 * Returns an array shaped for the React partner dashboard (camelCase, integer serviceType).
 */
async function listPartnerServices(partnerId) {
  const { rows } = await pool.query(
    `SELECT s.id, s.type, s.title, s.description, s.city, s.address,
            s.status, s.avg_rating, s.review_count, s.created_at, s.updated_at
     FROM services s
     WHERE s.partner_id = $1
     ORDER BY COALESCE(s.updated_at, s.created_at) DESC`,
    [partnerId]
  );

  return rows.map((r) => ({
    serviceId: r.id,
    serviceType: TYPE_INT_MAP[r.type] ?? 2,
    title: r.title,
    description: r.description,
    location: r.city || r.address || '',
    city: r.city,
    address: r.address,
    status: r.status,
    averageRating: r.avg_rating ? Number(r.avg_rating) : 0,
    reviewCount: r.review_count,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    images: [],
  }));
}

/**
 * Fetch a single service by ID, including its images.
 * Returns null if not found. Ownership is NOT enforced here — callers may use
 * this for public detail pages too; controllers add ownership checks where needed.
 */
async function getServiceById(serviceId) {
  const { rows } = await pool.query(
    `SELECT s.id, s.type, s.title, s.description, s.city, s.address,
            s.status, s.avg_rating, s.review_count, s.created_at, s.updated_at,
            s.partner_id,
            COALESCE(
              json_agg(si.url ORDER BY si.sort_order) FILTER (WHERE si.id IS NOT NULL),
              '[]'
            ) AS images
     FROM services s
     LEFT JOIN service_images si ON si.service_id = s.id
     WHERE s.id = $1
     GROUP BY s.id`,
    [serviceId]
  );

  if (!rows.length) return null;
  const r = rows[0];
  return {
    serviceId: r.id,
    partnerId: r.partner_id,
    serviceType: TYPE_INT_MAP[r.type] ?? 2,
    title: r.title,
    description: r.description,
    city: r.city,
    address: r.address,
    location: r.city || r.address || '',
    status: r.status,
    averageRating: r.avg_rating ? Number(r.avg_rating) : 0,
    reviewCount: r.review_count,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    images: r.images,
  };
}

/**
 * Update editable fields on a service owned by the partner.
 * Only allowed when status is 'draft' or 'rejected' — approved/pending services
 * must be withdrawn before editing to avoid live listings changing silently.
 */
async function updateService({ serviceId, partnerId, title, description, city, address }) {
  const { rows } = await pool.query(
    `SELECT id, partner_id, status FROM services WHERE id = $1`,
    [serviceId]
  );

  if (!rows.length) {
    const err = new Error('Dịch vụ không tồn tại');
    err.statusCode = 404;
    throw err;
  }
  if (rows[0].partner_id !== partnerId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }
  if (!['draft', 'rejected'].includes(rows[0].status)) {
    const err = new Error(`Không thể chỉnh sửa dịch vụ ở trạng thái '${rows[0].status}'`);
    err.statusCode = 400;
    throw err;
  }

  const { rows: updated } = await pool.query(
    `UPDATE services
     SET title = $1, description = $2, city = $3, address = $4, updated_at = NOW()
     WHERE id = $5
     RETURNING id, title, description, city, address, updated_at`,
    [title, description ?? null, city ?? null, address ?? null, serviceId]
  );
  return updated[0];
}

/**
 * Hard-delete a service owned by the partner.
 * Only draft services may be deleted — once submitted they enter the approval
 * workflow and must be rejected before the partner can remove them.
 */
async function deleteService({ serviceId, partnerId }) {
  const { rows } = await pool.query(
    `SELECT id, partner_id, status FROM services WHERE id = $1`,
    [serviceId]
  );

  if (!rows.length) {
    const err = new Error('Dịch vụ không tồn tại');
    err.statusCode = 404;
    throw err;
  }
  if (rows[0].partner_id !== partnerId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }
  if (rows[0].status !== 'draft') {
    const err = new Error(`Chỉ có thể xóa dịch vụ ở trạng thái 'draft'`);
    err.statusCode = 400;
    throw err;
  }

  await pool.query(`DELETE FROM services WHERE id = $1`, [serviceId]);
}

module.exports = { createService, submitService, listPartnerServices, getServiceById, updateService, deleteService };
