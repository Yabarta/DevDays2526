import { Router } from "express";
import { getAllAudits, getAuditById, auditIssues } from "../controllers/audit.controller.js";

const auditRouter = Router();

auditRouter.get('/audits', getAllAudits);
auditRouter.get('/audits/:auditId', getAuditById);
auditRouter.post('/audits/issues', auditIssues);

export { auditRouter };