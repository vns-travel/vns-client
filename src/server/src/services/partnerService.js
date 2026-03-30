const partnerRepo      = require('../repositories/partnerRepo');
const notificationService = require('./notificationService');

async function getMyProfile(userId) {
  const partner = await partnerRepo.findByUserId(userId);
  if (!partner) throw new Error('Partner profile not found');
  const documents = await partnerRepo.getDocuments(partner.id);
  return { partner, documents };
}

async function updateMyProfile(userId, fields) {
  const partner = await partnerRepo.findByUserId(userId);
  if (!partner) throw new Error('Partner profile not found');

  // Map camelCase payload keys to snake_case DB columns
  const dbFields = {};
  if (fields.businessName !== undefined) dbFields.business_name = fields.businessName;
  if (fields.businessType !== undefined) dbFields.business_type = fields.businessType;
  if (fields.taxCode      !== undefined) dbFields.tax_code      = fields.taxCode;
  if (fields.address      !== undefined) dbFields.address       = fields.address;
  if (fields.city         !== undefined) dbFields.city          = fields.city;
  if (fields.description  !== undefined) dbFields.description   = fields.description;

  const updated = await partnerRepo.updateProfile(partner.id, dbFields);
  return updated;
}

async function uploadDocuments(userId, documents) {
  const partner = await partnerRepo.findByUserId(userId);
  if (!partner) throw new Error('Partner profile not found');

  // Approved partners lock in their document set — prevents document swaps after approval
  if (partner.verify_status === 'approved') {
    throw new Error('Approved partners cannot re-upload documents');
  }

  const saved = await partnerRepo.addDocuments(partner.id, documents);

  // Transition pending → reviewing once documents arrive
  if (partner.verify_status === 'pending') {
    await partnerRepo.updateVerifyStatus(partner.id, {
      verifyStatus:    'reviewing',
      rejectionReason: null,
      verifiedAt:      null,
    });
  }

  return { message: 'Documents uploaded successfully', documents: saved };
}

async function getAllPartners(filters) {
  const limit  = parseInt(filters.limit  || 20, 10);
  const offset = parseInt(filters.offset || 0,  10);

  const partners = await partnerRepo.findAll({
    verifyStatus: filters.verifyStatus || null,
    city:         filters.city         || null,
    limit,
    offset,
  });

  // Attach documents to each partner profile
  const withDocs = await Promise.all(
    partners.map(async (p) => ({
      ...p,
      documents: await partnerRepo.getDocuments(p.id),
    }))
  );

  return { partners: withDocs, total: withDocs.length };
}

async function getPartnerById(partnerId) {
  const partner = await partnerRepo.findById(partnerId);
  if (!partner) throw new Error('Partner not found');
  const documents = await partnerRepo.getDocuments(partner.id);
  return { partner, documents };
}

async function approvePartner(partnerId) {
  const partner = await partnerRepo.findById(partnerId);
  if (!partner) throw new Error('Partner not found');

  if (partner.verify_status !== 'reviewing') {
    throw new Error('Partner is not in reviewing status');
  }

  const updated = await partnerRepo.updateVerifyStatus(partnerId, {
    verifyStatus: 'approved',
    verifiedAt:   new Date(),
  });

  // Non-blocking — notification failure must not rollback the approval
  await notificationService.send(
    partner.user_id,
    'Account Approved',
    'Your partner account has been approved. You can now list your services.',
    'system',
    partnerId
  );

  return { message: 'Partner approved successfully', partner: updated };
}

async function rejectPartner(partnerId, reason) {
  const partner = await partnerRepo.findById(partnerId);
  if (!partner) throw new Error('Partner not found');

  if (partner.verify_status === 'approved' || partner.verify_status === 'rejected') {
    throw new Error('Partner is not in a rejectable status');
  }

  const updated = await partnerRepo.updateVerifyStatus(partnerId, {
    verifyStatus:    'rejected',
    rejectionReason: reason,
  });

  await notificationService.send(
    partner.user_id,
    'Account Verification Failed',
    `Your application was not approved. Reason: ${reason}`,
    'system',
    partnerId
  );

  return { message: 'Partner rejected', partner: updated };
}

module.exports = {
  getMyProfile,
  updateMyProfile,
  uploadDocuments,
  getAllPartners,
  getPartnerById,
  approvePartner,
  rejectPartner,
};
