-- Each uploaded document has its own approval status.
-- 'pending'  → uploaded, awaiting manager review
-- 'approved' → manager verified this document
-- 'rejected' → manager rejected this document
ALTER TABLE partner_documents
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';
