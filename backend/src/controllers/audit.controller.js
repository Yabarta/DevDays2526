import auditService from '../services/audit.services.js';

export const getAllAudits = async (req, res) => {
 try {
  const audits = await auditService.getAllAudits();
  res.status(200).json(audits);
 } catch (error) {
  res.status(500).json({ message: 'Internal server error' });
 }
};

export const getAuditById = async (req, res) => {
 const auditId = req.params.auditId;
 try {
  const audit = await auditService.getAuditById(auditId);
  if (!audit) {
   return res.status(404).json({ message: 'Audit not found' });
  }
  res.status(200).json(audit);
 } catch (error) {
  res.status(500).json({ message: 'Internal server error' });
 }
};

export const auditIssues = async (req, res) => {
 try {
  const githubIssues = await auditService.auditIssues();
  res.status(200).json(githubIssues);
 } catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
 }
};